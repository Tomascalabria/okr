import { getGroupObjectives } from "@/utils/db";
import { getGroupUpdates } from "@/utils/db";
import { getGroupMembers } from "@/utils/db";
import { getGroupsFromDB } from "@/utils/db";
import { useState, useEffect } from "react";

export function useGroupData(groupId:any) {
  const [group, setGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGroupData = async () => {
      if (!groupId) return;

      try {
        setLoading(true);
        setError(null);

        const groupData = await getGroupsFromDB(groupId);
        const [membersData, objectivesData, updatesData] = await Promise.all([
          getGroupMembers(groupId),
          getGroupObjectives(groupId),
          getGroupUpdates(groupId),
        ]);

        setGroup(groupData);
        setGroupMembers(membersData);
        setObjectives(objectivesData);
        setUpdates(updatesData);
      } catch (error) {
        console.error("Error al cargar los datos del grupo:", error);
        setError("Hubo un problema al cargar los datos. Intenta nuevamente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  return { group, groupMembers, objectives, updates, loading, error };
}
