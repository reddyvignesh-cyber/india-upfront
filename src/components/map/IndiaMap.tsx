"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { stateData, StateData } from "@/data/politicians";
import { StateMetric } from "@/types/categories";

const INDIA_TOPO_URL =
  "https://raw.githubusercontent.com/varunon9/india-choropleth-javascript/master/src/india.topo.json";

const STATE_CODE_MAP: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Arunachal Pradesh": "AR",
  "Assam": "AS",
  "Bihar": "BR",
  "Chhattisgarh": "CG",
  "Goa": "GA",
  "Gujarat": "GJ",
  "Haryana": "HR",
  "Himachal Pradesh": "HP",
  "Jammu & Kashmir": "JK",
  "Jharkhand": "JH",
  "Karnataka": "KA",
  "Kerala": "KL",
  "Madhya Pradesh": "MP",
  "Maharashtra": "MH",
  "Manipur": "MN",
  "Meghalaya": "ML",
  "Mizoram": "MZ",
  "Nagaland": "NL",
  "Odisha": "OR",
  "Punjab": "PB",
  "Rajasthan": "RJ",
  "Sikkim": "SK",
  "Tamil Nadu": "TN",
  "Telangana": "TS",
  "Tripura": "TR",
  "Uttar Pradesh": "UP",
  "Uttarakhand": "UK",
  "West Bengal": "WB",
  "Delhi": "DL",
  "Ladakh": "LA",
  "NCT of Delhi": "DL",
  "Dadra and Nagar Haveli": "DN",
  "Daman and Diu": "DD",
  "Lakshadweep": "LD",
  "Puducherry": "PY",
  "Andaman & Nicobar": "AN",
  "Chandigarh": "CH",
};

function getStateCode(geo: { id?: string; properties?: { name?: string } }): string {
  if (geo.id && stateData.find((s) => s.code === geo.id)) {
    return geo.id;
  }
  const name = geo.properties?.name || "";
  return STATE_CODE_MAP[name] || geo.id || "";
}

// Color scales per category
const colorScales: Record<string, (score: number) => string> = {
  default: (percent: number) => {
    if (percent > 50) return "#dc2626";
    if (percent > 40) return "#ea580c";
    if (percent > 30) return "#f59e0b";
    if (percent > 20) return "#eab308";
    if (percent > 10) return "#22c55e";
    return "#166534";
  },
  red: (score: number) => {
    if (score > 80) return "#dc2626";
    if (score > 60) return "#ef4444";
    if (score > 40) return "#f87171";
    if (score > 20) return "#fca5a5";
    return "#fecaca";
  },
  orange: (score: number) => {
    if (score > 80) return "#ea580c";
    if (score > 60) return "#f97316";
    if (score > 40) return "#fb923c";
    if (score > 20) return "#fdba74";
    return "#fed7aa";
  },
  purple: (score: number) => {
    if (score > 80) return "#7c3aed";
    if (score > 60) return "#8b5cf6";
    if (score > 40) return "#a78bfa";
    if (score > 20) return "#c4b5fd";
    return "#ddd6fe";
  },
  blue: (score: number) => {
    if (score > 80) return "#1d4ed8";
    if (score > 60) return "#2563eb";
    if (score > 40) return "#3b82f6";
    if (score > 20) return "#60a5fa";
    return "#93c5fd";
  },
  yellow: (score: number) => {
    if (score > 80) return "#b45309";
    if (score > 60) return "#d97706";
    if (score > 40) return "#f59e0b";
    if (score > 20) return "#fbbf24";
    return "#fde68a";
  },
};

interface IndiaMapProps {
  stateMetrics?: StateMetric[];
  metricLabel?: string;
  metricColor?: string;
}

type TooltipInfo = {
  name: string;
  score: number;
  keyIssue?: string;
  incidents?: number;
  // Politicians mode fields
  percentCriminal?: number;
  withCriminalCases?: number;
  seriousCrimeCandidates?: number;
  totalPoliticians?: number;
  topCrimes?: string[];
};

export default function IndiaMap({ stateMetrics, metricLabel, metricColor }: IndiaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const isCategory = !!stateMetrics;
  const getColor = colorScales[metricColor || "default"] || colorScales.default;

  const handleMouseEnter = useCallback(
    (geo: { id?: string; properties?: { name?: string } }, evt: React.MouseEvent) => {
      const code = getStateCode(geo);
      setHoveredState(code);

      if (isCategory && stateMetrics) {
        const metric = stateMetrics.find((m) => m.stateCode === code);
        if (metric) {
          setTooltipInfo({
            name: metric.stateName,
            score: metric.score,
            keyIssue: metric.keyIssue,
            incidents: metric.incidents,
          });
        } else {
          setTooltipInfo(null);
        }
      } else {
        const data = stateData.find((s) => s.code === code);
        if (data) {
          setTooltipInfo({
            name: data.name,
            score: data.percentCriminal,
            percentCriminal: data.percentCriminal,
            withCriminalCases: data.withCriminalCases,
            seriousCrimeCandidates: data.seriousCrimeCandidates,
            totalPoliticians: data.totalPoliticians,
            topCrimes: data.topCrimes,
          });
        } else {
          setTooltipInfo(null);
        }
      }

      const rect = (evt.currentTarget as SVGElement).closest(".map-container")?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top,
        });
      }
    },
    [isCategory, stateMetrics]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredState(null);
    setTooltipInfo(null);
  }, []);

  const handleMouseMove = useCallback(
    (evt: React.MouseEvent) => {
      if (!hoveredState) return;
      const rect = (evt.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltipPos({
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
      });
    },
    [hoveredState]
  );

  const getScore = (code: string): number => {
    if (isCategory && stateMetrics) {
      return stateMetrics.find((m) => m.stateCode === code)?.score ?? 0;
    }
    return stateData.find((s) => s.code === code)?.percentCriminal ?? 0;
  };

  const hasData = (code: string): boolean => {
    if (isCategory && stateMetrics) {
      return !!stateMetrics.find((m) => m.stateCode === code);
    }
    return !!stateData.find((s) => s.code === code);
  };

  // Top 5 states by score
  const topStates = isCategory && stateMetrics
    ? [...stateMetrics].sort((a, b) => b.score - a.score).slice(0, 5)
    : [...stateData].sort((a, b) => b.percentCriminal - a.percentCriminal).slice(0, 5);

  const title = isCategory
    ? `${metricLabel} by State`
    : "Criminal Politicians by State";

  const accentColor = metricColor || "red";
  const accentClass = `text-${accentColor}-500`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative"
    >
      <div className="relative bg-gradient-to-b from-gray-900/50 to-black/50 rounded-3xl border border-gray-800/50 p-4 sm:p-8 backdrop-blur-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-2 text-center">
          {title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className={accentClass}>{title.split(" ").pop()}</span>
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Hover over a state to see detailed breakdown
        </p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Map */}
          <div
            className="relative flex-1 w-full map-container"
            onMouseMove={handleMouseMove}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 1000, center: [82, 22] }}
              width={600}
              height={550}
              style={{ width: "100%", height: "auto" }}
            >
              <ZoomableGroup center={[82, 22]} zoom={1} minZoom={1} maxZoom={1}>
                <Geographies geography={INDIA_TOPO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const code = getStateCode(geo);
                      const score = getScore(code);
                      const has = hasData(code);

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            default: {
                              fill: getColor(score),
                              fillOpacity: has ? 0.7 : 0.2,
                              stroke: "#1a1a2e",
                              strokeWidth: 0.5,
                              outline: "none",
                              transition: "all 0.2s",
                            },
                            hover: {
                              fill: getColor(score),
                              fillOpacity: 1,
                              stroke: "#ffffff",
                              strokeWidth: 1.5,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: {
                              fill: getColor(score),
                              fillOpacity: 0.9,
                              stroke: "#ffffff",
                              strokeWidth: 1.5,
                              outline: "none",
                            },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Floating Tooltip */}
            {tooltipInfo && (
              <div
                className="absolute z-50 pointer-events-none"
                style={{
                  left: tooltipPos.x + 12,
                  top: tooltipPos.y - 10,
                  transform: "translateY(-100%)",
                }}
              >
                <div className="bg-black/95 border border-gray-600/40 rounded-xl p-3 shadow-2xl min-w-[180px]">
                  <div className="text-white font-bold text-sm mb-2">
                    {tooltipInfo.name}
                  </div>
                  <div className="space-y-1.5">
                    {isCategory ? (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Severity Score</span>
                          <span className={`text-${accentColor}-400 font-bold`}>
                            {tooltipInfo.score}/100
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Incidents</span>
                          <span className="text-gray-300 font-bold">
                            {tooltipInfo.incidents}
                          </span>
                        </div>
                        {tooltipInfo.keyIssue && (
                          <div className="mt-2 pt-2 border-t border-gray-800">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                              {tooltipInfo.keyIssue}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Criminal %</span>
                          <span className="text-red-400 font-bold">
                            {tooltipInfo.percentCriminal}%
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">With Cases</span>
                          <span className="text-orange-400 font-bold">
                            {tooltipInfo.withCriminalCases}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Serious Crimes</span>
                          <span className="text-yellow-400 font-bold">
                            {tooltipInfo.seriousCrimeCandidates}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">Total MLAs/MPs</span>
                          <span className="text-gray-300 font-bold">
                            {tooltipInfo.totalPoliticians}
                          </span>
                        </div>
                        {tooltipInfo.topCrimes && tooltipInfo.topCrimes.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-gray-800">
                            <div className="flex flex-wrap gap-1">
                              {tooltipInfo.topCrimes.slice(0, 3).map((crime) => (
                                <span
                                  key={crime}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20"
                                >
                                  {crime}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend & Top States */}
          <div className="lg:w-72 w-full space-y-4 lg:sticky lg:top-24">
            {/* Color Legend */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3">
                {isCategory ? "Severity Scale" : "Crime Severity"}
              </h3>
              <div className="space-y-2">
                {(isCategory
                  ? [
                      { score: 90, label: "Very High (80-100)", range: "Critical" },
                      { score: 70, label: "High (60-80)", range: "High" },
                      { score: 50, label: "Moderate (40-60)", range: "Medium" },
                      { score: 30, label: "Low (20-40)", range: "Low" },
                      { score: 10, label: "Minimal (0-20)", range: "Minimal" },
                    ]
                  : [
                      { score: 55, label: "> 50% Criminal", range: "Critical" },
                      { score: 45, label: "40-50% Criminal", range: "High" },
                      { score: 35, label: "30-40% Criminal", range: "Medium" },
                      { score: 25, label: "20-30% Criminal", range: "Low" },
                      { score: 5, label: "< 20% Criminal", range: "Minimal" },
                    ]
                ).map((item) => (
                  <div key={item.range} className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: getColor(item.score) }}
                    />
                    <span className="text-xs text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 States */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3">
                {isCategory ? "Most Affected States" : "Most Criminal States"}
              </h3>
              <div className="space-y-2">
                {topStates.map((item, i) => {
                  const name = "stateName" in item ? item.stateName : item.name;
                  const score = "score" in item ? item.score : item.percentCriminal;
                  const code = "stateCode" in item ? item.stateCode : item.code;

                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between group hover:bg-white/5 rounded-lg px-2 py-1.5 -mx-2 transition-colors cursor-pointer"
                      onMouseEnter={() => {
                        setHoveredState(code);
                        if (isCategory && stateMetrics) {
                          const m = stateMetrics.find((sm) => sm.stateCode === code);
                          if (m) setTooltipInfo({ name: m.stateName, score: m.score, keyIssue: m.keyIssue, incidents: m.incidents });
                        } else {
                          const d = stateData.find((s) => s.code === code);
                          if (d) setTooltipInfo({ name: d.name, score: d.percentCriminal, percentCriminal: d.percentCriminal, withCriminalCases: d.withCriminalCases, seriousCrimeCandidates: d.seriousCrimeCandidates, totalPoliticians: d.totalPoliticians, topCrimes: d.topCrimes });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredState(null);
                        setTooltipInfo(null);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600 w-4">
                          {i + 1}
                        </span>
                        <div
                          className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: getColor(score) }}
                        />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                          {name}
                        </span>
                      </div>
                      <span className={`text-sm font-bold text-${accentColor}-400`}>
                        {isCategory ? `${score}/100` : `${score}%`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
