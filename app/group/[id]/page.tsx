"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { OKRCard } from "@/components/okr-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getGroupMembers, getGroupsFromDB } from "@/utils/db";
import type { Group, GroupMember } from "@/types/database";

// Importa el CreateOKRDialog (asegúrate de que el componente esté correctamente exportado)
import { CreateOKRDialog } from "@/components/create-okr-dialog";

export default function GroupPage() {
  const { id: groupId } = useParams();

  // Asegúrate de que groupId sea una cadena (en caso de que sea un arreglo, tomamos el primer valor)
  const groupIdString = Array.isArray(groupId) ? groupId[0] : groupId;

  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupIdString) return;

      try {
        setLoading(true);
        setError(null);

        // Obtener los datos del grupo, miembros, objetivos y actualizaciones
        const [groupData, membersData] = await Promise.all([
          getGroupsFromDB(),
          getGroupMembers(groupIdString), // Usamos groupIdString aquí
        ]);

        setGroup(groupData);

        const membersWithObjectives = membersData.map((member) => {
          const memberObjectives = groupData.flatMap((group) =>
            group.objectives.filter((obj) => obj.created_by === member.user_id)
          );
          return { ...member, objectives: memberObjectives };
        });

        setGroupMembers(membersWithObjectives);
      } catch (error) {
        console.error("Error al cargar los datos del grupo:", error);
        setError("Hubo un problema al cargar los datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupIdString]); // Usamos groupIdString como dependencia

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!group) {
    return <div>No se encontraron detalles del grupo.</div>;
  }

  const hasAnyOKRs = groupMembers.some((member) => member.objectives && member.objectives.length > 0);

  return (
    <div className="container max-w-5xl mx-auto py-6">
      {/* Título, descripción y CreateOKRDialog */}
      <div className="mb-8 flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <div>
            <h1 className="text-2xl font-bold">{group[0].name}</h1>
            <p className="text-sm text-muted-foreground">{group[0].description}</p>
          </div>
          <CreateOKRDialog groups={group} />
        </div>
      </div>

      {/* Mensaje si no hay OKRs */}
      {!hasAnyOKRs ? (
        <div className="py-4 px-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          No hay OKRs definidos aún en este grupo.
        </div>
      ) : (
        <div className="space-y-8">
          {groupMembers.map((member) => (
            <div key={member.user_id}>
              {/* Miembro del grupo */}
              <div className="flex items-center gap-3 mb-2">
                <Avatar>
                  <AvatarImage src={member.profile?.avatar_url || ""} />
                  <AvatarFallback>
                    {member.profile?.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{member.profile?.name}</span>
                <span className="text-sm text-muted-foreground">{member.role}</span>
              </div>
              {/* OKRs del miembro */}
              {member.objectives && member.objectives.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {member.objectives.map((objective) => (
                    <div key={objective.id}>
                      <OKRCard
                        objective={{
                          title: objective.title,
                          progress: objective.progress,
                          keyResults: objective.key_results || [],
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 px-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  No hay objetivos asignados a este miembro.
                </div>
              )}
              <Separator className="mt-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
