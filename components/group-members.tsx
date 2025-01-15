"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { Copy, UserPlus, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface GroupMember {
  user_id: string
  role: string
  profiles: {
    name: string
    avatar_url: string | null
  }
}

interface GroupMembersProps {
  groupId: string
  groupName: string
  inviteCode?: string
}

export function GroupMembers({ groupId, groupName, inviteCode }: GroupMembersProps) {
  const router = useRouter()
  const [members, setMembers] = useState<GroupMember[]>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showLeaveDialog, setShowLeaveDialog] = useState(false)
  const [leavingGroup, setLeavingGroup] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'member' | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingGroup, setDeletingGroup] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
            
        const [membersData, roleData] = await Promise.all([
          dbService.getGroupMembers(groupId), 
          dbService.getUserRole(groupId)
      
        ])
consoole.log(membersData)
   interface MemberProfile {
  name: string;
  avatar_url: string | null;
}

interface MemberData {
  user_id: string;
  role: string;
  profiles: MemberProfile;
}

const formattedMembersData = membersData.map((member: MemberData) => {
  const profiles = Array.isArray(member.profiles)
    ? member.profiles[0]
    : member.profiles;

  return {
    user_id: member.user_id,
    role: member.role,
    profiles: {
      name: profiles?.name ,
      avatar_url: profiles?.avatar_url ,
    },
  };
});
                setMembers(formattedMembersData)
        setUserRole(roleData)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [groupId])

  const copyInviteLink = () => {
    const link = `${window.location.origin}/join/${inviteCode}`
    navigator.clipboard.writeText(link)
    toast.success("Enlace de invitación copiado!")
  }

  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true)
      await dbService.leaveGroup(groupId)
      toast.success("Has salido del grupo exitosamente")
      router.refresh()
      router.push("/")
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "Error desconocido al salir del grupo"
      toast.error(errorMessage)
    } finally {
      setLeavingGroup(false)
      setShowLeaveDialog(false)
    }
  }

  const handleUnlinkGroup = async () => {
    try {
      setDeletingGroup(true)
      await dbService.unlinkFromGroup(groupId)
      toast.success("Has dejado el grupo exitosamente")
      router.refresh()
      router.push("/")
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || "Error desconocido al desvincular del grupo"
      toast.error(errorMessage)
    } finally {
      setDeletingGroup(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Miembros del Grupo</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowInviteDialog(true)} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Invitar
          </Button>
          {userRole === 'admin' && (
            <Button 
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive" 
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Dejar Grupo
            </Button>
          )}
          <Button 
            onClick={() => setShowLeaveDialog(true)} 
            variant="outline" 
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Salir
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
            <Avatar>
              <AvatarImage src={member.profiles.avatar_url || undefined} />
              <AvatarFallback>
                {member.profiles.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{member.profiles.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Miembros</DialogTitle>
            <DialogDescription>
              Comparte este enlace para invitar personas a unirse a {groupName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <Input
              readOnly
              value={`${window.location.origin}/join/${inviteCode}`}
            />
            <Button onClick={copyInviteLink} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salir del Grupo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas salir de {groupName}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLeaveDialog(false)}
              disabled={leavingGroup}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleLeaveGroup}
              disabled={leavingGroup}
            >
              {leavingGroup ? "Saliendo..." : "Salir del Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dejar Grupo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas dejar el grupo {groupName}? 
              Podrás volver a unirte si tienes un código de invitación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deletingGroup}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleUnlinkGroup}
              disabled={deletingGroup}
            >
              {deletingGroup ? "Saliendo..." : "Dejar Grupo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
