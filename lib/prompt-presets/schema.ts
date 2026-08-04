export const PROMPT_PRESET_SELECT =
  "id,title,category,prompt,status,created_at,updated_at";

export type PromptPresetStatus = "active" | "archived";

export type PromptPresetRecord = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  status: PromptPresetStatus;
  created_at: string;
  updated_at: string;
};

export type PromptPresetFormValues = Pick<
  PromptPresetRecord,
  "title" | "category" | "prompt"
>;

export type PromptPresetEditableRecord = PromptPresetFormValues & { id?: string };

export type PromptPresetActionState = {
  error: string | null;
  fieldErrors?: {
    title?: string;
    category?: string;
    prompt?: string;
  };
};

export type PromptPresetArchiveState = { error: string | null };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isPromptPresetId(value: string) {
  return UUID_PATTERN.test(value);
}

export function getPromptPresetStatusLabel(status: PromptPresetStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type ParseResult =
  | { success: true; values: PromptPresetFormValues }
  | { success: false; state: PromptPresetActionState };

export function parsePromptPresetForm(formData: FormData): ParseResult {
  const title = formData.get("title");
  const category = formData.get("category");
  const prompt = formData.get("prompt");

  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof prompt !== "string"
  ) {
    return {
      success: false,
      state: { error: "Check the preset details and try again." },
    };
  }

  const values = {
    title: title.trim(),
    category: category.trim(),
    prompt: prompt.trim(),
  };
  const fieldErrors: PromptPresetActionState["fieldErrors"] = {};

  if (!values.title) fieldErrors.title = "Title is required.";
  if (!values.category) fieldErrors.category = "Category is required.";
  if (!values.prompt) fieldErrors.prompt = "Prompt is required.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: {
        error: "Add a title, category, and prompt before saving this preset.",
        fieldErrors,
      },
    };
  }

  return { success: true, values };
}
