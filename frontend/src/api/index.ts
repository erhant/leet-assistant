const BASE_URL = "http://localhost:8080";

/**
 * Calls the backend to make a prompt to a chatbot.
 *
 * @deprecated use RAG instead
 */
export async function promptChatBot(prompt: string): Promise<string> {
  const url = BASE_URL + "/prompt?prompt=" + encodeURIComponent(prompt);
  console.log("GET:", url);
  const response = await fetch(url);
  if (!response.ok) {
    alert(`${response.statusText} (${response.status}`);
    return "<error occured>";
  }

  return await response.text();
}

/** Sends a signal to backend to update the user embeddings state.
 *
 * The user may send one of the three signals:
 * - `solved`: solved this question, bring more from another topic
 * - `try-again`: ask this question later, even if it is solved
 * - `failed`: failed this question, bring more about this topic
 */
export async function sendSignal(signal: "solved" | "try-again" | "failed") {
  const url = BASE_URL + "/batch";
}

/**
 * Requests a batch of questions for the user. TODO: params?
 */
export async function requestBatch() {
  const url = BASE_URL + "/batch";
}
