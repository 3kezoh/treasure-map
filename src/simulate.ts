import { CacheKey, Map, Move, Orientation, TreasureMap } from "./types";

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

export function simulate({
  adventurers,
  treasures,
  mountains,
  width,
  height,
}: Map) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      adventurers: adventurers.map(({ moves, ...adventurer }) => ({
        ...adventurer,
        treasures: 0,
      })),
      busyCells,
      treasureCells,
    }
  );
}

function replace<T>(arr: T[], index: number, element: unknown) {
  return Object.assign([], arr, {
    [index]: element,
  });
}
