import { For, createSignal } from "solid-js";
import type { Question } from "~/types";
import QuestionBadges from "./QuestionBadges";
import QuestionView from "./QuestionView";

export default function ChatDrawer(props: { question: Question }) {
  const [prompt, setPrompt] = createSignal("");

  return <></>;
}
