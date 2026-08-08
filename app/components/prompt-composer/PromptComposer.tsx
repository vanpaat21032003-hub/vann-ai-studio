"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { PromptCopyButton } from "@/app/components/prompt-presets/PromptCopyButton";
import { Card } from "@/app/components/ui/Card";
import { composePrompt } from "@/lib/prompt-composer/compose";
import type { ModelRecord } from "@/lib/models/schema";
import type { ProductRecord } from "@/lib/products/schema";
import type { PromptPresetRecord } from "@/lib/prompt-presets/schema";
import type { StyleRecord } from "@/lib/styles/schema";

type PromptComposerProps = {
  models: ModelRecord[];
  presets: PromptPresetRecord[];
  products: ProductRecord[];
  styles: StyleRecord[];
};

const selectClassName =
  "min-h-12 w-full rounded-control border border-border-soft bg-app/70 px-4 py-3 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60";

function SelectField({
  emptyHref,
  emptyLabel,
  id,
  label,
  onChange,
  options,
  placeholder,
  value,
}: {
  emptyHref: string;
  emptyLabel: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: Array<{ id: string; name: string }>;
  placeholder: string;
  value: string;
}) {
  const isEmpty = options.length === 0;

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-text-primary" htmlFor={id}>
        {label}
      </label>
      <select
        className={selectClassName}
        disabled={isEmpty}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">{isEmpty ? `No ${label.toLowerCase()} available` : placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {isEmpty ? (
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Add one in the{" "}
          <Link className="font-medium text-accent-cyan hover:underline" href={emptyHref}>
            {emptyLabel}
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

export function PromptComposer({ models, presets, products, styles }: PromptComposerProps) {
  const [productId, setProductId] = useState("");
  const [modelId, setModelId] = useState("");
  const [styleId, setStyleId] = useState("");
  const [presetId, setPresetId] = useState("");

  const product = products.find((record) => record.id === productId);
  const model = models.find((record) => record.id === modelId);
  const style = styles.find((record) => record.id === styleId);
  const preset = presets.find((record) => record.id === presetId);
  const prompt = useMemo(
    () => (product && model && style && preset ? composePrompt({ product, model, style, preset }) : null),
    [model, preset, product, style],
  );
  const remaining = [
    !product && "a product",
    !model && "a model",
    !style && "a style",
    !preset && "a prompt preset",
  ].filter(Boolean);

  return (
    <div className="mt-[var(--space-section)] grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <Card className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">Select creative direction</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">Choose one available record from each library. Nothing is saved from this page.</p>
        <div className="mt-6 grid gap-5">
          <SelectField emptyHref="/fashion-studio/products" emptyLabel="Product Library" id="composer-product" label="Product" onChange={setProductId} options={products.map((product) => ({ id: product.id, name: product.title }))} placeholder="Select a product" value={productId} />
          <SelectField emptyHref="/fashion-studio/models" emptyLabel="Model Library" id="composer-model" label="Model" onChange={setModelId} options={models.map((model) => ({ id: model.id, name: model.name }))} placeholder="Select a model" value={modelId} />
          <SelectField emptyHref="/fashion-studio/styles" emptyLabel="Style Library" id="composer-style" label="Style" onChange={setStyleId} options={styles.map((style) => ({ id: style.id, name: style.name }))} placeholder="Select a style" value={styleId} />
          <SelectField emptyHref="/fashion-brain/presets" emptyLabel="Prompt Presets Library" id="composer-preset" label="Prompt preset" onChange={setPresetId} options={presets.map((preset) => ({ id: preset.id, name: preset.title }))} placeholder="Select a prompt preset" value={presetId} />
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-cyan">Deterministic output</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-text-primary">Final Prompt</h2>
          </div>
          {prompt ? <PromptCopyButton prompt={prompt} /> : null}
        </div>
        {prompt ? (
          <pre className="mt-6 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-control border border-border-soft bg-app/70 p-4 font-sans text-sm leading-6 text-text-primary">{prompt}</pre>
        ) : (
          <div className="mt-6 rounded-control border border-dashed border-border-strong bg-surface-soft p-5">
            <p className="font-semibold text-text-primary">Your prompt will appear here.</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Select {remaining.join(", ").replace(/, ([^,]*)$/, " and $1")} to compose a final prompt.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
