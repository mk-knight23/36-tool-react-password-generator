"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // No secret material is ever passed to error boundaries; logging the
    // message is safe. Kept to the browser console only.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <AlertTriangle size={40} strokeWidth={1.75} className="text-danger" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-fg">Something went wrong</h1>
        <p className="text-base text-fg-muted">
          The page hit an unexpected error. Your data stays on this device — nothing was
          sent anywhere. You can try again or head back to the generator.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="primary" onClick={reset}>
          <RotateCw size={16} strokeWidth={1.75} aria-hidden="true" />
          Try again
        </Button>
        <Link
          href="/generate"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-sunken"
        >
          Go to the generator
        </Link>
      </div>
    </div>
  );
}
