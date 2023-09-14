import { Map, Positionable, Sizable } from "./types";
import { isOutOfBounds } from "./utils";

/**
 * Validates the map configuration and elements, checking for the following errors:
 *
 * - "The map is invalid": When the map dimensions (height or width) are not valid (less than or equal to zero).
 * - "At least 2 elements are overlapping": When there are positionable elements (e.g., adventurers, mountains, treasures) with the same coordinates, indicating overlapping positions.
 * - "<name> (<x>, <y>) is out of bounds": Specific to adventurers, this error occurs when an adventurer's position is out of bounds based on the map dimensions.
 * - "A mountain (<x>, <y>) is out of bounds": This error occurs when a mountain's position is out of bounds based on the map dimensions.
 * - "A treasure (<x>, <y>) is out of bounds": This error occurs when a treasure's position is out of bounds based on the map dimensions.
 *
 * @param map - The map configuration, including adventurers, mountains, treasures, and dimensions.
 * @returns An array of error messages, if any validation errors are found; otherwise, an empty array.
 */
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

/**
 * Checks if a list of {@link Positionable} contains overlapping positions.
 *
 * @param positionables - An array of positionables, each defined by `x` and `y` coordinates.
 * @returns `true` if there are overlapping positions; otherwise, `false`.
 */
function isOverlapping(positionables: Positionable[]) {
  const s = new Set(positionables.map(({ x, y }) => `${x}, ${y}`));

  return s.size !== positionables.length;
}

/**
 * Checks if a map's dimensions are valid, ensuring both height and width are greater than zero.
 *
 * @param size - The size of the map to be validated, including `height` and `width`.
 * @returns `true` if the map's dimensions are valid; otherwise, `false`.
 */
function isValidMap({ height, width }: Sizable) {
  const isValidHeight = height > 0;
  const isValidWidth = width > 0;

  return isValidHeight && isValidWidth;
}
