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
  text?: string; // this is not present at the start, but added by Pinecone
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
