const BASE_URL = "http://localhost:8080";

async function post(url: string, data: any, baseURL: string = BASE_URL) {
  const target = baseURL + url;
  console.log("POST@\t", target);
  const response = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // TODO: error handling
    alert(`${response.statusText} (${response.status}`);
    throw new Error("Failed.");
  }

  return response;
}

/** Calls the backend to make a prompt to the AI at backend. */
export async function promptChatBot(prompt: string): Promise<string> {
  const response = await post("/prompt", { prompt });

  return await response.text();
}

/** Calls the backend to make a prompt to the AI at backend. */
export async function createSession(): Promise<string> {
  const response = await post("/new-session", {});
  const body = (await response.json()) as { sessionId: string };
  console.log("Session:", body.sessionId);
  return body.sessionId;
}