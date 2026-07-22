# UI Blueprint — Vann AI Studio

Status: target interface specification; tidak mengubah application code
Audience: Vann, Liora, dan Bowl

## Status layers

Dokumen ini selalu membedakan tiga lapisan:

- **Current placeholder UI:** fakta yang sudah ada di repository.
- **Target V1 UI:** interface yang harus dibangun melalui sprint terpisah.
- **Future desktop enhancement:** capability khusus Windows yang belum diputuskan teknologinya.

Sprint 2 design system telah completed dengan dark navy futuristic tokens, cyan/violet accents, dan reusable custom UI primitives tanpa external component-library dependency.

Verified live foundation sudah menyediakan tujuh secured application tables, empat private Storage buckets, private owner Auth posture, dan production Supabase connectivity. UI untuk Product Library, uploads, AI workflows, dan asset management belum dibangun; blueprint ini mendefinisikan lapisan aplikasi di atas foundation tersebut.

## 1. Global application shell

### Current placeholder UI

- Workspace layout menggunakan responsive protected shell dengan dark navy background dan accent cyan/violet.
- Sidebar memiliki active navigation; narrow-screen layout tidak horizontal overflow dan desktop footer tetap visible.

### Target V1 UI

- Shell memiliki tiga area: sidebar, workspace header, dan scrollable main content.
- Shell mempertahankan navigation state saat berpindah halaman.
- Global error tidak menutup akses ke navigasi jika hanya satu widget gagal.
- Toast region, modal portal, dan command surfaces ditempatkan konsisten.
- Auth pages menggunakan shell terpisah yang lebih sederhana.

## 2. Desktop sidebar

Sidebar wajib mempertahankan urutan workspace:

1. Dashboard
2. Fashion Studio
3. Fashion Brain
4. Motion Studio
5. Publishing
6. Research
7. Settings

Rules:

- Logo/product name di bagian atas.
- Primary workspaces dikelompokkan bersama; Settings dipisahkan secara visual.
- Label dan icon memiliki accessible name.
- Workflow steps tidak ditambahkan sebagai sidebar items.
- Sidebar tidak menampilkan badge atau count yang belum berasal dari data nyata.

## 3. Sidebar collapsed state

### Target V1 UI

- Expanded width menampilkan icon dan label.
- Collapsed width menampilkan icon, tooltip, dan active indicator.
- Toggle dapat diakses dengan keyboard dan memiliki `aria-expanded`.
- Preference boleh disimpan lokal; sinkronisasi ke database bukan syarat V1.
- Main content menyesuaikan tanpa horizontal jump yang mengganggu.

### Future desktop enhancement

- Desktop wrapper dapat menyimpan window-level layout preference.
- Native shortcut untuk toggle sidebar adalah **OPEN DECISION**.

## 4. Active navigation state

- Active workspace ditentukan dari pathname, bukan click state sementara.
- Active item menggunakan kombinasi background, text weight, dan indicator; warna bukan satu-satunya sinyal.
- Parent workspace tetap aktif pada nested routes seperti `/fashion-studio/projects/[id]`.
- Hover, focus-visible, active, dan disabled states berbeda jelas.

## 5. Main content area

- Memiliki max-width yang sesuai untuk forms dan area lebar untuk tables/galleries.
- Padding desktop, tablet, dan mobile konsisten.
- Tidak ada nested vertical scroll tanpa alasan jelas.
- Empty/error state mempertahankan konteks workspace dan primary recovery action.

## 6. Workspace header

Setiap workspace memakai pola:

- eyebrow atau page context opsional;
- page title;
- description singkat;
- connection/configuration badge jika relevan;
- satu primary action;
- secondary actions dalam menu jika lebih dari dua;
- optional tabs atau filters di bawah heading.

Header tidak menampilkan secret, user UUID, private Storage URL, atau raw provider error.

## 7. Breadcrumb or page-context behavior

- Top-level workspace tidak membutuhkan breadcrumb redundant.
- Nested record route menampilkan breadcrumb, contoh `Product Library / Product Detail`.
- Breadcrumb menggunakan links kecuali current page.
- Wizard menampilkan progress step, bukan breadcrumb sebagai pengganti progress.
- Pada mobile, breadcrumb panjang dipendekkan tanpa menghilangkan page title.

## 8. Dashboard layout

### Current placeholder UI

- Shared page header, reusable Quick Actions cards, dan empty states untuk Recent Projects serta Recent Assets.
- Supabase connected/unavailable indicator tetap operational.

### Target V1 UI

Urutan konten:

1. Workspace header dan quick create action.
2. Safe infrastructure status indicator.
3. Metric cards yang hanya menampilkan data faktual.
4. Recent Projects list.
5. Recent Assets gallery/list.
6. Quick Actions.
7. Optional activity/history setelah event model tersedia.

Dashboard tidak boleh menampilkan table contents dalam health check dan tidak boleh gagal total ketika Supabase unavailable.

## 9. Workspace page template

Template umum:

1. Workspace header.
2. Optional filters/tabs.
3. Primary content panel.
4. Contextual empty/loading/error state.
5. Optional details drawer.

Fashion Studio, Fashion Brain, Motion Studio, dan Publishing boleh memakai pipeline-specific layout tetapi tetap mempertahankan spacing, controls, dan status language yang sama.

## 10. Fashion workflow wizard

### Target V1 steps

1. Product.
2. Product source image.
3. Model.
4. Style dan visual settings.
5. Image prompt.
6. Generated image/reference.
7. Motion prompt.
8. Generated video/reference.
9. Publishing copy.
10. Review dan save.

Rules:

- Progress menunjukkan completed/current/upcoming.
- Back tidak menghapus draft.
- Continue disabled hanya dengan alasan yang terlihat.
- Save draft tersedia pada titik aman.
- External-tool handoff menampilkan copy instructions dan tempat upload result.
- Tidak ada generation/publish action yang menyamar sebagai sukses sebelum provider mengembalikan hasil.

## 11. Product Library table or card view

### Target V1 UI

- Toggle table/card jika kedua mode memberi nilai; table menjadi default desktop.
- Search title/brand dan filter status/category.
- Columns minimum: thumbnail, title, category, status, updated time, actions.
- Card minimum: thumbnail, title, category, status, project count jika tersedia.
- Row/card click membuka detail; action menu tidak memicu navigation tidak sengaja.
- Pagination atau incremental loading digunakan sebelum dataset besar.
- Bulk actions ditunda kecuali ada use case owner yang jelas.

## 12. Product detail view

- Header berisi title, status, edit, archive, dan create-project action.
- Sections/tabs:
  - Overview.
  - Source images.
  - Current analysis.
  - Projects.
  - Generated assets jika tersedia.
- Facts hasil input owner dibedakan dari AI-detected values.
- Private asset ditampilkan melalui signed/authorized access, bukan public bucket assumption.
- Hard delete bukan default action.

## 13. Model Library

- Card/list menampilkan thumbnail, name, gender/body-type summary, dan tags.
- Detail/edit mengelola model metadata dan reference assets.
- Empty state menjelaskan manfaat reusable model.
- Pemilihan model dalam wizard memakai searchable selector dengan preview.
- Consent/provenance requirements adalah **OPEN DECISION** sebelum external model assets digunakan luas.

## 14. Style Library

- Style card menampilkan name dan ringkasan lighting, camera, background, mood.
- Selector menampilkan preview visual hanya bila asset preview benar-benar tersedia.
- Edit tidak boleh diam-diam mengubah historical project reproducibility; snapshot/versioning adalah **OPEN DECISION**.

## 15. Upload areas

### Target V1 UI

- Drag-and-drop dan file picker.
- Accepted type, maximum size, dan privacy note terlihat sebelum upload.
- Progress per file.
- Preview, replace, retry, dan remove-before-save.
- Validation untuk MIME type, size, dan zero-byte file.
- Upload failure menampilkan safe error tanpa bucket policy detail sensitif.
- File path dan ownership berasal dari authenticated user context, bukan client-supplied owner ID.

### Future desktop enhancement

- Clipboard image paste dan native screenshot import.
- Windows Explorer drag-and-drop.
- Background upload dan notification adalah later milestone.

## 16. Prompt editor

- Editor membedakan generated draft dan owner-edited final.
- Actions: generate/draft, edit, save, copy, reset dengan konfirmasi jika ada perubahan.
- Context chips menampilkan product/model/style selections.
- Character/token estimate opsional dan tidak boleh dianggap billing total.
- Provider selector hanya tampil jika provider sudah disetujui.
- Raw secret, system credential, atau internal error tidak ditampilkan.

## 17. Generated asset gallery

- Filter by type, project, status, dan created time.
- Card menampilkan thumbnail/preview, type, project, provider jika tersedia, dan status.
- Detail drawer menampilkan safe metadata, prompt reference, dan actions.
- Download/open menggunakan authorized URL dengan expiry yang sesuai.
- “Set as selected” atau “Use for motion” harus memvalidasi ownership.
- Asset deletion membutuhkan confirmation dan lifecycle policy.

## 18. Motion workflow

- Input preview berada di kiri/atas; settings dan prompt di kanan/bawah sesuai viewport.
- Motion prompt editor memiliki camera movement, subject movement, duration, aspect ratio, dan negative instructions bila provider mendukung.
- Manual external flow: copy prompt, open external tool, kemudian store/upload result.
- Direct generation button hanya ditambahkan ketika provider API disetujui.
- Processing state tidak memberi progress palsu bila provider tidak menyediakan progress.

## 19. Publishing preparation

- Platform tabs: TikTok dan Shopee.
- Sections: hook, caption, CTA, hashtags, script, selected assets, checklist.
- Copy per field dan copy-all.
- Character guidance bersifat informatif dan perlu dipelihara sesuai platform rules.
- Status: draft, ready-for-review, approved/prepared.
- Tidak ada “Published” kecuali ada bukti external publish atau owner confirmation yang tersimpan.
- Automated scheduling/publishing adalah deferred.

## 20. Research workspace separation

- Research memiliki visual context yang tetap konsisten tetapi data domain terpisah.
- Domain pertama adalah riset saham Indonesia.
- Crypto research adalah later domain dan ditunda sampai workflow saham Indonesia stabil.
- Research bukan unrestricted general research workspace.
- Tidak menggunakan table affiliate-workflow secara paksa.
- Tidak muncul dalam Fashion Studio wizard kecuali explicit integration disetujui.

### Current placeholder UI

- Copy saat ini menyebut riset saham Indonesia, sesuai first-domain direction, tetapi workflow-nya belum diimplementasikan.

### Target sequence

1. Stabilkan information architecture dan workflow saham Indonesia.
2. Validasi source, saving/bookmark behavior, loading/error states, dan security boundary.
3. Pertimbangkan crypto research hanya setelah acceptance criteria domain pertama tercapai.

## 21. Settings structure

Target sections:

- Profile/owner display settings tanpa mengekspos identity detail sensitif.
- Application preferences.
- AI provider configuration status tanpa menampilkan key value.
- Supabase/Vercel status hanya jika dibutuhkan dan aman.
- Storage/usage summary bila API aman tersedia.
- Security/session actions.
- About/version information.

Secret entry menggunakan masked inputs dan server-side handling; secret tidak pernah dikirim kembali ke client setelah disimpan.

## 22. Forms and validation

- Setiap field memiliki label, helper text bila perlu, dan error terhubung.
- Required fields ditandai secara programmatic dan visual.
- Validation client-side untuk feedback cepat; server-side tetap authoritative.
- Submit memiliki pending state dan mencegah accidental duplicate request.
- Unsaved changes warning digunakan pada form kompleks.
- Field values tidak hilang setelah recoverable validation error.

## 23. Buttons and actions

- Satu primary action per context utama.
- Variants minimum: primary, secondary, ghost, destructive, icon-only.
- Icon-only membutuhkan accessible label dan tooltip.
- Disabled state tidak menggantikan penjelasan mengapa tindakan tidak tersedia.
- Destructive action selalu diberi wording spesifik, bukan “OK”.

## 24. Cards

- Card menyampaikan satu unit informasi/actionable context.
- Heading semantic dan click target jelas.
- Interactive card memiliki keyboard behavior yang setara.
- Status badge tidak hanya mengandalkan warna.
- Placeholder skeleton mengikuti ukuran card final untuk mengurangi layout shift.

## 25. Tables

- Header semantic dan alignment konsisten.
- Actions column memiliki accessible label.
- Sorting state dapat dibaca screen reader.
- Empty, loading, error, dan pagination state berada dalam context table.
- Mobile beralih ke card/list bila horizontal scroll merusak usability.

## 26. Modals and drawers

- Modal untuk confirmation atau focused short task.
- Drawer untuk detail/context yang perlu mempertahankan list di belakang.
- Form panjang memakai page atau dedicated panel, bukan modal sempit.
- Focus trap, Escape behavior, close label, dan focus return wajib.
- Destructive confirmation menyebut object yang terkena.

## 27. Empty states

Empty state berisi:

- apa yang belum tersedia;
- mengapa item itu berguna;
- satu primary action;
- optional secondary learning link.

Jangan menampilkan fake sample data sebagai data owner.

## 28. Loading states

- Skeleton untuk list/card.
- Spinner hanya untuk action kecil atau indeterminate operation.
- Upload menampilkan byte/progress jika tersedia.
- Server-rendered workspace boleh menggunakan Suspense untuk widget yang lambat.
- Navigation shell tetap usable.

## 29. Success states

- Inline confirmation dekat tindakan untuk save/upload.
- Toast untuk confirmation global yang tidak memerlukan action berikut.
- Success tidak menghilangkan next recommended action.
- Created record menyediakan link/detail context.

## 30. Error states

- Error copy aman, singkat, dan menjelaskan recovery.
- Retry hanya tersedia untuk idempotent/safe action.
- Unauthorized diarahkan ke login; forbidden dibedakan dari not-found bila aman.
- Provider error diringkas; raw payload disimpan hanya jika logging policy aman dan disetujui.
- Supabase error tidak diatasi dengan melemahkan RLS.

## 31. Connection status indicators

### Current placeholder UI

- Dashboard menampilkan Supabase connected/unavailable dengan dot dan text.

### Target V1 UI

- Status hanya menyatakan availability yang dapat diverifikasi.
- Tidak menampilkan URL, key, region, table names, response body, atau error detail.
- Loading state tidak salah disebut unavailable sebelum request selesai jika UI distrim.
- Failure satu status indicator tidak memblokir halaman lain.
- User-facing recovery dapat mengarah ke Settings tanpa menampilkan secret.

## 32. Responsive behavior

- Desktop: sidebar expanded/collapsed dan content grid penuh.
- Tablet: sidebar collapsible atau overlay; two-column forms menjadi satu/dua kolom sesuai ruang.
- Mobile: top bar + navigation drawer; main content satu kolom.
- Tables beralih ke cards atau controlled horizontal scroll.
- Wizard step label dapat dipersingkat tetapi progress tetap jelas.
- Touch target minimum mengikuti accessibility best practice.

## 33. Windows desktop behavior

### Future desktop enhancement

- Window minimum size dan resize behavior harus ditentukan.
- Native title bar vs custom chrome adalah **OPEN DECISION**.
- File-system access, clipboard, notifications, protocol links, offline queue, dan auto-update memerlukan security review.
- Desktop tidak boleh menyimpan service-role key.
- Auth session storage harus memakai secure platform mechanism yang dipilih wrapper.
- UI web tetap menjadi baseline agar desktop tidak menjadi fork produk berbeda.

## 34. Accessibility

- Target minimum WCAG 2.2 AA untuk flow utama.
- Keyboard-only completion untuk login, product creation, upload, wizard, dan publishing prep.
- Focus-visible state konsisten.
- Correct landmarks: header, nav, main, aside bila relevan.
- Status updates memakai live-region secara selektif agar tidak berisik.
- Form error dihubungkan dengan `aria-describedby`.
- Text alternatives tersedia untuk informative images.
- Decorative icons disembunyikan dari assistive technology.
- Motion mengikuti `prefers-reduced-motion`.
- Color contrast diuji pada semua interactive states.

## 35. Visual consistency rules

- Gunakan spacing scale, radius, typography, dan color tokens yang disetujui Sprint 2.
- Hindari one-off arbitrary colors ketika token sudah tersedia.
- Status vocabulary konsisten lintas workspace.
- Primary action placement konsisten.
- Icon set konsisten; jangan mencampur emoji, SVG, dan multiple icon libraries tanpa keputusan desain.
- Product, model, style, image, video, dan project memiliki visual identity yang dapat dibedakan tanpa mengubah shell.
- Design tokens harus mendukung web dan future desktop wrapper.
- Current Sprint 2 system menggunakan custom primitives; external component library memerlukan dependency review terpisah.

## Current-to-target summary

| Area | Current placeholder | Target V1 | Future desktop |
| --- | --- | --- | --- |
| Navigation | Responsive protected shell dengan active sidebar. | Active, collapsed, responsive, session-aware. | Native shortcut/window preference. |
| Dashboard | Reusable quick-action/empty-state cards + operational health pill. | Real recent projects/assets/metrics/actions. | Native notification/deep link. |
| Product workflow | Belum ada. | Product Library + guided workflow. | Screenshot/clipboard import. |
| AI workflow | TODO pages. | Prompt orchestration dan stored outputs. | Background/native handoff bila aman. |
| Publishing | Placeholder. | TikTok/Shopee preparation checklist. | Native share/export later. |
| Design system | Dark navy tokens, cyan/violet accents, dan reusable custom primitives. | Approved tokens dan reusable primitives. | Shared tokens; wrapper-specific chrome only. |

## UI open decisions

2. **OPEN DECISION:** Unit dan UI meaning untuk `models.height`.
3. **OPEN DECISION:** Model/style/prompt snapshot behavior.
4. **OPEN DECISION:** First direct AI provider dan budget.
5. **OPEN DECISION:** Consent dan provenance UX untuk model-reference assets.
6. **OPEN DECISION:** Desktop wrapper, native chrome, shortcuts, offline behavior, secure storage, signing, dan update mechanism.
7. **OPEN DECISION:** Asset deletion/archive UX dan retention.
8. **OPEN DECISION:** Numeric success metrics dan performance budgets setelah baseline UI tersedia.
