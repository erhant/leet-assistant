import { Signal, UserAction } from "firstbatch";
import type { SignalType } from "../../types";
import { templatePrompt, consultPrompt, describePrompt, suggestPrompt } from "./prompts";

export default {
  /** Constants related to the server. */
  SERVER: {
    PORT: parseInt(process.env.ELYSIA_PORT || "8080"),
  },
  /** FirstBatch SKD configurations & constants. */
  FIRSTBATCH: {
    API_KEY: process.env.FIRSTBATCH_API_KEY,
    ALGORITHM_ID: process.env.FIRSTBATCH_ALGORITHM_ID,
    ALGORITHM_NAME: "CUSTOM",
    BATCH_SIZE: 12, // 12 question per refresh for UI
    VECTORDB_ID: "leet-assistant-vdbid",
  },
  /** Pinecone credentials. */
  PINECONE: {
    API_KEY: process.env.PINECONE_API_KEY,
    ENVIRONMENT: "gcp-starter",
    INDEX_NAME: "leet-assistant",
  },
  /** User actions for FirstBatch SDK. */
  ACTIONS: {
    solve: new UserAction(new Signal("SOLVE", 1)),
    retry: new UserAction(new Signal("RETRY", 1)),
    fail: new UserAction(new Signal("FAIL", 1)),
  } satisfies Record<SignalType, UserAction>,
  /** Prompts for LangChain. */
  PROMPTS: {
    template: templatePrompt,
    consult: consultPrompt,
    describe: describePrompt,
    suggest: suggestPrompt,
  },
} as const;
