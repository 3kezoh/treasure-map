export type Orientation = "N" | "O" | "S" | "E";

export type Move = "A" | "D" | "G";

export type FileMap = `C - ${number} - ${number}`;

export type FileMountain = `M - ${number} - ${number}`;

export type FileAdventurer =
  `A - ${string} - ${number} - ${number} - ${Orientation} - ${string}`;

export type FileTreasure = `T - ${number} - ${number} - ${number}`;

interface Positionable {
  x: number;
  y: number;
}

export interface Sizable {
  height: number;
  width: number;
}

export interface Mountain extends Positionable {}

export interface Adventurer extends Positionable {
  name: string;
  orientation: Orientation;
  moves: Move[];
}

export interface Treasure extends Positionable {
  n: number;
}

export interface Map extends Sizable {
  mountains: Mountain[];
  adventurers: Adventurer[];
  treasures: Treasure[];
}

interface SimulationAdventurer extends Omit<Adventurer, "moves"> {
  treasures: number;
}

export interface SimulationResult {
  adventurers: SimulationAdventurer[];
  treasureCells: TreasureMap;
}

export type CacheKey = `${number}, ${number}`;

export interface TreasureMap {
  [key: CacheKey]: number;
}
