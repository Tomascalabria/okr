import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import { ProgressUpdate } from "../types/progress"

interface ProgressSummaryProps {
  updates: ProgressUpdate[]
  onViewAll: () => void
}

export function ProgressSummary({ updates, onViewAll }: ProgressSummaryProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Actualizaciones Recientes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Últimas actualizaciones de tu grupo
          </p>
        </div>
        <Button variant="ghost" onClick={onViewAll}>Ver Todas</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {updates.slice(0, 3).map((update) => (
          <div key={update.id} className="flex gap-4 items-start p-4 rounded-lg border">
            <Avatar className="mt-1">
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
              <AvatarFallback>
                {update.userName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{update.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(update.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {update.description}
              </p>
              {update.evidence && (
                <Button variant="link" className="h-auto p-0 text-xs" asChild>
                  <a 
                    href={update.evidence} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Ver evidencia <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{update.validations.filter(v => v.isValid).length} aprobaciones</span>
                <span>•</span>
                <span>{update.validations.filter(v => !v.isValid).length} desaprobaciones</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

