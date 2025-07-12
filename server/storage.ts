import { 
  type Video, type InsertVideo,
  type Highlight, type InsertHighlight,
  type Transcription, type InsertTranscription,
} from "@shared/schema";

export interface IStorage {
  // Video methods
  getVideo(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  listVideos(): Promise<Video[]>;

  // Highlight methods
  getHighlights(videoId: number): Promise<Highlight[]>;
  createHighlight(highlight: InsertHighlight): Promise<Highlight>;

  // Transcription methods
  getTranscriptions(videoId: number): Promise<Transcription[]>;
  createTranscription(transcription: InsertTranscription): Promise<Transcription>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private highlights: Map<number, Highlight>;
  private transcriptions: Map<number, Transcription>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.videos = new Map();
    this.highlights = new Map();
    this.transcriptions = new Map();
    this.currentIds = { video: 1, highlight: 1, transcription: 1 };
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentIds.video++;
    const video: Video = { 
      ...insertVideo, 
      id, 
      duration: insertVideo.duration || null,
      processedAt: new Date() 
    };
    this.videos.set(id, video);
    return video;
  }

  async listVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getHighlights(videoId: number): Promise<Highlight[]> {
    return Array.from(this.highlights.values())
      .filter(h => h.videoId === videoId);
  }

  async createHighlight(insertHighlight: InsertHighlight): Promise<Highlight> {
    const id = this.currentIds.highlight++;
    const highlight: Highlight = { 
      ...insertHighlight, 
      id,
      videoId: insertHighlight.videoId || null
    };
    this.highlights.set(id, highlight);
    return highlight;
  }

  async getTranscriptions(videoId: number): Promise<Transcription[]> {
    return Array.from(this.transcriptions.values())
      .filter(t => t.videoId === videoId);
  }

  async createTranscription(insertTranscription: InsertTranscription): Promise<Transcription> {
    const id = this.currentIds.transcription++;
    const transcription: Transcription = { 
      ...insertTranscription, 
      id,
      videoId: insertTranscription.videoId || null
    };
    this.transcriptions.set(id, transcription);
    return transcription;
  }
}

export const storage = new MemStorage();