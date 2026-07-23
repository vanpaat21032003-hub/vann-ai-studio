// Model Library schema, types, and pure parsing helpers.
// This module has no server-side imports and can be used in both server and
// client contexts.

/** Columns returned from `public.models` for list and detail views. */
export const MODEL_SELECT =
  "id,name,gender,body_type,height,style,pose,tags,thumbnail_url,reference_url,status,created_at,updated_at";

export type ModelStatus = "active" | "archived";

export type ModelRecord = {
  id: string;
  name: string;
  gender: string | null;
  body_type: string | null;
  /** Stored as numeric(5,2) in the database; represents target AI-character height in centimetres. */
  height: number | null;
  style: string | null;
  pose: string | null;
  tags: string[];
  thumbnail_url: string | null;
  reference_url: string | null;
  status: ModelStatus;
  created_at: string;
  updated_at: string;
};

/** Fields the owner may submit when creating or editing a model. */
export type ModelFormValues = {
  name: string;
  gender: string | null;
  body_type: string | null;
  height: number | null;
  style: string | null;
  pose: string | null;
  tags: string[];
};

export type ModelActionState = {
  error: string | null;
  fieldErrors?: {
    name?: string;
    gender?: string;
    height?: string;
  };
};

export type ModelEditableRecord = {
  id?: string;
  name: string;
  gender: string | null;
  body_type: string | null;
  height: number | null;
  style: string | null;
  pose: string | null;
  tags: string[];
};

export type ModelArchiveState = {
  archived: boolean;
  restored: boolean;
  error: string | null;
};

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const HEIGHT_DEFAULT_FEMALE = 170;
export const HEIGHT_DEFAULT_MALE = 185;
export const HEIGHT_MIN = 100;
export const HEIGHT_MAX = 250;

export function getDefaultHeight(gender: string | null): number {
  return gender === "male" ? HEIGHT_DEFAULT_MALE : HEIGHT_DEFAULT_FEMALE;
}

// ---------------------------------------------------------------------------
// ID validation (UUID v1–v5)
// ---------------------------------------------------------------------------

export function isModelId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

export function getModelStatusLabel(status: ModelStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

// ---------------------------------------------------------------------------
// Tag normalization
// ---------------------------------------------------------------------------

/**
 * Accepts a comma-separated tag string from form input, trims and de-duplicates
 * each entry, and returns a clean string array ready for storage.
 */
export function normalizeTags(raw: string | null): string[] {
  if (!raw || !raw.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

/** Converts a stored tag array back to the comma-separated display string. */
export function tagsToDisplay(tags: string[]): string {
  return tags.join(", ");
}

// ---------------------------------------------------------------------------
// Form parsing
// ---------------------------------------------------------------------------

type ParseResult =
  | { success: true; values: ModelFormValues }
  | { success: false; state: ModelActionState };

export function parseModelForm(formData: FormData): ParseResult {
  const name = formData.get("name");
  if (typeof name !== "string") {
    return { success: false, state: { error: "Check the model details and try again." } };
  }
  const trimmedName = name.trim();
  if (!trimmedName) {
    return {
      success: false,
      state: {
        error: "Add a name before saving this model.",
        fieldErrors: { name: "Model name is required." },
      },
    };
  }

  const genderRaw = formData.get("gender");
  const genderStr = typeof genderRaw === "string" ? genderRaw.trim().toLowerCase() : "";
  if (genderStr !== "female" && genderStr !== "male") {
    return {
      success: false,
      state: {
        error: "Select a valid gender (female or male).",
        fieldErrors: { gender: "Gender must be female or male." },
      },
    };
  }
  const gender = genderStr;

  const bodyTypeRaw = formData.get("body_type");
  const body_type =
    typeof bodyTypeRaw === "string" && bodyTypeRaw.trim()
      ? bodyTypeRaw.trim()
      : null;

  const styleRaw = formData.get("style");
  const style =
    typeof styleRaw === "string" && styleRaw.trim() ? styleRaw.trim() : null;

  const poseRaw = formData.get("pose");
  const pose =
    typeof poseRaw === "string" && poseRaw.trim() ? poseRaw.trim() : null;

  const tagsRaw = formData.get("tags");
  const tags = normalizeTags(typeof tagsRaw === "string" ? tagsRaw : null);

  // Height — empty becomes null; non-empty must match /^\d+$/ strictly
  const heightRaw = formData.get("height");
  let height: number | null = null;
  if (typeof heightRaw === "string" && heightRaw.trim() !== "") {
    const heightTrimmed = heightRaw.trim();
    if (!/^\d+$/.test(heightTrimmed)) {
      return {
        success: false,
        state: {
          error: "Target height must be a whole number of cm.",
          fieldErrors: { height: "Enter digits only for target height." },
        },
      };
    }
    const parsed = Number(heightTrimmed);
    if (parsed < HEIGHT_MIN || parsed > HEIGHT_MAX) {
      return {
        success: false,
        state: {
          error: `Target height must be between ${HEIGHT_MIN} and ${HEIGHT_MAX} cm.`,
          fieldErrors: {
            height: `Enter a value between ${HEIGHT_MIN} and ${HEIGHT_MAX} cm.`,
          },
        },
      };
    }
    height = parsed;
  }

  return {
    success: true,
    values: {
      name: trimmedName,
      gender,
      body_type,
      height,
      style,
      pose,
      tags,
    },
  };
}
