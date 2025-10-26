# 🚀 NOVA Protocol

**NOVA** is a next-generation data interchange format — faster, more compact, and more expressive than JSON or XML.  
It supports **binary encoding (NOVA-B)** and **text encoding (NOVA-T)**, with integrations for **Express**, **Fastify**, and **NestJS**.

👉 [Download Nova Protocol Specification](NOVA_Protocol_Specification_v1.0.pdf)


## Why NOVA?
- 30–60% smaller payloads than JSON (typical)
- Rich native types (BigInt, Date, Binary, Anchors/Refs in text)
- Deterministic canonicalization for signing
- Backwards-compatible with REST via content negotiation

## Quick Start
```bash
npm install nova-js
```

```js
import { encodeNova, decodeNova } from "nova-js";
const data = { id: 1n, when: new Date(), note: "Hello NOVA" };
const text = encodeNova(data);
const obj  = decodeNova(text);
```

**Binary:**
```js
import { encodeNovaBinary, decodeNovaBinary } from "nova-js";
const bytes = encodeNovaBinary(data);
const decoded = decodeNovaBinary(bytes);
```
