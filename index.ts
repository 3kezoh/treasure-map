import path from "node:path";
import { read } from "./src/read";
import { write } from "./src/write";
import { simulate } from "./src/simulate";
import { parse } from "./src/parse";
import { validate } from "./src/validate";
import { ValidationError, isValidationError } from "./src/ValidationError";

async function main() {
  try {
    const treasmureMapPath = path.join(__dirname, "treasure-map.txt");
    const treasureMap = await read(treasmureMapPath);
    const parsedTreasureMap = parse(treasureMap);
    const errors = validate(parsedTreasureMap);

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const simulated = simulate(parsedTreasureMap);
    const writePath = path.join(__dirname, "result.txt");

    await write(writePath, parsedTreasureMap, simulated);
  } catch (error: unknown) {
    if (isValidationError(error)) {
      return console.error(error.message, error.errors);
    }

    console.error(error);
  }
}

main();
