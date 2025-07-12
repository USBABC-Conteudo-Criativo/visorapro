import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function FaceDetection() {
  return (
    <Card className="neu-shadow">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Detecção Facial</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Processando frames</span>
            <span>45%</span>
          </div>
          <Progress value={45} />
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Faces detectadas: <span className="font-medium">3</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Frames processados: <span className="font-medium">450/1000</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
