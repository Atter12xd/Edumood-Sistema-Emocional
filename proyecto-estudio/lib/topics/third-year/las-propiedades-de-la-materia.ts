import { Atom } from "lucide-react";

import type { TopicContent } from "./types";

export const lasPropiedadesDeLaMateriaTopic: TopicContent = {
  id: "las-propiedades-de-la-materia",
  nombre: "Las propiedades de la materia",
  resumen:
    "Distingue entre propiedades generales y específicas de la materia, reconociendo cuáles permiten identificar sustancias y predecir su comportamiento.",
  progreso: 5,
  color: "from-violet-500 via-purple-500 to-pink-500",
  icono: Atom,
  contexto: {
    etiqueta: "COMPRENDEMOS",
    titulo: "¿Cómo describimos la materia?",
    icono: Atom,
    parrafos: [
      "Toda sustancia posee características observables o medibles llamadas propiedades. Algunas son generales, comunes a cualquier cuerpo; otras son específicas y ayudan a diferenciar sustancias.",
      "Las propiedades generales incluyen masa, peso, inercia, porosidad e impenetrabilidad: definen cómo la materia ocupa espacio y responde a fuerzas.",
      "Las propiedades específicas se dividen en químicas y físicas. Las químicas describen cómo reacciona una sustancia frente a otras; las físicas se aprecian sin cambiar su composición.",
      "Conocer propiedades como densidad, solubilidad, dureza o conductividad nos permite seleccionar materiales para aplicaciones concretas y comprender fenómenos naturales.",
    ],
    reflexiones: [
      "¿Por qué la masa no sirve para identificar una sustancia específica?",
      "¿Qué propiedad elegirías para comparar metales en ingeniería?",
      "¿Cómo influyen las propiedades químicas en la seguridad de los laboratorios?",
    ],
  },
  subtemas: [
    "Propiedades generales",
    "Propiedades específicas químicas",
    "Propiedades específicas físicas",
    "Aplicaciones de las propiedades",
  ],
  recursos: [
    "Mapa mental: Propiedades generales vs específicas",
    "Video: Propiedades físicas en la vida diaria",
    "Infografía: Reacciones químicas comunes",
    "Simulador: Medición de densidad",
  ],
  comic: {
    titulo: "Las propiedades de la materia",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "📘",
        texto:
          "Hoy exploraremos cómo describir la materia. No todas las características sirven para identificar una sustancia.",
        fondo: "from-violet-600 to-purple-500",
        challenge: {
          pregunta: "Las propiedades se clasifican en...",
          opciones: ["Generales y específicas", "Internas y externas"],
          respuesta: "Generales y específicas",
          explicacion: "Es la división más común para estudiar la materia.",
        },
      },
      {
        personaje: "⚖️",
        texto:
          "Las propiedades generales como masa y peso están presentes en cualquier objeto, pero no identifican una sustancia.",
        fondo: "from-purple-500 to-indigo-500",
        challenge: {
          pregunta: "¿La masa es una propiedad...",
          opciones: ["General", "Específica"],
          respuesta: "General",
          explicacion: "La poseen todos los cuerpos independientemente de su naturaleza.",
        },
      },
      {
        personaje: "🛡️",
        texto:
          "La inercia, la porosidad y la impenetrabilidad explican cómo la materia ocupa espacio y reacciona a fuerzas.",
        fondo: "from-indigo-500 to-blue-500",
        challenge: {
          pregunta: "¿Qué propiedad describe la resistencia a cambiar de movimiento?",
          opciones: ["Inercia", "Solubilidad"],
          respuesta: "Inercia",
          explicacion: "Es una propiedad general relacionada con la masa.",
        },
      },
      {
        personaje: "🔥",
        texto:
          "Las propiedades específicas químicas indican cómo reacciona una sustancia: combustión, reactividad con agua, ácidos o bases.",
        fondo: "from-blue-500 to-cyan-500",
        challenge: {
          pregunta: "La combustión es una propiedad...",
          opciones: ["Química", "Física"],
          respuesta: "Química",
          explicacion: "Implica la formación de nuevas sustancias al reaccionar con oxígeno.",
        },
      },
      {
        personaje: "💧",
        texto:
          "Propiedades físicas como estado de agregación, punto de fusión o solubilidad se observan sin alterar la composición.",
        fondo: "from-cyan-500 to-sky-500",
        challenge: {
          pregunta: "¿Qué propiedad física describe la temperatura a la que hierve un líquido?",
          opciones: ["Punto de ebullición", "Tenacidad"],
          respuesta: "Punto de ebullición",
          explicacion: "Es la transición de líquido a gas al alcanzar cierta temperatura.",
        },
      },
      {
        personaje: "⚙️",
        texto:
          "La densidad relaciona masa y volumen, mientras que la dureza y la tenacidad miden resistencia a rayarse o romperse.",
        fondo: "from-sky-500 to-teal-500",
        challenge: {
          pregunta: "Densidad se calcula como...",
          opciones: ["Masa / Volumen", "Volumen / Masa"],
          respuesta: "Masa / Volumen",
          explicacion: "Es una razón que caracteriza a cada sustancia.",
        },
      },
      {
        personaje: "🎨",
        texto:
          "Propiedades organolépticas como color, olor o textura se perciben con los sentidos y ayudan a distinguir alimentos o materiales.",
        fondo: "from-teal-500 to-emerald-500",
        challenge: {
          pregunta: "¿Cuál es una propiedad organoléptica?",
          opciones: ["Olor", "Conductividad"],
          respuesta: "Olor",
          explicacion: "Se detecta mediante los sentidos sin alterar la composición.",
        },
      },
      {
        personaje: "🧠",
        texto:
          "Conocer propiedades específicas nos guía para seleccionar materiales en tecnología, medicina o industria.",
        fondo: "from-emerald-500 to-green-500",
        challenge: {
          pregunta: "¿Por qué usamos acero en estructuras?",
          opciones: ["Alta tenacidad", "Alto punto de ebullición"],
          respuesta: "Alta tenacidad",
          explicacion: "Resiste impactos y deformaciones, ideal para construcciones.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de propiedades de la materia",
    introduccion:
      "Evalúa tus conocimientos sobre propiedades generales, físicas y químicas seleccionando la clasificación o aplicación correcta.",
    consejos: [
      "Lee cuidadosamente la descripción: si implica cambio de composición, es propiedad química.",
      "Relaciona cada propiedad física con ejemplos cotidianos para recordarla mejor.",
      "Utiliza la densidad y la dureza para comparar materiales de uso técnico.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "Propiedades generales",
        descripcion: "Clasifica una característica como general o específica.",
        dificultad: "Básico",
        pregunta: "Completa: La ______ es la resistencia a cambiar el estado de movimiento.",
        respuestaCorrecta: "Inercia",
        pistas: "Depende de la masa y aplica a todo cuerpo.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 2,
        subtema: "Propiedades químicas",
        descripcion: "Identifica una propiedad relacionada con reacciones químicas.",
        dificultad: "Intermedio",
        pregunta: "¿Cómo se llama la capacidad de reaccionar violentamente con el agua, como el sodio?",
        respuestaCorrecta: "Reactividad",
        pistas: "Genera hidróxidos y libera hidrógeno.",
        placeholder: "Escribe la palabra",
      },
      {
        id: 3,
        subtema: "Propiedades físicas",
        descripcion: "Reconoce una propiedad observable sin alterar la sustancia.",
        dificultad: "Intermedio",
        pregunta: "Completa: El ______ es la temperatura a la que un sólido pasa a líquido.",
        respuestaCorrecta: "Punto de fusión",
        pistas: "Para el agua es 0 °C a nivel del mar.",
        placeholder: "Ingresa el término",
      },
      {
        id: 4,
        subtema: "Densidad y aplicaciones",
        descripcion: "Aplica la fórmula de densidad en un contexto práctico.",
        dificultad: "Avanzado",
        pregunta: "La densidad se calcula dividiendo la masa entre el ______.",
        respuestaCorrecta: "Volumen",
        pistas: "Permite comparar sustancias independientemente de su tamaño.",
        placeholder: "Completa la palabra",
      },
      {
        id: 5,
        subtema: "Propiedades mecánicas",
        descripcion: "Asocia la propiedad con el ejemplo adecuado.",
        dificultad: "Intermedio",
        pregunta: "¿Qué propiedad permite al aluminio convertirse en láminas finas?",
        respuestaCorrecta: "Maleabilidad",
        pistas: "Se refiere a la capacidad de formar láminas sin romperse.",
        placeholder: "Escribe la propiedad",
      },
      {
        id: 6,
        subtema: "Conductividad",
        descripcion: "Identifica materiales buenos conductores.",
        dificultad: "Intermedio",
        pregunta: "Completa: El cobre destaca por su alta ______ eléctrica.",
        respuestaCorrecta: "Conductividad",
        pistas: "Por eso se usa en cables e instalaciones.",
        placeholder: "Ingresa la palabra",
      },
    ],
  },
};
