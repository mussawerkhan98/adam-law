import Link from "next/link";
import { ArrowRightIcon, PhoneIcon, PracticeIcon, WhatsAppIcon } from "@/components/icons";
import type { Settings } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className={`font-serif text-3xl leading-tight md:text-[2.6rem] ${light ? "text-white" : "text-navy-900"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-lg leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}

/** Dark banner used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  intro?: string | null;
  crumbs?: { name: string; href: string }[];
}) {
  return (
    <section className="hero-pattern text-white">
      <div className="container-x py-16 md:py-24">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-gold-400">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="hover:text-white">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h1 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{intro}</p>}
      </div>
    </section>
  );
}

export function PracticeCard({ area }: { area: { title: string; slug: string; summary: string; icon: string } }) {
  return (
    <Link
      href={`/practice-areas/${area.slug}`}
      className="group flex h-full flex-col rounded-lg border border-cream-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-xl hover:shadow-navy-900/5"
    >
      <span className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-cream-100 text-gold-600 transition group-hover:bg-navy-900 group-hover:text-gold-400">
        <PracticeIcon name={area.icon} width={26} height={26} />
      </span>
      <h3 className="font-serif text-xl text-navy-900">{area.title}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{area.summary}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-600">
        Learn more <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function CtaBand({ settings }: { settings: Settings }) {
  return (
    <section className="hero-pattern text-white">
      <div className="container-x flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            {settings.ctaTitle || "Speak with a lawyer today"}
          </h2>
          {settings.ctaText && <p className="mt-4 text-lg text-white/70">{settings.ctaText}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/contact" className="btn-gold">
            Book a Consultation <ArrowRightIcon width={18} height={18} />
          </Link>
          {settings.phone && (
            <a href={telHref(settings.phone)} className="btn-outline text-white">
              <PhoneIcon width={18} height={18} /> Call Now
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function WhatsAppFloat({ number, firmName }: { number: string; firmName: string }) {
  if (!number) return null;
  return (
    <a
      href={whatsappHref(number, `Hello ${firmName}, I would like to discuss a legal matter.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
