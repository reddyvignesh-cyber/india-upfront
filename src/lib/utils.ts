import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCrores(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L Cr`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K Cr`;
  return `₹${amount} Cr`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "serious":
      return "text-red-500 bg-red-500/10 border-red-500/30";
    case "financial":
      return "text-orange-500 bg-orange-500/10 border-orange-500/30";
    default:
      return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30";
  }
}

export function getCrimeIcon(description: string): string {
  const d = description.toLowerCase();
  if (d.includes("murder")) return "⚰️";
  if (d.includes("rape") || d.includes("sexual")) return "🚨";
  if (d.includes("kidnap")) return "🔗";
  if (d.includes("fraud") || d.includes("cheat") || d.includes("scam")) return "💰";
  if (d.includes("corruption")) return "🏛️";
  if (d.includes("money laundering")) return "🧾";
  if (d.includes("riot")) return "🔥";
  if (d.includes("arms")) return "🔫";
  if (d.includes("attempt to murder")) return "🗡️";
  return "⚖️";
}
