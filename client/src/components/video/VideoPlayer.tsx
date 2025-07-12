import { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPlayerProps {
  file: File;
}

export default function VideoPlayer({ file }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }

    return () => {
      if (videoRef.current?.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [file]);

  return (
    <div className="aspect-video relative">
      <video
        ref={videoRef}
        className="w-full h-full rounded-lg"
        controls
        preload="metadata"
      />
    </div>
  );
}
