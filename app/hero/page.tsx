/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { dbService } from "@/lib/db-service";
import { Group } from "@/types/database";
import { CreateGroupDialog } from "@/components/create-group-dialog";
import { GroupCard } from "@/components/group-card";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        console.log("Session in Hero Page:", session);

        if (!session) {
          router.push("/auth/login");
          return;
        }

        // Load groups if session exists
        const groupsData = await dbService.getUserGroups();
        setGroups(groupsData);
      } catch (error) {
        console.error("Error during session check or data loading:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prev) => [...prev, newGroup]);
  };

  if (loading) {
    return <div className="text-center py-8"><div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
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
  </div><div><p>Cargando..</p></div></div>;
  }

  return (
    <div className="container max-w-6xl py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Tus OKRs 2025</h1>
        <div className="flex gap-2">
          <CreateGroupDialog onGroupCreated={handleGroupCreated} />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground mt-8">
          No hay grupos creados. Crea tu primer grupo para comenzar.
        </div>
      )}
    </div>
  );
}
