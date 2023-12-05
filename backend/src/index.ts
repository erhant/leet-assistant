import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import chalk from "chalk";

import constants from "./constants";
import errors from "./errors";
import { format, setupPrerequisites } from "./util/";
import { tSignalType } from "./types";
import type { SessionType, SignalType, QuestionBatch } from "./types";
import pretty from "pino-pretty";

// TODO: make the session check a common middleware or something

export async function startServer() {
  const { chain, personalized } = await setupPrerequisites();

  const pinoPretty = pretty({
    colorize: true,
  });
  const app = new Elysia()
    ///////////////  plugins  \\\\\\\\\\\\\\\
    .use(cors())
    .use(
      logger({
        level: "debug",
        stream: pinoPretty,
      }),
    )
    ///////////////   state   \\\\\\\\\\\\\\\
    .state("sessions", {} as SessionType)
    /////////////// endpoints \\\\\\\\\\\\\\\
    // creates a new user embedding session
    .post("/new-session", async ({ store: { sessions } }) => {
      const session = await personalized.session(
        constants.FIRSTBATCH.ALGORITHM_NAME,
        constants.FIRSTBATCH.VECTORDB_ID,
        {
          customId: constants.FIRSTBATCH.ALGORITHM_ID,
        },
      );
      sessions[session.id] = {
        sdkSession: session,
        chatHistory: [],
      };

      console.log(chalk.gray("Created session:", session.id));
      return { sessionId: session.id };
    })
    // returns the user session
    .post(
      "/get-session",
      ({ body: { sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          throw errors.InvalidSession;
        }
        const session = sessions[sessionId];
        return { session };
      },
      { body: t.Object({ sessionId: t.String() }) },
    )
    // chatgpt integration with RAG
    .post(
      "/prompt",
      async ({ body: { prompt, sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          throw errors.InvalidSession;
        }
        const session = sessions[sessionId];

        const [_, metadata] = (await personalized.batch(session.sdkSession)) as QuestionBatch;
        const response = await chain.invoke({
          chatHistory: session.chatHistory,
          context: metadata,
          prompt,
        });

        // store the response in user history
        const userPromptFormatted = format.prompt(prompt);
        session.chatHistory.push([format.prompt(prompt), response]);
        return [userPromptFormatted, response] as const;
      },
      {
        body: t.Object({
          prompt: t.Union([t.Literal("describe"), t.Literal("consult")]),
          sessionId: t.String(),
        }),
      },
    )
    // gets a new question
    .post(
      "/batch",
      async ({ body: { sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          throw errors.InvalidSession;
        }
        const session = sessions[sessionId];

        try {
          const batch = (await personalized.batch(session.sdkSession)) as QuestionBatch;
          return { batch };
        } catch (err) {
          // console.error(err);
          throw err;
        }
      },
      { body: t.Object({ sessionId: t.String() }) },
    )
    // signals a navigation within the user embeddings space
    .post(
      "/signal",
      async ({ body: { signal, contentId, sessionId }, store: { sessions } }) => {
        if (!(sessionId in sessions)) {
          throw errors.InvalidSession;
        }
        const session = sessions[sessionId];
        const sdkSession = session.sdkSession;

        if (!(signal in constants.ACTIONS)) {
          throw errors.InvalidSignal;
        }

        const ok = await personalized.addSignal(sdkSession, constants.ACTIONS[signal], contentId);
        if (!ok) {
          throw errors.AddSignalFailed;
        }
      },
      {
        body: t.Object({
          sessionId: t.String(),
          contentId: t.String(),
          signal: tSignalType,
        }),
      },
    )
    .listen(constants.SERVER.PORT);

  return app;
}

export type ServerType = Awaited<ReturnType<typeof startServer>>;

if (import.meta.main) {
  startServer().then((app) => {
    console.log(chalk.green(`Listening at ${app.server?.hostname}:${app.server?.port}\n`));
  });
}
