import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { edenTreaty } from "@elysiajs/eden";
import { type ServerType, startServer } from "../src";
import { prettyBatch } from "../src/util";
import constants from "../src/constants";

// enable for logs
const VERBOSE = false;

describe("create a session", () => {
  const app = edenTreaty<ServerType>("http://localhost:" + constants.SERVER.PORT);
  let server: ServerType;
  let sessionId: string;
  let contentId: string;

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
      expect(response.status).toBe(200);

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
      expect(response.status).toBe(200);

      if (response.data) {
        const batch = response.data.batch;

        // save content id for the later tests with signals
        contentId = batch[1][0].id;
        if (VERBOSE) console.log(prettyBatch(batch));
      } else {
        expect(response.data).not.toBe(null);
      }
    });
  });

  describe("signal", () => {
    (["fail", "retry", "solve"] as const).map((signal) =>
      it(`should signal "${signal}" and get a batch`, async () => {
        const signalResponse = await app.signal.post({
          sessionId,
          contentId,
          signal,
        });
        expect(signalResponse.status).toBe(200);

        const batchResponse = await app.batch.post({
          sessionId,
        });
        expect(batchResponse.status).toBe(200);
        if (batchResponse.data) {
          const batch = batchResponse.data.batch;
          // TODO: add expect
        } else {
          expect(batchResponse.data).not.toBe(null);
        }
      }),
    );
  });

  describe("prompt", () => {
    (["describe", "consult"] as const).map((prompt) =>
      it(`should get a "${prompt}" prompt`, async () => {
        const response = await app.prompt.post({
          sessionId,
          prompt,
        });
        expect(response.status).not.toBe(200);
        expect(response.data).not.toBe(null);
        expect(typeof response.data).not.toBe("string");

        if (VERBOSE) console.log(response.data?.[1]);
      }),
    );
  });

  afterAll(() => {
    server.server?.stop(true);
  });
});
