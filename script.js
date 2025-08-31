function startTest() {
  const image = new Image();
  const fileSize = 48118; // actual size in bytes
  const startTime = new Date().getTime();

  image.onload = function() {
    const endTime = new Date().getTime();
    const duration = (endTime - startTime) / 1000; // seconds
    const bitsLoaded = fileSize * 8;
    const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
    document.getElementById("result").innerText = `Download Speed: ${speedMbps} Mbps`;
  };

  image.onerror = function() {
    document.getElementById("result").innerText = "❌ Error: Could not complete the test.";
  };

  // use your own file + random query to avoid caching
  image.src = "testfile.jpg?nocache=" + Math.random();
}
