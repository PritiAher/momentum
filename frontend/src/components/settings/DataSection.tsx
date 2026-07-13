import { useRef, useState } from "react";
import { Download, Upload, DatabaseBackup } from "lucide-react";
import { useExportData, useImportData } from "@/hooks/useSettings";

export default function DataSection() {
  const exportData = useExportData();
  const importData = useImportData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  const handleExport = async () => {
    const payload = await exportData.mutateAsync();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `momentum-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMessage("");
    setImportError("");

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const imported = await importData.mutateAsync(parsed);
      setImportMessage(
        `Imported ${imported.problems} problems, ${imported.tasks} tasks, ${imported.calendarEvents} events, ${imported.topics} topic notes.`
      );
    } catch (err: any) {
      setImportError(
        err instanceof SyntaxError
          ? "That file isn't valid JSON — make sure it's an unmodified Momentum backup export."
          : err.response?.data?.message || "Import failed."
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <DatabaseBackup size={15} className="text-ink-faint" />
        <h2 className="text-sm font-semibold text-ink">Data & Backup</h2>
      </div>
      <p className="mt-1 text-xs text-ink-faint">
        Export downloads a JSON snapshot of every problem, task, calendar event, and topic note you own.
        Import is additive — it adds records, it never deletes or overwrites what's already here.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={handleExport}
          disabled={exportData.isPending}
          className="flex items-center gap-1.5 rounded-lg border border-base-border px-3.5 py-2 text-sm text-ink hover:bg-base-surface-raised disabled:opacity-50"
        >
          <Download size={14} /> {exportData.isPending ? "Preparing..." : "Export backup"}
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importData.isPending}
          className="flex items-center gap-1.5 rounded-lg border border-base-border px-3.5 py-2 text-sm text-ink hover:bg-base-surface-raised disabled:opacity-50"
        >
          <Upload size={14} /> {importData.isPending ? "Importing..." : "Import backup"}
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
      </div>

      {importError && <p className="mt-3 text-xs text-danger">{importError}</p>}
      {importMessage && <p className="mt-3 text-xs text-success">{importMessage}</p>}
    </div>
  );
}
