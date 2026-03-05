/**
 * Fetch latest Indian civic news from NewsAPI and categorize into incidents.
 * Run via: npx tsx scripts/fetch-news.ts
 */

import * as fs from "fs";
import * as path from "path";

// Types matching src/types/categories.ts
interface Incident {
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
  autoSource?: string;
}

interface NewsAPIArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
  content?: string;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

// Category search queries
const CATEGORY_QUERIES: Record<string, string> = {
  infrastructure:
    '("bridge collapse" OR "pothole death" OR "building collapse" OR "road accident" OR "flyover" OR "waterlogging") AND India',
  health:
    '("hospital fire" OR "medicine shortage" OR "oxygen crisis" OR "doctor shortage" OR "health crisis" OR "fake medicine") AND India',
  corruption:
    '("scam" OR "corruption arrest" OR "bribe" OR "fraud case" OR "money laundering") AND India AND politician',
  justice:
    '("court verdict" OR "undertrial" OR "judicial vacancy" OR "pending cases" OR "bail denied") AND India',
  environment:
    '("AQI" OR "air pollution" OR "river pollution" OR "toxic waste" OR "deforestation" OR "oil spill") AND India',
};

// Indian state name → code mapping
const STATE_MAP: Record<string, { code: string; name: string }> = {
  "andhra pradesh": { code: "AP", name: "Andhra Pradesh" },
  arunachal: { code: "AR", name: "Arunachal Pradesh" },
  assam: { code: "AS", name: "Assam" },
  bihar: { code: "BR", name: "Bihar" },
  chhattisgarh: { code: "CT", name: "Chhattisgarh" },
  goa: { code: "GA", name: "Goa" },
  gujarat: { code: "GJ", name: "Gujarat" },
  haryana: { code: "HR", name: "Haryana" },
  himachal: { code: "HP", name: "Himachal Pradesh" },
  jharkhand: { code: "JH", name: "Jharkhand" },
  karnataka: { code: "KA", name: "Karnataka" },
  kerala: { code: "KL", name: "Kerala" },
  "madhya pradesh": { code: "MP", name: "Madhya Pradesh" },
  maharashtra: { code: "MH", name: "Maharashtra" },
  manipur: { code: "MN", name: "Manipur" },
  meghalaya: { code: "ML", name: "Meghalaya" },
  mizoram: { code: "MZ", name: "Mizoram" },
  nagaland: { code: "NL", name: "Nagaland" },
  odisha: { code: "OD", name: "Odisha" },
  punjab: { code: "PB", name: "Punjab" },
  rajasthan: { code: "RJ", name: "Rajasthan" },
  sikkim: { code: "SK", name: "Sikkim" },
  "tamil nadu": { code: "TN", name: "Tamil Nadu" },
  telangana: { code: "TG", name: "Telangana" },
  tripura: { code: "TR", name: "Tripura" },
  "uttar pradesh": { code: "UP", name: "Uttar Pradesh" },
  uttarakhand: { code: "UT", name: "Uttarakhand" },
  "west bengal": { code: "WB", name: "West Bengal" },
  delhi: { code: "DL", name: "Delhi" },
  "jammu": { code: "JK", name: "Jammu & Kashmir" },
  mumbai: { code: "MH", name: "Maharashtra" },
  bangalore: { code: "KA", name: "Karnataka" },
  bengaluru: { code: "KA", name: "Karnataka" },
  chennai: { code: "TN", name: "Tamil Nadu" },
  hyderabad: { code: "TG", name: "Telangana" },
  kolkata: { code: "WB", name: "West Bengal" },
  pune: { code: "MH", name: "Maharashtra" },
  ahmedabad: { code: "GJ", name: "Gujarat" },
  jaipur: { code: "RJ", name: "Rajasthan" },
  lucknow: { code: "UP", name: "Uttar Pradesh" },
  patna: { code: "BR", name: "Bihar" },
  bhopal: { code: "MP", name: "Madhya Pradesh" },
  chandigarh: { code: "CH", name: "Chandigarh" },
  noida: { code: "UP", name: "Uttar Pradesh" },
  gurgaon: { code: "HR", name: "Haryana" },
  gurugram: { code: "HR", name: "Haryana" },
};

// Severity keywords
const CRITICAL_KEYWORDS = ["death", "died", "killed", "dead", "fatal", "massacre", "murder"];
const HIGH_KEYWORDS = ["collapse", "fire", "explosion", "critical", "emergency", "crisis", "scam", "fraud"];
const MEDIUM_KEYWORDS = ["arrest", "charge", "accused", "shortage", "pollution", "toxic", "illegal"];

function detectState(text: string): { code: string; name: string } | null {
  const lower = text.toLowerCase();
  for (const [keyword, info] of Object.entries(STATE_MAP)) {
    if (lower.includes(keyword)) {
      return info;
    }
  }
  return null;
}

function detectSeverity(text: string): "critical" | "high" | "medium" | "low" {
  const lower = text.toLowerCase();
  if (CRITICAL_KEYWORDS.some((kw) => lower.includes(kw))) return "critical";
  if (HIGH_KEYWORDS.some((kw) => lower.includes(kw))) return "high";
  if (MEDIUM_KEYWORDS.some((kw) => lower.includes(kw))) return "medium";
  return "low";
}

function generateTags(text: string, category: string): string[] {
  const tags: string[] = [category];
  const lower = text.toLowerCase();
  const tagKeywords: Record<string, string> = {
    death: "deaths",
    bridge: "bridge",
    road: "roads",
    hospital: "healthcare",
    pollution: "pollution",
    court: "judiciary",
    scam: "scam",
    corruption: "corruption",
    fire: "fire",
    flood: "flood",
    collapse: "collapse",
    bribe: "bribery",
  };
  for (const [keyword, tag] of Object.entries(tagKeywords)) {
    if (lower.includes(keyword) && !tags.includes(tag)) {
      tags.push(tag);
    }
  }
  return tags.slice(0, 5);
}

function deduplicateIncidents(incidents: Incident[]): Incident[] {
  const seen = new Set<string>();
  return incidents.filter((inc) => {
    // Normalize title for dedup
    const key = inc.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchCategoryNews(
  category: string,
  query: string,
  apiKey: string
): Promise<Incident[]> {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  NewsAPI error for ${category}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: NewsAPIResponse = await response.json();
    console.log(`  ${category}: ${data.totalResults} total results, fetched ${data.articles.length}`);

    return data.articles
      .filter((article) => article.title && article.title !== "[Removed]")
      .map((article, index) => {
        const fullText = `${article.title} ${article.description || ""}`;
        const stateInfo = detectState(fullText);

        return {
          id: `auto-${category}-${Date.now()}-${index}`,
          title: article.title.replace(/ - .*$/, "").trim(), // Remove source suffix
          description: article.description || article.title,
          location: stateInfo ? stateInfo.name : "India",
          state: stateInfo ? stateInfo.name : "India",
          stateCode: stateInfo ? stateInfo.code : "IN",
          date: article.publishedAt.split("T")[0],
          severity: detectSeverity(fullText),
          source: article.source.name,
          sourceUrl: article.url,
          tags: generateTags(fullText, category),
          autoSource: "newsapi",
        };
      });
  } catch (error) {
    console.error(`  Error fetching ${category} news:`, error);
    return [];
  }
}

export async function fetchAllNews(apiKey: string): Promise<Record<string, Incident[]>> {
  console.log("Fetching news from NewsAPI...");
  const results: Record<string, Incident[]> = {};

  for (const [category, query] of Object.entries(CATEGORY_QUERIES)) {
    const incidents = await fetchCategoryNews(category, query, apiKey);
    results[category] = deduplicateIncidents(incidents);
    // Small delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

// Write results to JSON file
export function writeNewsIncidents(incidents: Record<string, Incident[]>): void {
  const outputPath = path.join(__dirname, "..", "src", "data", "auto", "news-incidents.json");

  const totalCount = Object.values(incidents).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Writing ${totalCount} total incidents to ${outputPath}`);

  fs.writeFileSync(outputPath, JSON.stringify(incidents, null, 2), "utf-8");
}

// Run standalone
if (require.main === module) {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) {
    console.error("NEWSAPI_KEY environment variable is required");
    process.exit(1);
  }

  fetchAllNews(apiKey).then((incidents) => {
    writeNewsIncidents(incidents);
    const totalCount = Object.values(incidents).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`Done! Fetched ${totalCount} incidents across ${Object.keys(incidents).length} categories.`);
  });
}
