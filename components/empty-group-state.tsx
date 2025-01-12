import { Button } from "@/components/ui/button"
import { Target, Plus } from 'lucide-react'
import { CreateOKRDialog } from "./create-okr-dialog"
import { Group } from "../types"

interface EmptyGroupStateProps {
  group: Group
}

export function EmptyGroupState({ group }: EmptyGroupStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Target className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No hay OKRs en este grupo</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Sé el primero en establecer objetivos para {group.name}
      </p>
      <CreateOKRDialog groups={[group]} />
    </div>
  )
}


