import { t } from "elysia";
import type { DataRowMetadataResponse } from "../types";

/** A user prompt. */
export type PromptType =
  // describes the user's state right now with the questions solved and such.
  | "describe"
  // provides consultation for the user, offering topics to study etc.
  | "consult";

/** A user prompt. */
export const tPromptType = t.Union([t.Literal("describe"), t.Literal("consult")]);

/** A conversational RAG input. */
export type PromptInputType = {
  prompt: PromptType;
  chatHistory: [string, string][];
  context: DataRowMetadataResponse[];
};
