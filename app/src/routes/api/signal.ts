import { APIEvent, json } from "solid-start";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import constants from "~/api/constants";
import type { EndpointSignal } from "~/api/types";

/** Signal a user action within the user embedding space. */
export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);

  const { session, signal, contentId } = (await request.json()) as EndpointSignal["req"];

  if (!(signal in constants.ACTIONS)) {
    throw new Error("Invalid signal.");
  }

  const action = constants.ACTIONS[signal];
  const ok = await personalized.addSignal(session, action, contentId);
  if (!ok) {
    throw new Error("Failed to add signal.");
  }

  return json({ ok } satisfies EndpointSignal["res"]);
}
