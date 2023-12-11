import { json } from "solid-start";
import constants from "~/api/constants";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import type { EndpointSession } from "~/api/types";

/** Create a new personalized session. */
export async function POST() {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);

  const session = await personalized.session(constants.FIRSTBATCH.ALGORITHM_NAME, constants.FIRSTBATCH.VECTORDB_ID, {
    customId: constants.FIRSTBATCH.ALGORITHM_ID,
  });

  return json(session satisfies EndpointSession["res"]);
}
