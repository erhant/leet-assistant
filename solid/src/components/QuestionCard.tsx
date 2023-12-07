import type { Question, SignalType } from "~/types";
import QuestionBadges from "./QuestionBadges";
import QuestionView from "./QuestionView";
import { makeSignal } from "~/client/requests";

export default function QuestionCard(props: {
  sessionId: string;
  question: Question;
  contentId: string;
  visited: boolean;
  visit: () => void;
}) {
  let modalRef: HTMLDialogElement;
  const id = props.question.slug + "_appmodal";
  const cardOpacity = () => (props.visited ? " opacity-60" : "");

  async function handleSignal(signal: SignalType) {
    await makeSignal(props.sessionId, props.contentId, signal);
    modalRef.close();
  }

  return (
    <>
      <div
        class="card shadow-xl cursor-pointer transition hover:scale-105 ease-in-out"
        onClick={() => {
          modalRef.showModal();
        }}
      >
        <div class={"card-body" + cardOpacity()}>
          <h2 class="card-title">{props.question.title}</h2>
          <QuestionBadges question={props.question} />
          <p class="line-clamp-1">{props.question.description}</p>
        </div>
      </div>

      {/* its important that this dialog stays outside the div of the card; it has better close animation */}
      <dialog
        id={id}
        class="modal"
        // @ts-expect-error
        ref={modalRef}
        onClose={() => props.visit()}
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
