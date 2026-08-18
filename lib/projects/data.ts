import "server-only";

import { getOwnedModels } from "@/lib/models/data";
import { getOwnedProducts } from "@/lib/products/data";
import {
  isProjectId,
  PROJECT_SELECT,
  type ProjectFormOptions,
  type ProjectRecord,
  type ProjectReference,
} from "@/lib/projects/schema";
import { getOwnedStyles } from "@/lib/styles/data";
import { getAuthenticatedContext } from "@/lib/supabase/auth";

export async function getProjectContext() {
  return getAuthenticatedContext();
}

function toProductReference(product: { id: string; title: string }): ProjectReference {
  return { id: product.id, name: product.title };
}

function toNamedReference(record: { id: string; name: string }): ProjectReference {
  return { id: record.id, name: record.name };
}

export async function getProjectFormOptions(): Promise<ProjectFormOptions> {
  const products = await getOwnedProducts({ search: "", status: "all" });
  const models = await getOwnedModels({ search: "", status: "all" });
  const styles = await getOwnedStyles({ search: "", status: "all" });

  return {
    products: products.map(toProductReference),
    models: models.map(toNamedReference),
    styles: styles.map(toNamedReference),
  };
}

export async function getOwnedProjects(): Promise<ProjectRecord[]> {
  const { ownerId, supabase } = await getProjectContext();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error("Project data is temporarily unavailable.");
  }

  const options = await getProjectFormOptions();
  const products = new Map(options.products.map((product) => [product.id, product]));
  const models = new Map(options.models.map((model) => [model.id, model]));
  const styles = new Map(options.styles.map((style) => [style.id, style]));

  return (data ?? []).flatMap((project) => {
    const product = products.get(project.product_id);

    if (!product) {
      return [];
    }

    return [
      {
        ...project,
        product,
        model: project.model_id ? (models.get(project.model_id) ?? null) : null,
        style: project.style_id ? (styles.get(project.style_id) ?? null) : null,
      } as ProjectRecord,
    ];
  });
}

export async function getOwnedProject(projectId: string): Promise<ProjectRecord | null> {
  if (!isProjectId(projectId)) {
    return null;
  }

  const { ownerId, supabase } = await getProjectContext();

  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("id", projectId)
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    throw new Error("Project data is temporarily unavailable.");
  }

  if (!data) {
    return null;
  }

  const options = await getProjectFormOptions();
  const product = options.products.find((item) => item.id === data.product_id);

  if (!product) {
    return null;
  }

  return {
    ...data,
    product,
    model: data.model_id
      ? (options.models.find((item) => item.id === data.model_id) ?? null)
      : null,
    style: data.style_id
      ? (options.styles.find((item) => item.id === data.style_id) ?? null)
      : null,
  } as ProjectRecord;
}
