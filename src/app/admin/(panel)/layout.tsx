import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = await db.message.count({ where: { read: false } });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="border-b border-slate-800 bg-slate-900 text-slate-300 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-5 py-4 lg:py-6">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-mark.png" alt="" width={211} height={160} className="h-9 w-auto" />
            <span className="leading-tight">
              <span className="block text-sm font-semibold">Adam Law Chamber</span>
              <span className="block text-xs text-slate-400">Admin panel</span>
            </span>
          </Link>
        </div>
        <AdminNav unread={unread} />
        <div className="hidden border-t border-slate-800 p-4 text-xs lg:block">
          <p className="truncate text-slate-400">{session.email}</p>
          <div className="mt-3 flex items-center justify-between">
            <Link href="/" target="_blank" className="text-slate-300 hover:text-white">
              View website ↗
            </Link>
            <form action={logout}>
              <button className="text-slate-300 hover:text-white">Log out</button>
            </form>
          </div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <div className="mt-12 flex justify-between border-t border-slate-200 pt-4 text-xs lg:hidden">
          <Link href="/" target="_blank" className="text-slate-500">
            View website ↗
          </Link>
          <form action={logout}>
            <button className="text-slate-500">Log out</button>
          </form>
        </div>
      </main>
    </div>
  );
}
