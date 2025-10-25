
export type NovaScalar =
  | string
  | number
  | boolean
  | null
  | bigint
  | Date
  | Uint8Array;

export type NovaValue = NovaScalar | { [k: string]: NovaValue } | NovaValue[];

function isIdentKey(k: string): boolean {
  return /^[A-Za-z_]\w*$/.test(k);
}

export function encodeNova(value: NovaValue): string {
  const seen = new Map<object, string>(); let nextId = 1;
  const toB64 = (arr: Uint8Array) => {
    let s = Array.from(arr, c => String.fromCharCode(c)).join("");
    // @ts-ignore
    return (typeof btoa !== 'undefined' ? btoa(s) : Buffer.from(s, 'binary').toString('base64'));
  };
  const enc = (v: any): string => {
    if (v === Infinity) return "+Infinity";
    if (v === -Infinity) return "-Infinity";
    if (Number.isNaN(v)) return "NaN";
    if (typeof v === "bigint") return String(v) + "n";
    if (v instanceof Date) return `@date"${v.toISOString()}"`;
    if (v instanceof Uint8Array) return `b64'${toB64(v)}'`;
    switch (typeof v) {
      case "string": return JSON.stringify(v);
      case "number": return Object.is(v, -0) ? "-0" : String(v);
      case "object": {
        if (v === null) return "null";
        if (seen.has(v)) return `*${seen.get(v)}`;
        const id = `r${nextId++}`;
        seen.set(v, id);
        if (Array.isArray(v)) return `[${v.map(enc).join(", ")}]`;
        const entries = Object.entries(v).map(([k, vv]) => {
          const key = isIdentKey(k) ? k : JSON.stringify(k);
          return `${key}: ${enc(vv)}`;
        });
        return `&${id} { ${entries.join(", ")} }`;
      }
      default: return JSON.stringify(v);
    }
  };
  return `#!nova 1\n${enc(value)}\n`;
}

function fromB64(s: string): Uint8Array {
  // @ts-ignore
  const bin = (typeof atob !== 'undefined' ? atob(s) : Buffer.from(s, 'base64').toString('binary'));
  const arr = new Uint8Array(len=bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export function decodeNova(text: string): any {
  const cleaned = text
    .replace(/#!.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "")
    .trim();

  let t = cleaned
    .replace(/([,{]\s*)([A-Za-z_]\w*)(\s*:)/g, '$1"$2"$3')
    .replace(/&([A-Za-z_]\w*)\s*\{/g, '{"__anchor":"$1",')
    .replace(/\*([A-Za-z_]\w*)/g, '{"__ref":"$1"}')
    .replace(/\b@date"([^"]+)"/g, '{"__type":"date","v":"$1"}')
    .replace(/\b([0-9]+)n\b/g, '{"__type":"bigint","v":"$1"}')
    .replace(/\bb64u'([^']+)'/g, '{"__type":"b64u","v":"$1"}')
    .replace(/\bb64'([^']+)'/g, '{"__type":"b64","v":"$1"}')
    .replace(/\bNaN\b/g, '{"__type":"nan"}')
    .replace(/\+\bInfinity\b/g, '{"__type":"inf","sign":"+""}')
    .replace(/-\bInfinity\b/g, '{"__type":"inf","sign":"-"}');

  const intermediate = JSON.parse(t);

  const anchors = new Map<string, any>();
  const walk = (node: any): any => {
    if (!node || typeof node !== "object") return node;
    if (node.__type === "date") return new Date(node.v);
    if (node.__type === "bigint") return BigInt(node.v);
    if (node.__type === "b64") return fromB64(node.v);
    if (node.__type === "b64u") return fromB64(node.v.replace(/-/g,'+').replace(/_/g,'/'));
    if (node.__type === "nan") return Number.NaN;
    if (node.__type === "inf") return node.sign === "-" ? -Infinity : Infinity;
    if (Array.isArray(node)) return node.map(walk);
    if (node.__anchor) {
      const copy: any = { ...node };
      const id = copy.__anchor; delete copy.__anchor;
      anchors.set(id, copy);
      for (const k of Object.keys(copy)) copy[k] = walk(copy[k]);
      return copy;
    }
    if (node.__ref) return anchors.get(node.__ref);
    const out: any = {};
    for (const [k, v] of Object.entries(node)) out[k] = walk(v);
    return out;
  };
  return walk(intermediate);
}

// Binary stubs

// -------- NOVA-B (binary) minimal encoding --------
function u32(n:number){ const b=new Uint8Array(4); const dv=new DataView(b.buffer); dv.setUint32(0,n>>>0,false); return b; }
function f64(n:number){ const b=new Uint8Array(8); const dv=new DataView(b.buffer); dv.setFloat64(0,n,false); return b; }
function i32(n:number){ const b=new Uint8Array(4); const dv=new DataView(b.buffer); dv.setInt32(0,n|0,false); return b; }
function encUtf8(s:string){ return new TextEncoder().encode(s); }
function decUtf8(b:Uint8Array){ return new TextDecoder().decode(b); }

export function encodeNovaBinary(value: NovaValue): Uint8Array {
  const chunks: Uint8Array[] = [];
  const push = (b: Uint8Array)=> chunks.push(b);
  const concat = (): Uint8Array => {
    let len = chunks.reduce((a,c)=>a + c.byteLength,0);
    const out = new Uint8Array(len);
    let o=0; for(const c of chunks){ out.set(c,o); o+=c.byteLength; }
    return out;
  };
  const enc = (v: any): void => {
    if (v===null){ push(Uint8Array.of(0x00)); return; }
    if (v===false){ push(Uint8Array.of(0x01)); return; }
    if (v===true){ push(Uint8Array.of(0x02)); return; }
    if (typeof v==="number"){
      if (Number.isInteger(v) && v<=2147483647 && v>=-2147483648){ push(Uint8Array.of(0x03)); push(i32(v)); }
      else { push(Uint8Array.of(0x04)); push(f64(v)); }
      return;
    }
    if (typeof v==="bigint"){
      push(Uint8Array.of(0x08));
      const s = v.toString();
      const b = encUtf8(s);
      push(u32(b.byteLength)); push(b);
      return;
    }
    if (typeof v==="string"){
      push(Uint8Array.of(0x05));
      const b = encUtf8(v);
      push(u32(b.byteLength)); push(b);
      return;
    }
    if (v instanceof Date){
      push(Uint8Array.of(0x09));
      push(f64(v.getTime()));
      return;
    }
    if (v instanceof Uint8Array){
      push(Uint8Array.of(0x0A));
      push(u32(v.byteLength)); push(v);
      return;
    }
    if (Array.isArray(v)){
      push(Uint8Array.of(0x06)); push(u32(v.length));
      for (const it of v) enc(it);
      return;
    }
    if (v && typeof v==="object"){
      const entries = Object.entries(v);
      push(Uint8Array.of(0x07)); push(u32(entries.length));
      for (const [k,val] of entries){
        const kb = encUtf8(k);
        push(u32(kb.byteLength)); push(kb);
        enc(val);
      }
      return;
    }
    push(Uint8Array.of(0x05));
    const b = encUtf8(String(v));
    push(u32(b.byteLength)); push(b);
  };
  enc(value);
  return concat();
}

export function decodeNovaBinary(buf: Uint8Array): NovaValue {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let o = 0;
  const u32r = ()=>{ const v = dv.getUint32(o,false); o+=4; return v; };
  const f64r = ()=>{ const v = dv.getFloat64(o,false); o+=8; return v; };
  const i32r = ()=>{ const v = dv.getInt32(o,false); o+=4; return v; };
  const by = (n:number)=>{ const v = buf.subarray(o, o+n); o+=n; return v; };
  const dec = (): any => {
    const tag = dv.getUint8(o++);
    switch(tag){
      case 0x00: return null;
      case 0x01: return false;
      case 0x02: return true;
      case 0x03: return i32r();
      case 0x04: return f64r();
      case 0x05: { const n=u32r(); return decUtf8(by(n)); }
      case 0x06: { const n=u32r(); const a=new Array(n); for(let i=0;i<n;i++) a[i]=dec(); return a; }
      case 0x07: {
        const n=u32r(); const obj:any={};
        for (let i=0;i<n;i++){
          const kn=u32r(); const k=decUtf8(by(kn)); obj[k]=dec();
        }
        return obj;
      }
      case 0x08: { const n=u32r(); const s=decUtf8(by(n)); try { return BigInt(s); } catch { return s as any; } }
      case 0x09: return new Date(f64r());
      case 0x0A: { const n=u32r(); return by(n).slice(); }
      default: throw new Error("Unknown NOVA-B tag: "+tag);
    }
  };
  const val = dec();
  return val;
}
