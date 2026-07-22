# Master Product Requirements Document — Vann AI Studio

Status: baseline produk untuk perencanaan dan implementasi bertahap
Pemilik produk: Vann
Jenis produk: private AI productivity workspace untuk pembuatan konten affiliate fashion
Platform utama: aplikasi web Next.js melalui Vercel
Platform masa depan: aplikasi Windows dengan product core dan backend Supabase yang sama

## 1. Executive summary

Vann AI Studio dirancang sebagai workspace pribadi yang menyatukan alur pembuatan konten affiliate fashion dari satu screenshot produk hingga paket konten yang siap dipersiapkan untuk TikTok atau Shopee. Produk harus mengurangi perpindahan konteks antara pencatatan produk, analisis, pemilihan model dan gaya, penyusunan prompt, pengelolaan aset gambar/video, serta penulisan materi publikasi.

Prinsip utama produk adalah:

> One Screenshot. Complete Affiliate Workflow.

Versi awal boleh mengorkestrasi tool AI eksternal secara manual atau semi-manual. Integrasi API langsung bukan syarat V1 kecuali disetujui dalam sprint khusus.

## 2. Product vision

Menyediakan satu workspace yang aman, fokus, dan dapat ditelusuri untuk mengubah screenshot produk fashion menjadi proyek affiliate lengkap, sambil mempertahankan hubungan antara produk, keputusan kreatif, prompt, aset, dan keluaran publikasi.

## 3. User problem

Proses pembuatan konten affiliate saat ini berpotensi tersebar di banyak tool dan file. Akibatnya:

- informasi produk perlu dimasukkan ulang;
- prompt, gambar, video, dan caption sulit dihubungkan ke produk asal;
- pemilihan model, gaya, lighting, camera, dan background tidak konsisten;
- riwayat proyek dan versi aset mudah hilang;
- persiapan konten TikTok dan Shopee membutuhkan banyak langkah manual;
- status pekerjaan tidak terlihat dalam satu tempat.

## 4. Target user

### V1 required

- Satu pemilik privat: Vann.
- Satu akun owner yang terautentikasi.
- Tidak ada public signup atau anonymous application-data access.

### Later milestone

- Dukungan beberapa workspace, anggota tim, atau agency hanya dipertimbangkan setelah kebutuhan multi-user disetujui.

## 5. Product goals

### V1 required

1. Menyimpan produk dan screenshot sumber secara terstruktur.
2. Menjaga satu alur proyek dari produk hingga persiapan publikasi.
3. Menghasilkan atau menyimpan prompt image, motion, caption, hashtag, CTA, hook, dan script.
4. Mengelola model, style, prompt preset, gambar, dan video secara dapat ditelusuri.
5. Mengamankan data dan aset untuk satu owner terautentikasi.
6. Menyediakan status, riwayat, dan error state yang jelas.

### Later milestone

- Mempercepat orkestrasi lintas provider AI melalui integrasi API yang dipilih.
- Menyediakan aplikasi Windows dengan product core yang sama.

## 6. Product principles

1. **One Screenshot. Complete Affiliate Workflow.** Screenshot adalah titik masuk; semua keluaran tetap terhubung ke produk dan proyek.
2. **Workspace over menu sprawl.** Sidebar berisi workspace besar, bukan setiap langkah workflow.
3. **Private by default.** Data, Storage, dan route bisnis harus tertutup untuk anonymous access.
4. **Human approval remains explicit.** Generasi AI tidak otomatis menjadi output final atau dipublikasikan tanpa tinjauan owner.
5. **Traceability before automation.** Hubungan produk, prompt, provider, aset, dan proyek harus jelas sebelum otomasi kompleks.
6. **Progressive delivery.** Setiap sprint menghasilkan capability kecil yang dapat divalidasi dan di-rollback.
7. **Current implementation is factual truth.** Dokumen target tidak boleh mengubah status fitur yang belum ada menjadi seolah sudah selesai.

## 7. Non-goals

### V1 non-goals

- Produk multi-tenant atau public SaaS.
- Social network, marketplace, atau e-commerce checkout.
- Public signup.
- Publikasi otomatis ke TikTok atau Shopee.
- Pelatihan foundation model sendiri.
- Integrasi langsung ke semua provider AI sekaligus.
- Advanced analytics atau attribution system.
- Aplikasi Windows native penuh.
- Menggabungkan data Research ke database workflow affiliate tanpa domain boundary yang jelas.
- Crypto research sebelum workflow saham Indonesia stabil.

## 8. Core affiliate workflow

Alur target terdiri dari:

1. Capture atau upload screenshot produk fashion.
2. Simpan produk ke Product Library.
3. Analisis category, color, material, gender, dan keywords.
4. Pilih model atau terima rekomendasi model.
5. Pilih visual style, lighting, camera, dan background.
6. Susun image prompt.
7. Buat di tool eksternal atau simpan generated images.
8. Susun motion atau image-to-video prompt.
9. Buat di tool eksternal atau simpan generated videos.
10. Susun caption, hashtag, CTA, hook, atau script.
11. Siapkan paket konten untuk TikTok atau Shopee.
12. Simpan riwayat proyek dan semua aset terkait.

Workflow multi-step harus ditempatkan di wizard, pipeline, tabs, atau section terfokus di dalam workspace.

## 9. Workspace definitions

Navigasi utama dibekukan pada workspace berikut:

| Workspace | Tanggung jawab V1 | Batas |
| --- | --- | --- |
| Dashboard | Ringkasan status, recent projects, recent assets, quick actions, dan health indicator. | Tidak menjadi tempat seluruh editor workflow. |
| Fashion Studio | Orkestrasi produk, model, style, dan image prompt. | Tidak menangani motion atau publishing final. |
| Fashion Brain | Analisis produk, creative direction, prompt reasoning, dan rekomendasi. | Tidak menjadi penyimpanan file umum. |
| Motion Studio | Motion prompt, image-to-video preparation, dan generated video assets. | Tidak mempublikasikan langsung. |
| Publishing | Caption, CTA, hashtag, hook, script, serta checklist TikTok/Shopee. | Automated publishing ditunda. |
| Research | Riset saham Indonesia sebagai domain pertama; crypto research sebagai later milestone. | Data Research tetap terpisah dari workflow produksi affiliate. |
| Settings | Profil owner, preferensi, integrations, dan status konfigurasi. | Tidak menampilkan nilai secret. |

## 10. Functional requirements

### V1 required

- `FR-01`: Owner dapat membuat, melihat, memperbarui, dan mengarsipkan produk miliknya.
- `FR-02`: Owner dapat mengaitkan satu atau lebih image records ke produk.
- `FR-03`: Owner dapat membuat proyek dari satu produk.
- `FR-04`: Proyek dapat memilih model dan style, termasuk status draft sebelum pilihan lengkap.
- `FR-05`: Sistem dapat menyimpan current product analysis dan menampilkan bahwa hasil AI memerlukan review.
- `FR-06`: Sistem dapat menyusun, mengedit, menyalin, dan menyimpan prompt.
- `FR-07`: Sistem dapat menyimpan referensi generated images dan generated videos tanpa mengharuskan generasi API langsung.
- `FR-08`: Sistem dapat menyusun paket publishing tanpa mengirimnya otomatis.
- `FR-09`: Dashboard menampilkan riwayat dan aset milik owner secara aman.
- `FR-10`: Semua route aplikasi bisnis memerlukan sesi owner yang valid setelah Sprint 1 selesai.
- `FR-11`: Error dari Supabase atau provider eksternal ditampilkan sebagai pesan aman tanpa secret atau payload sensitif.
- `FR-12`: Operasi mutasi memberi feedback pending, success, dan failure yang jelas.

## 11. Product Library requirements

### V1 required

- List dan card view dengan pencarian dasar, filter status/category, dan empty state.
- Create/edit form untuk title, category, gender, brand, color, material, status, dan notes sesuai schema yang disetujui.
- Product detail menampilkan source images, current analysis, project history, dan tindakan membuat proyek.
- Archive lebih diprioritaskan daripada hard delete.
- Validasi ownership wajib dilakukan server-side dan melalui RLS yang disetujui.

### Later milestone

- Affiliate source URL, platform product ID, price history, dan bulk import.

## 12. Model and Style Library requirements

### V1 required

- Model Library menyimpan name, gender, body type, height jika unit sudah diputuskan, style, pose, tags, thumbnail, dan reference asset.
- Style Library menyimpan name, lighting, camera, background, dan mood.
- Model dan style dapat digunakan ulang oleh banyak proyek owner yang sama.
- Prompt Presets disimpan sebagai catalog reusable dan bukan execution log.

### OPEN DECISION

- Unit baku untuk `models.height` belum diputuskan.
- Versi dan snapshot model/style pada proyek perlu diputuskan sebelum reproducibility dijanjikan.

## 13. Fashion Studio requirements

### V1 required

- Wizard memilih product, model, style, kemudian menyusun image prompt.
- Setiap langkah menampilkan data yang sudah dipilih dan memungkinkan kembali tanpa kehilangan draft.
- Prompt dapat diedit manual, disalin, dan disimpan ke project history.
- Integrasi awal dapat berbentuk “copy prompt → gunakan tool eksternal → upload/store result”.
- UI membedakan source image, reference image, dan generated image.

## 14. Fashion Brain requirements

### V1 required

- Menampilkan fakta produk yang sudah dikonfirmasi terpisah dari hasil AI.
- Menghasilkan struktur category, color, material, gender, keywords, summary, dan confidence bila provider tersedia.
- Memungkinkan koreksi owner sebelum data digunakan di prompt.
- Menyediakan creative direction dan rekomendasi, bukan keputusan final otomatis.
- Menyimpan output terbaru; history run lengkap adalah milestone berikutnya.

### Later milestone

- Immutable analysis runs, provider comparison, cost, latency, raw-output trace, dan evaluation.

## 15. Motion Studio requirements

### V1 required

- Memilih project dan generated/source image sebagai input.
- Menyusun motion prompt atau image-to-video prompt.
- Menyimpan provider target, prompt final, dan generated video reference jika schema sprint menyediakannya.
- Menampilkan pending, external-processing, uploaded, ready, dan failed states yang relevan.

### Deferred

- Direct API generation melalui Runway, Kling, Veo, atau provider lain sampai provider dan budget disetujui.

## 16. Publishing requirements

### V1 required

- Menyusun caption, hashtag, CTA, hook, dan script dari konteks proyek.
- Memisahkan output untuk TikTok dan Shopee bila formatnya berbeda.
- Menyediakan copy, review checklist, dan status preparation.
- Menjaga hubungan output publishing ke project dan aset final.

### Deferred

- Login platform sosial, scheduling, dan publish otomatis.

## 17. Research workspace boundaries

Research adalah workspace terpisah dan tidak boleh menghambat core affiliate workflow.

- Domain pertama adalah riset saham Indonesia.
- Crypto research adalah later milestone dan ditunda sampai workflow saham Indonesia stabil.
- Research bukan unrestricted general research workspace.
- Data, route, dan service Research tidak boleh dicampur ke affiliate workflow tanpa relationship yang sengaja dirancang.

## 18. Dashboard and project-history requirements

### V1 required

- Quick actions menuju create product, new project, dan upload.
- Recent projects dengan status dan last updated.
- Recent assets dengan type dan project context tanpa mengekspos Storage URL privat secara tidak aman.
- Ringkasan jumlah produk, proyek aktif, aset siap, dan draft publishing jika datanya tersedia.
- Supabase status indicator menampilkan hanya connected/unavailable, tanpa detail konfigurasi atau error sensitif.

## 19. Authentication and security requirements

### V1 required

- Email/password authentication untuk satu owner.
- Public signup disabled.
- Login dan logout UI.
- Route protection menggunakan server-side validation; Proxy hanya lapisan navigasi, bukan satu-satunya authorization gate.
- Tidak ada anonymous application-data access.
- Publishable key boleh digunakan sesuai desain Supabase; service-role dan secret key tidak boleh masuk browser atau repository.
- Error/log tidak boleh memuat password, token, session, user UUID, email privat, atau key.
- Session expiry dan unauthorized state harus mengarahkan ke login secara aman.

### Completed live Auth foundation

Product-owner and system-verified live infrastructure facts mengonfirmasi:

- email/password authentication enabled;
- public signup disabled;
- anonymous-user authentication disabled;
- tepat satu confirmed Auth user tersedia;
- tidak ada identity detail pribadi yang dicatat dalam dokumen.

Repository masih belum memiliki login UI, logout UI, atau route protection. Ini adalah application-layer work untuk Sprint 1, bukan gap pada live Auth configuration.

## 20. Database and asset requirements

Arsitektur referensi berada di `docs/02_ARCHITECTURE/DATABASE.md` dan `docs/02_ARCHITECTURE/ERD.md`. Entitas rencana:

- `products`
- `product_images`
- `models`
- `styles`
- `prompt_presets`
- `projects`
- `product_analysis`

Private Storage buckets yang ditargetkan:

- `products`
- `models`
- `generated-images`
- `generated-videos`

### V1 required security model

- Owned records menggunakan `owner_id` yang terhubung ke `auth.users`.
- `product_images` dan `product_analysis` mewarisi ownership melalui `products`.
- Relasi project hanya boleh menunjuk aset milik authenticated owner yang sama.
- Storage path diawali authenticated user ID.
- Bucket tetap private dan akses dikontrol policy.

### Completed live database foundation

Product-owner and system-verified live infrastructure facts mengonfirmasi dua applied migrations:

- `20260721171620_v1_database_foundation`
- `20260722052154_ownership_rls_and_storage_policies`

Live Supabase state:

- tujuh public tables tersedia: `products`, `product_images`, `models`, `styles`, `prompt_presets`, `projects`, dan `product_analysis`;
- RLS aktif pada seluruh tujuh tabel;
- seluruh tabel saat ini berisi nol row;
- `products`, `models`, `styles`, `prompt_presets`, dan `projects` memiliki `owner_id uuid NOT NULL` yang mereferensikan `auth.users(id)` dengan `ON DELETE RESTRICT`;
- kelima owner indexes tersedia;
- `product_images` dan `product_analysis` sengaja memperoleh ownership melalui parent `products`, tanpa duplicate `owner_id`;
- tepat 28 authenticated table policies tersedia: SELECT, INSERT, UPDATE, dan DELETE untuk setiap tabel;
- direct-owner policies berlaku untuk `products`, `models`, `styles`, dan `prompt_presets`;
- project policies memvalidasi bahwa referenced product, model, dan style dimiliki authenticated owner yang sama;
- child-table policies menurunkan ownership dari parent product;
- role `authenticated` hanya memiliki SELECT, INSERT, UPDATE, dan DELETE pada application tables; tidak memiliki TRUNCATE, REFERENCES, atau TRIGGER;
- role `anon` tidak memiliki application-table privileges atau application RLS policies.

### Completed live Storage foundation

- Private buckets `products`, `models`, `generated-images`, dan `generated-videos` tersedia.
- Seluruh bucket tetap private dan saat ini berisi nol object.
- Empat authenticated Storage policies tersedia untuk SELECT, INSERT, UPDATE, dan DELETE.
- Setiap policy mewajibkan approved bucket dan first object-path segment yang sama dengan authenticated user ID.

### Architecture-document drift

`docs/02_ARCHITECTURE/DATABASE.md` dan `docs/02_ARCHITECTURE/ERD.md` mendeskripsikan original V1 architecture. Live V1 schema telah diterapkan dan kemudian diperkuat oleh ownership/RLS/Storage migration. Kedua dokumen referensi tersebut partially outdated karena belum memuat `owner_id`, grants hardening, table RLS, dan Storage ownership policies. Alignment dokumen architecture adalah future documentation task terpisah; file tersebut tidak diubah dalam task ini.

## 21. External AI tool strategy

### V1 required

- Mendukung orkestrasi manual/semi-manual dengan ChatGPT, Gemini, Google Flow, Runway, Kling, atau Veo.
- Menyimpan prompt dan output reference tanpa mengasumsikan API provider tersedia.
- Provider name, model, dan timestamp hanya disimpan jika schema sprint sudah disetujui.

### Deferred

- Direct API integration, automatic retries, usage billing, provider failover, dan cost dashboard.

## 22. Web platform strategy

- Next.js App Router dan TypeScript sebagai foundation.
- Server Components untuk data access dan output yang tidak memerlukan interaktivitas browser.
- Client Components dibatasi pada interaksi yang memerlukan browser state.
- Supabase adalah backend terkelola untuk Auth, data, dan private Storage dengan live secured schema/policies yang telah diterapkan; perubahan berikutnya tetap memerlukan approval dan migration review.
- GitHub feature branches dan Pull Request digunakan untuk review.
- Vercel Production berasal dari `main`; feature branch menggunakan Preview Deployment.

## 23. Windows desktop strategy

### Later milestone

- Aplikasi Windows harus menggunakan product core, model data, dan Supabase backend yang sama sejauh aman.
- Desktop enhancement dapat mencakup file picker, drag-and-drop, clipboard capture, native notifications, dan deep links.

### OPEN DECISION

- Pilihan Tauri, Electron, atau wrapper lain belum diputuskan.
- Offline behavior, local secret storage, auto-update, code signing, dan minimum Windows version belum diputuskan.

## 24. UI and usability principles

- Dark workspace yang fokus dengan hierarchy jelas.
- Sidebar tetap memuat tujuh workspace yang dibekukan.
- Setiap halaman memiliki title, context, primary action, dan state yang jelas.
- Wizard menunjukkan progress dan menyimpan draft.
- Tindakan destructive memerlukan konfirmasi eksplisit.
- Copy-to-clipboard, upload, save, dan retry memberi feedback langsung.
- Jangan mengklaim design system finished; implementation saat ini adalah placeholder Tailwind dasar.

## 25. Accessibility requirements

### V1 required

- Keyboard navigation untuk seluruh tindakan utama.
- Visible focus state.
- Semantic heading order, landmark, form label, dan accessible name.
- Status tidak disampaikan melalui warna saja.
- Contrast text dan controls memenuhi WCAG AA sebagai target minimum.
- Error terhubung ke field terkait dan dapat dibaca screen reader.
- Reduced-motion preference dihormati.
- Modal mengelola focus trapping dan focus return.

## 26. Performance expectations

- Navigation shell terasa responsif pada koneksi normal.
- Dashboard tidak boleh gagal total hanya karena health check atau satu widget gagal.
- List menggunakan pagination atau incremental loading sebelum jumlah record besar.
- Thumbnail dioptimalkan dan file asli tidak dimuat tanpa kebutuhan.
- Upload besar menampilkan progress dan batas ukuran.
- External AI request memiliki timeout, retry policy terbatas, dan idempotency strategy sebelum diotomasi.
- Target angka Web Vitals ditetapkan setelah UI V1 memiliki baseline pengukuran.

## 27. Error-handling expectations

- Pesan user-facing singkat, aman, dan dapat ditindaklanjuti.
- Detail teknis sensitif tidak dirender di UI.
- Missing environment configuration menghasilkan unavailable/configuration state, bukan secret dump.
- Mutasi gagal tidak boleh menampilkan success state.
- Upload gagal tidak membuat record yatim tanpa cleanup/reconciliation plan.
- Database permission failure tidak boleh diselesaikan dengan melemahkan RLS.
- Retry tidak boleh menggandakan record atau asset.

## 28. Success metrics

### V1 metrics

- Median waktu dari product capture hingga publishing-ready package.
- Persentase proyek yang menyelesaikan seluruh workflow.
- Jumlah langkah manual dan perpindahan tool per proyek.
- Persentase aset yang tetap terhubung ke product/project yang benar.
- Jumlah error upload, permission, dan broken asset reference.
- Jumlah prompt yang digunakan ulang melalui preset.
- Manual acceptance rate owner untuk prompt, image, motion, dan publishing output.

Baseline dan target numerik adalah **OPEN DECISION** sampai alur V1 dapat diukur.

## 29. V1 release definition

V1 dianggap siap ketika:

1. Owner dapat login dan route bisnis terlindungi.
2. Product Library dan product detail berfungsi untuk data owner.
3. Screenshot dapat diunggah ke private Storage dan ditautkan ke produk.
4. Model, style, dan prompt preset dapat dikelola.
5. Fashion Studio dapat menghasilkan draft image prompt dalam workflow proyek.
6. Fashion Brain dapat menyimpan hasil analisis yang dapat direview.
7. Generated image/video references dapat disimpan dan dilihat secara privat.
8. Motion prompt dan publishing package dapat disiapkan.
9. Dashboard menampilkan history dan recent assets yang faktual.
10. Lint, build, security checks, dan manual acceptance test lulus.

Direct AI generation, automated publishing, advanced Research, dan Windows packaging tidak menghalangi V1.

## 30. Acceptance criteria

- Semua capability V1 hanya dapat digunakan oleh owner terautentikasi.
- Anonymous request tidak dapat membaca atau mengubah application data atau private assets.
- Setiap relationship yang dapat dipilih UI divalidasi ownership-nya di server/database.
- Workflow dapat diselesaikan dengan tool AI eksternal meskipun direct API belum ada.
- Tidak ada secret atau private key di client bundle, repository, atau log.
- Empty, loading, success, error, dan unauthorized states tersedia untuk flow utama.
- Existing seven-workspace navigation tetap dipertahankan.
- Dokumentasi sprint dan implementasi tidak memiliki drift yang tidak dilaporkan.

## 31. Risks and constraints

| Risiko/kendala | Dampak | Mitigasi |
| --- | --- | --- |
| Architecture docs tertinggal dari live secured schema | Future implementation dapat membaca model lama yang belum mencantumkan ownership/policies. | Perlakukan live migration verification sebagai fakta; lakukan architecture-document alignment terpisah. |
| Ketergantungan tool AI eksternal | Flow dapat berubah saat provider mengubah UI/API. | Simpan prompt/output secara provider-agnostic; integrasi satu per satu. |
| Private single-user dianggap aman tanpa RLS | Data tetap dapat terekspos melalui publishable key. | Terapkan defense-in-depth: grants, RLS, server checks, private Storage. |
| Banyak workspace sebelum core flow selesai | UI menjadi kumpulan placeholder. | Deliver per sprint dan ukur completion core workflow. |
| Generated media besar | Biaya, upload failure, dan performa. | Batas file, progress, metadata, lifecycle, dan cleanup plan. |
| Desktop terlalu dini | Duplikasi effort sebelum web stabil. | Tunda sampai V1 web dan kontrak backend stabil. |
| Research berkembang terlalu cepat ke crypto | Scope creep sebelum workflow saham stabil. | Stabilkan Indonesian-stock workflow lebih dahulu; defer crypto. |

## 32. Current implementation summary

### Confirmed completed in repository

- Next.js App Router, TypeScript, Tailwind CSS, dan ESLint foundation.
- Workspace route group dan shared sidebar.
- Routes: `/dashboard`, `/fashion-studio`, `/fashion-brain`, `/motion-studio`, `/publishing`, `/research`, `/settings`.
- Root redirect `/` ke `/dashboard`.
- Supabase browser client dan server client dengan environment validation.
- `.env.example` dengan placeholder kosong.
- Read-only Supabase connection indicator di Dashboard dengan safe failure state.
- GitHub feature-branch/Pull Request history.

### Confirmed by product-owner context

- Dua Supabase migrations telah applied dan diverifikasi pada live project.
- Database ownership, grants hardening, table RLS, private Storage, dan Storage ownership policies telah selesai.
- Email/password Auth aktif; public signup dan anonymous-user authentication disabled; satu confirmed owner account tersedia.
- Environment configuration tersedia secara lokal dan di Vercel tanpa menyimpan value di repository.
- GitHub/Vercel integration dan production deployment telah berhasil.
- Production Dashboard berhasil menampilkan “Supabase connected”.

### Not implemented

- Login/logout UI dan route protection.
- Product Library, uploads, AI analysis workflow, asset galleries, publishing automation, dan desktop packaging.

## 33. Open product decisions

1. **OPEN DECISION:** Approved UI component library dan design tokens.
2. **OPEN DECISION:** Unit dan business meaning `models.height`.
3. **OPEN DECISION:** Provider AI pertama yang mendapat direct API integration dan budgetnya.
4. **OPEN DECISION:** Versioning/snapshot strategy untuk model, style, prompt, dan analysis.
5. **OPEN DECISION:** Lifecycle archive/delete dan retention aset.
6. **OPEN DECISION:** Consent dan provenance requirements untuk model-reference assets.
7. **OPEN DECISION:** Baseline serta target numerik success metrics dan performance budgets.
8. **OPEN DECISION:** Tauri, Electron, atau desktop wrapper lain.
9. **OPEN DECISION:** Minimum Windows version, native chrome, shortcuts, offline mode, local secure storage, code signing, dan update channel.
10. **OPEN DECISION:** Apakah `AI_CONTEXT.md` diselaraskan melalui documentation-only task terpisah.
