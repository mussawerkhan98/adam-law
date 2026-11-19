import type { MetadataRoute } from "next";
import { getPosts, getPracticeAreas } from "@/lib/data";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, posts] = await Promise.all([getPracticeAreas(), getPosts()]);
  const now = new Date();
  const staticPages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/about", 0.8, "monthly"],
    ["/practice-areas", 0.9, "monthly"],
    ["/team", 0.6, "monthly"],
    ["/blog", 0.7, "weekly"],
    ["/faq", 0.6, "monthly"],
    ["/contact", 0.8, "yearly"],
  ];
  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...areas.map((a) => ({
      url: absoluteUrl(`/practice-areas/${a.slug}`),
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
