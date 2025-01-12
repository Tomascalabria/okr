"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { dbService } from "@/lib/db-service"

interface InviteLinkProps {
  groupId: string
}

export function InviteLink({ groupId }: InviteLinkProps) {
  const [inviteLink, setInviteLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")

  const generateLink = async () => {
    try {
      setLoading(true)
      const code = await dbService.createInviteLink(groupId, email)
      const link = `${window.location.origin}/join/${code}`
      setInviteLink(link)
      navigator.clipboard.writeText(link)
      toast.success("Enlace de invitación copiado al portapapeles")
    } catch (error) {
      toast.error("Error al generar el enlace de invitación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Email (opcional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={generateLink} disabled={loading}>
          Generar Link
        </Button>
      </div>
      {inviteLink && (
        <Input
          value={inviteLink}
          readOnly
          onClick={(e) => e.currentTarget.select()}
        />
      )}
    </div>
  )
} 