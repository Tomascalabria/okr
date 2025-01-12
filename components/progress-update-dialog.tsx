"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ProgressUpdateDialog() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Registrar Progreso</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Progreso</DialogTitle>
          <DialogDescription>
            Comparte tus logros y avances con tu grupo
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">¿Qué has logrado?</Label>
              <Textarea
                id="description"
                placeholder="Describe tus avances y logros..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="evidence">Evidencia (opcional)</Label>
              <Input
                id="evidence"
                type="url"
                placeholder="Enlace a documentos, fotos o recursos que demuestren tu progreso"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Publicar Actualización</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

