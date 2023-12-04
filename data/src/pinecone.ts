import { Index, Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import type { Question } from "./types";

/** Connects to an existing Pinecone index.
 * @param indexName index name, defaults to `leetasst`
 * @param environment environment name, defaults to `gcp-starter`
 */
export async function connectPinecone(indexName = "leet-assistant", environment = "gcp-starter") {
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

/** Update records to Pinecone.
 * @deprecated we are using `fromText` method of langchain's Pinecone instead.
 */
export async function uploadPinecone(index: Index<Question>, data: PineconeRecord<Question>[]) {
  await index.upsert(data);
}

if (import.meta.main) {
  console.log("Fetching information about Pinecone index:");
  const pinecone = await connectPinecone();
  const stats = await pinecone.describeIndexStats();
  console.log(stats);

  // also fetch a vector to see the result
  // const vec = await pinecone.fetch(["f0f289d1-9b4a-4ebe-a284-0aac8b8ca582"]);
  // if (vec.records) {
  //   for (const key in vec.records) {
  //     console.log(vec.records[key].metadata);
  //   }
  // }
}
