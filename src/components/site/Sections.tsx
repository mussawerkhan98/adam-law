import Link from "next/link";
import { Fragment } from "react";
import { ArrowRightIcon, PhoneIcon, PracticeIcon, WhatsAppIcon } from "@/components/icons";
import { fill, type Content } from "@/lib/content";
import type { Settings } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/utils";

/**
 * Renders a title where text wrapped in *asterisks* is shown as gold italic emphasis,
 * e.g. "Trusted legal counsel *when it matters most*".
 */
export function RichTitle({ text, emphasisClass = "text-gold-gradient italic" }: { text: string; emphasisClass?: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className={`not-italic ${emphasisClass} pr-1`}>
            {part}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Gold rule with a diamond, echoing the flourish under the logo. */
export function Ornament({ className = "", width = "w-40" }: { className?: string; width?: string }) {
  return (
    <div className={`ornament ${width} ${className}`} aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0">
        <path d="M7 0 L14 7 L7 14 L0 7 Z" fill="currentColor" opacity="0.9" />
        <path d="M7 3.5 L10.5 7 L7 10.5 L3.5 7 Z" fill="none" stroke="#0a1628" strokeOpacity="0.35" />
      </svg>
    </div>
  );
}

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
  const center = align === "center";
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow mb-5 ${center ? "eyebrow-center" : ""} ${light ? "on-dark" : ""}`}>{eyebrow}</p>}
      <h2
        className={`font-serif text-[2.4rem] leading-[1.08] font-semibold tracking-[-0.01em] md:text-[3.25rem] ${
          light ? "text-white" : "text-navy-900"
        }`}
      >
        <RichTitle text={title} emphasisClass={light ? "text-gold-gradient italic" : "italic text-gold-600"} />
      </h2>
      {intro && <p className={`mt-6 text-lg leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>{intro}</p>}
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
    <section className="hero-pattern overflow-hidden text-white">
      {/* Emblem watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark.png"
        alt=""
        aria-hidden
        width={211}
        height={160}
        className="pointer-events-none absolute top-1/2 -right-16 hidden w-[30rem] -translate-y-1/2 opacity-[0.07] md:block"
      />
      <div className="container-x relative py-20 md:py-28">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8 animate-fade-up text-[0.8rem] tracking-[0.08em] text-white/55 uppercase">
            <ol className="flex flex-wrap items-center gap-2.5">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500/70" />
                  )}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-gold-300">
                      {c.name}
                    </span>
                  ) : (
                    <Link href={c.href} className="transition hover:text-white">
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow on-dark mb-5 animate-fade-up">{eyebrow}</p>}
        <h1
          className="max-w-3xl animate-fade-up font-serif text-[2.75rem] leading-[1.05] font-semibold md:text-[4.25rem]"
          style={{ animationDelay: "80ms" }}
        >
          <RichTitle text={title} />
        </h1>
        <Ornament className="mt-8 animate-fade-up" width="w-48" />
        {intro && (
          <p
            className="mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/70 md:text-xl"
            style={{ animationDelay: "160ms" }}
          >
            {intro}
          </p>
        )}
      </div>
      <div className="gold-hairline" />
    </section>
  );
}

export function PracticeCard({
  area,
  index,
  linkLabel = "Learn more",
}: {
  area: { title: string; slug: string; summary: string; icon: string };
  index?: number;
  linkLabel?: string;
}) {
  return (
    <Link
      href={`/practice-areas/${area.slug}`}
      className="group card card-hover reveal flex h-full flex-col overflow-hidden p-8 md:p-9"
    >
      {/* Navy wash that rises on hover */}
      <span
        aria-hidden
        className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-br from-navy-800 to-navy-950 transition-transform duration-500 ease-out group-hover:translate-y-0"
      />
      <span className="relative flex items-start justify-between">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/30 bg-gradient-to-br from-gold-100 to-cream-100 text-gold-600 transition duration-500 group-hover:border-gold-400/60 group-hover:from-navy-700 group-hover:to-navy-800 group-hover:text-gold-300">
          <PracticeIcon name={area.icon} width={28} height={28} />
        </span>
        {index !== undefined && (
          <span className="font-display text-3xl font-semibold text-cream-200 transition duration-500 group-hover:text-white/10">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </span>
      <h3 className="relative mt-7 font-serif text-[1.65rem] leading-tight font-semibold text-navy-900 transition-colors duration-500 group-hover:text-white">
        {area.title}
      </h3>
      <p className="relative mt-3 flex-1 leading-relaxed text-muted transition-colors duration-500 group-hover:text-white/70">
        {area.summary}
      </p>
      <span className="relative mt-7 inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.12em] text-gold-600 uppercase transition-colors duration-500 group-hover:text-gold-300">
        {linkLabel} <ArrowRightIcon width={16} height={16} className="transition group-hover:translate-x-1.5" />
      </span>
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[3px] w-0 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 transition-all duration-500 group-hover:w-full"
      />
    </Link>
  );
}

export function CtaBand({ settings, content }: { settings: Settings; content: Content }) {
  const cta = content["shared.cta"];
  return (
    <section className="hero-pattern overflow-hidden text-white">
      <div className="gold-hairline" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-mark.png"
        alt=""
        aria-hidden
        width={211}
        height={160}
        className="pointer-events-none absolute -bottom-24 -left-24 w-[26rem] opacity-[0.06]"
      />
      <div className="container-x relative py-20 text-center md:py-28">
        {cta.eyebrow && <p className="eyebrow eyebrow-center on-dark">{cta.eyebrow}</p>}
        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl leading-[1.1] font-semibold md:text-[3.4rem]">
          <RichTitle text={settings.ctaTitle || "Speak with a lawyer *today*"} />
        </h2>
        <Ornament className="mx-auto mt-8" width="w-56" />
        {settings.ctaText && <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-white/70">{settings.ctaText}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-gold">
            {cta.button} <ArrowRightIcon width={16} height={16} />
          </Link>
          {settings.phone ? (
            <a href={telHref(settings.phone)} className="btn-outline text-white">
              <PhoneIcon width={16} height={16} /> {settings.phone}
            </a>
          ) : settings.whatsapp ? (
            <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-outline text-white">
              <WhatsAppIcon width={16} height={16} /> {cta.whatsappLabel}
            </a>
          ) : (
            <Link href="/practice-areas" className="btn-outline text-white">
              {content["home.hero"].secondaryButton || content["header.nav"].practice}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function WhatsAppFloat({ number, firmName, message }: { number: string; firmName: string; message: string }) {
  if (!number) return null;
  return (
    <a
      href={whatsappHref(number, fill(message, { firm: firmName }))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.6)] transition hover:scale-105"
    >
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20" />
      <WhatsAppIcon width={28} height={28} className="relative" />
    </a>
  );
}
