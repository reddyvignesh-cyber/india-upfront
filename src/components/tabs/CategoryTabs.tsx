"use client";

import { motion } from "framer-motion";
import {
  Users,
  Construction,
  Heart,
  Wind,
  Scale,
  IndianRupee,
} from "lucide-react";
import { TabId } from "@/types/categories";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; shortLabel: string; icon: typeof Users; color: string }[] = [
  { id: "politicians", label: "Criminal Politicians", shortLabel: "Politicians", icon: Users, color: "red" },
  { id: "infrastructure", label: "Infrastructure Crisis", shortLabel: "Infra", icon: Construction, color: "orange" },
  { id: "health", label: "Healthcare Failures", shortLabel: "Health", icon: Heart, color: "red" },
  { id: "environment", label: "Environment & AQI", shortLabel: "AQI", icon: Wind, color: "purple" },
  { id: "justice", label: "Justice Delayed", shortLabel: "Justice", icon: Scale, color: "blue" },
  { id: "corruption", label: "Corruption & Bribes", shortLabel: "Bribes", icon: IndianRupee, color: "yellow" },
];

const colorMap: Record<string, { active: string; inactive: string; indicator: string }> = {
  red: {
    active: "text-red-400 bg-red-500/10 border-red-500/40",
    inactive: "text-gray-400 hover:text-red-400 border-transparent hover:border-red-500/20",
    indicator: "bg-red-500",
  },
  orange: {
    active: "text-orange-400 bg-orange-500/10 border-orange-500/40",
    inactive: "text-gray-400 hover:text-orange-400 border-transparent hover:border-orange-500/20",
    indicator: "bg-orange-500",
  },
  purple: {
    active: "text-purple-400 bg-purple-500/10 border-purple-500/40",
    inactive: "text-gray-400 hover:text-purple-400 border-transparent hover:border-purple-500/20",
    indicator: "bg-purple-500",
  },
  blue: {
    active: "text-blue-400 bg-blue-500/10 border-blue-500/40",
    inactive: "text-gray-400 hover:text-blue-400 border-transparent hover:border-blue-500/20",
    indicator: "bg-blue-500",
  },
  yellow: {
    active: "text-yellow-400 bg-yellow-500/10 border-yellow-500/40",
    inactive: "text-gray-400 hover:text-yellow-400 border-transparent hover:border-yellow-500/20",
    indicator: "bg-yellow-500",
  },
};

export default function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const colors = colorMap[tab.color];
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0",
                  isActive ? colors.active : colors.inactive
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="tabIndicator"
                    className={cn("absolute bottom-0 left-2 right-2 h-0.5 rounded-full", colors.indicator)}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
