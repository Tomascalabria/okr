"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Objective, ProgressUpdate } from "@/types/database"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

interface GroupDashboardProps {
  groupName: string
  objectives: Objective[]
  updates: ProgressUpdate[]
}

export function GroupDashboard({ groupName, objectives, updates }: GroupDashboardProps) {
  const overallProgress = objectives.reduce((acc, obj) => {
    const objProgress = obj.key_results?.reduce((sum, kr) => sum + kr.progress, 0) || 0
    return acc + (objProgress / (obj.key_results?.length || 1))
  }, 0) / (objectives.length || 1)

  const pieData = [
    { name: "Completado", value: overallProgress },
    { name: "Pendiente", value: 100 - overallProgress },
  ]

  const COLORS = ["#4f46e5", "#e5e7eb"]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progreso General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
              <p className="text-sm text-muted-foreground">Completado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Progreso por Objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objectives}>
                  <XAxis dataKey="title" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey={(obj) => {
                      const progress = obj.key_results?.reduce((sum: number, kr: { progress: number }) => sum + kr.progress, 0) || 0
                      return progress / (obj.key_results?.length || 1)
                    }}
                    fill="#4f46e5"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {updates.slice(0, 5).map((update) => (
                <div key={update.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{update.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(update.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Objetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectives.map((objective) => {
                const progress = objective.key_results?.reduce((sum, kr) => sum + kr.progress, 0) || 0
                const avgProgress = progress / (objective.key_results?.length || 1)
                return (
                  <div key={objective.id} className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">{objective.title}</p>
                      <span className="text-sm text-muted-foreground">{Math.round(avgProgress)}%</span>
                    </div>
                    <Progress value={avgProgress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 