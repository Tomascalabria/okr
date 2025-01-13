/* eslint-disable */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { dbService } from "@/lib/db-service";
import { toast } from "sonner";
import { Group } from "@/types/database";

interface CreateGroupDialogProps {
  onGroupCreated: (newGroup: Group) => void; // Ahora acepta un argumento de tipo Group
}

export function CreateGroupDialog({ onGroupCreated }: CreateGroupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const newGroup = await dbService.createGroupWithInviteCode(
        formData.name,
        formData.description
      );

      toast.success("Grupo creado exitosamente");
      onGroupCreated(newGroup); // Pasar el grupo creado al callback
      setIsOpen(false);
      setFormData({ name: "", description: "" });
    } 
    catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creando el grupo:", error.message);
        toast.error(error.message);
      } else {
        console.error("Error desconocido:", error);
        toast.error("Ocurrió un error inesperado");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Crear Grupo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Crear Nuevo Grupo</DialogTitle>
            <DialogDescription>
              Crea un grupo para gestionar tus OKRs y colaborar con tu equipo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Grupo</Label>
              <Input
                id="name"
                placeholder="Ej: Equipo de Desarrollo"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe el propósito del grupo..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
