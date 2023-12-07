import constants from "~/constants";
import { PromptType, SignalType } from "~/types";

console.log("BASE URL:", constants.BASE_URL);
console.log(constants);

async function post(url: string, data?: any) {
  const response = await fetch(constants.BASE_URL + "/" + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data && JSON.stringify(data),
  });

  const body = await response.json();
  return body;
}

export async function getQuestions(sessionId: string) {
  const response = await post("batch", {
    sessionId,
  });
  if (response.status === 200 && response.data) {
    return response.data.batch[1];
  } else {
    throw new Error(response.error?.name);
  }
}

export async function newSession() {
  const response = await post("new-session");
  if (response.status === 200 && response.data) {
    return response.data.sessionId;
  } else {
    throw new Error(response.error?.name);
  }
}

export async function makeSignal(sessionId: string, contentId: string, signal: SignalType) {
  const response = await post("signal", {
    sessionId,
    contentId,
    signal,
  });
  if (response.status !== 200) {
    throw new Error(response.error?.name);
  }
}

export async function makePrompt(sessionId: string, prompt: PromptType) {
  const response = await post("prompt", {
    sessionId,
    prompt,
  });
  if (response.status === 200 && response.data !== null) {
    const message = response.data;
    // console.log(message[1]);
    return message;
  } else {
    throw new Error(response.error?.name);
  }
}
