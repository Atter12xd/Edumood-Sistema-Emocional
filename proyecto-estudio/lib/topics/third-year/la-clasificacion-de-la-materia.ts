import { Atom } from "lucide-react";

import type { TopicContent } from "./types";

export const laClasificacionDeLaMateriaTopic: TopicContent = {
  id: "la-clasificacion-de-la-materia",
  nombre: "La clasificación de la materia",
  resumen:
    "Comprende cómo se organiza la materia en sustancias puras y mezclas, sus características y los métodos para diferenciarlas o separarlas.",
  progreso: 8,
  color: "from-indigo-500 via-blue-500 to-cyan-400",
  icono: Atom,
  contexto: {
    etiqueta: "OBSERVAMOS",
    titulo: "¿Cómo se clasifica la materia?",
    icono: Atom,
    parrafos: [
      "Una limonada es una mezcla de agua, azúcar y jugo de limón. Si separamos cada componente, podemos obtener sustancias puras como el agua o el azúcar.",
      "La clasificación más común de la materia se basa en su composición: puede presentarse como una sustancia pura o como una mezcla. Las sustancias puras se dividen en elementos y compuestos; las mezclas pueden ser homogéneas, heterogéneas o coloides.",
      "El agua es un ejemplo interesante: en sus tres estados físicos mantiene la misma composición. Sin embargo, mediante la electrólisis puede descomponerse en oxígeno e hidrógeno, lo que demuestra que es un compuesto.",
      "En la naturaleza es poco común encontrar sustancias totalmente puras. Las mezclas conservan propiedades de sus componentes, se combinan en proporciones variables y se separan mediante métodos físicos como filtración o destilación.",
    ],
    reflexiones: [
      "¿Por qué muchas bebidas y alimentos cotidianos son mezclas y no sustancias puras?",
      "¿Qué características permiten diferenciar una mezcla homogénea de una heterogénea?",
      "¿En qué situaciones es necesario separar mezclas y qué método conviene usar?",
    ],
  },
  subtemas: [
    "Sustancias puras: elementos y compuestos",
    "Mezclas: homogéneas, heterogéneas y coloides",
    "Métodos de separación de mezclas",
    "Electrólisis y descomposición de compuestos",
  ],
  recursos: [
    "Infografía: Clases de materia",
    "Video: Métodos de separación",
    "Artículo: Coloides en alimentos",
    "Bibliografía: La Biblia de la Física y Química (Minedu)",
  ],
  comic: {
    titulo: "Clasificando la materia",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "🍋",
        texto:
          "¿Qué hay en una limonada? Agua, azúcar y jugo de limón. Juntos forman una mezcla, pero cada componente conserva sus propiedades.",
        fondo: "from-amber-500 to-yellow-400",
        challenge: {
          pregunta: "Una limonada es un ejemplo de...",
          opciones: ["Mezcla", "Sustancia pura"],
          respuesta: "Mezcla",
          explicacion: "Sus componentes se combinan sin perder sus propiedades.",
        },
      },
      {
        personaje: "💧",
        texto:
          "La materia se clasifica según su composición: puede ser sustancia pura o mezcla. Las sustancias puras se dividen en elementos y compuestos; las mezclas pueden ser homogéneas, heterogéneas o coloides.",
        fondo: "from-yellow-400 to-sky-400",
        challenge: {
          pregunta: "¿Cómo se divide la materia?",
          opciones: ["Sustancias puras y mezclas", "Solo elementos"],
          respuesta: "Sustancias puras y mezclas",
          explicacion: "Esta clasificación se basa en la composición.",
        },
      },
      {
        personaje: "⚗️",
        texto:
          "Las sustancias puras incluyen elementos como el sodio (Na) y el cobre (Cu), y compuestos como el agua (H₂O) o el sulfato de cobre (CuSO₄).",
        fondo: "from-sky-400 to-blue-500",
        challenge: {
          pregunta: "¿Cuál es un ejemplo de compuesto?",
          opciones: ["H₂O", "Na"],
          respuesta: "H₂O",
          explicacion: "Los compuestos están formados por dos o más elementos unidos químicamente.",
        },
      },
      {
        personaje: "🔌",
        texto:
          "Al aplicar una corriente eléctrica al agua, la descomponemos en oxígeno e hidrógeno. Este proceso se llama electrólisis y muestra que el agua es un compuesto.",
        fondo: "from-blue-500 to-indigo-500",
        challenge: {
          pregunta: "La electrólisis del agua demuestra que...",
          opciones: ["El agua es un compuesto", "El agua es un elemento"],
          respuesta: "El agua es un compuesto",
          explicacion: "Se separa en sustancias más simples: oxígeno e hidrógeno.",
        },
      },
      {
        personaje: "🥤",
        texto:
          "Las mezclas son más comunes en la vida diaria. Sus componentes se combinan en proporciones variables y se pueden separar por métodos físicos.",
        fondo: "from-indigo-500 to-purple-500",
        challenge: {
          pregunta: "Una característica de las mezclas es...",
          opciones: ["Sus componentes se separan por métodos físicos", "Tienen composición fija"],
          respuesta: "Sus componentes se separan por métodos físicos",
          explicacion: "Los componentes de una mezcla pueden recuperarse sin cambios químicos.",
        },
      },
      {
        personaje: "🌫️",
        texto:
          "Una mezcla homogénea tiene una sola fase visible (como el aire o una solución de sal). Las heterogéneas muestran dos o más fases, como aceite y agua.",
        fondo: "from-purple-500 to-fuchsia-500",
        challenge: {
          pregunta: "¿Cuál mezcla presenta varias fases visibles?",
          opciones: ["Heterogénea", "Homogénea"],
          respuesta: "Heterogénea",
          explicacion: "Las mezclas heterogéneas muestran componentes distinguibles.",
        },
      },
      {
        personaje: "🥚",
        texto:
          "Los coloides son mezclas intermedias. La mayonesa, por ejemplo, es una emulsión donde las gotas de agua se dispersan en el aceite con ayuda de la lecitina del huevo.",
        fondo: "from-fuchsia-500 to-pink-500",
        challenge: {
          pregunta: "La mayonesa es un ejemplo de...",
          opciones: ["Coloide", "Suspensión gruesa"],
          respuesta: "Coloide",
          explicacion: "Es una emulsión donde una fase se dispersa en otra con estabilidad intermedia.",
        },
      },
      {
        personaje: "🧪",
        texto:
          "Para separar mezclas usamos filtración, destilación, evaporación u otros métodos. ¡Vamos al laboratorio a poner en práctica estas técnicas!",
        fondo: "from-pink-500 to-rose-500",
        challenge: {
          pregunta: "¿Qué método recuperarías para obtener sal de una solución?",
          opciones: ["Evaporación", "Filtración de gases"],
          respuesta: "Evaporación",
          explicacion: "Evaporar el solvente permite recuperar el soluto sólido.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de Clasificación de la Materia",
    introduccion:
      "Identifica si una muestra es sustancia pura o mezcla y selecciona el método ideal para separarla o analizarla.",
    consejos: [
      "Observa si los componentes se distinguen a simple vista o forman una sola fase.",
      "Recuerda que las sustancias puras tienen composición fija y fórmulas definidas.",
      "Piensa qué método físico sería más eficiente para separar cada mezcla.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "Sustancias puras",
        descripcion: "Reconoce la composición de un elemento químico.",
        dificultad: "Básico",
        pregunta: "Completa: El sodio metálico está formado únicamente por átomos de _______.",
        respuestaCorrecta: "Sodio",
        pistas: "Es un ejemplo de elemento químico.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 2,
        subtema: "Compuestos",
        descripcion: "Identifica la característica clave de un compuesto.",
        dificultad: "Intermedio",
        pregunta:
          "¿Cómo se llama el proceso químico que descompone el agua en oxígeno e hidrógeno usando corriente eléctrica?",
        respuestaCorrecta: "Electrólisis",
        pistas: "Es un método químico, no físico.",
        placeholder: "Escribe el término",
      },
      {
        id: 3,
        subtema: "Mezclas homogéneas",
        descripcion: "Clasifica una muestra según la distribución de sus componentes.",
        dificultad: "Intermedio",
        pregunta: "Completa: El aire es una mezcla ______ porque sus componentes están distribuidos uniformemente.",
        respuestaCorrecta: "Homogénea",
        pistas: "También se les llama soluciones.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 4,
        subtema: "Mezclas heterogéneas",
        descripcion: "Distingue un sistema con varias fases visibles.",
        dificultad: "Básico",
        pregunta: "¿Qué tipo de mezcla es el aceite con agua, si puedes distinguir claramente cada componente?",
        respuestaCorrecta: "Heterogénea",
        pistas: "Presenta dos o más fases.",
        placeholder: "Escribe el tipo",
      },
      {
        id: 5,
        subtema: "Coloides",
        descripcion: "Relaciona el tamaño de partículas con la clasificación de una mezcla.",
        dificultad: "Intermedio",
        pregunta:
          "Completa: La mayonesa es un ______, una mezcla donde la fase dispersa se mantiene suspendida gracias a la lecitina.",
        respuestaCorrecta: "Coloide",
        pistas: "Sus partículas tienen tamaño intermedio entre solución y suspensión.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 6,
        subtema: "Métodos de separación",
        descripcion: "Selecciona el método físico adecuado para separar una mezcla.",
        dificultad: "Avanzado",
        pregunta:
          "¿Qué técnica usarías para separar una mezcla de agua y sal obteniendo nuevamente la sal sólida?",
        respuestaCorrecta: "Evaporación",
        pistas: "Consiste en eliminar el solvente líquido.",
        placeholder: "Escribe el método",
      },
    ],
  },
};
