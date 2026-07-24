import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TrendLineChart({
  data,
  xKey,
  yKey,
  color,
  formatX,
}: {
  data: Record<string, string | number | null>[];
  xKey: string;
  yKey: string;
  color: string;
  formatX?: (value: string) => string;
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-faint">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#26242F" vertical={false} />
        <XAxis
          dataKey={xKey}
          tickFormatter={formatX}
          tick={{ fontSize: 11, fill: "#6B6878" }}
          axisLine={{ stroke: "#26242F" }}
          tickLine={false}
          minTickGap={30}
        />
        <YAxis tick={{ fontSize: 11, fill: "#6B6878" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#1B1A22", border: "1px solid #26242F", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#EDEDF2" }}
          labelFormatter={(v) => (formatX ? formatX(String(v)) : v)}
        />
        <Line type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} dot={false} connectNulls />
      </LineChart>
    </ResponsiveContainer>
  );
}
