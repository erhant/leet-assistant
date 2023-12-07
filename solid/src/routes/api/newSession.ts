import { APIEvent, json } from "solid-start";
import constants from "~/api/constants";
import { write } from "~/api/state";
import { connectPinecone, setupFirstBatch } from "~/api/util";

export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);

  const session = await personalized.session(constants.FIRSTBATCH.ALGORITHM_NAME, constants.FIRSTBATCH.VECTORDB_ID);

  const cookie = await write(request, session.id, { hi: 123 });
  return json(session, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
