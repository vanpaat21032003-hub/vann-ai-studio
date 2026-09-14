import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

// Transpile the production modules in memory: no extra packages, config or output files.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const nativeRequire = createRequire(import.meta.url);
function loadDomain(entry, context) {
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const compiledModule = { exports: {} };
    cache.set(filename, compiledModule);
    const source = readFileSync(filename, "utf8");
    const code = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      fileName: filename,
    }).outputText;
    const localRequire = (specifier) => {
      if (specifier === "server-only") return {};
      if (specifier === "@/lib/projects/data") return { getProjectContext: async () => context };
      if (specifier.startsWith(".")) return load(path.resolve(path.dirname(filename), specifier + ".ts"));
      if (specifier.startsWith("node:")) return nativeRequire(specifier);
      throw new Error("Unexpected test dependency: " + specifier);
    };
    vm.runInThisContext("(function(require, module, exports) {" + code + "\n})", { filename })(localRequire, compiledModule, compiledModule.exports);
    return compiledModule.exports;
  }
  return load(path.join(root, "lib/generated-images", entry + ".ts"));
}

const schema = loadDomain("schema");
const OWNER = "11111111-1111-4111-8111-111111111111";
const PROJECT = "22222222-2222-4222-8222-222222222222";
const OTHER = "33333333-3333-4333-8333-333333333333";
const FILE = "44444444-4444-4444-8444-444444444444.png";
const PATH = OWNER + "/" + PROJECT + "/" + FILE;
const PNG = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0]);
const metadata = {
  project_id: PROJECT, prompt_snapshot: "  Exact original prompt\n",
  aspect_ratio: "9:16", source_type: "external_upload", provider: null,
};
const file = { name: "external.png", size: PNG.length, mimeType: "image/png" };
const row = { ...metadata, id: OTHER, storage_path: PATH, created_at: "2026-09-08T00:00:00Z" };

function fixture(options = {}) {
  let saved = options.existing ?? null;
  const calls = { insert: 0, storage: 0, download: 0, remove: 0, filters: [], orders: [], ranges: [], signed: [] };
  const supabase = {
    from(table) {
      const filters = {};
      let payload;
      const query = {
        select() { return query; },
        eq(key, value) { filters[key] = value; calls.filters.push([table, key, value]); return query; },
        order(key, config) { calls.orders.push([key, config]); return query; },
        async range(start, end) {
          calls.ranges.push([start, end]);
          return { data: options.rows ?? [], error: options.galleryError ?? null };
        },
        async maybeSingle() {
          if (table === "projects") return {
            data: options.owned === false || filters.id !== PROJECT || filters.owner_id !== OWNER ? null : { id: PROJECT },
            error: options.ownerError ?? null,
          };
          return { data: saved?.storage_path === filters.storage_path ? saved : null, error: options.readError ?? null };
        },
        insert(value) { payload = value; return query; },
        async single() {
          calls.insert++;
          if (options.insertError && !options.lostResponse) return { data: null, error: { message: "private database error" } };
          if (saved) return { data: null, error: { code: "23505" } };
          saved = { ...payload, id: OTHER, created_at: row.created_at };
          return options.lostResponse
            ? { data: null, error: { message: "lost response" } }
            : { data: { id: saved.id }, error: null };
        },
      };
      return query;
    },
    storage: {
      from(bucket) {
        assert.equal(bucket, "generated-images");
        calls.storage++;
        return {
          async list(folder) {
            assert.equal(folder, OWNER + "/" + PROJECT);
            return { error: null, data: options.missing ? [] : [{
              name: FILE, metadata: { size: options.size ?? PNG.length, mimetype: options.mime ?? "image/png" },
            }] };
          },
          async download(objectPath) {
            calls.download++;
            assert.equal(objectPath, PATH);
            if (options.downloadThrow) throw new Error("private storage error");
            return { data: new Blob([options.bytes ?? PNG], { type: options.mime ?? "image/png" }), error: null };
          },
          async createSignedUrl(objectPath, ttl) {
            calls.signed.push([objectPath, ttl]);
            if (options.signThrow) throw new Error("private signing error");
            return options.signError ? { data: null, error: {} } : { data: { signedUrl: "https://example.invalid/preview" }, error: null };
          },
          async remove() { calls.remove++; throw new Error("Cleanup is prohibited"); },
        };
      },
    },
  };
  const context = { ownerId: OWNER, supabase };
  return { context, calls, upload: loadDomain("upload", context), data: loadDomain("data", context) };
}

test("metadata runtime validation preserves prompt exactly and normalizes optional provider", () => {
  assert.deepEqual(schema.parseGeneratedImageMetadata(metadata), metadata);
  assert.equal(schema.parseGeneratedImageMetadata({ ...metadata, provider: "  Tool  " }).provider, "Tool");
  assert.equal(schema.parseGeneratedImageMetadata({ ...metadata, provider: " \t " }).provider, null);
  for (const changes of [
    { project_id: null }, { project_id: "bad" }, { project_id: [PROJECT] },
    { aspect_ratio: "16:9" }, { source_type: "direct_api" }, { source_type: undefined },
    { prompt_snapshot: "" }, { prompt_snapshot: " \t\n" },
    { prompt_snapshot: "a".repeat(20001) }, { prompt_snapshot: "a\0b" },
    { provider: {} }, { provider: "x".repeat(121) }, { provider: "x\0y" },
  ]) assert.equal(schema.parseGeneratedImageMetadata({ ...metadata, ...changes }), null);
  assert.ok(schema.parseGeneratedImageMetadata({ ...metadata, prompt_snapshot: "a".repeat(20000) }));
  assert.equal(schema.parseGeneratedImageMetadata(null), null);
});

test("file intent: supported types, matching extensions, empty and 8 MiB boundary", () => {
  assert.equal(schema.validFileIntent(file), true);
  assert.equal(schema.validFileIntent({ name: "image.JPEG", size: 1, mimeType: "image/jpeg" }), true);
  assert.equal(schema.validFileMetadata({ size: 8 * 1024 * 1024, mimeType: "image/png" }), true);
  for (const changes of [
    { size: 0 }, { size: -1 }, { size: 1.1 }, { size: NaN },
    { size: 8 * 1024 * 1024 + 1 }, { mimeType: "image/svg+xml" },
    { name: "x.jpg" }, { name: "" }, { name: "../x.png" }, { name: "x\0.png" },
  ]) assert.equal(schema.validFileIntent({ ...file, ...changes }), false);
});

test("path isolation rejects another owner/project, traversal, URL and extra suffix", () => {
  assert.equal(schema.ownedImageFileName(PATH, OWNER, PROJECT), FILE);
  for (const value of [
    OTHER + "/" + PROJECT + "/" + FILE, OWNER + "/" + OTHER + "/" + FILE,
    PATH + "/extra", PATH + "?token=anything", PATH.replace(FILE, "../" + FILE),
    "https://example.invalid/" + PATH, PATH.toUpperCase(), null,
  ]) assert.equal(schema.ownedImageFileName(value, OWNER, PROJECT), null);
});

test("JPEG, PNG and WebP signatures are checked independently of MIME claims", () => {
  assert.equal(schema.signatureMatches(PNG, "image/png"), true);
  assert.equal(schema.signatureMatches(PNG, "image/jpeg"), false);
  assert.equal(schema.signatureMatches(new Uint8Array([255,216,255]), "image/jpeg"), true);
  assert.equal(schema.signatureMatches(new Uint8Array([82,73,70,70,0,0,0,0,87,69,66,80]), "image/webp"), true);
  assert.equal(schema.signatureMatches(new Uint8Array([137,80]), "image/png"), false);
  assert.equal(schema.fileMatchesMime(FILE, "image/jpeg"), false);
});

test("prepare derives owner from verified context, creates path and never inserts metadata", async () => {
  const f = fixture();
  const result = await f.upload.prepareGeneratedImage(f.context, { ...metadata, owner_id: OTHER }, file);
  assert.equal(result.success, true);
  assert.ok(schema.ownedImageFileName(result.path, OWNER, PROJECT));
  assert.equal(f.calls.insert, 0);
  assert.equal(f.calls.storage, 0);
  assert.ok(f.calls.filters.some((filter) => filter[1] === "owner_id" && filter[2] === OWNER));
});

test("prepare/finalize deny missing or failed ownership without reaching Storage", async () => {
  for (const options of [{ owned: false }, { ownerError: {} }]) {
    const f = fixture(options);
    assert.equal((await f.upload.prepareGeneratedImage(f.context, metadata, file)).success, false);
    assert.equal((await f.upload.finalizeGeneratedImage(f.context, metadata, PATH)).success, false);
    assert.equal(f.calls.storage, 0);
    assert.equal(f.calls.insert, 0);
  }
});

test("finalize denies project/path mismatch and invalid metadata before upload validation", async () => {
  const f = fixture();
  assert.equal((await f.upload.finalizeGeneratedImage(f.context, metadata, OWNER + "/" + OTHER + "/" + FILE)).success, false);
  assert.equal((await f.upload.finalizeGeneratedImage(f.context, { ...metadata, aspect_ratio: "bad" }, PATH)).success, false);
  assert.equal(f.calls.storage, 0);
});

test("new record requires existing file, valid actual size/MIME/signature; no automatic cleanup", async () => {
  for (const options of [
    { missing: true }, { size: 0 }, { size: 8 * 1024 * 1024 + 1 },
    { mime: "text/html" }, { mime: "image/jpeg" }, { bytes: new Uint8Array(12) },
    { bytes: new Uint8Array(13) }, { downloadThrow: true }, { readError: {} },
  ]) {
    const f = fixture(options);
    const result = await f.upload.finalizeGeneratedImage(f.context, metadata, PATH);
    assert.equal(result.success, false);
    assert.equal(f.calls.insert, 0);
    assert.equal(f.calls.remove, 0);
    assert.ok(!result.error.includes("private"));
  }
});

test("successful finalize then retry returns the same record without another insert", async () => {
  const f = fixture();
  assert.deepEqual(await f.upload.finalizeGeneratedImage(f.context, metadata, PATH), { success: true, id: OTHER });
  assert.deepEqual(await f.upload.finalizeGeneratedImage(f.context, metadata, PATH), { success: true, id: OTHER });
  assert.equal(f.calls.insert, 1);
  assert.equal(f.calls.download, 1);
  assert.equal(f.calls.remove, 0);
});

test("existing path with different immutable metadata produces safe conflict", async () => {
  const f = fixture({ existing: row });
  const result = await f.upload.finalizeGeneratedImage(f.context, { ...metadata, prompt_snapshot: "different" }, PATH);
  assert.equal(result.success, false);
  assert.match(result.error, /different details/);
  assert.equal(f.calls.insert, 0);
});

test("upload success and insert failure leaves object untouched; retry can later succeed", async () => {
  const options = { insertError: true };
  const f = fixture(options);
  assert.equal((await f.upload.finalizeGeneratedImage(f.context, metadata, PATH)).success, false);
  options.insertError = false;
  assert.equal((await f.upload.finalizeGeneratedImage(f.context, metadata, PATH)).success, true);
  assert.equal(f.calls.remove, 0);
});

test("lost insert response and concurrent finalize both recover by unique path", async () => {
  const lost = fixture({ insertError: true, lostResponse: true });
  assert.equal((await lost.upload.finalizeGeneratedImage(lost.context, metadata, PATH)).success, true);
  const concurrent = fixture();
  const results = await Promise.all([
    concurrent.upload.finalizeGeneratedImage(concurrent.context, metadata, PATH),
    concurrent.upload.finalizeGeneratedImage(concurrent.context, metadata, PATH),
  ]);
  assert.ok(results.every((result) => result.success && result.id === OTHER));
  assert.equal(concurrent.calls.remove, 0);
});

test("gallery ownership enforced; stable paginated ordering and server TTL", async () => {
  const denied = fixture({ owned: false });
  await assert.rejects(denied.data.getOwnedGeneratedImages(PROJECT), /unavailable/);
  const f = fixture({ rows: Array.from({ length: 13 }, (_, i) => ({ ...row, id: String(i) })) });
  const result = await f.data.getOwnedGeneratedImages(PROJECT, 2);
  assert.equal(result.images.length, 12);
  assert.equal(result.hasMore, true);
  assert.deepEqual(f.calls.ranges, [[12, 24]]);
  assert.deepEqual(f.calls.orders, [["created_at", { ascending: false }], ["id", { ascending: false }]]);
  assert.ok(f.calls.signed.every(([, ttl]) => ttl === 300));
  assert.ok(result.images.every((image) => !("storage_path" in image)));
});

test("one invalid path or signing failure never crashes the gallery", async () => {
  const f = fixture({ rows: [row, { ...row, id: PROJECT, storage_path: OTHER + "/" + PROJECT + "/" + FILE }] });
  const result = await f.data.getOwnedGeneratedImages(PROJECT);
  assert.equal(result.images[0].signedUrl, "https://example.invalid/preview");
  assert.equal(result.images[1].signedUrl, null);
  assert.equal(f.calls.signed.length, 1);
  for (const options of [{ signError: true }, { signThrow: true }]) {
    const fail = fixture({ ...options, rows: [row] });
    assert.equal((await fail.data.getOwnedGeneratedImages(PROJECT)).images[0].signedUrl, null);
  }
  assert.equal(schema.galleryPage(["2"]), 1);
  assert.equal(schema.galleryPage("0"), 1);
  assert.equal(schema.galleryPage("2"), 2);
});
