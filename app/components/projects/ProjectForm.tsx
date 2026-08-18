"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { createProject, updateProject } from "@/lib/projects/actions";
import type {
  ProjectActionState,
  ProjectFormOptions,
  ProjectRecord,
} from "@/lib/projects/schema";

type ProjectFormProps = {
  mode: "create" | "edit";
  options: ProjectFormOptions;
  project?: ProjectRecord;
};

type ProjectFormAction = (
  state: ProjectActionState,
  formData: FormData,
) => Promise<ProjectActionState>;

const initialState: ProjectActionState = { error: null };
const selectClass =
  "min-h-12 w-full appearance-none rounded-control border border-border-soft bg-app/70 py-3 pr-12 pl-4 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-[var(--transition-fast)] hover:border-border-strong focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/15 disabled:cursor-not-allowed disabled:opacity-60";

function SelectField({
  defaultValue,
  error,
  id,
  label,
  name,
  options,
  pending,
  placeholder,
  required = false,
}: {
  defaultValue: string;
  error?: string;
  id: string;
  label: string;
  name: "product_id" | "model_id" | "style_id";
  options: ProjectFormOptions["products"];
  pending: boolean;
  placeholder: string;
  required?: boolean;
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor={id}>
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-accent-cyan">*</span> : null}
      </label>
      <div className="relative">
        <select
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          aria-required={required || undefined}
          className={selectClass}
          defaultValue={defaultValue}
          disabled={pending}
          id={id}
          name={name}
          required={required}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-text-muted"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path d="m8 10 4 4 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      </div>
      {error ? <p className="mt-2 text-sm text-accent-danger" id={errorId}>{error}</p> : null}
    </div>
  );
}

export function ProjectForm({ mode, options, project }: ProjectFormProps) {
  const boundUpdate = project ? updateProject.bind(null, project.id) : undefined;
  const action: ProjectFormAction = mode === "create" ? createProject : boundUpdate!;
  const [state, formAction, pending] = useActionState(action, initialState);
  const projectNameError = state.fieldErrors?.project_name;
  const cancelHref = project ? `/fashion-studio/projects/${project.id}` : "/fashion-studio/projects";

  return (
    <Card className="mt-[var(--space-section)]">
      <form action={formAction} className="space-y-6 p-5 sm:p-7">
        <div>
          <label className="mb-2 block text-sm font-medium text-text-primary" htmlFor="project-name">
            Project name<span aria-hidden="true" className="ml-1 text-accent-cyan">*</span>
          </label>
          <Input
            aria-describedby={projectNameError ? "project-name-error" : undefined}
            autoFocus
            defaultValue={project?.project_name ?? ""}
            disabled={pending}
            error={Boolean(projectNameError)}
            id="project-name"
            name="project_name"
            placeholder="Name this creative project"
            required
          />
          {projectNameError ? <p className="mt-2 text-sm text-accent-danger" id="project-name-error">{projectNameError}</p> : null}
        </div>

        <SelectField
          defaultValue={project?.product_id ?? ""}
          error={state.fieldErrors?.product_id}
          id="project-product"
          label="Product"
          name="product_id"
          options={options.products}
          pending={pending}
          placeholder="Choose a product"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            defaultValue={project?.model_id ?? ""}
            error={state.fieldErrors?.model_id}
            id="project-model"
            label="Model"
            name="model_id"
            options={options.models}
            pending={pending}
            placeholder="No model selected"
          />
          <SelectField
            defaultValue={project?.style_id ?? ""}
            error={state.fieldErrors?.style_id}
            id="project-style"
            label="Style"
            name="style_id"
            options={options.styles}
            pending={pending}
            placeholder="No style selected"
          />
        </div>

        <p aria-live="polite" className="min-h-5 text-sm text-accent-danger" role={state.error ? "alert" : undefined}>
          {state.error}
        </p>

        <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:justify-end">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-control border border-border-strong bg-surface-highlight px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft" href={cancelHref}>
            Cancel
          </Link>
          <Button disabled={pending} type="submit">
            {pending ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
