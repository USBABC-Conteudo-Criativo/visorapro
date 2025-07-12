import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Transcription } from "@shared/schema";

interface TranscriptionSegment {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  confidence: number;
}

export default function TranscriptionView({ videoId }: { videoId?: number }) {
  const [transcriptions, setTranscriptions] = useState<TranscriptionSegment[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // Simular legendas para demonstração
  useEffect(() => {
    // TODO: Implementar chamada real à API
    setTranscriptions([
      {
        id: 1,
        startTime: 0,
        endTime: 5,
        text: "Este é um exemplo de legenda sincronizada",
        confidence: 0.95
      },
      {
        id: 2,
        startTime: 5,
        endTime: 10,
        text: "As legendas serão extraídas usando Whisper",
        confidence: 0.92
      }
    ]);
  }, [videoId]);

  return (
    <Card className="neu-shadow">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Transcrição</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border p-4">
          <div className="space-y-4">
            {transcriptions.map((segment) => (
              <div 
                key={segment.id} 
                className={`space-y-1 p-2 rounded transition-colors ${
                  currentTime >= segment.startTime && currentTime <= segment.endTime
                    ? "bg-primary/10"
                    : ""
                }`}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {new Date(segment.startTime * 1000).toISOString().substr(11, 8)}
                  </span>
                  <span className="text-muted-foreground/60">
                    {Math.round(segment.confidence * 100)}% confiança
                  </span>
                </div>
                <p className="text-sm">{segment.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}