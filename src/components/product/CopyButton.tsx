"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/cn";
import { copyToClipboard, armClipboardAutoClear } from "@/lib/copy";
import { loadSettings } from "@/lib/settings";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/analytics";

interface CopyButtonProps {
  value: string;
  /** What is being copied, for the accessible label, e.g. "password". */
  what?: string;
  variant?: "button" | "icon";
  className?: string;
  onCopyCallback?: () => void;
}

/**
 * Copies a secret to the clipboard, shows an honest auto-clear toast, and arms a
 * best-effort clipboard wipe based on the user's Settings delay. The secret is
 * never logged or sent anywhere — only written to the clipboard.
 */
export function CopyButton({ value, what = "value", variant = "icon", className, onCopyCallback }: CopyButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const onCopy = async () => {
    const ok = await copyToClipboard(value);
    if (!ok) {
      toast("Could not access the clipboard in this browser.", "error");
      return;
    }
    setCopied(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1400);

    const delay = loadSettings().autoClearDelay;
    const armed = armClipboardAutoClear(delay);
    toast(
      armed > 0
        ? `Copied. Clearing the clipboard in ${armed}s (best effort — see limits).`
        : "Copied to the clipboard.",
      "success",
    );
    track("result_copied", { what });
    if (onCopyCallback) onCopyCallback();
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onCopy}
        className={cn(
          "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium text-fg transition-colors duration-fast ease-enter hover:bg-surface-sunken active:scale-[0.98]",
          className,
        )}
      >
        {copied ? (
          <Check size={16} strokeWidth={1.75} className="text-success" aria-hidden="true" />
        ) : (
          <Copy size={16} strokeWidth={1.75} aria-hidden="true" />
        )}
        {copied ? "Copied" : "Copy"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? `${what} copied` : `Copy ${what}`}
      title={copied ? "Copied" : "Copy"}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors duration-fast ease-enter hover:bg-surface-sunken hover:text-fg active:scale-[0.98]",
        className,
      )}
    >
      {copied ? (
        <Check size={18} strokeWidth={1.75} className="text-success" aria-hidden="true" />
      ) : (
        <Copy size={18} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}
