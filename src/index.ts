import { read } from "./read";
import { write } from "./write";
import { simulate } from "./simulate";
import { parse } from "./parse";
import { validate } from "./validate";
import { ValidationError, isValidationError } from "./ValidationError";

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
