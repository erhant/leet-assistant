import { Show, createResource, createSignal } from "solid-js";
import { Title } from "solid-start";
import { createSession } from "~/api";
import ChatApp from "~/components/Chat";

export default function Home() {
  const [response, setResponse] = createSignal("");
  const [sessionId, setSessionId] = createSignal("");

  return (
    <main>
      <Title>Leet Assistant</Title>

      <Show
        when={sessionId() !== ""}
        fallback={
          <button
            onClick={() => {
              createSession().then((sessionId) => {
                setSessionId(sessionId);
              });
            }}
          >
            Start Session
          </button>
        }
      >
        <ChatApp sessionId={sessionId()} />
      </Show>
    </main>
  );
}

/**
 * 2
 * V  >2
 * >>>^
 */
