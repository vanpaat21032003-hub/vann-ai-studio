import type { ModelRecord } from "@/lib/models/schema";
import {
  IMAGE_WORKFLOW_MODES,
  type ImageWorkflowMode,
} from "@/lib/prompt-composer/workflows";
import type { ProductRecord } from "@/lib/products/schema";
import type { PromptPresetRecord } from "@/lib/prompt-presets/schema";
import type { StyleRecord } from "@/lib/styles/schema";

type ComposerRecords = {
  model: ModelRecord | null;
  product: ProductRecord;
  preset: PromptPresetRecord;
  style: StyleRecord;
  workflowMode: ImageWorkflowMode;
};

function detail(label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  return `${label}: ${value}`;
}

function section(title: string, details: Array<string | null>) {
  return [title, ...details.filter((detail): detail is string => Boolean(detail))].join("\n");
}

function productSection(product: ProductRecord) {
  return section("PRODUCT", [
    detail("Title", product.title),
    detail("Category", product.category),
    detail("Target gender", product.gender),
    detail("Brand", product.brand),
    detail("Color", product.color),
    detail("Material", product.material),
    detail("Notes", product.notes),
  ]);
}

function styleSection(style: StyleRecord) {
  return section("VISUAL STYLE", [
    detail("Name", style.name),
    detail("Lighting", style.lighting),
    detail("Camera", style.camera),
    detail("Background", style.background),
    detail("Mood", style.mood),
  ]);
}

function composeModelWearPrompt({
  product,
  model,
  style,
  preset,
}: ComposerRecords) {
  if (!model) return null;

  return [
    "WORKFLOW: AI MODEL WEAR",
    "Create a vertical fashion product image where the selected AI model wears the selected product, following the selected visual style and prompt instructions.",
    productSection(product),
    section("MODEL", [
      detail("Name", model.name),
      detail("Gender", model.gender),
      detail("Body type", model.body_type),
      detail("Target height", model.height === null ? null : `${model.height} cm`),
      detail("Style", model.style),
      detail("Pose", model.pose),
      detail("Tags", model.tags.length > 0 ? model.tags.join(", ") : null),
    ]),
    styleSection(style),
    `PROMPT INSTRUCTIONS\n${preset.prompt}`,
    "IMPORTANT PRODUCT FIDELITY\nPreserve the selected product's known visual characteristics and do not intentionally change its color, material, category, brand details, or other supplied product information.",
  ].join("\n\n");
}

function composeMannequinScenePrompt({
  product,
  style,
  preset,
}: ComposerRecords) {
  return [
    "WORKFLOW: MANNEQUIN SCENE STYLING",
    "Create a vertical fashion product image that keeps the original selected product presented on a mannequin while styling only the surrounding scene.",
    productSection(product),
    styleSection(style),
    `PROMPT INSTRUCTIONS\n${preset.prompt}`,
    "MANNEQUIN AND GARMENT PRESERVATION\nThe mannequin must remain a mannequin. Do not replace it with a human model, and do not make it walk, pose, or behave like a person. Preserve the garment identity, shape, proportions, color, material, texture, print or pattern, and logo or brand details when known. Do not redesign the garment or change its color, material, print, pattern, or logo. Apply styling changes only to the background, environment, lighting, mood, camera feel, and tasteful supporting props.",
    "IMPORTANT PRODUCT FIDELITY\nPreserve the selected product's known visual characteristics and do not intentionally change its color, material, category, brand details, or other supplied product information.",
  ].join("\n\n");
}

export function composePrompt(records: ComposerRecords) {
  return records.workflowMode === IMAGE_WORKFLOW_MODES.mannequinScene
    ? composeMannequinScenePrompt(records)
    : composeModelWearPrompt(records);
}
