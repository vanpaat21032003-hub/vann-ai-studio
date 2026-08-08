import Link from "next/link";

import { PromptComposer } from "@/app/components/prompt-composer/PromptComposer";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedModels } from "@/lib/models/data";
import { getOwnedProducts } from "@/lib/products/data";
import { getOwnedPromptPresets } from "@/lib/prompt-presets/data";
import { getOwnedStyles } from "@/lib/styles/data";

export const dynamic = "force-dynamic";

export default async function PromptComposerPage() {
  const [allProducts, models, styles, presets] = await Promise.all([
    getOwnedProducts({ search: "", status: "all" }),
    getOwnedModels({ search: "", status: "active" }),
    getOwnedStyles({ search: "", status: "active" }),
    getOwnedPromptPresets({ search: "", status: "active" }),
  ]);
  const products = allProducts.filter((product) => product.status !== "archived");

  return (
    <div>
      <Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan" href="/fashion-brain">
        <span aria-hidden="true">←</span>
        Fashion Brain
      </Link>
      <PageHeader description="Combine approved library records into a structured prompt you can copy into your creative workflow." eyebrow="Fashion Brain" title="Prompt Composer" />
      <PromptComposer models={models} presets={presets} products={products} styles={styles} />
    </div>
  );
}
