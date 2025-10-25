
// express-nova/example.server.mjs
import express from "express";
import { novaResponder } from "./middleware.js";

const app = express();

// Example route under benchmark
app.get("/api/products/:id", novaResponder(async (req) => {
  const id = Number(req.params.id) || 1;
  return {
    id: BigInt(id),
    name: "Example Product",
    price: "1299.95",                        // decimal-as-string
    createdAt: new Date("2025-10-26T10:00Z"),
    photo: new Uint8Array([1,2,3,4,5]),     // binary demo
    tags: ["fast", "typed", "nova"],
  };
}));

app.listen(3001, () => console.log("Express on http://localhost:3001"));
