import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#7C6FF0", "#9086F5", "#34D399", "#F5A623", "#F87171", "#38BDF8"];

export default function DistributionBarChart({
  data,
  labelKey,
  height = 280,
}: {
  data: { count: number; [key: string]: string | number }[];
  labelKey: string;
  height?: number;
}) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-faint">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6B6878" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey={labelKey}
          width={110}
          tick={{ fontSize: 11, fill: "#9C9AAB" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ background: "#1B1A22", border: "1px solid #26242F", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#EDEDF2" }}
          cursor={{ fill: "#1B1A2280" }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
