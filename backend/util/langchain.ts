import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate, StringPromptValue } from "langchain/prompts";
import { RunnableSequence, RunnablePassthrough } from "langchain/schema/runnable";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";
import { connectPinecone } from "./pinecone";

/** A conversational RAG input. */
type PromptInputType = {
  question: string;
  chat_history: [string, string][];
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
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: API_KEY,
    }),
    {
      pineconeIndex: await connectPinecone(),
    },
  );
  const retriever = vectorStore.asRetriever();
  const prompt = PromptTemplate.fromTemplate(`You are "Leet Assistant".

  "Leet Assistant" is a chat-bot designed to help programmers choose computer science problems to study, 
  based on the topics that they feel they are weak at.
  
  The problems are taken from LeetCode, which is a popular online platform that provides a collection of
  coding challenges that are often used for technical interviews, particularly in the software engineering and computer science fields.
  Here is a context of these problems, describing their topics and such:
  {context}
  
  Answer the following question based on your knowledge about LeetCode and its problem sets & topics as given in the context above:
  {question}
  `);

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

// FIXME: do we need this?
/** Given a chat history (an array of pairs) convert it to a string. */
function formatChatHistory(chatHistory: [string, string][]) {
  const formattedDialogueTurns = chatHistory.map(
    (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`,
  );
  return formattedDialogueTurns.join("\n");
}
