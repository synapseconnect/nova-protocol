
# Fastify NOVA Kit

## Install
```bash
npm i fastify nova-js fastify-plugin
```

## Use
```js
import Fastify from "fastify";
import novaPlugin from "./plugin.js";

const app = Fastify();
await app.register(novaPlugin);
app.get("/api/demo", async (req, reply) => reply.sendNova({ id: 1n, when: new Date() }));
app.listen({ port: 3002 });
```
Add `?__metrics=1` to see headers.
