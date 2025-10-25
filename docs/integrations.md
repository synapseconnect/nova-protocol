# Integrations

## Express
```js
import express from "express";
import { novaResponder } from "kits/express-nova/middleware.js";
const app = express();
app.get("/api/demo", novaResponder(async () => ({
  id: 1n, when: new Date(), data: new Uint8Array([1,2,3])
})));
app.listen(3001);
```

## Fastify
```js
import Fastify from "fastify";
import novaPlugin from "kits/fastify-nova/plugin.js";
const app = Fastify();
await app.register(novaPlugin);
app.get("/api/demo", async (req, reply) => reply.sendNova({ hello: "world" }));
app.listen({ port: 3002 });
```

## NestJS
```ts
import { NovaModule } from "kits/nestjs-nova/nova.module";
@Module({ imports: [NovaModule] })
export class AppModule {}
```
