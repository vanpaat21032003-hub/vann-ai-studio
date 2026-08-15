import Link from "next/link";

import { ImageGenerator } from "@/app/components/image-generator/ImageGenerator";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedModels } from "@/lib/models/data";
import { getOwnedProducts } from "@/lib/products/data";
import { getOwnedPromptPresets } from "@/lib/prompt-presets/data";
import { getOwnedStyles } from "@/lib/styles/data";

export const dynamic = "force-dynamic";

export default async function ImageGeneratorPage() {
  const allProducts = await getOwnedProducts({ search: "", status: "all" });
  const models = await getOwnedModels({ search: "", status: "active" });
  const styles = await getOwnedStyles({ search: "", status: "active" });
  const presets = await getOwnedPromptPresets({ search: "", status: "active" });
  const products = allProducts.filter(
    (product) => product.status !== "archived",
  );

  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href="/fashion-studio"
      >
        <span aria-hidden="true">&larr;</span>
        Fashion Studio
      </Link>
      <PageHeader
        description="Compose a source-of-truth fashion prompt, copy it for external generation, and optionally use Direct API image previews."
        eyebrow="Fashion Studio"
        title="Image Generator"
      />
      <ImageGenerator
        models={models}
        presets={presets}
        products={products}
        styles={styles}
      />
    </div>
  );
}
