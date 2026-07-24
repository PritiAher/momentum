import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const DIFFICULTY_COLORS: Record<string, string> = {
  Easy: "#34D399",
  Medium: "#F5A623",
  Hard: "#F87171",
};

export default function DifficultyPieChart({
  distribution,
}: {
  distribution: { Easy: number; Medium: number; Hard: number };
}) {
  const data = [
    { name: "Easy", value: distribution.Easy },
    { name: "Medium", value: distribution.Medium },
    { name: "Hard", value: distribution.Hard },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-faint">No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
          {data.map((d) => (
            <Cell key={d.name} fill={DIFFICULTY_COLORS[d.name]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#1B1A22", border: "1px solid #26242F", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#EDEDF2" }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "#9C9AAB" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
