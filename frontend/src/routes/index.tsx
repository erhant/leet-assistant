import { Show, createResource, createSignal } from "solid-js";
import { Title } from "solid-start";
import { promptChatBot } from "~/api";

export default function Home() {
  const [prompt, setPrompt] = createSignal("");
  const [response, setResponse] = createSignal("");

  return (
    <main>
      <Title>Leet Assistant</Title>

      <label for="fname">First name:</label>
      <input
        type="text"
        id="fname"
        name="fname"
        onChange={(e) => {
          // console.log();
          setPrompt(e.currentTarget.value);
        }}
      ></input>
      <button
        onClick={() => {
          console.log("PROMPT:", prompt());
          promptChatBot(prompt()).then((resp) => {
            setResponse(resp);
          });
        }}
      >
        send
      </button>

      <Show when={response() !== ""} fallback={<p>chat not started</p>}>
        <p>{response()}</p>
      </Show>
    </main>
  );
}

/**
 * 2
 * V  >2
 * >>>^
 */
