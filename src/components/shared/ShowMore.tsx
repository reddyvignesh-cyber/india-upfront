"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ShowMoreProps {
  shown: number;
  total: number;
  onShowMore: () => void;
  color?: string;
}

export default function ShowMore({ shown, total, onShowMore, color = "red" }: ShowMoreProps) {
  if (shown >= total) return null;

  const colorMap: Record<string, string> = {
    red: "border-red-500/30 text-red-400 hover:bg-red-500/10",
    orange: "border-orange-500/30 text-orange-400 hover:bg-orange-500/10",
    yellow: "border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10",
    blue: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
    purple: "border-purple-500/30 text-purple-400 hover:bg-purple-500/10",
    green: "border-green-500/30 text-green-400 hover:bg-green-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-2 mt-8"
    >
      <span className="text-xs text-gray-500">
        Showing {shown} of {total}
      </span>
      <button
        onClick={onShowMore}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm font-medium transition-all ${colorMap[color] || colorMap.red}`}
      >
        Show More
        <ChevronDown className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
