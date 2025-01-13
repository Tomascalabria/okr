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
    return <div className="text-center py-8">Cargando...</div>;
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
