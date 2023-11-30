import type { SessionObject } from "firstbatch";

/** A user session. The key is sessionId. */
export type SessionType = Record<
  string,
  {
    sdkSession: SessionObject;
    chatHistory: [string, string][];
  }
>;
