import { describe, expect, it, afterAll } from "vitest";
import { read } from "../src/read";
import mockFs from "mock-fs";

mockFs({
  "treasure-map.txt": `# Madre de Dios
C - 3 - 4
M - 1 - 0
M - 2 - 1
T - 0 - 3 - 2
T - 1 - 3 - 3
A - Lara - 1 - 1 - S - AADADAGGA`,
});

describe("The read function", () => {
  afterAll(() => {
    mockFs.restore();
  });

  it("should read lines from a file and filter out comments", async () => {
    const path = "treasure-map.txt";

    const result = await read(path);

    expect(result).toStrictEqual([
      "C - 3 - 4",
      "M - 1 - 0",
      "M - 2 - 1",
      "T - 0 - 3 - 2",
      "T - 1 - 3 - 3",
      "A - Lara - 1 - 1 - S - AADADAGGA",
    ]);
  });
});
