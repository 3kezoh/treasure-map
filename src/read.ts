import { open } from "node:fs/promises";
import * as readline from "node:readline/promises";
import { filter, firstValueFrom, from, toArray } from "rxjs";

export async function read(path: string): Promise<string[]> {
  const file = await open(path);
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

function isComment(str: string) {
  return /^\s*#/.test(str);
}
