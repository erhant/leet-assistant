import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DataRow, DataRowEmbedding } from "../types";
import { dataToSummarizedString } from "./data";

/** Using OpenAI, convert documents to embeddings.
 *
 * @deprecated we are using `fromText` method of langchain's Pinecone instead.
 */
export async function dataToEmbeddings(data: DataRow[]) {
  const API_KEY = Bun.env.OPENAI_API_KEY;
  const openai = new OpenAIEmbeddings({
    openAIApiKey: API_KEY,
  });

  const embeddings = await openai.embedDocuments(data.map((d) => dataToSummarizedString(d)));

  const embedData: DataRowEmbedding[] = data.map((d, i) => ({
    id: d.id.toString(),
    values: embeddings[i],
    metadata: {
      id: d.id.toString(), // needed in case the data is used for another vector store
      difficulty: d.difficulty,
      topics: d.topics,
    },
  }));

  return embedData;
}
