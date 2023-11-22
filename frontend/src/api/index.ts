const BASE_URL = "http://localhost:8080";

/** Calls the backend to make a prompt to the AI at backend. */
export async function promptChatBot(prompt: string): Promise<string> {
  const url = BASE_URL + "/prompt";
  console.log("GET:", url);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  if (!response.ok) {
    // TODO: error todos
    alert(`${response.statusText} (${response.status}`);
    return "<error occured>";
  }

  return await response.text();
}
