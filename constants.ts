import { EducationLevel, Resource, Subject } from "./types";

export const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Ejercicios de Fracciones Básicas',
    description: 'Introducción a las sumas y restas de fracciones con el mismo denominador.',
    subject: Subject.MATH,
    level: EducationLevel.PRIMARY,
    type: 'PDF',
    downloads: 1240,
    isPremium: false
  },
  {
    id: '2',
    title: 'Análisis Sintáctico de Oraciones Simples',
    description: 'Guía completa y ejercicios prácticos para analizar oraciones simples.',
    subject: Subject.LANGUAGE,
    level: EducationLevel.ESO,
    type: 'PDF',
    downloads: 850,
    isPremium: false
  },
  {
    id: '3',
    title: 'Past Simple vs Present Perfect',
    description: 'Worksheet intensive focusing on irregular verbs and tense usage.',
    subject: Subject.ENGLISH,
    level: EducationLevel.ESO,
    type: 'PDF',
    downloads: 2100,
    isPremium: true
  },
  {
    id: '4',
    title: 'Derivadas e Integrales: Examen Tipo',
    description: 'Modelos de examen para preparación de selectividad.',
    subject: Subject.MATH,
    level: EducationLevel.BACHILLERATO,
    type: 'PDF',
    downloads: 540,
    isPremium: true
  },
  {
    id: '5',
    title: 'La Generación del 27',
    description: 'Resumen literario y análisis de poemas clave.',
    subject: Subject.LANGUAGE,
    level: EducationLevel.BACHILLERATO,
    type: 'DOC',
    downloads: 320,
    isPremium: true
  }
];

export const PLAN_LIMITS = {
  FREE: {
    maxGenerations: 5,
    maxResources: 50,
    canDownloadPremium: false
  },
  PREMIUM: {
    maxGenerations: 9999,
    maxResources: 9999,
    canDownloadPremium: true
  }
};
