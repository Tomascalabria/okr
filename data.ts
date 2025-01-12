import { Group, Objective } from "./types"

export const sampleGroups: Group[] = [
  {
    id: "1",
    name: "Metas Laborales",
    description: "Objetivos de desarrollo profesional y carrera",
    members: 8
  },
  {
    id: "2", 
    name: "Crecimiento Personal",
    description: "Metas de superación y aprendizaje",
    members: 5
  },
  {
    id: "3",
    name: "Ruta Fitness",
    description: "Objetivos de salud y bienestar",
    members: 12
  }
]

export const sampleObjectives: Objective[] = [
  {
    id: "1",
    title: "Dominar Desarrollo en Next.js",
    keyResults: [
      { id: "1-1", description: "Completar 3 cursos avanzados de Next.js", progress: 33 },
      { id: "1-2", description: "Construir 2 aplicaciones full-stack", progress: 50 },
      { id: "1-3", description: "Contribuir a 5 proyectos de código abierto", progress: 20 }
    ],
    group: "1",
    quarter: 1
  },
  {
    id: "2", 
    title: "Aprender un Nuevo Idioma",
    keyResults: [
      { id: "2-1", description: "Completar curso de principiantes", progress: 100 },
      { id: "2-2", description: "Practicar conversación 30 mins diarios", progress: 75 },
      { id: "2-3", description: "Aprobar certificación intermedia", progress: 0 }
    ],
    group: "2",
    quarter: 1
  }
]

