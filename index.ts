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

type Move = "A" | "D" | "G";

type Adventurer =
  `A - ${string} - ${number} - ${number}} - ${Orientation} - ${string}`;

interface ParsedAdventurer {
  name: string;
  x: number;
  y: number;
  orientation: Orientation;
  moves: Move[];
}

function isAdventurer(str: string): str is Adventurer {
  return /^A - .+ - \d - \d - (N|O|S|E) - (A|D|G)+$/.test(str);
}

type Treasure = `T - ${number} - ${number} - ${number}`;

interface ParsedTreasure {
  x: number;
  y: number;
  n: number;
}

function isTreasure(str: string): str is Treasure {
  return /^T - \d - \d - \d$/.test(str);
}

function parseTreasure(treasure: Treasure): ParsedTreasure {
  const [, x, y, n] = treasure.split(" - ");

  return {
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    n: parseInt(n, 10),
  };
}

function parseAdventurer(adventurer: Adventurer): ParsedAdventurer {
  const [, name, x, y, orientation, moves] = adventurer.split(" - ");

  return {
    name,
    x: parseInt(x, 10),
    y: parseInt(y, 10),
    orientation: orientation as Orientation,
    moves: moves.split("") as Move[],
  };
}

interface ParsedMap {
  width: number;
  height: number;
  mountains: { x: number; y: number }[];
  adventurers: ParsedAdventurer[];
  treasures: ParsedTreasure[];
}

function parse(treasureMap: string[]) {
  return treasureMap.reduce<ParsedMap>(
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

const turnLeft: Record<Orientation, Orientation> = {
  N: "O",
  O: "S",
  S: "E",
  E: "N",
};

const turnRight: Record<Orientation, Orientation> = {
  N: "E",
  E: "S",
  S: "O",
  O: "N",
};

type CacheKey = `${number}, ${number}`;

interface TreasureMap {
  [key: CacheKey]: number;
}

function replace<T>(arr: T[], index: number, element: unknown) {
  return Object.assign([], arr, {
    [index]: element,
  });
}

function simulate({
  adventurers,
  treasures,
  mountains,
  width,
  height,
}: ParsedMap) {
  const busyCells = new Set<CacheKey>(
    [...mountains, ...adventurers].map<CacheKey>(({ x, y }) => `${x}, ${y}`)
  );

  const treasureCells = treasures.reduce<TreasureMap>(
    (acc, { x, y, n }) => ({
      ...acc,
      [`${x}, ${y}`]: n,
    }),
    {}
  );

  const turn = Math.max(...adventurers.map(({ moves }) => moves.length));

  const turns = Array.from({ length: turn }).reduce<(Move | undefined)[][]>(
    (acc, _turn, index) => {
      const moves = adventurers.map(({ moves }) => moves.at(index));

      return [...acc, moves];
    },
    []
  );

  return turns.reduce(
    ({ adventurers, busyCells, treasureCells }, turn) => {
      const playedTurn = turn.reduce(
        (acc, move, index) => {
          const { adventurers, busyCells, treasureCells } = acc;
          const adventurer = adventurers.at(index);

          if (!adventurer || !move) {
            return acc;
          }

          const { orientation, treasures, x, y } = adventurer;

          if (move === "D") {
            return {
              ...acc,
              adventurers: replace(adventurers, index, {
                ...adventurer,
                orientation: turnRight[orientation],
              }),
            };
          }

          if (move === "G") {
            return {
              ...acc,
              adventurers: replace(adventurers, index, {
                ...adventurer,
                orientation: turnLeft[orientation],
              }),
            };
          }

          switch (orientation) {
            case "N": {
              const cacheKey = `${x}, ${y - 1}` as CacheKey;
              const isWithinBounds = y - 1 >= 0;

              if (busyCells.has(cacheKey) || !isWithinBounds) {
                return acc;
              }

              const newBusyCells = new Set(busyCells);

              newBusyCells.delete(`${x}, ${y}`);
              newBusyCells.add(cacheKey);

              const treasureLeft = treasureCells[cacheKey];

              if (treasureLeft > 0) {
                return {
                  ...acc,
                  adventurers: replace(adventurers, index, {
                    ...adventurer,
                    y: y - 1,
                    treasures: treasures + 1,
                  }),
                  busyCells: newBusyCells,
                  treasureCells: {
                    ...treasureCells,
                    [cacheKey]: treasureLeft - 1,
                  },
                };
              }

              return {
                ...acc,
                adventurers: replace(adventurers, index, {
                  ...adventurer,
                  y: y - 1,
                }),
                busyCells: newBusyCells,
              };
            }

            case "O": {
              const cacheKey = `${x - 1}, ${y}` as CacheKey;
              const isWithinBounds = x - 1 >= 0;

              if (busyCells.has(cacheKey) || !isWithinBounds) {
                return acc;
              }

              const newBusyCells = new Set(busyCells);

              newBusyCells.delete(`${x}, ${y}`);
              newBusyCells.add(cacheKey);

              const treasureLeft = treasureCells[cacheKey];

              if (treasureLeft > 0) {
                return {
                  ...acc,
                  adventurers: replace(adventurers, index, {
                    ...adventurer,
                    x: x - 1,
                    treasures: treasures + 1,
                  }),
                  busyCells: newBusyCells,
                  treasureCells: {
                    ...treasureCells,
                    [cacheKey]: treasureLeft - 1,
                  },
                };
              }

              return {
                ...acc,
                adventurers: replace(adventurers, index, {
                  ...adventurer,
                  x: x - 1,
                }),
                busyCells: newBusyCells,
              };
            }

            case "S": {
              const cacheKey = `${x}, ${y + 1}` as CacheKey;
              const isWithinBounds = y + 1 <= height;

              if (busyCells.has(cacheKey) || !isWithinBounds) {
                return acc;
              }

              const newBusyCells = new Set(busyCells);

              newBusyCells.delete(`${x}, ${y}`);
              newBusyCells.add(cacheKey);

              const treasureLeft = treasureCells[cacheKey];

              if (treasureLeft > 0) {
                return {
                  ...acc,
                  adventurers: replace(adventurers, index, {
                    ...adventurer,
                    y: y + 1,
                    treasures: treasures + 1,
                  }),
                  busyCells: newBusyCells,
                  treasureCells: {
                    ...treasureCells,
                    [cacheKey]: treasureLeft - 1,
                  },
                };
              }

              return {
                ...acc,
                adventurers: replace(adventurers, index, {
                  ...adventurer,
                  y: y + 1,
                }),
                busyCells: newBusyCells,
              };
            }

            case "E": {
              const cacheKey = `${x + 1}, ${y}` as CacheKey;
              const isWithinBounds = x + 1 <= width;

              if (busyCells.has(cacheKey) || !isWithinBounds) {
                return acc;
              }

              const newBusyCells = new Set(busyCells);

              newBusyCells.delete(`${x}, ${y}`);
              newBusyCells.add(cacheKey);

              const treasureLeft = treasureCells[cacheKey];

              if (treasureLeft > 0) {
                return {
                  ...acc,
                  adventurers: replace(adventurers, index, {
                    ...adventurer,
                    x: x + 1,
                    treasures: treasures + 1,
                  }),
                  busyCells: newBusyCells,
                  treasureCells: {
                    ...treasureCells,
                    [cacheKey]: treasureLeft - 1,
                  },
                };
              }

              return {
                ...acc,
                adventurers: replace(adventurers, index, {
                  ...adventurer,
                  x: x + 1,
                }),
                busyCells: newBusyCells,
              };
            }
          }
        },
        {
          adventurers,
          busyCells,
          treasureCells,
        }
      );

      return playedTurn;
    },
    {
      adventurers: adventurers.map(({ moves, ...adventurer }) => ({
        ...adventurer,
        treasures: 0,
      })),
      busyCells,
      treasureCells,
    }
  );
}

function write() {}

async function main() {
  const treasmureMapPath = path.join(__dirname, "treasure-map.txt");
  const treasureMap = await read(treasmureMapPath);
  const parsedTreasmureMap = parse(treasureMap);
  const simulated = simulate(parsedTreasmureMap);

  console.log(simulated);
}

main();
