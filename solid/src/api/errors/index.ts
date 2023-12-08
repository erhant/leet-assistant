// FIXME: remove these, just throw where you need
export default {
  InvalidSession: new Error("Invalid session."),
  InvalidSignal: new Error("Invalid signal."),
  InvalidPromptType: new Error("Invalid prompt type."),
  AddSignalFailed: new Error("Failed to add signal."),
} as const;
