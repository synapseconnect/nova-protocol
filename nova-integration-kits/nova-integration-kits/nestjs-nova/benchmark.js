
// benchmark.js — tiny helpers for latency, cpu and payload bytes
export function startProbe() {
  return {
    t0: process.hrtime.bigint(),
    cpu0: process.cpuUsage(),
    mem0: process.memoryUsage(),
  };
}

export function endProbe(start, bytes = 0, extra = {}) {
  const t1 = process.hrtime.bigint();
  const cpu1 = process.cpuUsage();
  const mem1 = process.memoryUsage();
  const ms = Number(t1 - start.t0) / 1e6;
  const cpuUser = (cpu1.user - start.cpu0.user) / 1000; // ms
  const cpuSys = (cpu1.system - start.cpu0.system) / 1000; // ms
  const memDelta = mem1.rss - start.mem0.rss;

  return {
    latency_ms: +ms.toFixed(3),
    bytes,
    cpu_user_ms: +cpuUser.toFixed(3),
    cpu_sys_ms: +cpuSys.toFixed(3),
    mem_rss_delta: memDelta,
    ...extra,
  };
}

export function serverTimingHeader(metrics) {
  // Format some bits into Server-Timing header for quick inspection
  const parts = [
    `total;dur=${metrics.latency_ms}`,
    `cpuU;dur=${metrics.cpu_user_ms}`,
    `cpuS;dur=${metrics.cpu_sys_ms}`,
    `bytes;desc="${metrics.bytes}"`
  ];
  return parts.join(", ");
}
