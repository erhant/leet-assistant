import { For, Show, createSignal, onMount } from "solid-js";
import QuestionView from "./QuestionView";
import type { QuestionBatch } from "~/types";
import QuestionCard from "./QuestionCard";
import { getDummyQuestions } from "~/api/dummy";
import { getQuestions } from "~/api/backend";

/**
 * Within a session, we see a batch of questions along with a chat bot where we can
 * ask specific questions to the chat bot.
 * @param props session id for the backend
 */
export default function Session(props: { sessionId: string }) {
  const [chatHistory, setChatHistory] = createSignal<string[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [questions, setQuestions] = createSignal<QuestionBatch[1]>([]); // );

  async function refreshQuestions() {
    setIsLoading(true);
    const questions = await getQuestions(props.sessionId);
    setQuestions(questions);
    setIsLoading(false);
  }

  // onMount(refreshQuestions);

  return (
    <div class="container mx-auto p-10 my-5">
      <div class="grid my-2 grid-cols-4 gap-x-4 gap-y-6">
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

      {/* chat screen with the bot */}
      {/* <div>
        <For each={chatHistory()}>
          {(message, i) => (
            <div class={i() % 2 == 0 ? "message-human" : "message-assistant"}>
              {message}
            </div>
          )}
        </For>
      </div> */}
      <div class="flex flex-row center mx-auto gap-x-4">
        <button class="btn btn-neutral" onClick={() => refreshQuestions()}>
          Refresh
        </button>
        <button class="btn btn-neutral" onClick={() => alert("this should reset user embeddings")}>
          Reset
        </button>
        <button class="btn btn-neutral" onClick={() => alert("this should open a chat drawer")}>
          Chat
        </button>
      </div>
    </div>
  );
}
