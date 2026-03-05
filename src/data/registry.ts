import { TabId, CategoryData, Incident, StateMetric } from "@/types/categories";
import { infrastructureData } from "./infrastructure";
import { healthData } from "./health";
import { environmentData } from "./environment";
import { justiceData } from "./justice";
import { corruptionData } from "./corruption";

// Auto-fetched data (default empty files always exist in src/data/auto/)
import autoNewsIncidents from "./auto/news-incidents.json";
import autoAqiMetrics from "./auto/aqi-metrics.json";
import autoLastUpdated from "./auto/last-updated.json";

const lastUpdated: string | undefined =
  (autoLastUpdated as Record<string, string>).timestamp || undefined;

// Merge curated incidents with auto-fetched incidents
function mergeIncidents(curated: Incident[], autoKey: string): Incident[] {
  const newsMap = autoNewsIncidents as Record<string, Incident[]>;
  const autoIncidents = newsMap[autoKey] || [];
  if (autoIncidents.length === 0) return curated;

  // Curated first, then auto-fetched sorted by date (newest first)
  const sorted = [...autoIncidents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return [...curated, ...sorted];
}

// Merge state metrics (prefer auto AQI for environment tab)
function mergeStateMetrics(
  curated: StateMetric[],
  tabId: string
): StateMetric[] {
  const aqiMetrics = autoAqiMetrics as unknown as StateMetric[];
  if (tabId !== "environment" || aqiMetrics.length === 0) {
    return curated;
  }

  // For environment: use auto AQI metrics, filling gaps with curated
  const autoByCode = new Map(aqiMetrics.map((m) => [m.stateCode, m]));
  const merged = curated.map((m) => autoByCode.get(m.stateCode) || m);

  // Add any states from auto that aren't in curated
  for (const autoMetric of aqiMetrics) {
    if (!curated.find((c) => c.stateCode === autoMetric.stateCode)) {
      merged.push(autoMetric);
    }
  }

  return merged;
}

// Build category map with merged data
const curatedMap: Record<string, CategoryData> = {
  infrastructure: infrastructureData,
  health: healthData,
  environment: environmentData,
  justice: justiceData,
  corruption: corruptionData,
};

const categoryMap: Record<string, CategoryData> = {};

for (const [key, curated] of Object.entries(curatedMap)) {
  categoryMap[key] = {
    ...curated,
    incidents: mergeIncidents(curated.incidents, key),
    stateMetrics: mergeStateMetrics(curated.stateMetrics, key),
    lastUpdated,
  };
}

export function getCategoryData(tabId: TabId): CategoryData | undefined {
  if (tabId === "politicians") return undefined;
  return categoryMap[tabId];
}

export function getAllCategoryData(): Record<string, CategoryData> {
  return categoryMap;
}

export function getLastUpdated(): string | undefined {
  return lastUpdated;
}
