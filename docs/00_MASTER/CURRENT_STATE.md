# Current State — Vann AI Studio

Tanggal baseline: 22 Juli 2026; diperbarui 23 Juli 2026 untuk Sprint 3 dan Sprint 4.
Branch sumber kebenaran: `main`
Implementation baseline: commit `9a114c9` (implementation baseline after merged PR #10).

## Cara membaca status

Dokumen ini membedakan fakta implementasi dari rencana. Urutan sumber kebenaran yang digunakan:

1. Current repository implementation.
2. Verified live infrastructure reports approved by Vann dan Liora.
3. Applied Supabase migration verification reports.
4. Existing architecture documents.
5. `CURRENT_STATE.md`.
6. `MASTER_PRD.md`.
7. `ROADMAP.md`.
8. Future assumptions.

Jika repository tidak menyimpan external-platform artifacts tetapi verified live report tersedia, live fact tetap dicatat sebagai completed dan perbedaannya disebut documentation drift.

## Completed

### Application foundation

- Sprint 0 — Technical foundation telah completed.
- Project Next.js App Router tersedia dan menggunakan TypeScript.
- Tailwind CSS v4 dan PostCSS terkonfigurasi.
- ESLint menggunakan `eslint-config-next` Core Web Vitals dan TypeScript rules.
- Root metadata, Geist font loading, global CSS, dan workspace layout tersedia.
- `package-lock.json` tersedia untuk reproducible dependency installation.
- Next.js tetap pada stable `16.2.10`; scoped PostCSS override melindungi bundled dependency yang sebelumnya rentan.

### Workspace shell and routes

- Route group `app/(workspace)/` tersedia.
- Sprint 2 — Design system and application shell telah completed dan diverifikasi di production.
- Shared responsive protected shell menggunakan visual system dark navy futuristik dengan accent cyan dan violet.
- Reusable custom UI primitives tersedia untuk icon, badge, button, card, empty state, input, page header, dan section heading.
- Route berikut tersedia:
  - `/dashboard`
  - `/fashion-studio`
  - `/fashion-brain`
  - `/motion-studio`
  - `/publishing`
  - `/research`
  - `/settings`
- Root route `/` melakukan redirect ke `/dashboard`.
- Navigation mempertahankan tujuh workspace utama.

### Dashboard

- Dashboard menampilkan heading, deskripsi, dan placeholder sections untuk Recent Projects, Quick Actions, dan Recent Assets.
- Dashboard menampilkan status read-only “Supabase connected” atau “Supabase unavailable”.
- Health check menggunakan server-only `GET /auth/v1/health`, timeout lima detik, dan safe failure state.
- Health response body, environment values, publishable key, dan error detail tidak dirender.
- Route `/dashboard` dirender dinamis agar status tidak dibekukan pada build time.

### Supabase application foundation

- Dependency `@supabase/ssr` dan `@supabase/supabase-js` dipin.
- Browser client tersedia di `lib/supabase/client.ts`.
- Server client tersedia di `lib/supabase/server.ts` dan menggunakan async `cookies()` pattern Next.js 16.
- Environment-variable validation tersedia dengan pesan konfigurasi yang dapat ditindaklanjuti.
- `.env.example` tersedia dengan placeholder kosong:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Tidak ada service-role atau secret key di repository.

### Live Supabase database and Storage foundation

Product-owner and system-verified live infrastructure facts mengonfirmasi:

- migration `20260721171620_v1_database_foundation` berhasil applied;
- migration `20260722052154_ownership_rls_and_storage_policies` berhasil applied;
- tujuh public tables tersedia: `products`, `product_images`, `models`, `styles`, `prompt_presets`, `projects`, dan `product_analysis`;
- RLS aktif pada seluruh tujuh tabel dan seluruhnya saat ini berisi nol row;
- `products`, `models`, `styles`, `prompt_presets`, dan `projects` memiliki `owner_id uuid NOT NULL` → `auth.users(id)` dengan `ON DELETE RESTRICT`;
- kelima owner indexes tersedia;
- `product_images` dan `product_analysis` memperoleh ownership melalui `products` tanpa duplicate `owner_id`;
- tepat 28 authenticated table policies tersedia: SELECT, INSERT, UPDATE, dan DELETE pada setiap tabel;
- direct-owner policies berlaku untuk `products`, `models`, `styles`, dan `prompt_presets`;
- project policies memvalidasi same-owner product, model, dan style relationships;
- child-table policies menurunkan ownership melalui parent product;
- `authenticated` hanya memiliki SELECT, INSERT, UPDATE, dan DELETE pada application tables, tanpa TRUNCATE, REFERENCES, atau TRIGGER;
- `anon` tidak memiliki application-table privileges atau application RLS policies;
- private buckets `products`, `models`, `generated-images`, dan `generated-videos` tersedia dan berisi nol object;
- empat authenticated Storage policies tersedia untuk SELECT, INSERT, UPDATE, dan DELETE;
- Storage policies membatasi approved buckets dan first path segment ke authenticated user ID.

### Live Auth foundation

- Email/password authentication enabled.
- Public signup disabled.
- Anonymous-user authentication disabled.
- Tepat satu confirmed Auth user tersedia.
- Tidak ada owner email, UUID, password, atau personal information yang dicatat.
- Sprint 1 application authentication and route protection telah completed dan diverifikasi di production; owner login, protected navigation, operational Supabase indicator, dan sign out lulus smoke test.

### Delivery infrastructure

- Repository GitHub terhubung ke `vanpaat21032003-hub/vann-ai-studio`.
- Riwayat menunjukkan penggunaan feature branch dan Pull Request untuk foundation, root redirect, Supabase client, dan connection status.
- `origin/main` adalah baseline branch saat dokumen ini dibuat.
- Environment configuration tersedia secara lokal dan di Vercel tanpa menyimpan nilainya di repository.
- Product owner dan system verification mengonfirmasi GitHub/Vercel integration, production deployment, dan production Dashboard yang menampilkan “Supabase connected”.
- Sprint 3 dan Sprint 4 merged ke `main` melalui PR #9 dan PR #10; keduanya telah production verified.

### Product Library

- Sprint 3 — Product Library telah completed dan diverifikasi di production.
- Product list/card view dengan search dan status filter tersedia di `/fashion-studio/products`.
- Create, detail, edit, dan archive tersedia melalui server actions.
- Permanent deletion tersedia dengan title-confirmation guard; delete diblokir jika product masih memiliki image records.
- Owner-scoped RLS ditegakkan: `owner_id` selalu diambil dari `auth.getClaims().sub`, tidak pernah dari client-supplied data.
- Loading, error, not-found, dan filtered-empty states tersedia.
- `lib/products/schema.ts`, `lib/products/data.ts`, `lib/products/actions.ts`, serta komponen dan route pages tersedia.

### Private product images

- Sprint 4 — Private product image upload and Storage telah completed dan diverifikasi di production.
- Private `products` bucket digunakan; tidak ada public URL yang digunakan atau disimpan.
- Storage object path mengikuti pola `{ownerId}/{productId}/{uuid}.{ext}`; ownership diverifikasi server-side sebelum setiap operasi.
- Upload hanya menerima JPEG, PNG, dan WebP dengan batas maksimum 8 MB; validasi dilakukan pada metadata yang disimpan Supabase Storage, bukan hanya pada client input.
- Preview menggunakan short-lived signed URL dengan TTL 5 menit; signed URL tidak disimpan sebagai permanent reference.
- Deletion menghapus Storage object terlebih dahulu, kemudian metadata record di `product_images`; orphaned object dibersihkan jika insert metadata gagal.
- `lib/products/image-constants.ts`, `lib/products/image-data.ts`, `lib/products/image-actions.ts`, `ProductImageUpload.tsx`, `ProductImageGallery.tsx`, dan `ProductImageDeleteControl.tsx` tersedia.

## In progress

- Tidak ada application feature yang sedang dalam progress saat ini.

## Not started

### Core product capabilities

- Model Library.
- Style Library.
- Prompt Presets UI.
- Fashion Studio wizard.
- Fashion Brain analysis workflow.
- Motion Studio workflow.
- Caption, hashtag, CTA, hook, dan script workflow.
- TikTok/Shopee preparation checklist.
- Project history dan recent assets berbasis data nyata.
- Publishing automation.
- Windows desktop packaging.

## Deferred

- Direct integration dengan banyak AI provider sekaligus.
- Automated TikTok publishing.
- Automated Shopee publishing.
- Scheduling dan social-platform credential management.
- Crypto research sampai workflow saham Indonesia stabil.
- Advanced Indonesian-stock Research features di luar sprint yang disetujui.
- Provider failover, cost tracking, dan automated generation pipelines.
- Multi-user/team/agency support.

## Known warnings

### Non-blocking technical warnings

- npm 11 pernah menampilkan install-script approval advisory untuk `sharp@0.34.5` dan `unrs-resolver@1.12.2`. Lint dan production build tetap berhasil setelah instalasi saat ini.
- Git pada Windows menampilkan peringatan konversi LF ke CRLF untuk beberapa working-copy files. `git diff --check` tetap lulus.
- Scoped override memaksa PostCSS milik Next.js ke `8.5.20`. Ini adalah mitigasi dependency sementara dan harus ditinjau ketika Next.js mengadopsi patched PostCSS secara langsung.
- Production build membutuhkan network access untuk mengambil Google Fonts melalui `next/font/google` bila font belum tersedia di cache build environment.

### Product and documentation warnings

- Sebagian besar workspace masih berupa styled empty state karena product workflows belum diimplementasikan.
- Sidebar memiliki active state dan responsive behavior; collapsed state dan dedicated mobile drawer belum diimplementasikan.
- Sprint 2 menyediakan custom design tokens dan reusable primitives tanpa Shadcn dependency.
- `AI_CONTEXT.md` menggambarkan target user dan module yang lebih luas daripada private affiliate-fashion workspace yang sekarang ditetapkan.
- Research page saat ini masih placeholder. Domain pertama telah ditetapkan sebagai saham Indonesia; crypto ditunda.

## Current infrastructure

### GitHub

- Repository: `vanpaat21032003-hub/vann-ai-studio`.
- Default integration branch: `main`.
- Workflow yang sudah terbukti: focused feature branch → Pull Request → merge ke `main`.
- Tidak ada perubahan Git history dalam penyusunan dokumen ini.

### Vercel

- Product owner dan system verification mengonfirmasi foundation deployed successfully dan production Dashboard menampilkan “Supabase connected”.
- Repository tidak memiliki `vercel.json`; deployment menggunakan platform defaults atau configuration di Vercel settings.
- Environment configuration telah tersedia di Vercel; nilainya tidak tersimpan di repository dan tidak dicatat di dokumen ini.

### Supabase

- Client foundation dan health connectivity tersedia.
- Local dan production connectivity telah berhasil diverifikasi tanpa menampilkan URL atau key.
- Live project identifier, URL, key, user identity, dan private data tidak dicatat.

### Auth

- Application-layer login, sign-out, session refresh, dan route protection tersedia serta telah diverifikasi di production.
- Live Email/password Auth enabled.
- Public signup dan anonymous-user authentication disabled.
- Tepat satu confirmed owner account tersedia.

### Database, RLS, and Storage

- Original V1 architecture pada `DATABASE.md` dan `ERD.md` telah menjadi dasar live V1 schema.
- Live schema telah applied dan diperkuat oleh ownership/RLS/Storage migration.
- Tujuh tables, ownership model, owner indexes, hardened grants, 28 table policies, empat private buckets, dan empat Storage policies telah diverifikasi.
- Semua application tables dan buckets saat ini kosong.
- Architecture documents partially outdated karena belum mencatat later ownership, grants, RLS, dan Storage migration.

## Implementation/documentation contradictions

| Area | Bukti saat ini | Requirement target | Status |
| --- | --- | --- | --- |
| Architecture docs | `DATABASE.md`/`ERD.md` belum memuat later `owner_id`, grants, RLS, dan Storage ownership migration. | Live secured schema telah applied. | Documentation drift; alignment task terpisah. |
| Research | Route placeholder menyebut saham Indonesia. | Saham Indonesia adalah first domain; crypto later. | Direction fixed; implementation masih deferred. |
| Target users | `AI_CONTEXT.md` menyebut banyak persona dan future business modules. | Master direction menetapkan satu private owner. | Master PRD menjadi arah produk; file lama adalah documentation drift. |

## Next recommended sprint

### Sprint 5 — Model Library, Style Library, and Prompt Presets

Sprint 5 adalah next implementation sprint. Scope dan acceptance criteria mengikuti approval Sprint 5 terpisah. Dua open decision harus diselesaikan sebelum implementasi dimulai: unit dan business meaning `models.height`, dan apakah model-reference image upload termasuk dalam Sprint 5 atau ditunda.

## Open decisions and documentation drift

2. **OPEN DECISION:** Unit dan business meaning `models.height` — harus diputuskan sebelum Sprint 5 ModelForm diimplementasikan.
3. **OPEN DECISION:** Apakah model-reference image upload termasuk dalam Sprint 5 atau ditunda ke sprint berikutnya.
4. **OPEN DECISION:** First direct AI provider dan budget.
5. **OPEN DECISION:** Versioning/snapshot strategy.
6. **OPEN DECISION:** Asset retention dan deletion lifecycle.
7. **OPEN DECISION:** Model-reference consent dan provenance.
8. **OPEN DECISION:** Numeric success metrics dan performance budgets.
9. **OPEN DECISION:** Desktop wrapper dan Windows distribution decisions.
10. **OPEN DECISION:** Apakah `AI_CONTEXT.md` diperbarui melalui documentation-only task terpisah.
11. Documentation drift: `DATABASE.md` dan `ERD.md` belum merefleksikan applied ownership, grants, RLS, dan Storage migration.
