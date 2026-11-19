import type { Metadata } from "next";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero, PracticeCard } from "@/components/site/Sections";
import { getPracticeAreas, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, areas] = await Promise.all([getSettings(), getPracticeAreas()]);
  const where = settings.city ? ` in ${settings.city}` : "";
  return pageMetadata({
    settings,
    title: "Practice Areas",
    description: `Legal services${where}: ${areas
      .slice(0, 6)
      .map((a) => a.title)
      .join(", ")}. Speak with ${settings.firmName} today.`,
    path: "/practice-areas",
  });
}

export default async function PracticeAreasPage() {
  const [settings, areas] = await Promise.all([getSettings(), getPracticeAreas()]);
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Practice Areas", path: "/practice-areas" },
        ])}
      />
      <PageHero
        eyebrow="Practice Areas"
        title="How we can help"
        intro="Experienced counsel and representation across a wide range of legal matters."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Practice Areas", href: "/practice-areas" },
        ]}
      />
      <section className="section paper">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area, i) => (
            <PracticeCard key={area.id} area={area} index={i} />
          ))}
          {areas.length === 0 && <p className="text-muted">Practice areas will be listed here soon.</p>}
        </div>
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
