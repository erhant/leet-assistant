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

/** A data row, along with embeddings. */
export interface DataRowEmbedding {
  /** Question ID. */
  id: number;
  /** Vector embedding. */
  embedding: number[];
}
