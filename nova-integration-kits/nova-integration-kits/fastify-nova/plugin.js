
// fastify-nova/plugin.js
import fp from "fastify-plugin";
import { encodeNova, encodeNovaBinary } from "nova-js/index.js";
import { startProbe, endProbe, serverTimingHeader } from "./benchmark.js";

function choose(accept = "") {
  const items = accept.split(",").map(s => s.trim().split(";")[0]);
  if (items.includes("application/nova")) return "binary";
  if (items.includes("application/nova+json")) return "text";
  if (items.includes("application/json")) return "json";
  return "text";
}

async function novaPlugin(fastify, opts) {
  fastify.decorateReply("sendNova", function(model) {
    const probe = startProbe();
    const mode = choose(this.request.headers["accept"] || "");

    let payload, bytes, ct, fmt;
    if (mode === "binary") {
      const buf = encodeNovaBinary(model);
      payload = Buffer.from(buf);
      bytes = payload.byteLength;
      ct = "application/nova; version=1";
      fmt = "NOVA-B";
    } else if (mode === "text") {
      const txt = encodeNova(model);
      payload = txt;
      bytes = Buffer.byteLength(txt);
      ct = "application/nova+json; version=1";
      fmt = "NOVA-T";
    } else {
      const safe = JSON.parse(JSON.stringify(model, (k,v)=> typeof v === "bigint" ? `${v}n` : v));
      const txt = JSON.stringify(safe);
      payload = txt;
      bytes = Buffer.byteLength(txt);
      ct = "application/json; charset=utf-8";
      fmt = "JSON";
    }

    const metrics = endProbe(probe, bytes, { format: fmt });
    this.header("Content-Type", ct);
    this.header("X-NOVA-Format", fmt);
    this.header("X-Payload-Bytes", String(bytes));
    this.header("Server-Timing", serverTimingHeader(metrics));
    if (this.request.query?.__metrics === "1") {
      this.header("X-NOVA-Metrics", JSON.stringify(metrics));
    }
    this.send(payload);
  });
}

export default fp(novaPlugin, { name: "fastify-nova" });
