import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Loader2, Settings, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";

interface VideoProcessorProps {
  file: File | null;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
}

export default function VideoProcessor({ 
  file, 
  processing, 
  setProcessing 
}: VideoProcessorProps) {
  const { toast } = useToast();
  const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);

  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        await tf.setBackend('webgl');
        const loadedModel = await blazeface.load();
        setModel(loadedModel);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar o modelo de detecção facial",
          variant: "destructive"
        });
      }
    }
    loadModel();
  }, []);

  const startProcessing = async () => {
    if (!file) {
      toast({
        title: "Atenção",
        description: "Por favor, selecione um vídeo primeiro",
      });
      return;
    }

    if (!model) {
      toast({
        title: "Aguarde",
        description: "O modelo ainda está sendo carregado",
      });
      return;
    }

    setProcessing(true);
    const worker = new Worker(new URL("@/lib/videoWorker.ts", import.meta.url));

    worker.onmessage = (e) => {
      if (e.data.type === "complete") {
        setProcessing(false);
        toast({
          title: "Sucesso",
          description: "Processamento concluído!",
        });
      } else if (e.data.type === "progress") {
        // TODO: Implementar barra de progresso
      }
    };

    worker.postMessage({ 
      file,
      type: 'start',
      modelConfig: {
        maxFaces: 10
      }
    });
  };

  return (
    <Card className="neu-shadow">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Processamento</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={startProcessing} 
            disabled={processing || !model} 
            className="neu-button"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Iniciar
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="neu-button"
            onClick={() => {
              toast({
                title: "Configurações",
                description: "Configurações avançadas em breve",
              });
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurar
          </Button>
        </div>

        <Button 
          variant="ghost" 
          className="w-full neu-button"
          onClick={() => {
            if (!file) {
              toast({
                title: "Atenção",
                description: "Por favor, selecione um vídeo primeiro",
              });
              return;
            }
            toast({
              title: "Reprocessar",
              description: "Reprocessamento em breve",
            });
          }}
        >
          <RotateCw className="mr-2 h-4 w-4" />
          Reprocessar
        </Button>
      </CardContent>
    </Card>
  );
}