import { ItemList } from "@/components/admin/ItemList";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deletePost } from "../../actions";

export const metadata = { title: "Blog / Insights" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, items] = await Promise.all([
    searchParams,
    db.post.findMany({ orderBy: [{ published: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }] }),
  ]);
  return (
    <>
      <PageHeader
        title="Blog / Insights"
        description="Regular, helpful articles are one of the best ways to bring visitors from Google."
        action={{ href: "/admin/posts/new", label: "Write article" }}
      />
      <Flash saved={saved} />
      <ItemList
        basePath="/admin/posts"
        deleteAction={deletePost}
        empty="No articles yet."
        rows={items.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: `/blog/${p.slug}`,
          published: p.published,
          extra: p.publishedAt ? p.publishedAt.toLocaleDateString("en-GB") : "Draft",
        }))}
      />
    </>
  );
}
