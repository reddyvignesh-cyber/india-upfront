"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Shield, Map, BarChart3, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "India Upfront", icon: Shield },
  { href: "/rankings", label: "Rankings", icon: BarChart3 },
  { href: "/states", label: "States", icon: Map },
  { href: "/search", label: "Search", icon: Search },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
              <div className="absolute inset-0 bg-red-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                INDIA<span className="text-red-500">UPFRONT</span>
              </span>
              <p className="text-[10px] text-gray-500 -mt-1 tracking-widest uppercase">
                Political Transparency
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-red-500/20"
          >
            <nav className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
