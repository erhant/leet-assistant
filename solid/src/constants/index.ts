export default {
  /** Base URL for the backend. */
  BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",
  /** Welcome message for the chat screen. */
  WELCOME_MESSAGE: "Welcome! I am your Leet Assistant, how may I help you for this session?",
} as const;
