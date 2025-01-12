"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, LogOut } from 'lucide-react'
import type { Group } from "@/types/database"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { dbService } from "@/lib/db-service"
import { useRouter } from "next/navigation"

interface GroupCardProps {
  group: Group
  isActive?: boolean
  onClick?: () => void
}

export function GroupCard({ group, isActive, onClick }: GroupCardProps) {
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const router = useRouter()

  const copyInviteLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = `${window.location.origin}/join/${group.invite_code}`
    navigator.clipboard.writeText(link)
    toast.success("Enlace de invitación copiado!")
  }

  const handleInviteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowInviteDialog(true)
  }

  const handleLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowLeaveDialog(true)
  }

  const handleLeaveGroup = async () => {
    try {
      setIsLeaving(true)
      await dbService.leaveGroup(group.id)
      toast.success(`Has salido del grupo ${group.name}`)
      router.refresh()
      router.push("/")
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error desconocido al salir del grupo")
      }
    } finally {
      setIsLeaving(false)
      setShowLeaveDialog(false)
    }
  }
  

  return (
    <>
      <Card 
        className={`cursor-pointer transition-colors hover:bg-accent ${
          isActive ? 'border-primary' : ''
        }`}
        onClick={onClick}
      >
        <CardHeader className="pb-2" >
          <CardTitle className="text-lg flex items-center justify-between">
            {group.name}
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleInviteClick}
              >
                <UserPlus className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLeaveClick}
              >
                <LogOut className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent onClick={() => router.push(`/group/${group.id}`)}>
          <p className="text-sm text-muted-foreground">{group.description}</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{group.members || 0} miembros</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Miembros</DialogTitle>
            <DialogDescription>
              Comparte este enlace para invitar personas a unirse a {group.name}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Input
              readOnly
              value={`${window.location.origin}/join/${group.invite_code}`}
            />
            <Button onClick={copyInviteLink} variant="outline">
              Copiar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salir del Grupo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas salir de {group.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={isLeaving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              disabled={isLeaving}
            >
              {isLeaving ? "Saliendo..." : "Salir del Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

