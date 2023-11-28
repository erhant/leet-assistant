import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import { setupRAG } from "../util/langchain";
import { Signal, UserAction } from "firstbatch";
import { setupFirstBatch } from "../util/firstbatch";
import constants from "../constants";

const ErrInvalidSession = new Error("Invalid session.");

const Actions = {
  Solved: new UserAction(new Signal("SOLVED", 1.2)),
  TryAgain: new UserAction(new Signal("TRY_AGAIN", 1.2)),
  Failed: new UserAction(new Signal("FAILED", 1.2)),
};

async function startServer() {
  const { chain } = await setupRAG();
  const personalized = await setupFirstBatch();
  console.log("FirstBatch TeamID:", personalized.teamId);

  const app = new Elysia()
    ///////////////  plugins  \\\\\\\\\\\\\\\
    .use(cors())
    .use(logger({ level: "debug" }))
    ///////////////   state   \\\\\\\\\\\\\\\
    .state("sessions", {} as Record<string, Awaited<ReturnType<typeof personalized.session>>>)
    /////////////// endpoints \\\\\\\\\\\\\\\
    .post(
      "/new-session",
      // creates a new user embedding session
      async ({ store: { sessions }, log }) => {
        const session = await personalized.session("CUSTOM", constants.FIRSTBATCH.VECTORDB_ID, {
          customId: constants.FIRSTBATCH.ALGORITHM_ID,
        });
        sessions[session.id] = session;

        log.info("Created session:", session.id);
        return { sessionId: session.id };
      },
    )
    .post(
      "/prompt",
      // simple ChatGPT integration with RAG
      async ({ query: { prompt, sessionId }, store: { sessions }, log }) => {
        if (!(sessionId in sessions)) {
          return ErrInvalidSession;
        }
        return await chain.invoke(prompt);
      },
      {
        query: t.Object({
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

        const batches = await personalized.batch(sessions[sessionId]);
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
            ok = await personalized.addSignal(session, Actions.Solved, contentId);
            break;
          }
          case "try-again": {
            ok = await personalized.addSignal(session, Actions.TryAgain, contentId);
            break;
          }
          case "failed": {
            ok = await personalized.addSignal(session, Actions.Failed, contentId);
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
          signal: t.Union([t.Literal("solved"), t.Literal("try-again"), t.Literal("failed")]),
          contentId: t.String(),
          sessionId: t.String(),
        }),
      },
    )
    .listen(Bun.env.ELYSIA_PORT || 8080);

  return app;
}

startServer().then((app) => {
  console.log(`Listening at ${app.server?.hostname}:${app.server?.port}`);
});
