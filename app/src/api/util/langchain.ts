import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import type { PromptInputType } from "../../types";
import constants from "../constants";

/**
 * Sets up the LLM for RAG. Returns all intermediate objects, but you will most likely
 * be using `chain`. You can also use `model` for direct speaking to the chat bot.
 *
 * @see https://js.langchain.com/docs/expression_language/cookbook/retrieval
 */
export async function setupRAG() {
  const API_KEY = process.env.OPENAI_API_KEY;
  const model = new ChatOpenAI({
    openAIApiKey: API_KEY,
    timeout: 40_000,
  });
  const prompt = PromptTemplate.fromTemplate(constants.PROMPTS.template);
  const chain = RunnableSequence.from([
    {
      // NOTE: the field names here must exist within the prompt string as {field_name}
      context: (input: PromptInputType) => format.context(input.context),
      // chatHistory: (input: PromptInputType) => format.chatHistory(input.chatHistory),
      question: (input: PromptInputType) => format.prompt(input.prompt),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  return { model, chain };
}

export const format = {
  /** Given a context (an array of documents) convert it to a string. */
  context: (context: PromptInputType["context"]): string => context.map((question) => question.text).join("\n"),
  /** Choose a prepared statement w.r.t a prompt. */
  prompt: (prompt: PromptInputType["prompt"]): string => constants.PROMPTS[prompt],
};
