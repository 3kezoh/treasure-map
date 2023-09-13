import path from "node:path";
import { read } from "./src/read";
import { write } from "./src/write";
import { simulate } from "./src/simulate";
import { parse } from "./src/parse";

async function main() {
  const treasmureMapPath = path.join(__dirname, "treasure-map.txt");
  const treasureMap = await read(treasmureMapPath);
  const parsedTreasmureMap = parse(treasureMap);
  const simulated = simulate(parsedTreasmureMap);

  await write(
    path.join(__dirname, "result.txt"),
    parsedTreasmureMap,
    simulated
  );

  console.log(simulated);
}

main();
