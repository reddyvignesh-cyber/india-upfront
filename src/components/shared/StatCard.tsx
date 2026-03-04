"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color: "red" | "orange" | "yellow" | "blue" | "purple";
  delay?: number;
  subtitle?: string;
}

const colorMap = {
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: "text-red-500",
    glow: "shadow-red-500/20",
    text: "text-red-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    icon: "text-orange-500",
    glow: "shadow-orange-500/20",
    text: "text-orange-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    icon: "text-yellow-500",
    glow: "shadow-yellow-500/20",
    text: "text-yellow-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-500",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    icon: "text-purple-500",
    glow: "shadow-purple-500/20",
    text: "text-purple-400",
  },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  prefix = "",
  color,
  delay = 0,
  subtitle,
}: StatCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`relative group rounded-2xl border ${c.border} ${c.bg} p-6 backdrop-blur-sm overflow-hidden cursor-default`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.bg} blur-xl`} />

      <div className="relative z-10">
        <div className={`inline-flex p-3 rounded-xl ${c.bg} mb-4`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>

        <div className="mb-1">
          <AnimatedCounter
            end={value}
            prefix={prefix}
            suffix={suffix}
            className={`text-3xl sm:text-4xl font-black ${c.text}`}
          />
        </div>

        <p className="text-sm text-gray-400 font-medium">{label}</p>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
