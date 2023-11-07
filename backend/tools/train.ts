import { dataToSummarizedString, loadData } from "../util/data";
import { connectPinecone } from "../util/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { DataRowMetadata } from "../types";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecordId } from "@pinecone-database/pinecone";

if (import.meta.main) {
  console.log("Loading & parsing CSV data...");
  const data = await loadData("./data/leetcode_questions.csv").then((d) =>
    d.slice(0, 10)
  );
  const dataStrings: string[] = data.map((d) => dataToSummarizedString(d));
  const dataMetadatas: (DataRowMetadata & { id: RecordId })[] = data.map(
    (d) => ({
      difficulty: d.difficulty,
      topics: d.topics,
      id: d.id.toString(),
    })
  );
  console.log(`Loaded ${data.length} items.`);
  console.log("Generating & uploading embeddings...");
  if (dataStrings.length !== dataMetadatas.length) {
    throw new Error("Length mismatch between data and metadata!");
  }
  const pinecone = await connectPinecone();
  const vectorStore = await PineconeStore.fromTexts(
    dataStrings,
    dataMetadatas,
    new OpenAIEmbeddings({
      openAIApiKey: Bun.env.OPENAI_API_KEY,
    }),
    {
      pineconeIndex: pinecone,
    }
  );

  console.log("Done! Fetching index stats...");
  const stats = await vectorStore.pineconeIndex.describeIndexStats();
  console.log(stats);
}
