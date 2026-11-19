"use client";

import { useActionState } from "react";
import { CheckIcon } from "@/components/icons";
import { sendMessage, type ContactState } from "./actions";

const input =
  "w-full rounded border border-cream-200 bg-cream-50 px-4 py-3 text-ink outline-none transition placeholder:text-muted/60 focus:border-gold-500 focus:bg-white focus:ring-2 focus:ring-gold-500/20";

export function ContactForm({ areas, defaultArea }: { areas: string[]; defaultArea?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false });

  if (state.ok) {
    return (
      <div className="rounded-lg border border-gold-500/40 bg-white p-10 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold-500/15 text-gold-600">
          <CheckIcon width={28} height={28} />
        </span>
        <h2 className="mt-5 font-serif text-2xl text-navy-900">Thank you — message received</h2>
        <p className="mt-3 text-muted">We will review your enquiry and get back to you as soon as possible.</p>
      </div>
    );
  }

  const f = state.fields ?? {};
  return (
    <form action={action} className="space-y-5 rounded-lg border border-cream-200 bg-white p-6 md:p-10" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-navy-900">Full name *</span>
          <input name="name" required autoComplete="name" defaultValue={f.name} className={input} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-navy-900">Email *</span>
          <input name="email" type="email" required autoComplete="email" defaultValue={f.email} className={input} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-navy-900">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" defaultValue={f.phone} className={input} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-navy-900">Legal matter</span>
          <select name="practiceArea" defaultValue={f.practiceArea ?? defaultArea ?? ""} className={input}>
            <option value="">Select an area (optional)</option>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
            <option>Other</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-navy-900">How can we help? *</span>
        <textarea name="message" required rows={6} defaultValue={f.message} className={input} />
      </label>
      {/* Honeypot field for bots */}
      <div aria-hidden className="absolute -left-[9999px]" >
        <label>
          Company <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.error && (
        <p role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted">Your information is kept strictly confidential.</p>
        <button type="submit" disabled={pending} className="btn-gold disabled:opacity-60">
          {pending ? "Sending…" : "Send Message"}
        </button>
      </div>
    </form>
  );
}
