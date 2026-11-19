"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRightIcon, ClockIcon, CloseIcon, MailIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";

// Local copies so this client component doesn't pull lib/utils (and its Markdown parser) into the browser bundle.
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
const whatsappHref = (number: string) => `https://wa.me/${number.replace(/\D/g, "")}`;

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/blog", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  firmName: string;
  phone: string;
  email: string;
  whatsapp: string;
  officeHours: string;
  logoUrl: string;
};

/** "Adam Law Chamber" → ["Adam", "Law Chamber"] for the stacked wordmark. */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/);
  return [first ?? name, rest.join(" ")];
}

export function Header({ firmName, phone, email, whatsapp, officeHours, logoUrl }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [first, rest] = splitName(firmName);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const hasTopBar = Boolean(phone || email || officeHours || whatsapp);

  return (
    <>
      {hasTopBar && (
        <div className="hidden border-b border-white/5 bg-navy-950 text-[0.8rem] text-white/60 lg:block">
          <div className="container-x flex h-10 items-center justify-between gap-6">
            <div className="flex items-center gap-7">
              {officeHours && (
                <span className="flex items-center gap-2">
                  <ClockIcon width={14} height={14} className="text-gold-400" /> {officeHours}
                </span>
              )}
              {email && (
                <a href={`mailto:${email}`} className="flex items-center gap-2 transition hover:text-gold-300">
                  <MailIcon width={14} height={14} className="text-gold-400" /> {email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-7">
              {whatsapp && (
                <a
                  href={whatsappHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 transition hover:text-gold-300"
                >
                  <WhatsAppIcon width={14} height={14} className="text-gold-400" /> WhatsApp
                </a>
              )}
              {phone && (
                <a href={telHref(phone)} className="flex items-center gap-2 transition hover:text-gold-300">
                  <PhoneIcon width={14} height={14} className="text-gold-400" /> {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled || open ? "bg-navy-950/90 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.5)] backdrop-blur-md" : "bg-navy-900"
        }`}
      >
        <div
          className={`container-x flex items-center justify-between gap-6 transition-[height] duration-500 ${
            scrolled ? "h-[4.5rem]" : "h-[5.5rem]"
          }`}
        >
          <Link href="/" className="group flex items-center gap-3.5" aria-label={`${firmName} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl || "/brand/logo-mark.png"}
              alt=""
              width={211}
              height={160}
              className={`w-auto transition-[height] duration-500 ${scrolled ? "h-10" : "h-12"}`}
            />
            <span className="flex flex-col leading-none">
              <span className="text-gold-gradient font-display text-[1.45rem] font-semibold tracking-[0.14em] uppercase">
                {first}
              </span>
              {rest && (
                <span className="mt-1.5 font-display text-[0.62rem] font-medium tracking-[0.42em] text-white/75 uppercase">
                  {rest}
                </span>
              )}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-8 text-[0.82rem] font-medium tracking-[0.08em] uppercase">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative py-2 transition-colors ${active ? "text-gold-300" : "text-white/75 hover:text-white"}`}
                    >
                      {item.label}
                      <span
                        className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-gold-300 to-gold-600 transition-all duration-300 ${
                          active ? "w-full" : "w-0 group-hover:w-full"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-4 xl:flex">
            <Link href="/contact" className="btn-gold !px-6 !py-3">
              Free Consultation
            </Link>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-400 hover:text-gold-300 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
          </button>
        </div>
        <div className="gold-hairline opacity-40" />

        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile"
            className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-navy-950 xl:hidden"
          >
            <ul className="container-x flex flex-col py-6">
              {NAV.map((item, i) => (
                <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between border-b border-white/10 py-4 font-serif text-2xl ${
                      isActive(item.href) ? "text-gold-300" : "text-white/90"
                    }`}
                  >
                    {item.label}
                    <ArrowRightIcon width={18} height={18} className="text-gold-500" />
                  </Link>
                </li>
              ))}
              <li className="pt-8">
                <Link href="/contact" className="btn-gold w-full">
                  Book a Free Consultation
                </Link>
              </li>
              {phone && (
                <li className="pt-3">
                  <a href={telHref(phone)} className="btn-outline w-full text-white">
                    <PhoneIcon width={16} height={16} /> {phone}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
