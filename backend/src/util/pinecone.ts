import { Pinecone } from "@pinecone-database/pinecone";
import { Question } from "../types";
import constants from "../constants";

/** Connects to the Pinecone index for Leet Assistant. */
export async function connectPinecone() {
  if (!constants.PINECONE.API_KEY) {
    throw new Error("No Pinecone API key!");
  }

  const pinecone = new Pinecone({
    environment: constants.PINECONE.ENVIRONMENT,
    apiKey: constants.PINECONE.API_KEY,
  });

  return pinecone.Index<Question>(constants.PINECONE.INDEX_NAME);
}
