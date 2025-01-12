"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Objective } from "../types"

interface QuarterlyReviewDialogProps {
  objective: Objective
  onSubmit: (rating: number, feedback: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuarterlyReviewDialog({
  objective,
  onSubmit,
  open,
  onOpenChange,
}: QuarterlyReviewDialogProps) {
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    onSubmit(rating, feedback)
    setRating(0)
    setFeedback("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Revisión Trimestral</DialogTitle>
          <DialogDescription>
            Califica el progreso y proporciona retroalimentación para: {objective.title}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rating">Calificación de Progreso</Label>
            <Select
              value={rating.toString()}
              onValueChange={(value) => setRating(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una calificación" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} Estrella{value !== 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="feedback">Retroalimentación</Label>
            <Textarea
              id="feedback"
              placeholder="Proporciona retroalimentación constructiva..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!rating || !feedback}>
            Enviar Revisión
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

