import Link from "next/link";
import { notFound } from "next/navigation";
import { StyleForm } from "@/app/components/styles/StyleForm";
import { PageHeader } from "@/app/components/ui/PageHeader";
import { getOwnedStyle } from "@/lib/styles/data";
export default async function EditStylePage({ params }: { params: Promise<{ styleId: string }> }) { const { styleId } = await params; const style = await getOwnedStyle(styleId); if (!style) notFound(); return <div><Link className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent-cyan" href={`/fashion-studio/styles/${style.id}`}><span aria-hidden="true">←</span>Style detail</Link><PageHeader description="Update the metadata for this reusable visual style." eyebrow="Style Library" title="Edit style" /><StyleForm mode="edit" style={{ id: style.id, name: style.name, lighting: style.lighting, camera: style.camera, background: style.background, mood: style.mood }} /></div>; }
