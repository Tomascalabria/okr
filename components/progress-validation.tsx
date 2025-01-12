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
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { ProgressUpdate } from "../types/progress"
// import { ProgressValidation } from "../types/progress"

interface ProgressValidationProps {
  update: ProgressUpdate
  onValidate: (isValid: boolean, feedback?: string) => void
}

export function ProgressValidationComponent({ update, onValidate }: ProgressValidationProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedback, setFeedback] = useState("")

  const handleValidation = (isValid: boolean) => {
    if (isValid) {
      onValidate(true)
    } else {
      setFeedbackOpen(true)
    }
  }

  const handleFeedbackSubmit = () => {
    onValidate(false, feedback)
    setFeedbackOpen(false)
    setFeedback("")
  }

  const userValidation = update.validations.find(v => v.userId === "current-user")
  // const validationCount = update.validations.length

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className={userValidation?.isValid ? "text-green-500" : ""}
          onClick={() => handleValidation(true)}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          <span>{update.validations.filter(v => v.isValid).length}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={userValidation?.isValid === false ? "text-red-500" : ""}
          onClick={() => handleValidation(false)}
        >
          <ThumbsDown className="h-4 w-4 mr-1" />
          <span>{update.validations.filter(v => !v.isValid).length}</span>
        </Button>
      </div>

      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proporcionar Retroalimentación</DialogTitle>
            <DialogDescription>
              Explica por qué consideras que este progreso no es válido
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tu retroalimentación constructiva..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
              Enviar Retroalimentación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

