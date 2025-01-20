/* eslint-disable */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { OKRCard } from "../../../components/okr-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getGroupMembers, getGroupObjectives, getGroupUpdates, getGroupsFromDB } from "@/utils/db";
import type { Group, GroupMember, Objective, KeyResult, ProgressUpdate } from "@/types/database";
import { CreateOKRDialog } from "@/components/create-okr-dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function GroupPage() {
  const { id } = useParams();
  const router = useRouter();
  const groupId = id ? (Array.isArray(id) ? id[0] : id) : null;

  const [group, setGroup] = useState<Group | null>(null);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [objectives, setObjectives] = useState<(Objective & { key_results: KeyResult[] })[]>([]);
  const [updates, setUpdates] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        setError(null);

        const [groupsData, membersData, objectivesData, updatesData] = await Promise.all([
          getGroupsFromDB(),
          getGroupMembers(groupId),
          getGroupObjectives(groupId),
          getGroupUpdates(groupId),
        ]);

        const selectedGroup = groupsData.find((g) => g.id === groupId) || null;
        setGroup(selectedGroup);

        const membersWithObjectives = membersData.map((member) => {
          const memberObjectives = objectivesData.filter((obj) => obj.created_by === member.user_id);
          const profile = member.profile;
          return { ...member, objectives: memberObjectives, profile };
        });

        setGroupMembers(membersWithObjectives);

        setObjectives(
          objectivesData.map((obj) => ({
            ...obj,
            key_results: obj.key_results || [],
          }))
        );
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error loading group data:", error);
        setError("Hubo un problema al cargar los datos. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  const calculateYearCompletion = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const endOfYear = new Date(today.getFullYear(), 11, 31);
    const progress = ((today.getTime() - startOfYear.getTime()) / (endOfYear.getTime() - startOfYear.getTime())) * 100;
    return Math.floor(progress);
  };

  if (loading) {
    return (
    <div className="text-center py-8">
    <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
    <svg className="w-16 h-16 animate-spin text-gray-900/50" viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <path
        d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>
      <path
        d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
        stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" className="text-gray-900">
      </path>
    </svg>
    <div className="mt-10"><p>Cargando..</p></div>  
  </div>
  </div>)
    
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!group) {
    return <div>No se encontraron detalles del grupo.</div>;
  }

  const hasAnyOKRs = groupMembers.some((member) => member.objectives && member.objectives.length > 0);

  const handleNewOKR = (newOKR: any) => {
    setObjectives((prevObjectives) => [...prevObjectives, newOKR]);
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="mb-8 flex flex-col items-start">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-4">
            {/* Back to Hero Button */}
            <Button size="icon"              onClick={() => router.push("/hero")}
>
            <ChevronLeft   />
            </Button>

            {/* Title and Progress Bar */}
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
          </div>


          {/* + Button */}
          <CreateOKRDialog groups={[group]} onOKRCreated={handleNewOKR} />
        </div>
      </div>
          {/* Progress Bar */}
          <div className="flex-1 mx-8">
            
              <Progress value={calculateYearCompletion()}  className={`${calculateYearCompletion()} h-4	`}/>
            <p className="text-xs text-center mt-1 text-muted-foreground">
              Progreso del año: {calculateYearCompletion()}%
            </p>
          </div>
    
      {!hasAnyOKRs ? (
        <div className="py-4 px-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          Aún no se han definido OKRs para este grupo.
        </div>
      ) : (
        <div className="space-y-8">
          {groupMembers.map((member) => {
            const profile = member.profile;
            return (
              <div key={member.user_id}>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ""} />
                   
            <AvatarFallback>
              {profile?.name
                ? profile.name.split(" ").map((n) => n[0]).join("")
                : "?"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{profile?.name || "Unknown Member"}</span>
          <span className="text-sm text-muted-foreground">{member.role}</span>
        </div>
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
                      No objectives assigned to this member.
                    </div>
                  )}
                  <Separator className="mt-8" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  