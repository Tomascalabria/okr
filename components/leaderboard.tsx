import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from 'lucide-react'
import { Member } from "../types/reviews"

interface LeaderboardProps {
  members: Member[]
}

export function Leaderboard({ members }: LeaderboardProps) {
  const sortedMembers = [...members].sort((a, b) => b.quarterlyScore - a.quarterlyScore)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Tabla de Posiciones
        </CardTitle>
        <CardDescription>Mejores desempeños este trimestre</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMembers.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6">
                  {index < 3 && (
                    <Medal
                      className={`h-5 w-5 ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                          ? "text-gray-400"
                          : "text-amber-600"
                      }`}
                    />
                  )}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.completedOKRs} OKRs completados
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{member.quarterlyScore}%</p>
                <p className="text-xs text-muted-foreground">Puntaje Trimestral</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

