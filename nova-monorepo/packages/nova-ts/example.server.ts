
import express from "express";
import { novaResponder } from "nova-ts/middleware.js";

const app = express();
app.get("/api/demo", novaResponder(async (req) => {
  return {
    id: 1n,
    when: new Date(),
    data: new Uint8Array([1,2,3]),
    note: "Hello NOVA TS"
  };
}));

app.listen(3000, () => console.log("Demo on http://localhost:3000/api/demo"));
