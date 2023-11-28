import { FirstBatch } from "firstbatch";
import constants from "../constants";

export async function setupFirstBatch() {
  const API_KEY = Bun.env.FIRSTBATCH_API_KEY;
  if (!API_KEY) {
    throw new Error("No FirstBatch API key!");
  }
  const sdk = await FirstBatch.new(API_KEY, {
    quantizerType: "scalar",
    batchSize: constants.FIRSTBATCH.BATCH_SIZE,
  });

  return sdk;
}
