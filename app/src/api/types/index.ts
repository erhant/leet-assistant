import { SessionObject } from "firstbatch";
import { PromptType, QuestionBatch, SignalType } from "~/types";

/** Types for [batch route](../../routes/api/batch.ts) */
export type EndpointBatch = {
  req: {
    session: SessionObject;
  };
  res: QuestionBatch[1];
};

/** Types for [prompt route](../../routes/api/prompt.ts) */
export type EndpointPrompt = {
  req: {
    session: SessionObject;
    ids: string[];
    prompt: PromptType;
  };
  res: [string, string];
};

/** Types for [session route](../../routes/api/session.ts) */
export type EndpointSession = {
  req: {};
  res: SessionObject;
};

/** Types for [session route](../../routes/api/session.ts) */
export type EndpointSignal = {
  req: {
    session: SessionObject;
    signal: SignalType;
    contentId: string;
  };
  res: {
    ok: boolean;
  };
};
