import { t } from "elysia";

/** A user action signal. */
export type SignalType = "solve" | "repeat" | "fail";

/** A user action signal. */
export const tSignalType = t.Union([t.Literal("solve"), t.Literal("repeat"), t.Literal("fail")]);
