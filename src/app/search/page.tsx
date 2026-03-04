"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Construction,
  Heart,
  Wind,
  Scale,
  IndianRupee,
  X,
  SlidersHorizontal,
} from "lucide-react";
import PoliticianCard from "@/components/politician/PoliticianCard";
import IncidentCard from "@/components/incidents/IncidentCard";
import ShowMore from "@/components/shared/ShowMore";
import { politicians } from "@/data/politicians";
import { getAllCategoryData } from "@/data/registry";
import { Incident } from "@/types/categories";
import { cn } from "@/lib/utils";

type SearchCategory = "all" | "politicians" | "infrastructure" | "health" | "environment" | "justice" | "corruption";

const categories: { id: SearchCategory; label: string; icon: typeof Users; color: string }[] = [
  { id: "all", label: "All", icon: SlidersHorizontal, color: "gray" },
  { id: "politicians", label: "Politicians", icon: Users, color: "red" },
  { id: "infrastructure", label: "Infrastructure", icon: Construction, color: "orange" },
  { id: "health", label: "Health", icon: Heart, color: "red" },
  { id: "environment", label: "Environment", icon: Wind, color: "purple" },
  { id: "justice", label: "Justice", icon: Scale, color: "blue" },
  { id: "corruption", label: "Corruption", icon: IndianRupee, color: "yellow" },
];

const categoryColors: Record<string, string> = {
  all: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  politicians: "bg-red-500/20 text-red-400 border-red-500/30",
  infrastructure: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  health: "bg-red-500/20 text-red-400 border-red-500/30",
  environment: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  justice: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  corruption: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const inactiveStyle = "bg-gray-900 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const [shownPoliticians, setShownPoliticians] = useState(8);
  const [shownIncidents, setShownIncidents] = useState(8);

  const allCategoryData = getAllCategoryData();

  // Gather all incidents with their category tag
  const allIncidents = useMemo(() => {
    const incidents: (Incident & { category: string })[] = [];
    for (const [key, data] of Object.entries(allCategoryData)) {
      for (const inc of data.incidents) {
        incidents.push({ ...inc, category: key });
      }
    }
    return incidents;
  }, [allCategoryData]);

  const q = query.toLowerCase().trim();

  // Filter politicians
  const filteredPoliticians = useMemo(() => {
    if (category !== "all" && category !== "politicians") return [];
    if (!q) return category === "politicians" ? politicians.filter((p) => p.totalCases > 0) : [];
    return politicians.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.party.toLowerCase().includes(q) ||
        p.partyShort.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.constituency.toLowerCase().includes(q) ||
        p.stateCode.toLowerCase().includes(q) ||
        p.cases.some((c) => c.description.toLowerCase().includes(q))
      );
    });
  }, [q, category]);

  // Filter incidents
  const filteredIncidents = useMemo(() => {
    if (category === "politicians") return [];

    let pool = allIncidents;
    if (category !== "all") {
      pool = allIncidents.filter((inc) => inc.category === category);
    }

    if (!q) return category !== "all" ? pool : [];

    return pool.filter((inc) => {
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.description.toLowerCase().includes(q) ||
        inc.state.toLowerCase().includes(q) ||
        inc.stateCode.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [q, category, allIncidents]);

  const totalResults = filteredPoliticians.length + filteredIncidents.length;
  const hasQuery = q.length > 0 || category !== "all";

  // Reset pagination when search changes
  const visiblePoliticians = filteredPoliticians.slice(0, shownPoliticians);
  const visibleIncidents = filteredIncidents.slice(0, shownIncidents);

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
            Search <span className="text-red-500">Everything</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Search across politicians, infrastructure failures, health crises, environmental disasters, justice delays, and corruption cases.
          </p>
        </motion.div>

        {/* Search Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShownPoliticians(8);
              setShownIncidents(8);
            }}
            placeholder="Search politicians, states, crimes, incidents..."
            className="w-full pl-12 pr-12 py-4 bg-gray-900/80 border border-gray-800 rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((cat) => {
            const isActive = category === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setShownPoliticians(8);
                  setShownIncidents(8);
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  isActive ? categoryColors[cat.id] : inactiveStyle
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* Results Count */}
        {hasQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <p className="text-sm text-gray-500">
              {totalResults === 0 ? (
                "No results found"
              ) : (
                <>
                  Found <span className="text-white font-bold">{totalResults}</span> result{totalResults !== 1 ? "s" : ""}
                  {q && <> for &quot;<span className="text-red-400">{query}</span>&quot;</>}
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!hasQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              Start searching
            </h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Type a name, state, crime type, or keyword to search across all categories. Or select a category filter to browse.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["Murder", "Bihar", "Pothole", "Oxygen", "Delhi AQI", "Corruption", "Kidnapping", "Bridge Collapse"].map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {hasQuery && totalResults === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Search className="w-16 h-16 text-gray-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              No results found
            </h3>
            <p className="text-sm text-gray-600">
              Try a different search term or change the category filter.
            </p>
          </motion.div>
        )}

        {/* Politicians Results */}
        {visiblePoliticians.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-bold text-white">
                Politicians
              </h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
                {filteredPoliticians.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {visiblePoliticians.map((pol, i) => (
                <PoliticianCard key={pol.id} politician={pol} index={i} rank={i + 1} />
              ))}
            </div>
            <ShowMore
              shown={visiblePoliticians.length}
              total={filteredPoliticians.length}
              onShowMore={() => setShownPoliticians((prev) => prev + 8)}
              color="red"
            />
          </section>
        )}

        {/* Incidents Results */}
        {visibleIncidents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Construction className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-bold text-white">
                Incidents & Issues
              </h2>
              <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
                {filteredIncidents.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {visibleIncidents.map((inc, i) => (
                <IncidentCard key={inc.id} incident={inc} index={i} />
              ))}
            </div>
            <ShowMore
              shown={visibleIncidents.length}
              total={filteredIncidents.length}
              onShowMore={() => setShownIncidents((prev) => prev + 8)}
              color="orange"
            />
          </section>
        )}
      </div>
    </div>
  );
}
