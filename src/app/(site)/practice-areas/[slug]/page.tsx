import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, MailIcon, PhoneIcon, PracticeIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getPracticeArea, getPracticeAreas, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, renderMarkdown, siteUrl, telHref } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, area] = await Promise.all([getSettings(), getPracticeArea(slug)]);
  if (!area) return {};
  return pageMetadata({
    settings,
    title: area.seoTitle || `${area.title}${settings.city ? ` Lawyer in ${settings.city}` : ""}`,
    description: area.seoDescription || area.summary,
    path: `/practice-areas/${area.slug}`,
    image: area.imageUrl || undefined,
  });
}

export default async function PracticeAreaPage({ params }: Props) {
  const { slug } = await params;
  const [settings, area, areas] = await Promise.all([getSettings(), getPracticeArea(slug), getPracticeAreas()]);
  if (!area) notFound();

  const path = `/practice-areas/${area.slug}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Practice Areas", path: "/practice-areas" },
            { name: area.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: area.title,
            description: area.summary,
            url: absoluteUrl(path),
            serviceType: area.title,
            provider: { "@id": `${siteUrl()}/#organization` },
            ...(settings.city ? { areaServed: settings.city } : {}),
          },
        ]}
      />
      <PageHero
        eyebrow="Practice Area"
        title={area.title}
        intro={area.summary}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Practice Areas", href: "/practice-areas" },
          { name: area.title, href: path },
        ]}
      />

      <section className="section">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_23rem]">
          <article>
            {area.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={area.imageUrl}
                alt={area.title}
                className="mb-12 aspect-[16/8] w-full rounded-xl object-cover shadow-xl shadow-navy-900/10"
              />
            )}
            <div className="content text-[1.1rem]" dangerouslySetInnerHTML={{ __html: renderMarkdown(area.body || area.summary) }} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="hero-pattern overflow-hidden rounded-xl p-8 text-white shadow-2xl shadow-navy-900/25">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-400/40 bg-gold-500/10 text-gold-300">
                <PracticeIcon name={area.icon} width={30} height={30} />
              </span>
              <h2 className="mt-6 font-serif text-[1.75rem] leading-tight font-semibold">
                Need help with {area.title.toLowerCase()}?
              </h2>
              <p className="mt-3 text-white/70">Tell us about your situation and we will advise on the best way forward.</p>
              <Link href={`/contact?area=${encodeURIComponent(area.title)}`} className="btn-gold mt-6 w-full">
                Request a Consultation
              </Link>
              <div className="mt-6 space-y-3 text-sm">
                {settings.phone && (
                  <a href={telHref(settings.phone)} className="flex items-center gap-3 hover:text-gold-400">
                    <PhoneIcon width={16} height={16} className="text-gold-400" /> {settings.phone}
                  </a>
                )}
                {settings.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all hover:text-gold-400">
                    <MailIcon width={16} height={16} className="text-gold-400" /> {settings.email}
                  </a>
                )}
              </div>
            </div>

            <nav aria-label="Other practice areas" className="card p-7">
              <h2 className="font-serif text-2xl font-semibold text-navy-900">Other practice areas</h2>
              <div className="mt-3 h-px w-12 bg-gradient-to-r from-gold-500 to-transparent" />
              <ul className="mt-4 divide-y divide-cream-200">
                {areas
                  .filter((a) => a.id !== area.id)
                  .map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/practice-areas/${a.slug}`}
                        className="group flex items-center gap-3 py-3.5 text-navy-800 transition hover:text-gold-700"
                      >
                        <PracticeIcon name={a.icon} width={18} height={18} className="text-gold-500" />
                        <span className="flex-1">{a.title}</span>
                        <ArrowRightIcon width={15} height={15} className="text-gold-500 transition group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
