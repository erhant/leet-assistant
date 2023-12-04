import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { connectPinecone } from "./pinecone";
import { loadQuestions, questionToString } from "./question";
import { Question } from "../types";

if (import.meta.main) {
  console.log("Loading & parsing CSV data...");
  const questions: Question[] = await loadQuestions("./res/leetcode_questions.csv");
  const questionStrings: string[] = questions.map((q) => questionToString(q));
  console.log(`Loaded ${questions.length} items.`);
  console.log("Generating & uploading embeddings...");

  const pinecone = await connectPinecone();

  // NOTE: batching was done because I kept getting 503 error code,
  // but it turns out that Openai was down instead (https://status.openai.com/)
  //
  // we might not need batching at all
  const batchSize = 50;
  for (let i = 0; i < questionStrings.length; i += batchSize) {
    console.log(`\t[${i}/${questionStrings.length}]`);
    await PineconeStore.fromTexts(
      questionStrings.slice(i, i + batchSize),
      questions.slice(i, i + batchSize),
      new OpenAIEmbeddings({ openAIApiKey: Bun.env.OPENAI_API_KEY }),
      { pineconeIndex: pinecone },
    );
  }

  console.log("Done! Fetching index stats...");
  const stats = await pinecone.describeIndexStats();
  console.log(stats);
}
