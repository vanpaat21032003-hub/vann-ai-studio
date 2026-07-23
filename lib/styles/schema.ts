export const STYLE_SELECT =
  "id,name,lighting,camera,background,mood,status,created_at,updated_at";

export type StyleStatus = "active" | "archived";

export type StyleRecord = {
  id: string;
  name: string;
  lighting: string | null;
  camera: string | null;
  background: string | null;
  mood: string | null;
  status: StyleStatus;
  created_at: string;
  updated_at: string;
};

export type StyleFormValues = Pick<
  StyleRecord,
  "name" | "lighting" | "camera" | "background" | "mood"
>;

export type StyleActionState = {
  error: string | null;
  fieldErrors?: { name?: string };
};

export type StyleArchiveState = {
  archived: boolean;
  restored: boolean;
  error: string | null;
};

export type StyleEditableRecord = StyleFormValues & { id?: string };

const STYLE_FIELDS = ["name", "lighting", "camera", "background", "mood"] as const;
const MAX_FIELD_LENGTH = 500;

export function isStyleId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getStyleStatusLabel(status: StyleStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type ParseResult =
  | { success: true; values: StyleFormValues }
  | { success: false; state: StyleActionState };

export function parseStyleForm(formData: FormData): ParseResult {
  const values = Object.fromEntries(
    STYLE_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value.trim() : null];
    }),
  ) as Record<(typeof STYLE_FIELDS)[number], string | null>;

  if (Object.values(values).some((value) => value === null)) {
    return { success: false, state: { error: "Check the style details and try again." } };
  }
  if (!values.name) {
    return { success: false, state: { error: "Add a name before saving this style.", fieldErrors: { name: "Style name is required." } } };
  }
  const tooLong = STYLE_FIELDS.find((field) => values[field]!.length > MAX_FIELD_LENGTH);
  if (tooLong) {
    return { success: false, state: { error: "Keep each style field to 500 characters or fewer.", fieldErrors: tooLong === "name" ? { name: "Use 500 characters or fewer." } : undefined } };
  }
  return {
    success: true,
    values: {
      name: values.name,
      lighting: values.lighting || null,
      camera: values.camera || null,
      background: values.background || null,
      mood: values.mood || null,
    },
  };
}
