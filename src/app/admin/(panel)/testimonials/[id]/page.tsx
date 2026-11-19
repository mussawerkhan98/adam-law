import { notFound } from "next/navigation";
import { FormFooter } from "@/components/admin/ItemList";
import { Card, Checkbox, Field, Flash, PageHeader, Select, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { saveTestimonial } from "../../../actions";

export const metadata = { title: "Edit testimonial" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const item = id === "new" ? null : await db.testimonial.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !item) notFound();

  return (
    <>
      <PageHeader title={item ? `Edit: ${item.name}` : "New testimonial"} />
      <Flash error={error} />
      <form action={saveTestimonial} className="space-y-6">
        <input type="hidden" name="id" value={item?.id ?? "new"} />
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Client name" name="name" defaultValue={item?.name} required hint="Initials are fine for privacy, e.g. “A. K.”" />
            <Field label="Description (optional)" name="role" defaultValue={item?.role} placeholder="e.g. Property dispute client" />
          </div>
          <TextArea label="Quote" name="quote" defaultValue={item?.quote} rows={5} required />
          <div className="grid gap-5 md:grid-cols-3">
            <Select
              label="Rating"
              name="rating"
              defaultValue={String(item?.rating ?? 5)}
              options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? "s" : ""}` }))}
            />
            <Field label="Display order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
            <div className="pt-7">
              <Checkbox label="Published" name="published" defaultChecked={item?.published ?? true} />
            </div>
          </div>
        </Card>
        <FormFooter backHref="/admin/testimonials" />
      </form>
    </>
  );
}
