import { APIEvent, json } from "solid-start";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import constants from "~/api/constants";
import errors from "~/api/errors";
import type { EndpointSignal } from "~/api/types";

export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);

  const { session, signal, contentId } = (await request.json()) as EndpointSignal["req"];

  if (!(signal in constants.ACTIONS)) {
    throw errors.InvalidSignal;
  }

  const ok = await personalized.addSignal(session, constants.ACTIONS[signal], contentId);
  if (!ok) {
    throw errors.AddSignalFailed;
  }

  return json({ ok } satisfies EndpointSignal["res"]);
}
