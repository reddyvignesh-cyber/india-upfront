"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { nationalStats } from "@/data/politicians";

const crimeTypeData = [
  { name: "Fraud", cases: nationalStats.fraudCases, color: "#f59e0b" },
  { name: "Rioting", cases: nationalStats.riotingCases, color: "#ef4444" },
  { name: "Attempt Murder", cases: nationalStats.attemptMurderCases, color: "#dc2626" },
  { name: "Murder", cases: nationalStats.murderCases, color: "#991b1b" },
  { name: "Kidnapping", cases: nationalStats.kidnappingCases, color: "#ea580c" },
  { name: "Rape", cases: nationalStats.rapeCases, color: "#be123c" },
];

const statusData = [
  { name: "Under Trial", value: 65, color: "#f59e0b" },
  { name: "Convicted", value: 8, color: "#dc2626" },
  { name: "Acquitted", value: 15, color: "#22c55e" },
  { name: "Chargesheeted", value: 12, color: "#ea580c" },
];

const partyData = [
  { name: "BJP", criminals: 145, total: 303, color: "#FF9933" },
  { name: "INC", criminals: 98, total: 230, color: "#00BFFF" },
  { name: "SP", criminals: 43, total: 65, color: "#FF0000" },
  { name: "BSP", criminals: 22, total: 45, color: "#0000FF" },
  { name: "TMC", criminals: 38, total: 54, color: "#00CC00" },
  { name: "DMK", criminals: 18, total: 40, color: "#FF0000" },
  { name: "RJD", criminals: 25, total: 32, color: "#008000" },
  { name: "Others", criminals: 180, total: 350, color: "#888888" },
];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-red-400 text-sm">{payload[0].value} cases</p>
      </div>
    );
  }
  return null;
};

export default function CrimeChart() {
  return (
    <div className="space-y-8">
      {/* Crime Types Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-b from-gray-900/50 to-black/50 rounded-3xl border border-gray-800/50 p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          Crime <span className="text-red-500">Categories</span>
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Types of criminal cases against elected representatives
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={crimeTypeData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cases" radius={[6, 6, 0, 0]}>
                {crimeTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Case Status Pie */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-gray-900/50 to-black/50 rounded-3xl border border-gray-800/50 p-6 sm:p-8"
        >
          <h3 className="text-xl font-black text-white mb-2">
            Case <span className="text-orange-500">Status</span>
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Where do the criminal cases stand?
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-400">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Party Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-gray-900/50 to-black/50 rounded-3xl border border-gray-800/50 p-6 sm:p-8"
        >
          <h3 className="text-xl font-black text-white mb-2">
            Party <span className="text-yellow-500">Comparison</span>
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Criminal MPs/MLAs by political party
          </p>
          <div className="space-y-3">
            {partyData.map((party) => {
              const percent = Math.round((party.criminals / party.total) * 100);
              return (
                <div key={party.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: party.color }}
                      />
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                        {party.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      <span className="text-red-400 font-bold">{party.criminals}</span>
                      /{party.total} ({percent}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: party.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
