import Link from "next/link";
import { ConfirmButton } from "@/components/admin/client";
import { Flash, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteMessage } from "../../actions";

export const metadata = { title: "Messages" };

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ saved?: string; filter?: string }> }) {
  const { saved, filter } = await searchParams;
  const messages = await db.message.findMany({
    where: filter === "unread" ? { read: false } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <>
      <PageHeader title="Messages" description="Enquiries submitted through the website contact form." />
      <Flash saved={saved} />
      <div className="mb-4 flex gap-2 text-sm">
        {[
          ["All", "/admin/messages", filter !== "unread"],
          ["Unread", "/admin/messages?filter=unread", filter === "unread"],
        ].map(([label, href, active]) => (
          <Link
            key={label as string}
            href={href as string}
            className={`rounded-full px-3 py-1 ${active ? "bg-slate-900 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
          >
            {label}
          </Link>
        ))}
      </div>
      {messages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">
          No messages.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {messages.map((m) => (
            <li key={m.id} className="flex items-start gap-4 px-5 py-4">
              <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-slate-200" : "bg-amber-600"}`} />
              <Link href={`/admin/messages/${m.id}`} className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span className={m.read ? "text-slate-700" : "font-semibold text-slate-900"}>
                    {m.name} <span className="font-normal text-slate-400">· {m.email}</span>
                  </span>
                  <span className="text-xs text-slate-400">{m.createdAt.toLocaleString("en-GB")}</span>
                </span>
                {m.practiceArea && <span className="mt-0.5 block text-xs text-amber-700">{m.practiceArea}</span>}
                <span className="mt-1 line-clamp-2 block text-sm text-slate-500">{m.message}</span>
              </Link>
              <form action={deleteMessage}>
                <input type="hidden" name="id" value={m.id} />
                <ConfirmButton message="Delete this message?" />
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
