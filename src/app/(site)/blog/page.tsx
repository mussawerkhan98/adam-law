import type { Metadata } from "next";
import { PostCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getContent, getPosts, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const page = content["blog.page"];
  return pageMetadata({
    settings,
    title: page.metaTitle,
    description:
      page.metaDescription ||
      `Articles and practical legal guidance from ${settings.firmName}.`,
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [settings, content, posts] = await Promise.all([getSettings(), getContent(), getPosts()]);
  const page = content["blog.page"];
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Insights", href: "/blog" },
        ]}
      />
      <section className="section paper">
        <div className="container-x grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {posts.length === 0 && <p className="text-muted">{page.emptyText}</p>}
        </div>
      </section>
      <CtaBand settings={settings} content={content} />
    </>
  );
}
