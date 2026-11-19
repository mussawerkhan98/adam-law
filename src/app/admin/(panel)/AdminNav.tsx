"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/messages", label: "Messages", badge: true },
    ],
  },
  {
    label: "Website content",
    items: [
      { href: "/admin/homepage", label: "Home & About page" },
      { href: "/admin/practice-areas", label: "Practice areas" },
      { href: "/admin/team", label: "Team" },
      { href: "/admin/posts", label: "Blog / Insights" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/faqs", label: "FAQs" },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings", label: "Firm details & SEO" },
      { href: "/admin/account", label: "My account" },
    ],
  },
];

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <nav className="flex-1 overflow-x-auto px-3 pb-3 lg:overflow-y-auto lg:pb-6">
      <div className="flex gap-1 lg:block lg:space-y-6">
        {GROUPS.map((g) => (
          <div key={g.label} className="flex gap-1 lg:block">
            <p className="hidden px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase lg:block">
              {g.label}
            </p>
            {g.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition ${
                  active(item.href) ? "bg-slate-800 text-white" : "hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {item.label}
                {item.badge && unread > 0 && (
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[11px] font-semibold text-white">{unread}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
