import chalk from "chalk";
import { setupRAG } from "./langchain";
import { connectPinecone } from "./pinecone";
import { setupFirstBatch } from "./firstbatch";
import constants from "../constants";

export async function setupPrerequisites() {
  let msg: string;

  msg = chalk.yellow("Setup LangChain\n");
  console.time(msg);
  const { chain } = await setupRAG();
  console.timeEnd(msg);

  msg = chalk.yellow(`Setup Pinecone (index: ${constants.PINECONE.INDEX_NAME})\n`);
  console.time(msg);
  const index = await connectPinecone();
  console.timeEnd(msg);

  msg = chalk.yellow("Setup FirstBatch SDK.");
  console.time(msg);
  const personalized = await setupFirstBatch(index);
  console.log(chalk.gray("FirstBatch TeamID:", personalized.teamId));
  console.timeEnd(msg);

  return { chain, index, personalized };
}
