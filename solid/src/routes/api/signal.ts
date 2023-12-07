import { APIEvent, json } from "solid-start";
import { read } from "~/api/state";

export async function POST({ request }: APIEvent) {
  return new Response("todo");
}
