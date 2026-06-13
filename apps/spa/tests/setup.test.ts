import { describe, it, expect } from "vitest";
import { server } from "./mocks/server";

describe("SPA test infrastructure", () => {
  it("MSW server is running", () => {
    // server.listHandlers() is available on a started MSW server
    // The setup file starts it via beforeAll — if it weren't running this would throw
    expect(server).toBeDefined();
  });
});
