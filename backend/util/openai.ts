import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { DataRow, DataRowEmbedding } from "../types";
import { dataToSummarizedString } from "./data";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "langchain/schema/runnable";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import { connectPinecone } from "../util/pinecone";
import promptString from "../constants/prompt";

/** Using OpenAI, convert documents to embeddings.
 *
 * @deprecated we are using `fromText` method of langchain's Pinecone instead.
 */
export async function dataToEmbeddings(data: DataRow[]) {
  const API_KEY = Bun.env.OPENAI_API_KEY;
  const openai = new OpenAIEmbeddings({
    openAIApiKey: API_KEY,
  });

  const embeddings = await openai.embedDocuments(
    data.map((d) => dataToSummarizedString(d))
  );

  const embedData: DataRowEmbedding[] = data.map((d, i) => ({
    id: d.id.toString(),
    values: embeddings[i],
    metadata: {
      id: d.id.toString(), // needed in case the data is used for another vector store
      difficulty: d.difficulty,
      topics: d.topics,
    },
  }));

  return embedData;
}

/**
 * Sets up the LLM for RAG. Returns all intermediate objects, but you will most likely
 * be using `chain`. You can also use `model` for direct speaking to the chat bot.
 *
 * @see https://js.langchain.com/docs/expression_language/cookbook/retrieval
 */
export async function setupRAG() {
  const API_KEY = Bun.env.OPENAI_API_KEY;
  const model = new ChatOpenAI({
    openAIApiKey: API_KEY,
  });
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: API_KEY,
    }),
    {
      pineconeIndex: await connectPinecone(),
    }
  );
  const retriever = vectorStore.asRetriever();
  const prompt = PromptTemplate.fromTemplate(promptString);
  const chain = RunnableSequence.from([
    // NOTE: the field names here must exist within the prompt string as {field_name}
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return { model, retriever, prompt, chain };
}
