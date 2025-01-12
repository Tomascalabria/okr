import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Award, Users, Target } from 'lucide-react'
import { GroupStats } from "../types/reviews"

interface GroupStatsCardProps {
  stats: GroupStats
}

export function GroupStatsCard({ stats }: GroupStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rendimiento del Grupo</CardTitle>
        <CardDescription>Progreso general y logros</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <div className="text-sm">
              Calificación Promedio
              <p className="text-xs text-muted-foreground">Puntaje grupal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{stats.averageRating}</span>
            <Progress value={stats.averageRating * 20} className="w-20" />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <div className="text-sm">
              OKRs Completados
              <p className="text-xs text-muted-foreground">Logros totales</p>
            </div>
          </div>
          <span className="text-2xl font-bold">{stats.completedOKRs}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <div className="text-sm">
              Miembros Activos
              <p className="text-xs text-muted-foreground">Miembros contribuyentes</p>
            </div>
          </div>
          <span className="text-2xl font-bold">{stats.totalMembers}</span>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm font-medium mb-2">Mejor Desempeño</div>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={stats.topPerformer.avatar} />
              <AvatarFallback>
                {stats.topPerformer.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{stats.topPerformer.name}</p>
              <p className="text-xs text-muted-foreground">
                {stats.topPerformer.quarterlyScore}% Puntaje Trimestral
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

