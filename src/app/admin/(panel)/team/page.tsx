import { ItemList } from "@/components/admin/ItemList";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteTeamMember } from "../../actions";

export const metadata = { title: "Team" };

export default async function Page({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, items] = await Promise.all([
    searchParams,
    db.teamMember.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  return (
    <>
      <PageHeader title="Team" description="Advocates and staff shown on the Our Team page." action={{ href: "/admin/team/new", label: "Add team member" }} />
      <Flash saved={saved} />
      <ItemList
        basePath="/admin/team"
        deleteAction={deleteTeamMember}
        empty="No team members yet."
        rows={items.map((m) => ({ id: m.id, title: m.name, subtitle: m.role, published: m.published, extra: `Order ${m.sortOrder}` }))}
      />
    </>
  );
}
