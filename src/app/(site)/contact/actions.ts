"use server";

import { db } from "@/lib/db";

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

  await db.message.create({
    data: {
      name: fields.name.slice(0, 190),
      email: fields.email.slice(0, 190),
      phone: fields.phone.slice(0, 60),
      practiceArea: fields.practiceArea.slice(0, 190),
      message: fields.message,
    },
  });
  return { ok: true };
}
