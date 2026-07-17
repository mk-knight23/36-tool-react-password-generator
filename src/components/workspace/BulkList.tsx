"use client";

import { Download } from "lucide-react";
import { CopyButton } from "@/components/product/CopyButton";
import { downloadText, toTxt, toCsv } from "@/lib/download";
import { track } from "@/lib/analytics";

interface BulkListProps {
  items: string[];
  what: string;
  /** Used for the download filename, e.g. "passwords". */
  fileBase: string;
}

/** A list of bulk-generated secrets with per-item copy, copy-all, and export. */
export function BulkList({ items, what, fileBase }: BulkListProps) {
  const allText = items.join("\n");

  const onDownloadTxt = () => {
    downloadText(`${fileBase}.txt`, toTxt(items), "text/plain");
    track("result_exported", { format: "txt", count: items.length });
  };
  const onDownloadCsv = () => {
    const rows = items.map((v, i) => [String(i + 1), v]);
    downloadText(`${fileBase}.csv`, toCsv(["index", what], rows), "text/csv");
    track("result_exported", { format: "csv", count: items.length });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-fg-muted">
          <span className="font-mono tabular-nums text-fg">{items.length}</span> generated
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <CopyButton value={allText} what={`all ${what}s`} variant="button" />
          <button
            type="button"
            onClick={onDownloadTxt}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-fg hover:bg-surface-sunken active:scale-[0.98]"
          >
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            .txt
          </button>
          <button
            type="button"
            onClick={onDownloadCsv}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-fg hover:bg-surface-sunken active:scale-[0.98]"
          >
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            .csv
          </button>
        </div>
      </div>
      <ul className="max-h-96 divide-y divide-border overflow-y-auto rounded-lg border border-border bg-surface-sunken">
        {items.map((item, i) => (
          <li key={`${i}-${item}`} className="flex items-center gap-2 px-3 py-1.5">
            <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-fg-faint">
              {i + 1}
            </span>
            <span className="flex-1 select-all break-all font-mono text-sm text-fg">{item}</span>
            <CopyButton value={item} what={what} />
          </li>
        ))}
      </ul>
    </div>
  );
}
