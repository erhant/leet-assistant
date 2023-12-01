import { Show, createSignal } from "solid-js";
import { Title } from "solid-start";
import backend from "~/api/backend";
import ChatApp from "~/components/Chat";

export default function Home() {
  const [response, setResponse] = createSignal("");
  const [sessionId, setSessionId] = createSignal("");

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      {/* first we must start an SDK session */}
      <Show
        when={sessionId() !== ""}
        fallback={
          <button
            onClick={() => {
              backend["new-session"].post().then((response) => {
                if (response.status === 200 && response.data) {
                  setSessionId(response.data.sessionId);
                } else {
                  alert(response.status);
                }
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
