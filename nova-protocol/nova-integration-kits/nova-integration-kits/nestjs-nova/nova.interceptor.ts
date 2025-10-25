
// nestjs-nova/nova.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { encodeNova, encodeNovaBinary } from "nova-js/index.js";
import { startProbe, endProbe, serverTimingHeader } from "./benchmark.js";

function choose(accept = "") {
  const items = accept.split(",").map(s => s.trim().split(";")[0]);
  if (items.includes("application/nova")) return "binary";
  if (items.includes("application/nova+json")) return "text";
  if (items.includes("application/json")) return "json";
  return "text";
}

@Injectable()
export class NovaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const probe = startProbe();

    return next.handle().pipe(map((body) => {
      const mode = choose(req.headers["accept"] || "");

      let out, bytes, ct, fmt;
      if (mode === "binary") {
        const buf = encodeNovaBinary(body);
        out = Buffer.from(buf);
        bytes = out.byteLength;
        ct = "application/nova; version=1";
        fmt = "NOVA-B";
      } else if (mode === "text") {
        const txt = encodeNova(body);
        out = txt;
        bytes = Buffer.byteLength(txt);
        ct = "application/nova+json; version=1";
        fmt = "NOVA-T";
      } else {
        const safe = JSON.parse(JSON.stringify(body, (k,v)=> typeof v === "bigint" ? `${v}n` : v));
        const txt = JSON.stringify(safe);
        out = txt;
        bytes = Buffer.byteLength(txt);
        ct = "application/json; charset=utf-8";
        fmt = "JSON";
      }

      const metrics = endProbe(probe, bytes, { format: fmt });
      res.setHeader("Content-Type", ct);
      res.setHeader("X-NOVA-Format", fmt);
      res.setHeader("X-Payload-Bytes", String(bytes));
      res.setHeader("Server-Timing", serverTimingHeader(metrics));
      if (req.query?.__metrics === "1") {
        res.setHeader("X-NOVA-Metrics", JSON.stringify(metrics));
      }
      return out;
    }));
  }
}
