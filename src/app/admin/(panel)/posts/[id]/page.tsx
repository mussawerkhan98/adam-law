import { notFound } from "next/navigation";
import { ImageField } from "@/components/admin/client";
import { FormFooter } from "@/components/admin/ItemList";
import { Card, Checkbox, Field, Flash, PageHeader, SeoFields, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { savePost } from "../../../actions";

export const metadata = { title: "Edit article" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const item = id === "new" ? null : await db.post.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !item) notFound();

  return (
    <>
      <PageHeader title={item ? `Edit: ${item.title}` : "New article"} />
      <Flash error={error} />
      <form action={savePost} className="space-y-6">
        <input type="hidden" name="id" value={item?.id ?? "new"} />
        <Card>
          <Field label="Title" name="title" defaultValue={item?.title} required />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="URL slug" name="slug" defaultValue={item?.slug} hint="Leave blank to create from the title." />
            <Field label="Author" name="author" defaultValue={item?.author} hint="Defaults to the firm name." />
          </div>
          <TextArea label="Excerpt" name="excerpt" defaultValue={item?.excerpt} rows={3} hint="1–2 sentence summary shown in article lists." />
          <TextArea label="Article" name="body" defaultValue={item?.body} rows={22} markdown />
          <ImageField label="Cover image" name="coverUrl" defaultValue={item?.coverUrl} hint="16:9 landscape image." />
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Publish date"
              name="publishedAt"
              type="date"
              defaultValue={item?.publishedAt ? item.publishedAt.toISOString().slice(0, 10) : ""}
              hint="Leave blank to use today's date when publishing."
            />
            <div className="pt-7">
              <Checkbox label="Published" name="published" defaultChecked={item?.published ?? false} hint="Unpublished articles are saved as drafts." />
            </div>
          </div>
        </Card>
        <SeoFields title={item?.seoTitle} description={item?.seoDescription} />
        <FormFooter backHref="/admin/posts" />
      </form>
    </>
  );
}
