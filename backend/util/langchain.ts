import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate, StringPromptValue } from "langchain/prompts";
import { RunnableSequence, RunnablePassthrough } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import { DataRowEmbedding, DataRowMetadata } from "../types";
import { PineconeRecord } from "@pinecone-database/pinecone";

/** A conversational RAG input. */
type InputType = {
  question: string;
  chatHistory: [string, string][];
  context: PineconeRecord<DataRowMetadata>[];
};

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
  const prompt = PromptTemplate.fromTemplate(`You are "Leet Assistant".

  "Leet Assistant" is a chat-bot designed to help programmers choose computer science problems to study, 
  based on the topics that they feel they are weak at.
  
  The problems are taken from LeetCode, which is a popular online platform that provides a collection of
  coding challenges that are often used for technical interviews, particularly in the software engineering and computer science fields.
  Here is a set of these problems relevant to this conversation, describing the question topics and such:
  {context}
  
  Answer the following question based on the given context of LeetCode problems, and the chat history between you and this user.
  {question}
  `);

  const chain = RunnableSequence.from([
    {
      // NOTE: the field names here must exist within the prompt string as {field_name}
      context: (input: InputType) => formatContext(input.context),
      chatHistory: (input: InputType) => formatChatHistory(input.chatHistory),
      question: (input: InputType) => input.question,
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return { model, chain };
}

/** Given a chat history (an array of pairs) convert it to a string. */
function formatChatHistory(chatHistory: InputType["chatHistory"]): string {
  return chatHistory.map((dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`).join("\n");
}

/** Given a context (an array of documents) convert it to a string. */
function formatContext(context: InputType["context"]): string {
  const undefinedMetadatas = context.filter((doc) => doc.metadata === undefined);
  if (undefinedMetadatas.length !== 0) {
    throw new Error("Undefined metadata for:\n" + undefinedMetadatas.map((doc) => doc.id).join("\n"));
  }
  return context
    .map((doc) => {
      // @ts-expect-error because Pinecone DOES return `text` in metadata, but has not typed it...
      return doc.metadata!.text;
    })
    .join("\n");
}
