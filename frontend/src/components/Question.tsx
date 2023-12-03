import IconOutbound from "~/icons/outbound";
import { QuestionType } from "~/types";

export default function Question(props: { question: QuestionType }) {
  const url = `https://leetcode.com/problems/${props.question.slug}/`;
  return (
    <div class="container mx-auto">
      <h3 class="question-title">{props.question.title}</h3>
      <a role="button" class="btn btn-primary" href={url} target="_blank">
        Solve Problem <IconOutbound />
      </a>
      <div class="flex flex-row gap-p2">
        <button class="btn btn-success">Solved</button>
        <button class="btn btn-warning">Repeat</button>
        <button class="btn btn-error">Failed</button>
      </div>
    </div>
  );
}
