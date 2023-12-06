import type { Question as QuestionType } from "../../../data/src/types";
import type { SessionObject } from "firstbatch";
import { t } from "elysia";

/** Question type, aliased to use & export at the same time. */
export type Question = QuestionType;

/** Returned type from `personalized.batch`. */
export type QuestionBatch = [string[], { id: string; data: QuestionType & { text: string } }[]];

/** A user prompt. */
export type PromptType =
  // describes the user's state right now with the questions solved and such.
  | "describe"
  // provides consultation for the user, offering topics to study etc.
  | "consult"
  // suggest different topics based on the user's current topics
  | "suggest";

/** {@link PromptType} using Elysia's `t`. */
export const tPromptType = t.Union([t.Literal("describe"), t.Literal("consult"), t.Literal("suggest")]);

/** A user action signal. */
export type SignalType = "solve" | "retry" | "fail";

/** {@link SignalType} using Elysia's `t`. */
export const tSignalType = t.Union([t.Literal("solve"), t.Literal("retry"), t.Literal("fail")]);

/** A conversational RAG input. */
export type PromptInputType = {
  prompt: PromptType;
  // chatHistory: [string, string][];
  context: QuestionBatch[1];
};

/** A user session. The key is sessionId. */
export type SessionType = {
  [SessionId: string]: {
    sdkSession: SessionObject;
    chatHistory: string[];
  };
};
