# Delivery Rules — Vann AI Studio

Status: permanent team workflow
Applies to: planning, documentation, code, database, Storage, Auth, GitHub, Vercel, dan future desktop work

## 1. Team roles

### Vann — Product Owner and tester

- Menentukan prioritas dan nilai produk.
- Menyetujui product decisions dan seluruh `OPEN DECISION`.
- Menyetujui scope sprint sebelum implementation.
- Melakukan manual testing.
- Menyetujui staging, commit, push, merge, release, dan deployment sesuai tahap kerja.
- Menyetujui destructive action, data migration berisiko, dan perubahan external infrastructure.

### Liora — System Architect, product planner, and reviewer

- Mendefinisikan requirements dan sprint boundaries.
- Menjaga konsistensi antara product direction, architecture, security, dan delivery sequence.
- Meninjau output Bowl.
- Menjaga database ownership, Auth, RLS, Storage, dan API boundary.
- Mencatat drift dan mengubahnya menjadi explicit decision, bukan silent implementation change.

### Bowl — Codex implementation engineer

- Membaca project documentation sebelum coding.
- Menginspeksi current repository dan relevant infrastructure facts.
- Bekerja hanya dalam approved sprint dan approved files.
- Tidak mengubah implementation untuk “menyesuaikan dokumen” tanpa approval.
- Melaporkan exact changes, validation results, warnings, conflicts, dan remaining risk.
- Berhenti pada approval gate yang ditentukan Vann.

## 2. Source-of-truth order

Jika sumber berbeda, gunakan urutan:

1. Current repository implementation.
2. Verified live infrastructure reports approved by Vann dan Liora.
3. Applied Supabase migration verification reports.
4. Existing architecture documents.
5. `docs/00_MASTER/CURRENT_STATE.md`.
6. `docs/00_MASTER/MASTER_PRD.md`.
7. `docs/00_MASTER/ROADMAP.md`.
8. Future assumptions.

PRD menetapkan arah, tetapi tidak boleh menyatakan fitur selesai tanpa implementation atau verified live evidence. Jika repository dan verified live infrastructure berbeda, catat sebagai documentation drift; jangan membuang verified live fact.

Current protected baseline mencakup applied migrations `20260721171620_v1_database_foundation` dan `20260722052154_ownership_rls_and_storage_policies`, tujuh RLS-enabled application tables, hardened grants, empat private buckets, Storage ownership policies, disabled public/anonymous signup posture, satu confirmed owner account, dan verified production connectivity. Future sprint wajib mempertahankan baseline ini.

## 3. Required reading before coding

Bowl harus membaca:

- `docs/00_MASTER/MASTER_PRD.md`
- `docs/00_MASTER/CURRENT_STATE.md`
- `docs/00_MASTER/UI_BLUEPRINT.md`
- `docs/00_MASTER/ROADMAP.md`
- `docs/00_MASTER/DELIVERY_RULES.md`
- relevant architecture documents
- `AGENTS.md`
- `AI_CONTEXT.md` sebagai legacy context, dengan master docs sebagai arah produk yang lebih baru
- relevant local Next.js documentation di `node_modules/next/dist/docs/`
- current documentation/changelog untuk Supabase atau dependency lain yang berubah cepat

Jika file wajib belum ada atau saling bertentangan, Bowl harus melaporkan conflict sebelum implementation.

## 4. Sprint start protocol

Sebelum write action:

1. Konfirmasi sprint dan objective.
2. Fetch latest `origin/main`.
3. Pastikan working tree tidak memiliki unrelated changes.
4. Buat focused branch dari latest `origin/main`.
5. Baca required documents.
6. Inspeksi current implementation dan relevant tests/configuration.
7. Tulis intended files/modules dan excluded scope.
8. Identifikasi database, Storage, Auth/RLS, environment, dan deployment impact.
9. Identifikasi approval gates.
10. Minta direction jika keputusan yang hilang akan mengubah architecture atau product behavior secara material.

## 5. Git rules

- Selalu fetch latest `origin/main` sebelum new work.
- Buat focused feature branch dari `origin/main`.
- Gunakan prefix `codex/` kecuali Vann meminta nama lain.
- Jangan push langsung ke `main`.
- Jangan force push.
- Satu focused concern per Pull Request.
- Jangan reuse unrelated old branch.
- Jangan amend shared history tanpa explicit approval.
- Jangan rebase, cherry-pick, merge, atau rewrite history tanpa explicit approval.
- Jangan stage, commit, push, merge, delete branch, atau create Pull Request tanpa approval untuk tahap tersebut.
- Preserve remote `README.md` dan existing Git history.
- Stage explicit approved paths; jangan default ke `git add -A` pada mixed working tree.
- Setelah branch rename, periksa upstream agar tidak accidental push ke old remote branch.
- Jangan delete old remote branch kecuali target dan approval jelas.
- Jangan menggunakan destructive Git commands seperti `git reset --hard` untuk menyelesaikan scope conflict.

## 6. Branch and Pull Request rules

- Branch name menjelaskan satu outcome, contoh `codex/auth-route-protection`.
- Commit message ringkas dan sesuai actual change.
- Pull Request default adalah draft sampai Vann menyatakan ready.
- PR target adalah `main` kecuali ditentukan lain.
- PR description menjelaskan:
  - apa yang berubah;
  - alasan perubahan;
  - user impact;
  - database/Storage/Auth impact;
  - validation;
  - warnings dan rollback.
- PR tidak boleh membawa unrelated formatting, dependency, generated output, atau documentation rewrite.
- Merge dan deployment tetap membutuhkan approval Vann.

## 7. Coding rules

Sebelum coding:

- inspect current implementation;
- report intended files;
- confirm branch dan base;
- confirm no unrelated changes;
- read relevant local Next.js docs karena project version dapat memiliki breaking changes.

Saat coding:

- work only within sprint scope;
- avoid unrelated refactors;
- gunakan TypeScript strict-compatible patterns;
- pertahankan App Router conventions;
- gunakan lazy initialization untuk environment-dependent clients;
- push Client Components ke boundary terkecil;
- jangan edit `.next/`, `out/`, `build/`, atau generated output;
- jangan hardcode credentials atau environment values;
- jangan menambah dependency tanpa scope dan approval;
- jangan mengubah configuration hanya untuk menyembunyikan error;
- jangan memperbaiki unrelated warning secara otomatis.

Setelah coding:

- inspect exact diff;
- run `git diff --check`;
- run `npm run lint`;
- run `npm run build`;
- run relevant tests;
- lakukan manual test yang ditentukan sprint;
- scan staged/proposed files untuk secret dan unexpected files;
- report warnings honestly;
- wait for review before commit jika approval gate mensyaratkan.

## 8. File-scope rules

- Approved file list adalah batas, bukan saran.
- Existing user changes dianggap milik user dan tidak boleh ditimpa.
- File di luar scope hanya boleh dibaca, tidak diubah.
- Rename, move, delete, dan bulk formatting membutuhkan explicit approval.
- Generated files hanya berubah melalui tool resmi dan hanya jika included scope.
- `.env.local`, certificates, logs, build output, `.next/`, dan secrets tidak boleh staged.
- `.env.example` hanya berisi placeholder aman.

## 9. Security rules

- Jangan commit `.env.local` atau real environment values.
- Jangan expose secret, service-role, management, OAuth client secret, atau private key.
- Jangan log password, token, session, cookie, user UUID, private email, atau private asset URL.
- Publishable key boleh digunakan sesuai Supabase design tetapi nilainya tidak perlu dicatat di documentation atau output.
- Jangan melemahkan RLS untuk menyelesaikan UI/data error.
- Jangan membuat anonymous application-data access tanpa explicit approval.
- Jangan menggunakan client-supplied `owner_id` sebagai authority.
- Validate ownership di database dan server boundary.
- Jangan execute destructive database change tanpa backup/rollback review dan explicit approval.
- External provider credentials hanya dikelola melalui approved environment/secret store.
- Error user-facing tidak menampilkan raw provider/database response sensitif.
- Proxy/middleware tidak boleh menjadi satu-satunya authorization gate.

## 10. Supabase rules

### Before database work

- Periksa current schema dan migration history dengan read-only method yang approved.
- Reconcile repository migrations dengan live schema.
- Recheck row counts sebelum destructive operation.
- Baca relevant Supabase changelog/docs.
- Tentukan tables, columns, constraints, indexes, grants, policies, triggers, functions, dan buckets yang terkena.
- Konfirmasi ownership model dan anonymous behavior.

### During database work

- Gunakan migration untuk database DDL.
- Terapkan satu focused migration pada satu waktu.
- Jangan invent migration filename jika Supabase CLI tersedia; gunakan current CLI workflow.
- Jangan insert sample data tanpa approval.
- Jangan menambahkan `SECURITY DEFINER` untuk melewati permission error.
- Jangan expose table baru tanpa RLS dan explicit grants yang sesuai.
- Pastikan UPDATE policy memiliki SELECT access serta `USING` dan `WITH CHECK` sesuai ownership.
- Project relationships hanya boleh menunjuk owned assets milik authenticated user yang sama.

### After database work

- Jalankan security dan performance advisors setelah DDL.
- Report exact tables, policies, grants, indexes, triggers, functions, dan buckets affected.
- Verify anonymous denial dan owner access.
- Verify migration list dan reproducibility.
- Jangan menyembunyikan advisor findings; classify blocker atau accepted warning dengan approval.

## 11. Storage rules

- Bucket private by default.
- Public bucket membutuhkan explicit product/security decision.
- Storage path dimulai authenticated user ID untuk owned assets.
- Validate MIME type dan size server-side bila memungkinkan.
- Signed URL memiliki expiry yang sesuai dan tidak disimpan sebagai permanent public reference.
- Metadata record dan Storage object harus memiliki reconciliation/cleanup plan.
- Upsert membutuhkan policy lengkap; jangan menambah broad policies untuk membuat upload “berhasil”.
- Delete/cleanup membutuhkan exact target dan explicit approval.

## 12. Authentication rules

- V1 menggunakan private owner email/password flow.
- Public signup tetap disabled.
- UI tidak boleh mengungkap apakah private email tertentu terdaftar lebih dari yang diperlukan.
- Session divalidasi menggunakan current Supabase SSR guidance.
- Authorization decision tidak memakai user-editable metadata.
- Logout/session expiry diuji.
- Route protection diverifikasi lewat direct URL, refresh, dan anonymous request.
- Auth setting/user changes adalah external write action dan memerlukan approval.

## 13. AI provider rules

- Manual/semi-manual external-tool orchestration adalah valid V1 strategy.
- Direct API integration membutuhkan provider, model, cost, rate limit, privacy, retention, dan failure-policy approval.
- Provider key tidak masuk client bundle.
- Structured output harus divalidasi sebelum persistence.
- Generated analysis dibedakan dari owner-confirmed facts.
- Tidak ada automatic publish atau destructive action dari model output.
- Raw prompts/responses yang mengandung private data tidak dicatat ke log tanpa retention/security design.

## 14. Vercel rules

- Production deploy berasal dari `main`.
- Feature branches memakai Preview Deployments.
- Environment values dikonfigurasi melalui Vercel settings.
- Jangan menaruh real environment values di repository.
- Jangan mengubah Vercel project settings atau domains tanpa approval.
- Verify Preview setelah push bila scope memerlukan.
- Verify Production setelah merge/deploy.
- Report build environment warnings dan route rendering changes.
- Jangan menganggap local success menjamin production environment values tersedia.

## 15. Dependency rules

- Pin critical Supabase packages dan commit lockfile changes.
- Inspect installed Next.js version dan local docs sebelum implementation.
- Jangan downgrade Next.js untuk menyelesaikan audit tanpa product/architecture decision.
- Jangan memakai canary/preview package tanpa explicit approval.
- Jangan menjalankan `npm audit fix` atau `--force` otomatis.
- Dependency override harus scoped, documented, validated, dan ditinjau ulang setelah upstream patch.
- Setelah dependency change, report exact package/lock changes, dependency tree, audit, lint, dan build.
- Install-script approval warnings harus dilaporkan, bukan disembunyikan.

## 16. Vercel and Supabase environment rules

- Repository hanya menyimpan variable names dan empty/safe placeholders.
- Browser-exposed variables harus benar-benar intended public/publishable configuration.
- Secret/server variables tidak memakai `NEXT_PUBLIC_`.
- Error message boleh menyebut nama variable, tidak boleh menyebut nilainya.
- Status UI hanya menampilkan connected/unavailable atau safe configuration state.
- Documentation tidak mencatat live URL, project ref, account email, UUID, token, atau key.

## 17. Documentation rules

Jika implementation dan documentation berbeda:

1. Jangan silently change implementation.
2. Report difference.
3. Mark sebagai `OPEN DECISION`, verification gap, atau documentation drift.
4. Tunggu product-owner approval.

Additional rules:

- Current implementation menentukan completed status.
- Future requirements memakai label V1 required, later milestone, deferred, atau open decision.
- Architecture docs dapat menjelaskan original applied design tetapi harus ditandai partially outdated jika later verified migrations belum tercermin.
- `DATABASE.md` dan `ERD.md` saat ini memiliki documentation drift terhadap applied ownership, grants, RLS, dan Storage migration; alignment dilakukan dalam task terpisah.
- Jangan menyalin secret/personal data ke docs.
- Markdown links dan file paths harus akurat.
- Update `CURRENT_STATE.md` setelah feature merge yang material dalam documentation-only task terpisah atau included approved scope.
- Jangan rewrite `DATABASE.md` atau `ERD.md` untuk menyamarkan drift; buat decision dan migration review.

## 18. Approval gates

Approval terpisah diperlukan sebelum:

- modifying files;
- staging;
- committing;
- pushing;
- opening Pull Request;
- merging;
- deploying;
- changing external Auth/database/Storage/Vercel settings;
- destructive actions;
- installing/updating/removing dependencies bila belum included scope.

Approval untuk satu tahap tidak otomatis mengizinkan tahap berikutnya.

## 19. Validation standard

Minimum code validation:

```text
git diff --check
npm run lint
npm run build
relevant automated tests
approved manual tests
```

Tambahan sesuai risk:

- `npm audit` dan `npm audit --omit=dev` untuk dependency changes.
- Dependency tree verification untuk overrides.
- Security/performance advisors setelah DDL.
- Anonymous/owner/cross-owner tests untuk RLS.
- Upload interruption dan unauthorized-path tests untuk Storage.
- Preview/Production smoke test untuk deployment.
- Accessibility keyboard/focus/contrast checks untuk UI.

Validation tidak boleh mengubah production data kecuali test plan dan approval menyatakannya.

## 20. Definition of done

Sebuah sprint/PR selesai hanya jika:

- approved scope diimplementasikan dan excluded scope tetap tidak berubah;
- exact diff direview;
- lint/build/tests lulus;
- security dan ownership checks lulus;
- manual tests Vann selesai;
- relevant docs diperbarui dalam scope yang disetujui;
- warnings dan open decisions dilaporkan;
- rollback considerations tersedia;
- commit/PR/deploy dilakukan hanya setelah approval;
- final repository dan working tree status dilaporkan.

## 21. Rollback rules

- Prefer reversible feature toggles atau focused revert.
- Jangan delete data/bucket/object sebagai default rollback.
- Database migration membutuhkan forward-fix atau reviewed rollback yang mempertahankan data.
- Policy rollback tidak boleh membuka anonymous access.
- Dependency rollback harus mempertahankan patched security baseline.
- Deployment rollback tidak menggantikan root-cause review.
- Exact rollback target dan expected impact harus dijelaskan sebelum action.

## 22. Required completion report

Setiap implementation task melaporkan minimal:

1. Current branch dan base.
2. Changed files.
3. Exact behavior implemented.
4. Database/Storage/Auth/dependency impact.
5. Lint, build, tests, audit/advisor results yang relevan.
6. Manual test results.
7. Secret/security confirmation.
8. Warnings, conflicts, dan `OPEN DECISION`.
9. Staged/commit/push/PR/deploy status.
10. Working tree status.

## 23. Permanent open decisions

- **OPEN DECISION:** Approved UI component library dan tokens.
- **OPEN DECISION:** Unit dan business meaning `models.height`.
- **OPEN DECISION:** First direct AI provider dan budget.
- **OPEN DECISION:** Versioning/snapshot strategy.
- **OPEN DECISION:** Asset retention/delete lifecycle.
- **OPEN DECISION:** Model-reference consent dan provenance.
- **OPEN DECISION:** Numeric success metrics dan performance budgets.
- **OPEN DECISION:** Desktop wrapper, Windows native behavior, dan distribution security.
- **OPEN DECISION:** Alignment `AI_CONTEXT.md` melalui documentation-only task terpisah.

Keputusan di atas hanya dapat ditutup oleh Vann setelah rekomendasi dan impact review dari Liora.
