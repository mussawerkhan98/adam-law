import type { Metadata } from "next";
import { MailIcon, PhoneIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getSettings, getTeam } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, renderMarkdown, siteUrl, telHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "Our Team",
    description: `Meet the advocates and legal professionals at ${settings.firmName}.`,
    path: "/team",
  });
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default async function TeamPage() {
  const [settings, team] = await Promise.all([getSettings(), getTeam()]);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Our Team", path: "/team" },
          ]),
          ...team.map((m) => ({
            "@context": "https://schema.org",
            "@type": "Person",
            name: m.name,
            jobTitle: m.role || undefined,
            ...(m.photoUrl ? { image: absoluteUrl(m.photoUrl) } : {}),
            worksFor: { "@id": `${siteUrl()}/#organization` },
          })),
        ]}
      />
      <PageHero
        eyebrow="Our Team"
        title="The people behind your case"
        intro="Dedicated legal professionals committed to protecting your interests."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Our Team", href: "/team" },
        ]}
      />
      <section className="section paper">
        <div className="container-x space-y-10">
          {team.map((m) => (
            <article
              key={m.id}
              className="card reveal grid items-start gap-10 p-6 md:p-10 lg:grid-cols-[19rem_1fr] lg:gap-14"
            >
              <div className="relative">
                <div aria-hidden className="absolute -top-3 -left-3 h-full w-full rounded-xl border border-gold-500/45" />
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photoUrl}
                    alt={`${m.name}, ${m.role}`}
                    className="relative aspect-[4/5] w-full rounded-xl object-cover shadow-xl shadow-navy-900/15"
                  />
                ) : (
                  <div className="hero-pattern relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-xl">
                    <span className="text-gold-gradient font-display text-7xl font-semibold">{initials(m.name)}</span>
                  </div>
                )}
              </div>
              <div className="lg:pt-4">
                {m.role && <p className="eyebrow">{m.role}</p>}
                <h2 className="mt-4 font-serif text-[2.6rem] leading-tight font-semibold text-navy-900">{m.name}</h2>
                <div className="mt-5 h-px w-16 bg-gradient-to-r from-gold-500 to-transparent" />
                <div className="content mt-6 text-muted" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.bio) }} />
                {(m.email || m.phone) && (
                  <div className="mt-6 flex flex-wrap gap-5 text-sm">
                    {m.phone && (
                      <a href={telHref(m.phone)} className="flex items-center gap-2 text-navy-800 hover:text-gold-600">
                        <PhoneIcon width={16} height={16} className="text-gold-500" /> {m.phone}
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="flex items-center gap-2 text-navy-800 hover:text-gold-600">
                        <MailIcon width={16} height={16} className="text-gold-500" /> {m.email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
          {team.length === 0 && <p className="text-muted">Team profiles coming soon.</p>}
        </div>
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
