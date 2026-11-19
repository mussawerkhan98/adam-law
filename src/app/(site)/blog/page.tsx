import type { Metadata } from "next";
import { PostCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getPosts, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "Legal Insights",
    description: `Articles and practical legal guidance from ${settings.firmName}.`,
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [settings, posts] = await Promise.all([getSettings(), getPosts()]);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Legal Insights"
        title="Articles & guidance"
        intro="Practical explanations of legal issues that matter to individuals, families and businesses."
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
          {posts.length === 0 && <p className="text-muted">Articles are coming soon.</p>}
        </div>
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
