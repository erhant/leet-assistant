import type { PineconeRecord, RecordMetadata } from "@pinecone-database/pinecone";
import type { RecordId } from "@pinecone-database/pinecone";

/** A parsed row. */
export type Question = {
  questionId: string;
  title: string;
  slug: string;
  description: string;
  topics: string[];
  difficulty: "Easy" | "Medium" | "Hard";
  successRate: number;
  submissions: number;
  accepteds: number;
  likes: number;
  dislikes: number;
  hints: string;
  similarQuestionIds: string[];
  similarQuestionsText: string[];
};

/** A raw question row from the CSV file. */
export type QuestionRaw = {
  "Question ID": string;
  "Question Title": string;
  "Question Slug": string;
  "Question Text": string;
  "Topic Tagged text": string;
  "Difficulty Level": string;
  "Success Rate": string;
  "total submission": string;
  "total accepted": string;
  Likes: string;
  Dislikes: string;
  Hints: string;
  "Similar Questions ID": string;
  "Similar Questions Text": string;
};

/** Metadata stored within the vector store along with id and embeddings. */
export type DataRowMetadataResponse = Question & { text: string };

/** A data row for Pinecone, along with embeddings. */
export type QuestionPineconeRecord = PineconeRecord<Question>;
