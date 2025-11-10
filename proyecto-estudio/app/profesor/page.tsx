"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Trophy, TrendingUp, Clock } from "lucide-react";

const estudiantes = [
  {
    id: 1,
    nombre: "María González",
    avatar: "👩",
    curso: "3er Año",
    temasCompletados: 4,
    totalTemas: 6,
    puntos: 450,
    ultimoAcceso: "Hace 2 horas",
    progreso: 67,
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    avatar: "👨",
    curso: "3er Año",
    temasCompletados: 6,
    totalTemas: 6,
    puntos: 580,
    ultimoAcceso: "Hace 1 hora",
    progreso: 100,
  },
  {
    id: 3,
    nombre: "Ana Martínez",
    avatar: "👧",
    curso: "3er Año",
    temasCompletados: 3,
    totalTemas: 6,
    puntos: 320,
    ultimoAcceso: "Hace 5 horas",
    progreso: 50,
  },
  {
    id: 4,
    nombre: "Carlos Rodríguez",
    avatar: "👦",
    curso: "3er Año",
    temasCompletados: 5,
    totalTemas: 6,
    puntos: 510,
    ultimoAcceso: "Hace 30 min",
    progreso: 83,
  },
  {
    id: 5,
    nombre: "Sofía López",
    avatar: "👩",
    curso: "3er Año",
    temasCompletados: 2,
    totalTemas: 6,
    puntos: 180,
    ultimoAcceso: "Hace 1 día",
    progreso: 33,
  },
];

const estadisticas = [
  { titulo: "Estudiantes Activos", valor: "24", icono: Users, color: "primary" },
  { titulo: "Temas Completados", valor: "156", icono: BookOpen, color: "accent" },
  { titulo: "Puntos Totales", valor: "12,450", icono: Trophy, color: "secondary" },
  { titulo: "Promedio de Curso", valor: "78%", icono: TrendingUp, color: "yellow-500" },
];

export default function ProfesorPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Dashboard <span className="text-gradient">Profesor</span>
          </h1>
          <p className="text-xl text-gray-300">
            Monitorea el progreso de tus estudiantes en tiempo real
          </p>
        </motion.div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {estadisticas.map((stat, index) => {
            const IconComponent = stat.icono;
            const colorMap: Record<string, { bg: string; text: string }> = {
              primary: { bg: "rgba(59, 130, 246, 0.2)", text: "#3B82F6" },
              secondary: { bg: "rgba(139, 92, 246, 0.2)", text: "#8B5CF6" },
              accent: { bg: "rgba(16, 185, 129, 0.2)", text: "#10B981" },
              "yellow-500": { bg: "rgba(245, 158, 11, 0.2)", text: "#F59E0B" },
            };
            const colors = colorMap[stat.color];
            
            return (
              <motion.div
                key={stat.titulo}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-morphism rounded-2xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: colors.bg }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: colors.text }} />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.valor}</div>
                <div className="text-gray-400">{stat.titulo}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Gráfico Simple de Barras */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-morphism rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Progreso por Tema</h2>
          
          <div className="space-y-6">
            {[
              { nombre: "Tabla Periódica", completado: 85, color: "primary" },
              { nombre: "Estructura Atómica", completado: 72, color: "secondary" },
              { nombre: "Enlaces Químicos", completado: 60, color: "accent" },
              { nombre: "Reacciones Químicas", completado: 78, color: "yellow-500" },
              { nombre: "Estados de la Materia", completado: 65, color: "pink-500" },
              { nombre: "Ácidos y Bases", completado: 45, color: "orange-500" },
            ].map((tema, index) => (
              <div key={tema.nombre}>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{tema.nombre}</span>
                  <span>{tema.completado}% completado</span>
                </div>
                <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tema.completado}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    className="h-full"
                    style={{
                      background: tema.color === "primary" ? "#3B82F6" :
                                 tema.color === "secondary" ? "#8B5CF6" :
                                 tema.color === "accent" ? "#10B981" :
                                 tema.color === "yellow-500" ? "#F59E0B" :
                                 tema.color === "pink-500" ? "#EC4899" :
                                 "#F97316"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabla de Estudiantes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-morphism rounded-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Estudiantes de 3er Año</h2>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="text-left p-6">Estudiante</th>
                  <th className="text-left p-6">Curso</th>
                  <th className="text-left p-6">Temas</th>
                  <th className="text-left p-6">Puntos</th>
                  <th className="text-left p-6">Progreso</th>
                  <th className="text-left p-6">Último Acceso</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((estudiante, index) => (
                  <motion.tr
                    key={estudiante.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-2xl">
                          {estudiante.avatar}
                        </div>
                        <span className="text-white font-semibold">{estudiante.nombre}</span>
                      </div>
                    </td>
                    <td className="p-6 text-gray-300">{estudiante.curso}</td>
                    <td className="p-6 text-gray-300">
                      {estudiante.temasCompletados}/{estudiante.totalTemas}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-white font-semibold">{estudiante.puntos}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-green-500"
                            style={{ width: `${estudiante.progreso}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold text-sm">{estudiante.progreso}%</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        {estudiante.ultimoAcceso}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-6 space-y-4">
            {estudiantes.map((estudiante, index) => (
              <motion.div
                key={estudiante.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                className="bg-white/5 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-3xl">
                    {estudiante.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{estudiante.nombre}</div>
                    <div className="text-gray-400 text-sm">{estudiante.curso}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Temas</div>
                    <div className="text-white font-semibold">
                      {estudiante.temasCompletados}/{estudiante.totalTemas}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Puntos</div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-white font-semibold">{estudiante.puntos}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progreso</span>
                    <span>{estudiante.progreso}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-green-500"
                      style={{ width: `${estudiante.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm pt-2">
                  <Clock className="w-4 h-4" />
                  {estudiante.ultimoAcceso}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Mejor Rendimiento</h3>
            <p className="text-gray-300 mb-2">
              <strong className="text-white">Juan Pérez</strong> ha completado el 100% de los temas
            </p>
            <div className="text-sm text-gray-400">580 puntos acumulados</div>
          </div>

          <div className="glass-morphism rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Estadística Destacada</h3>
            <p className="text-gray-300 mb-2">
              El tema <strong className="text-white">Tabla Periódica</strong> tiene el mayor engagement
            </p>
            <div className="text-sm text-gray-400">85% de finalización promedio</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

