import { notFound } from "next/navigation";
import { ImageField } from "@/components/admin/client";
import { FormFooter } from "@/components/admin/ItemList";
import { Card, Checkbox, Field, Flash, PageHeader, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { saveTeamMember } from "../../../actions";

export const metadata = { title: "Edit team member" };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const item = id === "new" ? null : await db.teamMember.findUnique({ where: { id: Number(id) || 0 } });
  if (id !== "new" && !item) notFound();

  return (
    <>
      <PageHeader title={item ? `Edit: ${item.name}` : "New team member"} />
      <Flash error={error} />
      <form action={saveTeamMember} className="space-y-6">
        <input type="hidden" name="id" value={item?.id ?? "new"} />
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" name="name" defaultValue={item?.name} required />
            <Field label="Role / title" name="role" defaultValue={item?.role} placeholder="e.g. Advocate High Court" />
            <Field label="Email (optional)" name="email" type="email" defaultValue={item?.email} />
            <Field label="Phone (optional)" name="phone" defaultValue={item?.phone} />
          </div>
          <TextArea label="Biography" name="bio" defaultValue={item?.bio} rows={10} markdown hint="Education, bar memberships, courts of practice, experience." />
          <ImageField label="Photo" name="photoUrl" defaultValue={item?.photoUrl} hint="Professional portrait, ideally 4:5 ratio." />
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Display order" name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} hint="The first member is featured on the home page." />
            <div className="pt-7">
              <Checkbox label="Published" name="published" defaultChecked={item?.published ?? true} />
            </div>
          </div>
        </Card>
        <FormFooter backHref="/admin/team" />
      </form>
    </>
  );
}
