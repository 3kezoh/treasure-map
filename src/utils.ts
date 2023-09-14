import { Positionable, Sizable } from "./types";

/**
 * Checks if a given position is out of bounds within a specified map size.
 *
 * @param position - The position to be checked for being out of bounds, including `x` and `y` coordinates.
 * @param mapSize - The size of the map, including `width` and `height`.
 * @returns `true` if the position is out of bounds; otherwise, `false`.
 */
export function isOutOfBounds(
  { x, y }: Positionable,
  { width, height }: Sizable
) {
  const isXOutOfBounds = x < 0 || x > width;
  const isYOutOfBounds = y < 0 || y > height;

  return isXOutOfBounds || isYOutOfBounds;
}
