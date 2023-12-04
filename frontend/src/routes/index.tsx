import { Show, createSignal } from "solid-js";
import { newSession } from "~/api/backend";
import Session from "~/components/Session";
import Greeting from "~/components/Greeting";

export default function Home() {
  const [sessionId, setSessionId] = createSignal("FIXME:remove:me");
  // const [sessionId, setSessionId] = createSignal("");

  async function createNewSession() {
    const sessionId = await newSession();
    setSessionId(sessionId);
  }

  return (
    <main>
      <Show when={sessionId() !== ""} fallback={<Greeting newSession={createNewSession} />}>
        <Session sessionId={sessionId()} resetSession={createNewSession} />
      </Show>
      {/* <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>{"© 2023 - erhant"}</p>
        </div>
      </footer> */}
    </main>
  );
}
