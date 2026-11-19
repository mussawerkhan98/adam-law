"use client";

import { useActionState } from "react";
import { CheckIcon } from "@/components/icons";
import { sendMessage, type ContactState } from "./actions";

const input =
  "w-full rounded-md border border-cream-200 bg-cream-50/70 px-4 py-3.5 text-ink outline-none transition placeholder:text-muted/60 hover:border-gold-500/40 focus:border-gold-500 focus:bg-white focus:ring-4 focus:ring-gold-500/15";

export function ContactForm({ areas, defaultArea }: { areas: string[]; defaultArea?: string }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendMessage, { ok: false });

  if (state.ok) {
    return (
      <div className="card animate-fade-up border-gold-500/40 p-10 text-center md:p-14" role="status">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-navy-950 shadow-lg shadow-gold-500/30">
          <CheckIcon width={30} height={30} />
        </span>
        <h2 className="mt-6 font-serif text-3xl font-semibold text-navy-900">Thank you — message received</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">We will review your enquiry and get back to you as soon as possible.</p>
      </div>
    );
  }

  const f = state.fields ?? {};
  return (
    <form action={action} className="card space-y-5 p-6 shadow-[0_30px_60px_-40px_rgb(10_22_40/0.35)] md:p-10" noValidate>
      <div className="mb-3">
        <h2 className="font-serif text-[2rem] leading-tight font-semibold text-navy-900">Send us a message</h2>
        <p className="mt-2 text-muted">Tell us briefly about your matter — it takes less than two minutes.</p>
      </div>
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
