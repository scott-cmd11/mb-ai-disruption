"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  AssessmentInput,
  AssessmentResult,
  BusinessSize,
  AIAdoptionStatus,
  TaskCategory,
  Industry,
  Occupation,
  SectorPlaybook,
  ThreatScenario,
} from "@/types";
import { computeAssessment } from "@/lib/scoring";
import { ResultsClient } from "./ResultsClient";

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 6;

const TASK_LABELS: Record<TaskCategory, string> = {
  data_processing: "Data Processing",
  content_creation: "Content Creation",
  customer_service: "Customer Service",
  physical_manual: "Physical / Manual",
  decision_making: "Decision Making",
  creative_design: "Creative Design",
  coordination: "Coordination",
  technical_analysis: "Technical Analysis",
};

const TASK_DESCRIPTIONS: Record<TaskCategory, string> = {
  data_processing: "Entering, analysing, or reporting on data",
  content_creation: "Writing, editing, or publishing content",
  customer_service: "Responding to customer inquiries or support",
  physical_manual: "Operating equipment, trades, or hands-on work",
  decision_making: "Strategy, planning, and executive judgement",
  creative_design: "Visual design, UX, or creative production",
  coordination: "Scheduling, logistics, or project management",
  technical_analysis: "Research, engineering, or technical review",
};

const ALL_TASKS: TaskCategory[] = Object.keys(TASK_LABELS) as TaskCategory[];

// ── Step Validation ───────────────────────────────────────────────────────────

function isStepValid(draft: Partial<AssessmentInput>, step: number): boolean {
  switch (step) {
    case 0: return !!draft.naicsCode;
    case 1: return !!draft.businessSize;
    case 2: return !!draft.aiAdoptionStatus;
    case 3: return (draft.primaryTasks?.length ?? 0) >= 1;
    case 4: {
      const sum = (draft.knowledgeWorkerPct ?? 0) + (draft.manualWorkerPct ?? 0) + (draft.customerFacingPct ?? 0);
      return sum <= 100;
    }
    case 5: return !!draft.customerModel;
    default: return false;
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

// Step indicator
function StepIndicator({ step }: { step: number }) {
  const labels = ["Industry", "Size", "Adoption", "Activities", "Workforce", "Model"];
  return (
    <div className="flex items-center justify-center mb-10 gap-0">
      {labels.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold transition-colors"
                style={{
                  backgroundColor: done
                    ? "var(--color-gold)"
                    : active
                    ? "var(--color-navy)"
                    : "var(--color-border)",
                  color: done || active ? "var(--color-text-inverse)" : "var(--color-text-tertiary)",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="text-[0.55rem] tracking-[0.12em] uppercase hidden sm:block"
                style={{ color: active ? "var(--color-navy)" : "var(--color-text-tertiary)" }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                className="w-8 sm:w-12 h-px mb-5 mx-1"
                style={{ backgroundColor: i < step ? "var(--color-gold)" : "var(--color-border)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Reusable step header
function StepHeader({ label, heading }: { label: string; heading: string }) {
  return (
    <div className="mb-6">
      <p className="text-[0.6rem] tracking-[0.2em] uppercase font-bold mb-1" style={{ color: "var(--color-gold)" }}>
        {label}
      </p>
      <h2 className="font-display text-2xl font-light italic" style={{ color: "var(--color-text-primary)" }}>
        {heading}
      </h2>
    </div>
  );
}

// Radio card
function RadioCard({
  value,
  selected,
  onSelect,
  title,
  desc,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc?: string;
}) {
  return (
    <label
      className="flex flex-col gap-1 rounded-sm border cursor-pointer p-4 transition-colors"
      style={{
        borderColor: selected ? "var(--color-navy)" : "var(--color-border)",
        borderLeftWidth: selected ? "3px" : "1px",
        borderLeftColor: selected ? "var(--color-gold)" : "var(--color-border)",
        backgroundColor: selected ? "var(--color-gold-pale)" : "var(--color-surface)",
      }}
    >
      <input type="radio" className="sr-only" checked={selected} onChange={onSelect} value={value} />
      <span className="font-display text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </span>
      {desc && (
        <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
          {desc}
        </span>
      )}
    </label>
  );
}

// Checkbox tile
function CheckboxTile({
  value,
  checked,
  onToggle,
  title,
  desc,
}: {
  value: TaskCategory;
  checked: boolean;
  onToggle: () => void;
  title: string;
  desc: string;
}) {
  return (
    <label
      className="relative flex flex-col gap-1 rounded-sm border cursor-pointer p-4 transition-colors"
      style={{
        borderColor: checked ? "var(--color-navy)" : "var(--color-border)",
        borderLeftWidth: checked ? "3px" : "1px",
        borderLeftColor: checked ? "var(--color-gold)" : "var(--color-border)",
        backgroundColor: checked ? "var(--color-gold-pale)" : "var(--color-surface)",
      }}
    >
      <input type="checkbox" className="sr-only" checked={checked} onChange={onToggle} />
      {checked && (
        <span
          className="absolute top-2 right-2 text-[0.65rem] font-bold w-4 h-4 flex items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-gold)", color: "var(--color-navy-deep)" }}
        >
          ✓
        </span>
      )}
      <span className="font-display text-sm font-semibold pr-4" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </span>
      <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
        {desc}
      </span>
    </label>
  );
}

// Slider row
function SliderRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const pct = value;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
          {label}
        </span>
        <span className="font-mono tabular-nums text-sm font-semibold" style={{ color: "var(--color-navy)" }}>
          {pct}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-navy) 0%, var(--color-navy) ${pct}%, var(--color-border) ${pct}%, var(--color-border) 100%)`,
        }}
      />
    </div>
  );
}

// ── Step Bodies ───────────────────────────────────────────────────────────────

function Step1Industry({
  industries,
  draft,
  update,
}: {
  industries: Industry[];
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = industries.filter(
    (i) =>
      i.sector.toLowerCase().includes(query.toLowerCase()) ||
      i.shortName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 1 of 6" heading="What industry is your business in?" />
      <input
        type="text"
        placeholder="Search sectors…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-sm px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--color-navy)]"
        style={{
          borderColor: "var(--color-border-strong)",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-body)",
        }}
      />
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
        {filtered.map((ind) => (
          <label
            key={ind.naicsCode}
            className="flex items-center justify-between rounded-sm border cursor-pointer px-4 py-3 transition-colors"
            style={{
              borderColor: draft.naicsCode === ind.naicsCode ? "var(--color-navy)" : "var(--color-border)",
              borderLeftWidth: draft.naicsCode === ind.naicsCode ? "3px" : "1px",
              borderLeftColor: draft.naicsCode === ind.naicsCode ? "var(--color-gold)" : "var(--color-border)",
              backgroundColor: draft.naicsCode === ind.naicsCode ? "var(--color-gold-pale)" : "var(--color-surface)",
            }}
          >
            <input
              type="radio"
              className="sr-only"
              checked={draft.naicsCode === ind.naicsCode}
              onChange={() => update({ naicsCode: ind.naicsCode })}
            />
            <span className="text-sm" style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-body)" }}>
              {ind.shortName}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Step2BusinessSize({
  draft,
  update,
}: {
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const options: { value: BusinessSize; title: string; desc: string }[] = [
    { value: "micro", title: "Micro", desc: "1–9 employees" },
    { value: "small", title: "Small", desc: "10–49 employees" },
    { value: "medium", title: "Medium", desc: "50–249 employees" },
    { value: "large", title: "Large", desc: "250+ employees" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 2 of 6" heading="How large is your business?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <RadioCard
            key={o.value}
            value={o.value}
            selected={draft.businessSize === o.value}
            onSelect={() => update({ businessSize: o.value })}
            title={o.title}
            desc={o.desc}
          />
        ))}
      </div>
    </div>
  );
}

function Step3AIAdoption({
  draft,
  update,
}: {
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const options: { value: AIAdoptionStatus; title: string; desc: string }[] = [
    { value: "not_considering", title: "Not considering AI", desc: "We haven't started thinking about AI adoption" },
    { value: "exploring", title: "Exploring AI tools", desc: "We're researching or piloting AI, but not yet integrated" },
    { value: "using", title: "Actively using AI", desc: "AI tools are part of our regular workflows" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 3 of 6" heading="Where is your business on AI adoption?" />
      <div className="flex flex-col gap-3">
        {options.map((o) => (
          <RadioCard
            key={o.value}
            value={o.value}
            selected={draft.aiAdoptionStatus === o.value}
            onSelect={() => update({ aiAdoptionStatus: o.value })}
            title={o.title}
            desc={o.desc}
          />
        ))}
      </div>
    </div>
  );
}

function Step4PrimaryTasks({
  draft,
  update,
}: {
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const selected = draft.primaryTasks ?? [];
  const toggle = (task: TaskCategory) => {
    const next = selected.includes(task)
      ? selected.filter((t) => t !== task)
      : [...selected, task];
    update({ primaryTasks: next });
  };
  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 4 of 6" heading="What does your business primarily do?" />
      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Select all that apply.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALL_TASKS.map((task) => (
          <CheckboxTile
            key={task}
            value={task}
            checked={selected.includes(task)}
            onToggle={() => toggle(task)}
            title={TASK_LABELS[task]}
            desc={TASK_DESCRIPTIONS[task]}
          />
        ))}
      </div>
    </div>
  );
}

function Step5Workforce({
  draft,
  update,
}: {
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const kw = draft.knowledgeWorkerPct ?? 33;
  const mw = draft.manualWorkerPct ?? 33;
  const cf = draft.customerFacingPct ?? 34;
  const total = kw + mw + cf;
  const over = total > 100;

  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 5 of 6" heading="Describe your workforce composition." />
      <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
        Approximate percentages — overlaps are fine. Use these to reflect the primary nature of your roles.
      </p>
      <div className="flex flex-col gap-6">
        <SliderRow label="Knowledge workers (office, analysis, admin)" value={kw} onChange={(v) => update({ knowledgeWorkerPct: v })} />
        <SliderRow label="Manual / physical workers (trades, operations)" value={mw} onChange={(v) => update({ manualWorkerPct: v })} />
        <SliderRow label="Customer-facing workers (sales, service, hospitality)" value={cf} onChange={(v) => update({ customerFacingPct: v })} />
      </div>
      <div
        className="flex items-center justify-between rounded-sm border px-4 py-2 text-xs"
        style={{
          borderColor: over ? "var(--color-risk-high-border)" : "var(--color-border)",
          backgroundColor: over ? "var(--color-risk-high-bg)" : "var(--color-paper-deep)",
        }}
      >
        <span style={{ color: over ? "var(--color-risk-high)" : "var(--color-text-secondary)" }}>
          {over ? "Total exceeds 100% — please review." : "Totals may overlap — that's expected."}
        </span>
        <span
          className="font-mono tabular-nums font-semibold"
          style={{ color: over ? "var(--color-risk-high)" : "var(--color-text-primary)" }}
        >
          {total}%
        </span>
      </div>
    </div>
  );
}

function Step6CustomerModel({
  draft,
  update,
}: {
  draft: Partial<AssessmentInput>;
  update: (p: Partial<AssessmentInput>) => void;
}) {
  const options: { value: AssessmentInput["customerModel"]; title: string; desc: string }[] = [
    { value: "b2b", title: "Business-to-Business", desc: "We primarily sell to other businesses" },
    { value: "b2c", title: "Business-to-Consumer", desc: "We primarily sell directly to individuals" },
    { value: "both", title: "Both B2B and B2C", desc: "We serve a mix of business and consumer customers" },
    { value: "government", title: "Government / Public Sector", desc: "Our primary customer is a government or public body" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <StepHeader label="Step 6 of 6" heading="Who are your primary customers?" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((o) => (
          <RadioCard
            key={o.value}
            value={o.value}
            selected={draft.customerModel === o.value}
            onSelect={() => update({ customerModel: o.value })}
            title={o.title}
            desc={o.desc}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

export function CalculatorClient({
  industries,
  occupations,
  playbooks,
  threatScenarios,
  initialInput,
}: {
  industries: Industry[];
  occupations: Occupation[];
  playbooks: SectorPlaybook[];
  threatScenarios: ThreatScenario[];
  initialInput?: AssessmentInput;
}) {
  const [draft, setDraft] = useState<Partial<AssessmentInput>>(initialInput ?? {
    knowledgeWorkerPct: 33,
    manualWorkerPct: 33,
    customerFacingPct: 34,
  });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  // If initialInput was provided, compute result immediately
  const initialResult = useMemo(() => {
    if (!initialInput) return null;
    const industry = industries.find((i) => i.naicsCode === initialInput.naicsCode);
    if (!industry) return null;
    const relevantOccupations = occupations.filter((o) =>
      o.naicsSectors.includes(initialInput.naicsCode)
    );
    try {
      return computeAssessment(initialInput, industry, relevantOccupations);
    } catch {
      return null;
    }
  }, [initialInput, industries, occupations]);

  // Show results immediately if we have a decoded URL result
  const activeResult = result ?? initialResult;

  const update = useCallback((patch: Partial<AssessmentInput>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleSubmit = () => {
    const input = draft as AssessmentInput;
    const industry = industries.find((i) => i.naicsCode === input.naicsCode);
    if (!industry) return;
    const relevantOccupations = occupations.filter((o) =>
      o.naicsSectors.includes(input.naicsCode)
    );
    const assessment = computeAssessment(input, industry, relevantOccupations);

    // Encode into URL for sharing
    const encoded = btoa(JSON.stringify(input));
    const url = new URL(window.location.href);
    url.searchParams.set("r", encoded);
    window.history.replaceState(null, "", url.toString());

    setResult(assessment);
  };

  const handleReset = () => {
    setResult(null);
    setDraft({ knowledgeWorkerPct: 33, manualWorkerPct: 33, customerFacingPct: 34 });
    setStep(0);
    const url = new URL(window.location.href);
    url.searchParams.delete("r");
    window.history.replaceState(null, "", url.toString());
  };

  if (activeResult) {
    const activeIndustry = industries.find((i) => i.naicsCode === activeResult.input.naicsCode);
    return (
      <ResultsClient
        result={activeResult}
        industryName={activeIndustry?.shortName ?? "Your sector"}
        industry={activeIndustry}
        playbook={playbooks.find((p) => p.naicsCode === activeResult.input.naicsCode)}
        threatScenario={threatScenarios.find((s) => s.relevantNaicsCodes.includes(activeResult.input.naicsCode))}
        onReset={handleReset}
      />
    );
  }

  const valid = isStepValid(draft, step);

  return (
    <div className="mx-auto max-w-2xl px-4">
      {/* Page heading */}
      <div className="mb-8 text-center">
        <p className="text-[0.6rem] tracking-[0.25em] uppercase font-bold mb-2" style={{ color: "var(--color-gold)" }}>
          Province of Manitoba
        </p>
        <h1 className="font-display text-3xl font-light italic" style={{ color: "var(--color-text-primary)" }}>
          AI Disruption Assessment
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-body)" }}>
          6 questions · takes about 2 minutes
        </p>
      </div>

      <StepIndicator step={step} />

      {/* Form card */}
      <div
        className="rounded-sm border p-6 sm:p-8"
        style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {step === 0 && <Step1Industry industries={industries} draft={draft} update={update} />}
        {step === 1 && <Step2BusinessSize draft={draft} update={update} />}
        {step === 2 && <Step3AIAdoption draft={draft} update={update} />}
        {step === 3 && <Step4PrimaryTasks draft={draft} update={update} />}
        {step === 4 && <Step5Workforce draft={draft} update={update} />}
        {step === 5 && <Step6CustomerModel draft={draft} update={update} />}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide border transition-colors disabled:opacity-30"
            style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text-secondary)" }}
          >
            ← Back
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!valid}
              className="inline-flex items-center rounded-sm px-6 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--color-navy)", color: "var(--color-text-inverse)" }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!valid}
              className="inline-flex items-center rounded-sm px-6 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:opacity-40"
              style={{ backgroundColor: "var(--color-navy)", color: "var(--color-text-inverse)" }}
            >
              View My Results →
            </button>
          )}
        </div>
      </div>

      {/* Progress note */}
      <p className="mt-4 text-center text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        Step {step + 1} of {TOTAL_STEPS}
      </p>
    </div>
  );
}
