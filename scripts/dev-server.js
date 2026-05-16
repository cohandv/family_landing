#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT) || 3010;
const BASE_PATH = "/about";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function send(res, status, body, type, headers) {
  res.writeHead(status, Object.assign({ "Content-Type": type || "text/plain; charset=utf-8" }, headers || {}));
  res.end(body);
}

function redirect(res, location) {
  send(res, 301, "", "text/plain", { Location: location });
}

function toFilePath(urlPath) {
  if (urlPath === BASE_PATH || urlPath === BASE_PATH + "/") {
    return "/index.html";
  }
  if (!urlPath.startsWith(BASE_PATH + "/")) {
    return null;
  }
  return urlPath.slice(BASE_PATH.length) || "/index.html";
}

const server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent(req.url.split("?")[0]);

  if (urlPath === "/") {
    return redirect(res, BASE_PATH + "/");
  }

  var relativePath = toFilePath(urlPath);
  if (!relativePath) {
    return send(res, 404, "Not found");
  }

  var filePath = path.normalize(path.join(ROOT, relativePath));
  if (!filePath.startsWith(ROOT)) {
    return send(res, 403, "Forbidden");
  }

  fs.stat(filePath, function (err, stat) {
    if (err || !stat.isFile()) {
      var fallback = path.join(ROOT, "index.html");
      return fs.readFile(fallback, function (readErr, data) {
        if (readErr) return send(res, 404, "Not found");
        send(res, 200, data, MIME[".html"]);
      });
    }

    var ext = path.extname(filePath).toLowerCase();
    var type = MIME[ext] || "application/octet-stream";

    fs.readFile(filePath, function (readErr, data) {
      if (readErr) return send(res, 500, "Server error");
      send(res, 200, data, type);
    });
  });
});

server.listen(PORT, function () {
  console.log("Family landing at http://localhost:" + PORT + BASE_PATH + "/");
});
