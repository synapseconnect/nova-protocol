
// Canonical NOVA-T canonicalizer: sorts object keys and strips whitespace/comments.
import { decodeNova, encodeNova } from "./index.js";

export function canonicalizeNova(text) {
  const obj = decodeNova(text);
  const sortKeys = (v) => {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v && typeof v === "object" && !(v instanceof Date) && !(v instanceof Uint8Array)) {
      const out = {};
      for (const k of Object.keys(v).sort()) out[k] = sortKeys(v[k]);
      return out;
    }
    return v;
  };
  const sorted = sortKeys(obj);
  return encodeNova(sorted).replace(/\s+$/gm, "").trim()+"\n";
}
