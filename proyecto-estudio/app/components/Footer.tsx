"use client";

import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 SciencePlay. Demo educativo - Contenido de muestra.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>para la educación</span>
          </div>
        </div>
      </div>
    </footer>
  );
}








