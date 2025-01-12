export interface ProgressUpdate {
  id: string
  objectiveId: string
  userId: string
  userName: string
  description: string
  evidence: string
  createdAt: string
  validations: ProgressValidation[]
}

export interface ProgressValidation {
  id: string
  userId: string
  userName: string
  isValid: boolean
  feedback?: string
  createdAt: string
}

