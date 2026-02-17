export enum UserPlan {
  FREE = 'free',
  PREMIUM = 'premium'
}

export enum EducationLevel {
  PRIMARY = 'Primaria',
  SECONDARY = 'Secundaria',
  BACHILLERATO = 'Bachillerato',
  UNIVERSITY = 'Universidad'
}

export enum Subject {
  MATH = 'Matemáticas',
  SCIENCE = 'Ciencias',
  HISTORY = 'Historia',
  LANGUAGE = 'Lengua',
  ENGLISH = 'Inglés',
  PROGRAMMING = 'Programación'
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  generatedCount: number;
  role?: string;
  
  // --- NUEVOS CAMPOS PARA EL ONBOARDING ---
  // Estos son necesarios para el Wizard de bienvenida
  onboardingCompleted?: boolean; 
  subjects?: string[];           
}

export interface Resource {
  id: string;
  user_id: string;      
  title: string;
  content: string;
  created_at: string;
  type: string;
  is_public?: boolean;  
  description?: string; 
  
  // Añadimos estos opcionales para que la biblioteca no se queje
  subject?: string;
  level?: string;
}

export interface WorksheetResponse {
  content: string;
  metadata?: {
    difficulty: string;
    estimatedTime: string;
    topics: string[];
  };
}