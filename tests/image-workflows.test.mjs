import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();

function load(relativePath) {
  const filename = path.join(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;

  const compiledModule = { exports: {} };
  cache.set(filename, compiledModule);
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  const localRequire = (specifier) => {
    if (specifier === "@/lib/prompt-composer/workflows") {
      return load("lib/prompt-composer/workflows.ts");
    }
    throw new Error(`Unexpected test dependency: ${specifier}`);
  };

  vm.runInThisContext(`(function(require, module, exports) {${code}\n})`, {
    filename,
  })(localRequire, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}

const { composePrompt } = load("lib/prompt-composer/compose.ts");
const {
  createWorkflowTransitionState,
  getMissingWorkflowSelections,
  IMAGE_WORKFLOW_MODES,
} = load("lib/prompt-composer/workflows.ts");

const product = {
  title: "Vann Signature Jacket",
  category: "Outerwear",
  gender: "Unisex",
  brand: "Vann",
  color: "Midnight blue",
  material: "Cotton twill",
  notes: "Embroidered chest logo",
};
const model = {
  name: "Selected Model Subject",
  gender: "Female",
  body_type: "Athletic",
  height: 170,
  style: "Editorial",
  pose: "Standing",
  tags: ["confident"],
};
const style = {
  name: "Night Editorial",
  lighting: "Soft rim light",
  camera: "Medium-format portrait feel",
  background: "Minimal city studio",
  mood: "Premium and calm",
};
const preset = { prompt: "Create a refined affiliate campaign image." };

test("AI Model Wear prompt includes its identity and every creative source", () => {
  const prompt = composePrompt({
    model,
    preset,
    product,
    style,
    workflowMode: IMAGE_WORKFLOW_MODES.modelWear,
  });

  assert.equal(typeof prompt, "string");
  assert.match(prompt, /WORKFLOW: AI MODEL WEAR/);
  assert.match(prompt, /Vann Signature Jacket/);
  assert.match(prompt, /Selected Model Subject/);
  assert.match(prompt, /Night Editorial/);
  assert.match(prompt, /Create a refined affiliate campaign image/);
  assert.match(prompt, /IMPORTANT PRODUCT FIDELITY/);
  assert.match(prompt, /do not intentionally change its color, material, category, brand details/);
});

test("Mannequin Scene prompt needs no model and excludes the selected model subject", () => {
  const prompt = composePrompt({
    model,
    preset,
    product,
    style,
    workflowMode: IMAGE_WORKFLOW_MODES.mannequinScene,
  });

  assert.equal(typeof prompt, "string");
  assert.match(prompt, /WORKFLOW: MANNEQUIN SCENE STYLING/);
  assert.match(prompt, /Vann Signature Jacket/);
  assert.match(prompt, /Night Editorial/);
  assert.match(prompt, /Soft rim light/);
  assert.match(prompt, /Create a refined affiliate campaign image/);
  assert.match(prompt, /mannequin must remain a mannequin/i);
  assert.match(prompt, /Do not replace it with a human model/i);
  assert.match(prompt, /garment identity, shape, proportions, color, material, texture/i);
  assert.match(prompt, /Do not redesign the garment/i);
  assert.doesNotMatch(prompt, /Selected Model Subject/);
  assert.doesNotMatch(prompt, /^MODEL$/m);

  const withoutModel = composePrompt({
    model: null,
    preset,
    product,
    style,
    workflowMode: IMAGE_WORKFLOW_MODES.mannequinScene,
  });
  assert.equal(withoutModel, prompt);
});

test("workflow requirements require a model only for AI Model Wear", () => {
  const selections = {
    hasAspectRatio: true,
    hasModel: false,
    hasPreset: true,
    hasProduct: true,
    hasStyle: true,
  };

  assert.deepEqual(
    getMissingWorkflowSelections(IMAGE_WORKFLOW_MODES.modelWear, selections),
    ["model"],
  );
  assert.deepEqual(
    getMissingWorkflowSelections(
      IMAGE_WORKFLOW_MODES.mannequinScene,
      selections,
    ),
    [],
  );
});

test("workflow transition contract clears stale temporary output", () => {
  assert.deepEqual(createWorkflowTransitionState(), {
    copyMessage: null,
    enhancement: { status: "idle" },
    generationError: null,
    promptVariant: "final",
  });

  const generator = readFileSync(
    path.join(root, "app/components/image-generator/ImageGenerator.tsx"),
    "utf8",
  );
  const transition = generator.slice(
    generator.indexOf("  function changeWorkflowMode"),
    generator.indexOf("  function changeCompositionSelection"),
  );
  assert.match(transition, /setEnhancement\(resetState\.enhancement\)/);
  assert.match(transition, /setPromptVariant\(resetState\.promptVariant\)/);
  assert.match(transition, /setGenerationError\(resetState\.generationError\)/);
  assert.match(transition, /setCopyMessage\(resetState\.copyMessage\)/);
  assert.match(transition, /revokePreview\(\)/);
  assert.doesNotMatch(transition, /setModelId/);
});
