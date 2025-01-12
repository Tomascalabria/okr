import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OKRCard } from "./okr-card"
import { ProgressSummary } from "./progress-summary"
import { FriendsProgress } from "./friends-progress"
import { ProgressUpdateDialog } from "./progress-update-dialog"
import type { KeyResult, Objective, ProgressUpdate } from "@/types/database"
import { getGroupsFromDB } from "@/utils/db"
import { GroupDashboard } from "./group-dashboard"

interface GroupContentProps {
  groupId: string
  groupName: string
  objectives: (Objective & { key_results: KeyResult[] })[]
  updates: ProgressUpdate[]
}

export function GroupContent({ groupId, groupName, objectives, updates }: GroupContentProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="objectives">Objetivos</TabsTrigger>
          <TabsTrigger value="updates">Actualizaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <GroupDashboard 
            groupName={groupName}
            objectives={objectives}
            updates={updates}
          />
        </TabsContent>

        {/* ... resto de las pestañas ... */}
      </Tabs>
    </div>
  )
}

