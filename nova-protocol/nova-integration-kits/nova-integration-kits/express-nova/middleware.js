
// express-nova/middleware.js
import { encodeNova, encodeNovaBinary } from "nova-js/index.js";
import { startProbe, endProbe, serverTimingHeader } from "./benchmark.js";

function choose(accept = "") {
  const items = accept.split(",").map(s => s.trim().split(";")[0]);
  if (items.includes("application/nova")) return "binary";
  if (items.includes("application/nova+json")) return "text";
  if (items.includes("application/json")) return "json";
  // fallback preference
  return "text";
}

export function novaResponder(handler) {
  return async (req, res, next) => {
    const probe = startProbe();
    try {
      const model = await handler(req, res);
      const mode = choose(req.headers["accept"] || "");

      let body, bytes, ct, fmt;
      if (mode === "binary") {
        const buf = encodeNovaBinary(model);
        body = Buffer.from(buf);
        bytes = body.byteLength;
        ct = "application/nova; version=1";
        fmt = "NOVA-B";
      } else if (mode === "text") {
        const txt = encodeNova(model);
        body = txt;
        bytes = Buffer.byteLength(txt);
        ct = "application/nova+json; version=1";
        fmt = "NOVA-T";
      } else {
        // JSON fallback (stringify BigInt safely as '123n')
        const safe = JSON.parse(JSON.stringify(model, (k,v)=> typeof v === "bigint" ? `${v}n` : v));
        const txt = JSON.stringify(safe);
        body = txt;
        bytes = Buffer.byteLength(txt);
        ct = "application/json; charset=utf-8";
        fmt = "JSON";
      }

      const metrics = endProbe(probe, bytes, { format: fmt });
      res.setHeader("Content-Type", ct);
      res.setHeader("X-NOVA-Format", fmt);
      res.setHeader("X-Payload-Bytes", String(bytes));
      res.setHeader("Server-Timing", serverTimingHeader(metrics));
      if (req.query.__metrics === "1") {
        // Optional: expose metrics JSON
        res.setHeader("X-NOVA-Metrics", JSON.stringify(metrics));
      }
      res.send(body);
    } catch (e) {
      next(e);
    }
  };
}
