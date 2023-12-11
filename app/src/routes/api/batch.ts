import { APIEvent, json } from "solid-start";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import type { EndpointBatch } from "~/api/types";
import type { QuestionBatch } from "~/types";

/** Make a batch request to the SDK to retrieve personalized questions. */
export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);
  const { session } = (await request.json()) as EndpointBatch["req"];

  const batch = (await personalized.batch(session)) as QuestionBatch;

  return json(batch[1] satisfies EndpointBatch["res"]);
}
