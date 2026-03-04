"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  Scale,
  ArrowUpDown,
  Filter,
  Skull,
  Siren,
  ChevronDown,
} from "lucide-react";
import PoliticianCard from "@/components/politician/PoliticianCard";
import ShowMore from "@/components/shared/ShowMore";
import { politicians } from "@/data/politicians";
import { formatCrores } from "@/lib/utils";

type SortKey = "totalCases" | "seriousCases" | "scamAmount" | "financialCases";
type FilterType = "all" | "serious" | "financial" | "convicted";

const sortOptions: { key: SortKey; label: string; icon: typeof AlertTriangle }[] = [
  { key: "totalCases", label: "Most Cases", icon: AlertTriangle },
  { key: "seriousCases", label: "Serious Crimes", icon: Skull },
  { key: "scamAmount", label: "Biggest Scams", icon: Banknote },
  { key: "financialCases", label: "Financial Crimes", icon: Scale },
];

const filterOptions: { key: FilterType; label: string }[] = [
  { key: "all", label: "All Politicians" },
  { key: "serious", label: "Serious Crimes (Murder, Rape, Kidnapping)" },
  { key: "financial", label: "Financial Crimes (Fraud, Corruption)" },
  { key: "convicted", label: "Convicted Only" },
];

export default function RankingsPage() {
  const [sortBy, setSortBy] = useState<SortKey>("totalCases");
  const [filterBy, setFilterBy] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [shown, setShown] = useState(12);

  const filtered = politicians.filter((p) => {
    if (filterBy === "all") return p.totalCases > 0;
    if (filterBy === "serious") return p.seriousCases > 0;
    if (filterBy === "financial") return p.financialCases > 0;
    if (filterBy === "convicted")
      return p.cases.some((c) => c.status === "convicted");
    return true;
  });

  const sorted = [...filtered].sort((a, b) => b[sortBy] - a[sortBy]);

  // Summary stats for the filtered set
  const totalCases = sorted.reduce((sum, p) => sum + p.totalCases, 0);
  const totalSerious = sorted.reduce((sum, p) => sum + p.seriousCases, 0);
  const totalScam = sorted.reduce((sum, p) => sum + p.scamAmount, 0);
  const convicted = sorted.filter((p) =>
    p.cases.some((c) => c.status === "convicted")
  ).length;

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
            Criminal <span className="text-red-500">Rankings</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Complete leaderboard of politicians with declared criminal cases,
            ranked by severity. Data from election affidavits filed with the
            Election Commission of India.
          </p>
        </motion.div>

        {/* Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-red-400">{sorted.length}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Politicians
            </div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-orange-400">{totalCases}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Total Cases
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-400">
              {formatCrores(totalScam)}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Scam Amount
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-black text-purple-400">{convicted}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Convicted
            </div>
          </div>
        </motion.div>

        {/* Sort & Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* Sort Buttons */}
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mr-2">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </div>
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  sortBy === opt.key
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                <opt.icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700 transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </motion.div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterBy(opt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterBy === opt.key
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Rankings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sorted.slice(0, shown).map((pol, i) => (
            <PoliticianCard
              key={pol.id}
              politician={pol}
              index={i}
              rank={i + 1}
            />
          ))}
        </div>
        <ShowMore
          shown={Math.min(shown, sorted.length)}
          total={sorted.length}
          onShowMore={() => setShown((prev) => prev + 12)}
          color="red"
        />

        {sorted.length === 0 && (
          <div className="text-center py-20">
            <Siren className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">
              No politicians match the current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
