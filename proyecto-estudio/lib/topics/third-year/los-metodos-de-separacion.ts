import { Atom } from "lucide-react";

import type { TopicContent } from "./types";

export const losMetodosDeSeparacionTopic: TopicContent = {
  id: "los-metodos-de-separacion",
  nombre: "Los métodos de separación de mezclas",
  resumen:
    "Aprende a escoger el método adecuado para separar mezclas de sólidos, líquidos o gases según sus propiedades físicas.",
  progreso: 5,
  color: "from-orange-500 via-amber-500 to-yellow-400",
  icono: Atom,
  contexto: {
    etiqueta: "APLICAMOS",
    titulo: "¿Cómo separar una mezcla?",
    icono: Atom,
    parrafos: [
      "Antes de elegir un método de separación debemos conocer las propiedades de los componentes: tamaño de partícula, densidad, solubilidad o punto de ebullición.",
      "Para mezclas de sólidos, el tamizado clasifica por tamaños y la levigación aprovecha la densidad para separar minerales como el oro.",
      "En sólidos con líquidos usamos decantación, filtración o centrifugación, técnicas clave en laboratorios, industrias y el tratamiento de aguas.",
      "Para líquidos miscibles recurrimos a destilaciones simples o fraccionadas, y la cromatografía nos permite identificar componentes con distinta afinidad al disolvente.",
    ],
    reflexiones: [
      "¿Qué método elegirías para separar arena de grava en la minería informal?",
      "¿Cómo afecta la centrifugación clínica al diagnóstico médico?",
      "¿Qué riesgos trae la minería ilegal para la salud al usar levigación con mercurio?",
    ],
  },
  subtemas: [
    "Mezclas sólido-sólido",
    "Mezclas sólido-líquido",
    "Mezclas líquido-líquido",
    "Destilación y cromatografía",
  ],
  recursos: [
    "Guía interactiva: separación de mezclas",
    "Video: Destilación en la industria",
    "Reporte: Impacto de la minería informal",
    "Laboratorio virtual: cromatografía",
  ],
  comic: {
    titulo: "Los métodos de separación",
    personaje: "Dr. Átomo",
    paneles: [
      {
        personaje: "🎒",
        texto:
          "Imagina una limonada con pulpa y azúcar. Cada mezcla requiere un método distinto para separar sus componentes.",
        fondo: "from-amber-400 to-yellow-400",
        challenge: {
          pregunta: "¿Qué debemos conocer antes de separar una mezcla?",
          opciones: ["Las propiedades de sus componentes", "El color del recipiente"],
          respuesta: "Las propiedades de sus componentes",
          explicacion: "Tamaño, densidad o solubilidad determinan el método apropiado.",
        },
      },
      {
        personaje: "🧺",
        texto:
          "El tamizado separa sólidos de distinto tamaño usando un tamiz. Ideal para clasificar granos o harina.",
        fondo: "from-yellow-400 to-orange-400",
        challenge: {
          pregunta: "¿Qué diferencia aprovecha el tamizado?",
          opciones: ["El tamaño de partícula", "El punto de fusión"],
          respuesta: "El tamaño de partícula",
          explicacion: "Las partículas menores atraviesan la malla mientras las grandes quedan retenidas.",
        },
      },
      {
        personaje: "⛏️",
        texto:
          "La levigación pulveriza sólidos y usa un solvente para separar por densidad. Se usa para extraer oro en minería.",
        fondo: "from-orange-400 to-amber-500",
        challenge: {
          pregunta: "¿Qué propiedad diferencia la levigación?",
          opciones: ["La densidad", "El color"],
          respuesta: "La densidad",
          explicacion: "Los minerales más densos sedimentan mientras los ligeros se eliminan.",
        },
      },
      {
        personaje: "⚖️",
        texto:
          "Para separar un sólido de un líquido podemos decantar, esperando que el sólido se deposite por su densidad.",
        fondo: "from-amber-500 to-orange-500",
        challenge: {
          pregunta: "¿Qué debes hacer antes de decantar?",
          opciones: ["Dejar reposar la mezcla", "Hervirla"],
          respuesta: "Dejar reposar la mezcla",
          explicacion: "Así el sólido sedimenta y el líquido se vierte sin arrastrarlo.",
        },
      },
      {
        personaje: "🧪",
        texto:
          "La filtración usa materiales porosos para retener sólidos y dejar pasar el líquido. Presente en laboratorios y plantas de agua.",
        fondo: "from-orange-500 to-red-500",
        challenge: {
          pregunta: "¿Qué herramienta es clave en la filtración?",
          opciones: ["Papel de filtro", "Termómetro"],
          respuesta: "Papel de filtro",
          explicacion: "El filtro retiene las partículas sólidas mientras el líquido lo atraviesa.",
        },
      },
      {
        personaje: "🌀",
        texto:
          "Cuando la filtración no basta, la centrifugación separa sólidos insolubles girando a gran velocidad.",
        fondo: "from-red-500 to-pink-500",
        challenge: {
          pregunta: "¿Para qué se usa la centrifugación clínica?",
          opciones: ["Analizar la sangre", "Congelar muestras"],
          respuesta: "Analizar la sangre",
          explicacion: "Permite separar plasma y células para estudios médicos.",
        },
      },
      {
        personaje: "🔥",
        texto:
          "La destilación simple separa líquidos con puntos de ebullición distintos. El vapor se condensa en un refrigerante.",
        fondo: "from-pink-500 to-rose-500",
        challenge: {
          pregunta: "¿Qué ocurre en la destilación?",
          opciones: ["El líquido se vaporiza y se condensa", "El líquido se solidifica"],
          respuesta: "El líquido se vaporiza y se condensa",
          explicacion: "El componente con menor punto de ebullición se recupera como destilado.",
        },
      },
      {
        personaje: "🧬",
        texto:
          "La destilación fraccionada y la cromatografía separan líquidos con puntos de ebullición cercanos o componentes con distinta afinidad.",
        fondo: "from-rose-500 to-purple-500",
        challenge: {
          pregunta: "¿Para qué sirve la cromatografía?",
          opciones: ["Separar componentes por afinidad", "Mezclar líquidos rápidamente"],
          respuesta: "Separar componentes por afinidad",
          explicacion: "La fase móvil arrastra cada componente a velocidades distintas.",
        },
      },
    ],
  },
  laboratorio: {
    titulo: "Laboratorio de separación de mezclas",
    introduccion:
      "Resuelve retos para elegir el método de separación más eficiente según el tipo de mezcla y sus propiedades.",
    consejos: [
      "Primero identifica si la mezcla es homogénea o heterogénea.",
      "Compara densidades, tamaños de partícula y solubilidad antes de decidir.",
      "Recuerda que algunos métodos requieren equipo especializado como la centrífuga o el refrigerante.",
    ],
    ejercicios: [
      {
        id: 1,
        subtema: "Tamizado",
        descripcion: "Selecciona cuándo aplicar el tamizado.",
        dificultad: "Básico",
        pregunta: "¿Qué mezcla se separa mejor con un tamiz?",
        respuestaCorrecta: "Arena y grava",
        pistas: "Las partículas tienen tamaños claramente distintos.",
        placeholder: "Escribe la mezcla",
      },
      {
        id: 2,
        subtema: "Levigación",
        descripcion: "Relaciona densidad con el uso de disolventes.",
        dificultad: "Intermedio",
        pregunta: "Completa: La levigación se basa en la diferencia de ______ de los sólidos.",
        respuestaCorrecta: "Densidad",
        pistas: "Los minerales pesados sedimentan y los ligeros flotan.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 3,
        subtema: "Filtración",
        descripcion: "Identifica componentes retenidos en el filtro.",
        dificultad: "Intermedio",
        pregunta:
          "Al filtrar barro con agua, ¿qué material retiene el sólido?",
        respuestaCorrecta: "Papel de filtro",
        pistas: "Es un material poroso usado en laboratorio.",
        placeholder: "Escribe el material",
      },
      {
        id: 4,
        subtema: "Centrifugación",
        descripcion: "Evalúa cuándo usar una centrífuga.",
        dificultad: "Avanzado",
        pregunta: "¿Qué mezcla analiza la centrifugación clínica?",
        respuestaCorrecta: "Sangre",
        pistas: "Permite separar plasma y células sanguíneas.",
        placeholder: "Ingresa la mezcla",
      },
      {
        id: 5,
        subtema: "Destilación",
        descripcion: "Diferencia destilación simple y fraccionada.",
        dificultad: "Intermedio",
        pregunta:
          "Completa: La destilación fraccionada separa líquidos cuyos puntos de ebullición son ______.",
        respuestaCorrecta: "Cercanos",
        pistas: "Se emplea una columna de fraccionamiento.",
        placeholder: "Ingresa la palabra",
      },
      {
        id: 6,
        subtema: "Cromatografía",
        descripcion: "Aplica el concepto de afinidad.",
        dificultad: "Intermedio",
        pregunta:
          "¿Qué parámetro diferencia a los componentes en cromatografía?",
        respuestaCorrecta: "Afinidad",
        pistas: "Cada componente avanza a distinta velocidad según su interacción con las fases.",
        placeholder: "Escribe la palabra",
      },
    ],
  },
};
