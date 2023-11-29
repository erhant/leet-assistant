import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import { setupRAG } from "../util/langchain";
import { Signal, UserAction } from "firstbatch";
import { setupFirstBatch } from "../util/firstbatch";
import constants from "../constants";
import { SessionType } from "../types";
import { connectPinecone } from "../util/pinecone";

const ErrInvalidSession = new Error("Invalid session.");

const Actions = {
  Solved: new UserAction(new Signal("SOLVED", 1.2)),
  TryAgain: new UserAction(new Signal("TRY_AGAIN", 1.2)),
  Failed: new UserAction(new Signal("FAILED", 1.2)),
};

async function startServer() {
  console.log("Setting up LangChain.");
  const { chain } = await setupRAG();
  console.log("Connecting to Pinecone.");
  const index = await connectPinecone();
  console.log("Setting up FirstBatch SDK.");
  const personalized = await setupFirstBatch(index);

  console.log("FirstBatch TeamID:", personalized.teamId);

  const app = new Elysia()
    ///////////////  plugins  \\\\\\\\\\\\\\\
    .use(cors())
    .use(logger({ level: "debug" }))
    ///////////////   state   \\\\\\\\\\\\\\\
    .state("sessions", {} as SessionType)
    // .onError(({ code, error, log }) => {
    //   log.error({ code, error: error.toString() });
    //   return new Response(error.toString());
    // })
    /////////////// endpoints \\\\\\\\\\\\\\\
    .post(
      "/new-session",
      // creates a new user embedding session
      async ({ store: { sessions }, log }) => {
        const session = await personalized.session("SIMPLE", constants.FIRSTBATCH.VECTORDB_ID, {
          customId: constants.FIRSTBATCH.ALGORITHM_ID,
        });
        sessions[session.id] = {
          sdkSession: session,
          chatHistory: [],
        };

        log.info("Created session:", session.id);
        return { sessionId: session.id };
      },
    )
    .post(
      "/get-session",
      // returns the user session
      ({ body: { sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          return ErrInvalidSession;
        }
        const session = sessions[sessionId];
        return { session };
      },
      { body: t.Object({ sessionId: t.String() }) },
    )
    .post(
      "/prompt",
      // simple ChatGPT integration with RAG
      async ({ body: { prompt, sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          console.log("invalid session");
          return ErrInvalidSession;
        }
        const session = sessions[sessionId];
        try {
          const context = await personalized.batch(session.sdkSession, {
            batchSize: 10,
          });
          console.log(context);
        } catch (err) {
          console.error(err);
          throw err;
        }

        const response = await chain.invoke({
          chatHistory: session.chatHistory,
          context: [],
          question: prompt,
        });

        // store the response in user history
        session.chatHistory.push([prompt, response]);

        return response;
      },
      {
        body: t.Object({
          prompt: t.String(),
          sessionId: t.String(),
        }),
      },
    )
    .post(
      "/batch",
      // returns a new item from the dataset w.r.t user embeddings
      async ({ body: { sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          return ErrInvalidSession;
        }

        const batches = await personalized.batch(sessions[sessionId].sdkSession);
        return { batches };
      },
      { body: t.Object({ sessionId: t.String() }) },
    )
    .post(
      "/signal",
      // signals a navigation within the user embeddings space
      async ({ body: { signal, contentId, sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          return ErrInvalidSession;
        }
        const session = sessions[sessionId];

        let ok = false;
        switch (signal) {
          case "solved": {
            ok = await personalized.addSignal(session.sdkSession, Actions.Solved, contentId);
            break;
          }
          case "try-again": {
            ok = await personalized.addSignal(session.sdkSession, Actions.TryAgain, contentId);
            break;
          }
          case "failed": {
            ok = await personalized.addSignal(session.sdkSession, Actions.Failed, contentId);
            break;
          }
          default:
            // Elysia validates stuff so we dont expect to get here anyway
            signal satisfies never;
            return new Error("Unknown signal.");
        }

        return ok;
      },
      {
        body: t.Object({
          sessionId: t.String(),
          contentId: t.String(),
          signal: t.Union([t.Literal("solved"), t.Literal("try-again"), t.Literal("failed")]),
        }),
      },
    )
    .listen(Bun.env.ELYSIA_PORT || 8080);

  return app;
}

startServer().then((app) => {
  console.log(`Listening at ${app.server?.hostname}:${app.server?.port}`);
});
