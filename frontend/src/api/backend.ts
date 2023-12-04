import constants from "~/constants";
import { edenTreaty } from "@elysiajs/eden";
import type { ServerType } from "../../../backend/src";

const backend = edenTreaty<ServerType>(constants.BASE_URL);

export async function getQuestions(sessionId: string) {
  const response = await backend["batch"].post({
    sessionId,
  });
  if (response.status === 200 && response.data) {
    return response.data.batch[1];
  } else {
    throw new Error(response.error?.name);
  }
}

export async function newSession() {
  const response = await backend["new-session"].post();
  if (response.status === 200 && response.data) {
    return response.data.sessionId;
  } else {
    throw new Error(response.error?.name);
  }
}

export async function makeSignal() {
  // TODO: make a signal
}
