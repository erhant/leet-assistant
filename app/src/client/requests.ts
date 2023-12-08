import { SessionObject } from "firstbatch";
import { EndpointBatch, EndpointPrompt, EndpointSession, EndpointSignal } from "~/api/types";
import constants from "~/constants";
import { PromptType, SignalType } from "~/types";

console.log("BASE URL:", constants.BASE_URL);

/** Make a POST request to the backend API.
 *
 * @param url endpoint, not including the base URL
 * @param data optional data
 * @template T endpoint type
 */
async function post<T extends { req: any; res: any }>(url: string, data: T["req"]) {
  const targetUrl = constants.BASE_URL + "/" + url;
  const reqBody = data && JSON.stringify(data);

  const response = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: reqBody,
  });

  if (response.status !== 200) {
    throw new Error(`POST ${targetUrl} failed with ${response.statusText} (${response.status})`);
  }

  const resBody = (await response.json()) as T["res"];

  return resBody;
}

export async function getQuestions(session: SessionObject) {
  return await post<EndpointBatch>("batch", { session });
}

export async function newSession() {
  return await post<EndpointSession>("session", {});
}

export async function makeSignal(session: SessionObject, contentId: string, signal: SignalType) {
  return await post<EndpointSignal>("signal", {
    session,
    contentId,
    signal,
  });
}

export async function makePrompt(session: SessionObject, prompt: PromptType, ids: string[]) {
  return await post<EndpointPrompt>("prompt", {
    session,
    prompt,
    ids,
  });
}
