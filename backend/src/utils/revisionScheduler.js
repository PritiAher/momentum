import RevisionQueue from "../models/RevisionQueue.js";

const STAGE_OFFSETS_DAYS = {
  tomorrow: 1,
  "7day": 7,
  "21day": 21,
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0); // fixed 9am so "today's queue" queries are simple date-range checks
  return d;
};

/**
 * Keeps RevisionQueue in sync with a single Problem's current state.
 * Called after every create/update in problemController — never invoked
 * directly by the frontend, which is why this isn't its own route.
 *
 * Rule: confidence <= 3 OR revisionRequired === true triggers all three
 * stages (tomorrow / 7day / 21day) to exist, scheduled from the problem's
 * `date` field (not from "now"), so backdated entries schedule correctly.
 * If the problem no longer meets the trigger (edited to confidence > 3 and
 * revisionRequired false), any *incomplete* stages are removed — completed
 * ones are left alone since they're historical record, not pending work.
 */
export const syncRevisionQueueForProblem = async (problem) => {
  const shouldBeInQueue = problem.confidence <= 3 || problem.revisionRequired === true;

  if (!shouldBeInQueue) {
    await RevisionQueue.deleteMany({ problem: problem._id, completed: false });
    return;
  }

  const stageWrites = Object.entries(STAGE_OFFSETS_DAYS).map(([stage, offset]) =>
    RevisionQueue.findOneAndUpdate(
      { problem: problem._id, stage },
      {
        $setOnInsert: {
          user: problem.user,
          problem: problem._id,
          stage,
          scheduledFor: addDays(problem.date, offset),
        },
      },
      { upsert: true, new: true }
    )
  );

  await Promise.all(stageWrites);
};
