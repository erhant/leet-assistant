import { dataToSummarizedString, loadData } from "../util/data";
import { connectPinecone } from "../util/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import type { DataRow, DataRowMetadata } from "../types";

if (import.meta.main) {
  console.log("Loading & parsing CSV data...");
  const data: DataRow[] = await loadData("./data/leetcode_questions.csv");
  const dataStrings: string[] = data.map((d) => dataToSummarizedString(d));
  const dataMetadatas: DataRowMetadata[] = data.map((d) => ({
    difficulty: d.difficulty,
    topics: d.topics,
    id: d.id.toString(),
  }));
  console.log(`Loaded ${data.length} items.`);
  console.log("Generating & uploading embeddings...");
  if (dataStrings.length !== dataMetadatas.length) {
    throw new Error("Length mismatch between data and metadata!");
  }

  const pinecone = await connectPinecone();

  // FIXME: batching was done because I kept getting 503 error code,
  // but it turns out that Openai is down (https://status.openai.com/)
  //
  // we might not batching at all
  const batchSize = 50;
  for (let i = 0; i < dataStrings.length; i += batchSize) {
    console.log(`\t[${i}/${dataStrings.length}]`);
    await PineconeStore.fromTexts(
      dataStrings.slice(i, i + batchSize),
      dataMetadatas.slice(i, i + batchSize),
      new OpenAIEmbeddings({
        openAIApiKey: Bun.env.OPENAI_API_KEY,
      }),
      {
        pineconeIndex: pinecone,
      }
    );
  }

  console.log("Done! Fetching index stats...");
  const stats = await pinecone.describeIndexStats();
  console.log(stats);
}
