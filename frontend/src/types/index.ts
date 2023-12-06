import type { backend } from "~/api/backend";

/** A batch result of questions. */
export type QuestionBatch = NonNullable<Awaited<ReturnType<typeof backend.batch.post>>["data"]>["batch"];

/** Base question type, without the `text` field which holds the ChatGPT input. */
export type Question = Omit<QuestionBatch["1"][0]["data"], "text">;

/** Prompt types as expected by backend. */
export type PromptType = Parameters<typeof backend.prompt.post>[0]["prompt"];

/** Signal types as expected by backend. */
export type SignalType = Parameters<typeof backend.signal.post>[0]["signal"];
