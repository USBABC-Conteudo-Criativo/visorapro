import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertHighlightSchema, insertTranscriptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Video routes
  app.get("/api/videos", async (_req, res) => {
    const videos = await storage.listVideos();
    res.json(videos);
  });

  app.get("/api/videos/:id", async (req, res) => {
    const video = await storage.getVideo(parseInt(req.params.id));
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  });

  app.post("/api/videos", async (req, res) => {
    const parsed = insertVideoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid video data" });
    }
    const video = await storage.createVideo(parsed.data);
    res.json(video);
  });

  // Highlight routes
  app.get("/api/videos/:id/highlights", async (req, res) => {
    const highlights = await storage.getHighlights(parseInt(req.params.id));
    res.json(highlights);
  });

  app.post("/api/highlights", async (req, res) => {
    const parsed = insertHighlightSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid highlight data" });
    }
    const highlight = await storage.createHighlight(parsed.data);
    res.json(highlight);
  });

  // Transcription routes
  app.get("/api/videos/:id/transcriptions", async (req, res) => {
    const transcriptions = await storage.getTranscriptions(parseInt(req.params.id));
    res.json(transcriptions);
  });

  app.post("/api/transcriptions", async (req, res) => {
    const parsed = insertTranscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid transcription data" });
    }
    const transcription = await storage.createTranscription(parsed.data);
    res.json(transcription);
  });

  const httpServer = createServer(app);
  return httpServer;
}
