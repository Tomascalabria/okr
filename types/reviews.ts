export interface Review {
  id: string
  objectiveId: string
  reviewerId: string
  rating: number
  feedback: string
  createdAt: string
  quarter: number
}

export interface Member {
  id: string
  name: string
  avatar: string
  email: string
  progress: number
  completedOKRs: number
  quarterlyScore: number
}

export interface GroupStats {
  averageRating: number
  completedOKRs: number
  totalMembers: number
  topPerformer: Member
}

