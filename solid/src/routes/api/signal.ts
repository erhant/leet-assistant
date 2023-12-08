import { APIEvent, json } from "solid-start";
import { read } from "~/api/state";
import { connectPinecone, setupFirstBatch } from "~/api/util";
import constants from "~/api/constants";
import { SignalType } from "~/types";
import errors from "~/api/errors";

export async function POST({ request }: APIEvent) {
  const index = await connectPinecone();
  const personalized = await setupFirstBatch(index);
  const body = await request.json();

  const session = await read(request, body.sessionId);
  const signal = body.signal as SignalType;

  if (!(signal in constants.ACTIONS)) {
    throw errors.InvalidSignal;
  }

  console.log({
    session: session.sdkSession,
    action: constants.ACTIONS[signal],
    cid: body.contentId,
  });

  const ok = await personalized.addSignal(session.sdkSession, constants.ACTIONS[signal], body.contentId);
  if (!ok) {
    throw errors.AddSignalFailed;
  }

  return json({ ok });
}
