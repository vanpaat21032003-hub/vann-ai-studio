export const PROJECT_SELECT =
  "id,project_name,product_id,model_id,style_id,status,created_at,updated_at";

export type ProjectStatus = "draft" | "processing" | "completed" | "archived";

export type ProjectRecord = {
  id: string;
  project_name: string;
  product_id: string;
  model_id: string | null;
  style_id: string | null;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  product: ProjectReference;
  model: ProjectReference | null;
  style: ProjectReference | null;
};

export type ProjectReference = {
  id: string;
  name: string;
};

export type ProjectFormOptions = {
  products: ProjectReference[];
  models: ProjectReference[];
  styles: ProjectReference[];
};

export type ProjectFormValues = {
  project_name: string;
  product_id: string;
  model_id: string | null;
  style_id: string | null;
};

export type ProjectActionState = {
  error: string | null;
  fieldErrors?: {
    project_name?: string;
    product_id?: string;
    model_id?: string;
    style_id?: string;
  };
};

type ProjectFormResult =
  | { success: true; values: ProjectFormValues }
  | { success: false; state: ProjectActionState };

type ProjectField = "project_name" | "product_id" | "model_id" | "style_id";

function readTextField(
  formData: FormData,
  name: ProjectField,
) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : null;
}

export function isProjectId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function parseProjectForm(formData: FormData): ProjectFormResult {
  const project_name = readTextField(formData, "project_name");
  const product_id = readTextField(formData, "product_id");
  const model_id = readTextField(formData, "model_id");
  const style_id = readTextField(formData, "style_id");

  if ([project_name, product_id, model_id, style_id].some((value) => value === null)) {
    return {
      success: false,
      state: { error: "Check the project details and try again." },
    };
  }

  const fieldErrors: ProjectActionState["fieldErrors"] = {};

  if (!project_name) {
    fieldErrors.project_name = "Project name is required.";
  }

  if (!product_id) {
    fieldErrors.product_id = "Choose a product for this project.";
  } else if (!isProjectId(product_id)) {
    fieldErrors.product_id = "Choose a valid product.";
  }

  if (model_id && !isProjectId(model_id)) {
    fieldErrors.model_id = "Choose a valid model or clear this selection.";
  }

  if (style_id && !isProjectId(style_id)) {
    fieldErrors.style_id = "Choose a valid style or clear this selection.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        error: "Complete the required project details before saving.",
        fieldErrors,
      },
    };
  }

  return {
    success: true,
    values: {
      project_name: project_name!,
      product_id: product_id!,
      model_id: model_id || null,
      style_id: style_id || null,
    },
  };
}

export function getProjectStatusLabel(status: ProjectStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
