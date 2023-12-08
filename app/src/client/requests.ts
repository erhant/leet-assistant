import { SessionObject } from "firstbatch";
import constants from "~/constants";
import { PromptType, Question, QuestionBatch, SignalType } from "~/types";

console.log("BASE URL:", constants.BASE_URL);

/** Make a POST request.
 *
 * @param url endpoint, not including the base URL
 * @param data optional data
 * @template T type of the returned data
 * @template I type of the input data
 */
async function post<T = any, I = any>(url: string, data?: I) {
  const targetUrl = constants.BASE_URL + "/" + url;
  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data && JSON.stringify(data),
  });
  console.log({ response });
  if (response.status !== 200) {
    throw new Error(`POST ${targetUrl} failed with ${response.statusText} (${response.status})`);
  }

  const body = (await response.json()) as T;
  console.log({
    targetUrl,
    body,
  });

  return body;
}

export async function getQuestions(sessionId: string) {
  const result = await post<QuestionBatch[1]>("batch", { sessionId });
  return result;
}

export async function newSession() {
  const result = await post<SessionObject>("newSession");
  return result.id;
}

export async function makeSignal(sessionId: string, contentId: string, signal: SignalType) {
  await post<void>("signal", {
    sessionId,
    contentId,
    signal,
  });
}

export async function makePrompt(sessionId: string, prompt: PromptType) {
  const result = await post<[string, string]>("prompt", {
    sessionId,
    prompt,
  });
  return result;
}
