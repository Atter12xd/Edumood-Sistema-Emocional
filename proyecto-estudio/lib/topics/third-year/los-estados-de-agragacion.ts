import { Atom } from "lucide-react";

import type { TopicContent } from "./types";

export const losEstadosDeAgregacionTopic: TopicContent = {
  id: "los-estados-de-agregacion",
  nombre: "Los estados de agregación de la materia",
  resumen:
    "Explora cómo la teoría cinética explica los estados sólido, líquido, gaseoso y estados avanzados como plasma y superfluido, así como los cambios entre ellos.",
  progreso: 5,
  color: "from-blue-600 via-indigo-500 to-purple-500",
  icono: Atom,
  contexto: {
    etiqueta: "ANALIZAMOS",
    titulo: "Del sólido al plasma",
    icono: Atom,
    parrafos: [
      "La materia puede presentarse en distintos estados de agregación. La teoría cinética, desarrollada por Maxwell y Boltzmann, explica estos estados según la energía y movimiento de las partículas.",
      "En el estado sólido, las partículas vibran alrededor de posiciones fijas con fuerzas de cohesión intensas. En los líquidos, las fuerzas son menores y permiten el flujo.",
      "Los gases tienen partículas muy separadas con movimiento desordenado. Al aumentar aún más la energía aparecen estados especiales como el plasma y el superfluido.",
      "Los cambios de estado dependen de la competencia entre fuerzas de cohesión y repulsión (energía cinética). Temperatura y presión influyen en las transiciones.",
    ],
    reflexiones: [
      "¿Qué factores determinan el estado de una sustancia?",
      "¿Cómo justifica la teoría cinética los cambios de estado?",
      "¿Dónde encontramos plasma o superfluidos en la vida real?",
    ],
  },
  subtemas: [
    "Teoría cinética",
    "Estados clásicos: sólido, líquido, gas",
    "Estados especiales: plasma y superfluido",
    "Cambios de estado y variables externas",
  ],
  recursos: [
    "Animación: Teoría cinética molecular",
    "Video: Superfluido y condensado de Bose-Einstein",
    "Podcast: El plasma solar",
    "Tabla interactiva de cambios de estado",
  ],
  comic: {
    titulo: "Los estados de la materia",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "🔍",
        texto:
          "La teoría cinética explica que la materia está formada por partículas siempre en movimiento. Su energía determina el estado de agregación.",
        fondo: "from-indigo-700 to-blue-600",
        challenge: {
          pregunta: "¿Qué describe la teoría cinética?",
          opciones: ["El movimiento de partículas según su energía", "La forma geométrica de los átomos"],
          respuesta: "El movimiento de partículas según su energía",
          explicacion: "La teoría cinética relaciona temperatura y movimiento de partículas.",
        },
      },
      {
        personaje: "🧊",
        texto:
          "En los sólidos las partículas permanecen muy juntas, con fuerzas de cohesión intensas y movimientos de vibración.",
        fondo: "from-blue-600 to-cyan-500",
        challenge: {
          pregunta: "Las partículas del sólido...",
          opciones: ["Vibran en posiciones fijas", "Se mueven libremente"],
          respuesta: "Vibran en posiciones fijas",
          explicacion: "La cohesión fuerte mantiene al sólido rígido.",
        },
      },
      {
        personaje: "💧",
        texto:
          "Los líquidos tienen partículas más separadas que pueden deslizarse unas sobre otras, permitiendo el flujo y adaptarse al recipiente.",
        fondo: "from-cyan-500 to-teal-500",
        challenge: {
          pregunta: "¿Por qué los líquidos fluyen?",
          opciones: ["Las fuerzas de cohesión son menores", "Las partículas están inmóviles"],
          respuesta: "Las fuerzas de cohesión son menores",
          explicacion: "Forman grupos que se deslizan y permiten cambios de forma.",
        },
      },
      {
        personaje: "☁️",
        texto:
          "Los gases tienen partículas muy separadas con fuerzas despreciables y movimiento desordenado. Son comprensibles y ejercen presión.",
        fondo: "from-teal-500 to-emerald-500",
        challenge: {
          pregunta: "En un gas las partículas...",
          opciones: ["Están muy separadas", "Están fijas"],
          respuesta: "Están muy separadas",
          explicacion: "Su energía cinética es alta, por eso ocupan todo el recipiente.",
        },
      },
      {
        personaje: "🧪",
        texto: `Existen estados especiales: el superfluido, como el helio cercano al cero absoluto, fluye sin fricción;
        el plasma aparece a millones de grados con átomos ionizados.`,
        fondo: "from-emerald-500 to-green-500",
        challenge: {
          pregunta: "El plasma se caracteriza por...",
          opciones: ["Partículas ionizadas", "Partículas inmóviles"],
          respuesta: "Partículas ionizadas",
          explicacion: "Los átomos pierden electrones y forman una mezcla de cargas.",
        },
      },
      {
        personaje: "🔥",
        texto:
          "Los cambios de estado (fusión, solidificación, evaporación, condensación, sublimación) ocurren al variar la temperatura o presión.",
        fondo: "from-green-500 to-lime-500",
        challenge: {
          pregunta: "El paso de sólido a gas directamente es...",
          opciones: ["Sublimación", "Fusión"],
          respuesta: "Sublimación",
          explicacion: "Ocurre en sustancias como el yodo o el alcanfor.",
        },
      },
      {
        personaje: "💨",
        texto:
          "La vaporación puede ser lenta (evaporación) o rápida (ebullición). Depende de la energía suministrada a la sustancia.",
        fondo: "from-lime-500 to-yellow-500",
        challenge: {
          pregunta: "La ebullición ocurre cuando...",
          opciones: ["Toda la masa alcanza el punto de ebullición", "Solo la superficie se calienta"],
          respuesta: "Toda la masa alcanza el punto de ebullición",
          explicacion: "La evaporación ocurre en la superficie, la ebullición en toda la sustancia",
        },
      },
      {
        personaje: "🌡️",
        texto:
          "Variando presión y temperatura podemos inducir cambios de estado. Esto se aprovecha en refrigeración, licuefacción de gases y técnicas industriales.",
        fondo: "from-yellow-500 to-amber-500",
        challenge: {
          pregunta: "¿Qué efecto tiene aumentar la presión en un gas?",
          opciones: ["Tiende a licuarlo", "Lo convierte en plasma"],
          respuesta: "Tiende a licuarlo",
          explicacion: "La presión acerca las partículas y favorece la condensación.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de estados de agregación",
    introduccion:
      "Identifica estados de la materia, explica transiciones y vincula la teoría cinética con la temperatura y la presión.",
    consejos: [
      "Piensa en la energía cinética de las partículas para determinar el estado.",
      "Relaciona cada cambio con el aumento o disminución de temperatura o presión.",
      "Recuerda ejemplos cotidianos (agua, metales, aire) para justificar tus respuestas.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "Teoría cinética",
        descripcion: "Explica la base de la teoría cinética.",
        dificultad: "Básico",
        pregunta: "Completa: La temperatura está relacionada con la energía ______ de las partículas.",
        respuestaCorrecta: "Cinética",
        pistas: "Mayor temperatura implica partículas más rápidas.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 2,
        subtema: "Estado sólido",
        descripcion: "Reconoce las características de los sólidos.",
        dificultad: "Intermedio",
        pregunta: "El estado sólido se caracteriza por fuerzas de cohesión _______.",
        respuestaCorrecta: "Intensas",
        pistas: "Las partículas vibran en posiciones fijas.",
        placeholder: "Completa la palabra",
      },
      {
        id: 3,
        subtema: "Estado líquido",
        descripcion: "Explica por qué los líquidos fluyen.",
        dificultad: "Intermedio",
        pregunta: "Completa: En los líquidos las partículas se deslizan porque las fuerzas de cohesión son más _____.",
        respuestaCorrecta: "Débiles",
        pistas: "Los líquidos se adaptan al recipiente que los contiene.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 4,
        subtema: "Estado gaseoso",
        descripcion: "Relaciona volumen, presión y partículas.",
        dificultad: "Intermedio",
        pregunta: "Los gases se comprimen porque sus partículas están muy _______.",
        respuestaCorrecta: "Separadas",
        pistas: "Su densidad es baja y ocupan todo el recipiente.",
        placeholder: "Completa la palabra",
      },
      {
        id: 5,
        subtema: "Estados especiales",
        descripcion: "Diferencia plasma y superfluido.",
        dificultad: "Avanzado",
        pregunta: "Completa: El ______ es un estado cercano al cero absoluto en el que un gas licuado fluye sin fricción.",
        respuestaCorrecta: "Superfluido",
        pistas: "Se logra con helio a muy bajas temperaturas.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 6,
        subtema: "Cambios de estado",
        descripcion: "Selecciona el nombre correcto de la transición.",
        dificultad: "Intermedio",
        pregunta: "¿Cómo se llama el cambio de gas a líquido por enfriamiento o presión?",
        respuestaCorrecta: "Condensación",
        pistas: "Es el proceso inverso a la vaporización.",
        placeholder: "Escribe la palabra",
      },
    ],
  },
};
