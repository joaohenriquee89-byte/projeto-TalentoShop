
export enum UserRole {
  VENDEDOR = 'VENDEDOR',
  LOJISTA = 'LOJISTA',
  ADMIN = 'ADMIN',
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
  title: string;
  type: string;
  description?: string;
  status: 'Ativa' | 'Fechada' | 'Rascunho';
  user_id: string;
  company_name?: string;
  companyName?: string; // For display purposes
  location?: string; // For display purposes
  compatibility?: number; // Match score for vendedores
  logoInitial?: string; // First letter of company name
  candidates?: number; // Logic field (count)
  created_at?: string;
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
