"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Rocket, BookOpen } from "lucide-react";
import ParticlesBackground from "./components/ParticlesBackground";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Hero Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Aprende Ciencia
              <br />
              <span className="text-gradient">Jugando</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto px-2"
          >
            Cómics Interactivos + Juegos 3D + Aprendizaje Gamificado
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12 sm:mb-16 px-2"
          >
            <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-full">
              <BookOpen className="w-6 h-6 text-primary" />
              <span className="text-gray-200">Contenido Interactivo</span>
            </div>
            <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-full">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="text-gray-200">Experiencias 3D</span>
            </div>
            <div className="flex items-center gap-3 glass-morphism px-6 py-3 rounded-full">
              <Rocket className="w-6 h-6 text-secondary" />
              <span className="text-gray-200">Gamificación</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              href="/cursos"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-secondary to-accent text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold hover:scale-105 transition-transform duration-300 shadow-2xl hover:shadow-primary/50"
            >
              <Rocket className="w-6 h-6" />
              Explorar Demo
            </Link>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-20 px-2"
          >
            <div className="glass-morphism p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Cómics Educativos</h3>
              <p className="text-gray-300">
                Historias visuales que hacen la ciencia más comprensible y divertida
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🧪</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Laboratorio Virtual</h3>
              <p className="text-gray-300">
                Experimenta en 3D sin riesgos, con ejercicios interactivos
              </p>
            </div>

            <div className="glass-morphism p-8 rounded-2xl hover:scale-105 transition-transform duration-300">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Sistema de Logros</h3>
              <p className="text-gray-300">
                Gana puntos, completa desafíos y sigue tu progreso
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
