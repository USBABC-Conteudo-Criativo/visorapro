// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  videos;
  highlights;
  transcriptions;
  currentIds;
  constructor() {
    this.videos = /* @__PURE__ */ new Map();
    this.highlights = /* @__PURE__ */ new Map();
    this.transcriptions = /* @__PURE__ */ new Map();
    this.currentIds = { video: 1, highlight: 1, transcription: 1 };
  }
  async getVideo(id) {
    return this.videos.get(id);
  }
  async createVideo(insertVideo) {
    const id = this.currentIds.video++;
    const video = {
      ...insertVideo,
      id,
      duration: insertVideo.duration || null,
      processedAt: /* @__PURE__ */ new Date()
    };
    this.videos.set(id, video);
    return video;
  }
  async listVideos() {
    return Array.from(this.videos.values());
  }
  async getHighlights(videoId) {
    return Array.from(this.highlights.values()).filter((h) => h.videoId === videoId);
  }
  async createHighlight(insertHighlight) {
    const id = this.currentIds.highlight++;
    const highlight = {
      ...insertHighlight,
      id,
      videoId: insertHighlight.videoId || null
    };
    this.highlights.set(id, highlight);
    return highlight;
  }
  async getTranscriptions(videoId) {
    return Array.from(this.transcriptions.values()).filter((t) => t.videoId === videoId);
  }
  async createTranscription(insertTranscription) {
    const id = this.currentIds.transcription++;
    const transcription = {
      ...insertTranscription,
      id,
      videoId: insertTranscription.videoId || null
    };
    this.transcriptions.set(id, transcription);
    return transcription;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filePath: text("file_path").notNull(),
  duration: integer("duration"),
  processedAt: timestamp("processed_at")
});
var highlights = pgTable("highlights", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  type: text("type").notNull(),
  // face, audio, combined
  confidence: integer("confidence").notNull()
});
var transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  text: text("text").notNull()
});
var insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  processedAt: true
});
var insertHighlightSchema = createInsertSchema(highlights).omit({
  id: true
});
var insertTranscriptionSchema = createInsertSchema(transcriptions).omit({
  id: true
});

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/videos", async (_req, res) => {
    const videos2 = await storage.listVideos();
    res.json(videos2);
  });
  app2.get("/api/videos/:id", async (req, res) => {
    const video = await storage.getVideo(parseInt(req.params.id));
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  });
  app2.post("/api/videos", async (req, res) => {
    const parsed = insertVideoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid video data" });
    }
    const video = await storage.createVideo(parsed.data);
    res.json(video);
  });
  app2.get("/api/videos/:id/highlights", async (req, res) => {
    const highlights2 = await storage.getHighlights(parseInt(req.params.id));
    res.json(highlights2);
  });
  app2.post("/api/highlights", async (req, res) => {
    const parsed = insertHighlightSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid highlight data" });
    }
    const highlight = await storage.createHighlight(parsed.data);
    res.json(highlight);
  });
  app2.get("/api/videos/:id/transcriptions", async (req, res) => {
    const transcriptions2 = await storage.getTranscriptions(parseInt(req.params.id));
    res.json(transcriptions2);
  });
  app2.post("/api/transcriptions", async (req, res) => {
    const parsed = insertTranscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid transcription data" });
    }
    const transcription = await storage.createTranscription(parsed.data);
    res.json(transcription);
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on http://0.0.0.0:${port}`);
  });
})();
