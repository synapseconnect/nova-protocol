# 🚀 NOVA Protocol

**NOVA** (Next Object Versatile Architecture) is a next-generation data interchange format — faster, more compact, and more expressive than JSON or XML.  
It supports **binary encoding (NOVA-B)** and **text encoding (NOVA-T)**, plus **direct integration** with Express, Fastify, and NestJS.

For more info: https://synapseconnect.github.io/nova-protocol

---

## 🌍 Overview

| Feature | NOVA-T (Text) | NOVA-B (Binary) |
|----------|---------------|----------------|
| Human-readable | ✅ Yes | ❌ No |
| Supports BigInt, Date, Binary | ✅ | ✅ |
| Cross-language compatible | ✅ | ✅ |
| Streaming-friendly | ✅ | ✅ |
| Compact size | ⚙️ Medium | ⚡ Very Small |
| Encoding speed | ⚙️ Medium | ⚡ Very Fast |

---

## 📦 Included in This Repository

| Folder | Description |
|--------|--------------|
| `nova-monorepo/` | Workspace setup for JS & TS builds with CI and npm publish automation |
| `packages/` | Standalone `nova-js` and `nova-ts` packages |
| `demos/` | End-to-end demo API + browser client |
| `kits/` | Drop-in integration kits for Express, Fastify, and NestJS (with built-in benchmarking) |
| `.github/workflows/` | Ready-to-use CI + npm publish workflows |

---

## ⚙️ Quick Start (Node)

```bash
npm install nova-js


Encode / Decode

import { encodeNova, decodeNova } from "nova-js";

const data = { id: 1n, when: new Date(), note: "Hello NOVA" };
const text = encodeNova(data);           // NOVA-T string
const obj  = decodeNova(text);           // Back to object


Binary Encoding

import { encodeNovaBinary, decodeNovaBinary } from "nova-js";

const bytes = encodeNovaBinary(data);    // Uint8Array (binary)
const decoded = decodeNovaBinary(bytes); // Back to object

🧩 Integrations
Express
import { novaResponder } from "kits/express-nova/middleware.js";
app.get("/api/demo", novaResponder(async () => ({
  id: 1n, name: "NOVA", data: new Uint8Array([1,2,3])
})));

Fastify
import novaPlugin from "kits/fastify-nova/plugin.js";
await app.register(novaPlugin);
app.get("/api/demo", async (req, reply) => reply.sendNova({ hello: "world" }));

NestJS

Add the NOVA module globally:

import { NovaModule } from "./kits/nestjs-nova/nova.module";
@Module({ imports: [NovaModule] })
export class AppModule {}

📊 Built-in Benchmarking

Every NOVA route automatically measures:

Response time (ms)

CPU usage

Memory delta

Payload size (bytes)

View via headers:

Server-Timing: total;dur=1.23, cpuU;dur=0.80, bytes;desc="512"
X-NOVA-Format: NOVA-B
X-Payload-Bytes: 512


Or append ?__metrics=1 to get raw JSON metrics.

🧠 Why NOVA?

30-60% smaller payloads than JSON

Rich native types (BigInt, Date, Binary, Anchors/Refs)

Self-describing and deterministic canonicalization

Drop-in compatible with existing REST APIs

🧰 Developer Setup
cd nova-monorepo
npm install
npm -w nova-ts run build
npm -w nova-js run test
npm -w nova-ts run test


To publish to npm, set NPM_TOKEN in your GitHub repo’s Actions secrets and run the Publish workflow.

🧾 License

MIT © 2025 SynapseConnect
Crafted with ❤️ by the SynapseConnect Engineering Team

