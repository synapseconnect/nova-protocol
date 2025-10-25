
import type { Request, Response, NextFunction } from "express";
import { encodeNova } from "./index.js";

function pick(accept: string | undefined): string {
  if (!accept) return "application/json";
  const types = accept.split(",").map(s => s.split(";")[0].trim());
  const order = ["application/nova", "application/nova+json", "application/json"];
  for (const t of order) if (types.includes(t)) return t;
  return "application/json";
}

export function novaResponder(handler: (req: Request, res: Response) => any | Promise<any>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const model = await handler(req, res);
      const chosen = pick(req.headers["accept"]);
      if (chosen === "application/nova" || chosen === "application/nova+json") {
        const txt = encodeNova(model);
        res.setHeader("Content-Type", "application/nova+json; version=1");
        res.send(txt);
      } else {
        const safe = JSON.parse(JSON.stringify(model, (k, v) => typeof v === "bigint" ? `${v}n` : v));
        res.json(safe);
      }
    } catch (e) { next(e as Error); }
  };
}
