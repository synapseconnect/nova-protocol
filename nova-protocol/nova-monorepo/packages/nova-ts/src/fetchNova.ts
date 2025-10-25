
import { decodeNova, decodeNovaBinary } from "./index.js";

export async function fetchNova(input: RequestInfo | URL, init: RequestInit = {}): Promise<any> {
  const headers = new Headers(init.headers || {});
  const accept = headers.get("Accept");
  if (!accept) headers.set("Accept", "application/nova, application/nova+json;q=0.9, application/json;q=0.8");
  const res = await fetch(input, { ...init, headers });
  const ct = res.headers.get("content-type") || "";
  if (ct.startsWith("application/nova")) {
    const buf = new Uint8Array(await res.arrayBuffer());
    return decodeNovaBinary(buf);
  } else if (ct.startsWith("application/nova+json")) {
    const text = await res.text();
    return decodeNova(text);
  } else if (ct.includes("application/json")) {
    return res.json();
  } else {
    const text = await res.text();
    try { return decodeNova(text); } catch { return text; }
  }
}
