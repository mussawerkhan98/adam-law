import { notFound } from "next/navigation";
import { ImageField } from "@/components/admin/client";
import { FormFooter } from "@/components/admin/ItemList";
import { Card, Checkbox, Field, Flash, PageHeader, SeoFields, Select, TextArea } from "@/components/admin/ui";
import { PRACTICE_ICON_KEYS, PracticeIcon } from "@/components/icons";
import { db } from "@/lib/db";
import { savePracticeArea } from "../../../actions";

export const metadata = { title: "Edit practice area" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const item = id === "new" ? null : await db.practiceArea.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !item) notFound();

  return (
    <>
      <PageHeader title={item ? `Edit: ${item.title}` : "New practice area"} />
      <Flash error={error} />
      <form action={savePracticeArea} className="space-y-6">
        <input type="hidden" name="id" value={item?.id ?? "new"} />
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Title" name="title" defaultValue={item?.title} required placeholder="e.g. Family Law" />
            <Field label="URL slug" name="slug" defaultValue={item?.slug} hint="Leave blank to create from the title." />
          </div>
          <TextArea label="Short summary" name="summary" defaultValue={item?.summary} rows={3} required hint="Shown on cards and at the top of the page (1–2 sentences)." />
          <TextArea label="Full page content" name="body" defaultValue={item?.body} rows={16} markdown hint="Explain the services, the process and why clients choose you. 300+ words helps SEO." />
          <div className="grid gap-5 md:grid-cols-3">
            <Select
              label="Icon"
              name="icon"
              defaultValue={item?.icon ?? "scale"}
              options={PRACTICE_ICON_KEYS.map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))}
            />
            <Field label="Display order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} hint="Lower numbers appear first." />
            <div className="pt-7">
              <Checkbox label="Published" name="published" defaultChecked={item?.published ?? true} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-slate-500">
            {PRACTICE_ICON_KEYS.map((k) => (
              <span key={k} title={k} className="flex items-center gap-1.5 rounded border border-slate-200 px-2 py-1 text-xs">
                <PracticeIcon name={k} width={16} height={16} /> {k}
              </span>
            ))}
          </div>
          <ImageField label="Banner image (optional)" name="imageUrl" defaultValue={item?.imageUrl} />
        </Card>
        <SeoFields title={item?.seoTitle} description={item?.seoDescription} titleHint="e.g. “Family Lawyer in Lahore – Divorce & Custody”. Defaults to “Title Lawyer in City”." />
        <FormFooter backHref="/admin/practice-areas" />
      </form>
    </>
  );
}
