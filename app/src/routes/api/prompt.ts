import { APIEvent, json } from "solid-start";
import { connectPinecone, format, setupRAG } from "~/api/util";
import type { EndpointPrompt } from "~/api/types";

/** Make a prompt to ChatGPT. */
export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const { chain } = await setupRAG();

  const { ids, prompt } = (await request.json()) as EndpointPrompt["req"];

  // fetch questions by ids from Pinecone
  const questions = await index.fetch(ids);
  const context = Object.values(questions.records!).map((q) => q.metadata!);

  const response = await chain.invoke({ context, prompt });

  const userPromptFormatted = format.prompt(prompt);
  return json([userPromptFormatted, response] satisfies EndpointPrompt["res"]);
}
