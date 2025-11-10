import { LucideIcon } from "lucide-react";

export interface ComicChallenge {
  pregunta: string;
  opciones: string[];
  respuesta: string;
  explicacion: string;
}

export interface ComicPanel {
  texto: string;
  personaje: string;
  fondo: string;
  challenge?: ComicChallenge;
}

export type DifficultyLevel = "Básico" | "Intermedio" | "Avanzado";

export interface LabExercise {
  id: number;
  subtema: string;
  descripcion: string;
  dificultad: DifficultyLevel;
  pregunta: string;
  respuestaCorrecta: string;
  pistas?: string;
  placeholder?: string;
}

export interface TopicContent {
  id: string;
  nombre: string;
  resumen: string;
  progreso: number;
  color: string;
  icono: LucideIcon;
  contexto: {
    etiqueta: string;
    titulo: string;
    icono: LucideIcon;
    parrafos: string[];
    reflexiones: string[];
  };
  subtemas?: string[];
  recursos?: string[];
  comic: {
    titulo: string;
    personaje: string;
    paneles: ComicPanel[];
  };
  laboratorio: {
    titulo: string;
    introduccion: string;
    consejos: string[];
    ejercicios: LabExercise[];
  };
}

export type TopicId<TTopics extends readonly TopicContent[]> =
  TTopics[number]["id"];
