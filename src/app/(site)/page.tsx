import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, PhoneIcon, QuoteIcon, StarIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PracticeCard, SectionHeading } from "@/components/site/Sections";
import { getFaqs, getPosts, getPracticeAreas, getSettings, getTeam, getTestimonials } from "@/lib/data";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { FaqList, PostCard } from "@/components/site/Cards";
import { renderMarkdown, telHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({ settings, path: "/" });
}

const WHY = [
  ["Personal attention", "You work directly with an experienced advocate, not a call centre."],
  ["Clear, honest advice", "We explain your options and likely outcomes in plain language."],
  ["Transparent fees", "Fees are agreed in writing before work begins — no surprises."],
  ["Strategic representation", "Every case gets a clear plan, careful preparation and strong advocacy."],
];

export default async function HomePage() {
  const [settings, areas, testimonials, faqs, posts, team] = await Promise.all([
    getSettings(),
    getPracticeAreas(),
    getTestimonials(),
    getFaqs(),
    getPosts(3),
    getTeam(),
  ]);

  const stats = [
    [settings.stat1Value, settings.stat1Label],
    [settings.stat2Value, settings.stat2Label],
    [settings.stat3Value, settings.stat3Label],
    [settings.stat4Value, settings.stat4Label],
  ].filter(([v, l]) => v && l);
  const lead = team[0];

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs.slice(0, 6))} />}

      {/* Hero */}
      <section className="hero-pattern relative overflow-hidden text-white">
        <div className="container-x grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {settings.heroEyebrow && <p className="eyebrow mb-6">{settings.heroEyebrow}</p>}
            <h1 className="font-serif text-4xl leading-[1.1] md:text-6xl lg:text-[4.2rem]">
              {settings.heroTitle || settings.firmName}
            </h1>
            {settings.heroSubtitle && (
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75 md:text-xl">{settings.heroSubtitle}</p>
            )}
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-gold">
                Book a Free Consultation <ArrowRightIcon width={18} height={18} />
              </Link>
              {settings.phone ? (
                <a href={telHref(settings.phone)} className="btn-outline text-white">
                  <PhoneIcon width={18} height={18} /> {settings.phone}
                </a>
              ) : (
                <Link href="/practice-areas" className="btn-outline text-white">
                  Our Practice Areas
                </Link>
              )}
            </div>
          </div>

          <div className="relative hidden lg:block">
            {settings.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.heroImageUrl}
                alt={settings.firmName}
                className="aspect-[4/5] w-full rounded-lg object-cover shadow-2xl shadow-black/40"
              />
            ) : (
              <div className="relative grid aspect-[4/5] w-full place-items-center rounded-lg border border-gold-500/25 bg-navy-800/50">
                <div className="absolute inset-5 rounded border border-gold-500/15" />
                <div className="px-10 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/brand/logo.png"
                    alt={settings.firmName}
                    width={640}
                    height={714}
                    fetchPriority="high"
                    className="mx-auto h-auto w-full max-w-[17rem] drop-shadow-[0_0_40px_rgba(210,181,122,0.18)]"
                  />
                  {settings.tagline && <p className="mt-6 text-sm tracking-wide text-gold-300/80">{settings.tagline}</p>}
                </div>
              </div>
            )}
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-gold-500 px-7 py-5 text-navy-950 shadow-xl">
              <p className="font-serif text-3xl leading-none">{settings.stat1Value || "Trusted"}</p>
              <p className="mt-1 text-sm font-medium">{settings.stat1Label || "Legal counsel"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="border-b border-cream-200 bg-white">
          <dl className="container-x grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="text-center md:border-r md:border-cream-200 md:last:border-0">
                <dt className="sr-only">{label}</dt>
                <dd className="font-serif text-4xl text-navy-900">{value}</dd>
                <dd className="mt-1 text-sm tracking-wide text-muted uppercase">{label}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Practice areas */}
      {areas.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading
                eyebrow="Practice Areas"
                title="Legal expertise you can rely on"
                intro="Focused, practical representation across the matters that affect individuals, families and businesses."
              />
              <Link href="/practice-areas" className="inline-flex items-center gap-2 font-semibold text-gold-600 hover:text-gold-500">
                View all practice areas <ArrowRightIcon width={18} height={18} />
              </Link>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areas.slice(0, 6).map((area) => (
                <PracticeCard key={area.id} area={area} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <div className="relative">
            {settings.aboutImageUrl || lead?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.aboutImageUrl || lead!.photoUrl}
                alt={lead ? `${lead.name}, ${lead.role}` : settings.firmName}
                className="aspect-[4/5] w-full max-w-md rounded-lg object-cover"
              />
            ) : (
              <div className="hero-pattern grid aspect-[4/5] w-full max-w-md place-items-center rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo.png" alt="" width={640} height={714} loading="lazy" className="h-auto w-1/2" />
              </div>
            )}
            <div className="absolute -right-2 bottom-10 hidden max-w-[15rem] rounded-lg border border-cream-200 bg-cream-50 p-6 shadow-xl md:block lg:right-6">
              <QuoteIcon width={28} height={28} className="text-gold-500" />
              <p className="mt-2 font-serif text-lg leading-snug text-navy-900">Your rights. Our commitment.</p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="About the Chamber" title={settings.aboutTitle || `About ${settings.firmName}`} />
            <div className="content mt-6 text-muted" dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.aboutBody) }} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {WHY.map(([title, text]) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-600">
                    <CheckIcon width={14} height={14} />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy-900">{title}</span>
                    <span className="text-sm leading-relaxed text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="btn-gold mt-10">
              More about us <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <SectionHeading align="center" eyebrow="Client Testimonials" title="What our clients say" />
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <figure key={t.id} className="flex flex-col rounded-lg border border-cream-200 bg-white p-8">
                  <div className="flex gap-1 text-gold-500" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, i) => (
                      <StarIcon key={i} width={18} height={18} />
                    ))}
                  </div>
                  <blockquote className="mt-5 flex-1 leading-relaxed text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-6 border-t border-cream-200 pt-5">
                    <span className="block font-semibold text-navy-900">{t.name}</span>
                    {t.role && <span className="text-sm text-muted">{t.role}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className={`py-20 md:py-28 ${testimonials.length > 0 ? "bg-white" : ""}`}>
          <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionHeading
                eyebrow="FAQ"
                title="Common questions"
                intro="Answers to questions clients often ask before their first consultation."
              />
              <Link href="/faq" className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-600 hover:text-gold-500">
                See all questions <ArrowRightIcon width={18} height={18} />
              </Link>
            </div>
            <FaqList faqs={faqs.slice(0, 6)} />
          </div>
        </section>
      )}

      {/* Latest posts */}
      {posts.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Legal Insights" title="Latest articles" />
              <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-gold-600 hover:text-gold-500">
                All articles <ArrowRightIcon width={18} height={18} />
              </Link>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand settings={settings} />
    </>
  );
}

