"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Skull,
  Banknote,
  Users,
  Scale,
  TrendingUp,
  Eye,
  Flame,
  ShieldAlert,
  Siren,
  RefreshCw,
} from "lucide-react";
import { TabId, CategoryData } from "@/types/categories";
import { politicians, nationalStats } from "@/data/politicians";
import StatCard from "@/components/shared/StatCard";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import PoliticianCard from "@/components/politician/PoliticianCard";
import IndiaMap from "@/components/map/IndiaMap";
import CrimeChart from "@/components/charts/CrimeChart";
import ShareButton from "@/components/shared/ShareButton";
import ShowMore from "@/components/shared/ShowMore";
import IncidentList from "@/components/incidents/IncidentList";
import { formatCrores } from "@/lib/utils";

interface TabContentProps {
  activeTab: TabId;
  categoryData: Record<string, CategoryData>;
}

function PoliticiansContent() {
  const [shown, setShown] = useState(8);
  const topCriminals = [...politicians]
    .sort((a, b) => b.totalCases - a.totalCases)
    .filter((p) => p.totalCases > 0);

  const topScammers = [...politicians]
    .filter((p) => p.scamAmount > 0)
    .sort((a, b) => b.scamAmount - a.scamAmount)
    .slice(0, 6);

  const visible = topCriminals.slice(0, shown);

  return (
    <>
      {/* Key Stats */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              The <span className="text-red-500">Numbers</span> Don&apos;t Lie
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Based on self-declared affidavits filed with the Election Commission of India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard icon={Users} label="Politicians with Criminal Cases" value={nationalStats.withCriminalCases} color="red" delay={0} subtitle={`Out of ${nationalStats.totalPoliticians.toLocaleString()} total`} />
            <StatCard icon={Skull} label="Murder Cases" value={nationalStats.murderCases} color="red" delay={0.1} subtitle="IPC Section 302" />
            <StatCard icon={Siren} label="Rape & Sexual Offences" value={nationalStats.rapeCases} color="orange" delay={0.2} subtitle="IPC Section 376" />
            <StatCard icon={Banknote} label="Total Scam Amount" value={2.2} suffix="L Cr" prefix="₹" color="yellow" delay={0.3} subtitle="Combined fraud & corruption" />
            <StatCard icon={AlertTriangle} label="Serious Crime Cases" value={nationalStats.seriousCrimeCases} color="orange" delay={0.4} subtitle="Murder, Rape, Kidnapping, Robbery" />
            <StatCard icon={Scale} label="Attempt to Murder" value={nationalStats.attemptMurderCases} color="red" delay={0.5} subtitle="IPC Section 307" />
            <StatCard icon={Flame} label="Rioting Cases" value={nationalStats.riotingCases} color="yellow" delay={0.6} subtitle="IPC Section 147/148" />
            <StatCard icon={Eye} label="Kidnapping Cases" value={nationalStats.kidnappingCases} color="purple" delay={0.7} subtitle="IPC Section 364/365" />
          </div>
        </div>
      </section>

      {/* India Map */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <IndiaMap />
        </div>
      </section>

      {/* Most Criminal Politicians */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
                Most <span className="text-red-500">Criminal</span> Politicians
              </h2>
              <p className="text-gray-500">
                Ranked by total number of declared criminal cases
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 bg-red-500/5">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">
                {topCriminals.length} politicians with cases
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {visible.map((pol, i) => (
              <PoliticianCard key={pol.id} politician={pol} index={i} rank={i + 1} />
            ))}
          </div>
          <ShowMore
            shown={visible.length}
            total={topCriminals.length}
            onShowMore={() => setShown((prev) => prev + 8)}
            color="red"
          />
        </div>
      </section>

      {/* Biggest Scams */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent via-orange-950/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              Biggest <span className="text-orange-500">Scams</span> & Financial Crimes
            </h2>
            <p className="text-gray-500">
              Politicians charged with the highest financial fraud amounts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {topScammers.map((pol, i) => (
              <motion.div
                key={pol.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-orange-900/5 p-6 group"
              >
                <div className="absolute top-4 right-4 text-4xl font-black text-orange-500/20">
                  #{i + 1}
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Banknote className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold group-hover:text-orange-400 transition-colors">
                      {pol.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {pol.partyShort} | {pol.state}
                    </p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-xl p-4 mb-3">
                  <div className="text-sm text-gray-500 mb-1">Scam Amount Charged</div>
                  <div className="text-3xl font-black text-orange-400">
                    {pol.scamAmount >= 100000
                      ? `₹${(pol.scamAmount / 100000).toFixed(1)}L Cr`
                      : pol.scamAmount >= 1000
                      ? `₹${(pol.scamAmount / 1000).toFixed(0)}K Cr`
                      : `₹${pol.scamAmount} Cr`}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {pol.cases
                    .filter((c) => c.severity === "financial")
                    .slice(0, 2)
                    .map((c, j) => (
                      <span
                        key={j}
                        className="text-[10px] px-2 py-1 rounded-full border border-orange-500/20 text-orange-400 bg-orange-500/10"
                      >
                        {c.description}
                        {c.status === "convicted" && " (Convicted)"}
                        {c.status === "acquitted" && " (Acquitted)"}
                      </span>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Data <span className="text-yellow-500">Deep Dive</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Charts and comparisons across crime types, case status, and political parties
            </p>
          </motion.div>
          <CrimeChart />
        </div>
      </section>
    </>
  );
}

const colorToTailwind: Record<string, string> = {
  red: "text-red-500",
  orange: "text-orange-500",
  purple: "text-purple-500",
  blue: "text-blue-500",
  yellow: "text-yellow-500",
  green: "text-green-500",
};

const statColorMap: Record<string, string> = {
  red: "red",
  orange: "orange",
  purple: "purple",
  blue: "blue",
  yellow: "yellow",
};

function LastUpdatedBadge({ timestamp }: { timestamp?: string }) {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeAgo: string;
  if (diffHours < 1) timeAgo = "just now";
  else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
  else if (diffDays === 1) timeAgo = "yesterday";
  else timeAgo = `${diffDays} days ago`;

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
        <RefreshCw className="w-3 h-3 text-green-400" />
        <span className="text-xs text-green-400 font-medium">
          Auto-updated {timeAgo}
        </span>
      </div>
    </div>
  );
}

function CategoryContent({ data }: { data: CategoryData }) {
  const color = data.tab.color;
  const stats = data.nationalStats;
  const statEntries = Object.entries(stats).slice(0, 4);

  return (
    <>
      {/* Last Updated Badge */}
      <LastUpdatedBadge timestamp={data.lastUpdated} />

      {/* Stats Summary */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              {data.tab.label} <span className={colorToTailwind[color] || "text-red-500"}>Overview</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">{data.tab.description}</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {statEntries.map(([key, value], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-${color}-500/10 border border-${color}-500/20 rounded-xl p-4 text-center`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${color === "red" ? "#ef4444" : color === "orange" ? "#f97316" : color === "purple" ? "#a855f7" : color === "blue" ? "#3b82f6" : "#eab308"} 10%, transparent)`,
                  borderColor: `color-mix(in srgb, ${color === "red" ? "#ef4444" : color === "orange" ? "#f97316" : color === "purple" ? "#a855f7" : color === "blue" ? "#3b82f6" : "#eab308"} 20%, transparent)`,
                }}
              >
                <div className={`text-2xl font-black ${colorToTailwind[color] || "text-red-400"}`}>
                  {typeof value === "number" ? value.toLocaleString("en-IN") : value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map with category-specific coloring */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <IndiaMap stateMetrics={data.stateMetrics} metricLabel={data.tab.label} metricColor={color} />
        </div>
      </section>

      {/* Incidents */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">
              Recent <span className={colorToTailwind[color] || "text-red-500"}>Incidents</span>
            </h2>
            <p className="text-gray-500">
              {data.incidents.length} documented cases across India
            </p>
          </motion.div>
          <IncidentList incidents={data.incidents} color={color} />
        </div>
      </section>
    </>
  );
}

export default function TabContent({ activeTab, categoryData }: TabContentProps) {
  if (activeTab === "politicians") {
    return <PoliticiansContent />;
  }

  const data = categoryData[activeTab];
  if (!data) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Data coming soon for this category.</p>
      </div>
    );
  }

  return <CategoryContent data={data} />;
}
