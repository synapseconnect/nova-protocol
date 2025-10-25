# NOVA: Web-Native Data Format (better-than-JSON)

NOVA is a drop-in, web-native data format with a **text form (NOVA-T)** and planned **binary form (NOVA-B)**.
This package includes an encoder/decoder, an Express middleware for content negotiation, and a CLI to convert JSON ↔ NOVA.

## Features
- JSON superset-like text: comments, trailing commas, unquoted keys (safe identifiers)
- Typed scalars: dates, bigints, base64 binary, NaN/±Infinity
- Lightweight anchors & references (&id … *id)
- Safe, eval-free parsing
- Streaming-friendly (RS-delimited records supported at the decoder boundary)
- JSON fallback (content negotiation)

> Note: This is a functional reference implementation of NOVA-T (text). NOVA-B (binary) is stubbed.

## Usage (Node)
```js
import { encodeNova, decodeNova } from "nova-ts";

const obj = {
  id: 1n, // BigInt
  when: new Date("2025-10-26T10:00:00Z"),
  data: new Uint8Array([1,2,3])
};

const txt = encodeNova(obj);
console.log(txt);

const roundTrip = decodeNova(txt);
console.log(roundTrip);
```

## Express Middleware (content negotiation)
```js
import express from "express";
import { novaResponder } from "nova-ts/middleware.js"; // or .ts in TS build

const app = express();

// Example endpoint
app.get("/invoice/:id", novaResponder(async (req) => {
  // Build your model (Dates, BigInts, Uint8Array supported)
  return {
    id: 42n,
    createdAt: new Date(),
    total: "1299.95",
    customer: { name: "Teerdev" }
  };
}));

app.listen(3000, () => console.log("http://localhost:3000"));
```

**Negotiation**: The middleware picks the best of
- `application/nova`
- `application/nova+json`
- `application/json`

## CLI
```bash
# JSON -> NOVA
npx nova-ts --to nova input.json > output.nova

# NOVA -> JSON
npx nova-ts --to json input.nova > output.json
```

## Streaming
For record streams, send lines prefixed with RS (0x1E). The decoder can be adapted to parse chunks delimited by RS.

## Schema
Use JSON Schema as usual and map NOVA types via `format` or custom keywords.

## Security
- Always serve over HTTPS.
- Set size/depth limits before parsing untrusted input.
- Consider detached signatures for integrity (JWS/COSE) over **canonical NOVA** (sorted keys, normalized whitespace).

---

MIT License © 2025

### Update
- Added **NOVA-B** minimal binary codec
- Added **fetchNova** helper
