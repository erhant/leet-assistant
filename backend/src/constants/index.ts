import { Signal, UserAction } from "firstbatch";

export default {
  /** FirstBatch SKD configurations & constants. */
  FIRSTBATCH: {
    API_KEY: Bun.env.FIRSTBATCH_API_KEY,
    ALGORITHM_ID: Bun.env.FIRSTBATCH_ALGORITHM_ID,
    ALGORITHM_NAME: "SIMPLE", // FIXME: this should be CUSTOM
    DEFAULT_BATCH_SIZE: 3,
    PROMPT_BATCH_SIZE: 20,
    VECTORDB_ID: "leet-assistant", // leet-assistant-pinecone-145
  },
  PINECONE: {
    API_KEY: Bun.env.PINECONE_API_KEY,
    ENVIRONMENT: "gcp-starter",
    INDEX_NAME: "leet-assistant",
  },
  /** User actions for FirstBatch SDK. */
  ACTIONS: {
    SOLVE: new UserAction(new Signal("SOLVE", 1.2)),
    REPEAT: new UserAction(new Signal("REPEAT", 1.2)),
    FAIL: new UserAction(new Signal("FAIL", 1.2)),
  },
} as const;
