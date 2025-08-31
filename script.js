function startTest() {
  document.getElementById("result").innerText = "Testing, please wait...";

  // --- Ping Test ---
  const pingStart = new Date().getTime();
  fetch("testfile.jpg?ping=" + Math.random())
    .then(() => {
      const pingEnd = new Date().getTime();
      const ping = pingEnd - pingStart;

      // --- Download Speed Test ---
      const image = new Image();
      const fileSize = 48118; // size in bytes
      const startTime = new Date().getTime();

      image.onload = function () {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // seconds
        const bitsLoaded = fileSize * 8;
        const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);

        document.getElementById("result").innerText =
          `📡 Ping: ${ping} ms\n` +
          `⬇️ Download Speed: ${speedMbps} Mbps`;
      };

      image.onerror = function () {
        document.getElementById("result").innerText =
          "❌ Error: Could not complete the test.";
      };

      image.src = "testfile.jpg?nocache=" + Math.random();
    })
    .catch(() => {
      document.getElementById("result").innerText =
        "❌ Error: Could not complete the ping test.";
    });
}
