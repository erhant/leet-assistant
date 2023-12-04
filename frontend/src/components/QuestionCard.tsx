import { For } from "solid-js";
import type { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";
import QuestionView from "./QuestionView";
import { makeSignal } from "~/api/backend";

export default function QuestionCard(props: { sessionId: string; question: Question; contentId: string }) {
  const id = props.question.slug + "_appmodal";
  let modalRef: HTMLDialogElement;

  async function handleSignal(signal: "solve" | "retry" | "fail") {
    await makeSignal(props.sessionId, props.contentId, signal);

    // close the modal
    modalRef.close();
  }

  return (
    <>
      <div
        class="card bg-neutral shadow-xl cursor-pointer transition hover:scale-105 ease-in-out "
        onClick={() => {
          modalRef.showModal();
        }}
      >
        <div class="card-body">
          <h2 class="card-title">{props.question.title}</h2>
          <QuestionBadges question={props.question} />
          <p class="line-clamp-1">{props.question.description}</p>
        </div>
      </div>

      {/* its important that this dialog stays outside the div of the card */}
      <dialog
        id={id}
        class="modal"
        // @ts-expect-error
        ref={modalRef}
      >
        <div class="modal-box">
          <QuestionView question={props.question} handleSignal={handleSignal} />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
