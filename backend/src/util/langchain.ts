import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import errors from "../errors";
import type { PromptInputType } from "../types";

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

  You have been speaking to the user for some time, where the user is denoted as "Human" and you are denoted as "Assistant".
  The chat history is given below:
  {chatHistory}
  
  Answer the following question based on the given context of LeetCode problems, and the chat history between you and this user.
  {question}
  `); // TODO: do not talk about

  const chain = RunnableSequence.from([
    {
      // NOTE: the field names here must exist within the prompt string as {field_name}
      context: (input: PromptInputType) => format.context(input.context),
      chatHistory: (input: PromptInputType) => format.chatHistory(input.chatHistory),
      question: (input: PromptInputType) => format.prompt(input.prompt),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return { model, chain };
}

export const format = {
  /** Given a chat history (an array of pairs) convert it to a string. */
  chatHistory: (chatHistory: PromptInputType["chatHistory"]): string =>
    chatHistory.map((dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`).join("\n"),
  /** Given a context (an array of documents) convert it to a string. */
  context: (context: PromptInputType["context"]): string => context.map((metadata) => metadata.data.text).join("\n"),
  /** Choose a prepared statement w.r.t a prompt. */
  prompt: (prompt: PromptInputType["prompt"]): string => {
    switch (prompt) {
      case "consult":
        return "What resources would you suggest that I should study to get better at the topics as given in the context?";
      case "describe":
        return "What do you think are the types of questions that I can solve, based on the context?";
      default:
        prompt satisfies never;
        throw errors.InvalidPromptType;
    }
  },
};
