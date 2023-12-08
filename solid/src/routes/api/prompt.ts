import { APIEvent, json } from "solid-start";
import { read } from "~/api/state";
import { format, setupRAG } from "~/api/util";

export async function POST({ request }: APIEvent) {
  const { chain } = await setupRAG();

  const body = await request.json();
  const session = await read(request, body.sessionId);

  // ignore ids (as _) because they are also within the metadata
  const [_, metadata] = session.lastBatch;

  const response = await chain.invoke({
    // chatHistory: session.chatHistory,
    context: metadata,
    prompt: body.prompt,
  });

  // store the response in user history FIXME: remove this part
  const userPromptFormatted = format.prompt(body.prompt);
  // session.chatHistory.push(userPromptFormatted, response);

  return json([userPromptFormatted, response] as const);
}
