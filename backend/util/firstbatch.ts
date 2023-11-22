import { FirstBatch } from "firstbatch";
import constants from "../constants";

export async function setupFirstBatch() {
  const sdk = await FirstBatch.new("api-key", {
    quantizerType: "scalar",
    batchSize: constants.FIRSTBATCH.BATCH_SIZE,
  });

  return sdk;
}
