import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import chalk from "chalk";

import constants from "./constants";
import errors from "./errors";
import { format, setupPrerequisites } from "./util/";
import { tSignalType } from "./types";
import type { SessionType, SignalType, QuestionBatch } from "./types";

// TODO: make the session check a common middleware or something

export async function startServer() {
  const { chain, index, personalized } = await setupPrerequisites();

  const app = new Elysia()
    ///////////////  plugins  \\\\\\\\\\\\\\\
    .use(cors())
    .use(
      logger({
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: { colorize: true, sync: true },
        },
      }),
      // TODO: use Gingonic style logging?
      // TIME | CODE | respTime | method /url
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

        const batch = (await personalized.batch(session.sdkSession)) as QuestionBatch;
        return { batch };
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

        let ok = false;
        signal satisfies SignalType;
        switch (signal) {
          case "solve": {
            ok = await personalized.addSignal(sdkSession, constants.ACTIONS.SOLVE, contentId);
            break;
          }
          case "retry": {
            ok = await personalized.addSignal(sdkSession, constants.ACTIONS.RETRY, contentId);
            break;
          }
          case "fail": {
            ok = await personalized.addSignal(sdkSession, constants.ACTIONS.FAIL, contentId);
            break;
          }
          default:
            // Elysia validates stuff so we dont expect to get here anyway
            signal satisfies never;
            throw errors.InvalidSignal;
        }

        return ok;
      },
      {
        body: t.Object({
          sessionId: t.String(),
          contentId: t.String(),
          signal: tSignalType,
        }),
      },
    )
    .listen(Bun.env.ELYSIA_PORT || 8080);

  return app;
}

export type ServerType = Awaited<ReturnType<typeof startServer>>;

if (import.meta.main) {
  startServer().then((app) => {
    console.log(chalk.green(`Listening at ${app.server?.hostname}:${app.server?.port}\n`));
  });
}
