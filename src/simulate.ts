import {
  Adventurer,
  CacheKey,
  Map,
  Move,
  Orientation,
  Positionable,
  SimulationAdventurer,
  Sizable,
  TreasureMap,
} from "./types";
import { isOutOfBounds } from "./utils";

interface InitialValue {
  adventurers: SimulationAdventurer[];
  busyCells: Set<CacheKey>;
  treasureCells: TreasureMap;
}

/**
 * Defines a mapping of orientations to their respective orientations when turning left.
 */
const turnLeft: Record<Orientation, Orientation> = {
  N: "O", // When facing North (N), turning left results in facing West (O).
  O: "S", // When facing West (O), turning left results in facing South (S).
  S: "E", // When facing South (S), turning left results in facing East (E).
  E: "N", // When facing East (E), turning left results in facing North (N).
};

/**
 * Defines a mapping of orientations to their respective orientations when turning right.
 */
const turnRight: Record<Orientation, Orientation> = {
  N: "E", // When facing North (N), turning right results in facing East (E).
  E: "S", // When facing East (E), turning right results in facing South (S).
  S: "O", // When facing South (S), turning right results in facing West (O).
  O: "N", // When facing West (O), turning right results in facing North (N).
};

/**
 * Simulates the movement and actions of adventurers on a map.
 *
 * @param map - The map configuration, including adventurers, treasures, mountains, and dimensions.
 * @returns An object containing the final state after simulating all adventurer moves.
 */
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

/**
 * Simulates a single turn of an adventurer, including their movement and actions.
 *
 * @param initialValue - The initial state for the current turn.
 * @param turn - The list of moves for the current turn.
 * @param map - The map configuration, including dimensions.
 * @returns An object containing the updated state after the current turn.
 */
function simulateTurn(
  initialValue: InitialValue,
  turn: (Move | undefined)[],
  map: Sizable
) {
  return turn.reduce((acc, move, index) => {
    const { adventurers } = acc;
    const adventurer = adventurers.at(index);

    if (!adventurer || !move) {
      return acc;
    }

    const { orientation, x, y } = adventurer;

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

    const getNextMove = withMove(acc, map, index);

    switch (orientation) {
      case "N": {
        const cacheKey = `${x}, ${y - 1}` as CacheKey;

        return getNextMove(cacheKey, { y: y - 1 });
      }

      case "O": {
        const cacheKey = `${x - 1}, ${y}` as CacheKey;

        return getNextMove(cacheKey, { x: x - 1 });
      }

      case "S": {
        const cacheKey = `${x}, ${y + 1}` as CacheKey;

        return getNextMove(cacheKey, { y: y + 1 });
      }

      case "E": {
        const cacheKey = `${x + 1}, ${y}` as CacheKey;

        return getNextMove(cacheKey, { x: x + 1 });
      }
    }
  }, initialValue);
}

/**
 * Gets the list of adventurer moves for each turn.
 *
 * @remark No restrictions are placed on adventurers' movements, so some can do more than others, hence the type (Move | undefined).
 *
 * @param adventurers - An array of adventurers.
 * @returns An array of move sequences for each turn.
 */
function getTurns(adventurers: Adventurer[]): (Move | undefined)[][] {
  const turn = Math.max(...adventurers.map(({ moves }) => moves.length));

  return Array.from({ length: turn }).reduce<(Move | undefined)[][]>(
    (acc, _turn, index) => {
      const moves = adventurers.map(({ moves }) => moves.at(index));

      return [...acc, moves];
    },
    []
  );
}

/**
 * Replaces an element at a specified index in an array with a new element.
 *
 * @param arr - The original array.
 * @param index - The index at which to replace the element.
 * @param element - The new element to replace the existing one.
 * @returns A new array with the specified element replaced.
 */
function replace<T>(arr: T[], index: number, element: unknown) {
  return Object.assign([], arr, {
    [index]: element,
  });
}

/**
 * Returns a function that updates the adventurer's position and state based on a move.
 *
 * @param acc - The current state.
 * @param map - The map configuration.
 * @param index - The index of the adventurer in the adventurers array.
 * @returns A function that updates the adventurer's state based on a move.
 */
function withMove(acc: InitialValue, map: Sizable, index: number) {
  const { adventurers, treasureCells, busyCells } = acc;

  const adventurer = adventurers.at(index);

  if (!adventurer) {
    return () => acc;
  }

  const { treasures, x, y } = adventurer;

  return (cacheKey: CacheKey, positions: Partial<Positionable>) => {
    if (
      busyCells.has(cacheKey) ||
      isOutOfBounds({ ...adventurer, ...positions }, map)
    ) {
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
          treasures: treasures + 1,
          ...positions,
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
        ...positions,
      }),
      busyCells: nextBusyCells,
    };
  };
}
