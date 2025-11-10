"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, ChevronRight } from "lucide-react";

const cursos = [
  { año: 3, nombre: "Tercer Año", color: "from-green-500 to-emerald-500", progreso: 15 },
];

export default function CursosPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Elige tu <span className="text-gradient">Curso</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Actualmente estamos explorando el contenido de Tercer Año - Química
          </p>
        </motion.div>

        {/* Cursos Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {cursos.map((curso, index) => (
            <motion.div
              key={curso.año}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/cursos/${curso.año}`}>
                <div className="glass-morphism rounded-2xl p-8 hover:scale-105 hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                  {/* Icon */}
                  <div className={`bg-gradient-to-r ${curso.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>

                  {/* Nombre */}
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {curso.nombre}
                  </h3>
                  <p className="text-gray-400 mb-6">Secundaria</p>

                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progreso</span>
                      <span>{curso.progreso}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${curso.progreso}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${curso.color}`}
                      />
                    </div>
                  </div>

                  {/* Link */}
                  <div className="flex items-center gap-2 text-gray-300 group-hover:text-white transition-colors">
                    <span>Ver temas</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto mt-20"
        >
          <div className="glass-morphism rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">Enfoque Actual</h3>
            <p className="text-gray-300 mb-4">
              Estamos desarrollando el módulo de Química para Tercer Año, comenzando por el tema "La Materia".
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">1</div>
                <div className="text-gray-400 text-sm">Módulo disponible</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">1</div>
                <div className="text-gray-400 text-sm">Laboratorio 3D</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary">1</div>
                <div className="text-gray-400 text-sm">Cómic interactivo</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}





