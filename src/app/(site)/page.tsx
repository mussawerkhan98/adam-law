import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, MailIcon, PhoneIcon, PracticeIcon, QuoteIcon, StarIcon, WhatsAppIcon } from "@/components/icons";
import { FaqList, PostCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, Ornament, PracticeCard, RichTitle, SectionHeading } from "@/components/site/Sections";
import { getContent, getFaqs, getPosts, getPracticeAreas, getSettings, getTeam, getTestimonials } from "@/lib/data";
import { faqSchema, pageMetadata } from "@/lib/seo";
import { renderMarkdown, telHref, whatsappHref } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({ settings, path: "/" });
}

export default async function HomePage() {
  const [settings, content, areas, testimonials, faqs, posts, team] = await Promise.all([
    getSettings(),
    getContent(),
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
  const {
    "home.hero": hero,
    "home.pillars": pillars,
    "home.practice": practice,
    "home.about": about,
    "home.process": process,
    "home.testimonials": testimonialsText,
    "home.faq": faqText,
    "home.posts": postsText,
  } = content;
  const showTestimonials = testimonialsText.show && testimonials.length > 0;
  const aboutImage = settings.aboutImageUrl || lead?.photoUrl;

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqSchema(faqs.slice(0, 6))} />}

      {/* ───────── Hero ───────── */}
      <section className="hero-pattern overflow-hidden text-white">
        <div className="container-x grid items-center gap-16 pt-16 pb-36 md:pt-24 md:pb-44 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            {settings.heroEyebrow && <p className="eyebrow on-dark mb-7 animate-fade-up">{settings.heroEyebrow}</p>}
            <h1
              className="animate-fade-up font-serif text-[2.9rem] leading-[1.02] font-semibold tracking-[-0.015em] sm:text-6xl lg:text-[5.1rem]"
              style={{ animationDelay: "80ms" }}
            >
              <RichTitle text={settings.heroTitle || settings.firmName} />
            </h1>
            <Ornament className="mt-9 animate-fade-up" width="w-52" />
            {settings.heroSubtitle && (
              <p
                className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-white/72 md:text-xl"
                style={{ animationDelay: "160ms" }}
              >
                {settings.heroSubtitle}
              </p>
            )}
            <div className="mt-11 flex animate-fade-up flex-wrap gap-4" style={{ animationDelay: "240ms" }}>
              <Link href="/contact" className="btn-gold">
                {hero.primaryButton} <ArrowRightIcon width={16} height={16} />
              </Link>
              {settings.phone ? (
                <a href={telHref(settings.phone)} className="btn-outline text-white">
                  <PhoneIcon width={16} height={16} /> {settings.phone}
                </a>
              ) : (
                hero.secondaryButton && (
                  <Link href="/practice-areas" className="btn-outline text-white">
                    {hero.secondaryButton}
                  </Link>
                )
              )}
            </div>
            {hero.checks.length > 0 && (
            <ul
              className="mt-12 flex animate-fade-up flex-wrap gap-x-8 gap-y-3 text-sm text-white/65"
              style={{ animationDelay: "320ms" }}
            >
              {hero.checks.map(({ text: t }, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                    <CheckIcon width={12} height={12} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            )}
          </div>

          {/* Courthouse-arch frame with the logo (or the hero photo, if one is set) */}
          <div className="relative mx-auto hidden w-full max-w-[27rem] animate-fade-up lg:block" style={{ animationDelay: "200ms" }}>
            <div aria-hidden className="absolute -inset-10 rounded-full bg-gold-500/10 blur-3xl" />
            <div className="relative aspect-[4/5] rounded-t-full border border-gold-400/35 p-4">
              <div className="relative h-full overflow-hidden rounded-t-full border border-gold-400/20 bg-gradient-to-b from-navy-700/70 via-navy-800/60 to-navy-950/80">
                {settings.heroImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={settings.heroImageUrl} alt={settings.firmName} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center px-16 pt-6 pb-16">
                    <div aria-hidden className="absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/brand/logo.png"
                      alt={settings.firmName}
                      width={640}
                      height={714}
                      fetchPriority="high"
                      className="relative w-full animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                    />
                  </div>
                )}
              </div>
            </div>
            {(hero.badgeTitle || hero.badgeText) && (
            <div className="absolute top-8 -left-14 flex items-center gap-3 rounded-lg border border-white/10 bg-navy-950/80 px-4 py-3 shadow-2xl backdrop-blur-md">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                <PracticeIcon name="shield" width={20} height={20} />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-white">{hero.badgeTitle}</span>
                <span className="text-white/55">{hero.badgeText}</span>
              </span>
            </div>
            )}
            <div className="absolute -right-8 -bottom-6 rounded-lg bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 px-6 py-4 text-navy-950 shadow-2xl shadow-black/40">
              <p className="font-serif text-3xl leading-none font-bold">{settings.stat1Value || "Trusted"}</p>
              <p className="mt-1 text-xs font-semibold tracking-[0.12em] uppercase">{settings.stat1Label || "Legal counsel"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Pillars (overlaps the hero) ───────── */}
      {pillars.show && pillars.items.length > 0 && (
      <section aria-label="Why clients choose us" className="relative z-10 -mt-24">
        <div className="container-x">
          <ul className="grid overflow-hidden rounded-xl border border-cream-200 bg-white shadow-[0_40px_80px_-40px_rgb(10_22_40/0.45)] sm:grid-cols-2 lg:grid-cols-4">
            {pillars.items.map((p, i) => (
              <li
                key={i}
                className={`group relative p-8 transition-colors duration-300 hover:bg-cream-50 ${
                  i > 0 ? "border-t border-cream-200 sm:border-t-0 lg:border-l" : ""
                } ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${i === 3 ? "sm:border-t sm:border-l lg:border-t-0" : ""} ${
                  i === 1 ? "sm:border-l" : ""
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-900 text-gold-300 transition group-hover:bg-gradient-to-br group-hover:from-gold-300 group-hover:to-gold-600 group-hover:text-navy-950">
                  <PracticeIcon name={p.icon} width={22} height={22} />
                </span>
                <h3 className="mt-5 font-serif text-[1.4rem] leading-tight font-semibold text-navy-900">{p.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      {/* ───────── Practice areas ───────── */}
      {practice.show && areas.length > 0 && (
        <section className="section">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading
                eyebrow={practice.eyebrow}
                title={practice.title}
                intro={practice.intro}
              />
              <Link href="/practice-areas" className="link-arrow shrink-0">
                {practice.linkLabel} <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areas.slice(0, 6).map((area, i) => (
                <PracticeCard key={area.id} area={area} index={i} linkLabel={content["shared.cta"].cardLink} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── About ───────── */}
      {about.show && (
      <section className="section paper overflow-hidden border-y border-cream-200">
        <div className="container-x grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <div className="reveal relative mx-auto w-full max-w-md lg:mx-0">
            <div aria-hidden className="absolute -top-5 -left-5 h-full w-full rounded-xl border border-gold-500/50" />
            {aboutImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={aboutImage}
                alt={lead ? `${lead.name}, ${lead.role}` : settings.firmName}
                className="relative aspect-[4/5] w-full rounded-xl object-cover shadow-2xl shadow-navy-900/20"
              />
            ) : (
              <div className="hero-pattern relative grid aspect-[4/5] w-full place-items-center overflow-hidden rounded-xl shadow-2xl shadow-navy-900/30">
                <div aria-hidden className="absolute top-1/3 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/logo.png" alt="" width={640} height={714} loading="lazy" className="relative h-auto w-3/5" />
              </div>
            )}
            {about.quote && (
              <figure className="absolute -right-4 -bottom-8 max-w-[16rem] rounded-xl bg-navy-900 p-6 text-white shadow-2xl sm:-right-10">
                <QuoteIcon width={26} height={26} className="text-gold-400" />
                <blockquote className="mt-3 font-serif text-xl leading-snug italic">{about.quote}</blockquote>
                <div className="mt-4 h-px w-12 bg-gold-500" />
              </figure>
            )}
          </div>

          <div className="reveal">
            <SectionHeading eyebrow={about.eyebrow} title={settings.aboutTitle || `About ${settings.firmName}`} />
            <div
              className="content mt-7 text-[1.05rem] text-muted"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.aboutBody) }}
            />
            {stats.length > 0 && (
              <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-cream-200 py-8 sm:grid-cols-4">
                {stats.map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-gold-gradient font-serif text-4xl font-bold">{value}</dd>
                    <dd className="mt-1 text-xs font-semibold tracking-[0.12em] text-muted uppercase">{label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/about" className="btn-navy">
                {about.primaryButton} <ArrowRightIcon width={16} height={16} />
              </Link>
              <Link href="/team" className="link-arrow">
                {about.secondaryLink} <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ───────── How we work ───────── */}
      {process.show && process.steps.length > 0 && (
      <section className="section hero-pattern overflow-hidden text-white">
        <div className="container-x">
          <SectionHeading
            light
            align="center"
            eyebrow={process.eyebrow}
            title={process.title}
            intro={process.intro}
          />
          <ol
            className={`relative mt-20 grid gap-12 md:grid-cols-2 lg:gap-8 ${
              process.steps.length === 3 ? "lg:grid-cols-3" : process.steps.length >= 4 ? "lg:grid-cols-4" : ""
            }`}
          >
            <span
              aria-hidden
              className="absolute top-8 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent lg:block"
            />
            {process.steps.map((step, i) => (
              <li key={i} className="reveal relative text-center">
                <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold-400/50 bg-navy-900 font-display text-xl font-semibold text-gold-300 shadow-[0_0_0_8px_rgb(10_22_40)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-7 font-serif text-2xl font-semibold">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs leading-relaxed text-white/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      )}

      {/* ───────── Testimonials ───────── */}
      {showTestimonials && (
        <section className="section">
          <div className="container-x">
            <SectionHeading align="center" eyebrow={testimonialsText.eyebrow} title={testimonialsText.title} />
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t) => (
                <figure key={t.id} className="card card-hover reveal flex flex-col p-8 md:p-9">
                  <span aria-hidden className="absolute top-4 right-7 font-serif text-8xl leading-none text-gold-500/15">
                    &rdquo;
                  </span>
                  <div className="flex gap-1 text-gold-500" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: Math.max(1, Math.min(5, t.rating)) }).map((_, i) => (
                      <StarIcon key={i} width={17} height={17} fill="currentColor" />
                    ))}
                  </div>
                  <blockquote className="mt-6 flex-1 font-serif text-xl leading-relaxed text-ink italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4 border-t border-cream-200 pt-6">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-900 font-display text-sm text-gold-300">
                      {t.name
                        .split(/\s+/)
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span>
                      <span className="block font-semibold text-navy-900">{t.name}</span>
                      {t.role && <span className="text-sm text-muted">{t.role}</span>}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── FAQ ───────── */}
      {faqText.show && faqs.length > 0 && (
        <section className={`section ${showTestimonials ? "paper border-y border-cream-200" : ""}`}>
          <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading
                eyebrow={faqText.eyebrow}
                title={faqText.title}
                intro={faqText.intro}
              />
              <div className="mt-10 rounded-xl bg-navy-900 p-7 text-white">
                {faqText.boxTitle && <p className="font-serif text-2xl font-semibold">{faqText.boxTitle}</p>}
                {faqText.boxText && <p className="mt-2 text-white/65">{faqText.boxText}</p>}
                <div className="mt-6 space-y-3 text-sm">
                  {settings.phone && (
                    <a href={telHref(settings.phone)} className="flex items-center gap-3 transition hover:text-gold-300">
                      <PhoneIcon width={16} height={16} className="text-gold-400" /> {settings.phone}
                    </a>
                  )}
                  {settings.whatsapp && (
                    <a
                      href={whatsappHref(settings.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 transition hover:text-gold-300"
                    >
                      <WhatsAppIcon width={16} height={16} className="text-gold-400" /> WhatsApp
                    </a>
                  )}
                  {settings.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all transition hover:text-gold-300">
                      <MailIcon width={16} height={16} className="text-gold-400" /> {settings.email}
                    </a>
                  )}
                </div>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-gold !px-5 !py-3">
                    {faqText.primaryButton} <ArrowRightIcon width={14} height={14} />
                  </Link>
                  <Link href="/faq" className="btn-outline !px-5 !py-3 text-white">
                    {faqText.secondaryButton}
                  </Link>
                </div>
              </div>
            </div>
            <FaqList faqs={faqs.slice(0, 6)} />
          </div>
        </section>
      )}

      {/* ───────── Latest posts ───────── */}
      {postsText.show && posts.length > 0 && (
        <section className={`section ${showTestimonials ? "" : "paper border-t border-cream-200"}`}>
          <div className="container-x">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading eyebrow={postsText.eyebrow} title={postsText.title} />
              <Link href="/blog" className="link-arrow shrink-0">
                {postsText.linkLabel} <ArrowRightIcon width={16} height={16} />
              </Link>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand settings={settings} content={content} />
    </>
  );
}
