import { Signal, UserAction } from "firstbatch";
import { SignalType } from "../types";

export default {
  /** Constants related to the server. */
  SERVER: {
    PORT: parseInt(Bun.env.ELYSIA_PORT || "8080"),
  },
  /** FirstBatch SKD configurations & constants. */
  FIRSTBATCH: {
    API_KEY: Bun.env.FIRSTBATCH_API_KEY,
    ALGORITHM_ID: Bun.env.FIRSTBATCH_ALGORITHM_ID,
    ALGORITHM_NAME: "CUSTOM",
    BATCH_SIZE: 12, // 12 question per refresh for UI
    VECTORDB_ID: "leet-assistant-11", // FIXME: give a better name when finished
  },
  PINECONE: {
    API_KEY: Bun.env.PINECONE_API_KEY,
    ENVIRONMENT: "gcp-starter",
    INDEX_NAME: "leet-assistant",
  },
  /** User actions for FirstBatch SDK. */
  ACTIONS: {
    solve: new UserAction(new Signal("SOLVE", 1.2)),
    retry: new UserAction(new Signal("RETRY", 1.2)),
    fail: new UserAction(new Signal("FAIL", 1.8)),
  } satisfies Record<SignalType, UserAction>,
} as const;
