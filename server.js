
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDirectory = path.join(__dirname, "public");
const port = process.env.PORT || 3000;

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
};

const server = http.createServer((req, res) => {
  const pathname = new URL(
    req.url,
    `http://${req.headers.host || "localhost"}`
  ).pathname;

  const requestedPath =
    pathname === "/" ? "index.html" : pathname.slice(1);

  const filePath = path.resolve(publicDirectory, requestedPath);

  // Prevent requests from accessing files outside public/.
  if (
    filePath !== publicDirectory &&
    !filePath.startsWith(publicDirectory + path.sep)
  ) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end(error.code === "ENOENT" ? "Page not found" : "Server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();

    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });

    res.end(content);
  });
});

server.listen(port, () => {
  console.log(`Naija Explorer running at http://localhost:${port}`);
});
