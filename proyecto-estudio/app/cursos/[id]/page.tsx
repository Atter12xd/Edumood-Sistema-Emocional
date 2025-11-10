"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { thirdYearTopics } from "@/lib/topics/third-year";

export default function CursoDetallePage() {
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
            href="/cursos"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a cursos</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Tercer Año
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explora los fundamentos de la química a través de cómics interactivos y experiencias 3D
          </p>
        </motion.div>

        {/* Temas */}
        <div className="space-y-12 sm:space-y-16">
          {thirdYearTopics.map((topic, index) => {
            const IconComponent = topic.icono;
            const ContextIcon = topic.contexto.icono;
            return (
              <motion.section
                key={topic.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="absolute -right-24 -top-24 h-72 w-72 bg-gradient-to-br from-primary/30 to-secondary/20 blur-3xl" />
                <div className="glass-morphism rounded-3xl p-6 sm:p-8 lg:p-10 relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-primary font-semibold mb-3">
                        <IconComponent className="w-5 h-5" />
                        Tema
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                        {topic.nombre}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-300 max-w-2xl">
                        {topic.resumen}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 self-start lg:self-auto">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-white">
                          {topic.progreso}%
                        </div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          avance estimado
                        </div>
                      </div>
                      <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white text-xl sm:text-2xl font-bold`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 mt-8">
                    <div className="space-y-6">
                      <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-wide text-secondary mb-4">
                          <span className="inline-flex items-center justify-center rounded-full bg-secondary/20 text-secondary px-4 py-1 font-semibold">
                            {topic.contexto.etiqueta}
                          </span>
                          <ContextIcon className="w-5 h-5" />
                          <span>{topic.contexto.titulo}</span>
                        </div>
                        <div className="space-y-3 text-gray-200 leading-relaxed">
                          {topic.contexto.parrafos.map((paragraph, paragraphIndex) => (
                            <p key={paragraphIndex}>{paragraph}</p>
                          ))}
                        </div>
                      </div>

                      {topic.subtemas && topic.subtemas.length > 0 && (
                        <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-gray-400 mb-4">
                            <CheckCircle2 className="w-4 h-4 text-accent" />
                            Contenido clave
                          </div>
                          <div className="space-y-3 text-gray-200">
                            {topic.subtemas.map((subtema) => (
                              <div key={subtema} className="flex items-start gap-3">
                                <span className="text-accent">•</span>
                                <span>{subtema}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                        <Link
                          href={`/comic/${topic.id}`}
                          className={`flex-1 min-w-[220px] bg-gradient-to-r ${topic.color} text-white px-6 py-4 rounded-xl font-semibold hover:scale-[1.02] transition-transform flex items-center justify-center gap-2`}
                        >
                          <Play className="w-5 h-5" />
                          Ver Cómic Interactivo
                        </Link>
                        <Link
                          href={`/laboratorio/${topic.id}`}
                          className="flex-1 min-w-[220px] bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-5 h-5 text-secondary" />
                          Abrir Laboratorio 3D
                        </Link>
                      </div>
                    </div>

                    <div className="glass-morphism rounded-2xl p-6 border border-white/10 h-fit">
                      <h3 className="text-sm uppercase tracking-wide text-secondary mb-3">
                        Ideas para reflexionar
                      </h3>
                      <ul className="space-y-3 text-gray-300 text-sm">
                        {topic.contexto.reflexiones.map((idea) => (
                          <li key={idea} className="flex items-start gap-2">
                            <span className="text-secondary">•</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>

                      {topic.recursos && topic.recursos.length > 0 && (
                        <div className="mt-6 border-t border-white/10 pt-4">
                          <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-gray-400 mb-3">
                            <ExternalLink className="w-4 h-4 text-primary" />
                            Recursos sugeridos
                          </div>
                          <ul className="space-y-2 text-gray-200 text-sm">
                            {topic.recursos.map((recurso) => (
                              <li key={recurso} className="flex items-start gap-2">
                                <span className="text-primary">•</span>
                                <span>{recurso}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.section>
            );
          })}
        </div>

        {/* Course Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="max-w-4xl mx-auto mt-12 sm:mt-16 glass-morphism rounded-2xl p-6 sm:p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Tu Progreso en Tercer Año
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {Math.round(
                  thirdYearTopics.reduce((acc, topic) => acc + topic.progreso, 0) /
                    thirdYearTopics.length
                )}%
              </div>
              <div className="text-gray-400 text-sm">Progreso Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                {thirdYearTopics.length}
              </div>
              <div className="text-gray-400 text-sm">Cómics Leídos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {thirdYearTopics.length}
              </div>
              <div className="text-gray-400 text-sm">Laboratorios</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-1">120</div>
              <div className="text-gray-400 text-sm">Puntos Acumulados</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}





