import type { Metadata } from "next";
import { CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/Sections";
import { getPracticeAreas, getSettings, getTeam } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { renderMarkdown } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "About Us",
    description: `Learn about ${settings.firmName}${settings.city ? ` in ${settings.city}` : ""} — our values, experience and approach to legal representation.`,
    path: "/about",
  });
}

const VALUES = [
  ["Integrity", "Honest advice, even when it is not what you hoped to hear."],
  ["Confidentiality", "Your information is protected with the utmost discretion."],
  ["Diligence", "Thorough preparation for every hearing, filing and negotiation."],
  ["Accessibility", "Clear communication and prompt updates throughout your matter."],
];

export default async function AboutPage() {
  const [settings, team, areas] = await Promise.all([getSettings(), getTeam(), getPracticeAreas()]);
  const lead = team[0];
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        eyebrow="About Us"
        title={settings.aboutTitle || `About ${settings.firmName}`}
        intro={settings.tagline}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="content" dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.aboutBody) }} />
          <aside className="space-y-6">
            {settings.aboutImageUrl || lead?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.aboutImageUrl || lead!.photoUrl}
                alt={lead ? `${lead.name}, ${lead.role}` : settings.firmName}
                className="aspect-[4/5] w-full rounded-lg object-cover"
              />
            ) : (
              <div className="hero-pattern grid aspect-[4/5] w-full place-items-center rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo.png" alt="" width={640} height={714} className="h-auto w-1/2" />
              </div>
            )}
            {areas.length > 0 && (
              <div className="rounded-lg border border-cream-200 bg-white p-7">
                <h2 className="font-serif text-xl text-navy-900">We advise on</h2>
                <ul className="mt-4 space-y-2.5">
                  {areas.map((a) => (
                    <li key={a.id} className="flex items-center gap-3 text-muted">
                      <CheckIcon width={16} height={16} className="text-gold-500" />
                      {a.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Our Values" title="The principles behind our practice" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([title, text], i) => (
              <div key={title} className="rounded-lg border border-cream-200 bg-cream-50 p-8">
                <span className="font-serif text-4xl text-gold-500/70">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-xl text-navy-900">{title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand settings={settings} />
    </>
  );
}
