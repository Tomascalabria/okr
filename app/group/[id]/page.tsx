  /* eslint-disable */


  "use client";

  import { useState, useEffect } from "react";
  import { useParams } from "next/navigation";
  import { Separator } from "@/components/ui/separator";
  import { OKRCard } from "../../../components/okr-card";
  import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
  import { getGroupMembers, getGroupObjectives, getGroupUpdates, getGroupsFromDB } from "@/utils/db";
  import type { Group, GroupMember, Objective, KeyResult, ProgressUpdate } from "@/types/database";
  import { CreateOKRDialog } from "@/components/create-okr-dialog";

  export default function GroupPage() {
    const { id } = useParams();
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
        console.log(objectives)
        console.log(updates)
        try {
          setLoading(true);
          setError(null);

          // Fetch data concurrently
          const [groupsData, membersData, objectivesData, updatesData] = await Promise.all([
            getGroupsFromDB(),
            getGroupMembers(groupId),
            getGroupObjectives(groupId),
            getGroupUpdates(groupId),
          ]);

          // Find the correct group by ID
          const selectedGroup = groupsData.find((g) => g.id === groupId) || null;
          setGroup(selectedGroup);

          // Map members with objectives and ensure profile is assigned correctly
          const membersWithObjectives = membersData.map((member) => {
            const memberObjectives = objectivesData.filter((obj) => obj.created_by === member.user_id);
            const profile = member.profile; // Use "profile" instead of "profiles"
            return { ...member, objectives: memberObjectives, profile };
          });

          setGroupMembers(membersWithObjectives);

          // Set objectives and updates
          setObjectives(
            objectivesData.map((obj) => ({
              ...obj,
              key_results: obj.key_results || [],
            }))
          );
          setUpdates(updatesData);
        } catch (error) {
          console.error("Error loading group data:", error);
          setError("There was a problem loading the data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      loadGroupData();
    }, [groupId]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    if (!group) {
      return <div>No group details found.</div>;
    }

    const hasAnyOKRs = groupMembers.some((member) => member.objectives && member.objectives.length > 0);

    const handleNewOKR = (newOKR: any) => {
      setObjectives((prevObjectives) => [...prevObjectives, newOKR]);
    };

    return (
      <div className="container max-w-5xl mx-auto py-6">
        <div className="mb-8 flex flex-col items-start">
          <div className="flex justify-between w-full items-center">
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <p className="text-sm text-muted-foreground">{group.description}</p>
            </div>
            <CreateOKRDialog groups={[group]} onOKRCreated={handleNewOKR} />
          </div>
        </div>

        {!hasAnyOKRs ? (
          <div className="py-4 px-6 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            No OKRs have been defined in this group yet.
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
