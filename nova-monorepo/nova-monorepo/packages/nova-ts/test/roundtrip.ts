
import { encodeNova, decodeNova, encodeNovaBinary, decodeNovaBinary, NovaValue } from "../dist/index.js";

const obj: NovaValue = {
  id: 123n,
  when: new Date("2025-10-26T10:00:00Z"),
  data: new Uint8Array([1,2,3]),
  nums: [1, 2.5, -7],
  note: "hello"
};

const txt = encodeNova(obj);
const round = decodeNova(txt) as any;
if (String(round.id) !== "123") throw new Error("BigInt roundtrip failed");

const bin = encodeNovaBinary(obj);
const back = decodeNovaBinary(bin) as any;
if (back.note !== "hello") throw new Error("Binary roundtrip failed");

console.log("nova-ts tests: OK");
