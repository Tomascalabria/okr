"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Group } from "../types";
import { dbService } from "@/lib/db-service";
import { toast } from "sonner"; // Cambiado a sonner

interface CreateOKRDialogProps {
  groups: Group[]; // Aquí pasas todos los grupos disponibles
  onOKRCreated: (okr: any) => void; // Callback para renderizar el nuevo OKR
}

export function CreateOKRDialog({ groups = [], onOKRCreated }: CreateOKRDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups.length > 0 ? groups[0].id : ""); // Comprobar si hay grupos
  const [objective, setObjective] = useState("");
  const [keyResults, setKeyResults] = useState<string[]>([]);

  // Si groups es vacío, no inicializamos selectedGroup
  useEffect(() => {
    if (groups.length > 0 && !selectedGroup) {
      setSelectedGroup(groups[0].id);
    }
  }, [groups, selectedGroup]);

  const handleCreateOKR = async () => {
    try {
      const formattedKeyResults = keyResults.map((result) => ({ description: result }));

      // Crear el OKR usando el groupId que seleccionó el usuario
      const createdOKR = await dbService.createOKR({
        groupId: selectedGroup,
        title: objective,
        keyResults: formattedKeyResults,
      });

      // Mostrar el toast de éxito usando sonner
      toast.success("OKR creado con éxito!"); // Cambiado a sonner

      // Llamar al callback para renderizar el nuevo OKR sin recargar el componente
      onOKRCreated(createdOKR);

      setOpen(false);
    } catch (error) {
      console.error("Error al crear el OKR:", error);
      toast.error("Hubo un problema al crear el OKR."); // Cambiado a sonner
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo OKR</DialogTitle>
          <DialogDescription>
            Define tu objetivo y establece resultados clave para medir el éxito.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Selección del grupo */}
          <div className="grid gap-2">
            <Label htmlFor="group">Grupo</Label>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un grupo" />
              </SelectTrigger>
              <SelectContent>
                {groups.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No hay grupos disponibles
                  </SelectItem>
                ) : (
                  groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          {/* Campo para el objetivo */}
          <div className="grid gap-2">
            <Label htmlFor="objective">Objetivo</Label>
            <Input
              id="objective"
              placeholder="¿Qué quieres lograr?"
              className="col-span-3"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>
          {/* Resultados clave */}
          <div className="grid gap-2">
            <Label>Metodo </Label>
            {[1, 2, 3].map((i) => (
              <Input
                key={i}
                placeholder={`Aspecto Clave ${i}`}
                className="col-span-3"
                value={keyResults[i - 1]}
                onChange={(e) => {
                  const newKeyResults = [...keyResults];
                  newKeyResults[i - 1] = e.target.value;
                  setKeyResults(newKeyResults);
                }}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateOKR}>Crear OKR</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
