import { describe, expect, it } from "vitest";
import { validate } from "../src/validate";
import { Move, Orientation } from "../src/types";

describe("The validate function", () => {
  it("should detect no errors", () => {
    const map = {
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
          orientation: "S" as Orientation,
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = validate(map);

    expect(result).toStrictEqual([]);
  });

  it("should detect that the map is invalid", () => {
    const map = {
      width: 0,
      height: 0,
      mountains: [],
      adventurers: [],
      treasures: [],
    };

    const result = validate(map);

    expect(result).toStrictEqual(["The map is invalid"]);
  });

  it("should detect that a mountain is out of bounds", () => {
    const map = {
      width: 3,
      height: 4,
      mountains: [
        { x: 1, y: -1 },
        { x: 2, y: 1 },
      ],
      adventurers: [
        {
          name: "Lara",
          x: 1,
          y: 1,
          orientation: "S" as Orientation,
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = validate(map);

    expect(result).toStrictEqual(["A mountain (1, -1) is out of bounds"]);
  });

  it("should detect that a treasure is out of bounds", () => {
    const map = {
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
          orientation: "S" as Orientation,
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"] as Move[],
        },
      ],
      treasures: [
        { x: -2, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = validate(map);

    expect(result).toStrictEqual(["A treasure (-2, 3) is out of bounds"]);
  });

  it("should detect that an adventurer is out of bounds", () => {
    const map = {
      width: 3,
      height: 4,
      mountains: [
        { x: 1, y: 0 },
        { x: 2, y: 1 },
      ],
      adventurers: [
        {
          name: "Lara",
          x: 11,
          y: 11,
          orientation: "S" as Orientation,
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = validate(map);

    expect(result).toStrictEqual(["Lara (11, 11) is out of bounds"]);
  });

  it("should detect that at least 2 elements are overlapping", () => {
    const map = {
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
          y: 0,
          orientation: "S" as Orientation,
          moves: ["A", "A", "D", "A", "D", "A", "G", "G", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = validate(map);

    expect(result).toStrictEqual(["At least 2 elements are overlapping"]);
  });
});
