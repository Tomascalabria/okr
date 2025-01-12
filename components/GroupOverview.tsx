"use client";

import { useState, useEffect } from "react";
import { useGroups } from "@/hooks/useGroups";
import { GroupCard } from "@/components/group-card";
import { CreateGroupDialog } from "@/components/create-group-dialog";
import { dbService } from "@/lib/db-service";
import { useUser } from "@/hooks/useUser";
import { Button } from "./ui/button";
import { CreateOKRDialog } from "./create-okr-dialog";
import { useRouter } from "next/navigation"
import { Objective, KeyResult } from "@/types/database";

export default function GroupOverview() {
  const { user } = useUser();
  const { groups } = useGroups(user);
  const router = useRouter(); 
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [objectives, setObjectives] = useState<(Objective & { key_results: KeyResult[] })[]>([]);

  useEffect(() => {
    if (selectedGroup) {
      const fetchObjectives = async () => {
        try {
          const objectivesData = await dbService.getGroupObjectives(selectedGroup.id);
          setObjectives(objectivesData);
        } catch (error) {
          console.error("Error al cargar los objetivos:", error);
        }
      };

      fetchObjectives();
    }
  }, [selectedGroup]);

  return (
    <div className="container py-10">
        <h1 className="text-3xl font-bold tracking-tight">Tus OKRs 2025</h1>
          <p className="text-muted-foreground mt-2">
            Rastrea tus objetivos y resultados clave en diferentes grupos
          </p>
      
      <h2 className="text-xl mb-4">Tus Grupos</h2>

        

      {groups.length === 0 ? (
        <div className="text-center">
          <p className="text-lg">No tienes Grupos</p>
          <CreateGroupDialog isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)}/>

        </div>
        
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onClick={() => router.push(`/group/${group.id}`)} // Corregido para usar router.push en lugar de Router.push
              />
          ))}
        </div>
      )}

      
    </div>
  );
}
