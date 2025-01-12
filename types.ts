export interface KeyResult {
  id: string;
  description: string;
  progress: number;
}

export interface Objective {
  id: string;
  title: string;
  keyResults: KeyResult[];
  group: string;
  progres:number
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
}

export interface QuarterlyReview {
  objectiveId: string;
  rating: number;
  feedback: string;
  quarter: number;
}

