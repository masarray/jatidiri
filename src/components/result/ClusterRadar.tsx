import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ClusterReport } from "@/types/assessment";

export function ClusterRadar({ reports }: { reports: ClusterReport[] }) {
  const data = reports.map((r) => ({
    cluster: r.cluster,
    Natural: r.natural,
    Aktivitas: r.strength,
  }));
  return (
    <div className="w-full h-72 sm:h-80">
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="cluster" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Natural"
            dataKey="Natural"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.35}
          />
          <Radar
            name="Aktivitas"
            dataKey="Aktivitas"
            stroke="var(--ember)"
            fill="var(--ember)"
            fillOpacity={0.25}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
