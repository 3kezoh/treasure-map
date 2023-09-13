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

export function parse(strings: string[]) {
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

function isMap(str: string): str is FileMap {
  return /^C - \d - \d$/.test(str);
}

function parseMap(map: FileMap): Sizable {
  const [, width, height] = map.split(" - ");

  return {
    height: +height,
    width: +width,
  };
}

function isMoutain(str: string): str is FileMountain {
  return /^M - \d - \d$/.test(str);
}

function parseMoutain(mountain: FileMountain): { x: number; y: number } {
  const [, x, y] = mountain.split(" - ");

  return {
    x: +x,
    y: +y,
  };
}

function isTreasure(str: string): str is FileTreasure {
  return /^T - \d - \d - \d$/.test(str);
}

function parseTreasure(treasure: FileTreasure): Treasure {
  const [, x, y, n] = treasure.split(" - ");

  return {
    x: +x,
    y: +y,
    n: +n,
  };
}

function isAdventurer(str: string): str is FileAdventurer {
  return /^A - .+ - \d - \d - (N|O|S|E) - (A|D|G)+$/.test(str);
}

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
