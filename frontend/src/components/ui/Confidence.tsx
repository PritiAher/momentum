import { cn } from "@/lib/utils";

export function ConfidenceDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5" title={`Confidence: ${value}/5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={cn("h-1.5 w-1.5 rounded-full", n <= value ? "bg-accent" : "bg-base-border")}
        />
      ))}
    </div>
  );
}

export function ConfidencePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Confidence">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition-colors",
            value === n
              ? "border-accent bg-accent-muted text-accent"
              : "border-base-border text-ink-muted hover:border-ink-faint"
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
