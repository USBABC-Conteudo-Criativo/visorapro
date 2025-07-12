import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  filePath: text("file_path").notNull(),
  duration: integer("duration"),
  processedAt: timestamp("processed_at"),
});

export const highlights = pgTable("highlights", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  type: text("type").notNull(), // face, audio, combined
  confidence: integer("confidence").notNull(),
});

export const transcriptions = pgTable("transcriptions", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  startTime: integer("start_time").notNull(),
  endTime: integer("end_time").notNull(),
  text: text("text").notNull(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({ 
  id: true,
  processedAt: true 
});

export const insertHighlightSchema = createInsertSchema(highlights).omit({ 
  id: true 
});

export const insertTranscriptionSchema = createInsertSchema(transcriptions).omit({ 
  id: true 
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Highlight = typeof highlights.$inferSelect;
export type InsertHighlight = z.infer<typeof insertHighlightSchema>;
export type Transcription = typeof transcriptions.$inferSelect;
export type InsertTranscription = z.infer<typeof insertTranscriptionSchema>;
