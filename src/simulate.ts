import {
  Adventurer,
  CacheKey,
  Map,
  Move,
  Orientation,
  SimulationAdventurer,
  Sizable,
  TreasureMap,
} from "./types";

interface InitialValue {
  adventurers: SimulationAdventurer[];
  busyCells: Set<CacheKey>;
  treasureCells: TreasureMap;
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

export function simulate({ adventurers, treasures, mountains, ...map }: Map) {
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

  const turns = getTurns(adventurers);

  const initialValue = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    adventurers: adventurers.map(({ moves, ...adventurer }) => ({
      ...adventurer,
      treasures: 0,
    })),
    busyCells,
    treasureCells,
  };

  return turns.reduce<InitialValue>(
    (acc, turn) => simulateTurn(acc, turn, map),
    initialValue
  );
}

function simulateTurn(
  initialValue: InitialValue,
  turn: (Move | undefined)[],
  { height, width }: Sizable
) {
  return turn.reduce((acc, move, index) => {
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

        const nextBusyCells = new Set(busyCells);

        nextBusyCells.delete(`${x}, ${y}`);
        nextBusyCells.add(cacheKey);

        const treasureLeft = treasureCells[cacheKey];

        if (treasureLeft > 0) {
          return {
            ...acc,
            adventurers: replace(adventurers, index, {
              ...adventurer,
              y: y - 1,
              treasures: treasures + 1,
            }),
            busyCells: nextBusyCells,
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
          busyCells: nextBusyCells,
        };
      }

      case "O": {
        const cacheKey = `${x - 1}, ${y}` as CacheKey;
        const isWithinBounds = x - 1 >= 0;

        if (busyCells.has(cacheKey) || !isWithinBounds) {
          return acc;
        }

        const nextBusyCells = new Set(busyCells);

        nextBusyCells.delete(`${x}, ${y}`);
        nextBusyCells.add(cacheKey);

        const treasureLeft = treasureCells[cacheKey];

        if (treasureLeft > 0) {
          return {
            ...acc,
            adventurers: replace(adventurers, index, {
              ...adventurer,
              x: x - 1,
              treasures: treasures + 1,
            }),
            busyCells: nextBusyCells,
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
          busyCells: nextBusyCells,
        };
      }

      case "S": {
        const cacheKey = `${x}, ${y + 1}` as CacheKey;
        const isWithinBounds = y + 1 <= height;

        if (busyCells.has(cacheKey) || !isWithinBounds) {
          return acc;
        }

        const nextBusyCells = new Set(busyCells);

        nextBusyCells.delete(`${x}, ${y}`);
        nextBusyCells.add(cacheKey);

        const treasureLeft = treasureCells[cacheKey];

        if (treasureLeft > 0) {
          return {
            ...acc,
            adventurers: replace(adventurers, index, {
              ...adventurer,
              y: y + 1,
              treasures: treasures + 1,
            }),
            busyCells: nextBusyCells,
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
          busyCells: nextBusyCells,
        };
      }

      case "E": {
        const cacheKey = `${x + 1}, ${y}` as CacheKey;
        const isWithinBounds = x + 1 <= width;

        if (busyCells.has(cacheKey) || !isWithinBounds) {
          return acc;
        }

        const nextBusyCells = new Set(busyCells);

        nextBusyCells.delete(`${x}, ${y}`);
        nextBusyCells.add(cacheKey);

        const treasureLeft = treasureCells[cacheKey];

        if (treasureLeft > 0) {
          return {
            ...acc,
            adventurers: replace(adventurers, index, {
              ...adventurer,
              x: x + 1,
              treasures: treasures + 1,
            }),
            busyCells: nextBusyCells,
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
          busyCells: nextBusyCells,
        };
      }
    }
  }, initialValue);
}

function getTurns(adventurers: Adventurer[]) {
  const turn = Math.max(...adventurers.map(({ moves }) => moves.length));

  return Array.from({ length: turn }).reduce<(Move | undefined)[][]>(
    (acc, _turn, index) => {
      const moves = adventurers.map(({ moves }) => moves.at(index));

      return [...acc, moves];
    },
    []
  );
}

function replace<T>(arr: T[], index: number, element: unknown) {
  return Object.assign([], arr, {
    [index]: element,
  });
}
