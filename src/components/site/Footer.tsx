import Link from "next/link";
import {
  ArrowRightIcon,
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import type { Content } from "@/lib/content";
import type { Settings } from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/utils";

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-display text-[0.8rem] font-semibold tracking-[0.24em] text-gold-300 uppercase">
      {children}
      <span aria-hidden className="mt-3 block h-px w-10 bg-gradient-to-r from-gold-500 to-transparent" />
    </h2>
  );
}

const linkCls = "group inline-flex items-center gap-2 transition hover:text-gold-300";

const QUICK_LINKS = ["/about", "/team", "/blog", "/faq", "/contact"];

export function Footer({
  settings,
  areas,
  content,
}: {
  settings: Settings;
  areas: { title: string; slug: string }[];
  content: Content;
}) {
  const t = content["footer.main"];
  const whatsappLabel = content["shared.cta"].whatsappLabel;
  const socials = [
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.twitter, label: "X (Twitter)", Icon: XIcon },
    { href: settings.youtube, label: "YouTube", Icon: YouTubeIcon },
  ].filter((s) => s.href);
  const fullAddress = [settings.address, settings.city, settings.country].filter(Boolean).join(", ");
  const hasContact = Boolean(fullAddress || settings.phone || settings.email || settings.whatsapp || settings.officeHours);

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-[0.95rem] text-white/60">
      <div aria-hidden className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-royal-500/10 blur-3xl" />

      <div className="container-x relative grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10">
        <div className="space-y-7">
          <Link href="/" className="inline-block" aria-label={`${settings.firmName} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt={settings.firmName} width={640} height={714} loading="lazy" className="h-auto w-40" />
          </Link>
          {settings.footerText && <p className="max-w-xs leading-relaxed">{settings.footerText}</p>}
          {socials.length > 0 && (
            <ul className="flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/12 transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-300"
                  >
                    <Icon width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {t.practiceHeading && <FooterHeading>{t.practiceHeading}</FooterHeading>}
          <ul className="space-y-3">
            {areas.slice(0, 6).map((a) => (
              <li key={a.slug}>
                <Link href={`/practice-areas/${a.slug}`} className={linkCls}>
                  <span aria-hidden className="h-1 w-1 rotate-45 bg-gold-500/70 transition group-hover:bg-gold-300" />
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {t.linksHeading && <FooterHeading>{t.linksHeading}</FooterHeading>}
          <ul className="space-y-3">
            {QUICK_LINKS.map((href, i) => ({ href, label: t.links[i]?.label })).filter((l) => l.label).map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={linkCls}>
                  <span aria-hidden className="h-1 w-1 rotate-45 bg-gold-500/70 transition group-hover:bg-gold-300" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          {t.contactHeading && <FooterHeading>{t.contactHeading}</FooterHeading>}
          {hasContact && (
            <ul className="space-y-4">
              {fullAddress && (
                <li className="flex gap-3">
                  <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>{fullAddress}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex gap-3">
                  <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <a href={telHref(settings.phone)} className="transition hover:text-gold-300">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.whatsapp && (
                <li className="flex gap-3">
                  <WhatsAppIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold-300">
                    {whatsappLabel}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex gap-3">
                  <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <a href={`mailto:${settings.email}`} className="break-all transition hover:text-gold-300">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.officeHours && (
                <li className="flex gap-3">
                  <ClockIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                  <span>{settings.officeHours}</span>
                </li>
              )}
            </ul>
          )}
          <div className={`rounded-xl border border-gold-500/25 bg-white/[0.03] p-5 ${hasContact ? "mt-7" : ""}`}>
            {t.consultTitle && <p className="font-serif text-xl font-semibold text-white">{t.consultTitle}</p>}
            {t.consultText && <p className="mt-1 text-sm">{t.consultText}</p>}
            <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-[0.78rem] font-semibold tracking-[0.12em] text-gold-300 uppercase transition hover:text-gold-200">
              {t.consultLink} <ArrowRightIcon width={14} height={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="gold-hairline opacity-40" />
      <div className="container-x relative flex flex-col gap-3 py-7 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <p>
            © {new Date().getFullYear()} {settings.firmName}. {t.copyright}
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://www.byteflow.ae/"
              target="_blank"
              rel="noopener"
              className="font-semibold tracking-[0.12em] text-gold-300 transition hover:text-gold-200"
            >
              BYTEFLOW
            </a>
          </p>
        </div>
        {t.disclaimer && <p className="max-w-xl md:text-right">{t.disclaimer}</p>}
      </div>
    </footer>
  );
}
