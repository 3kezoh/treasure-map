import fs from "node:fs/promises";
import { Map, SimulationResult } from "./types";

/**
 * Writes the simulation result to a file with a specified format.
 *
 * @param path - The path to the file where the simulation result will be written.
 * @param map - The map configuration, including height, width, and mountains.
 * @param simulationResult - The simulation result, including adventurers and treasureCells.
 * @returns A Promise that resolves when the file is successfully written.
 */
export async function write(
  path: string,
  { height, width, mountains }: Pick<Map, "height" | "width" | "mountains">,
  { adventurers, treasureCells }: SimulationResult
) {
  const content = [`C - ${width} - ${height}`];

  const withMountains = mountains.reduce(
    (acc, { x, y }) => [...acc, `M - ${x} - ${y}`],
    content
  );

  const treasuresLeft = Object.entries(treasureCells).filter(
    ([, value]) => value > 0
  );

  const treasureComment =
    "# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors restants}";

  const isTreasureLeft = treasuresLeft.length > 0;

  const withTreasuresBase = isTreasureLeft
    ? [...withMountains, treasureComment]
    : withMountains;

  const withTreasures = treasuresLeft.reduce((acc, [key, value]) => {
    const [x, y] = key.split(", ");

    return [...acc, `T - ${x} - ${y} - ${value}`];
  }, withTreasuresBase);

  const adventurerComment =
    "# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axevertical} - {Orientation} - {Nb. trésors ramassés}";

  const withAdventurers = adventurers.reduce(
    (acc, { name, orientation, x, y, treasures }) => [
      ...acc,
      `A - ${name} - ${x} - ${y} - ${orientation} - ${treasures}`,
    ],
    [...withTreasures, adventurerComment]
  );

  return fs.writeFile(path, withAdventurers.join("\n"));
}
