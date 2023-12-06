import { For, Show, createSignal } from "solid-js";
import { makePrompt } from "~/api/backend";

function formatPrompt(prompt: "describe" | "consult" | "suggest") {
  switch (prompt) {
    case "describe":
      return "What do you think are the types of questions that I can solve, based on the context?";

    case "consult":
      return "What resources would you suggest that I should study to get better at the topics as given in the context?";

    case "suggest":
      return "What resources would you suggest that I should study to get better at the topics as given in the context?";

    default:
      prompt satisfies never;
      throw new Error("Unknown prompt.");
  }
}

export default function ChatScreen(props: {
  sessionId: string;
  chatHistory: string[];
  updateChatHistory: (message: string) => void;
}) {
  const [isLoading, setIsLoading] = createSignal(false);

  // adds disable style to menu items when loading
  const itemDisable = () => (isLoading() ? " disabled" : "");

  async function handlePrompt(prompt: "describe" | "consult" | "suggest") {
    // dont allow another prompt while the previous one is going on
    if (isLoading()) return;

    // your prompt
    const yourMessage = formatPrompt(prompt);
    props.updateChatHistory(yourMessage);

    // assistant prompt
    setIsLoading(true);
    const [_, assistantMessage] = await makePrompt(props.sessionId, prompt);
    props.updateChatHistory(assistantMessage);
    setIsLoading(false);
  }

  return (
    <div class="modal-box">
      <h3 class="text-center my-2">Talk to your Leet Assistant</h3>

      {/* main chatting container */}
      <div class="container">
        {/* actual conversation bubble here */}
        <For each={props.chatHistory}>
          {(message, i) =>
            i() % 2 == 0 ? (
              <div class="chat chat-start whitespace-pre-wrap">
                <div class="chat-header opacity-80">Leet Assistant</div>
                <div class="chat-bubble chat-bubble-accent">
                  <p>{message}</p>
                </div>
              </div>
            ) : (
              <div class="chat chat-end">
                <div class="chat-header opacity-80">You</div>
                <div class="chat-bubble">
                  <p>{message}</p>
                </div>
              </div>
            )
          }
        </For>

        {/* loading animation */}
        <Show when={isLoading()}>
          <div class="flex mx-auto mb-6 mt-4">
            <span class="loading loading-dots loading-lg mx-auto"></span>
          </div>
        </Show>
      </div>

      {/* user action menu */}
      <div class="divider my-3" />
      <p class="mb-4 text-center">Click on any of these prompts below.</p>
      <div class="flex my-2">
        <ul class="menu menu-horizontal menu-lg bg-base-200 rounded-box mx-auto">
          {/* describe */}
          <li class={"hover:text-primary" + itemDisable()} onClick={() => handlePrompt("describe")}>
            <div
              class="tooltip"
              data-tip="Ask about the current questions context & topics, describe their real-world use-cases and importance."
            >
              <a>Describe</a>
            </div>
          </li>
          {/* consult */}
          <li class={"hover:text-success" + itemDisable()} onClick={() => handlePrompt("consult")}>
            <div
              class="tooltip"
              data-tip="Ask for advice on how to improve yourself with respect to current set of questions & topics."
            >
              <a>Consult</a>
            </div>
          </li>
          {/* suggest */}
          <li class={"hover:text-info" + itemDisable()} onClick={() => handlePrompt("suggest")}>
            <div class="tooltip" data-tip="Ask about alternative topics to study, related to your current questions.">
              <a>Suggest</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
