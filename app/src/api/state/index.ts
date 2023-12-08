import { createCookieSessionStorage } from "solid-start";
import { SessionType } from "~/types";

const SESSION_COOKIE = "Cookie";
const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    // secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

/** Returns `Set-Cookie` header value. */
export async function write(request: Request, sessionId: string, data: SessionType) {
  const session = await storage.getSession(request.headers.get(SESSION_COOKIE));

  session.set(sessionId, data);
  return await storage.commitSession(session);
}

export async function read(request: Request, sessionId: string): Promise<SessionType> {
  const session = await storage.getSession(request.headers.get(SESSION_COOKIE));

  if (!session.has(sessionId)) {
    throw new Error("Session does not exist.");
  }

  const sdkSession = session.get(sessionId);
  return sdkSession;
}
