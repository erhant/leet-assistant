import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { dataToString } from "./question";
import type { DataRow } from "../types";

/** Using OpenAI, convert documents to embeddings.
 *
 * @deprecated we are using `fromText` method of langchain's Pinecone instead.
 */
export async function dataToEmbeddings(data: DataRow[]) {
  const API_KEY = Bun.env.OPENAI_API_KEY;
  const openai = new OpenAIEmbeddings({
    openAIApiKey: API_KEY,
  });

  const embeddings = await openai.embedDocuments(data.map((d) => dataToString(d)));

  // TODO: better type this as record?
  const embedData = data.map((d, i) => ({
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
