"use client";

import { useId, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { createClient } from "@/lib/supabase/client";
import { createGeneratedImageUploadIntent, completeGeneratedImageUpload } from "@/lib/generated-images/actions";
import { GENERATED_IMAGE_ACCEPT, GENERATED_IMAGE_BUCKET, GENERATED_IMAGE_PROMPT_LIMIT, GENERATED_IMAGE_PROVIDER_LIMIT, GENERATED_IMAGE_RATIOS, GENERATED_IMAGE_SOURCE } from "@/lib/generated-images/constants";
import { parseGeneratedImageMetadata, validFileIntent, type GeneratedImageMetadata, type GeneratedImageRatio } from "@/lib/generated-images/schema";

type Attempt = { path: string; metadata: GeneratedImageMetadata };
type Props = {
  projectId: string;
  projectName: string;
  suggestedPrompt?: string | null;
  suggestedRatio?: GeneratedImageRatio | "";
};

export function GeneratedImageUpload({ projectId, projectName, suggestedPrompt, suggestedRatio }: Props) {
  const id = useId();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = useRef(false);
  const [prompt, setPrompt] = useState(suggestedPrompt ?? "");
  const [ratio, setRatio] = useState<GeneratedImageRatio | "">(suggestedRatio ?? "");
  const [provider, setProvider] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const locked = pending || attempt !== null;
  const promptLength = Array.from(prompt).length;
  const promptValid = Boolean(prompt.trim()) && !prompt.includes("\0") && promptLength <= GENERATED_IMAGE_PROMPT_LIMIT;
  const ratioValid = GENERATED_IMAGE_RATIOS.some((value) => value === ratio);
  const fileValid = Boolean(selectedFile && validFileIntent({
    name: selectedFile.name, size: selectedFile.size, mimeType: selectedFile.type,
  }));
  const readyToUpload = promptValid && ratioValid && fileValid && confirmed;
  const canSubmit = attempt ? !pending : !pending && readyToUpload;
  const nextRequirement = !promptValid
    ? "Add a valid prompt to continue."
    : !ratioValid
      ? "Choose an aspect ratio to continue."
      : !selectedFile
        ? "Select an image file to continue."
        : !fileValid
          ? "Choose a valid JPEG, PNG, or WebP file up to 8 MiB."
          : !confirmed
            ? "Confirm the prompt, aspect ratio, and project to enable upload."
            : "Ready to upload.";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const file = selectedFile;
    const metadata = parseGeneratedImageMetadata({
      project_id: projectId, prompt_snapshot: prompt, aspect_ratio: ratio,
      source_type: GENERATED_IMAGE_SOURCE, provider,
    });
    if (!attempt && (!file || !metadata || !confirmed || !validFileIntent({
      name: file.name, size: file.size, mimeType: file.type,
    }))) {
      setError("Confirm the prompt and aspect ratio, then choose a JPEG, PNG, or WebP file up to 8 MiB.");
      return;
    }
    busy.current = true;
    setError(null);
    startTransition(async () => {
      try {
        let active = attempt;
        if (!active && file && metadata) {
          setMessage("Preparing upload for this project…");
          const intent = await createGeneratedImageUploadIntent(metadata, {
            name: file.name, size: file.size, mimeType: file.type,
          });
          if (!intent.success) { setError(intent.error); setMessage(null); return; }
          active = { path: intent.path, metadata: intent.metadata };
          setAttempt(active);
          setMessage("Uploading private image…");
          const { error: uploadError } = await createClient().storage.from(GENERATED_IMAGE_BUCKET)
            .upload(intent.path, file, { contentType: intent.mimeType, cacheControl: "300", upsert: false });
          if (uploadError) {
            setError("Upload could not be confirmed. Retry saving to check whether the file arrived, or start another upload.");
            setMessage(null);
            return;
          }
        }
        if (!active) return;
        setMessage("Validating image and saving metadata…");
        const result = await completeGeneratedImageUpload(active.metadata, active.path);
        if (!result.success) { setError(result.error); setMessage(null); return; }
        setAttempt(null);
        if (fileRef.current) fileRef.current.value = "";
        setSelectedFile(null);
        setConfirmed(false);
        setError(null);
        setMessage("Generated image saved to this project.");
        router.refresh();
      } catch {
        setError("The request could not be confirmed. If an upload was prepared, retry saving with the same details.");
        setMessage(null);
      } finally {
        busy.current = false;
      }
    });
  }

  function startAnother() {
    if (pending || !window.confirm("Start another upload? The previous private file will not be deleted and may remain without a gallery record.")) return;
    setAttempt(null);
    setConfirmed(false);
    setError(null);
    setMessage(null);
    if (fileRef.current) fileRef.current.value = "";
    setSelectedFile(null);
  }

  return (
    <form className="space-y-4" onSubmit={submit} aria-busy={pending} noValidate>
      <p className="text-sm text-text-secondary">Save external image to <strong className="text-text-primary">{projectName}</strong>.</p>
      <p className="text-sm leading-6 text-text-muted">Metadata cannot be edited after saving. Uploads remain private. This does not save a Direct API preview automatically.</p>
      {suggestedPrompt ? (
        <Button size="sm" variant="secondary" disabled={locked} onClick={() => {
          setPrompt(suggestedPrompt);
          if (suggestedRatio) setRatio(suggestedRatio);
          setConfirmed(false);
        }}>Use currently selected generator prompt</Button>
      ) : null}
      <fieldset disabled={locked} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor={`${id}-prompt`}>Prompt used for this image</label>
          <Textarea id={`${id}-prompt`} value={prompt} onChange={(e) => { setPrompt(e.target.value); setConfirmed(false); }} aria-invalid={prompt.length > 0 && !promptValid} aria-describedby={`${id}-prompt-help`} />
          <p id={`${id}-prompt-help`} className={`mt-1 text-sm leading-5 ${prompt.length > 0 && !promptValid ? "text-accent-danger" : "text-text-muted"}`}>{prompt.length > 0 && !promptValid ? "Enter a non-empty prompt of no more than 20,000 characters." : "Required; maximum 20,000 characters. Paste the actual prompt if it differs from the generator."}</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor={`${id}-ratio`}>Aspect ratio metadata</label>
          <select id={`${id}-ratio`} value={ratio} onChange={(e) => { setRatio(e.target.value as GeneratedImageRatio); setConfirmed(false); }} aria-describedby={`${id}-ratio-help`} className="min-h-12 w-full rounded-control border border-border-soft bg-app p-3 text-text-primary">
            <option value="">Choose aspect ratio</option>
            {GENERATED_IMAGE_RATIOS.map((value) => <option value={value} key={value}>{value}</option>)}
          </select>
          <p id={`${id}-ratio-help`} className="mt-1 text-sm leading-5 text-text-muted">Required for the saved image metadata.</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor={`${id}-provider`}>External provider (optional)</label>
          <Input id={`${id}-provider`} maxLength={GENERATED_IMAGE_PROVIDER_LIMIT} value={provider} onChange={(e) => setProvider(e.target.value)} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor={`${id}-file`}>Generated image file</label>
          <div className="flex min-h-12 min-w-0 items-center gap-3 rounded-control border border-border-soft bg-app p-2">
            <input className="peer sr-only" ref={fileRef} id={`${id}-file`} type="file" accept={GENERATED_IMAGE_ACCEPT} onChange={(e) => { setSelectedFile(e.target.files?.[0] ?? null); setConfirmed(false); setError(null); }} aria-invalid={selectedFile ? !fileValid : undefined} aria-describedby={`${id}-file-help`} />
            <label className="inline-flex min-h-10 shrink-0 cursor-pointer items-center rounded-control border border-border-strong bg-surface-highlight px-3.5 py-2 text-sm font-semibold text-text-primary transition hover:border-accent-cyan/40 hover:bg-surface-soft peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-accent-cyan peer-disabled:cursor-not-allowed peer-disabled:opacity-55" htmlFor={`${id}-file`}>Select image</label>
            <span className={`min-w-0 truncate text-sm ${selectedFile && !fileValid ? "text-accent-danger" : "text-text-secondary"}`} aria-live="polite">{selectedFile?.name ?? "No file selected"}</span>
          </div>
          <p id={`${id}-file-help`} className={`mt-2 text-sm leading-5 ${selectedFile && !fileValid ? "text-accent-danger" : "text-text-muted"}`}>{selectedFile && !fileValid ? "Choose a JPEG, PNG, or WebP file up to 8 MiB." : "JPEG, PNG or WebP; maximum 8 MiB. Keep this page open until saving is confirmed."}</p>
        </div>
        <label className="flex items-start gap-3 text-sm text-text-secondary">
          <input className="mt-1" type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          I confirm this prompt, aspect ratio and target project for the uploaded image.
        </label>
      </fieldset>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={!canSubmit} aria-describedby={!attempt ? `${id}-requirements` : undefined}>{pending ? "Working…" : attempt ? "Retry saving metadata" : "Upload generated image"}</Button>
        {attempt ? <Button disabled={pending} variant="secondary" onClick={startAnother}>Start another upload</Button> : null}
      </div>
      {!attempt ? <p id={`${id}-requirements`} className={`text-sm leading-6 ${readyToUpload ? "text-text-secondary" : "text-text-muted"}`}>{nextRequirement}</p> : null}
      <p aria-live="polite" role={error ? "alert" : "status"} className={`text-sm ${error ? "text-accent-danger" : "text-text-secondary"}`}>{error ?? message}</p>
      {attempt && !pending ? <p className="text-sm leading-5 text-text-muted">Retry reuses the same path and metadata. No file is deleted automatically.</p> : null}
    </form>
  );
}
