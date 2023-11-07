import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { setupRAG } from "../util/openai";

async function startServer() {
  const { model, chain } = await setupRAG();

  const app = new Elysia()
    .use(cors())
    .get(
      "/prompt",
      // simple ChatGPT integration
      async ({ query: { prompt } }) => {
        return await model.invoke(prompt).then((r) => r.content);
      },
      {
        query: t.Object({
          prompt: t.String(),
        }),
      }
    )
    .get(
      "/rag",
      // simple ChatGPT integration with RAG
      async ({ query: { prompt } }) => {
        return await chain.invoke(prompt);
      },
      {
        query: t.Object({
          prompt: t.String(),
        }),
      }
    )
    // simple JSON response
    .get("/hi", () => ({
      response: "bye",
    }))
    .post("/batch", () => {
      // TODO: SDK batch request
    })
    .post("/signal", () => {
      // TODO: SDK signal
    })
    .listen(Bun.env.ELYSIA_PORT || 8080);

  return app;
}

startServer().then((app) => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});
