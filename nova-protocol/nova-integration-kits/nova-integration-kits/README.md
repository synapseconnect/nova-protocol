
# NOVA Integration Kits (Express, Fastify, NestJS)

Each kit provides:
- NOVA-T/NOVA-B content negotiation
- Built-in benchmarking (latency, bytes, CPU) via headers:
  - Server-Timing
  - X-NOVA-Format
  - X-Payload-Bytes
  - X-NOVA-Metrics (opt-in with ?__metrics=1)
- Drop-in examples

## Folders
- `express-nova/`  → `middleware.js`, `example.server.mjs`
- `fastify-nova/`  → `plugin.js`, `example.server.mjs`
- `nestjs-nova/`   → `nova.interceptor.ts`, `nova.module.ts` (+ notes)

Install `nova-js` in your projects and import the relevant file.
