import { ItemList } from "@/components/admin/ItemList";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteTestimonial } from "../../actions";

export const metadata = { title: "Testimonials" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, items] = await Promise.all([
    searchParams,
    db.testimonial.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);
  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Only publish genuine feedback you have the client's permission to share. The section is hidden when none are published."
        action={{ href: "/admin/testimonials/new", label: "Add testimonial" }}
      />
      <Flash saved={saved} />
      <ItemList
        basePath="/admin/testimonials"
        deleteAction={deleteTestimonial}
        empty="No testimonials yet."
        rows={items.map((t) => ({ id: t.id, title: t.name, subtitle: t.quote, published: t.published, extra: `${t.rating}★` }))}
      />
    </>
  );
}
