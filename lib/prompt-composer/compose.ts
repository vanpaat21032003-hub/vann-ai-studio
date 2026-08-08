import type { ModelRecord } from "@/lib/models/schema";
import type { ProductRecord } from "@/lib/products/schema";
import type { PromptPresetRecord } from "@/lib/prompt-presets/schema";
import type { StyleRecord } from "@/lib/styles/schema";

type ComposerRecords = {
  model: ModelRecord;
  product: ProductRecord;
  preset: PromptPresetRecord;
  style: StyleRecord;
};

function detail(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  return `${label}: ${value}`;
}

function section(title: string, details: Array<string | null>) {
  return [title, ...details.filter((detail): detail is string => Boolean(detail))].join("\n");
}

export function composePrompt({
  product,
  model,
  style,
  preset,
}: ComposerRecords) {
  return [
    "Create a vertical fashion product image using the selected product, model, visual style, and prompt instructions.",
    section("PRODUCT", [
      detail("Title", product.title),
      detail("Category", product.category),
      detail("Target gender", product.gender),
      detail("Brand", product.brand),
      detail("Color", product.color),
      detail("Material", product.material),
      detail("Notes", product.notes),
    ]),
    section("MODEL", [
      detail("Name", model.name),
      detail("Gender", model.gender),
      detail("Body type", model.body_type),
      detail("Target height", model.height === null ? null : `${model.height} cm`),
      detail("Style", model.style),
      detail("Pose", model.pose),
      detail("Tags", model.tags.length > 0 ? model.tags.join(", ") : null),
    ]),
    section("VISUAL STYLE", [
      detail("Name", style.name),
      detail("Lighting", style.lighting),
      detail("Camera", style.camera),
      detail("Background", style.background),
      detail("Mood", style.mood),
    ]),
    `PROMPT INSTRUCTIONS\n${preset.prompt}`,
    "IMPORTANT PRODUCT FIDELITY\nPreserve the selected product's known visual characteristics and do not intentionally change its color, material, category, brand details, or other supplied product information.",
  ].join("\n\n");
}
