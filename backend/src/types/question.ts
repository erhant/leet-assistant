/** A parsed question, also used as a metadata. */
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

/** Metadata stored within the vector store along with id and embeddings. */
export type DataRowMetadataResponse = Question & { text: string };
