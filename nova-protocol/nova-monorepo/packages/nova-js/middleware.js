
// Express middleware for NOVA content negotiation
import { encodeNova } from "./index.js";

function pick(accept, options) {
  // naive content negotiation; can be replaced with req.accepts if using Express' type lookup
  const types = (accept || "").split(",").map(s => s.split(";")[0].trim());
  const order = ["application/nova", "application/nova+json", "application/json"];
  for (const t of order) if (types.includes(t)) return t;
  return "application/json";
}

/**
 * novaResponder(handler)
 * handler(req) -> JS object (can include Date, BigInt, Uint8Array)
 */
export function novaResponder(handler) {
  return async (req, res, next) => {
    try {
      const model = await handler(req, res);
      const accept = req.headers["accept"];
      const chosen = pick(accept, {});
      if (chosen === "application/nova") {
        // In future: encodeNovaBinary
        const txt = encodeNova(model);
        res.setHeader("Content-Type", "application/nova+json; version=1");
        res.send(txt);
      } else if (chosen === "application/nova+json") {
        const txt = encodeNova(model);
        res.setHeader("Content-Type", "application/nova+json; version=1");
        res.send(txt);
      } else {
        // Fallback JSON (loses BigInt precision; stringifies BigInt)
        const safe = JSON.parse(JSON.stringify(model, (k, v) => typeof v === "bigint" ? `${v}n` : v));
        res.json(safe);
      }
    } catch (e) {
      next(e);
    }
  };
}
