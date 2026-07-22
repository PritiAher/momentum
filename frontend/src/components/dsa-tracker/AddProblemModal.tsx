import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { X } from "lucide-react";
import { TOPICS, PLATFORMS, DIFFICULTIES } from "@/lib/constants";
import { ConfidencePicker } from "@/components/ui/Confidence";
import { useCreateProblem, useUpdateProblem } from "@/hooks/useProblems";
import type { Problem } from "@/types";

interface FormValues {
  date: string;
  platform: string;
  problemNumber: string;
  problemName: string;
  difficulty: string;
  topic: string;
  pattern: string;
  timeTakenMinutes: string;
  solved: boolean;
  hintUsed: boolean;
  confidence: number;
  revisionRequired: boolean;
  notebookPage: string;
  remarks: string;
}

const todayLocal = () => new Date().toISOString().slice(0, 10);

const emptyDefaults: FormValues = {
  date: todayLocal(),
  platform: "LeetCode",
  problemNumber: "",
  problemName: "",
  difficulty: "Medium",
  topic: "Arrays",
  pattern: "",
  timeTakenMinutes: "",
  solved: true,
  hintUsed: false,
  confidence: 3,
  revisionRequired: false,
  notebookPage: "",
  remarks: "",
};

export default function AddProblemModal({
  open,
  onOpenChange,
  editingProblem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProblem?: Problem | null;
}) {
  const createProblem = useCreateProblem();
  const updateProblem = useUpdateProblem();

  const { register, handleSubmit, control, reset, setFocus } = useForm<FormValues>({
    defaultValues: emptyDefaults,
  });

  // Reset (and pre-fill for edit) every time the modal opens, and put focus
  // straight into the name field — the one field every entry needs typed.
  useEffect(() => {
    if (!open) return;
    if (editingProblem) {
      reset({
        date: editingProblem.date.slice(0, 10),
        platform: editingProblem.platform,
        problemNumber: editingProblem.problemNumber,
        problemName: editingProblem.problemName,
        difficulty: editingProblem.difficulty,
        topic: editingProblem.topic,
        pattern: editingProblem.pattern,
        timeTakenMinutes: editingProblem.timeTakenMinutes?.toString() || "",
        solved: editingProblem.solved,
        hintUsed: editingProblem.hintUsed,
        confidence: editingProblem.confidence,
        revisionRequired: editingProblem.revisionRequired,
        notebookPage: editingProblem.notebookPage,
        remarks: editingProblem.remarks,
      });
    } else {
      reset(emptyDefaults);
    }
    setTimeout(() => setFocus("problemName"), 50);
  }, [open, editingProblem, reset, setFocus]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      timeTakenMinutes: values.timeTakenMinutes ? Number(values.timeTakenMinutes) : null,
    } as unknown as Partial<Problem>;

    if (editingProblem) {
      await updateProblem.mutateAsync({ id: editingProblem._id, payload });
    } else {
      await createProblem.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const submitting = createProblem.isPending || updateProblem.isPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 animate-slide-up rounded-xl border border-base-border bg-base-surface p-5 shadow-card-hover">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-ink">
              {editingProblem ? "Edit problem" : "Log a problem"}
            </Dialog.Title>
            <Dialog.Close className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink">
              <X size={16} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("problemName", { required: true })}
              placeholder="Problem name"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />

            <div className="grid grid-cols-3 gap-2">
              <select
                {...register("platform")}
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <input
                {...register("problemNumber")}
                placeholder="# (optional)"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <input
                {...register("date")}
                type="date"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                {...register("topic")}
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                {...register("difficulty")}
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                {...register("pattern")}
                placeholder="Pattern (e.g. Two Pointers)"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <input
                  {...register("timeTakenMinutes")}
                  type="number"
                  min={0}
                  placeholder="Mins"
                  className="w-1/2 rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
                />
                <input
                  {...register("notebookPage")}
                  placeholder="Pg #"
                  className="w-1/2 rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Confidence</label>
              <Controller
                control={control}
                name="confidence"
                render={({ field }) => <ConfidencePicker value={field.value} onChange={field.onChange} />}
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 text-sm text-ink-muted">
                <input type="checkbox" {...register("solved")} className="accent-accent" />
                Solved
              </label>
              <label className="flex items-center gap-1.5 text-sm text-ink-muted">
                <input type="checkbox" {...register("hintUsed")} className="accent-accent" />
                Hint used
              </label>
              <label className="flex items-center gap-1.5 text-sm text-ink-muted">
                <input type="checkbox" {...register("revisionRequired")} className="accent-accent" />
                Needs revision
              </label>
            </div>

            <textarea
              {...register("remarks")}
              placeholder="Remarks (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />

            <div className="flex justify-end gap-2 pt-1">
              <Dialog.Close className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-base-surface-raised">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingProblem ? "Save changes" : "Add problem"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
