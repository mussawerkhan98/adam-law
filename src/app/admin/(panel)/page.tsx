import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const [areas, team, posts, drafts, faqs, testimonials, unread, messages, settings] = await Promise.all([
    db.practiceArea.count(),
    db.teamMember.count(),
    db.post.count({ where: { published: true } }),
    db.post.count({ where: { published: false } }),
    db.faq.count(),
    db.testimonial.count(),
    db.message.count({ where: { read: false } }),
    db.message.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  const cards = [
    { label: "Unread messages", value: unread, href: "/admin/messages", highlight: unread > 0 },
    { label: "Practice areas", value: areas, href: "/admin/practice-areas" },
    { label: "Published articles", value: posts, href: "/admin/posts", note: drafts ? `${drafts} draft(s)` : undefined },
    { label: "Team members", value: team, href: "/admin/team" },
    { label: "Testimonials", value: testimonials, href: "/admin/testimonials" },
    { label: "FAQs", value: faqs, href: "/admin/faqs" },
  ];

  const checklist = [
    { done: !!settings?.phone, label: "Add phone number", href: "/admin/settings" },
    { done: !!settings?.address && !!settings?.city, label: "Add office address & city (important for local SEO)", href: "/admin/settings" },
    { done: !!settings?.email, label: "Add email address", href: "/admin/settings" },
    { done: !!settings?.mapEmbedUrl, label: "Add Google Map to contact page", href: "/admin/settings" },
    { done: !!settings?.seoDescription, label: "Write the site meta description", href: "/admin/settings" },
    { done: testimonials > 0, label: "Add real client testimonials", href: "/admin/testimonials" },
    { done: !!settings?.heroImageUrl || !!settings?.aboutImageUrl, label: "Upload a professional photo", href: "/admin/homepage" },
  ];
  const todo = checklist.filter((c) => !c.done);

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of your website content and enquiries." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-lg border bg-white p-5 shadow-sm transition hover:shadow ${
              c.highlight ? "border-amber-300 ring-1 ring-amber-200" : "border-slate-200"
            }`}
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-semibold">{c.value}</p>
            {c.note && <p className="mt-1 text-xs text-slate-400">{c.note}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-amber-700 hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {messages.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/messages/${m.id}`} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-amber-600"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex justify-between gap-3 text-sm">
                      <span className={m.read ? "" : "font-semibold"}>{m.name}</span>
                      <span className="shrink-0 text-xs text-slate-400">{m.createdAt.toLocaleDateString("en-GB")}</span>
                    </span>
                    <span className="block truncate text-sm text-slate-500">{m.message}</span>
                  </span>
                </Link>
              </li>
            ))}
            {messages.length === 0 && <li className="px-5 py-8 text-center text-sm text-slate-400">No messages yet.</li>}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Launch checklist</h2>
          <p className="mt-1 text-sm text-slate-500">
            {todo.length ? `${todo.length} item(s) left before going live.` : "Everything is set — great work!"}
          </p>
          <ul className="mt-4 space-y-2.5">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-2.5 text-sm">
                <span
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${
                    c.done ? "bg-emerald-500 text-white" : "border border-slate-300"
                  }`}
                >
                  {c.done ? "✓" : ""}
                </span>
                {c.done ? (
                  <span className="text-slate-400 line-through">{c.label}</span>
                ) : (
                  <Link href={c.href} className="text-slate-700 hover:text-amber-700">
                    {c.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
