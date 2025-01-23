"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { dbService } from "@/lib/db-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Head from "next/head"; // Import the Head component

export default function JoinGroupPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const handleJoinGroup = async () => {
      if (!user) {
        console.log("No user found, redirecting to login."); // Debug log
        localStorage.setItem("pendingInviteCode", params.code);
        toast.info("Por favor inicia sesión para unirte al grupo.");
        router.push("/auth/login");
        return;
      }

      try {
        console.log("Attempting to join group with code:", params.code, "for user:", user); // Debug log
        await dbService.joinGroupWithCode(params.code);
        toast.success("¡Te has unido al grupo exitosamente!");
        router.push("/");
      }
      catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error joining group:", error); // Debug log
          toast.error(error.message);
        } else {
          console.error("An unknown error occurred");
          toast.error("Ha ocurrido un error inesperado.");
        }
        router.push("/hero");
      }
      
    };

    handleJoinGroup();
  }, [params.code, router, user]);

  return (
    <>
      {/* Add Head component for SEO */}
      <Head>
        <title>Join Group Invitation</title>
        <meta
          name="description"
          content={`¡Hola! ${user?.name || "Usuario"} te ha invitado a cargar tus objetivos.`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {/* Page content */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Uniéndote al grupo...</h1>
          <p className="text-muted-foreground">Por favor espera un momento</p>
        </div>
      </div>
    </>
  );
}
