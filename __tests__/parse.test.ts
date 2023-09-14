import { describe, expect, it } from "vitest";
import { parse } from "../src/parse";

describe("The parse function", () => {
  it("should parse multiple lines", () => {
    const strings = [
      "C - 3 - 4",
      "M - 1 - 0",
      "M - 2 - 1",
      "T - 0 - 3 - 2",
      "T - 1 - 3 - 3",
      "A - Lara - 1 - 1 - S - AADADAGGA",
    ];

    const result = parse(strings);

    expect(result).toStrictEqual({
      width: 3,
      height: 4,
      mountains: [
        { x: 1, y: 0 },
        { x: 2, y: 1 },
      ],
      adventurers: [
        {
          name: "Lara",
          x: 1,
          y: 1,
          orientation: "S",
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    });
  });

  it("should not parse unknown patterns", () => {
    const strings = [
      "Carte - 3 - 4",
      "L - 2 - 2",
      "M - 2 - 1 - 3",
      "T - 0 - 3",
      "A - Lara - Croft - 1 - 1 - S",
    ];

    const result = parse(strings);

    expect(result).toStrictEqual({
      width: 0,
      height: 0,
      mountains: [],
      adventurers: [],
      treasures: [],
    });
  });
});
