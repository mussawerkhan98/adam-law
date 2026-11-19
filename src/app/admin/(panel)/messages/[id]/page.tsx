import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton } from "@/components/admin/client";
import { db } from "@/lib/db";
import { deleteMessage, setMessageRead } from "../../../actions";

export const metadata = { title: "Message" };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let m = await db.message.findUnique({ where: { id: Number(id) || 0 } });
  if (!m) notFound();
  if (!m.read) m = await db.message.update({ where: { id: m.id }, data: { read: true } });

  const reply = `mailto:${m.email}?subject=${encodeURIComponent("Re: your enquiry")}`;
  const phoneDigits = m.phone.replace(/\D/g, "");

  return (
    <>
      <Link href="/admin/messages" className="text-sm text-slate-500 hover:text-slate-900">
        ← All messages
      </Link>
      <article className="mt-4 rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 p-6">
          <h1 className="text-xl font-semibold">{m.name}</h1>
          <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            <div>
              <dt className="inline text-slate-400">Email: </dt>
              <dd className="inline">
                <a href={`mailto:${m.email}`} className="text-amber-700 hover:underline">
                  {m.email}
                </a>
              </dd>
            </div>
            {m.phone && (
              <div>
                <dt className="inline text-slate-400">Phone: </dt>
                <dd className="inline">
                  <a href={`tel:${m.phone}`} className="text-amber-700 hover:underline">
                    {m.phone}
                  </a>
                </dd>
              </div>
            )}
            {m.practiceArea && (
              <div>
                <dt className="inline text-slate-400">Matter: </dt>
                <dd className="inline">{m.practiceArea}</dd>
              </div>
            )}
            <div>
              <dt className="inline text-slate-400">Received: </dt>
              <dd className="inline">{m.createdAt.toLocaleString("en-GB")}</dd>
            </div>
          </dl>
        </header>
        <div className="p-6 whitespace-pre-wrap text-slate-800">{m.message}</div>
        <footer className="flex flex-wrap items-center gap-3 border-t border-slate-100 p-6">
          <a href={reply} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
            Reply by email
          </a>
          {phoneDigits && (
            <a
              href={`https://wa.me/${phoneDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              WhatsApp
            </a>
          )}
          <form action={setMessageRead}>
            <input type="hidden" name="id" value={m.id} />
            <input type="hidden" name="read" value="0" />
            <input type="hidden" name="returnTo" value="list" />
            <button className="rounded-md px-4 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50">
              Mark as unread
            </button>
          </form>
          <form action={deleteMessage} className="ml-auto">
            <input type="hidden" name="id" value={m.id} />
            <ConfirmButton message="Delete this message?" />
          </form>
        </footer>
      </article>
    </>
  );
}
