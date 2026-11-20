import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero, PracticeCard } from "@/components/site/Sections";
import { getContent, getPracticeAreas, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content, areas] = await Promise.all([getSettings(), getContent(), getPracticeAreas()]);
  const page = content["practice.page"];
  const where = settings.city ? ` in ${settings.city}` : "";
  return pageMetadata({
    settings,
    title: page.metaTitle,
    description:
      page.metaDescription ||
      `Legal services${where}: ${areas
      .slice(0, 6)
      .map((a) => a.title)
      .join(", ")}. Speak with ${settings.firmName} today.`,
    path: "/practice-areas",
  });
}

export default async function PracticeAreasPage() {
  const [settings, content, areas] = await Promise.all([getSettings(), getContent(), getPracticeAreas()]);
  const page = content["practice.page"];
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Areas", path: "/practice-areas" },
        ])}
      />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Practice Areas", href: "/practice-areas" },
        ]}
      />
      <section className="section paper">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <PracticeCard key={area.id} area={area} index={i} linkLabel={content["shared.cta"].cardLink} />
          ))}
          {areas.length === 0 && <p className="text-muted">{page.emptyText}</p>}
        </div>
      </section>
      <CtaBand settings={settings} content={content} />
    </>
  );
}
