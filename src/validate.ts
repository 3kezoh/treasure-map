import { Map, Positionable, Sizable } from "./types";
import { isOutOfBounds } from "./utils";

export function validate({ adventurers, mountains, treasures, ...map }: Map) {
  if (!isValidMap(map)) {
    return ["The map is invalid"];
  }

  const positionables = [...adventurers, ...mountains, ...treasures];

  const errors = isOverlapping(positionables)
    ? ["At least 2 elements are overlapping"]
    : [];

  const adventurerErrors = adventurers.reduce<string[]>(
    (acc, { name, x, y }) => {
      if (isOutOfBounds({ x, y }, map)) {
        return [...acc, `${name} (${x}, ${y}) is out of bounds`];
      }

      return acc;
    },
    []
  );

  const mountainErrors = mountains.reduce<string[]>((acc, { x, y }) => {
    if (isOutOfBounds({ x, y }, map)) {
      return [...acc, `A mountain (${x}, ${y}) is out of bounds`];
    }

    return acc;
  }, []);

  const treasureErrors = treasures.reduce<string[]>((acc, { x, y }) => {
    if (isOutOfBounds({ x, y }, map)) {
      return [...acc, `A treasure (${x}, ${y}) is out of bounds`];
    }

    return acc;
  }, []);

  return [...errors, ...adventurerErrors, ...mountainErrors, ...treasureErrors];
}

function isOverlapping(positionables: Positionable[]) {
  const s = new Set(positionables.map(({ x, y }) => `${x}, ${y}`));

  return s.size !== positionables.length;
}

function isValidMap({ height, width }: Sizable) {
  const isValidHeight = height > 0;
  const isValidWidth = width > 0;

  return isValidHeight && isValidWidth;
}
