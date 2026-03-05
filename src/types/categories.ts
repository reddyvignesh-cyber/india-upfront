export type TabId = "politicians" | "infrastructure" | "health" | "environment" | "justice" | "corruption";

export interface TabDefinition {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: string; // lucide icon name
  color: string; // tailwind color name (e.g., "red", "orange")
  description: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  state: string;
  stateCode: string;
  date: string;
  severity: "critical" | "high" | "medium" | "low";
  source: string;
  sourceUrl: string;
  tags: string[];
  autoSource?: string; // "newsapi" | "openaq" — present if auto-fetched
}

export interface StateMetric {
  stateCode: string;
  stateName: string;
  score: number; // 0-100, higher = worse
  incidents: number;
  keyIssue: string;
}

export interface CategoryData {
  tab: TabDefinition;
  incidents: Incident[];
  stateMetrics: StateMetric[];
  nationalStats: Record<string, number | string>;
  lastUpdated?: string; // ISO timestamp of last auto-update
}
