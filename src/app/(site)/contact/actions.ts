"use server";

import { after } from "next/server";
import { db } from "@/lib/db";
import { sendContactAlert } from "@/lib/mail";

export type ContactState = { ok: boolean; error?: string; fields?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendMessage(_prev: ContactState, form: FormData): Promise<ContactState> {
  const get = (k: string) => String(form.get(k) ?? "").trim();
  const fields = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    practiceArea: get("practiceArea"),
    message: get("message"),
  };

  // Honeypot: real visitors never fill this hidden field.
  if (get("company")) return { ok: true };

  if (fields.name.length < 2) return { ok: false, error: "Please enter your name.", fields };
  if (!EMAIL_RE.test(fields.email)) return { ok: false, error: "Please enter a valid email address.", fields };
  if (fields.message.length < 10) return { ok: false, error: "Please tell us a little more about your matter.", fields };
  if (fields.message.length > 5000) return { ok: false, error: "Message is too long (max 5000 characters).", fields };

  const saved = await db.message.create({
    data: {
      name: fields.name.slice(0, 190),
      email: fields.email.slice(0, 190),
      phone: fields.phone.slice(0, 60),
      practiceArea: fields.practiceArea.slice(0, 190),
      message: fields.message,
    },
  });

  // Email the firm after the response is sent, so the visitor never waits on (or sees) mail problems.
  // The enquiry is already saved, so a failed email only means no alert — it still shows in Admin → Messages.
  after(async () => {
    try {
      const settings = await db.siteSettings.findUnique({ where: { id: 1 }, select: { firmName: true, email: true } });
      const result = await sendContactAlert(saved, {
        firmName: settings?.firmName || "Adam Law Chamber",
        email: settings?.email || "",
      });
      if (!result.sent) console.warn(`[contact] Email alert skipped for message ${saved.id}: ${result.reason}`);
    } catch (err) {
      console.error(`[contact] Email alert failed for message ${saved.id}:`, err);
    }
  });

  return { ok: true };
}
