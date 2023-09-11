import path from "node:path";
import { open } from "node:fs/promises";
import * as readline from "node:readline/promises";
import { from, toArray, firstValueFrom, filter } from "rxjs";

function isComment(str: string) {
  return /^\s*#/.test(str);
}

async function read(path: string): Promise<string[]> {
  const filehandle = await open(path);
  const input = filehandle.createReadStream();
  const lines = readline.createInterface({ input });
  const lines$ = from(lines);

  const treasureMap = await firstValueFrom(
    lines$.pipe(
      filter((line) => !isComment(line)),
      toArray()
    )
  );

  return treasureMap;
}

type Map = `C - ${number} - ${number}`;

function isMap(str: string): str is Map {
  return /^C - \d - \d$/.test(str);
}

function parseMap(map: Map): { width: number; height: number } {
  const [, width, height] = map.split(" - ");

  return {
    height: parseInt(height, 10),
    width: parseInt(width, 10),
  };
}

type Mountain = `M - ${number} - ${number}`;

function isMoutain(str: string): str is Mountain {
  return /^M - \d - \d$/.test(str);
}

function parseMoutain(mountain: Mountain): { x: number; y: number } {
  const [, x, y] = mountain.split(" - ");

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
  };
}

type Orientation = "N" | "O" | "S" | "E";

type Adventurer =
  `A - ${string} - ${number} - ${number}} - ${Orientation} - ${string}`;

function isAdventurer(str: string): str is Adventurer {
  return /^A - .+ - \d - \d - (N|O|S|E) - (A|D|G)+$/.test(str);
}

function parseAdventurer(adventurer: Adventurer) {
  const [, name, x, y, orientation, moves] = adventurer.split(" - ");

  return {
    name,
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    orientation,
    moves,
  };
}

function parse(treasureMap: string[]) {
  return treasureMap.reduce(
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

      return acc;
    },
    {
      width: 0,
      height: 0,
      mountains: [],
      adventurers: [],
    } as {
      width: number;
      height: number;
      mountains: { x: number; y: number }[];
      adventurers: { x: number; y: number }[];
    }
  );
}

function simulate() {}

function write() {}

async function main() {
  const treasmureMapPath = path.join(__dirname, "treasure-map.txt");
  const treasureMap = await read(treasmureMapPath);
  const parsedTreasmureMap = parse(treasureMap);

  console.log(parsedTreasmureMap);
}

main();
