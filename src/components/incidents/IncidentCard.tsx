"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { Incident } from "@/types/categories";
import { cn } from "@/lib/utils";

interface IncidentCardProps {
  incident: Incident;
  index: number;
  color?: string;
}

const severityConfig = {
  critical: { badge: "bg-red-500 text-white", border: "border-red-500/40", glow: "from-red-500/10" },
  high: { badge: "bg-orange-500 text-white", border: "border-orange-500/40", glow: "from-orange-500/10" },
  medium: { badge: "bg-yellow-500 text-black", border: "border-yellow-500/40", glow: "from-yellow-500/10" },
  low: { badge: "bg-green-500 text-white", border: "border-green-500/40", glow: "from-green-500/10" },
};

export default function IncidentCard({ incident, index, color = "red" }: IncidentCardProps) {
  const config = severityConfig[incident.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-2xl border backdrop-blur-sm overflow-hidden group",
        config.border,
        `bg-gradient-to-br ${config.glow} to-transparent`
      )}
    >
      {/* Severity bar */}
      <div className={cn("h-1", config.badge.split(" ")[0])} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase", config.badge)}>
                {incident.severity}
              </span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug group-hover:text-red-400 transition-colors">
              {incident.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-3">
          {incident.description}
        </p>

        {/* Location & Date */}
        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{incident.location}, {incident.stateCode}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{incident.date}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {incident.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Source */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
          <ExternalLink className="w-3 h-3" />
          <span>Source: {incident.source}</span>
        </div>
      </div>
    </motion.div>
  );
}
