import { Show, createSignal } from "solid-js";
import { newSession } from "~/client/requests";
import Session from "~/components/Session";
import Greeting from "~/components/Greeting";
import ThemeToggle from "~/components/ThemeToggle";
import { SessionObject } from "firstbatch";

export default function Home() {
  const [session, setSession] = createSignal<SessionObject>();

  async function createNewSession() {
    const session = await newSession();
    setSession(session);
  }

  return (
    <main>
      <ThemeToggle />

      <Show when={session() !== undefined} fallback={<Greeting newSession={createNewSession} />}>
        <Session session={session()!} resetSession={createNewSession} />
      </Show>
    </main>
  );
}
