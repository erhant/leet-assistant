import { Index, Pinecone } from "@pinecone-database/pinecone";
import { DataRowEmbedding, DataRowMetadata } from "../types";

/** Connects to the existing Pinecone index for the Leet Assistant dataset.
 *
 * @param indexName index name, defaults to `leetasst`
 * @param environment environment name, defaults to `gcp-starter`
 */
export async function connectPinecone(
  indexName = "leetasst",
  environment = "gcp-starter"
) {
  const API_KEY = Bun.env.PINECONE_API_KEY;
  if (!API_KEY) {
    throw new Error("No Pinecone API key!");
  }

  const pinecone = new Pinecone({
    environment: environment,
    apiKey: API_KEY,
  });

  return pinecone.Index<DataRowMetadata>(indexName);
}

/** Update records to Pinecone.
 *
 * @deprecated we are using `fromText` method of langchain's Pinecone instead.
 */
export async function uploadPinecone(
  index: Index<DataRowMetadata>,
  data: DataRowEmbedding[]
) {
  await index.upsert(data);
}

if (import.meta.main) {
  const index = await connectPinecone();
  console.log(await index.describeIndexStats());
}
