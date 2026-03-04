import { TabId, CategoryData } from "@/types/categories";
import { infrastructureData } from "./infrastructure";
import { healthData } from "./health";
import { environmentData } from "./environment";
import { justiceData } from "./justice";
import { corruptionData } from "./corruption";

const categoryMap: Record<string, CategoryData> = {
  infrastructure: infrastructureData,
  health: healthData,
  environment: environmentData,
  justice: justiceData,
  corruption: corruptionData,
};

export function getCategoryData(tabId: TabId): CategoryData | undefined {
  if (tabId === "politicians") return undefined;
  return categoryMap[tabId];
}

export function getAllCategoryData(): Record<string, CategoryData> {
  return categoryMap;
}
