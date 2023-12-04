import { FirstBatch, Pinecone, QueryMetadata } from "firstbatch";
import constants from "../constants";
import { Index } from "@pinecone-database/pinecone";
import { Question } from "../types";

export async function setupFirstBatch(index: Index) {
  const API_KEY = Bun.env.FIRSTBATCH_API_KEY;
  if (!API_KEY) {
    throw new Error("No FirstBatch API key!");
  }
  const sdk = await FirstBatch.new(API_KEY, {
    quantizerType: "scalar",
    batchSize: constants.FIRSTBATCH.BATCH_SIZE,
    verbose: true,
  });

  const vectorStore = new Pinecone(index);
  await sdk.addVdb(constants.FIRSTBATCH.VECTORDB_ID, vectorStore);

  return sdk;
}

export function prettyBatch(batch: [string[], QueryMetadata[]]): { contentId: string; question: Question }[] {
  const [_, metadatas] = batch;

  return metadatas.map((metadata) => ({
    contentId: metadata.id,
    question: metadata.data as Question, // type-sin here
  }));
}
