import { Index, Pinecone } from "@pinecone-database/pinecone";
import { QuestionPineconeRecord, Question } from "../types";

/** Connects to an existing Pinecone index.
 *
 * @param indexName index name, defaults to `leetasst`
 * @param environment environment name, defaults to `gcp-starter`
 */
export async function connectPinecone(indexName = "leetasst", environment = "gcp-starter") {
  const API_KEY = Bun.env.PINECONE_API_KEY;
  if (!API_KEY) {
    throw new Error("No Pinecone API key!");
  }

  const pinecone = new Pinecone({
    environment: environment,
    apiKey: API_KEY,
  });

  return pinecone.Index<Question>(indexName);
}
