import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DataRow } from "./types";
import { dataToSummarizedString } from "./data";

/** Creates the OpenAI client for embeddings. */
export function connectOpenAI() {
  const API_KEY = Bun.env.OPENAI_APIKEY;
  if (!API_KEY) {
    throw new Error("No OpenAI API key!");
  }

  return new OpenAIEmbeddings({
    openAIApiKey: API_KEY,
    modelName: "gpt-3.5-turbo",
  });
}

/** Using OpenAI, convert documents to embeddings. */
export async function dataToEmbeddings(
  openai: OpenAIEmbeddings,
  data: DataRow[]
) {
  return await openai.embedDocuments(
    data.map((r) => dataToSummarizedString(r))
  );
}

export async function saveEmbeddingsToFile() {
  // TODO: saves embeddings to file, with id and
}

if (import.meta.main) {
  // const index = await connect();
  // const datas = await load("leetcode_questions.csv");
}
