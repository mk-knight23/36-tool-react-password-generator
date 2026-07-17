import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      className="mx-auto flex max-w-6xl items-center justify-center px-4 py-32 sm:px-6"
      role="status"
      aria-live="polite"
    >
      <Loader2
        size={24}
        strokeWidth={1.75}
        className="animate-spin text-accent"
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </div>
  );
}
