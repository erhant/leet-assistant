import { For, Show, createSignal } from "solid-js";
import { formatPrompt, makePrompt } from "~/api/backend";

export default function ChatScreen(props: {
  sessionId: string;
  chatHistory: string[];
  updateChatHistory: (message: string) => void;
}) {
  const [isLoading, setIsLoading] = createSignal(false);

  async function handlePrompt(prompt: "describe" | "consult") {
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
          {(chat, i) =>
            i() % 2 == 0 ? (
              <div class="chat chat-start">
                <div class="chat-header opacity-80">Leet Assistant</div>
                <div class="chat-bubble chat-bubble-accent">{chat}</div>
              </div>
            ) : (
              <div class="chat chat-end">
                <div class="chat-header opacity-80">You</div>
                <div class="chat-bubble">{chat}</div>
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
          <li class={"hover:text-primary"} onClick={() => handlePrompt("describe")}>
            {/* describes the user's current state */}
            <a>Describe</a>
          </li>
          <li class={"hover:text-success"} onClick={() => handlePrompt("consult")}>
            {/* gives advice on how to improve for the current topic */}
            <a>Consult</a>
          </li>
          {/* FIXME: add suggest prompt to backend */}
          <li class={"hover:text-info"} onClick={() => handlePrompt("consult")}>
            {/* makes a suggestion for an alternative topic */}
            <a>Suggest</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
