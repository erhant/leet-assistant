import { Show, createSignal } from "solid-js";

import Session from "~/components/Session";
import Greeting from "~/components/Greeting";

export default function Home() {
  const [sessionId, setSessionId] = createSignal("todo-remove-me");
  // const [sessionId, setSessionId] = createSignal("");

  return (
    <main>
      <Show when={sessionId() !== ""} fallback={<Greeting setSessionId={setSessionId} />}>
        <Session sessionId={sessionId()} />
      </Show>
      {/* <footer class="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>{"© 2023 - erhant"}</p>
        </div>
      </footer> */}
    </main>
  );
}
