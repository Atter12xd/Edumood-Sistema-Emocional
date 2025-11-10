import { Leaf } from "lucide-react";

import type { TopicContent } from "./types";

export const laQuimicaTopic: TopicContent = {
  id: "la-quimica",
  nombre: "La Química",
  resumen:
    "Descubre qué es la química, cómo se clasifica en ramas tradicionales y emergentes, y de qué manera transforma sectores como la salud, la agricultura o la energía.",
  progreso: 10,
  color: "from-emerald-500 via-cyan-500 to-blue-500",
  icono: Leaf,
  contexto: {
    etiqueta: "LEEMOS",
    titulo: "¿Qué estudia la química?",
    icono: Leaf,
    parrafos: [
      "La química es la ciencia que estudia la materia, su composición, estructura, propiedades y las transformaciones que puede experimentar. Todo aquello que ocupa un lugar en el espacio y se puede pesar es materia.",
      "Para comprenderla mejor, los químicos se especializan en distintas ramas: la química general aborda los principios comunes; la analítica mejora las técnicas de análisis; la inorgánica investiga los compuestos minerales; la orgánica se centra en las sustancias con carbono; la bioquímica describe procesos en seres vivos y la físicoquímica conecta leyes físicas con fenómenos químicos.",
      "Estas ramas se proyectan en aplicaciones concretas: desde la química ambiental que monitorea contaminantes, hasta la industrial que optimiza procesos productivos, la forense que apoya investigaciones legales, la agrícola y ganadera que asesora a productores, o la medicina que provee anestesias, vacunas y antibióticos.",
      "La química también abre nuevas fronteras: la energía nuclear produce radiofármacos para diagnósticos, la nanoquímica fabrica máquinas moleculares, la química computacional simula materiales, la neuroquímica analiza la comunicación neuronal y la química cuántica estudia la reactividad a nivel subatómico.",
    ],
    reflexiones: [
      "¿Qué características permiten diferenciar una sustancia de una mezcla?",
      "¿Cómo se relacionan las distintas ramas de la química en un proyecto real?",
      "¿Por qué las nuevas fronteras químicas dependen de la colaboración con otras ciencias?",
    ],
  },
  subtemas: [
    "Concepto de materia",
    "Ramas clásicas de la química",
    "Aplicaciones en la vida cotidiana",
    "Nuevas fronteras tecnológicas",
  ],
  recursos: [
    "Infografía: Ramas de la química",
    "Video: Química aplicada a la medicina",
    "Artículo: Nanoquímica en acción",
    "Podcast: Energía nuclear y radiofármacos",
  ],
  comic: {
    titulo: "La química que nos rodea",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "🧑‍🔬",
        texto:
          "¡Hola! Soy el Dr. Átomo. Hoy veremos cómo la química explica la materia que te rodea y las transformaciones que experimenta.",
        fondo: "from-sky-800 to-cyan-700",
        challenge: {
          pregunta: "¿Qué analiza la química?",
          opciones: ["La materia y sus transformaciones", "Solo las matemáticas"],
          respuesta: "La materia y sus transformaciones",
          explicacion: "La química comprende la composición, estructura y cambios de la materia.",
        },
      },
      {
        personaje: "🏔️",
        texto:
          "Desde el aire que respiras hasta el agua que bebes: todo es materia. La química estudia su composición, estructura y propiedades.",
        fondo: "from-cyan-700 to-blue-600",
        challenge: {
          pregunta: "¿Cuál es un ejemplo de materia?",
          opciones: ["El aire", "La luz visible"],
          respuesta: "El aire",
          explicacion: "El aire ocupa espacio y tiene masa, por eso es materia.",
        },
      },
      {
        personaje: "🌡️",
        texto:
          "Para conocer a fondo la materia, los científicos se organizan en ramas: analítica, general, orgánica, inorgánica, bioquímica y físicoquímica.",
        fondo: "from-blue-600 to-indigo-600",
        challenge: {
          pregunta: "¿Cuál rama estudia compuestos con carbono?",
          opciones: ["Química orgánica", "Química inorgánica"],
          respuesta: "Química orgánica",
          explicacion: "La química orgánica investiga sustancias basadas en carbono.",
        },
      },
      {
        personaje: "🧪",
        texto:
          "En un laboratorio de química analítica puedes aprender a identificar sustancias, mientras la inorgánica estudia minerales y la orgánica, compuestos con carbono.",
        fondo: "from-indigo-600 to-purple-600",
        challenge: {
          pregunta: "¿Qué se busca en la química analítica?",
          opciones: ["Perfeccionar técnicas de análisis", "Diseñar satélites"],
          respuesta: "Perfeccionar técnicas de análisis",
          explicacion: "La química analítica se centra en identificar y cuantificar sustancias.",
        },
      },
      {
        personaje: "🤝",
        texto:
          "Estas ramas se aplican al mundo real: la química ambiental monitorea contaminantes, la industrial optimiza procesos y la forense ayuda a resolver casos.",
        fondo: "from-purple-600 to-fuchsia-600",
        challenge: {
          pregunta: "¿Qué hace la química ambiental?",
          opciones: ["Estudia contaminantes", "Diseña videojuegos"],
          respuesta: "Estudia contaminantes",
          explicacion: "La química ambiental analiza contaminantes y propone soluciones.",
        },
      },
      {
        personaje: "🚀",
        texto:
          "En el campo y la ganadería, los químicos asesoran sobre suelos, fertilizantes y pesticidas para mejorar la producción.",
        fondo: "from-fuchsia-600 to-pink-600",
        challenge: {
          pregunta: "¿Para qué sirve la química agrícola?",
          opciones: ["Optimizar cultivos y pastos", "Controlar satélites"],
          respuesta: "Optimizar cultivos y pastos",
          explicacion: "Ayuda a mejorar la productividad y la salud del suelo.",
        },
      },
      {
        personaje: "🛰️",
        texto:
          "Las nuevas fronteras incluyen nanoquímica, química computacional y neuroquímica, que diseñan materiales y estudian nuestro cerebro a escala molecular.",
        fondo: "from-pink-600 to-rose-600",
        challenge: {
          pregunta: "La nanoquímica trabaja a escalas de...",
          opciones: ["Nanómetros", "Kilómetros"],
          respuesta: "Nanómetros",
          explicacion: "La nanoquímica opera entre 1 y 100 nanómetros.",
        },
      },
      {
        personaje: "🌱",
        texto:
          "La energía nuclear también es química: produce radiofármacos que permiten diagnosticar enfermedades con precisión.",
        fondo: "from-rose-600 to-amber-500",
        challenge: {
          pregunta: "¿Qué son los radiofármacos?",
          opciones: ["Sustancias radiactivas para diagnóstico", "Combustibles para autos"],
          respuesta: "Sustancias radiactivas para diagnóstico",
          explicacion: "Los radiofármacos se usan en medicina nuclear para explorar órganos.",
        },
      },
      {
        personaje: "💡",
        texto:
          "¿Listo? Ahora vamos al laboratorio para conectar estas ideas con retos y ver cómo la química resuelve problemas reales.",
        fondo: "from-rose-600 to-amber-500",
        challenge: {
          pregunta: "¿Cómo se conecta la química con la vida diaria?",
          opciones: ["Ofrece soluciones en salud, ambiente y tecnología", "Solo sirve para memorizar fórmulas"],
          respuesta: "Ofrece soluciones en salud, ambiente y tecnología",
          explicacion: "La química se aplica en múltiples sectores para mejorar la calidad de vida.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de Química y Sociedad",
    introduccion:
      "Explora cómo las ramas de la química se conectan con problemas reales y qué soluciones proponen en distintos sectores.",
    consejos: [
      "Recuerda las definiciones de cada rama para asociarlas con casos concretos.",
      "Piensa en ejemplos de tu entorno donde la química esté presente.",
      "Relaciona las nuevas fronteras químicas con la tecnología que usas a diario.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "Concepto de materia",
        descripcion: "Identifica qué estudia la química y a qué objetos se aplica.",
        dificultad: "Básico",
        pregunta:
          "Completa: La química estudia la ______, su composición, estructura y transformaciones.",
        respuestaCorrecta: "Materia",
        pistas: "Es aquello que ocupa lugar en el espacio y se puede pesar.",
        placeholder: "Ingresa una palabra",
      },
      {
        id: 2,
        subtema: "Ramas clásicas",
        descripcion: "Relaciona las especialidades químicas con su campo de estudio.",
        dificultad: "Intermedio",
        pregunta:
          "Completa: La química _______ estudia los compuestos que contienen carbono en su estructura.",
        respuestaCorrecta: "Orgánica",
        pistas: "Piensa en moléculas presentes en los seres vivos y en los plásticos.",
        placeholder: "Escribe la especialidad",
      },
      {
        id: 3,
        subtema: "Química aplicada",
        descripcion: "Identifica una aplicación concreta de la química en la vida cotidiana.",
        dificultad: "Intermedio",
        pregunta:
          "¿Qué rama de la química monitorea los contaminantes en el agua, el suelo y el aire?",
        respuestaCorrecta: "Ambiental",
        pistas: "Sus estudios son clave para diseñar políticas de saneamiento.",
        placeholder: "Escribe el campo",
      },
      {
        id: 4,
        subtema: "Química y energía",
        descripcion: "Relaciona el aporte de la química a la energía nuclear.",
        dificultad: "Avanzado",
        pregunta:
          "Completa: El IPEN produce ________ para diagnosticar el funcionamiento de órganos internos.",
        respuestaCorrecta: "Radiofármacos",
        pistas: "Son compuestos radiactivos que se incorporan al cuerpo de manera controlada.",
        placeholder: "Ingresa el término",
      },
      {
        id: 5,
        subtema: "Tecnología y química",
        descripcion: "Reconoce nuevos campos de investigación química.",
        dificultad: "Intermedio",
        pregunta:
          "¿Qué disciplina química diseña máquinas moleculares artificiales a escala nanométrica?",
        respuestaCorrecta: "Nanoquímica",
        pistas: "Opera en dimensiones de uno a cien nanómetros.",
        placeholder: "Escribe la disciplina",
      },
      {
        id: 6,
        subtema: "Química y medicina",
        descripcion: "Relaciona sustancias químicas con su uso en salud.",
        dificultad: "Intermedio",
        pregunta:
          "Completa: Las _______ nos protegen de enfermedades al entrenar nuestro sistema inmunológico.",
        respuestaCorrecta: "Vacunas",
        pistas: "Su desarrollo es un trabajo conjunto entre química, biología y medicina.",
        placeholder: "Ingresa la palabra",
      },
    ],
  },
};
