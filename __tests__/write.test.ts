import mockFs from "mock-fs";
import { afterAll, describe, expect, it, vi } from "vitest";
import { write } from "../src/write";
import { Orientation } from "../src/types";
import fs from "node:fs/promises";

mockFs();

describe("The write function", () => {
  afterAll(() => {
    mockFs.restore;
  });

  it("should write the correct content to a file", async () => {
    const path = "result.txt";

    const map = {
      width: 3,
      height: 4,
      mountains: [
        { x: 1, y: 0 },
        { x: 2, y: 1 },
      ],
    };

    const simulationResult = {
      adventurers: [
        {
          name: "Lara",
          x: 0,
          y: 3,
          orientation: "S" as Orientation,
          treasures: 3,
        },
      ],
      busyCells: new Set(["1, 0", "2, 1", "0, 3"]),
      treasureCells: { "0, 3": 0, "1, 3": 2 },
    };

    const writeFileSpy = vi.spyOn(fs, "writeFile");

    await write(path, map, simulationResult);

    const expectedContent = [
      "C - 3 - 4",
      "M - 1 - 0",
      "M - 2 - 1",
      "# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}",
      "T - 1 - 3 - 2",
      "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axevertical} - {Orientation} - {Nb. trésors ramassés}",
      "A - Lara - 0 - 3 - S - 3",
    ].join("\n");

    expect(writeFileSpy).toHaveBeenCalledWith(path, expectedContent);
  });

  it("should add a comment about the treasures, if any remain", async () => {
    const path = "result.txt";

    const map = {
      width: 3,
      height: 4,
      mountains: [
        { x: 1, y: 0 },
        { x: 2, y: 1 },
      ],
    };

    const simulationResult = {
      adventurers: [
        {
          name: "Lara",
          x: 0,
          y: 3,
          orientation: "S" as Orientation,
          treasures: 3,
        },
      ],
      busyCells: new Set(["1, 0", "2, 1", "0, 3"]),
      treasureCells: { "0, 3": 0, "1, 3": 0 },
    };

    const writeFileSpy = vi.spyOn(fs, "writeFile");

    await write(path, map, simulationResult);

    const expectedContent = [
      "C - 3 - 4",
      "M - 1 - 0",
      "M - 2 - 1",
      "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axevertical} - {Orientation} - {Nb. trésors ramassés}",
      "A - Lara - 0 - 3 - S - 3",
    ].join("\n");

    expect(writeFileSpy).toHaveBeenCalledWith(path, expectedContent);
  });
});
