  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {  AlertCircle } from 'lucide-react'
  // import {  ThumbsUp, ThumbsDown} from 'lucide-react'
  import { ProgressValidationComponent } from "./progress-validation"
  import { ProgressUpdate } from "../types/progress"

  interface FriendsProgressProps {
    updates: ProgressUpdate[]
    onViewAll: () => void
  }

  export function FriendsProgress({ updates, onViewAll }: FriendsProgressProps) {
    const pendingValidations = updates.filter(
      update => !update.validations.some(v => v.userId === 'current-user')
    )

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Validaciones Pendientes</CardTitle>
            <p className="text-sm text-muted-foreground">
              {pendingValidations.length} actualizaciones requieren tu validación
            </p>
          </div>
          <Button variant="ghost" onClick={onViewAll}>Ver Todas</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingValidations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No hay actualizaciones pendientes por validar
              </p>
            </div>
          ) : (
            pendingValidations.map((update) => (
              <div key={update.id} className="space-y-4 p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                    <AvatarFallback>
                      {update.userName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{update.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(update.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{update.description}</p>
                  </div>
                </div>
                <ProgressValidationComponent
                  update={update}
                  onValidate={(isValid, feedback) => {
                    console.log("Validation:", { updateId: update.id, isValid, feedback })
                  }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    )
  }

