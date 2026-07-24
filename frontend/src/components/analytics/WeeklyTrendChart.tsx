import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WeeklyTrendChart({
  weeklyTrend,
  rollingAverage,
}: {
  weeklyTrend: { weekStart: string; count: number }[];
  rollingAverage: { date: string; rollingAvg: number }[];
}) {
  // Sample the daily rolling average down to one point per week (its
  // Sunday) so it overlays cleanly on the weekly bars without needing a
  // second x-axis scale.
  const rollingByWeek = new Map(rollingAverage.map((r) => [r.date, r.rollingAvg]));
  const merged = weeklyTrend.map((w) => ({
    week: new Date(w.weekStart).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    count: w.count,
    rollingAvg: rollingByWeek.get(w.weekStart) ?? null,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={merged} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#26242F" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6B6878" }} axisLine={{ stroke: "#26242F" }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B6878" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#1B1A22", border: "1px solid #26242F", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#EDEDF2" }}
        />
        <Bar dataKey="count" name="Problems solved" fill="#7C6FF0" radius={[4, 4, 0, 0]} />
        <Line
          type="monotone"
          dataKey="rollingAvg"
          name="7-day rolling avg"
          stroke="#34D399"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
