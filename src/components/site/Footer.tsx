import Link from "next/link";
import type { Settings } from "@/lib/data";
import { telHref } from "@/lib/utils";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

export function Footer({ settings, areas }: { settings: Settings; areas: { title: string; slug: string }[] }) {
  const socials = [
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: settings.twitter, label: "X (Twitter)", Icon: XIcon },
    { href: settings.youtube, label: "YouTube", Icon: YouTubeIcon },
  ].filter((s) => s.href);
  const fullAddress = [settings.address, settings.city, settings.country].filter(Boolean).join(", ");

  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Link href="/" className="inline-block" aria-label={`${settings.firmName} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt={settings.firmName} width={640} height={714} loading="lazy" className="h-auto w-36" />
          </Link>
          {settings.footerText && <p className="text-sm leading-relaxed">{settings.footerText}</p>}
          {socials.length > 0 && (
            <ul className="flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/15 transition hover:border-gold-500 hover:text-gold-400"
                  >
                    <Icon width={16} height={16} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="mb-5 font-serif text-lg text-white">Practice Areas</h2>
          <ul className="space-y-2.5 text-sm">
            {areas.slice(0, 6).map((a) => (
              <li key={a.slug}>
                <Link href={`/practice-areas/${a.slug}`} className="hover:text-gold-400">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-serif text-lg text-white">Quick Links</h2>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/about", "About Us"],
              ["/team", "Our Team"],
              ["/blog", "Legal Insights"],
              ["/faq", "FAQ"],
              ["/contact", "Book a Consultation"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-gold-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-serif text-lg text-white">Contact</h2>
          <ul className="space-y-4 text-sm">
            {fullAddress && (
              <li className="flex gap-3">
                <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                <span>{fullAddress}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                <a href={telHref(settings.phone)} className="hover:text-gold-400">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-gold-400" />
                <a href={`mailto:${settings.email}`} className="break-all hover:text-gold-400">
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
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.firmName}. All rights reserved.
          </p>
          <p>The information on this website is for general guidance only and is not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
