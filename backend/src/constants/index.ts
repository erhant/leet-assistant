import { Signal, UserAction } from "firstbatch";

export default {
  /** FirstBatch SKD configurations & constants. */
  FIRSTBATCH: {
    API_KEY: Bun.env.FIRSTBATCH_API_KEY,
    ALGORITHM_ID: Bun.env.FIRSTBATCH_ALGORITHM_ID,
    ALGORITHM_NAME: "CUSTOM", // FIXME: this should be CUSTOM
    BATCH_SIZE: 12,
    VECTORDB_ID: "leet-assistant-11", // leet-assistant-pinecone-145
  },
  PINECONE: {
    API_KEY: Bun.env.PINECONE_API_KEY,
    ENVIRONMENT: "gcp-starter",
    INDEX_NAME: "leet-assistant",
  },
  /** User actions for FirstBatch SDK. */
  ACTIONS: {
    SOLVE: new UserAction(new Signal("SOLVE", 1.2)),
    RETRY: new UserAction(new Signal("RETRY", 1.2)),
    FAIL: new UserAction(new Signal("FAIL", 1.2)),
  },
} as const;
