import fs from "node:fs/promises";
import readline from "node:readline/promises";
import { filter, firstValueFrom, from, toArray } from "rxjs";

/**
 * Asynchronously reads a file from the specified **path** and returns its content as an array of strings.
 *
 * @param path - The path to the file to be read.
 * @returns A Promise that resolves to an array of strings representing the file's content.
 */
export async function read(path: string): Promise<string[]> {
  const file = await fs.open(path);
  const input = file.createReadStream();
  const lines = readline.createInterface({ input });
  const lines$ = from(lines);

  return firstValueFrom(
    lines$.pipe(
      filter((line) => !isComment(line)),
      toArray()
    )
  );
}

/**
 * Checks if the given string is a comment line.
 *
 * @param str - The input string to be checked.
 * @returns A boolean indicating whether the input string is a comment line.
 */
function isComment(str: string) {
  return /^\s*#/.test(str);
}
