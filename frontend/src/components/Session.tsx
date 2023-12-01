import { For, createSignal } from "solid-js";
import backend from "~/api/backend";
import Question from "./Question";

/**
 *
 * @param props session id for the backend
 * @returns
 */
export default function Session(props: { sessionId: string }) {
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
      .then(({ data, status, error }) => {
        // TODO: check status
        if (status !== 200 || data === null) {
          console.error({ error, status });
        } else {
          setChatHistory((h) => [...h, data]);
        }
      });
  };

  return (
    <div class="container mx-auto py-10">
      {/* questions */}
      <div class="grid grid-cols-4">
        <Question slug="ehe" title="ehe" />
      </div>

      {/* chat screen with the bot */}
      <div>
        <For each={chatHistory()}>
          {(message, i) => (
            <div class={i() % 2 == 0 ? "message-human" : "message-assistant"}>
              {message}
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
