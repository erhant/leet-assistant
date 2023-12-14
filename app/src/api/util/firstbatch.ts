import { FirstBatch, Pinecone, QueryMetadata } from "firstbatch";
import constants from "../constants";
import { Index } from "@pinecone-database/pinecone";
import { Question } from "../../types";

export async function setupFirstBatch(index: Index) {
  const API_KEY = process.env.FIRSTBATCH_API_KEY;
  if (!API_KEY) {
    throw new Error("No FirstBatch API key!");
  }
  const sdk = await FirstBatch.new(API_KEY, {
    quantizerType: "scalar",
    batchSize: constants.FIRSTBATCH.BATCH_SIZE,
    verbose: true,
    enableHistory: false, // allow content to be re-used in a batch
  });

  const vectorStore = new Pinecone(index);

  // intentionally commented this out because we have already added our vectorStore
  // await sdk.addVdb(constants.FIRSTBATCH.VECTORDB_ID, vectorStore);

  // instead, we add our vectorStore to `sdk.store` directly
  sdk.store[constants.FIRSTBATCH.VECTORDB_ID] = vectorStore;

  console.log("FirstBatch Team ID:", sdk.teamId);

  return sdk;
}

export function prettyBatch(batch: [string[], QueryMetadata[]]): { contentId: string; question: Question }[] {
  const [_, metadatas] = batch;

  return metadatas.map((metadata) => ({
    contentId: metadata.id,
    question: metadata.data as Question, // type-sin here
  }));
}
