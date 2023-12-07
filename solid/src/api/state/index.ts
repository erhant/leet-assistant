import { createCookieSessionStorage } from "solid-start";

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
export async function write(request: Request, sessionId: string, data: any) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  session.set(sessionId, data);
  return await storage.commitSession(session);
}

export async function read(request: Request, sessionId: string) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  const sdkSession = session.get(sessionId);
  return sdkSession;
}
