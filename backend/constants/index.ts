export default {
  FIRSTBATCH: {
    API_KEY: process.env.FIRSTBATCH_API_KEY,
    ALGORITHM_ID: process.env.FIRSTBATCH_ALGORITHM_ID,
    BATCH_SIZE: 5,
    VECTORDB_ID: "leet-assistant",
  },
} as const;
