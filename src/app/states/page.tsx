"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  AlertTriangle,
  Users,
  Banknote,
  ArrowUpDown,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { stateData, politicians } from "@/data/politicians";
import { formatCrores, cn } from "@/lib/utils";

type SortKey = "percentCriminal" | "withCriminalCases" | "seriousCrimeCandidates" | "totalScamAmount" | "totalPoliticians";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "percentCriminal", label: "% Criminal" },
  { key: "withCriminalCases", label: "Most Cases" },
  { key: "seriousCrimeCandidates", label: "Serious Crimes" },
  { key: "totalScamAmount", label: "Scam Amount" },
  { key: "totalPoliticians", label: "Total Reps" },
];

function getSeverityLevel(percent: number) {
  if (percent > 50) return { label: "Critical", color: "text-red-500", bg: "bg-red-500", border: "border-red-500/30" };
  if (percent > 40) return { label: "High", color: "text-orange-500", bg: "bg-orange-500", border: "border-orange-500/30" };
  if (percent > 30) return { label: "Medium", color: "text-yellow-500", bg: "bg-yellow-500", border: "border-yellow-500/30" };
  if (percent > 20) return { label: "Low", color: "text-green-400", bg: "bg-green-500", border: "border-green-500/30" };
  return { label: "Minimal", color: "text-green-500", bg: "bg-green-600", border: "border-green-600/30" };
}

export default function StatesPage() {
  const [sortBy, setSortBy] = useState<SortKey>("percentCriminal");
  const [expandedState, setExpandedState] = useState<string | null>(null);

  const sorted = [...stateData].sort((a, b) => b[sortBy] - a[sortBy]);

  // National totals
  const totalWithCases = stateData.reduce((s, d) => s + d.withCriminalCases, 0);
  const totalSerious = stateData.reduce((s, d) => s + d.seriousCrimeCandidates, 0);
  const totalScam = stateData.reduce((s, d) => s + d.totalScamAmount, 0);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            States <span className="text-red-500">Overview</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Criminal politicians by state. Click any state to see the top
            offenders and crime breakdown from that region.
          </p>
        </motion.div>

        {/* National Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-blue-400">
              {stateData.length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              States & UTs
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-red-400">
              {totalWithCases.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              With Cases
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-orange-400">
              {totalSerious.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Serious Crimes
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-400">
              {formatCrores(totalScam)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Total Scam
            </div>
          </div>
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </div>
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSortBy(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === opt.key
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* States Grid */}
        <div className="space-y-3">
          {sorted.map((state, i) => {
            const severity = getSeverityLevel(state.percentCriminal);
            const isExpanded = expandedState === state.code;
            const statePoliticians = politicians.filter(
              (p) => p.stateCode === state.code
            );

            return (
              <motion.div
                key={state.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.5) }}
              >
                {/* State Row */}
                <div
                  onClick={() =>
                    setExpandedState(isExpanded ? null : state.code)
                  }
                  className={cn(
                    "rounded-xl border backdrop-blur-sm p-4 sm:p-5 cursor-pointer transition-all hover:bg-white/[0.02]",
                    isExpanded
                      ? "bg-gray-900/80 border-red-500/30"
                      : "bg-gray-900/40 border-gray-800/50 hover:border-gray-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="hidden sm:flex w-8 h-8 rounded-lg bg-white/5 items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                      {i + 1}
                    </div>

                    {/* State Name & Severity */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className={`w-4 h-4 flex-shrink-0 ${severity.color}`} />
                        <h3 className="text-white font-bold text-base sm:text-lg truncate">
                          {state.name}
                        </h3>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${severity.color} bg-current/10 border ${severity.border}`}
                          style={{
                            backgroundColor:
                              severity.bg.replace("bg-", "") + "15",
                          }}
                        >
                          {severity.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {state.topCrimes.map((crime) => (
                          <span
                            key={crime}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500"
                          >
                            {crime}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:grid grid-cols-4 gap-6 text-center flex-shrink-0">
                      <div>
                        <div className={`text-lg font-black ${severity.color}`}>
                          {state.percentCriminal}%
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Criminal
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-red-400">
                          {state.withCriminalCases}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          With Cases
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-orange-400">
                          {state.seriousCrimeCandidates}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Serious
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-black text-yellow-400">
                          {formatCrores(state.totalScamAmount)}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Scam
                        </div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="flex md:hidden items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <div className={`text-xl font-black ${severity.color}`}>
                          {state.percentCriminal}%
                        </div>
                        <div className="text-[10px] text-gray-600">
                          Criminal
                        </div>
                      </div>
                    </div>

                    {/* Expand Arrow */}
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-gray-600 transition-transform flex-shrink-0",
                        isExpanded && "rotate-90 text-red-400"
                      )}
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${state.percentCriminal}%` }}
                      transition={{ duration: 0.8, delay: Math.min(i * 0.03, 0.5) }}
                      className="h-full rounded-full"
                      style={{
                        backgroundColor:
                          state.percentCriminal > 50
                            ? "#dc2626"
                            : state.percentCriminal > 40
                            ? "#ea580c"
                            : state.percentCriminal > 30
                            ? "#f59e0b"
                            : "#22c55e",
                      }}
                    />
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 rounded-xl border border-gray-800/50 bg-black/40 p-4 sm:p-6"
                  >
                    {/* Mobile stats (shown when expanded) */}
                    <div className="grid grid-cols-4 gap-3 mb-5 md:hidden">
                      <div className="text-center">
                        <div className="text-lg font-black text-red-400">
                          {state.withCriminalCases}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Cases
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-orange-400">
                          {state.seriousCrimeCandidates}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Serious
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-yellow-400">
                          {formatCrores(state.totalScamAmount)}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Scam
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-gray-300">
                          {state.totalPoliticians}
                        </div>
                        <div className="text-[10px] text-gray-600 uppercase">
                          Total
                        </div>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-3">
                      Notable Politicians from {state.name}
                    </h4>

                    {statePoliticians.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {statePoliticians
                          .sort((a, b) => b.totalCases - a.totalCases)
                          .map((pol, j) => (
                            <div
                              key={pol.id}
                              className="flex items-center gap-3 bg-gray-900/50 rounded-lg border border-gray-800 p-3"
                            >
                              <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                                {j + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-white font-bold truncate">
                                  {pol.name}
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  {pol.partyShort} | {pol.constituency}
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-sm font-black text-red-400">
                                  {pol.totalCases}
                                </div>
                                <div className="text-[10px] text-gray-600">
                                  cases
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Detailed politician data coming soon for this state.
                      </p>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
