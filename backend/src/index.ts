import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import OpenAI from "openai"; // TODO: use langchain https://js.langchain.com/docs/expression_language/cookbook/retrieval

const openai = new OpenAI({
  apiKey: Bun.env.OPENAI_APIKEY,
});

const app = new Elysia()
  .use(cors())
  .get("/", () => "im still setting up")
  .get(
    "/hi",
    () =>
      new Response(
        JSON.stringify({
          response: "bye",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
  )
  .post("/batch", (req) => {})
  .listen(Bun.env.ELYSIA_PORT || 3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
