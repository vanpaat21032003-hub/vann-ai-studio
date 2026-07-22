# Product Roadmap — Vann AI Studio

Status: delivery sequence; future sprint belum disetujui untuk implementasi hanya karena tercantum di sini

## Roadmap rules

- Satu sprint menghasilkan satu focused Pull Request atau rangkaian PR kecil yang masing-masing tetap satu concern.
- Setiap sprint dimulai dari latest `origin/main`.
- Scope, files, migration, policy, dan manual test harus disetujui sebelum write action.
- Lint dan production build wajib lulus untuk seluruh sprint code.
- Database/Storage/Auth changes membutuhkan bukti live/repository yang aman, migration review, dan security validation.
- Future sprint tidak boleh ditandai completed sebelum acceptance criteria dan definition of done terpenuhi.

## Status summary

| Sprint | Tema | Status |
| --- | --- | --- |
| 0 | Technical foundation | COMPLETED |
| 1 | Authentication and route protection | COMPLETED — production verified |
| 2 | Design system and application shell | COMPLETED — production verified |
| 3 | Product Library | NOT STARTED — next implementation sprint |
| 4 | Product image upload and Storage | NOT STARTED |
| 5 | Model Library, Style Library, and Prompt Presets | NOT STARTED |
| 6 | Fashion Studio workflow | NOT STARTED |
| 7 | Product analysis and Fashion Brain | NOT STARTED |
| 8 | Generated image management and Motion Studio | NOT STARTED |
| 9 | Caption, CTA, hashtag, and Publishing workspace | NOT STARTED |
| 10 | Dashboard history, recent assets, and metrics | NOT STARTED |
| 11 | Research workspace | DEFERRED |
| 12 | Windows desktop packaging | DEFERRED |

## Sprint 0 — Technical foundation

**Status:** COMPLETED berdasarkan repository implementation serta product-owner and system-verified live infrastructure reports.

**Objective:** Menyediakan project Next.js yang dapat di-build, workspace routes, delivery/deployment baseline, Supabase clients, dan private secured Supabase foundation.

**User value:** Owner memiliki shell aplikasi, live private data/asset foundation, dan production connection yang siap menjadi dasar workflow bertahap.

**Included scope:** Next.js App Router, TypeScript, Tailwind, ESLint, workspace route group, sidebar, tujuh workspace routes, root redirect, Supabase browser/server clients, local/Vercel environment configuration, safe Dashboard health status, GitHub/Vercel integration, production deployment, database V1, private owner Auth preparation, ownership schema, grants hardening, table RLS, private Storage buckets, dan Storage ownership policies.

**Excluded scope:** Login/logout UI, route protection, application CRUD/workflows, uploads melalui aplikasi, AI workflow, publishing automation, dan desktop.

**Expected routes:** `/`, `/dashboard`, `/fashion-studio`, `/fashion-brain`, `/motion-studio`, `/publishing`, `/research`, `/settings` — semuanya tersedia.

**Expected files/modules:** `app/`, `lib/supabase/`, `.env.example`, package manifests, lint/TypeScript/Tailwind configuration.

**Database impact:** Applied migrations `20260721171620_v1_database_foundation` dan `20260722052154_ownership_rls_and_storage_policies`; tujuh live RLS-enabled tables, lima direct `owner_id` columns/indexes, derived child ownership, 28 authenticated policies, hardened authenticated grants, dan no anon application access. Seluruh tabel berisi nol row.

**Storage impact:** Private buckets `products`, `models`, `generated-images`, dan `generated-videos`; nol object; authenticated SELECT/INSERT/UPDATE/DELETE policies membatasi approved buckets dan user-ID path prefix.

**Authentication/RLS impact:** Email/password enabled, public signup disabled, anonymous-user authentication disabled, satu confirmed owner account, table/Storage RLS completed. Login UI, sign-out UI, dan route protection belum ada.

**UI states:** Placeholder workspace states dan connected/unavailable status.

**Acceptance criteria:** Routes dan root redirect benar; clients aman; production health indicator connected; schema, ownership, grants, 28 table policies, private buckets, dan four Storage policies verified; anon application-data access blocked; lint/build lulus.

**Lint/build requirements:** Sudah pernah lulus pada foundation commits.

**Manual tests:** Navigation, redirect, local/production health indicator, deployed foundation, live table/RLS/grant posture, private buckets, Storage ownership policies, dan Auth posture telah diverifikasi melalui completed execution reports tanpa memaparkan personal data.

**Definition of done:** Foundation commits merged ke `main`, production deployment berhasil, Supabase migrations applied, dan private security posture verified.

**Rollback considerations:** Revert focused feature commit/PR; environment values tetap dikelola di platform, bukan repository.

**Dependencies:** Tidak ada.

## Sprint 1 — Authentication and route protection

**Status:** COMPLETED dan verified in production.

**Objective:** Menyediakan private owner login/logout dan melindungi seluruh workspace routes.

**User value:** Hanya owner terautentikasi yang dapat membuka application workspace.

**Included scope:** Login page untuk existing email/password Auth, logout, session-aware redirect, unauthorized state, server-side session validation, route protection, preservation of disabled public signup/anonymous auth, dan safe auth errors.

**Excluded scope:** User management UI, invitations, roles, multi-user, social login, MFA, recovery flow kecuali disetujui khusus, dan application-table migration.

**Expected routes:** `/login`; protected existing workspace routes; optional auth callback hanya jika benar-benar diperlukan pattern yang disetujui.

**Expected files/modules:** `app/login/`, auth actions/components, `lib/supabase/server.ts` extensions bila perlu, dan `proxy.ts` hanya jika current Next.js docs membenarkan. File final harus ditentukan setelah inspection.

**Database impact:** Tidak mengubah application schema.

**Storage impact:** Tidak ada.

**Authentication/RLS impact:** Mengaktifkan UI/session flow. Authorization tetap divalidasi server-side; Proxy bukan satu-satunya security boundary. RLS tidak dilemahkan.

**UI states:** Logged out, pending login, invalid credentials, unavailable, authenticated, logout pending, session expired, unauthorized.

**Acceptance criteria:** Anonymous user tidak dapat membuka workspace; owner dapat login; refresh mempertahankan valid session; logout mengakhiri session; error tidak bocorkan identity/token.

**Lint/build requirements:** `npm run lint` dan `npm run build` lulus.

**Manual tests:** Login valid/invalid, direct protected URL, refresh, expired/missing cookie, logout, Back button, Supabase unavailable, mobile login layout.

**Definition of done:** Code reviewed, security flow disetujui Liora, Vann menyelesaikan manual test, focused PR merged, Preview/Production verified sesuai approval.

**Rollback considerations:** Revert auth PR; pastikan rollback tidak meninggalkan route setengah terlindungi atau public signup berubah.

**Dependencies:** Sprint 0; safe read-only verification atas live Auth settings.

## Sprint 2 — Design system and application shell

**Status:** COMPLETED dan verified in production.

**Objective:** Mengubah placeholder shell menjadi UI foundation yang konsisten, responsive, dan accessible.

**User value:** Navigation lebih jelas dan seluruh sprint berikutnya memakai primitives yang stabil.

**Included scope:** Dark navy futuristic design tokens dengan accent cyan/violet, reusable `AppIcon`, `Badge`, `Button`, `Card`, `EmptyState`, `Input`, `PageHeader`, dan `SectionHeading` primitives, active sidebar, responsive protected shell, workspace headers, dan empty states.

**Excluded scope:** Product data, AI workflows, dashboard metrics nyata, dan broad visual redesign di luar approved blueprint.

**Expected routes:** Semua existing workspace routes untuk shell verification; tidak harus menambah route bisnis.

**Expected files/modules:** Shared UI components, shell/navigation components, global styles/tokens, route-level placeholder migration yang minimal.

**Database impact:** Tidak ada.

**Storage impact:** Tidak ada.

**Authentication/RLS impact:** Shell menampilkan authenticated navigation; tidak mengubah policy.

**UI states:** Responsive shell, active/focus/hover/disabled navigation, reusable empty states, dan preserved login states.

**Acceptance criteria:** Frozen navigation tetap ada; active state akurat; keyboard navigation berhasil; responsive layout tidak overflow; tidak ada design-system claim tanpa implemented components.

**Lint/build requirements:** Lint/build lulus; accessibility lint tidak memiliki new violations.

**Manual tests:** Desktop/tablet/mobile, keyboard-only, screen-reader landmarks, zoom 200%, dark contrast, reduced motion.

**Definition of done:** Tokens dan primitives didokumentasikan, existing placeholder pages tetap berfungsi, Vann menyetujui visual baseline.

**Rollback considerations:** Components diadopsi bertahap; hindari all-at-once rewrite yang sulit direvert.

**Dependencies:** Sprint 1 completed; custom design tokens dan primitives menyelesaikan Sprint 2 design-system decision.

## Sprint 3 — Product Library

**Status:** NOT STARTED — next implementation sprint.

**Objective:** Menyediakan CRUD terkontrol untuk canonical affiliate products.

**User value:** Owner dapat menyimpan dan menemukan produk tanpa spreadsheet/file terpisah.

**Included scope:** Product list/card, search/filter, create, detail, edit, archive, validation, ownership enforcement, pagination baseline.

**Excluded scope:** Image upload, AI analysis, bulk import, affiliate API ingestion, dan hard-delete automation.

**Expected routes:** `/products` atau nested Product Library route yang disetujui tanpa menambah sidebar workspace; `/products/new`; `/products/[id]`; `/products/[id]/edit` bila page-based.

**Expected files/modules:** Product data access, server actions/handlers, validation schema, product UI components, route pages, tests. Exact placement diputuskan setelah architecture review.

**Database impact:** Gunakan existing live `products` table, `owner_id`, owner index, grants, dan RLS policies. Migration baru hanya jika UI membutuhkan approved schema change yang belum tersedia.

**Storage impact:** Tidak ada.

**Authentication/RLS impact:** Owner-only SELECT/INSERT/UPDATE/archive. Anonymous blocked. Client-supplied `owner_id` tidak dipercaya.

**UI states:** Loading, empty library, filtered-empty, create/edit validation, saving, saved, unauthorized, not-found, archive confirmation, database unavailable.

**Acceptance criteria:** Owner hanya melihat record sendiri; create/edit persist; invalid relationship tidak ada; archive tidak menghapus history; direct record URL aman.

**Lint/build requirements:** Lint/build dan relevant data tests lulus.

**Manual tests:** Create, edit, search, filter, pagination, archive, anonymous access, cross-owner attempt bila test account disetujui, failure recovery.

**Definition of done:** Migration review, advisors, exact policy report, UI acceptance, PR merge, Preview validation.

**Rollback considerations:** App rollback tidak boleh membuat schema unusable; migration rollback/data preservation plan wajib sebelum DDL.

**Dependencies:** Sprint 1–2 dan existing verified ownership/RLS foundation.

## Sprint 4 — Product image upload and Storage

**Status:** NOT STARTED.

**Objective:** Mengunggah screenshot/source images secara privat dan mengaitkannya ke produk.

**User value:** Screenshot produk menjadi titik awal workflow yang tersimpan aman.

**Included scope:** Private `products` bucket, upload validation, user-scoped paths, `product_images` metadata, preview, retry, remove/archive, authorized access.

**Excluded scope:** Generated images, model assets, video uploads, image editing, OCR, dan public URLs.

**Expected routes:** Product detail dan upload surface di dalam Product Library; optional authorized asset handler bila diperlukan.

**Expected files/modules:** Upload component, server validation, Storage adapter, product-image data access, preview/gallery components, tests.

**Database impact:** Gunakan existing live `product_images` table dan ownership inheritance melalui `products`. Migration baru hanya untuk approved metadata/schema gaps.

**Storage impact:** Gunakan existing private `products` bucket dan verified owner-path policies; application layer menambahkan size/type validation.

**Authentication/RLS impact:** Authenticated owner only; path prefix dimulai user ID; database relationship diverifikasi.

**UI states:** Drag-over, selected, invalid file, uploading, progress, uploaded, retry, unavailable, orphan reconciliation, remove confirmation.

**Acceptance criteria:** Anonymous cannot access; wrong owner path denied; upload metadata consistent; failed upload tidak meninggalkan broken record; private preview works.

**Lint/build requirements:** Lint/build dan upload/storage tests lulus.

**Manual tests:** Valid/invalid MIME, oversize, zero-byte, network interruption, duplicate filename, refresh signed URL, unauthorized path.

**Definition of done:** Bucket/policies dilaporkan exact, advisors lulus atau findings ditangani, manual tests disetujui.

**Rollback considerations:** Jangan hapus asset saat rollback tanpa backup/approval; policy rollback tidak boleh membuka public access.

**Dependencies:** Sprint 3 dan approved Storage ownership design.

## Sprint 5 — Model Library, Style Library, and Prompt Presets

**Status:** NOT STARTED.

**Objective:** Menyediakan reusable creative catalogs untuk workflow.

**User value:** Owner tidak perlu menyusun ulang model, style, dan prompt pattern pada setiap proyek.

**Included scope:** Model CRUD/archive, Style CRUD/archive, Prompt Preset CRUD/archive, search/tags, optional private model reference upload jika approved.

**Excluded scope:** Automatic recommendation, provider execution, version history penuh, dan public sharing.

**Expected routes:** Nested library pages di Fashion Studio atau routes seperti `/fashion-studio/models`, `/fashion-studio/styles`, `/fashion-brain/presets`; bukan sidebar baru.

**Expected files/modules:** Catalog routes, forms, selectors, validation, data access, optional Storage adapter.

**Database impact:** Gunakan existing live `models`, `styles`, dan `prompt_presets` tables beserta ownership/indexes/RLS. Migration baru hanya untuk approved archival/schema gaps; height meaning tetap harus diputuskan.

**Storage impact:** Existing private `models` bucket tersedia; penggunaan oleh application UI tetap membutuhkan upload validation dan authorized access implementation.

**Authentication/RLS impact:** Owner-only records dan private assets; anonymous blocked.

**UI states:** Empty, search-empty, create/edit/save, invalid metadata, archive, image upload states jika included.

**Acceptance criteria:** Reusable records persist; owner-only access; archived catalog item tidak merusak historical relationship; selectors accessible.

**Lint/build requirements:** Lint/build dan catalog tests lulus.

**Manual tests:** CRUD/archive, search/tag, duplicate names, optional height validation, inaccessible asset, keyboard selector.

**Definition of done:** Schema/policies reviewed, UI approved, exact changes reported, PR merged.

**Rollback considerations:** Preserve referenced records; avoid cascading deletes; Storage cleanup requires separate approval.

**Dependencies:** Sprint 1–4; decisions on unit, snapshot/versioning, dan model asset provenance.

## Sprint 6 — Fashion Studio workflow

**Status:** NOT STARTED.

**Objective:** Menggabungkan product, model, style, dan prompt menjadi satu project workflow.

**User value:** Owner dapat bergerak dari product selection ke image prompt tanpa kehilangan context.

**Included scope:** Project creation/draft, wizard steps, product/model/style selectors, visual settings, prompt editor, copy/save, external-tool handoff.

**Excluded scope:** Direct image-generation API, motion generation, publishing automation, dan complex collaboration.

**Expected routes:** `/fashion-studio`, `/fashion-studio/projects/new`, `/fashion-studio/projects/[id]` atau equivalent approved nested flow.

**Expected files/modules:** Project data access, wizard state, prompt composition, selectors, draft persistence, validation, tests.

**Database impact:** Gunakan existing live `projects` table dan same-owner relationship policies. Optional prompt draft fields/tables hanya melalui focused reviewed migration.

**Storage impact:** Read authorized product/model assets; generated-images bucket belum wajib.

**Authentication/RLS impact:** Project dan seluruh selected relationships harus dimiliki owner yang sama.

**UI states:** New draft, step complete/current, invalid selection, unsaved, saving, saved, external handoff, resume draft, unavailable.

**Acceptance criteria:** Owner dapat menyelesaikan wizard sampai saved prompt; back/resume tidak kehilangan draft; cross-owner relationship ditolak; sidebar tidak bertambah.

**Lint/build requirements:** Lint/build, wizard tests, dan relationship-validation tests lulus.

**Manual tests:** Happy path, missing selection, back/forward, refresh/resume, concurrent save, copy prompt, invalid relationship.

**Definition of done:** End-to-end manual workflow disetujui Vann dan architecture/security review lulus.

**Rollback considerations:** Preserve draft projects; feature flag/route rollback lebih aman daripada menghapus data.

**Dependencies:** Sprint 3 dan 5; approved project ownership relationships.

## Sprint 7 — Product analysis and Fashion Brain

**Status:** NOT STARTED.

**Objective:** Menyediakan AI-assisted product analysis dan creative direction yang dapat direview owner.

**User value:** Owner mendapat structured product insights tanpa kehilangan kontrol atas data final.

**Included scope:** Analysis form/result, category/color/material/gender/keywords/summary/confidence, owner correction, prompt preset use, external/manual provider orchestration atau satu approved provider.

**Excluded scope:** Multi-provider comparison, autonomous decisions, immutable run history lengkap, raw secret logging.

**Expected routes:** `/fashion-brain`, product-specific analysis view, optional project creative-direction panel.

**Expected files/modules:** Analysis service boundary, provider adapter bila approved, structured validation, result/review UI, tests.

**Database impact:** Gunakan existing live `product_analysis` one-to-one current projection dengan ownership inheritance; optional run table ditunda.

**Storage impact:** Read product source images; tidak membuat bucket baru.

**Authentication/RLS impact:** Owner-only analysis; provider call server-side; key tidak pernah ke browser.

**UI states:** No analysis, preparing, external/manual, processing, result, low confidence, corrected, failed, retryable/non-retryable.

**Acceptance criteria:** Structured result valid; owner dapat mengoreksi; analysis milik product owner; failure tidak menghapus prior accepted analysis.

**Lint/build requirements:** Lint/build, schema validation, provider mock tests, dan security checks lulus.

**Manual tests:** Valid/invalid image context, missing provider config, timeout, malformed output, correction, rerun, privacy inspection.

**Definition of done:** Provider scope/budget approved, result review accepted, data lineage jelas, PR merged.

**Rollback considerations:** Provider integration dapat dinonaktifkan tanpa menghapus accepted analysis; migration rollback preserves data.

**Dependencies:** Sprint 3–6 dan first-provider **OPEN DECISION**.

## Sprint 8 — Generated image management and Motion Studio

**Status:** NOT STARTED.

**Objective:** Menyimpan generated images dan menyiapkan motion/image-to-video workflow.

**User value:** Owner dapat memilih output image, membuat motion prompt, dan menyimpan video result dalam project context.

**Included scope:** Private generated-images/generated-videos storage, asset metadata, gallery, selected asset, motion prompt editor, external provider handoff, video reference/upload.

**Excluded scope:** Mandatory direct generation APIs, background rendering farm, automatic moderation, dan public CDN.

**Expected routes:** Project asset gallery, `/motion-studio`, `/motion-studio/projects/[id]` atau approved equivalent.

**Expected files/modules:** Asset data model, Storage adapters, gallery/viewer, motion workflow, prompt editor, tests.

**Database impact:** Purpose-specific generated asset/motion records attached to `projects`; jangan overload `projects` dengan provider payload.

**Storage impact:** Existing private `generated-images` dan `generated-videos` buckets beserta owner-scoped policies digunakan; application upload/gallery layer belum ada.

**Authentication/RLS impact:** Owner-only assets; selected source dan project harus same owner; signed access expires.

**UI states:** Empty gallery, uploading, processing external, ready, failed, selected, preview unavailable, motion draft.

**Acceptance criteria:** Assets terhubung ke project; unauthorized access denied; motion prompt tersimpan; video upload/reference dapat direview.

**Lint/build requirements:** Lint/build, asset relationship, Storage, dan large-file handling tests lulus.

**Manual tests:** Image/video types, large upload, interrupted upload, signed URL expiry, cross-project selection, external handoff.

**Definition of done:** Schema/buckets/policies exact report, advisors, manual media tests, PR approval.

**Rollback considerations:** Jangan delete media otomatis; disable UI/adapter dan pertahankan metadata sampai cleanup approved.

**Dependencies:** Sprint 4, 6, dan approved asset lifecycle.

## Sprint 9 — Caption, CTA, hashtag, and Publishing workspace

**Status:** NOT STARTED.

**Objective:** Menghasilkan dan menyimpan publishing-ready copy serta checklist untuk TikTok/Shopee.

**User value:** Owner mendapatkan satu paket teks dan aset yang siap ditinjau dan dipindahkan ke platform.

**Included scope:** Hook, caption, CTA, hashtags, script, platform variants, copy actions, selected assets, review checklist, prepared status.

**Excluded scope:** Platform login, automatic scheduling, direct publishing, comment management, dan performance analytics.

**Expected routes:** `/publishing`, `/publishing/projects/[id]` atau approved project publishing panel.

**Expected files/modules:** Publishing data model, copy generator/orchestrator, platform formatter, checklist UI, tests.

**Database impact:** Purpose-specific publishing records linked to project; version/status strategy disetujui sebelum migration.

**Storage impact:** Read selected private assets; tidak menambah public access.

**Authentication/RLS impact:** Owner-only publishing records dan asset relationship.

**UI states:** Empty, generating/manual draft, editing, saved, ready-for-review, prepared, failed, copied.

**Acceptance criteria:** TikTok/Shopee variants tersimpan; selected assets benar; copy actions bekerja; status tidak mengklaim published tanpa bukti.

**Lint/build requirements:** Lint/build, formatting, persistence, dan relationship tests lulus.

**Manual tests:** Long/empty copy, special characters, copy-all, platform switch, missing asset, provider unavailable, ownership.

**Definition of done:** Vann menyetujui output format dan checklist; no automated publish side effect; PR merged.

**Rollback considerations:** Preserve copy records; provider call dapat dinonaktifkan; tidak ada credential platform yang perlu dihapus.

**Dependencies:** Sprint 6–8.

## Sprint 10 — Dashboard history, recent assets, and metrics

**Status:** NOT STARTED.

**Objective:** Mengganti Dashboard placeholders dengan data owner yang faktual dan actionable.

**User value:** Owner langsung melihat pekerjaan terbaru, aset, bottleneck, dan tindakan berikutnya.

**Included scope:** Recent projects, recent assets, quick actions, approved metrics, empty/loading/error states, resilient widget loading.

**Excluded scope:** Advanced BI, affiliate revenue attribution, provider cost analytics, dan team metrics.

**Expected routes:** `/dashboard`; links menuju existing detail/workflow routes.

**Expected files/modules:** Dashboard query layer, cards/lists, Suspense boundaries, metric definitions, tests.

**Database impact:** Prefer existing indexed queries; index baru hanya berdasarkan measured query plan. Event/activity table hanya bila disetujui.

**Storage impact:** Authorized thumbnails only; tidak mengubah bucket privacy.

**Authentication/RLS impact:** Semua aggregates scoped ke owner; count tidak bocorkan record lain.

**UI states:** First-use empty, loading per widget, partial error, connected/unavailable, populated, stale/retry bila relevan.

**Acceptance criteria:** Tidak ada fake data; widget failure tidak merusak page; links benar; metrics memiliki definisi dan query yang dapat diuji.

**Lint/build requirements:** Lint/build, query tests, dan performance check lulus.

**Manual tests:** Empty account, populated account, partial service failure, large list, mobile, keyboard navigation.

**Definition of done:** Placeholder TODO di Dashboard hilang, metrics disetujui Vann, performance acceptable, PR merged.

**Rollback considerations:** Widget dapat direvert independen; tidak hapus indexes/data tanpa approval.

**Dependencies:** Sprint 3–9 dan metric **OPEN DECISION**.

## Sprint 11 — Research workspace

**Status:** DEFERRED.

**Objective:** Membangun first-domain Research untuk saham Indonesia tanpa mencampur datanya dengan affiliate workflow.

**User value:** Owner memiliki ruang riset yang jelas dan tidak mengganggu affiliate production workflow.

**Included scope:** Indonesian-stock requirements, approved data sources, views, save/bookmark behavior, dan security boundary.

**Excluded scope:** Crypto research sampai Indonesian-stock workflow stabil, trading execution, dan penggunaan affiliate tables untuk data saham tanpa desain.

**Expected routes:** `/research` dan nested Indonesian-stock routes yang disetujui.

**Expected files/modules:** Research-specific domain modules dan data model; tidak ditempelkan ke project schema tanpa relationship yang disetujui.

**Database impact:** Separate tables/schema bila diperlukan setelah review.

**Storage impact:** Ditentukan oleh domain; default tidak ada public bucket.

**Authentication/RLS impact:** Owner-only; source credentials server-side.

**UI states:** Placeholder, empty, loading, source unavailable, results, saved items sesuai future scope.

**Acceptance criteria:** Indonesian-stock workflow stabil dan dapat diuji; data separation jelas; no scope leak ke core workflow; owner acceptance. Crypto tetap absent.

**Lint/build requirements:** Lint/build dan source/domain tests lulus.

**Manual tests:** Ditentukan setelah requirements; wajib mencakup source failure, privacy, dan navigation separation.

**Definition of done:** Indonesian-stock requirements, architecture review, implementation, tests, dan PR approval selesai.

**Rollback considerations:** Research modules dan data source adapters dapat dinonaktifkan independen.

**Dependencies:** Sprint 1–2; idealnya setelah V1 core selesai. Crypto research bergantung pada stabilitas dan acceptance domain saham Indonesia.

## Sprint 12 — Windows desktop packaging

**Status:** DEFERRED.

**Objective:** Mengemas product core sebagai aplikasi Windows tanpa memecah architecture atau keamanan.

**User value:** Owner mendapat workflow desktop, file/clipboard integration, dan launch experience yang lebih native.

**Included scope:** Wrapper selection, packaging, secure session storage, deep links/file picker sesuai approval, code signing, update strategy, installer, crash/report policy.

**Excluded scope:** Menulis ulang product core, menyimpan service-role key, unreviewed native permissions, dan offline database sync sebelum desain.

**Expected routes:** Web routes tetap source UI; wrapper-specific entry/deep-link mapping ditentukan.

**Expected files/modules:** Desktop workspace/package area yang disetujui; exact structure bergantung pada wrapper.

**Database impact:** Tidak mengubah schema hanya untuk packaging; offline sync memerlukan sprint terpisah.

**Storage impact:** Reuse authorized Supabase access; local cache/retention policy wajib ditentukan.

**Authentication/RLS impact:** RLS tetap authoritative; session disimpan dengan secure OS mechanism; secret key dilarang.

**UI states:** First launch, login, offline/unavailable, update available, download/install, permission denied, file import.

**Acceptance criteria:** Installer berjalan pada supported Windows; update/signing plan; no secret leakage; web behavior tetap konsisten; uninstall/data behavior jelas.

**Lint/build requirements:** Existing web lint/build plus desktop package/build checks lulus.

**Manual tests:** Clean install, upgrade, uninstall, login/session, file import, network loss, DPI scaling, keyboard, Windows security prompts.

**Definition of done:** Wrapper dan Windows versions disetujui, security review, signed distributable, rollback installer, owner acceptance.

**Rollback considerations:** Distribusi versi sebelumnya harus tersedia; database contract backward-compatible; auto-update dapat dihentikan.

**Dependencies:** Stable web V1, backend contracts, dan desktop **OPEN DECISION**.

## Roadmap open decisions

2. **OPEN DECISION:** Unit dan business meaning `models.height`.
3. **OPEN DECISION:** First direct AI provider dan budget sebelum provider-specific implementation.
4. **OPEN DECISION:** Versioning/snapshot strategy untuk model, style, prompt, dan analysis.
5. **OPEN DECISION:** Asset lifecycle, archival, deletion, dan retention sebelum media sprints.
6. **OPEN DECISION:** Consent dan provenance untuk model-reference assets.
7. **OPEN DECISION:** Desktop wrapper, supported Windows versions, native behavior, secure storage, signing, dan update mechanism.
8. **OPEN DECISION:** Numeric success metrics dan performance budgets sebelum Sprint 10 acceptance.
