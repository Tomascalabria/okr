import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function EmailPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Recordatorio de Revisión Trimestral
        </CardTitle>
        <CardDescription>Vista previa de notificación por correo</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <p>Hola [Nombre del Miembro],</p>
            <p>
              ¡Es hora de la revisión trimestral de OKRs! Por favor, toma un momento para
              revisar y calificar el progreso de los miembros de tu grupo.
            </p>
            <div className="bg-background p-3 rounded border">
              <h4 className="text-sm font-medium mt-0">Grupo: Metas Laborales</h4>
              <ul className="my-2 text-sm">
                <li>María García - &quot;Dominar Desarrollo en Next.js&quot;</li>
                <li>Juan Pérez - &quot;Mejorar la Productividad del Equipo&quot;</li>
              </ul>
            </div>
            <p>¡Tu retroalimentación ayuda a mantener a todos motivados y en camino!</p>
            <Button className="w-full">Iniciar Proceso de Revisión</Button>
            <p className="text-xs text-muted-foreground">
              Recibes este correo porque eres miembro del grupo Metas Laborales.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
