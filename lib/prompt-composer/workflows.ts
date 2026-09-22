export const IMAGE_WORKFLOW_MODES = {
  modelWear: "model-wear",
  mannequinScene: "mannequin-scene",
} as const;

export type ImageWorkflowMode =
  (typeof IMAGE_WORKFLOW_MODES)[keyof typeof IMAGE_WORKFLOW_MODES];

type WorkflowSelections = {
  hasAspectRatio: boolean;
  hasModel: boolean;
  hasPreset: boolean;
  hasProduct: boolean;
  hasStyle: boolean;
};

export function getMissingWorkflowSelections(
  workflowMode: ImageWorkflowMode,
  selections: WorkflowSelections,
) {
  return [
    !selections.hasProduct && "product",
    workflowMode === IMAGE_WORKFLOW_MODES.modelWear &&
      !selections.hasModel &&
      "model",
    !selections.hasStyle && "style",
    !selections.hasPreset && "prompt preset",
    !selections.hasAspectRatio && "aspect ratio",
  ].filter((value): value is string => Boolean(value));
}

export function createWorkflowTransitionState() {
  return {
    copyMessage: null,
    enhancement: { status: "idle" as const },
    generationError: null,
    promptVariant: "final" as const,
  };
}
