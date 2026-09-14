import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const migrationFiles = readdirSync(path.join(root, "supabase/migrations"))
  .filter((file) => file.endsWith("_generated_image_asset_v1.sql"));
assert.equal(migrationFiles.length, 1, "Expected exactly one Generated Image Asset V1 migration");
const migration = `supabase/migrations/${migrationFiles[0]}`;
const sql = read(migration).toLowerCase();

test("migration adds only the frozen asset domain and least-privilege policies", () => {
  assert.match(sql, /create table public\.generated_images/);
  assert.match(sql, /references public\.projects \(id\) on delete restrict/);
  assert.match(sql, /unique \(storage_path\)/);
  assert.match(sql, /project_id::text/);
  assert.match(sql, /between 1 and 20000/);
  assert.match(sql, /source_type = 'external_upload'/);
  assert.match(sql, /aspect_ratio in \('9:16', '1:1', '4:5'\)/);
  assert.match(sql, /project_id, created_at desc, id desc/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /from public, anon, authenticated/);
  assert.match(sql, /grant select on table public\.generated_images to authenticated/);
  assert.match(sql, /grant insert \(/);
  assert.match(sql, /split_part\(storage_path, '\/', 1\) = \(select auth.uid\(\)\)::text/);
  assert.equal((sql.match(/create policy/g) ?? []).length, 2);
  assert.equal((sql.match(/p.owner_id = \(select auth.uid\(\)\)/g) ?? []).length, 2);
  assert.doesNotMatch(sql, /\b(begin|commit|security definer)\b/);
  assert.doesNotMatch(sql, /\bgrant\b[^;]*(update|delete)/);
  assert.doesNotMatch(sql, /for (update|delete)|on storage\.|alter table public\.projects/);
  const columns = sql.slice(sql.indexOf("("), sql.indexOf("constraint"));
  assert.doesNotMatch(columns, /owner_id|updated_at|status|is_selected_for_motion/);
});

test("historical migrations and protected product/Gemini/Auth/config paths stay unchanged", () => {
  const protectedPaths = [
    "app/components/products/ProductImageUpload.tsx", "lib/products/image-actions.ts",
    "lib/products/image-data.ts", "lib/products/image-constants.ts",
    "app/api/fashion-studio/generate-image/route.ts", "lib/fashion-studio/ai/image-provider.ts",
    "app/components/image-generator/ImagePreviewPanel.tsx", "lib/supabase/auth.ts",
    "lib/supabase/server.ts", "lib/supabase/client.ts", "proxy.ts",
    "package.json", "package-lock.json", "next.config.ts",
    ...readdirSync(path.join(root, "supabase/migrations"))
      .filter((file) => file.startsWith("202607")).map((file) => "supabase/migrations/" + file),
  ];
  for (const file of protectedPaths) {
    const baseline = execFileSync("git", ["show", "41925a3a7a722e472b7903e7df4e3807829e8da9:" + file], { cwd: root, encoding: "utf8" }).replace(/\r\n/g, "\n");
    assert.equal(read(file), baseline, "Unexpected protected change: " + file);
  }
});

test("Gemini generation function unchanged; durable upload is explicit and separate", () => {
  const file = "app/components/image-generator/ImageGenerator.tsx";
  const source = read(file);
  const baseline = execFileSync("git", ["show", "41925a3a7a722e472b7903e7df4e3807829e8da9:" + file], { cwd: root, encoding: "utf8" }).replace(/\r\n/g, "\n");
  const generation = (text) => text.slice(text.indexOf("  async function generateImage()"), text.indexOf("  const missingSelections"));
  assert.equal(generation(source), generation(baseline));
  assert.match(source, /suggestedPrompt=\{selectedPrompt\}/);
  assert.match(source, /GeneratedImageUpload/);
});

test("upload never overwrites or deletes; every action resolves authenticated context", () => {
  const client = read("app/components/generated-images/GeneratedImageUpload.tsx");
  const upload = read("lib/generated-images/upload.ts");
  const actions = read("lib/generated-images/actions.ts");
  assert.match(client, /upsert: false/);
  assert.match(client, /active\.metadata, active\.path/);
  assert.match(client, /noValidate/);
  assert.match(client, /disabled=\{!canSubmit\}/);
  assert.match(client, /No file selected/);
  assert.match(client, /Select image/);
  assert.doesNotMatch(client, /type="file"[^>]*\brequired\b/s);
  assert.equal((actions.match(/await getProjectContext\(\)/g) ?? []).length, 2);
  for (const text of [upload, actions, client]) {
    assert.doesNotMatch(text, /\.remove\(|\.delete\(|\.update\(|service_role/);
  }
});
