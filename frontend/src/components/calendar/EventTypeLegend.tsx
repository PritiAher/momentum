import { EVENT_TYPES, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from "@/lib/constants";

export default function EventTypeLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {EVENT_TYPES.map((type) => (
        <div key={type} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: EVENT_TYPE_COLORS[type] }} />
          <span className="text-xs text-ink-muted">{EVENT_TYPE_LABELS[type]}</span>
        </div>
      ))}
    </div>
  );
}
