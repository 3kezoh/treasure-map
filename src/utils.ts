import { Positionable, Sizable } from "./types";

export function isOutOfBounds(
  { x, y }: Positionable,
  { width, height }: Sizable
) {
  const isXOutOfBounds = x < 0 || x > width;
  const isYOutOfBounds = y < 0 || y > height;

  return isXOutOfBounds || isYOutOfBounds;
}
