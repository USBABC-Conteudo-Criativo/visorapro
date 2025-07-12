import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { type Highlight } from "@shared/schema";

export default function Timeline() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [highlightDuration, setHighlightDuration] = useState("15");
  const [maxHighlights, setMaxHighlights] = useState("10");

  return (
    <Card className="mt-4 neu-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="relative">
            <Slider
              value={[currentTime]}
              max={100}
              step={1}
              onValueChange={(vals) => setCurrentTime(vals[0])}
              className="w-full"
            />

            <div className="absolute top-0 left-0 right-0 h-2">
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  style={{
                    position: 'absolute',
                    left: `${(highlight.startTime / 100) * 100}%`,
                    width: `${((highlight.endTime - highlight.startTime) / 100) * 100}%`,
                    height: '100%',
                    backgroundColor: highlight.type === 'face' ? '#4CAF50' : 
                                   highlight.type === 'audio' ? '#FFA726' : '#E53935',
                    borderRadius: '2px'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração dos Highlights (s)</Label>
              <Select 
                value={highlightDuration} 
                onValueChange={setHighlightDuration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Máximo de Highlights</Label>
              <Select 
                value={maxHighlights} 
                onValueChange={setMaxHighlights}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Máximo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}