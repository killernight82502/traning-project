"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Upload, Trash2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

interface DataManagerProps {
  exportData: () => string;
  importData: (json: string) => boolean;
  resetProgress: () => void;
}

export function DataManager({ exportData, importData, resetProgress }: DataManagerProps) {
  const [expanded, setExpanded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timebot-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Backup downloaded!", {
      description: "Your progress has been saved.",
      icon: "💾",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importData(content);
      if (success) {
        setExpanded(false);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="glass rounded-xl border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">💾</span>
          <div className="text-left">
            <h3 className="font-semibold text-white">Data Management</h3>
            <p className="text-xs text-gray-400">Backup and restore your progress</p>
          </div>
        </div>
        <span className="text-gray-400">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleExport}
              variant="outline"
              className="flex items-center justify-center gap-2 bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-purple-500/50"
            >
              <Download className="w-4 h-4" />
              Export Backup
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-file"
              />
              <label
                htmlFor="import-file"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-purple-500/50 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                Import Backup
              </label>
            </div>

            <Button
              onClick={handleReset}
              variant="outline"
              className={`flex items-center justify-center gap-2 border ${
                showResetConfirm
                  ? "bg-red-900/30 border-red-500/50 hover:bg-red-900/50 text-red-400"
                  : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 hover:border-gray-500"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {showResetConfirm ? "Click again to confirm" : "Reset Progress"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            <p>Backups include all your tasks, stats, and achievements.</p>
            <p className="mt-1">Importing will replace your current progress.</p>
          </div>
        </div>
      )}
    </div>
  );
}
