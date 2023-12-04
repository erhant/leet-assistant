import IconOutbound from "~/icons/outbound";
import { QuestionType } from "~/types";

export default function Question(props: { question: QuestionType }) {
  const url = `https://leetcode.com/problems/${props.question.slug}/`;
  return (
    <div class="flex flex-col center gap-2">
      <h1 class="text-xl text-center m-2">{props.question.title}</h1>
      <a role="button" class="btn btn-primary" href={url} target="_blank">
        Solve Problem at LeetCode <IconOutbound />
      </a>
      <div class="divider">Actions</div>
      <div class="flex flex-row gap-5 justify-center">
        <button class="btn btn-lg btn-success">Solved</button>
        <button class="btn btn-lg btn-warning">Repeat</button>
        <button class="btn btn-lg btn-error">Failed</button>
      </div>
    </div>
  );
}
