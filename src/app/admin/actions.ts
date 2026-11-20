"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PRACTICE_ICON_KEYS } from "@/components/icons";
import { SESSION_COOKIE } from "@/lib/auth";
import { PAGES } from "@/lib/content";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { slugify } from "@/lib/utils";

/* ---------- helpers ---------- */
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const optText = (f: FormData, k: string) => str(f, k) || null;
const bool = (f: FormData, k: string) => f.get(k) === "on";
const int = (f: FormData, k: string, d = 0) => {
  const n = parseInt(str(f, k), 10);
  return Number.isFinite(n) ? n : d;
};
const idOf = (f: FormData) => {
  const raw = str(f, "id");
  return raw && raw !== "new" ? Number(raw) : null;
};
const back = (path: string, params: Record<string, string>) =>
  redirect(`${path}?${new URLSearchParams(params).toString()}`);

/** Only accept relative paths or http(s) URLs for links/images stored by admins. */
function safeUrl(value: string) {
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Accepts a Google Maps embed URL or the full <iframe> code copied from Google Maps. */
function mapEmbed(value: string) {
  if (!value) return null;
  const src = value.match(/src=["']([^"']+)["']/)?.[1] ?? value;
  try {
    const u = new URL(src);
    if (u.protocol === "https:" && /(^|\.)google\.[a-z.]+$/.test(u.hostname) && u.pathname.startsWith("/maps")) {
      return u.toString();
    }
  } catch {}
  return null;
}

async function uniqueSlug(model: "practiceArea" | "post", wanted: string, excludeId: number | null) {
  const base = slugify(wanted) || "item";
  let slug = base;
  for (let i = 2; ; i++) {
    const existing =
      model === "post"
        ? await db.post.findUnique({ where: { slug }, select: { id: true } })
        : await db.practiceArea.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i}`;
  }
}

/* ---------- auth ---------- */
export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function changePassword(f: FormData) {
  const session = await requireAdmin();
  const current = String(f.get("current") ?? "");
  const next = String(f.get("next") ?? "");
  const confirm = String(f.get("confirm") ?? "");
  const user = await db.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !(await bcrypt.compare(current, user.passwordHash)))
    back("/admin/account", { error: "Current password is incorrect." });
  if (next.length < 10) back("/admin/account", { error: "New password must be at least 10 characters." });
  if (next !== confirm) back("/admin/account", { error: "New passwords do not match." });
  await db.adminUser.update({
    where: { id: session.userId },
    data: { passwordHash: await bcrypt.hash(next, 12), name: str(f, "name") || user!.name },
  });
  back("/admin/account", { saved: "1" });
}

/* ---------- site settings (firm details, home page, SEO) ---------- */
const SETTINGS_TEXT = [
  "firmName", "tagline", "phone", "whatsapp", "email", "address", "city", "region", "postalCode", "country",
  "officeHours", "heroEyebrow", "heroTitle", "aboutTitle", "stat1Value", "stat1Label", "stat2Value", "stat2Label",
  "stat3Value", "stat3Label", "stat4Value", "stat4Label", "ctaTitle", "seoTitle", "googleVerification",
] as const;
const SETTINGS_LONG = ["heroSubtitle", "aboutBody", "ctaText", "footerText", "seoDescription", "seoKeywords"] as const;
const SETTINGS_URL = ["logoUrl", "heroImageUrl", "aboutImageUrl", "ogImageUrl", "facebook", "instagram", "linkedin", "twitter", "youtube"] as const;

export async function saveSettings(f: FormData) {
  await requireAdmin();
  const returnTo = str(f, "returnTo") === "/admin/homepage" ? "/admin/homepage" : "/admin/settings";
  const data: Record<string, string | null> = {};
  // Only update fields present on the submitted form (settings + homepage share this action).
  for (const k of SETTINGS_TEXT) if (f.has(k)) data[k] = str(f, k).slice(0, 190);
  for (const k of SETTINGS_LONG) if (f.has(k)) data[k] = optText(f, k);
  for (const k of SETTINGS_URL) if (f.has(k)) data[k] = safeUrl(str(f, k)).slice(0, 190);
  if (f.has("mapEmbedUrl")) {
    const raw = str(f, "mapEmbedUrl");
    const parsed = mapEmbed(raw);
    if (raw && !parsed) back(returnTo, { error: "Map must be a Google Maps embed link (Share → Embed a map)." });
    data.mapEmbedUrl = parsed;
  }
  if (data.firmName === "") data.firmName = "Adam Law Chamber";
  await db.siteSettings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
  back(returnTo, { saved: "1" });
}

/* ---------- page text & sections ---------- */
export async function savePageContent(f: FormData) {
  await requireAdmin();
  const page = PAGES.find((p) => p.id === str(f, "page"));
  if (!page) redirect("/admin/pages");
  for (const section of page.sections) {
    const data: Record<string, unknown> = {};
    for (const field of section.fields) {
      const name = `${section.key}.${field.key}`;
      if (field.type === "toggle") {
        data[field.key] = f.get(name) === "on";
      } else if (field.type === "list") {
        const limit = field.fixedLabels?.length ?? field.max ?? 20;
        const count = Math.min(Math.max(0, int(f, `${name}.count`)), limit);
        const items: Record<string, string>[] = [];
        for (let i = 0; i < count; i++) {
          const item: Record<string, string> = {};
          for (const sub of field.item ?? []) {
            const v = str(f, `${name}.${i}.${sub.key}`);
            item[sub.key] = sub.type === "icon" ? (PRACTICE_ICON_KEYS.includes(v) ? v : "scale") : v.slice(0, 600);
          }
          // Drop rows left completely empty (icons alone don't count); fixed lists keep every row.
          const hasText = (field.item ?? []).some((sub) => sub.type !== "icon" && item[sub.key]);
          if (hasText || field.fixedLabels) items.push(item);
        }
        data[field.key] = items;
      } else {
        data[field.key] = str(f, name).slice(0, field.type === "textarea" ? 2000 : 300);
      }
    }
    const json = JSON.stringify(data);
    await db.pageContent.upsert({ where: { key: section.key }, update: { data: json }, create: { key: section.key, data: json } });
  }
  back(`/admin/pages/${page.id}`, { saved: "1" });
}

export async function resetPageSection(f: FormData) {
  await requireAdmin();
  const page = PAGES.find((p) => p.id === str(f, "page"));
  const section = page?.sections.find((s) => s.key === str(f, "section"));
  if (!page || !section) redirect("/admin/pages");
  await db.pageContent.deleteMany({ where: { key: section.key } });
  back(`/admin/pages/${page.id}`, { saved: "1" });
}

/* ---------- practice areas ---------- */
export async function savePracticeArea(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  const title = str(f, "title");
  if (!title) back(`/admin/practice-areas/${id ?? "new"}`, { error: "Title is required." });
  const data = {
    title: title.slice(0, 190),
    slug: await uniqueSlug("practiceArea", str(f, "slug") || title, id),
    icon: str(f, "icon") || "scale",
    summary: str(f, "summary"),
    body: optText(f, "body"),
    imageUrl: safeUrl(str(f, "imageUrl")).slice(0, 190),
    sortOrder: int(f, "sortOrder"),
    published: bool(f, "published"),
    seoTitle: str(f, "seoTitle").slice(0, 190),
    seoDescription: optText(f, "seoDescription"),
  };
  if (id) await db.practiceArea.update({ where: { id }, data });
  else await db.practiceArea.create({ data });
  back("/admin/practice-areas", { saved: "1" });
}

export async function deletePracticeArea(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.practiceArea.delete({ where: { id } });
  back("/admin/practice-areas", { saved: "deleted" });
}

/* ---------- team ---------- */
export async function saveTeamMember(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  const name = str(f, "name");
  if (!name) back(`/admin/team/${id ?? "new"}`, { error: "Name is required." });
  const data = {
    name: name.slice(0, 190),
    role: str(f, "role").slice(0, 190),
    bio: optText(f, "bio"),
    photoUrl: safeUrl(str(f, "photoUrl")).slice(0, 190),
    email: str(f, "email").slice(0, 190),
    phone: str(f, "phone").slice(0, 60),
    sortOrder: int(f, "sortOrder"),
    published: bool(f, "published"),
  };
  if (id) await db.teamMember.update({ where: { id }, data });
  else await db.teamMember.create({ data });
  back("/admin/team", { saved: "1" });
}

export async function deleteTeamMember(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.teamMember.delete({ where: { id } });
  back("/admin/team", { saved: "deleted" });
}

/* ---------- testimonials ---------- */
export async function saveTestimonial(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  const name = str(f, "name");
  const quote = str(f, "quote");
  if (!name || !quote) back(`/admin/testimonials/${id ?? "new"}`, { error: "Name and quote are required." });
  const data = {
    name: name.slice(0, 190),
    role: str(f, "role").slice(0, 190),
    quote,
    rating: Math.min(5, Math.max(1, int(f, "rating", 5))),
    sortOrder: int(f, "sortOrder"),
    published: bool(f, "published"),
  };
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  back("/admin/testimonials", { saved: "1" });
}

export async function deleteTestimonial(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.testimonial.delete({ where: { id } });
  back("/admin/testimonials", { saved: "deleted" });
}

/* ---------- FAQs ---------- */
export async function saveFaq(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  const question = str(f, "question");
  const answer = str(f, "answer");
  if (!question || !answer) back(`/admin/faqs/${id ?? "new"}`, { error: "Question and answer are required." });
  const data = { question, answer, sortOrder: int(f, "sortOrder"), published: bool(f, "published") };
  if (id) await db.faq.update({ where: { id }, data });
  else await db.faq.create({ data });
  back("/admin/faqs", { saved: "1" });
}

export async function deleteFaq(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.faq.delete({ where: { id } });
  back("/admin/faqs", { saved: "deleted" });
}

/* ---------- blog posts ---------- */
export async function savePost(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  const title = str(f, "title");
  if (!title) back(`/admin/posts/${id ?? "new"}`, { error: "Title is required." });
  const published = bool(f, "published");
  const existing = id ? await db.post.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
  const dateInput = str(f, "publishedAt");
  const publishedAt = dateInput ? new Date(dateInput) : published ? (existing?.publishedAt ?? new Date()) : null;
  const data = {
    title: title.slice(0, 190),
    slug: await uniqueSlug("post", str(f, "slug") || title, id),
    excerpt: optText(f, "excerpt"),
    body: optText(f, "body"),
    coverUrl: safeUrl(str(f, "coverUrl")).slice(0, 190),
    author: str(f, "author").slice(0, 190),
    published,
    publishedAt: publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : published ? new Date() : null,
    seoTitle: str(f, "seoTitle").slice(0, 190),
    seoDescription: optText(f, "seoDescription"),
  };
  if (id) await db.post.update({ where: { id }, data });
  else await db.post.create({ data });
  back("/admin/posts", { saved: "1" });
}

export async function deletePost(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.post.delete({ where: { id } });
  back("/admin/posts", { saved: "deleted" });
}

/* ---------- messages ---------- */
export async function setMessageRead(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.message.update({ where: { id }, data: { read: str(f, "read") === "1" } });
  redirect(str(f, "returnTo") === "list" ? "/admin/messages" : `/admin/messages/${id}`);
}

export async function deleteMessage(f: FormData) {
  await requireAdmin();
  const id = idOf(f);
  if (id) await db.message.delete({ where: { id } });
  back("/admin/messages", { saved: "deleted" });
}
