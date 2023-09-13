import path from "node:path";
import { read } from "./src/read";
import { write } from "./src/write";
import { simulate } from "./src/simulate";
import { parse } from "./src/parse";

async function main() {
  const treasmureMapPath = path.join(__dirname, "treasure-map.txt");
  const treasureMap = await read(treasmureMapPath);
  const parsedTreasureMap = parse(treasureMap);
  const simulated = simulate(parsedTreasureMap);

  await write(path.join(__dirname, "result.txt"), parsedTreasureMap, simulated);

  console.log(simulated);
}

main();
