# API Reference

### Text (NOVA-T) Additions
- Comments (`//`, `/* ... */`)
- Trailing commas
- Unquoted keys (safe identifiers)
- Typed scalars:
  - `@date"2025-10-26T10:00:00Z"`
  - `42n` (BigInt)
  - `b64'...'` (binary)
  - `NaN`, `+Infinity`, `-Infinity`
- Anchors/Refs: `&id { ... }` and `*id`

### Binary (NOVA-B) v0
- Scalars: null, booleans, int32, float64, string, bigint (as decimal string), date(ms), binary
- Containers: arrays, objects
- Roadmap: anchors/refs, canonical binary for signing
