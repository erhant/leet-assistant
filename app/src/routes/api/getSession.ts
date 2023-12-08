import { APIEvent, json } from "solid-start";
import { read } from "~/api/state";

export async function POST({ request }: APIEvent) {
  const body = await request.json();
  const session = await read(request, body.sessionId);
  return json(session);
}
