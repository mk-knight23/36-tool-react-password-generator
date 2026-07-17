/**
 * Clipboard helpers with best-effort auto-clear (PRODUCT_SPEC 5.12).
 *
 * Honest limits (surfaced in the UI): clearing only works while this page is
 * open and focused, and OS-level clipboard-history tools may still retain a
 * copy. We never claim more than that.
 */

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Schedule a clipboard wipe after `delaySeconds`. Returns a cancel function.
 * A delay of 0 disables auto-clear (returns a no-op canceller).
 */
export function scheduleClipboardClear(
  delaySeconds: number,
  onCleared?: () => void,
): () => void {
  if (delaySeconds <= 0 || typeof window === "undefined") {
    return () => {};
  }
  const timer = window.setTimeout(async () => {
    if (
      typeof document !== "undefined" &&
      document.hasFocus() &&
      navigator.clipboard
    ) {
      try {
        await navigator.clipboard.writeText("");
      } catch {
        // best effort — nothing more we can safely do
      }
    }
    onCleared?.();
  }, delaySeconds * 1000);
  return () => window.clearTimeout(timer);
}

// A single active auto-clear timer at a time. Copying a second secret cancels
// the first pending wipe so we never clear a fresh copy prematurely.
let activeCancel: (() => void) | null = null;

/**
 * Arm the clipboard auto-clear, cancelling any previously armed clear. Returns
 * the number of seconds until the wipe (0 when auto-clear is disabled).
 */
export function armClipboardAutoClear(
  delaySeconds: number,
  onCleared?: () => void,
): number {
  if (activeCancel) {
    activeCancel();
    activeCancel = null;
  }
  if (delaySeconds <= 0) return 0;
  activeCancel = scheduleClipboardClear(delaySeconds, () => {
    activeCancel = null;
    onCleared?.();
  });
  return delaySeconds;
}
