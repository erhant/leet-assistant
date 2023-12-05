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

export async function makeSignal(sessionId: string, contentId: string, signal: "retry" | "solve" | "fail") {
  const response = await backend["signal"].post({
    sessionId,
    contentId,
    signal,
  });
  if (response.status === 200 && response.data !== null) {
    if (!response.data) {
      // something went wrong?
      throw new Error("Could not add signal.");
    }
  } else {
    throw new Error(response.error?.name);
  }
}

export async function makePrompt(sessionId: string, prompt: "describe" | "consult") {
  const response = await backend["prompt"].post({
    sessionId,
    prompt,
  });
  if (response.status === 200 && response.data !== null) {
    return response.data; // response as a string
  } else {
    throw new Error(response.error?.name);
  }
}

export function formatPrompt(prompt: string) {
  switch (prompt) {
    case "describe":
      return "What do you think are the types of questions that I can solve, based on the context?";

    case "consult":
      return "What resources would you suggest that I should study to get better at the topics as given in the context?";

    default:
      // prompt satisfies never;
      throw new Error("Unknown prompt.");
  }
}
