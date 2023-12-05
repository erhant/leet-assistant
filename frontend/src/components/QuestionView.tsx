import IconOutbound from "~/icons/Outbound";
import { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";
import { makeSignal } from "~/api/backend";
import { createSignal } from "solid-js";

export default function QuestionView(props: {
  question: Question;
  handleSignal: (signal: "solve" | "retry" | "fail") => Promise<void>;
}) {
  const [isLoading, setIsLoading] = createSignal(false);
  const url = `https://leetcode.com/problems/${props.question.slug}/`;

  async function handleSignal(signal: "solve" | "retry" | "fail") {
    // dont allow another prompt while the previous one is going on
    if (isLoading()) return;

    setIsLoading(true);
    await props.handleSignal(signal);
    setIsLoading(false);
  }

  // adds disable style to buttons when loading
  const buttonDisable = () => (isLoading() ? " btn-disabled" : "");

  return (
    <div class="flex flex-col center gap-2">
      <h1 class="text-xl text-center m-2">{props.question.title}</h1>
      <div class="my-2">
        <QuestionBadges question={props.question} />
      </div>

      <p>{props.question.description}</p>
      <a role="button" class="btn btn-primary" href={url} target="_blank">
        Solve Problem at LeetCode <IconOutbound />
      </a>
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Likes</div>
          <div class="stat-value">{props.question.likes}</div>
          <div class="stat-desc">{`versus ${props.question.dislikes} dislikes`}</div>
        </div>

        <div class="stat">
          <div class="stat-title">Solutions</div>
          <div class="stat-value">{props.question.accepteds}</div>
          <div class="stat-desc">{`within ${props.question.submissions} submissions`}</div>
        </div>
      </div>

      <div class="divider">Actions</div>
      <p class="mx-2">
        After you have worked on the problem, you can come back to this page and click any of the buttons below. Based
        on your experience, Leet Assistant will try to bring more relevant questions for you.
      </p>
      <div class="flex flex-row gap-5 justify-center my-2">
        <button class={"btn btn-lg btn-success" + buttonDisable()} onClick={() => handleSignal("solve")}>
          Solved
        </button>
        <button class={"btn btn-lg btn-warning" + buttonDisable()} onClick={() => handleSignal("retry")}>
          Retry
        </button>
        <button class={"btn btn-lg btn-error" + buttonDisable()} onClick={() => handleSignal("fail")}>
          Failed
        </button>
      </div>
    </div>
  );
}
