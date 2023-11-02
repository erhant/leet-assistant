import { Index, Pinecone } from "@pinecone-database/pinecone";
import { DataRowEmbedding } from "./types";

/** Connects to the existing Pinecone index for the Leet Assistant dataset. */
export async function connectPinecone() {
  const INDEX_NAME = "leetasst";
  const ENVIRONMENT = "gcp-starter";
  const API_KEY = Bun.env.PINECONE_APIKEY;
  if (!API_KEY) {
    throw new Error("No Pinecone API key!");
  }

  const pinecone = new Pinecone({
    environment: ENVIRONMENT,
    apiKey: API_KEY,
  });

  return pinecone.Index(INDEX_NAME);
}

export async function uploadIndex(index: Index, data: DataRowEmbedding[]) {
  // TODO
  // index.upsert([
  //   {
  //   }
  // ])
}

if (import.meta.main) {
  const index = await connectPinecone();
  console.log(await index.describeIndexStats());
}
