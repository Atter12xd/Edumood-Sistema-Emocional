import { Atom } from "lucide-react";

import type { TopicContent } from "./types";

export const laMateriaTopic: TopicContent = {
  id: "la-materia",
  nombre: "La Materia",
  resumen:
    "Analiza la materia desde sus propiedades, cambios y métodos de separación para comprender su comportamiento en la vida cotidiana.",
  progreso: 15,
  color: "from-blue-500 via-sky-500 to-cyan-400",
  icono: Atom,
  contexto: {
    etiqueta: "EXPLORAMOS",
    titulo: "¿De qué está hecho todo?",
    icono: Atom,
    parrafos: [
      "La materia es todo aquello que tiene masa y ocupa un lugar en el espacio. Desde el agua que bebemos hasta los metales que usamos, cada objeto se compone de partículas invisibles.",
      "Comprender la materia implica reconocer cómo se clasifica, qué propiedades exhibe y qué cambios puede experimentar sin dejar de ser ella misma o transformándose en algo nuevo.",
    ],
    reflexiones: [
      "¿Qué propiedades diferencian a una sustancia pura de una mezcla?",
      "¿Cuándo un cambio es físico y cuándo es químico?",
      "¿Por qué algunos cambios de estado son reversibles?",
    ],
  },
  subtemas: [
    "La química",
    "Clasificación de la materia",
    "Métodos de separación",
    "Propiedades de la materia",
    "Estados de agregación",
    "Cambios físicos y químicos",
  ],
  recursos: [
    "Infografía: Y la química anota… ¡Go!",
    "Resumen",
    "Ideas principales",
    "Organizador visual: sinóptico",
    "Opciones de consulta",
  ],
  comic: {
    titulo: "La Materia",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "🧑‍🔬",
        texto:
          "¡Hola! Soy el Dr. Átomo. Hoy descubrirás por qué la química es la ciencia que estudia la materia en todas sus formas.",
        fondo: "from-blue-600 to-cyan-600",
        challenge: {
          pregunta: "¿Qué estudia la química?",
          opciones: ["La materia y sus transformaciones", "Solo la energía de la luz"],
          respuesta: "La materia y sus transformaciones",
          explicacion: "La química analiza la materia, cómo está compuesta y los cambios que experimenta.",
        },
      },
      {
        personaje: "🧭",
        texto:
          "Podemos clasificar la materia en sustancias puras y mezclas. Cada categoría tiene características únicas.",
        fondo: "from-cyan-600 to-sky-600",
        challenge: {
          pregunta: "¿Cuál es una característica de una sustancia pura?",
          opciones: ["Tiene composición definida", "Se mezcla en proporciones variables"],
          respuesta: "Tiene composición definida",
          explicacion: "Las sustancias puras conservan la misma composición y propiedades.",
        },
      },
      {
        personaje: "🧪",
        texto:
          "Cuando una mezcla necesita separarse, usamos métodos como la filtración, decantación o destilación.",
        fondo: "from-sky-600 to-indigo-600",
        challenge: {
          pregunta: "¿Qué método separarías para un sólido insoluble en líquido?",
          opciones: ["Filtración", "Destilación"],
          respuesta: "Filtración",
          explicacion: "La filtración retiene el sólido dejando pasar el líquido.",
        },
      },
      {
        personaje: "🔬",
        texto:
          "Las propiedades de la materia pueden ser físicas, como el color, o químicas, como la reactividad.",
        fondo: "from-indigo-600 to-purple-600",
        challenge: {
          pregunta: "Identifica una propiedad química",
          opciones: ["Reactividad", "Color"],
          respuesta: "Reactividad",
          explicacion: "Las propiedades químicas describen la capacidad de reaccionar y formar nuevas sustancias.",
        },
      },
      {
        personaje: "💫",
        texto:
          "Los estados de agregación: sólido, líquido, gas y plasma. Cada uno cambia según la energía que recibe.",
        fondo: "from-purple-600 to-fuchsia-600",
        challenge: {
          pregunta: "¿Qué ocurre al aumentar la energía térmica de un sólido?",
          opciones: ["Puede fundirse", "Se vuelve más pesado"],
          respuesta: "Puede fundirse",
          explicacion: "El calor facilita transiciones de fase como la fusión.",
        },
      },
      {
        personaje: "🚀",
        texto:
          "Cuando la materia cambia, puede ser un proceso físico o químico. ¡Vamos al laboratorio para experimentar!",
        fondo: "from-fuchsia-600 to-pink-600",
        challenge: {
          pregunta: "Un cambio físico se caracteriza porque...",
          opciones: ["No altera la composición", "Genera nuevas sustancias"],
          respuesta: "No altera la composición",
          explicacion: "En un cambio físico la materia mantiene su identidad química.",
        },
      },
      {
        personaje: "🌡️",
        texto:
          "Cuando el agua hierve pasa de líquido a gas: un cambio físico reversible. La composición molecular no se altera.",
        fondo: "from-pink-600 to-rose-600",
        challenge: {
          pregunta: "¿Cómo describirías la ebullición del agua?",
          opciones: ["Cambio físico reversible", "Cambio químico irreversible"],
          respuesta: "Cambio físico reversible",
          explicacion: "El vapor puede condensarse y volver a ser agua líquida.",
        },
      },
      {
        personaje: "⚙️",
        texto:
          "Si combinamos hierro con oxígeno aparece óxido: ahí la materia sí cambia de composición, se trata de un cambio químico.",
        fondo: "from-rose-600 to-amber-500",
        challenge: {
          pregunta: "La oxidación del hierro es un ejemplo de...",
          opciones: ["Cambio químico", "Cambio físico"],
          respuesta: "Cambio químico",
          explicacion: "Se forma una sustancia nueva: el óxido de hierro.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de la Materia",
    introduccion:
      "Pon a prueba tus conocimientos sobre propiedades, estados y transformaciones de la materia mediante retos interactivos.",
    consejos: [
      "Relaciona cada ejercicio con los ejemplos vistos en el cómic.",
      "Piensa si la materia cambia su composición o solo su estado físico.",
      "Recuerda los métodos de separación para elegir la técnica adecuada.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "La química",
        descripcion: "Identifica qué estudia la química como ciencia central.",
        dificultad: "Básico",
        pregunta:
          "Completa: La química estudia la ______, su composición, estructura y transformaciones.",
        respuestaCorrecta: "Materia",
        pistas: "Es aquello de lo que está hecho todo lo que nos rodea.",
        placeholder: "Ingresa una palabra",
      },
      {
        id: 2,
        subtema: "Clasificación de la materia",
        descripcion: "Reconoce el tipo de sistema cuando mezclamos sustancias sin reacción química.",
        dificultad: "Intermedio",
        pregunta:
          "¿Cómo se llama la combinación física de dos o más sustancias donde cada componente conserva sus propiedades?",
        respuestaCorrecta: "Mezcla",
        pistas: "Puede ser homogénea o heterogénea.",
        placeholder: "Escribe el término",
      },
      {
        id: 3,
        subtema: "Métodos de separación",
        descripcion: "Selecciona el método apropiado para separar un sólido insoluble de un líquido.",
        dificultad: "Intermedio",
        pregunta:
          "¿Qué técnica de laboratorio utiliza un papel poroso para retener sólidos y permitir el paso del líquido?",
        respuestaCorrecta: "Filtración",
        pistas: "Se usa con embudos y filtros circulares.",
        placeholder: "Nombre del método",
      },
      {
        id: 4,
        subtema: "Propiedades de la materia",
        descripcion:
          "Distingue el tipo de propiedad según dependa o no de la cantidad de materia presente.",
        dificultad: "Avanzado",
        pregunta:
          "Las propiedades que varían con la cantidad de materia, como la masa o el volumen, se denominan propiedades _____.",
        respuestaCorrecta: "Extensivas",
        pistas: "Se contrastan con las propiedades intensivas.",
        placeholder: "Completa la palabra",
      },
      {
        id: 5,
        subtema: "Estados de agregación",
        descripcion: "Determina qué estado de agregación carece de forma y volumen definidos.",
        dificultad: "Básico",
        pregunta:
          "¿Qué estado de agregación se expande hasta ocupar todo el recipiente y es altamente compresible?",
        respuestaCorrecta: "Gas",
        pistas: "Sus partículas están muy separadas entre sí.",
        placeholder: "Nombre del estado",
      },
      {
        id: 6,
        subtema: "Cambios de la materia",
        descripcion: "Clasifica un cambio según altere o no la composición química.",
        dificultad: "Intermedio",
        pregunta:
          "Cuando el hierro se oxida y forma óxido, ocurre un cambio _____.",
        respuestaCorrecta: "Químico",
        pistas: "Se generan nuevas sustancias con propiedades diferentes.",
        placeholder: "Completa la palabra",
      },
    ],
  },
};
