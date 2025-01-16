/* eslint-disable */


"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { dbService } from "@/lib/db-service";
import { Copy, UserPlus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

// Interfaces de tipo actualizadas según la estructura de los datos
interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface GroupMember {
  group_id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: Profile;
}

interface GroupMembersProps {
  groupId: string;
  groupName: string;
  inviteCode?: string;
}

export function GroupMembers({ groupId, groupName, inviteCode }: GroupMembersProps) {
  const router = useRouter();
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [leavingGroup, setLeavingGroup] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "member" | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(false);

useEffect(() => {
  const loadData = async () => {
    try {
      const membersData = await dbService.getGroupMembers(groupId);

      // Verificar que la respuesta sea un array
      if (Array.isArray(membersData)) {
        // Mapea los miembros con sus perfiles, asegurándote de que 'profiles' exista
        const formattedMembersData = membersData.map((member) => {
          // Verifica si 'profiles' existe y asigna un valor predeterminado si es necesario
          const profileData = member.profile

          return {
            user_id: member.user_id,
            role: member.role,
            profile: profileData, // Asigna el perfil correctamente
          };
        });

        setMembers(formattedMembersData);
      } else {
        console.error("Los datos de los miembros no tienen el formato esperado", membersData);
      }
    } catch (error) {
      console.error("Error cargando los datos del grupo", error);
    }
  };

  loadData();
}, [groupId]);

  
  const handleInvite = () => {
    setShowInviteDialog(true);
  };

  const handleLeaveGroup = () => {
    setShowLeaveDialog(true);
  };

  const handleDeleteGroup = () => {
    setShowDeleteDialog(true);
  };

  const handleCopyInviteCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success("Código de invitación copiado al portapapeles");
    }
  };

  return (
    <div>
      <h1>Miembros del Grupo: {groupName}</h1>
      <Button onClick={handleInvite}>
        <UserPlus /> Invitar Miembro
      </Button>
      <Button onClick={handleLeaveGroup}>
        <LogOut /> Salir del Grupo
      </Button>
      <Button onClick={handleDeleteGroup}>
        <LogOut /> Eliminar Grupo
      </Button>

      <div>
        {members.map((member) => (
          <div key={member.user_id}>
            <Avatar>
              <AvatarImage src={member.profiles.avatar_url || "/default-avatar.png"} alt={member.profiles.name} />
              <AvatarFallback>{member.profiles.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p>{member.profiles.name}</p>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      {/* Dialogos de confirmación */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invitar Miembro</DialogTitle>
            <DialogDescription>
              Introduce el correo electrónico o ID del miembro que quieres invitar.
            </DialogDescription>
          </DialogHeader>
          <Input />
          <DialogFooter>
            <Button>Invitar</Button>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar salida del grupo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres salir de este grupo?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={async () => {
                setLeavingGroup(true);
                try {
                  // Lógica para salir del grupo
                  await dbService.leaveGroup(groupId);
                  router.push("/groups");
                } catch (error) {
                  console.error("Error al salir del grupo", error);
                } finally {
                  setLeavingGroup(false);
                  setShowLeaveDialog(false);
                }
              }}
            >
              {leavingGroup ? "Saliendo..." : "Sí, salir"}
            </Button>
            <Button variant="outline" onClick={() => setShowLeaveDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación del grupo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este grupo permanentemente?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={async () => {
                setDeletingGroup(true);
                try {
                  // Lógica para eliminar el grupo
                  await dbService.deleteGroup(groupId);
                  router.push("/groups");
                } catch (error) {
                  console.error("Error al eliminar el grupo", error);
                } finally {
                  setDeletingGroup(false);
                  setShowDeleteDialog(false);
                }
              }}
            >
              {deletingGroup ? "Eliminando..." : "Sí, eliminar"}
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
