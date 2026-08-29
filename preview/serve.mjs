// ---------------------------------------------------------------------------
// Standalone Preview Server — zero dependencies.
//
// Serves the repository root so the browser preview can load:
//   /preview/index.html   → the standalone preview shell
//   /out/*.mp4            → rendered videos (StoicLove, NQ57, DeAn06, ...)
//
// Also exposes POST /export for browser-triggered MP4 rendering via
// the existing scripts/export.mjs pipeline. The browser sends project
// JSON; the server spawns the exporter and returns the MP4 URL.
//
// Run: npm run preview   (then open the printed URL)
// ---------------------------------------------------------------------------

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PREVIEW_PORT || 4321);
const STUDIO_MODE = process.argv.includes("studio");

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

function sendJson(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

// Minimal project validation (single source of truth lives in scripts/export.mjs;
// this guard prevents obviously malformed requests from spawning a child process).
function validateProjectInput(project) {
  if (!project || typeof project !== "object") return "Project must be a JSON object";
  if (!project.id || typeof project.id !== "string") return "Project id is required";
  if (!project.name || typeof project.name !== "string" || !project.name.trim()) return "Project name is required";
  if (!project.template || typeof project.template !== "string") return "Template is required";
  const validTemplates = ["scrapbook", "cr7", "cosmos", "nodeflow", "terminal", "kineticStatement"];
  if (!validTemplates.includes(project.template)) return "Unknown template: " + project.template;
  if (!project.format || typeof project.format !== "string") return "Format is required";
  if (!["16:9", "9:16"].includes(project.format)) return "Unsupported format: " + project.format;
  if (!Array.isArray(project.scenes) || project.scenes.length === 0) return "At least one scene is required";
  for (const s of project.scenes) {
    if (!s || typeof s !== "object") return "Invalid scene entry";
    if (!s.id) return "Scene id is required";
    if (!s.kind) return "Scene kind is required (scene: " + s.id + ")";
    if (typeof s.duration !== "number" || s.duration <= 0) return "Invalid duration for scene " + s.id + ": " + s.duration;
  }
  return null;
}

const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

    // ---- POST /export ------------------------------------------------------
    if (req.method === "POST" && urlPath === "/export") {
      let body = "";
      let tooLarge = false;
      req.on("data", (chunk) => {
        body += chunk;
        if (body.length > 5 * 1024 * 1024) {
          tooLarge = true;
          req.destroy();
        }
      });
      req.on("end", async () => {
        if (tooLarge) return sendJson(res, 413, { ok: false, error: "Payload too large (max 5MB)" });
        let project;
        try {
          project = JSON.parse(body);
        } catch {
          return sendJson(res, 400, { ok: false, error: "Malformed JSON" });
        }

        const validationError = validateProjectInput(project);
        if (validationError) return sendJson(res, 400, { ok: false, error: validationError });

        // Sanitize output filename — never trust arbitrary project/template names.
        const safe = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "export";
        const uuid = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
        const outDir = path.join(ROOT, "out");
        const tempProjectPath = path.join(outDir, `.tmp-${uuid}.json`);
        const outputPath = path.join(outDir, `${safe}-${uuid.slice(0, 8)}.mp4`);

        // Ensure output stays under out/
        if (!outputPath.startsWith(outDir + path.sep) && outputPath !== outDir) {
          return sendJson(res, 400, { ok: false, error: "Invalid output path" });
        }

        try {
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(tempProjectPath, JSON.stringify(project), "utf-8");
        } catch (e) {
          return sendJson(res, 500, { ok: false, error: "Failed to write temp file: " + e.message });
        }

        // Spawn the existing export pipeline — fixed command, no user-supplied shell.
        const child = spawn(process.execPath, ["scripts/export.mjs", tempProjectPath, "--output", outputPath], {
          cwd: ROOT,
          stdio: ["ignore", "pipe", "pipe"],
        });

        let stderr = "";
        let stdout = "";
        child.stdout?.on("data", (d) => { stdout += d.toString(); });
        child.stderr?.on("data", (d) => { stderr += d.toString(); });

        let timedOut = false;
        const timeoutMs = 5 * 60 * 1000;
        const timer = setTimeout(() => {
          timedOut = true;
          try { child.kill("SIGTERM"); } catch {}
          // Force kill after grace period
          setTimeout(() => { try { child.kill("SIGKILL"); } catch {} }, 5000);
        }, timeoutMs);

        const cleanupTemp = () => {
          try { fs.unlinkSync(tempProjectPath); } catch {}
        };

        child.on("close", (code) => {
          clearTimeout(timer);
          cleanupTemp();

          if (timedOut) {
            // Clean partial output
            try { fs.unlinkSync(outputPath); } catch {}
            return sendJson(res, 504, { ok: false, error: "Render timed out after 5 minutes" });
          }

          if (code !== 0) {
            try { fs.unlinkSync(outputPath); } catch {}
            const msg = (stderr || stdout || "").trim().slice(-2000) || "Render failed (exit " + code + ")";
            // Avoid leaking absolute paths / stack traces verbatim — return last lines
            return sendJson(res, 500, { ok: false, error: msg });
          }

          // Verify artifact exists and is non-empty
          try {
            const stat = fs.statSync(outputPath);
            if (stat.size === 0) {
              try { fs.unlinkSync(outputPath); } catch {}
              return sendJson(res, 500, { ok: false, error: "Render produced empty file" });
            }
          } catch {
            return sendJson(res, 500, { ok: false, error: "Render completed but output not found" });
          }

          const relUrl = "/out/" + path.basename(outputPath);
          return sendJson(res, 200, { ok: true, url: relUrl });
        });

        child.on("error", (err) => {
          clearTimeout(timer);
          cleanupTemp();
          try { fs.unlinkSync(outputPath); } catch {}
          return sendJson(res, 500, { ok: false, error: "Failed to spawn renderer: " + err.message });
        });
      });
      // Handle request errors
      req.on("error", () => {
        return sendJson(res, 400, { ok: false, error: "Request error" });
      });
      return;
    }

    // ---- Static GET --------------------------------------------------------
    // Default route: library (or studio in studio mode). MP4 preview at /index.html.
    if (urlPath === "/") urlPath = STUDIO_MODE ? "/preview/studio.html" : "/preview/library.html";

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

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("\nPreview server could not start:");
    console.error("Port " + PORT + " is already in use.");
    console.error("\nStop the existing preview server or configure another available port:");
    console.error("  PREVIEW_PORT=<port> npm run preview\n");
  } else {
    console.error("\nPreview server error:", err.message);
  }
  process.exit(1);
});

server.listen(PORT, () => {
  const mode = STUDIO_MODE ? "Preview Studio (HTML)" : "standalone preview (MP4)";
  console.log(`NodeFlow ${mode}:`);
  console.log("  → http://localhost:" + PORT + "/");
  console.log("Serving root: " + ROOT);
});
