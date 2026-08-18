"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getProjectContext } from "@/lib/projects/data";
import {
  isProjectId,
  parseProjectForm,
  type ProjectActionState,
  type ProjectFormValues,
} from "@/lib/projects/schema";

const PROJECTS_PATH = "/fashion-studio/projects";
const SAVE_ERROR = "Unable to save this project. Please try again.";

function revalidateProjects(projectId?: string) {
  revalidatePath(PROJECTS_PATH);
  revalidatePath("/fashion-studio");

  if (projectId) {
    revalidatePath(`${PROJECTS_PATH}/${projectId}`);
  }
}

async function belongsToOwner(
  supabase: Awaited<ReturnType<typeof getProjectContext>>["supabase"],
  table: "products" | "models" | "styles",
  recordId: string,
  ownerId: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .eq("id", recordId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  return !error && Boolean(data);
}

async function validateReferences(
  values: ProjectFormValues,
  context: Awaited<ReturnType<typeof getProjectContext>>,
): Promise<ProjectActionState | null> {
  if (!(await belongsToOwner(context.supabase, "products", values.product_id, context.ownerId))) {
    return {
      error: "Choose a product that is available to your current workspace.",
      fieldErrors: { product_id: "This product is no longer available." },
    };
  }

  if (
    values.model_id &&
    !(await belongsToOwner(context.supabase, "models", values.model_id, context.ownerId))
  ) {
    return {
      error: "Choose a model that is available to your current workspace.",
      fieldErrors: { model_id: "This model is no longer available." },
    };
  }

  if (
    values.style_id &&
    !(await belongsToOwner(context.supabase, "styles", values.style_id, context.ownerId))
  ) {
    return {
      error: "Choose a style that is available to your current workspace.",
      fieldErrors: { style_id: "This style is no longer available." },
    };
  }

  return null;
}

export async function createProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const parsed = parseProjectForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const context = await getProjectContext();
  const referenceError = await validateReferences(parsed.values, context);

  if (referenceError) {
    return referenceError;
  }

  const { data, error } = await context.supabase
    .from("projects")
    .insert({ ...parsed.values, owner_id: context.ownerId, status: "draft" })
    .select("id")
    .single();

  if (error || !data?.id) {
    return { error: SAVE_ERROR };
  }

  revalidateProjects(data.id);
  redirect(`${PROJECTS_PATH}/${data.id}`);
}

export async function updateProject(
  projectId: string,
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!isProjectId(projectId)) {
    return { error: "This project is no longer available." };
  }

  const parsed = parseProjectForm(formData);

  if (!parsed.success) {
    return parsed.state;
  }

  const context = await getProjectContext();
  const { data: project, error: projectError } = await context.supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("owner_id", context.ownerId)
    .maybeSingle();

  if (projectError) {
    return { error: SAVE_ERROR };
  }

  if (!project) {
    return { error: "This project is no longer available." };
  }

  const referenceError = await validateReferences(parsed.values, context);

  if (referenceError) {
    return referenceError;
  }

  const { data, error } = await context.supabase
    .from("projects")
    .update(parsed.values)
    .eq("id", projectId)
    .eq("owner_id", context.ownerId)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: SAVE_ERROR };
  }

  if (!data) {
    return { error: "This project is no longer available." };
  }

  revalidateProjects(projectId);
  redirect(`${PROJECTS_PATH}/${projectId}`);
}
