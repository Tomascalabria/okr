export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Group {
  id: string
  name: string
  description: string
  members: number
  invite_code: string | null
  created_at: string
  updated_at: string
  group_members?: {
    user_id: string
    role: string
  }[]
}

export interface GroupMember {
  group_id: string
  user_id: string
  role: 'admin' | 'member'
  created_at: string
}

export interface KeyResult {
  id: string
  objective_id: string
  description: string
  progress: number
  created_at: string
  updated_at: string
}

export interface Objective {
  id: string;
  title: string;
  group_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  progress: number; // Porcentaje de progreso
  key_results?: KeyResult[];
}


export interface ProgressValidation {
  id: string
  update_id: string
  user_id: string
  is_valid: boolean
  feedback: string | null
  created_at: string
  user?: Profile
}

export interface ProgressUpdate {
  id: string
  objective_id: string
  user_id: string
  description: string
  evidence: string | null
  created_at: string
  validations: ProgressValidation[]
  user?: Profile
  objective?: Objective
}

export interface QuarterlyReview {
  id: string
  objective_id: string
  reviewer_id: string
  rating: number
  feedback: string | null
  quarter: number
  year: number
  created_at: string
  reviewer?: Profile
} 