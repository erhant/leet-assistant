import { APIEvent, json } from "solid-start";
import constants from "~/api/constants";
import { read } from "~/api/state";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import { QuestionBatch } from "~/types";

export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);
  const body = await request.json();

  const batch = (await personalized.batch({ id: body.sessionId, isPersistent: false })) as QuestionBatch;

  // TODO

  return json(batch);
}
