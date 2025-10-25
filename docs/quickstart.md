# Quick Start

Install:
```bash
npm install nova-js
```

Encode/Decode (Text):
```js
import { encodeNova, decodeNova } from "nova-js";
const data = { id: 1n, when: new Date() };
const txt = encodeNova(data);
const back = decodeNova(txt);
```

Binary:
```js
import { encodeNovaBinary, decodeNovaBinary } from "nova-js";
const buf = encodeNovaBinary(data);
const back = decodeNovaBinary(buf);
```

Fetch helper (browser/Node):
```js
import { fetchNova } from "nova-js/fetchNova.js";
const data = await fetchNova("/api/demo", {
  headers: { "Accept": "application/nova, application/nova+json;q=0.9, application/json;q=0.8" }
});
```
