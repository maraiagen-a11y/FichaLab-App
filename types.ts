export enum UserPlan {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export enum Subject {
  MATH = 'Matemáticas',
  LANGUAGE = 'Lengua y Literatura',
  ENGLISH = 'Inglés',
  SCIENCE = 'Ciencias',
  HISTORY = 'Historia'
}

export enum EducationLevel {
  PRIMARY = 'Primaria',
  ESO = 'ESO',
  BACHILLERATO = 'Bachillerato'
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  generatedCount: number; // To track usage
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  level: EducationLevel;
  type: 'PDF' | 'DOC' | 'VIDEO';
  downloads: number;
  isPremium: boolean;
}

export interface WorksheetRequest {
  subject: Subject;
  level: EducationLevel;
  topic: string;
  exerciseCount: number;
  instructions?: string;
}

export interface WorksheetResponse {
  content: string; // Markdown content
  title: string;
}
