const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const toISODateOnly = (date) => date.toISOString().slice(0, 10);
const parseISODateOnly = (str) => new Date(`${str}T00:00:00.000Z`);

/**
 * Computes current + longest streak from a list of distinct "days a problem
 * was logged" (as YYYY-MM-DD strings, most-recent-first). Recomputed live
 * on every dashboard load rather than stored as an incrementally-updated
 * counter — that keeps it correct even when problems are logged with a
 * backdated `date`, edited, or deleted, none of which an incremental
 * "increment on create" approach would handle correctly.
 *
 * "Current streak" doesn't reset to 0 just because today hasn't been logged
 * yet — it counts the most recent unbroken run ending today or yesterday,
 * matching how GitHub/Duolingo-style streaks behave (today isn't "missed"
 * until the day is actually over).
 */
export const computeStreak = (distinctDateStrings) => {
  const dateSet = new Set(distinctDateStrings);
  const todayStr = toISODateOnly(new Date());

  let cursor = parseISODateOnly(todayStr);
  if (!dateSet.has(todayStr)) {
    cursor = new Date(cursor.getTime() - ONE_DAY_MS);
  }

  let currentStreak = 0;
  while (dateSet.has(toISODateOnly(cursor))) {
    currentStreak += 1;
    cursor = new Date(cursor.getTime() - ONE_DAY_MS);
  }

  const ascending = [...distinctDateStrings].sort();
  let longestStreak = 0;
  let run = 0;
  let prevDate = null;
  for (const dStr of ascending) {
    const d = parseISODateOnly(dStr);
    run = prevDate && d.getTime() - prevDate.getTime() === ONE_DAY_MS ? run + 1 : 1;
    longestStreak = Math.max(longestStreak, run);
    prevDate = d;
  }

  return { currentStreak, longestStreak };
};
