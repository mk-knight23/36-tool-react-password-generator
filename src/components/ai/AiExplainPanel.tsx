"use client";

import { useId, useRef, useState } from "react";
import { Sparkles, Info, ShieldAlert, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";
import { AI_TOPICS, type AiTopicId } from "@/lib/ai/topics";
import { MAX_QUESTION_LENGTH } from "@/lib/ai/schema";
import { looksLikeSecret } from "@/lib/ai/secret-guard";
import { requestExplain, type ExplainOutcome, type FallbackReason } from "@/lib/ai/client";
import { useAiQuota, useHasByokKey } from "@/lib/client-hooks";
import { track } from "@/lib/analytics";

const TOPIC_OPTIONS = AI_TOPICS.map((t) => ({ value: t.id, label: t.label }));

const FALLBACK_NOTE: Record<FallbackReason, string> = {
  unavailable: "AI answers are not set up on this instance, so here is the built-in explanation.",
  quota: "You have used today's AI answers. Here is the built-in explanation.",
  rate_limited: "Too many requests just now. Here is the built-in explanation.",
  error: "The AI service could not be reached, so here is the built-in explanation.",
  network: "You appear to be offline, so here is the built-in explanation.",
};

/**
 * Security Q&A panel backed by the single AI route (PRODUCT_SPEC §6). It never
 * sends anything you generate: the optional question is checked locally before
 * sending, and when the AI is unavailable it shows a clearly labeled built-in
 * explanation instead. The password you analyze above is never sent here.
 */
export function AiExplainPanel() {
  const quota = useAiQuota();
  const hasByok = useHasByokKey();
  const [topic, setTopic] = useState<AiTopicId>(AI_TOPICS[0].id);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<ExplainOutcome | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const questionId = useId();

  const guard = question.trim() ? looksLikeSecret(question) : { flagged: false as const };
  const quotaSpent = !hasByok && quota.remaining <= 0;

  const onAsk = async () => {
    if (guard.flagged) return;
    setLoading(true);
    setOutcome(null);
    const controller = new AbortController();
    abortRef.current = controller;
    track("ai_started", { feature: "explain", topic });
    try {
      const result = await requestExplain(
        { topic, question: question.trim() || undefined },
        { signal: controller.signal },
      );
      setOutcome(result);
      if (result.kind === "ai") track("ai_completed", { feature: "explain", topic });
      else if (result.kind === "fallback") track("ai_failed", { feature: "explain", reason: result.reason });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const onCancel = () => {
    abortRef.current?.abort();
  };

  return (
    <Card as="section" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-fg">Ask about password security</h2>
        </div>
        {!hasByok ? (
          <span className="font-mono text-xs tabular-nums text-fg-muted" aria-live="polite">
            {quota.remaining}/{quota.limit} AI answers left today
          </span>
        ) : (
          <span className="text-xs text-fg-muted">Using your own key</span>
        )}
      </div>

      <p className="text-sm text-fg-muted">
        General questions only. Answers are AI-generated guidance, not a rule for
        your specific situation. Never paste a real password or secret here — the
        box is checked locally and a secret-looking value is never sent.
      </p>

      <SelectField
        label="Topic"
        value={topic}
        onChange={(v) => setTopic(v)}
        options={TOPIC_OPTIONS}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={questionId} className="text-sm font-medium text-fg">
          Your question <span className="font-normal text-fg-muted">(optional)</span>
        </label>
        <textarea
          id={questionId}
          value={question}
          maxLength={MAX_QUESTION_LENGTH}
          rows={2}
          onChange={(e) => setQuestion(e.target.value)}
          aria-invalid={guard.flagged ? true : undefined}
          aria-describedby={guard.flagged ? `${questionId}-warn` : undefined}
          placeholder="e.g. Is a 16-character minimum enough for my team?"
          className="resize-y rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-faint focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        />
        <div className="flex items-center justify-between gap-2">
          {guard.flagged ? (
            <p id={`${questionId}-warn`} role="alert" className="flex items-center gap-1.5 text-xs text-danger">
              <ShieldAlert size={14} strokeWidth={1.75} aria-hidden="true" />
              That looks like a secret. Ask about the concept instead — it will not be sent.
            </p>
          ) : (
            <span className="text-xs text-fg-muted">Uses the topic above if left blank.</span>
          )}
          <span className="shrink-0 font-mono text-xs tabular-nums text-fg-faint">
            {question.length}/{MAX_QUESTION_LENGTH}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {loading ? (
          <>
            <Button variant="primary" loading disabled>
              Thinking
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X size={16} strokeWidth={1.75} aria-hidden="true" />
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => void onAsk()} disabled={guard.flagged}>
            <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
            {quotaSpent ? "Show built-in explanation" : "Explain"}
          </Button>
        )}
      </div>

      {outcome ? <Outcome outcome={outcome} /> : null}
    </Card>
  );
}

function Outcome({ outcome }: { outcome: ExplainOutcome }) {
  if (outcome.kind === "canceled") {
    return <p className="text-sm text-fg-muted">Canceled.</p>;
  }
  if (outcome.kind === "refused") {
    return (
      <div role="alert" className="flex items-start gap-2 rounded-md border border-danger/40 bg-surface-sunken p-3 text-sm text-fg">
        <ShieldAlert size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
        <span>{outcome.message}</span>
      </div>
    );
  }

  const isAi = outcome.kind === "ai";
  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
          {isAi ? "AI answer" : "Built-in explanation"}
        </span>
        {isAi && outcome.model ? (
          <span className="font-mono text-xs text-fg-faint">{outcome.model}</span>
        ) : null}
      </div>
      {!isAi && outcome.kind === "fallback" ? (
        <p className="flex items-start gap-1.5 text-xs text-fg-muted">
          <Info size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
          {FALLBACK_NOTE[outcome.reason]}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 text-sm leading-relaxed text-fg">
        {outcome.answer.split(/\n{2,}/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
