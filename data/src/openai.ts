import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { questionToString } from "./questions";
import type { Question } from "./types";

/** Using OpenAI, convert documents to embeddings.
 * @deprecated we are using `fromText` method of LangChain's Pinecone instead.
 * Just keeping this function here for historical purposes.
 */
export async function questionToEmbeddings(questions: Question[]) {
  const API_KEY = process.env.OPENAI_API_KEY;
  const openai = new OpenAIEmbeddings({
    openAIApiKey: API_KEY,
  });

  const embeddings = await openai.embedDocuments(questions.map((q) => questionToString(q)));

  const embedData = questions.map((q, i) => ({
    id: q.questionId,
    values: embeddings[i],
    metadata: q,
  }));

  return embedData;
}
