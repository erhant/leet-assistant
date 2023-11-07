import type { PineconeRecord } from "@pinecone-database/pinecone";
import type { RecordId } from "@pinecone-database/pinecone";

/** A parsed row. */
export interface DataRow {
  id: number;
  title: string;
  slug: string;
  description: string;
  topics: string[];
  difficulty: string;
  successRate: number;
  submissions: number;
  accepteds: number;
  likes: number;
  dislikes: number;
  hints: string;
  similarQuestionIds: number[];
  similarQuestionsText: string[];
}

/** A row from the CSV file. */
export interface RawDataRow {
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
}

/** Metadata stored within the vector store along with id and embeddings. */
export type DataRowMetadata = Pick<DataRow, "difficulty" | "topics"> & {
  id: RecordId;
};

/** A data row for Pinecone, along with embeddings. */
export type DataRowEmbedding = PineconeRecord<DataRowMetadata>;
