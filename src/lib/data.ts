// Read-only data access for the public website.
// `connection()` opts pages into request-time rendering so admin edits show immediately
// and the build never needs a database connection.
import { cache } from "react";
import { connection } from "next/server";
import { mergeContent } from "./content";
import { db } from "./db";

export const getSettings = cache(async () => {
  await connection();
  return db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
});

export type Settings = Awaited<ReturnType<typeof getSettings>>;

/** All editable page text (Admin → Pages & sections), merged over the built-in defaults. */
export const getContent = cache(async () => {
  await connection();
  const rows = await db.pageContent.findMany();
  const saved: Record<string, unknown> = {};
  for (const r of rows) {
    try {
      saved[r.key] = JSON.parse(r.data);
    } catch {}
  }
  return mergeContent(saved);
});

export const getPracticeAreas = cache(async () => {
  await connection();
  return db.practiceArea.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
  });
});

export const getPracticeArea = cache(async (slug: string) => {
  await connection();
  return db.practiceArea.findFirst({ where: { slug, published: true } });
});

export const getTeam = cache(async () => {
  await connection();
  return db.teamMember.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
});

export const getTestimonials = cache(async () => {
  await connection();
  return db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
});

export const getFaqs = cache(async () => {
  await connection();
  return db.faq.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
});

export const getPosts = cache(async (take?: number) => {
  await connection();
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
});

export const getPost = cache(async (slug: string) => {
  await connection();
  return db.post.findFirst({ where: { slug, published: true } });
});
