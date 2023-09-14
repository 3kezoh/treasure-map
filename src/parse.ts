import {
  Adventurer,
  FileAdventurer,
  FileMap,
  FileMountain,
  FileTreasure,
  Map,
  Move,
  Orientation,
  Sizable,
  Treasure,
} from "./types";

/**
 * This function parses an array of strings and extracts different categories
 * of information such as mountains, adventurers, treasures, etc.
 *
 * @param strings - An array of strings containing the data to be parsed.
 * @returns A {@link Map} object containing the extracted information.
 */
export function parse(strings: string[]): Map {
  return strings.reduce<Map>(
    (acc, str) => {
      if (isMap(str)) {
        const map = parseMap(str);

        return {
          ...acc,
          ...map,
        };
      }

      if (isMoutain(str)) {
        const mountain = parseMoutain(str);

        return {
          ...acc,
          mountains: [...acc.mountains, mountain],
        };
      }

      if (isAdventurer(str)) {
        const adventurer = parseAdventurer(str);

        return {
          ...acc,
          adventurers: [...acc.adventurers, adventurer],
        };
      }

      if (isTreasure(str)) {
        const treasure = parseTreasure(str);

        return {
          ...acc,
          treasures: [...acc.treasures, treasure],
        };
      }

      return acc;
    },
    {
      width: 0,
      height: 0,
      mountains: [],
      adventurers: [],
      treasures: [],
    }
  );
}

/**
 * Checks if the given string represents a {@link FileMap}.
 *
 * @param str - The input string to be checked.
 * @returns A boolean indicating whether the input string is a map entry.
 */
function isMap(str: string): str is FileMap {
  return /^C - [1-9]\d* - [1-9]\d*$/.test(str);
}

/**
 * Parses a {@link FileMap} string and extracts its **width** and **height**.
 *
 * @param map - The map entry string to be parsed.
 * @returns A {@link Sizable} object containing the **width** and **height** of the map.
 */
function parseMap(map: FileMap): Sizable {
  const [, width, height] = map.split(" - ");

  return {
    height: +height,
    width: +width,
  };
}

/**
 * Checks if the given string represents a {@link FileMountain}.
 *
 * @param str - The input string to be checked.
 * @returns A boolean indicating whether the input string is a mountain entry.
 */
function isMoutain(str: string): str is FileMountain {
  return /^M - \d+ - \d+$/.test(str);
}

/**
 * Parses a {@link FileMountain} string and extracts its **x** and **y** coordinates.
 *
 * @param mountain - The mountain entry string to be parsed.
 * @returns An object containing the **x** and **y** coordinates of the mountain.
 */
function parseMoutain(mountain: FileMountain): { x: number; y: number } {
  const [, x, y] = mountain.split(" - ");

  return {
    x: +x,
    y: +y,
  };
}

/**
 * Checks if the given string represents a {@link FileTreasure}.
 *
 * @param str - The input string to be checked.
 * @returns A boolean indicating whether the input string is a treasure entry.
 */
function isTreasure(str: string): str is FileTreasure {
  return /^T - \d+ - \d+ - [1-9]\d*$/.test(str);
}

/**
 * Parses a {@link FileTreasure} string and extracts its **x**, **y**, and **count**.
 *
 * @param treasure - The treasure entry string to be parsed.
 * @returns An object containing the **x**, **y**, and **count** of the treasure.
 */
function parseTreasure(treasure: FileTreasure): Treasure {
  const [, x, y, n] = treasure.split(" - ");

  return {
    x: +x,
    y: +y,
    n: +n,
  };
}

/**
 * Checks if the given string represents a {@link FileAdventurer}.
 *
 * @param str - The input string to be checked.
 * @returns A boolean indicating whether the input string is an adventurer entry.
 */
function isAdventurer(str: string): str is FileAdventurer {
  return /^A - .+ - \d+ - \d+ - (N|O|S|E) - (A|D|G)+$/.test(str);
}

/**
 * Parses a {@link FileAdventurer} string and extracts the adventurer's **name**, **x**, **y**,
 * **orientation**, and **moves**.
 *
 * @param adventurer - The adventurer entry string to be parsed.
 * @returns An object containing the adventurer's information.
 */
function parseAdventurer(adventurer: FileAdventurer): Adventurer {
  const [, name, x, y, orientation, moves] = adventurer.split(" - ");

  return {
    name,
    x: +x,
    y: +y,
    orientation: orientation as Orientation,
    moves: moves.split("") as Move[],
  };
}
