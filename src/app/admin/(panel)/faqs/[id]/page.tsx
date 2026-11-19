import { notFound } from "next/navigation";
import { FormFooter } from "@/components/admin/ItemList";
import { Card, Checkbox, Field, Flash, PageHeader, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { saveFaq } from "../../../actions";

export const metadata = { title: "Edit FAQ" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const item = id === "new" ? null : await db.faq.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !item) notFound();

  return (
    <>
      <PageHeader title={item ? "Edit FAQ" : "New FAQ"} />
      <Flash error={error} />
      <form action={saveFaq} className="space-y-6">
        <input type="hidden" name="id" value={item?.id ?? "new"} />
        <Card>
          <TextArea label="Question" name="question" defaultValue={item?.question} rows={2} required />
          <TextArea label="Answer" name="answer" defaultValue={item?.answer} rows={6} required markdown />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Display order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} />
            <div className="pt-7">
              <Checkbox label="Published" name="published" defaultChecked={item?.published ?? true} />
            </div>
          </div>
        </Card>
        <FormFooter backHref="/admin/faqs" />
      </form>
    </>
  );
}
