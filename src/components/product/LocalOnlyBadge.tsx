"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { BoundaryDiagram } from "./BoundaryDiagram";

/**
 * The LOCAL-ONLY stamp (DESIGN_SYSTEM.md §8.4). A single component reused
 * everywhere a generator title appears; clicking it opens the boundary diagram
 * so the claim is always one tap from its proof.
 */
export function LocalOnlyBadge() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-sm border border-success px-1.5 py-0.5 text-xs font-medium uppercase tracking-[0.06em] text-success transition-colors duration-fast ease-enter hover:bg-[color-mix(in_srgb,var(--success)_12%,transparent)]"
      >
        <ShieldCheck size={14} strokeWidth={1.75} aria-hidden="true" />
        Local only
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="How local-only generation works"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-fg-muted">
            Everything you generate is produced in your browser and stays on your
            device. Here is exactly where the boundary sits:
          </p>
          <BoundaryDiagram />
          <p className="text-sm text-fg-muted">
            You can verify this yourself: open your browser&apos;s network tab and
            generate a few secrets. You will see no requests carrying any of them.
          </p>
        </div>
      </Modal>
    </>
  );
}
