
// Example Express server using nova-js middleware
import express from "express";
import { novaResponder } from "nova-js/middleware.js";

const app = express();

app.get("/api/demo", novaResponder(async (req) => {
  return {
    id: 1n,
    when: new Date("2025-10-26T10:00:00Z"),
    data: new Uint8Array([1,2,3]),
    note: "Hello NOVA"
  };
}));

app.listen(3000, () => console.log("Demo on http://localhost:3000/api/demo"));
