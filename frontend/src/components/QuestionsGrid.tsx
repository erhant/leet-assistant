import type { Question } from "~/types";
import QuestionCard from "./QuestionCard";
import { For } from "solid-js";

/**
 * Display an array of questions in a grid. Clicking on a question
 * should open a pop-up for that question.
 *
 * @param props an array of questions
 */
export default function QuestionsGrid(props: { questions: Question[] }) {
  return (
    <div class="grid my-2 grid-cols-4 gap-4">
      <For each={props.questions}>{(question) => <QuestionCard question={question} />}</For>
    </div>
  );
}
