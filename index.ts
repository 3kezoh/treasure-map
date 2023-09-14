import { read } from "./src/read";
import { write } from "./src/write";
import { simulate } from "./src/simulate";
import { parse } from "./src/parse";
import { validate } from "./src/validate";
import { ValidationError, isValidationError } from "./src/ValidationError";

async function main() {
  try {
    const [, , inputPath, outputPath] = process.argv;

    if (!inputPath || !outputPath) {
      throw new Error("Usage: node index.ts <input> <output>");
    }

    const treasureMap = await read(inputPath);
    const parsedTreasureMap = parse(treasureMap);
    const errors = validate(parsedTreasureMap);

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const simulated = simulate(parsedTreasureMap);

    await write(outputPath, parsedTreasureMap, simulated);
  } catch (error: unknown) {
    if (isValidationError(error)) {
      return console.error(error.message, error.errors);
    }

    console.error(error);
  }
}

main();
