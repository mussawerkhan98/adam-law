import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="hero-pattern grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.png" alt="Adam Law Chamber" width={640} height={714} className="mx-auto mb-8 h-auto w-36" />
        <div className="rounded-xl bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-semibold text-slate-900">Admin Panel</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to manage the website</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
