import { FirstBatch, Pinecone } from "firstbatch";
import constants from "../constants";
import { Index } from "@pinecone-database/pinecone";
import { DataRowMetadata } from "../types";

export async function setupFirstBatch(index: Index<DataRowMetadata>) {
  const API_KEY = Bun.env.FIRSTBATCH_API_KEY;
  if (!API_KEY) {
    throw new Error("No FirstBatch API key!");
  }
  const sdk = await FirstBatch.new(API_KEY, {
    quantizerType: "scalar",
    batchSize: constants.FIRSTBATCH.DEFAULT_BATCH_SIZE,
    verbose: true,
  });

  const vectorStore = new Pinecone(index);
  await sdk.addVdb(constants.FIRSTBATCH.VECTORDB_ID, vectorStore);

  return sdk;
}
