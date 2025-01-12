import Link from 'next/link'
import { Button } from '../components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <FileQuestion className="h-20 w-20 text-muted-foreground" />
      <h2 className="text-2xl font-bold">Página No Encontrada</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Lo sentimos, no pudimos encontrar la página que estás buscando.
      </p>
      <Button asChild>
        <Link href="/">
          Volver al Inicio
        </Link>
      </Button>
    </div>
  )
}

