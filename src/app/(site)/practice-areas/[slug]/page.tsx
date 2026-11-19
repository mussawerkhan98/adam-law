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

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_22rem]">
          <article>
            {area.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={area.imageUrl} alt={area.title} className="mb-10 aspect-[16/8] w-full rounded-lg object-cover" />
            )}
            <div className="content" dangerouslySetInnerHTML={{ __html: renderMarkdown(area.body || area.summary) }} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="hero-pattern rounded-lg p-8 text-white">
              <PracticeIcon name={area.icon} width={36} height={36} className="text-gold-400" />
              <h2 className="mt-4 font-serif text-2xl">Need help with {area.title.toLowerCase()}?</h2>
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

            <nav aria-label="Other practice areas" className="rounded-lg border border-cream-200 bg-white p-7">
              <h2 className="font-serif text-xl text-navy-900">Other practice areas</h2>
              <ul className="mt-4 divide-y divide-cream-200">
                {areas
                  .filter((a) => a.id !== area.id)
                  .map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/practice-areas/${a.slug}`}
                        className="flex items-center justify-between py-3 text-muted hover:text-gold-600"
                      >
                        {a.title} <ArrowRightIcon width={16} height={16} />
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
