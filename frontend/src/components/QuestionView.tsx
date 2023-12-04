import { For } from "solid-js";
import IconOutbound from "~/icons/outbound";
import { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";

export default function QuestionView(props: { question: Question }) {
  const url = `https://leetcode.com/problems/${props.question.slug}/`;
  return (
    <div class="flex flex-col center gap-2">
      <h1 class="text-xl text-center m-2">{props.question.title}</h1>
      <QuestionBadges question={props.question} />

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
        <button class="btn btn-lg btn-success">Solved</button>
        <button class="btn btn-lg btn-warning">Repeat</button>
        <button class="btn btn-lg btn-error">Failed</button>
      </div>
    </div>
  );
}