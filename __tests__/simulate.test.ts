import { describe, expect, it } from "vitest";
import { simulate } from "../src/simulate";
import { Move, Orientation } from "../src/types";

describe("The simulate function", () => {
  it("should simulate adventurers movements correctly", () => {
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

    const result = simulate(map);

    expect(result).toStrictEqual({
      adventurers: [
        { name: "Lara", x: 0, y: 3, orientation: "S", treasures: 3 },
      ],
      busyCells: new Set(["1, 0", "2, 1", "0, 3"]),
      treasureCells: { "0, 3": 0, "1, 3": 2 },
    });
  });

  it("should handle movements out of bounds", () => {
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
          orientation: "O" as Orientation,
          moves: ["A", "A", "A", "A", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = simulate(map);

    expect(result).toStrictEqual({
      adventurers: [
        { name: "Lara", x: 0, y: 1, orientation: "O", treasures: 0 },
      ],
      busyCells: new Set(["1, 0", "2, 1", "0, 1"]),
      treasureCells: { "0, 3": 2, "1, 3": 3 },
    });
  });

  it("should handle collisions with mountains", () => {
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
          orientation: "E" as Orientation,
          moves: ["A", "A", "A", "A", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = simulate(map);

    expect(result).toStrictEqual({
      adventurers: [
        { name: "Lara", x: 1, y: 1, orientation: "E", treasures: 0 },
      ],
      busyCells: new Set(["1, 0", "2, 1", "1, 1"]),
      treasureCells: { "0, 3": 2, "1, 3": 3 },
    });
  });

  it("should handle collisions with other adventurers", () => {
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
          orientation: "O" as Orientation,
          moves: ["A", "A"] as Move[],
        },
        {
          name: "Indiana",
          x: 0,
          y: 1,
          orientation: "S" as Orientation,
          moves: ["A", "A"] as Move[],
        },
      ],
      treasures: [
        { x: 0, y: 3, n: 2 },
        { x: 1, y: 3, n: 3 },
      ],
    };

    const result = simulate(map);

    expect(result).toStrictEqual({
      adventurers: [
        { name: "Lara", x: 0, y: 1, orientation: "O", treasures: 0 },
        { name: "Indiana", x: 0, y: 3, orientation: "S", treasures: 1 },
      ],
      busyCells: new Set(["1, 0", "2, 1", "0, 1", "0, 3"]),
      treasureCells: { "0, 3": 1, "1, 3": 3 },
    });
  });
});
