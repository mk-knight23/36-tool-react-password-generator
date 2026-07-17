"use client";

import { useSyncExternalStore } from "react";
import { Printer, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/client-hooks";
import {
  EMPTY_CHECKED,
  getCheckedSnapshot,
  subscribeChecked,
  toggleChecked,
  resetChecked,
  type CheckedMap,
} from "@/lib/checklist-state";
import { CHECKLISTS, POLICY_TEMPLATES } from "@/content/checklists";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/product/CopyButton";

function useChecked(): CheckedMap {
  const hydrated = useHydrated();
  const checked = useSyncExternalStore(
    subscribeChecked,
    getCheckedSnapshot,
    () => EMPTY_CHECKED,
  );
  // Until hydration, render everything unchecked so server and first client
  // paint match; the persisted state appears once the client takes over.
  return hydrated ? checked : EMPTY_CHECKED;
}

/**
 * Interactive checklists with local check-off (persisted, non-secret) plus the
 * copy-to-use policy templates. The whole checklist region is a `.print-sheet`
 * so the browser print produces a clean black-on-white sheet with no nav,
 * footer, or controls (PRODUCT_SPEC §5.14 / §5.8 print rules).
 */
export function ChecklistsView() {
  const checked = useChecked();

  return (
    <div className="flex flex-col gap-12">
      <div className="print-sheet flex flex-col gap-8">
        <div className="hidden print:block">
          <p className="font-mono text-sm">
            MK VaultPass — security checklists · vaultpass.mkazi.live
          </p>
        </div>

        {CHECKLISTS.map((list) => {
          const doneCount = list.items.filter((item) => checked[item.id]).length;
          return (
            <Card as="section" key={list.id} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-fg">{list.title}</h2>
                  <p className="mt-1 text-sm text-fg-muted">{list.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-sm tabular-nums text-fg-muted"
                    aria-label={`${doneCount} of ${list.items.length} done`}
                  >
                    {doneCount}/{list.items.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => resetChecked(list.items.map((item) => item.id))}
                    disabled={doneCount === 0}
                    className="no-print inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-md px-2 text-sm text-fg-muted transition-colors duration-fast ease-enter hover:bg-surface-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
                    Reset
                  </button>
                </div>
              </div>

              <ul className="flex flex-col gap-1">
                {list.items.map((item) => {
                  const isChecked = Boolean(checked[item.id]);
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-md p-2 transition-colors duration-fast ease-enter hover:bg-surface-sunken">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleChecked(item.id)}
                          className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer rounded-xs border-border-strong accent-accent"
                        />
                        <span
                          className={cn(
                            "text-sm leading-relaxed",
                            isChecked ? "text-fg-muted line-through" : "text-fg",
                          )}
                        >
                          {item.text}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>

      <div className="no-print flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer size={16} strokeWidth={1.75} aria-hidden="true" />
          Print checklists
        </Button>
        <p className="text-sm text-fg-muted">
          Ticks are saved only in this browser. Nothing is sent anywhere.
        </p>
      </div>

      <section className="no-print flex flex-col gap-4 border-t border-border pt-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-fg">
            Policy templates
          </h2>
          <p className="mt-1 max-w-2xl text-fg-muted">
            Plain starting points you can copy and adapt. They make no compliance
            claims — a policy is only real once you have adopted and enforced it.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {POLICY_TEMPLATES.map((template) => (
            <Card as="article" key={template.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-fg">{template.title}</h3>
                  <p className="mt-1 text-sm text-fg-muted">{template.description}</p>
                </div>
                <CopyButton value={template.body} what="template" variant="button" />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-surface-sunken p-4 font-mono text-sm text-fg">
                {template.body}
              </pre>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
