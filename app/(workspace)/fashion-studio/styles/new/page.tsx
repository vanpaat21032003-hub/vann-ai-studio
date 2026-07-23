import Link from "next/link";
import { StyleForm } from "@/app/components/styles/StyleForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
export default function NewStylePage() { return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-cyan" href="/fashion-studio/styles"><span aria-hidden="true">←</span>Style Library</Link><PageHeader description="Define metadata for a reusable visual style." eyebrow="Style Library" title="Add style" /><StyleForm mode="create" /></div>; }
