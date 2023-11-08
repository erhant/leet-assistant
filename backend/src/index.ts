import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { logger } from "@bogeychan/elysia-logger";
import { setupRAG } from "../util/openai";

async function startServer() {
  const { model, chain } = await setupRAG();

  const app = new Elysia()
    // plugins
    .use(cors())
    .use(
      logger({
        level: "debug",
      })
    )
    .post(
      "/prompt",
      // simple ChatGPT integration with RAG
      async ({ query: { prompt, history }, log }) => {
        log.info("[POST] RAG");
        return await chain.invoke(prompt);
      },
      {
        query: t.Object({
          prompt: t.String(),
          history: t.Array(t.String()),
        }),
      }
    )
    .post(
      "/batch",
      ({ body: { sessionId } }) => {
        // TODO: implement batch
      },
      {
        body: t.Object({
          sessionId: t.String(),
        }),
      }
    )
    .post(
      "/signal",
      ({ body: { signal, ids, sessionId } }) => {
        // TODO: implement signal
        switch (signal) {
          case "solved": {
            break;
          }
          case "try-again": {
            break;
          }
          case "failed": {
            break;
          }
          default:
            signal satisfies never;
            // Elysia should validate so we dont expect this to throw anyways
            return new Error("Unknown signal.");
        }
      },
      {
        body: t.Object({
          signal: t.Union([
            t.Literal("solved"),
            t.Literal("try-again"),
            t.Literal("failed"),
          ]),
          ids: t.Array(t.String()),
          sessionId: t.String(),
        }),
      }
    )
    .listen(Bun.env.ELYSIA_PORT || 8080);

  return app;
}

startServer().then((app) => {
  console.log(`Listening at ${app.server?.hostname}:${app.server?.port}`);
});
