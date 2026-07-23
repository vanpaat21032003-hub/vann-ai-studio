"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";

import { createModel, updateModel } from "@/lib/models/actions";
import {
  getDefaultHeight,
  HEIGHT_MAX,
  HEIGHT_MIN,
  tagsToDisplay,
  type ModelActionState,
  type ModelEditableRecord,
} from "@/lib/models/schema";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";

type ModelFormProps = {
  mode: "create" | "edit";
  model?: ModelEditableRecord;
};

type ModelFormAction = (
  state: ModelActionState,
  formData: FormData,
) => Promise<ModelActionState>;

const initialState: ModelActionState = { error: null };

const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
] as const;

type GenderValue = "female" | "male";

function isGenderValue(value: string): value is GenderValue {
  return value === "female" || value === "male";
}

export function ModelForm({ mode, model }: ModelFormProps) {
  const boundUpdate = model?.id ? updateModel.bind(null, model.id) : undefined;
  const action: ModelFormAction =
    mode === "create" ? createModel : boundUpdate!;
  const [state, formAction, pending] = useActionState(action, initialState);

  // -------------------------------------------------------------------------
  // Gender and height default logic (deterministic state initialization)
  //
  // - Create mode: gender defaults to female, height defaults to 170.
  // - Edit mode with non-null height: height is pre-filled and considered manually established.
  // - Edit mode with null height: height starts empty and receives gender defaults until manually edited.
  // -------------------------------------------------------------------------

  const initialGender =
    model?.gender && isGenderValue(model.gender) ? model.gender : "female";
  const [gender, setGender] = useState<GenderValue>(initialGender);

  const initialHeight =
    mode === "create"
      ? String(getDefaultHeight("female"))
      : model?.height != null
        ? String(Math.round(model.height))
        : "";

  const [heightValue, setHeightValue] = useState<string>(initialHeight);

  // Whether height has been manually edited. Initialized to true if edit mode with non-null height.
  const userEditedHeight = useRef(mode === "edit" && model?.height != null);

  function handleGenderChange(newGender: GenderValue) {
    setGender(newGender);
    if (!userEditedHeight.current) {
      setHeightValue(String(getDefaultHeight(newGender)));
    }
  }

  function handleHeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    userEditedHeight.current = true;
    setHeightValue(e.target.value);
  }

  const nameError = state.fieldErrors?.name;
  const heightError = state.fieldErrors?.height;
  const cancelHref = model
    ? `/fashion-studio/models/${model.id}`
    : "/fashion-studio/models";

  const selectClass =
    "min-h-12 w-full appearance-none rounded-control border border-border-soft bg-app/70 py-3 pr-12 pl-4 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <Card className="mt-[var(--space-section)]">
      <form action={formAction} className="space-y-6 p-5 sm:p-7">
        {/* Name — required */}
        <div>
          <label
            className="mb-2 block text-sm font-medium text-text-primary"
            htmlFor="model-name"
          >
            Model name
            <span aria-hidden="true" className="ml-1 text-accent-cyan">
              *
            </span>
          </label>
          <Input
            aria-describedby={nameError ? "model-name-error" : undefined}
            aria-required="true"
            autoFocus
            defaultValue={model?.name ?? ""}
            disabled={pending}
            error={Boolean(nameError)}
            id="model-name"
            name="name"
            placeholder="e.g. Studio Muse A"
            required
          />
          {nameError ? (
            <p className="mt-2 text-sm text-accent-danger" id="model-name-error">
              {nameError}
            </p>
          ) : null}
        </div>

        {/* Gender + Height row */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Gender */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-gender"
            >
              Gender
            </label>
            <div className="relative">
              <select
                className={selectClass}
                disabled={pending}
                id="model-gender"
                name="gender"
                value={gender}
                onChange={(e) => {
                  if (isGenderValue(e.target.value)) {
                    handleGenderChange(e.target.value);
                  }
                }}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="m8 10 4 4 4-4"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
          </div>

          {/* Target height */}
          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-height"
            >
              Target height (cm)
            </label>
            <Input
              aria-describedby={
                heightError ? "model-height-error" : "model-height-hint"
              }
              disabled={pending}
              error={Boolean(heightError)}
              id="model-height"
              inputMode="numeric"
              min={HEIGHT_MIN}
              max={HEIGHT_MAX}
              name="height"
              pattern="[0-9]*"
              placeholder={`${HEIGHT_MIN}–${HEIGHT_MAX}`}
              type="text"
              value={heightValue}
              onChange={handleHeightChange}
            />
            {heightError ? (
              <p
                className="mt-2 text-sm text-accent-danger"
                id="model-height-error"
              >
                {heightError}
              </p>
            ) : (
              <p
                className="mt-2 text-xs text-text-muted"
                id="model-height-hint"
              >
                Target AI-character height in centimetres ({HEIGHT_MIN}–
                {HEIGHT_MAX} cm). Default updates with gender until you edit it.
              </p>
            )}
          </div>
        </div>

        {/* Optional text fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-body-type"
            >
              Body type
            </label>
            <Input
              defaultValue={model?.body_type ?? ""}
              disabled={pending}
              id="model-body-type"
              name="body_type"
              placeholder="e.g. Slim, Athletic, Curvy"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-style"
            >
              Style
            </label>
            <Input
              defaultValue={model?.style ?? ""}
              disabled={pending}
              id="model-style"
              name="style"
              placeholder="e.g. Casual, Streetwear, Editorial"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-pose"
            >
              Pose
            </label>
            <Input
              defaultValue={model?.pose ?? ""}
              disabled={pending}
              id="model-pose"
              name="pose"
              placeholder="e.g. Standing, Walking, Sitting"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-text-primary"
              htmlFor="model-tags"
            >
              Tags
            </label>
            <Input
              defaultValue={model ? tagsToDisplay(model.tags) : ""}
              disabled={pending}
              id="model-tags"
              name="tags"
              placeholder="e.g. editorial, studio, outdoor"
            />
            <p className="mt-2 text-xs text-text-muted">
              Comma-separated. Stored as a normalized list.
            </p>
          </div>
        </div>

        {/* Error region */}
        <p
          aria-live="polite"
          className="min-h-5 text-sm text-accent-danger"
          role={state.error ? "alert" : undefined}
        >
          {state.error}
        </p>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:justify-end">
          <Link
            className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition duration-[var(--transition-fast)] hover:border-accent-cyan/40 hover:bg-surface-soft"
            href={cancelHref}
          >
            Cancel
          </Link>
          <Button disabled={pending} type="submit">
            {pending
              ? "Saving…"
              : mode === "create"
                ? "Create model"
                : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
