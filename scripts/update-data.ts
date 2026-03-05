/**
 * Main orchestrator: fetches all data sources and writes combined output.
 * Run via: npx tsx scripts/update-data.ts
 *
 * Environment variables:
 *   NEWSAPI_KEY - Required for news fetching (get from newsapi.org)
 */

import * as fs from "fs";
import * as path from "path";
import { fetchAllNews, writeNewsIncidents } from "./fetch-news";
import { fetchAQIData, writeAQIMetrics } from "./fetch-aqi";

interface UpdateSummary {
  timestamp: string;
  newsIncidents: Record<string, number>;
  aqiStates: number;
  errors: string[];
}

async function main() {
  console.log("=".repeat(60));
  console.log("IndiaUpfront Nightly Data Update");
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log("=".repeat(60));

  const errors: string[] = [];
  let newsResults: Record<string, Array<{ id: string }>> = {};
  let aqiResults: Array<{ stateCode: string }> = [];

  // Ensure auto directory exists
  const autoDir = path.join(__dirname, "..", "src", "data", "auto");
  if (!fs.existsSync(autoDir)) {
    fs.mkdirSync(autoDir, { recursive: true });
  }

  // Fetch news (requires API key)
  const apiKey = process.env.NEWSAPI_KEY;
  if (apiKey) {
    try {
      console.log("\n--- Fetching News ---");
      const news = await fetchAllNews(apiKey);
      writeNewsIncidents(news);
      newsResults = news;
    } catch (error) {
      const msg = `News fetch failed: ${error}`;
      console.error(msg);
      errors.push(msg);
    }
  } else {
    console.log("\nSkipping news fetch (NEWSAPI_KEY not set)");
    errors.push("NEWSAPI_KEY not set, news fetch skipped");
  }

  // Fetch AQI (no API key needed)
  try {
    console.log("\n--- Fetching AQI Data ---");
    const aqi = await fetchAQIData();
    writeAQIMetrics(aqi);
    aqiResults = aqi;
  } catch (error) {
    const msg = `AQI fetch failed: ${error}`;
    console.error(msg);
    errors.push(msg);
  }

  // Write last-updated.json
  const summary: UpdateSummary = {
    timestamp: new Date().toISOString(),
    newsIncidents: Object.fromEntries(
      Object.entries(newsResults).map(([k, v]) => [k, v.length])
    ),
    aqiStates: aqiResults.length,
    errors,
  };

  const summaryPath = path.join(autoDir, "last-updated.json");
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf-8");

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("UPDATE SUMMARY");
  console.log("=".repeat(60));
  console.log(`Timestamp: ${summary.timestamp}`);
  console.log(`News incidents by category:`);
  for (const [cat, count] of Object.entries(summary.newsIncidents)) {
    console.log(`  ${cat}: ${count} articles`);
  }
  console.log(`AQI data: ${summary.aqiStates} states`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log("=".repeat(60));

  // Exit with 0 even if partial failures (we want the commit to happen)
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
