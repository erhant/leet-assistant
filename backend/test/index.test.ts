import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { edenTreaty } from "@elysiajs/eden";
import { type ServerType, startServer } from "../src";
import { prettyBatch } from "../src/util";

const BASE_URL = "http://localhost:8080";

describe("create a session", () => {
  const app = edenTreaty<ServerType>(BASE_URL);
  let server: ServerType;
  let sessionId: string;

  beforeAll(async () => {
    server = await startServer();
  });

  describe("session", () => {
    it("should start a new session", async () => {
      const response = await app["new-session"].post();
      expect(response.error).toBe(null);
      expect(typeof response.data?.sessionId).toBe("string");

      sessionId = response.data!.sessionId;
    });

    it("should get session", async () => {
      const response = await app["get-session"].post({ sessionId });
      expect(response.error).toBe(null);

      const data = response.data;
      if (data) {
        expect(data.session.sdkSession.id).toBe(sessionId);
      } else {
        expect(data).not.toBe(null);
      }
    });
  });

  describe("batch", () => {
    it("should get a batch of questions", async () => {
      const response = await app.batch.post({
        sessionId,
      });

      if (response.data) {
        const batch = response.data.batch;
        console.log(prettyBatch(batch));
      } else {
        expect(response.data).not.toBe(null);
      }
    });
  });

  describe.todo("signal", () => {});

  describe.skip("prompt", () => {
    it("should get a 'describe' prompt", async () => {
      const response = await app.prompt.post({
        prompt: "describe",
        sessionId,
      });
      expect(response.data).not.toBe(null);
      console.log(response.data);
    });

    it("should get a 'consult' prompt", async () => {
      const response = await app.prompt.post({
        prompt: "consult",
        sessionId: sessionId,
      });
      expect(response.data).not.toBe(null);
      console.log(response.data);
    });
  });

  afterAll(() => {
    server.server?.stop(true);
  });
});
