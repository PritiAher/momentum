interface ComingNextProps {
  moduleName: string;
}

/**
 * Shown for routes whose module hasn't been built yet in this phased
 * rollout. Swapped out module-by-module as each one is implemented.
 */
export default function ComingNext({ moduleName }: ComingNextProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">{moduleName}</h1>
      <div className="mt-6 card flex flex-col items-center justify-center gap-2 p-16 text-center">
        <p className="text-sm font-medium text-ink">{moduleName} is next in the build queue.</p>
        <p className="text-sm text-ink-faint">Routing and layout are already wired up for this page.</p>
      </div>
    </div>
  );
}
