import { SessionObject } from "firstbatch";
import { For, Show, createSignal } from "solid-js";
import { makePrompt } from "~/client/requests";
import type { PromptType } from "~/types";

/**
 * Formats a `prompt` to a more UI-friendly sentence, note that backend may be using
 * a different sentence for the prompt itself, with more context & directives for ChatGPT.
 */
function formatPrompt(prompt: PromptType) {
  switch (prompt) {
    case "describe":
      return "What type of questions am I working with right now?";

    case "consult":
      return "What would help me get better at these questions?";

    case "suggest":
      return "What other topics would you suggest I look at, similar to these questions?";

    default:
      prompt satisfies never;
      throw new Error("Unknown prompt.");
  }
}

export default function ChatScreen(props: {
  session: SessionObject;
  chatHistory: string[];
  ids: string[]; // ids of the current questions
  updateChatHistory: (message: string) => void;
}) {
  const [isLoading, setIsLoading] = createSignal(false);

  // adds disable style to menu items when loading
  const itemDisable = () => (isLoading() ? " disabled" : "");

  async function handlePrompt(prompt: PromptType) {
    // dont allow another prompt while the previous one is going on
    if (isLoading()) return;

    // your prompt
    const yourMessage = formatPrompt(prompt);
    props.updateChatHistory(yourMessage);

    // assistant prompt
    setIsLoading(true);
    const [_, assistantMessage] = await makePrompt(props.session, prompt, props.ids);
    props.updateChatHistory(assistantMessage);
    setIsLoading(false);
  }

  return (
    <div class="modal-box">
      {/* main chatting container */}
      <h3 class="text-center my-2">Talk to your Leet Assistant</h3>
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
