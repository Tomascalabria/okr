"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuarterlyReviewDialog } from "@/components/quarterly-review-dialog"
import { Leaderboard } from "@/components/leaderboard"
import { GroupStatsCard } from "@/components/group-stats"
import { EmailPreview } from "@/components/email-preview"
import { sampleObjectives } from "../../data"

const sampleMembers = [
  {
    id: "1",
    name: "María García",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "maria@ejemplo.com",
    progress: 75,
    completedOKRs: 3,
    quarterlyScore: 92,
  },
  {
    id: "2",
    name: "Juan Pérez",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "juan@ejemplo.com",
    progress: 60,
    completedOKRs: 2,
    quarterlyScore: 85,
  },
  {
    id: "3",
    name: "Ana Rodríguez",
    avatar: "/placeholder.svg?height=32&width=32",
    email: "ana@ejemplo.com",
    progress: 90,
    completedOKRs: 4,
    quarterlyScore: 95,
  },
]

const groupStats = {
  averageRating: 4.2,
  completedOKRs: 9,
  totalMembers: 3,
  topPerformer: sampleMembers[2],
}

export default function ReviewsPage() {
  const [selectedObjective, setSelectedObjective] = useState(sampleObjectives[0])
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)

  const handleReviewSubmit = (rating: number, feedback: string) => {
    console.log("Revisión enviada:", { rating, feedback, objective: selectedObjective })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Revisión Trimestral de Progreso
      </h1>

      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stats">Estadísticas del Grupo</TabsTrigger>
          <TabsTrigger value="reviews">Revisiones</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <GroupStatsCard stats={groupStats} />
            <Leaderboard members={sampleMembers} />
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid gap-6">
            {sampleObjectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{objective.title}</h3>
                  <p className="text-sm text-muted-foreground">
                  </p>
                </div>
                <button
                  className="text-sm text-primary hover:underline"
                  onClick={() => {
                    setSelectedObjective(objective)
                    setReviewDialogOpen(true)
                  }}
                >
                  Agregar Revisión
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <EmailPreview />
        </TabsContent>
      </Tabs>

      <QuarterlyReviewDialog
        objective={selectedObjective}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onSubmit={handleReviewSubmit}
      />
    </div>
  )
}

