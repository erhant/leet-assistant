import { For, createSignal } from "solid-js";
import backend from "~/api/backend";
import Question from "./Question";
import { QuestionType } from "~/types";
import QuestionSummary from "./QuestionSummary";
import QuestionsGrid from "./QuestionsGrid";

/**
 * Within a session, we see a batch of questions along with a chat bot where we can
 * ask specific questions to the chat bot.
 * @param props session id for the backend
 */
export default function Session(props: { sessionId: string }) {
  const [prompt, setPrompt] = createSignal("");
  const [chatHistory, setChatHistory] = createSignal<string[]>([]);
  const [questions, setQuestions] = createSignal<QuestionType[]>([
    {
      contentId: "",
      difficulty: "Easy",
      slug: "",
      title: "Hi",
    },
    {
      contentId: "",
      difficulty: "Hard",
      slug: "",
      title: "Bye",
    },
    {
      contentId: "",
      difficulty: "Hard",
      slug: "",
      title: "Bye",
    },
  ]);
  const MODAL_ID = "question_modal";

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

      {/* a question modal */}
      <button
        class="btn"
        // @ts-expect-errors
        onclick={`${MODAL_ID}.showModal()`}
      >
        open modal
      </button>
      <dialog id={MODAL_ID} class="modal">
        <div class="modal-box">
          <h3 class="font-bold text-lg">Hello!</h3>
          <p class="py-4">Press ESC key or click outside to close</p>
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
