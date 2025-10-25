# 🚀 NOVA Protocol

**NOVA** (Next Object Versatile Architecture) is a next-generation data interchange format — faster, more compact, and more expressive than JSON or XML.  
It supports **binary encoding (NOVA-B)** and **text encoding (NOVA-T)**, plus **direct integration** with Express, Fastify, and NestJS.

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
