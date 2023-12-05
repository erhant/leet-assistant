import { For, Setter, Show, createSignal, onMount } from "solid-js";
import QuestionView from "./QuestionView";
import type { QuestionBatch } from "~/types";
import QuestionCard from "./QuestionCard";
import { getDummyChatHistory, getDummyQuestions } from "~/api/dummy";
import { getQuestions } from "~/api/backend";
import ChatScreen from "./ChatScreen";

/**
 * Within a session, we see a batch of questions along with a chat bot where we can
 * ask specific questions to the chat bot.
 * @param props session id for the backend
 */
export default function Session(props: { sessionId: string; resetSession: () => Promise<void> }) {
  const [chatHistory, setChatHistory] = createSignal<string[]>([
    "Welcome! I am your Leet Assistant, how may I help you for this session?",
  ]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [questions, setQuestions] = createSignal<QuestionBatch[1]>([]);

  // chat modal stuff
  const chatModalId = "chatmodalrag";
  let chatModalRef: HTMLDialogElement;

  async function refreshQuestions() {
    setIsLoading(true);
    const questions = await getQuestions(props.sessionId);
    setQuestions(questions);
    setIsLoading(false);
  }

  async function reset() {
    setIsLoading(true);
    await props.resetSession();
    setChatHistory([]);
    await refreshQuestions();
    setIsLoading(false);
  }

  onMount(refreshQuestions);

  return (
    <div class="container mx-auto p-10 my-5">
      {/* question cards */}
      <div class="grid my-2 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6">
        <Show
          when={!isLoading()}
          fallback={<For each={new Array(12)}>{() => <div class="skeleton grow w-full h-32"></div>}</For>}
        >
          <For each={questions()}>
            {(question) => (
              <QuestionCard question={question.data} contentId={question.id} sessionId={props.sessionId} />
            )}
          </For>
        </Show>
      </div>

      {/* controls */}
      <div class="flex flex-row justify-center mx-auto my-4 gap-x-4">
        {/* get a new set of questions */}
        <button class="btn btn-neutral btn-lg btn-outline hover:bg-primary" onClick={() => refreshQuestions()}>
          Refresh
        </button>

        {/* creates a new session and calls refresh */}
        <button class="btn btn-neutral btn-lg btn-outline hover:bg-error" onClick={() => reset()}>
          Reset
        </button>

        {/* this is a button along with a chat dialog modal */}
        <button class="btn btn-neutral btn-lg btn-outline hover:bg-accent" onClick={() => chatModalRef.showModal()}>
          Chat
        </button>
        <dialog
          id={chatModalId}
          class="modal"
          // @ts-expect-error
          ref={chatModalRef}
        >
          <ChatScreen
            sessionId={props.sessionId}
            chatHistory={chatHistory()}
            updateChatHistory={(message) => {
              setChatHistory((history) => [...history, message]);
            }}
          />
          {/* this causes modal to be closed when clicked outside */}
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
