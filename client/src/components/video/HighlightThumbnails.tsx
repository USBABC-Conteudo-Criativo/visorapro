import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Clock } from "lucide-react";
import { type Highlight } from "@shared/schema";

interface HighlightThumbnail {
  id: number;
  startTime: number;
  endTime: number;
  type: string;
  thumbnail: string;
}

export default function HighlightThumbnails({ videoId }: { videoId?: number }) {
  const [highlights, setHighlights] = useState<HighlightThumbnail[]>([]);

  useEffect(() => {
    // TODO: Implementar chamada real à API
    // As miniaturas serão geradas usando FFmpeg
  }, [videoId]);

  return (
    <Card className="neu-shadow">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Highlights</h3>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {highlights.map((highlight) => (
              <div 
                key={highlight.id}
                className="relative group cursor-pointer"
              >
                <img
                  src={highlight.thumbnail}
                  alt={`Highlight ${highlight.id}`}
                  className="w-full h-24 object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-full flex items-center text-xs text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(highlight.startTime * 1000).toISOString().substr(11, 8)}
                </div>
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: highlight.type === 'face' ? '#4CAF50' :
                                   highlight.type === 'audio' ? '#FFA726' : '#E53935',
                    color: 'white'
                  }}
                >
                  {highlight.type}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
