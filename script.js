// CONFIG
const TEST_FILE = "testfile.jpg"; // same folder as index.html
const MAX_TIME_MS = 15000;        // safety timeout per request

const $ = (id) => document.getElementById(id);
$("start").addEventListener("click", run);

async function run() {
  $("error").textContent = "";
  $("status").textContent = "Running…";
  $("start").disabled = true;
  $("ping").textContent = "—";
  $("download").textContent = "—";

  try {
    const pingMs = await ping(TEST_FILE, 3);
    $("ping").textContent = `${Math.round(pingMs)} ms`;

    const mbps = await downloadSpeed(TEST_FILE);
    $("download").textContent = `${mbps.toFixed(2)} Mbps`;

    $("status").textContent = "Done";
  } catch (err) {
    console.error(err);
    $("error").textContent = "Error: Could not complete the test.";
    $("status").textContent = "Failed";
  } finally {
    $("start").disabled = false;
  }
}

// Measure ping by doing HEAD requests (best of N)
async function ping(url, attempts = 3) {
  let best = Infinity;
  for (let i = 0; i < attempts; i++) {
    const t0 = performance.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), MAX_TIME_MS);
    try {
      await fetch(`${url}?ping=${Math.random()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      const t1 = performance.now();
      best = Math.min(best, t1 - t0);
    } finally {
      clearTimeout(timer);
      await new Promise((r) => setTimeout(r, 150)); // tiny gap between tries
    }
  }
  if (!isFinite(best)) throw new Error("Ping failed");
  return best;
}

// Measure download by fetching the file and timing the transfer
async function downloadSpeed(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MAX_TIME_MS);

  const start = performance.now();
  const res = await fetch(`${url}?dl=${Math.random()}`, {
    cache: "no-store",
    signal: controller.signal,
  });
  clearTimeout(timer);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  // Prefer Content-Length if present; otherwise use actual bytes read
  let bytes = Number(res.headers.get("content-length"));
  const buf = await res.arrayBuffer();
  if (!bytes || Number.isNaN(bytes)) bytes = buf.byteLength;

  const seconds = (performance.now() - start) / 1000;
  const bits = bytes * 8;
  return bits / seconds / 1024 / 1024; // Mbps
}
