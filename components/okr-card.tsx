import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface KeyResult {
  id: string;
  description: string;
}

interface Objective {
  title: string;
  progress: number;
  keyResults: KeyResult[];
}

interface OKRCardProps {
  objective: Objective;
}

export function OKRCard({ objective }: OKRCardProps) {
  const { title, progress, keyResults } = objective;

  return (
    <Card className="overflow-hidden max-w-md">
      {/* Header con el título del objetivo y progreso */}
      <CardHeader className="space-y-3 pb-4">
        <CardTitle className="text-base font-medium leading-none">
          {title}
        </CardTitle>
        <div className="space-y-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground">{progress}% Complete</p>
        </div>
      </CardHeader>

      {/* Key Results */}
      <CardContent className="pt-0">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {keyResults.map((kr) => (
            <li key={kr.id} className="leading-normal">
              {kr.description}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

