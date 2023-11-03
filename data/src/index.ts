import { loadData } from "./data";
import { connectOpenAI, dataToEmbeddings } from "./openai";
import { connectPinecone } from "./pinecone";

if (import.meta.main) {
  // load csv data
  const data = await loadData("leetcode_questions.csv");

  // convert to embeddings with OpenAI
  throw new Error("todo");
  const openai = connectOpenAI();
  const dataEmbed = await dataToEmbeddings(openai, data);
  await Bun.write("./embeddings.json", JSON.stringify(dataEmbed));

  // upload to Pinecone
  const pinecone = await connectPinecone();
  await pinecone.upsert(dataEmbed);
}
