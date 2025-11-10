"use client";

import Link from "next/link";
import { Atom, BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Atom className="w-8 h-8 text-primary group-hover:rotate-180 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all" />
            </div>
            <span className="text-2xl font-bold text-gradient">
              SciencePlay
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/cursos"
              className="flex items-center gap-2 text-gray-300 hover:text-primary transition-colors duration-300"
            >
              <BookOpen className="w-5 h-5" />
              <span>Cursos</span>
            </Link>
            <Link
              href="/profesor"
              className="flex items-center gap-2 text-gray-300 hover:text-secondary transition-colors duration-300"
            >
              <User className="w-5 h-5" />
              <span>Profesor</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-300">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}








