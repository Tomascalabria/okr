// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { ExternalLink } from 'lucide-react'
// import { ProgressValidationComponent } from "./progress-validation"
// import { ProgressUpdate } from "../types/progress"

// // Sample data
// const sampleUpdates: ProgressUpdate[] = [
//   {
//     id: "1",
//     objectiveId: "1",
//     userId: "1",
//     userName: "María García",
//     description: "Completé el curso avanzado de Next.js y construí mi primera aplicación full-stack con autenticación y base de datos.",
//     evidence: "https://github.com/maria/nextjs-project",
//     createdAt: "2024-01-08T16:00:00Z",
//     validations: [
//       {
//         id: "v1",
//         userId: "2",
//         userName: "Juan Pérez",
//         isValid: true,
//         createdAt: "2024-01-08T16:30:00Z"
//       }
//     ]
//   },
//   {
//     id: "2",
//     objectiveId: "2",
//     userId: "3",
//     userName: "Ana Rodríguez",
//     description: "He estado practicando inglés todos los días durante el último mes. Completé 30 lecciones en la plataforma y tuve 5 sesiones de conversación.",
//     evidence: "https://language-app.com/profile/ana",
//     createdAt: "2024-01-07T14:00:00Z",
//     validations: []
//   }
// ]

// export function ProgressFeed() {
//   const handleValidation = (updateId: string, isValid: boolean, feedback?: string) => {
//     console.log("Validation:", { updateId, isValid, feedback })
//   }

//   return (
//     <div className="space-y-4">
//       {sampleUpdates.map((update) => (
//         <Card key={update.id}>
//           <CardHeader className="flex-row items-center gap-4 space-y-0">
//             <Avatar>
//               <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
//               <AvatarFallback>{update.userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1">
//               <div className="font-semibold">{update.userName}</div>
//               <div className="text-sm text-muted-foreground">
//                 {new Date(update.createdAt).toLocaleDateString()}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p>{update.description}</p>
//             {update.evidence && (
//               <Button variant="link" className="h-auto p-0" asChild>
//                 <a href={update.evidence} target="_blank" rel="noopener noreferrer">
//                   Ver evidencia <ExternalLink className="h-4 w-4 ml-1" />
//                 </a>
//               </Button>
//             )}
//             <ProgressValidationComponent
//               update={update}
//               onValidate={(isValid, feedback) => handleValidation(update.id, isValid, feedback)}
//             />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

