import { For } from "solid-js";
import { Question } from "~/types";

export default function QuestionBadges(props: { question: Question }) {
  return (
    <div class="flex flex-row gap-2 flex-wrap">
      {
        {
          Easy: <div class="badge badge-success">Easy</div>,
          Medium: <div class="badge badge-warning">Medium</div>,
          Hard: <div class="badge badge-error">Hard</div>,
        }[props.question.difficulty]
      }
      <For each={props.question.topics}>{(topic) => <span class="badge badge-outline">{topic.toString()}</span>}</For>
    </div>
  );
}
