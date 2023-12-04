import { QuestionType } from "~/types";

export default function QuestionCard(props: { question: QuestionType }) {
  return (
    <div class="card bg-neutral shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{props.question.title}</h2>
        <p>topics topics</p>
        <div class="card-actions justify-end">
          {
            {
              Easy: <div class="badge badge-success">Easy</div>,
              Medium: <div class="badge badge-warning">Medium</div>,
              Hard: <div class="badge badge-error">Hard</div>,
            }[props.question.difficulty]
          }
        </div>
      </div>
    </div>
  );
}
