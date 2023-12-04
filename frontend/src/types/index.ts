import type { Question as QuestionType } from "../../../data/src/types";

export type Question = QuestionType;

export type QuestionBatch = [string[], { id: string; data: QuestionType & { text: string } }[]];
