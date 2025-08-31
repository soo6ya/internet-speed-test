const startBtn = document.getElementById('startBtn');
const resultEl = document.getElementById('result');

startBtn.addEventListener('click', async () => {
  resultEl.textContent = 'Testing...';
  startBtn.disabled = true;

  const fileSizeBytes = 2 * 1024 * 1024; // ~2 MB
  const url = `https://via.placeholder.com/2000x2000.jpg?nocache=${Math.random()}`;
  const t0 = performance.now();

  try {
    const resp = await fetch(url);
    await resp.blob();
    const t1 = performance.now();

    const timeSecs = (t1 - t0) / 1000;
    const speedBps = (fileSizeBytes * 8) / timeSecs;
    const speedMbps = (speedBps / (1024 * 1024)).toFixed(2);

    resultEl.textContent = `Download Speed: ${speedMbps} Mbps`;
  } catch (err) {
    console.error(err);
    resultEl.textContent = 'Error: Could not complete the test.';
  } finally {
    startBtn.disabled = false;
  }
});
