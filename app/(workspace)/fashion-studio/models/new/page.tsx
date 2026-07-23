import Link from "next/link";

import { ModelForm } from "@/app/components/models/ModelForm";
import { PageHeader } from "@/app/components/ui/PageHeader";

export default function NewModelPage() {
  return (
    <div>
      <Link
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary transition hover:text-accent-cyan"
        href="/fashion-studio/models"
      >
        <span aria-hidden="true">←</span>
        Model Library
      </Link>
      <PageHeader
        description="Define the metadata for a reusable AI-character model profile."
        eyebrow="Model Library"
        title="Add model"
      />
      <ModelForm mode="create" />
    </div>
  );
}
