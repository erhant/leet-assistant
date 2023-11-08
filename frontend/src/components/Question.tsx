import { For, Ref, createSignal } from "solid-js";
import { promptChatBot } from "~/api";

export default function Question(props: { title: string; slug: string }) {
  const url = `https://leetcode.com/problems/${props.slug}/`;
  return (
    <div class="question-container">
      <h3 class="question-title">{props.title}</h3>
      <a href={url} target="_blank">
        Solve Problem
      </a>
      <div class="question-buttons">
        <button>Solved</button>
        <button>Ask Again</button>
        <button>Failed</button>
      </div>
    </div>
  );
}
