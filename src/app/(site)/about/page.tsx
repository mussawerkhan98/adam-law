import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, PracticeIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/Sections";
import { getContent, getPracticeAreas, getSettings, getTeam } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { renderMarkdown } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const page = content["about.page"];
  return pageMetadata({
    settings,
    title: page.metaTitle,
    description:
      page.metaDescription ||
      `Learn about ${settings.firmName}${settings.city ? ` in ${settings.city}` : ""} — our values, experience and approach to legal representation.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [settings, content, team, areas] = await Promise.all([getSettings(), getContent(), getTeam(), getPracticeAreas()]);
  const { "about.page": page, "about.story": story, "about.values": values } = content;
  const lead = team[0];
  const image = settings.aboutImageUrl || lead?.photoUrl;
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title || settings.aboutTitle || `About ${settings.firmName}`}
        intro={page.intro || settings.tagline}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />

      <section className="section">
        <div className="container-x grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="reveal">
            {story.eyebrow && <p className="eyebrow mb-6">{story.eyebrow}</p>}
            <div
              className="content text-[1.1rem] first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-serif first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-gold-600"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.aboutBody) }}
            />
            <div className="mt-12 flex flex-wrap items-center gap-6">
              <Link href="/contact" className="btn-gold">
                {story.primaryButton} <ArrowRightIcon width={16} height={16} />
              </Link>
              <Link href="/team" className="link-arrow">
                {story.secondaryLink} <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="reveal relative mx-auto max-w-md lg:max-w-none">
              <div aria-hidden className="absolute -top-4 -right-4 h-full w-full rounded-xl border border-gold-500/50" />
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={lead ? `${lead.name}, ${lead.role}` : settings.firmName}
                  className="relative aspect-[4/5] w-full rounded-xl object-cover shadow-2xl shadow-navy-900/20"
                />
              ) : (
                <div className="hero-pattern relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-xl shadow-2xl shadow-navy-900/30">
                  <div aria-hidden className="absolute top-1/3 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo.png" alt="" width={640} height={714} className="relative h-auto w-3/5" />
                </div>
              )}
            </div>
            {areas.length > 0 && (
              <div className="card reveal p-8">
                {story.adviseTitle && <h2 className="font-serif text-2xl font-semibold text-navy-900">{story.adviseTitle}</h2>}
                <div className="mt-3 h-px w-12 bg-gradient-to-r from-gold-500 to-transparent" />
                <ul className="mt-5 divide-y divide-cream-200">
                  {areas.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/practice-areas/${a.slug}`}
                        className="group flex items-center gap-3 py-3 text-navy-800 transition hover:text-gold-700"
                      >
                        <PracticeIcon name={a.icon} width={18} height={18} className="text-gold-500" />
                        <span className="flex-1">{a.title}</span>
                        <ArrowRightIcon width={15} height={15} className="text-gold-500 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {values.show && values.items.length > 0 && (
      <section className="section paper border-y border-cream-200">
        <div className="container-x">
          <SectionHeading align="center" eyebrow={values.eyebrow} title={values.title} />
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((v, i) => (
              <div key={i} className="group card card-hover reveal p-8">
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-navy-900 text-gold-300 transition group-hover:bg-gradient-to-br group-hover:from-gold-300 group-hover:to-gold-600 group-hover:text-navy-950">
                    <PracticeIcon name={v.icon} width={24} height={24} />
                  </span>
                  <span className="font-display text-3xl font-semibold text-cream-200">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-serif text-2xl font-semibold text-navy-900">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      <CtaBand settings={settings} content={content} />
    </>
  );
}
