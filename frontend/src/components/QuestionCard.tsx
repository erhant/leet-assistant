import { For } from "solid-js";
import type { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";
import QuestionView from "./QuestionView";

export default function QuestionCard(props: { question: Question }) {
  const id = props.question.slug + "_appmodal";
  return (
    <>
      <div
        class="card bg-neutral shadow-xl cursor-pointer transition hover:scale-105 ease-in-out "
        onClick={() => {
          // TODO: use `ref` of SolidJS for this
          const elem = document.getElementById(id) as HTMLDialogElement;
          elem.showModal();
        }}
      >
        <div class="card-body">
          <h2 class="card-title">{props.question.title}</h2>
          <QuestionBadges question={props.question} />
          <p class="line-clamp-1">{props.question.description}</p>
        </div>
      </div>

      {/* its important that this dialog stays outside the div of the card */}
      <dialog id={id} class="modal">
        <div class="modal-box">
          <QuestionView question={props.question} />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
