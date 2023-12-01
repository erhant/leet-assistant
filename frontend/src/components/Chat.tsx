import { For, Ref, createSignal } from "solid-js";
import backend from "~/api/backend";
import "./Chat.scss";

export default function ChatApp(props: { sessionId: string }) {
  const [prompt, setPrompt] = createSignal("");
  const [chatHistory, setChatHistory] = createSignal<string[]>([]);

  const sendMessage = () => {
    const message = prompt();
    if (message === "") {
      return;
    }

    setChatHistory((h) => [...h, message]);
    setPrompt("");

    // send message to backend
    backend.prompt
      .post({
        prompt: "describe", // TODO: take from UI
        sessionId: props.sessionId,
      })
      .then(({ data, status }) => {
        // TODO: check status
        if (data) setChatHistory((h) => [...h, data]);
      });
  };

  return (
    <div class="chat-container">
      <div class="chat-area">
        <For each={chatHistory()}>
          {(message, i) => (
            <div class={i() % 2 == 0 ? "message-prompt" : "message-response"}>
              {message}
            </div>
          )}
        </For>
      </div>
      <div class="input-area">
        <input
          onChange={(e) => {
            setPrompt(e.currentTarget.value);
            e.currentTarget.value = "";
          }}
          type="text"
          class="chat-input"
        />
        <button class="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>

      <button onClick={() => alert("todo")}>
        {/* this button should create a session with backend and start the SDK stuff there */}
        Begin
      </button>
    </div>
  );
}
