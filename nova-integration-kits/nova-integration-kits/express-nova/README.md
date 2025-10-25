
# Express NOVA Kit

## Install
```bash
npm i nova-js express
```

## Use
```js
import express from "express";
import { novaResponder } from "./middleware.js";

const app = express();
app.get("/api/demo", novaResponder(async (req) => ({
  id: 1n, when: new Date(), data: new Uint8Array([1,2,3]), note: "Hi"
})));
app.listen(3001);
```

**Benchmark**: add `?__metrics=1` and check headers:
- `Server-Timing`
- `X-NOVA-Format`
- `X-Payload-Bytes`
- `X-NOVA-Metrics` (optional JSON)
