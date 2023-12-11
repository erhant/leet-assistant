import axios from "axios";
import { SessionObject } from "firstbatch";
import { EndpointBatch, EndpointPrompt, EndpointSession, EndpointSignal } from "~/api/types";
import constants from "~/constants";
import { PromptType, SignalType } from "~/types";

console.log("BASE URL:", constants.BASE_URL);

const client = axios.create({
  baseURL: constants.BASE_URL + "/",
  timeout: 40_000, // 40 secs, esp. due to chatgpt stuff
});

/** Make a POST request to the backend API.
 *
 * @param url endpoint, not including the base URL
 * @param data optional data
 * @template T endpoint type
 */
async function post<
  T extends {
    /** Request body type */
    req: any;
    /** Response body type */
    res: any;
  }
>(url: string, data: T["req"]): Promise<T["res"]> {
  const response = await client.post(url, data);

  if (response.status !== 200) {
    throw new Error(`POST ${constants.BASE_URL + "/" + url} failed with ${response.statusText} (${response.status})`);
  }

  return response.data as T["res"];
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
