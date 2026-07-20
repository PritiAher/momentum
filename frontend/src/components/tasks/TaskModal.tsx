import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES, TASK_STATUS_LABELS } from "@/lib/constants";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import type { Task } from "@/types";

interface FormValues {
  title: string;
  category: string;
  priority: string;
  deadline: string;
  estimatedMinutes: string;
  status: string;
}

const emptyDefaults: FormValues = {
  title: "",
  category: "DSA",
  priority: "Medium",
  deadline: "",
  estimatedMinutes: "",
  status: "Todo",
};

export default function TaskModal({
  open,
  onOpenChange,
  editingTask,
  defaultStatus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask?: Task | null;
  defaultStatus?: string;
}) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const { register, handleSubmit, reset, setFocus } = useForm<FormValues>({
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (!open) return;
    if (editingTask) {
      reset({
        title: editingTask.title,
        category: editingTask.category,
        priority: editingTask.priority,
        deadline: editingTask.deadline ? editingTask.deadline.slice(0, 10) : "",
        estimatedMinutes: editingTask.estimatedMinutes?.toString() || "",
        status: editingTask.status,
      });
    } else {
      reset({ ...emptyDefaults, status: defaultStatus || "Todo" });
    }
    setTimeout(() => setFocus("title"), 50);
  }, [open, editingTask, defaultStatus, reset, setFocus]);

  const onSubmit = async (values: FormValues) => {
    const payload = {
      ...values,
      deadline: values.deadline || null,
      estimatedMinutes: values.estimatedMinutes ? Number(values.estimatedMinutes) : null,
    } as unknown as Partial<Task>;

    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask._id, payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const submitting = createTask.isPending || updateTask.isPending;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 animate-slide-up rounded-xl border border-base-border bg-base-surface p-5 shadow-card-hover">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-ink">
              {editingTask ? "Edit task" : "New task"}
            </Dialog.Title>
            <Dialog.Close className="rounded-md p-1 text-ink-faint hover:bg-base-surface-raised hover:text-ink">
              <X size={16} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input
              {...register("title", { required: true })}
              placeholder="Task title"
              className="w-full rounded-lg border border-base-border bg-base px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                {...register("category")}
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {TASK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                {...register("priority")}
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              >
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p} priority
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                {...register("deadline")}
                type="date"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
              <input
                {...register("estimatedMinutes")}
                type="number"
                min={0}
                placeholder="Est. minutes"
                className="rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
              />
            </div>

            <select
              {...register("status")}
              className="w-full rounded-lg border border-base-border bg-base px-2.5 py-2 text-sm text-ink outline-none focus:border-accent"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {TASK_STATUS_LABELS[s]}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-1">
              <Dialog.Close className="rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-base-surface-raised">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {submitting ? "Saving..." : editingTask ? "Save changes" : "Add task"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
