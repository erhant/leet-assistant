import { For, createSignal } from "solid-js";
import type { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";
import QuestionView from "./QuestionView";

export default function ChatScreen(props: { sessionId: string; chatHistory: string[] }) {
  const [prompt, setPrompt] = createSignal("");

  return (
    <div class="modal-box w-100">
      <h3 class="text-center my-2">Talk to your Leet Assistant</h3>

      {/* chat bubbles */}
      <div class="container">
        <For each={props.chatHistory}>
          {(chat, i) =>
            i() % 2 == 0 ? (
              <div class="chat chat-start">
                <div class="chat-header opacity-80">Leet Assistant</div>
                <div class="chat-bubble chat-bubble-accent">{chat}</div>
              </div>
            ) : (
              <div class="chat chat-end opacity-80">
                <div class="chat-header">You</div>
                <div class="chat-bubble">{chat}</div>
              </div>
            )
          }
        </For>
      </div>

      {/* user action menu */}
      <div class="flex my-2">
        <ul class="menu menu-horizontal menu-lg bg-base-200 rounded-box mx-auto">
          <li class="hover:text-primary">
            {/* describes the user's current state */}
            <a>Describe</a>
          </li>
          <li class="hover:text-success">
            {/* gives advice on how to improve for the current topic */}
            <a>Consult</a>
          </li>
          <li class="hover:text-secondary">
            {/* makes a suggestion for an alternative topic */}
            <a>Suggest</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
