"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Scale, Banknote, User } from "lucide-react";
import { Politician } from "@/data/politicians";
import { formatCrores, cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";

interface PoliticianCardProps {
  politician: Politician;
  index: number;
  rank?: number;
}

export default function PoliticianCard({ politician, index, rank }: PoliticianCardProps) {
  const [imgError, setImgError] = useState(false);
  const severity =
    politician.seriousCases > 10
      ? "critical"
      : politician.seriousCases > 5
      ? "high"
      : politician.seriousCases > 0
      ? "medium"
      : "low";

  const severityColors = {
    critical: "border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-900/5",
    high: "border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-900/5",
    medium: "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-yellow-900/5",
    low: "border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-900/5",
  };

  const severityBadge = {
    critical: "bg-red-500 text-white",
    high: "bg-orange-500 text-white",
    medium: "bg-yellow-500 text-black",
    low: "bg-green-500 text-white",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={cn(
        "relative rounded-2xl border backdrop-blur-sm overflow-hidden group cursor-pointer",
        severityColors[severity]
      )}
    >
      {/* Rank badge */}
      {rank && (
        <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white border border-white/20">
          #{rank}
        </div>
      )}

      {/* Severity indicator bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1",
          severity === "critical" ? "bg-red-500" :
          severity === "high" ? "bg-orange-500" :
          severity === "medium" ? "bg-yellow-500" : "bg-green-500"
        )}
      />

      <div className="p-5">
        {/* Profile Section */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
              {!imgError ? (
                <img
                  src={getAvatarUrl(politician.name, politician.partyColor)}
                  alt={politician.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
            </div>
            {/* Party color dot */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center text-[8px] font-bold text-white"
              style={{ backgroundColor: politician.partyColor }}
              title={politician.party}
            >
              {politician.partyShort.charAt(0)}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-lg truncate group-hover:text-red-400 transition-colors">
              {politician.name}
            </h3>
            <p className="text-xs text-gray-400">{politician.position}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: politician.partyColor + "20",
                  color: politician.partyColor,
                }}
              >
                {politician.partyShort}
              </span>
              <span className="text-xs text-gray-500">
                {politician.constituency}, {politician.stateCode}
              </span>
            </div>
          </div>
        </div>

        {/* Crime Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-black/30 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xl font-black text-red-400">{politician.totalCases}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Cases</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Scale className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-xl font-black text-orange-400">{politician.seriousCases}</div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Serious</div>
          </div>
          <div className="bg-black/30 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Banknote className="w-3.5 h-3.5 text-yellow-400" />
            </div>
            <div className="text-xl font-black text-yellow-400">
              {politician.scamAmount > 0 ? formatCrores(politician.scamAmount) : "—"}
            </div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">Scam</div>
          </div>
        </div>

        {/* Crime Tags */}
        <div className="flex flex-wrap gap-1.5">
          {politician.cases.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className={cn(
                "text-[10px] px-2 py-1 rounded-full border font-medium",
                c.severity === "serious"
                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                  : c.severity === "financial"
                  ? "text-orange-400 bg-orange-500/10 border-orange-500/20"
                  : "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
              )}
            >
              {c.description}
              {c.status === "convicted" && " ✓"}
              {c.status === "acquitted" && " ✗"}
            </span>
          ))}
          {politician.cases.length > 3 && (
            <span className="text-[10px] px-2 py-1 rounded-full border border-gray-700 text-gray-500">
              +{politician.cases.length - 3} more
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
