"use client";

import { useState } from "react";
import { Incident } from "@/types/categories";
import IncidentCard from "./IncidentCard";
import ShowMore from "@/components/shared/ShowMore";

interface IncidentListProps {
  incidents: Incident[];
  color?: string;
  pageSize?: number;
}

export default function IncidentList({ incidents, color = "red", pageSize = 8 }: IncidentListProps) {
  const [shown, setShown] = useState(pageSize);

  const sorted = [...incidents].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const visible = sorted.slice(0, shown);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {visible.map((incident, i) => (
          <IncidentCard key={incident.id} incident={incident} index={i} color={color} />
        ))}
      </div>
      <ShowMore
        shown={visible.length}
        total={sorted.length}
        onShowMore={() => setShown((prev) => prev + pageSize)}
        color={color}
      />
    </div>
  );
}
