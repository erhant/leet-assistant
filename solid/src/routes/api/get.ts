import { json } from "solid-start";
import constants from "~/api/constants";

export function GET() {
  return new Response("Hi");
}

export function POST() {
  return json(constants);
}
