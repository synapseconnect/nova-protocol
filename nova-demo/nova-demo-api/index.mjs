
import express from "express";
import { novaResponder } from "../nova-js/middleware.js"; // local path to the built package folder

const app = express();

app.get("/api/invoice/:id", novaResponder(async (req) => {
  const id = Number(req.params.id)||1;
  return {
    id: BigInt(id),
    createdAt: new Date("2025-10-26T10:00:00Z"),
    customer: { name: "Teerdev" },
    items: [
      { sku: "A1", qty: 2, price: "199.99" },
      { sku: "B2", qty: 1, price: "899.97" }
    ],
    data: new Uint8Array([1,2,3])
  };
}));

app.get("/", (req,res)=> res.send("NOVA demo API. Try /api/invoice/42"));

app.listen(3000, ()=> console.log("API on http://localhost:3000"));
