import { SubmitButton } from "@/components/admin/client";
import { Card, Field, Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { changePassword } from "../../actions";

export const metadata = { title: "My account" };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ saved, error }, session] = await Promise.all([searchParams, requireAdmin()]);
  const user = await db.adminUser.findUnique({ where: { id: session.userId } });

  return (
    <>
      <PageHeader title="My account" description={user?.email} />
      <Flash saved={saved} error={error} />
      <form action={changePassword} className="max-w-xl space-y-6">
        <Card title="Change password">
          <Field label="Display name" name="name" defaultValue={user?.name} />
          <Field label="Current password" name="current" type="password" required />
          <Field label="New password" name="next" type="password" required hint="At least 10 characters." />
          <Field label="Confirm new password" name="confirm" type="password" required />
          <div className="flex justify-end">
            <SubmitButton>Update password</SubmitButton>
          </div>
        </Card>
      </form>
    </>
  );
}
