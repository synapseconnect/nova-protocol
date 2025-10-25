
// fastify-nova/example.server.mjs
import Fastify from "fastify";
import novaPlugin from "./plugin.js";

const app = Fastify();
await app.register(novaPlugin);

app.get("/api/order/:id", async (req, reply) => {
  const id = Number(req.params.id) || 1;
  const model = {
    id: BigInt(id),
    total: "249.75",
    createdAt: new Date(),
    data: new Uint8Array([10,20,30])
  };
  reply.sendNova(model);
});

app.listen({ port: 3002 }, () => console.log("Fastify on http://localhost:3002"));
