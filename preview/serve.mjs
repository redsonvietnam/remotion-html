// ---------------------------------------------------------------------------
// Standalone Preview Server — zero dependencies.
//
// Serves the repository root so the browser preview can load:
//   /preview/index.html   → the standalone preview shell
//   /out/*.mp4            → rendered videos (StoicLove, NQ57, DeAn06, ...)
//
// Run: npm run preview   (then open the printed URL)
// ---------------------------------------------------------------------------

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PREVIEW_PORT || 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
};

function send(res, status, body, type) {
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8" });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    if (urlPath === "/") urlPath = "/preview/index.html";

    const resolved = path.normalize(path.join(ROOT, urlPath));
    // Prevent path traversal outside ROOT.
    if (!resolved.startsWith(ROOT)) return send(res, 403, "Forbidden");

    fs.stat(resolved, (err, stat) => {
      if (err || !stat.isFile()) return send(res, 404, "Not found: " + urlPath);
      const ext = path.extname(resolved).toLowerCase();
      const type = MIME[ext] || "application/octet-stream";
      const stream = fs.createReadStream(resolved);
      res.writeHead(200, { "Content-Type": type });
      stream.pipe(res);
    });
  } catch (e) {
    send(res, 500, "Server error");
  }
});

server.listen(PORT, () => {
  console.log("Stoic Love standalone preview:");
  console.log("  → http://localhost:" + PORT + "/");
  console.log("Serving root: " + ROOT);
});
