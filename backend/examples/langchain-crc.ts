import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence, RunnablePassthrough } from "langchain/schema/runnable";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";

/** A conversational RAG input. */
type ConversationalRetrievalQAChainInput = {
  question: string;
  chat_history: [string, string][];
};

/** A utility function to convert a conversation history into a single string. */
function formatChatHistory(chatHistory: [string, string][]) {
  const formattedDialogueTurns = chatHistory.map(
    (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`,
  );
  return formattedDialogueTurns.join("\n");
}

async function setupConversationalRetrievalChain() {
  // our LLM is that of OpenAI
  const model = new ChatOpenAI({});

  // we will first have a question template, that takes in a chat history along with an input,
  // and condenses all these down to a single question.
  const condenseQuestionTemplate = `Given the following conversation and a follow up question, 
rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}

Follow Up Input: {question}

Standalone question:` as string;
  const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(condenseQuestionTemplate);
  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) => formatChatHistory(input.chat_history),
    },
    CONDENSE_QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ]);

  // The condensed question generated above will be fed into this chain at the
  // `question` field, and will be answered w.r.t the given context via the vector store.
  const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
` as string;
  const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate);

  const vectorStore = await HNSWLib.fromTexts(
    ["mitochondria is the powerhouse of the cell", "mitochondria is made of lipids"],
    [{ id: 1 }, { id: 2 }],
    new OpenAIEmbeddings(),
  );
  const retriever = vectorStore.asRetriever();
  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    model,
  ]);

  const conversationalRetrievalQAChain = standaloneQuestionChain.pipe(answerChain);

  return conversationalRetrievalQAChain;
}

if (import.meta.main) {
  const chain = await setupConversationalRetrievalChain();

  const result1 = await chain.invoke({
    question: "What is the powerhouse of the cell?",
    chat_history: [],
  });
  console.log(result1);
  // AIMessage { content: "The powerhouse of the cell is the mitochondria." }

  const result2 = await chain.invoke({
    question: "What are they made out of?",
    chat_history: [["What is the powerhouse of the cell?", "The powerhouse of the cell is the mitochondria."]],
  });
  console.log(result2);
  // AIMessage { content: "Mitochondria are made out of lipids." }
}
