"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowLeft, Rocket } from "lucide-react";
import { getThirdYearTopic } from "@/lib/topics/third-year";

export default function ComicPage() {
  const params = useParams();
  const comicId = params.id as string;
  const [currentPanel, setCurrentPanel] = useState(0);

  const topic = getThirdYearTopic(comicId);
  const comic = topic?.comic;
  const totalPanels = comic?.paneles.length ?? 0;
  const totalChallenges = useMemo(
    () => comic?.paneles.filter((panel) => panel.challenge).length ?? 0,
    [comic]
  );

  const [challengeState, setChallengeState] = useState(() =>
    comic?.paneles.map(() => ({ status: "pending" as "pending" | "correct" | "incorrect", selected: "" })) ?? []
  );

  useEffect(() => {
    if (comic) {
      setChallengeState(
        comic.paneles.map(() => ({ status: "pending" as "pending" | "correct" | "incorrect", selected: "" }))
      );
      setCurrentPanel(0);
    }
  }, [comicId, comic]);

  const score = useMemo(
    () => challengeState.filter((state) => state.status === "correct").length,
    [challengeState]
  );

  const floatingElements = [
    { icon: "⚛️", top: "12%", left: "14%", delay: 0 },
    { icon: "🧪", top: "18%", right: "18%", delay: 0.2 },
    { icon: "🔬", bottom: "18%", left: "16%", delay: 0.35 },
    { icon: "🌡️", bottom: "22%", right: "20%", delay: 0.5 },
  ];

  if (!comic || !topic) {
    return (
      <div className="min-h-screen py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-2xl p-12 text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">Contenido en construcción</h1>
            <p className="text-gray-300 mb-8">
              Estamos preparando este cómic interactivo. Regresa pronto para seguir aprendiendo.
            </p>
            <Link
              href="/cursos/3"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-secondary to-accent text-white px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a los temas
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const isLastPanel = currentPanel === comic.paneles.length - 1;
  const isFirstPanel = currentPanel === 0;

  const nextPanel = () => {
    if (!isLastPanel) {
      setCurrentPanel(currentPanel + 1);
    }
  };

  const prevPanel = () => {
    if (!isFirstPanel) {
      setCurrentPanel(currentPanel - 1);
    }
  };

  const panel = comic.paneles[currentPanel];

  return (
    <div className="min-h-screen py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/cursos/3"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a temas</span>
          </Link>
        </motion.div>

        {/* Comic Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12 px-2"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-gradient">{comic.titulo}</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Panel {currentPanel + 1} de {comic.paneles.length}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-gray-300">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <span className="text-white font-semibold">Puntuación</span>
              <span className="text-primary font-bold">{score}</span>
              <span className="text-gray-400">/ {totalChallenges}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2">
              <span className="text-secondary font-semibold">Ruta</span>
              <span className="text-white font-medium">
                {((currentPanel + 1) / totalPanels * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Comic Panel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[3/4] sm:aspect-[4/3] rounded-3xl overflow-hidden glass-morphism p-2 sm:p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPanel}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className={`w-full h-full bg-gradient-to-br ${panel.fondo} rounded-3xl flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative overflow-hidden`}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]"
                />
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-28 sm:-right-40 top-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-white/20 blur-3xl"
                />
                <motion.div
                  initial={{ rotate: -15, opacity: 0 }}
                  animate={{ rotate: [0, 10, 0], opacity: 0.28 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-28 -left-28 h-64 w-64 sm:h-80 sm:w-80 bg-black/25 blur-[90px]"
                />

                {floatingElements.map((element) => (
                  <motion.span
                    key={element.icon}
                    style={{
                      top: element.top,
                      bottom: element.bottom,
                      left: element.left,
                      right: element.right,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: [0, 1, 0.6, 1], y: [10, -6, 10], rotate: [-5, 5, -5] }}
                    transition={{ duration: 6, repeat: Infinity, delay: element.delay, ease: "easeInOut" }}
                    className="absolute text-2xl sm:text-3xl text-white/80 drop-shadow"
                  >
                    {element.icon}
                  </motion.span>
                ))}

                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 inline-flex items-center gap-2 rounded-full bg-black/25 backdrop-blur px-4 py-2 text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  <span>Historieta interactiva</span>
                </div>

                {/* Personaje */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0.9, 1, 0.97, 1], rotate: [0, -2, 2, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 drop-shadow-lg"
                >
                  {panel.personaje}
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative bg-white rounded-3xl p-5 sm:p-7 md:p-8 max-w-xl sm:max-w-2xl shadow-[0_20px_60px_-25px_rgba(15,23,42,0.6)]"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[18px] border-b-white" />
                  <p className="text-slate-800 text-base sm:text-lg md:text-2xl font-semibold text-center leading-relaxed">
                    {panel.texto}
                  </p>
                </motion.div>

                {/* Panel Number */}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-black/35 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold">
                  {currentPanel + 1}/{comic.paneles.length}
                </div>

                {/* Subtema chips */}
                {topic.subtemas && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
                  >
                    {topic.subtemas.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs sm:text-sm text-white backdrop-blur"
                      >
                        ✦ {item}
                      </span>
                    ))}
                  </motion.div>
                )}

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentPanel + 1) / comic.paneles.length) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="absolute bottom-0 left-0 h-1 bg-white/70"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10" />

                {/* Navigation hint */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                  className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/80"
                >
                  Desliza o usa las flechas para continuar
                </motion.span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Challenge Card */}
          {panel.challenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 sm:mt-8 glass-morphism rounded-2xl p-5 sm:p-6 border border-white/10"
            >
              <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                <div className="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-secondary">
                  <span className="inline-flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  Reto Flash
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-400">
                  Premio: +1 punto
                </div>
              </div>
              <p className="text-white font-semibold text-base sm:text-lg mb-4 text-center sm:text-left">
                {panel.challenge.pregunta}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {panel.challenge.opciones.map((opcion) => {
                  const state = challengeState[currentPanel] ?? { status: "pending", selected: "" };
                  const isSelected = state.selected === opcion;
                  const isCorrect = state.status === "correct" && panel.challenge?.respuesta === opcion;
                  const isDisabled = state.status === "correct";

                  return (
                    <button
                      key={opcion}
                      onClick={() => {
                        if (!panel.challenge || isDisabled) return;
                        setChallengeState((prev) => {
                          const next = [...prev];
                          if (!next[currentPanel]) {
                            next[currentPanel] = { status: "pending", selected: "" };
                          }
                          const correct = panel.challenge?.respuesta === opcion;
                          next[currentPanel] = {
                            status: correct ? "correct" : "incorrect",
                            selected: opcion,
                          };
                          return next;
                        });
                      }}
                      className={`relative overflow-hidden rounded-xl px-4 py-3 text-sm sm:text-base font-semibold transition-all border ${
                        isCorrect
                          ? "border-accent bg-accent/20 text-white"
                          : isSelected && challengeState[currentPanel]?.status === "incorrect"
                          ? "border-red-500 bg-red-500/20 text-red-200"
                          : "border-white/10 bg-white/5 text-white hover:border-primary/60 hover:bg-primary/10"
                      } ${isDisabled ? "cursor-default" : ""}`}
                      disabled={isDisabled}
                    >
                      {isCorrect && <span className="absolute inset-0 bg-gradient-to-r from-accent/30 to-green-500/20" />}
                      <span className="relative z-10">{opcion}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 min-h-[2.5rem] flex items-center justify-center text-sm">
                {challengeState[currentPanel]?.status === "correct" ? (
                  <span className="text-accent font-semibold flex items-center gap-2">
                    ✅ ¡Bien hecho! {panel.challenge.explicacion}
                  </span>
                ) : challengeState[currentPanel]?.status === "incorrect" ? (
                  <span className="text-red-300 font-medium">
                    ❌ Revisa la información del panel e inténtalo nuevamente.
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Selecciona la respuesta correcta para desbloquear el siguiente panel.
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 sm:mt-8">
            <button
              onClick={prevPanel}
              disabled={isFirstPanel}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                isFirstPanel
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-primary hover:bg-blue-600 text-white"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {comic.paneles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPanel(index)}
                  className={`h-2.5 sm:h-3 rounded-full transition-all ${
                    index === currentPanel
                      ? "bg-primary w-6 sm:w-8"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            {!isLastPanel ? (
              <button
                onClick={nextPanel}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  !panel.challenge || challengeState[currentPanel]?.status === "correct"
                    ? "bg-primary hover:bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                disabled={panel.challenge ? challengeState[currentPanel]?.status !== "correct" : false}
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <Link
                href={`/laboratorio/${comicId}`}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                  !panel.challenge || challengeState[currentPanel]?.status === "correct"
                    ? "bg-gradient-to-r from-accent to-green-600 hover:from-green-600 hover:to-accent text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
                aria-disabled={panel.challenge ? challengeState[currentPanel]?.status !== "correct" : false}
              >
                Ir al Laboratorio
                <Rocket className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12 sm:mt-16 glass-morphism rounded-2xl p-6 sm:p-8"
        >
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              💡 ¿Sabías que...?
            </h3>
            <p className="text-gray-300 text-base sm:text-lg">
              {topic.contexto.parrafos[0]}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-primary"
            >
              <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Sigue explorando el cómic para desbloquear datos sorpresa
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}





