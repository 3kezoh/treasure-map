import { writeFile } from "node:fs/promises";
import { Map, SimulationResult } from "./types";

export async function write(
  path: string,
  { height, width, mountains }: Map,
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

  const withTreasuresBase =
    treasuresLeft.length > 0
      ? [...withMountains, treasureComment]
      : withMountains;

  const withTreasures = treasuresLeft.reduce((acc, [key, value]) => {
    const [x, y] = key.split(", ");

    if (value > 0) {
      return [...acc, `T - ${x} - ${y} - ${value}`];
    }

    return acc;
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

  await writeFile(path, withAdventurers.join("\n"));
}
