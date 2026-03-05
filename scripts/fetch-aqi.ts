/**
 * Fetch latest AQI data from OpenAQ for Indian monitoring stations.
 * Groups by state and calculates averages.
 * Run via: npx tsx scripts/fetch-aqi.ts
 */

import * as fs from "fs";
import * as path from "path";

interface StateMetric {
  stateCode: string;
  stateName: string;
  score: number; // AQI value (higher = worse)
  incidents: number; // Number of monitoring stations
  keyIssue: string;
}

interface OpenAQLocation {
  id: number;
  name: string;
  city?: string;
  country: string;
  coordinates: { latitude: number; longitude: number };
  parameters: Array<{
    id: number;
    name: string;
    units: string;
    lastValue: number;
    lastUpdated: string;
  }>;
}

interface OpenAQResponse {
  meta: { found: number; limit: number; page: number };
  results: OpenAQLocation[];
}

// City/station to state mapping
const CITY_STATE_MAP: Record<string, { code: string; name: string }> = {
  delhi: { code: "DL", name: "Delhi" },
  "new delhi": { code: "DL", name: "Delhi" },
  mumbai: { code: "MH", name: "Maharashtra" },
  pune: { code: "MH", name: "Maharashtra" },
  nagpur: { code: "MH", name: "Maharashtra" },
  thane: { code: "MH", name: "Maharashtra" },
  bangalore: { code: "KA", name: "Karnataka" },
  bengaluru: { code: "KA", name: "Karnataka" },
  chennai: { code: "TN", name: "Tamil Nadu" },
  hyderabad: { code: "TG", name: "Telangana" },
  kolkata: { code: "WB", name: "West Bengal" },
  howrah: { code: "WB", name: "West Bengal" },
  ahmedabad: { code: "GJ", name: "Gujarat" },
  surat: { code: "GJ", name: "Gujarat" },
  vadodara: { code: "GJ", name: "Gujarat" },
  jaipur: { code: "RJ", name: "Rajasthan" },
  jodhpur: { code: "RJ", name: "Rajasthan" },
  lucknow: { code: "UP", name: "Uttar Pradesh" },
  noida: { code: "UP", name: "Uttar Pradesh" },
  kanpur: { code: "UP", name: "Uttar Pradesh" },
  agra: { code: "UP", name: "Uttar Pradesh" },
  varanasi: { code: "UP", name: "Uttar Pradesh" },
  ghaziabad: { code: "UP", name: "Uttar Pradesh" },
  patna: { code: "BR", name: "Bihar" },
  muzaffarpur: { code: "BR", name: "Bihar" },
  bhopal: { code: "MP", name: "Madhya Pradesh" },
  indore: { code: "MP", name: "Madhya Pradesh" },
  chandigarh: { code: "CH", name: "Chandigarh" },
  gurugram: { code: "HR", name: "Haryana" },
  gurgaon: { code: "HR", name: "Haryana" },
  faridabad: { code: "HR", name: "Haryana" },
  amritsar: { code: "PB", name: "Punjab" },
  ludhiana: { code: "PB", name: "Punjab" },
  raipur: { code: "CT", name: "Chhattisgarh" },
  ranchi: { code: "JH", name: "Jharkhand" },
  dehradun: { code: "UT", name: "Uttarakhand" },
  bhubaneswar: { code: "OD", name: "Odisha" },
  kochi: { code: "KL", name: "Kerala" },
  thiruvananthapuram: { code: "KL", name: "Kerala" },
  visakhapatnam: { code: "AP", name: "Andhra Pradesh" },
  vijayawada: { code: "AP", name: "Andhra Pradesh" },
  guwahati: { code: "AS", name: "Assam" },
  shimla: { code: "HP", name: "Himachal Pradesh" },
  gangtok: { code: "SK", name: "Sikkim" },
  imphal: { code: "MN", name: "Manipur" },
  shillong: { code: "ML", name: "Meghalaya" },
  aizawl: { code: "MZ", name: "Mizoram" },
  kohima: { code: "NL", name: "Nagaland" },
  agartala: { code: "TR", name: "Tripura" },
  panaji: { code: "GA", name: "Goa" },
};

function getAQICategory(aqi: number): string {
  if (aqi > 400) return "Severe - Emergency conditions";
  if (aqi > 300) return "Very Poor - Serious health risk";
  if (aqi > 200) return "Poor - Health effects for everyone";
  if (aqi > 100) return "Moderate - Sensitive groups affected";
  if (aqi > 50) return "Satisfactory - Minor risk";
  return "Good - Minimal impact";
}

function matchCityToState(city: string): { code: string; name: string } | null {
  const lower = city.toLowerCase().trim();
  for (const [key, value] of Object.entries(CITY_STATE_MAP)) {
    if (lower.includes(key) || key.includes(lower)) {
      return value;
    }
  }
  return null;
}

export async function fetchAQIData(): Promise<StateMetric[]> {
  console.log("Fetching AQI data from OpenAQ...");

  // Fetch PM2.5 data from Indian monitoring stations
  // OpenAQ v3 API - get latest measurements
  const url =
    "https://api.openaq.org/v2/latest?country=IN&parameter=pm25&limit=200&order_by=lastUpdated&sort=desc";

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(`OpenAQ API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const results = data.results || [];
    console.log(`  Received ${results.length} station readings`);

    // Group readings by state
    const stateReadings: Record<string, { values: number[]; name: string }> = {};

    for (const station of results) {
      const city = station.city || station.location || "";
      const stateInfo = matchCityToState(city);

      if (!stateInfo) continue;

      // Get PM2.5 measurement
      const pm25 = station.measurements?.find(
        (m: { parameter: string }) => m.parameter === "pm25"
      );
      if (!pm25 || pm25.value <= 0 || pm25.value > 999) continue;

      if (!stateReadings[stateInfo.code]) {
        stateReadings[stateInfo.code] = { values: [], name: stateInfo.name };
      }
      stateReadings[stateInfo.code].values.push(pm25.value);
    }

    // Calculate state averages
    const stateMetrics: StateMetric[] = Object.entries(stateReadings)
      .map(([code, data]) => {
        const avgAQI = Math.round(
          data.values.reduce((sum, v) => sum + v, 0) / data.values.length
        );
        return {
          stateCode: code,
          stateName: data.name,
          score: Math.min(avgAQI, 100), // Cap at 100 for our 0-100 scale
          incidents: data.values.length,
          keyIssue: getAQICategory(avgAQI),
        };
      })
      .sort((a, b) => b.score - a.score);

    console.log(`  Mapped ${stateMetrics.length} states with AQI data`);
    return stateMetrics;
  } catch (error) {
    console.error("Error fetching AQI data:", error);
    return [];
  }
}

export function writeAQIMetrics(metrics: StateMetric[]): void {
  const outputPath = path.join(__dirname, "..", "src", "data", "auto", "aqi-metrics.json");
  console.log(`Writing AQI data for ${metrics.length} states to ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2), "utf-8");
}

// Run standalone
if (require.main === module) {
  fetchAQIData().then((metrics) => {
    writeAQIMetrics(metrics);
    console.log("Done! AQI data fetched.");
    metrics.forEach((m) => {
      console.log(`  ${m.stateName} (${m.stateCode}): AQI ${m.score} - ${m.keyIssue}`);
    });
  });
}
