
#!/usr/bin/env node
import fs from "node:fs";
import { encodeNova, decodeNova } from "./index.js";

const args = process.argv.slice(2);
if (args.length < 2 || !args.includes("--to")) {
  console.error("Usage: nova-ts --to [nova|json] <inputFile>");
  process.exit(1);
}

const toIdx = args.indexOf("--to");
const mode = args[toIdx+1];
const input = args[args.length - 1];
const text = fs.readFileSync(input, "utf8");

if (mode === "nova") {
  const obj = JSON.parse(text);
  process.stdout.write(encodeNova(obj));
} else if (mode === "json") {
  const obj = decodeNova(text);
  process.stdout.write(JSON.stringify(obj, (k,v)=> (typeof v === "bigint" ? v.toString()+"n" : v), 2));
} else {
  console.error("Unknown mode:", mode);
  process.exit(1);
}
