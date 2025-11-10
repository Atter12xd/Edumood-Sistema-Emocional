"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Star,
  X,
  BookOpenCheck,
  Droplet,
  Layers,
  Sparkles,
} from "lucide-react";
import { getThirdYearTopic } from "@/lib/topics/third-year";

export default function LaboratorioPage() {
  const params = useParams();
  const labId = params.id as string;

  const topic = getThirdYearTopic(labId);
  const exerciseList = topic?.laboratorio.ejercicios ?? [];
  const totalExercises = exerciseList.length;

  const initialState = useMemo(
    () => exerciseList.map((exercise) => ({ id: exercise.id, completed: false })),
    [exerciseList]
  );

  const [exerciseState, setExerciseState] = useState(initialState);
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [points, setPoints] = useState(0);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setExerciseState(initialState);
    setSelectedExercise(null);
    setUserAnswer("");
    setShowFeedback(false);
    setShowHint(false);
    setPoints(0);
  }, [initialState]);

  const completedCount = exerciseState.filter((exercise) => exercise.completed).length;

  if (!exerciseList.length || !topic) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-2xl p-12 text-center"
          >
            <h1 className="text-4xl font-bold text-gradient mb-4">Laboratorio en construcción</h1>
            <p className="text-gray-300 mb-8">
              Estamos preparando los ejercicios interactivos para este tema.
            </p>
            <Link
              href="/cursos/3"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary via-secondary to-accent text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a los temas
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const handleCardClick = (id: number) => {
    const state = exerciseState.find((exercise) => exercise.id === id);
    if (!state || state.completed) {
      return;
    }

    setSelectedExercise(id);
    setUserAnswer("");
    setShowFeedback(false);
    setShowHint(false);
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;

    const exercise = exerciseList.find((e) => e.id === selectedExercise);
    if (!exercise) return;

    const isAnswerCorrect = normalize(userAnswer) === normalize(exercise.respuestaCorrecta);
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setExerciseState((prev) =>
        prev.map((exerciseState) =>
          exerciseState.id === selectedExercise
            ? { ...exerciseState, completed: true }
            : exerciseState
        )
      );
      setPoints((prev) => prev + 25);

      setTimeout(() => {
        setSelectedExercise(null);
        setShowFeedback(false);
      }, 1800);
    }
  };

  const currentExercise = selectedExercise
    ? exerciseList.find((exercise) => exercise.id === selectedExercise)
    : null;

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
            href={`/comic/${labId}`}
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al cómic</span>
          </Link>
        </motion.div>

        {/* Header with Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-12 gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient">{topic.laboratorio.titulo}</span>
            </h1>
            <p className="text-gray-300 text-lg">
              {topic.laboratorio.introduccion}
            </p>
          </div>

          <div className="flex gap-6">
            <div className="glass-morphism px-6 py-4 rounded-xl text-center">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{points}</span>
              </div>
              <div className="text-sm text-gray-400">Puntos</div>
            </div>

            <div className="glass-morphism px-6 py-4 rounded-xl text-center">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold text-white">{completedCount}/{totalExercises}</span>
              </div>
              <div className="text-sm text-gray-400">Completadas</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="glass-morphism rounded-xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="text-sm uppercase tracking-wide text-secondary flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Ruta galáctica del conocimiento
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                Avance {Math.round((completedCount / Math.max(totalExercises, 1)) * 100)}%
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {exerciseList.map((exercise) => {
                const isCompleted = exerciseState.some(
                  (exerciseStatus) => exerciseStatus.id === exercise.id && exerciseStatus.completed
                );
                return (
                  <div
                    key={exercise.id}
                    className={`rounded-xl border px-3 py-2 text-center text-xs sm:text-sm font-semibold transition-colors ${
                      isCompleted ? "border-accent/50 bg-accent/10 text-accent" : "border-white/10 bg-white/5 text-white"
                    }`}
                  >
                    {exercise.id < 10 ? `0${exercise.id}` : exercise.id}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Interactive cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-4 sm:p-6"
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                Selecciona una viñeta de reto
              </h2>
              <p className="text-sm text-gray-400">
                Responde correctamente para desbloquear todas las galaxias de conocimiento.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {exerciseList.map((exercise, index) => {
              const state = exerciseState.find((exerciseState) => exerciseState.id === exercise.id);
              const isCompleted = state?.completed;
              return (
                <motion.button
                  key={exercise.id}
                  onClick={() => handleCardClick(exercise.id)}
                  className={`group relative overflow-hidden rounded-2xl border px-5 py-5 text-left transition-all ${
                    isCompleted
                      ? "border-accent/40 bg-accent/10"
                      : "border-white/10 bg-white/5 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  whileHover={{ translateY: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="absolute -right-16 top-10 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 text-xs font-semibold text-white">
                      {exercise.subtema}
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        isCompleted ? "text-accent" : "text-gray-400"
                      }`}
                    >
                      {isCompleted ? "Completado" : "Pendiente"}
                    </span>
                  </div>
                  <h3 className="relative z-10 text-base sm:text-lg font-semibold text-white leading-snug">
                    {exercise.descripcion}
                  </h3>
                  <div className="relative z-10 mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="w-4 h-4 text-secondary" /> Reto #{exercise.id}
                    </span>
                    <span className="inline-flex items-center gap-1 text-yellow-300">
                      <Star className="w-4 h-4" /> {exercise.dificultad}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Activity Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
        >
          <div className="glass-morphism rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenCheck className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-white">Ruta de aprendizaje</h3>
            </div>
            <div className="space-y-4">
              {exerciseList.map((exercise) => {
                const cardState = exerciseState.find((exerciseState) => exerciseState.id === exercise.id);
                const isCompleted = cardState?.completed;
                return (
                  <div
                    key={exercise.id}
                    className={`rounded-xl border px-4 py-3 transition-colors ${
                      isCompleted
                        ? "border-accent/40 bg-accent/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm uppercase tracking-wide text-gray-400">
                        {exercise.subtema}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          exercise.dificultad === "Avanzado"
                            ? "bg-red-500/20 text-red-300"
                            : exercise.dificultad === "Intermedio"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        {exercise.dificultad}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm mb-3">
                      {exercise.descripcion}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {isCompleted ? "Completado" : "Pendiente"}
                      </span>
                      <span className="font-semibold text-white">
                        Reto #{exercise.id}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-morphism rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-semibold text-white">Consejos de laboratorio</h3>
            </div>
            <ul className="space-y-3 text-gray-300 text-sm">
              {topic.laboratorio.consejos.map((tip, tipIndex) => (
                <li key={tip} className="flex items-start gap-2">
                  <Droplet
                    className="w-4 h-4 mt-1"
                    style={{ color: tipIndex === 0 ? "#22d3ee" : tipIndex === 1 ? "#38bdf8" : "#a855f7" }}
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Exercise Modal */}
        <AnimatePresence>
          {selectedExercise && currentExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
              onClick={() => !showFeedback && setSelectedExercise(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="glass-morphism rounded-2xl p-8 max-w-2xl w-full relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                {!showFeedback && (
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}

                {/* Exercise Number */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full text-primary font-bold">
                    Reto {selectedExercise}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm text-white/80">
                    {currentExercise.subtema}
                  </span>
                </div>

                <p className="text-gray-300 text-sm mb-4">
                  {currentExercise.descripcion}
                </p>

                {/* Question */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
                  {currentExercise.pregunta}
                </h3>

                {!showFeedback ? (
                  <>
                    {/* Answer Input */}
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder={currentExercise.placeholder ?? "Escribe tu respuesta..."}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-6 py-4 text-white text-lg mb-6 focus:outline-none focus:border-primary transition-colors"
                      autoFocus
                    />

                    {/* Hint */}
                    {currentExercise.pistas && (
                      <div className="mb-6">
                        {!showHint ? (
                          <button
                            onClick={() => setShowHint(true)}
                            className="text-secondary hover:text-purple-400 transition-colors"
                          >
                            💡 Ver pista
                          </button>
                        ) : (
                          <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 text-gray-200">
                            {currentExercise.pistas}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={!userAnswer.trim()}
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verificar Respuesta
                    </button>
                  </>
                ) : (
                  /* Feedback */
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    {isCorrect ? (
                      <>
                        <div className="text-8xl mb-6">🎉</div>
                        <h4 className="text-3xl font-bold text-accent mb-4">
                          ¡Correcto!
                        </h4>
                        <p className="text-xl text-gray-300 mb-6">
                          Has ganado +25 puntos
                        </p>
                        <div className="inline-flex items-center gap-2 bg-accent/20 px-6 py-3 rounded-full">
                          <Trophy className="w-6 h-6 text-accent" />
                          <span className="text-accent font-bold text-xl">+25 XP</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-8xl mb-6">😅</div>
                        <h4 className="text-3xl font-bold text-red-500 mb-4">
                          Casi...
                        </h4>
                        <p className="text-xl text-gray-300 mb-6">
                          La respuesta correcta es: <strong className="text-white">{currentExercise.respuestaCorrecta}</strong>
                        </p>
                        <button
                          onClick={() => {
                            setSelectedExercise(null);
                            setShowFeedback(false);
                            setUserAnswer("");
                          }}
                          className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                        >
                          Intentar de nuevo
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Message */}
        {completedCount === totalExercises && totalExercises > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass-morphism rounded-2xl p-6 sm:p-8 text-center"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-bold text-gradient mb-4">
              ¡Laboratorio Completado!
            </h3>
            <p className="text-xl text-gray-300 mb-6">
              Has completado todas las actividades del módulo "{topic.nombre}"
            </p>
            <Link
              href="/cursos/3"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-green-600 text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              Continuar Aprendiendo
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}





