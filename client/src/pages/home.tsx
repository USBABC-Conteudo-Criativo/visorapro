import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import VideoPlayer from "@/components/video/VideoPlayer";
import Timeline from "@/components/video/Timeline";
import FaceDetection from "@/components/video/FaceDetection";
import Transcription from "@/components/video/Transcription";
import VideoProcessor from "@/components/video/VideoProcessor";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Erro",
        description: "Por favor selecione um arquivo de vídeo válido",
        variant: "destructive"
      });
      return;
    }

    setVideoFile(file);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <img 
            src="/VISORIA PRO LOGO.png" 
            alt="Visoria Pro" 
            className="h-12 w-auto mr-4"
          />
          <h1 className="text-4xl font-bold text-foreground">Visoria Pro</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="neu-shadow">
              <CardContent className="p-6">
                {!videoFile ? (
                  <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-muted-foreground rounded-lg">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">
                          Clique para selecionar um vídeo
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <>
                    <VideoPlayer file={videoFile} />
                    <Timeline />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <VideoProcessor
              file={videoFile}
              processing={processing}
              setProcessing={setProcessing}
            />
            <FaceDetection />
            <Transcription />
          </div>
        </div>
      </div>
    </div>
  );
}