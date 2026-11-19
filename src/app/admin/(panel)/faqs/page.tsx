import { ItemList } from "@/components/admin/ItemList";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteFaq } from "../../actions";

export const metadata = { title: "FAQs" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, items] = await Promise.all([
    searchParams,
    db.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);
  return (
    <>
      <PageHeader
        title="FAQs"
        description="Shown on the home page (first 6) and the FAQ page. Google can show these directly in search results."
        action={{ href: "/admin/faqs/new", label: "Add FAQ" }}
      />
      <Flash saved={saved} />
      <ItemList
        basePath="/admin/faqs"
        deleteAction={deleteFaq}
        empty="No FAQs yet."
        rows={items.map((f) => ({ id: f.id, title: f.question, published: f.published, extra: `Order ${f.sortOrder}` }))}
      />
    </>
  );
}
