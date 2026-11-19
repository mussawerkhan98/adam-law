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
      <section className="py-20 md:py-28">
        <div className="container-x space-y-10">
          {team.map((m) => (
            <article
              key={m.id}
              className="grid items-start gap-10 rounded-lg border border-cream-200 bg-white p-6 md:p-10 lg:grid-cols-[18rem_1fr]"
            >
              <div>
                {m.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photoUrl} alt={`${m.name}, ${m.role}`} className="aspect-[4/5] w-full rounded-lg object-cover" />
                ) : (
                  <div className="hero-pattern grid aspect-[4/5] w-full place-items-center rounded-lg font-serif text-6xl text-gold-400">
                    {initials(m.name)}
                  </div>
                )}
              </div>
              <div>
                {m.role && <p className="eyebrow">{m.role}</p>}
                <h2 className="mt-3 font-serif text-3xl text-navy-900">{m.name}</h2>
                <div className="content mt-5 text-muted" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.bio) }} />
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
