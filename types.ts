
export enum UserRole {
  VENDEDOR = 'VENDEDOR',
  LOJISTA = 'LOJISTA',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  plan: string; // 'FREE', 'PG', 'STANDARD', 'PRO'
}

export interface Job {
  id: string;
  companyName: string;
  title: string;
  location: string;
  compatibility?: number;
  logoInitial?: string;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  experience: string;
  matchScore: number;
  tags: string[];
  avatar: string;
}
