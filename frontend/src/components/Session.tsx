import { For, createSignal } from "solid-js";
import backend from "~/api/backend";
import Question from "./Question";
import { QuestionType } from "~/types";
import QuestionCard from "./QuestionCard";
import QuestionsGrid from "./QuestionsGrid";
import { getDummyQuestions } from "~/api/dummy";

/**
 * Within a session, we see a batch of questions along with a chat bot where we can
 * ask specific questions to the chat bot.
 * @param props session id for the backend
 */
export default function Session(props: { sessionId: string }) {
  const [prompt, setPrompt] = createSignal("");
  const [chatHistory, setChatHistory] = createSignal<string[]>([]);
  const [questions, setQuestions] = createSignal<QuestionType[]>(getDummyQuestions());

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
    <div class="container mx-auto p-10 my-5">
      {/* questions */}
      <QuestionsGrid questions={questions()} />

      <button
        class="btn"
        // @ts-expect-errors
        onclick={`${"hi"}.showModal()`}
      >
        open modal
      </button>
      <dialog id={"hi"} class="modal">
        <div class="modal-box">
          <Question question={questions()[0]} />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

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
    </div>
  );
}
