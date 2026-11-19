import { ItemList } from "@/components/admin/ItemList";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deletePracticeArea } from "../../actions";

export const metadata = { title: "Practice areas" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, items] = await Promise.all([
    searchParams,
    db.practiceArea.findMany({ orderBy: [{ sortOrder: "asc" }, { title: "asc" }] }),
  ]);
  return (
    <>
      <PageHeader
        title="Practice areas"
        description="Each practice area gets its own page — great for ranking in Google for specific services."
        action={{ href: "/admin/practice-areas/new", label: "Add practice area" }}
      />
      <Flash saved={saved} />
      <ItemList
        basePath="/admin/practice-areas"
        deleteAction={deletePracticeArea}
        empty="No practice areas yet."
        rows={items.map((a) => ({ id: a.id, title: a.title, subtitle: `/practice-areas/${a.slug}`, published: a.published, extra: `Order ${a.sortOrder}` }))}
      />
    </>
  );
}
