"use client" // Agregar esta línea para convertir el componente en Client Component

import { Button } from "@/components/ui/button"
import { ArrowRight, Target } from 'lucide-react'
import okrImage from '@/assets/img/okrbanner.jpg'; // Asegúrate de que esta ruta sea correcta
import Image from 'next/image'

export default function Page() {

  const handleButtonClick = () => {
    window.location.href = '/auth/login'
  }

  return (
    <div className="relative isolate overflow-hidden">
      {/* Gradient decorations */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-primary-foreground opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-0 sm:pb-32 lg:flex lg:px-8 lg:py-40"> {/* Reduje el padding superior */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-0"> {/* Eliminé el padding superior en este contenedor */}
          <div className="mt-4 sm:mt-8 lg:mt-0"> {/* Ajusté el margen superior aquí */}
            <div className="inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-ring/10 hover:ring-ring/20">
              <span>Versión 2025</span>
              <Target className="h-4 w-4 text-primary" />
            </div>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl"> {/* Ajusté el margen superior aquí */}
            Gestiona tus OKRs de manera efectiva
          </h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground"> {/* Ajusté el margen superior aquí */}
            Llega a tu prime. No te dejes ganar.
          </p>
          <div className="mt-8 flex items-center gap-x-6"> {/* Ajusté el margen superior aquí */}
            <Button size="lg" onClick={handleButtonClick} className="gap-2">
              Comenzar ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="link" size="lg">
              Aprende más →
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <Image
              src={okrImage}
              alt="Dashboard OKRs"
              className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              layout="responsive"  // Opcional si prefieres que sea responsivo
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary to-primary-foreground opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
