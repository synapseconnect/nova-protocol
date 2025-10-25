# Benchmarks & Metrics

Every NOVA response emits:
- `Server-Timing`: `total;dur=<ms>, cpuU;dur=<ms>, cpuS;dur=<ms>, bytes;desc="<n>"`
- `X-NOVA-Format`: `NOVA-B | NOVA-T | JSON`
- `X-Payload-Bytes`: payload size in bytes
- Optional `X-NOVA-Metrics` JSON if you append `?__metrics=1` to the request

**Tip:** Use `curl -I` or your browser's devtools to inspect headers.
