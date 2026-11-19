"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ChevronDownIcon,
  ClockIcon,
  CloseIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PracticeIcon,
  WhatsAppIcon,
} from "@/components/icons";

// Local copies so this client component doesn't pull lib/utils (and its Markdown parser) into the browser bundle.
// Desktop: About ▾ / Practice Areas ▾ (mega menu) / Insights ▾ / Contact. Mobile: full-screen menu with accordions.
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
const whatsappHref = (number: string) => `https://wa.me/${number.replace(/\D/g, "")}`;

type MenuArea = { title: string; slug: string; summary: string; icon: string };
type MenuPost = { title: string; slug: string; date: string };
type MenuKey = "about" | "practice" | "insights";

type Props = {
  firmName: string;
  phone: string;
  email: string;
  whatsapp: string;
  officeHours: string;
  logoUrl: string;
  areas: MenuArea[];
  posts: MenuPost[];
};

const ABOUT_LINKS = [
  { href: "/about", icon: "scale", title: "About the Chamber", text: "Our story, values and approach" },
  { href: "/team", icon: "users", title: "Our Team", text: "The advocates behind your case" },
  { href: "/faq", icon: "document", title: "FAQ", text: "Answers before you call" },
];

/** "Adam Law Chamber" → ["Adam", "Law Chamber"] for the stacked wordmark. */
function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/);
  return [first ?? name, rest.join(" ")];
}

const panelState = (open: boolean) =>
  open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0";

export function Header({ firmName, phone, email, whatsapp, officeHours, logoUrl, areas, posts }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const [first, rest] = splitName(firmName);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const openMenu = (key: MenuKey) => {
    cancelClose();
    setMenu(key);
  };
  const closeSoon = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMenu(null), 140);
  };
  const closeAndFocus = useCallback((key: MenuKey | null) => {
    setMenu(null);
    if (key) triggerRefs.current[key]?.focus();
  }, []);

  // Close everything on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes the open menu; clicking outside the header closes it too
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAndFocus(menu);
    const onDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [menu, closeAndFocus]);

  useEffect(() => () => cancelClose(), []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const aboutActive = ABOUT_LINKS.some((l) => isActive(l.href));
  const hasTopBar = Boolean(phone || email || officeHours || whatsapp);
  const dropGap = scrolled ? "pt-[1.15rem]" : "pt-[1.65rem]";

  const linkCls = (on: boolean) =>
    `group relative flex items-center gap-1.5 py-2 tracking-[0.08em] uppercase transition-colors ${on ? "text-gold-300" : "text-white/75 hover:text-white"}`;
  const triggerCls = (key: MenuKey, active: boolean) => linkCls(menu === key || active);
  const underline = (on: boolean) => (
    <span
      aria-hidden
      className={`absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-gold-300 to-gold-600 transition-all duration-300 ${
        on ? "w-full" : "w-0 group-hover:w-full"
      }`}
    />
  );
  const Chevron = ({ open }: { open: boolean }) => (
    <ChevronDownIcon width={15} height={15} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
  );

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
                <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-gold-300">
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
        ref={headerRef}
        onMouseLeave={closeSoon}
        onMouseEnter={cancelClose}
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled || mobileOpen || menu ? "bg-navy-950/95 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.5)] backdrop-blur-md" : "bg-navy-900"
        }`}
      >
        <div className={`container-x flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled ? "h-[4.5rem]" : "h-[5.5rem]"}`}>
          <Link href="/" className="group flex items-center gap-3.5" aria-label={`${firmName} — home`} onMouseEnter={() => setMenu(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl || "/brand/logo-mark.png"}
              alt=""
              width={211}
              height={160}
              className={`w-auto transition-[height] duration-500 ${scrolled ? "h-10" : "h-12"}`}
            />
            <span className="flex flex-col leading-none">
              <span className="text-gold-gradient font-display text-[1.45rem] font-semibold tracking-[0.14em] uppercase">{first}</span>
              {rest && (
                <span className="mt-1.5 font-display text-[0.62rem] font-medium tracking-[0.42em] text-white/75 uppercase">{rest}</span>
              )}
            </span>
          </Link>

          {/* ───────── Desktop navigation ───────── */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-9 text-[0.82rem] font-medium tracking-[0.08em] uppercase">
              {/* About ▾ */}
              <li className="relative" onMouseEnter={() => openMenu("about")}>
                <button
                  ref={(el) => {
                    triggerRefs.current.about = el;
                  }}
                  type="button"
                  aria-expanded={menu === "about"}
                  aria-controls="menu-about"
                  onClick={() => (menu === "about" ? setMenu(null) : openMenu("about"))}
                  className={triggerCls("about", aboutActive)}
                >
                  About <Chevron open={menu === "about"} />
                  {underline(menu === "about" || aboutActive)}
                </button>
                <div id="menu-about" className={`absolute top-full left-1/2 -translate-x-1/2 ${dropGap} transition duration-300 ${panelState(menu === "about")}`}>
                  <div className="w-[22rem] overflow-hidden rounded-xl border border-cream-200 bg-white p-2 normal-case tracking-normal shadow-[0_30px_60px_-20px_rgb(5_11_22/0.45)]">
                    {ABOUT_LINKS.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={`group/item flex items-center gap-4 rounded-lg p-3 transition hover:bg-cream-50 ${isActive(l.href) ? "bg-cream-50" : ""}`}
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-cream-100 text-gold-600 transition group-hover/item:bg-navy-900 group-hover/item:text-gold-300">
                          <PracticeIcon name={l.icon} width={20} height={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.95rem] font-semibold text-navy-900">{l.title}</span>
                          <span className="block text-[0.82rem] text-muted">{l.text}</span>
                        </span>
                        <ArrowRightIcon width={15} height={15} className="text-gold-500 opacity-0 transition group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Practice Areas ▾ (mega menu panel is rendered below, full width) */}
              <li onMouseEnter={() => openMenu("practice")}>
                <button
                  ref={(el) => {
                    triggerRefs.current.practice = el;
                  }}
                  type="button"
                  aria-expanded={menu === "practice"}
                  aria-controls="menu-practice"
                  onClick={() => (menu === "practice" ? setMenu(null) : openMenu("practice"))}
                  className={triggerCls("practice", isActive("/practice-areas"))}
                >
                  Practice Areas <Chevron open={menu === "practice"} />
                  {underline(menu === "practice" || isActive("/practice-areas"))}
                </button>
              </li>

              {/* Insights ▾ */}
              {posts.length > 0 ? (
                <li className="relative" onMouseEnter={() => openMenu("insights")}>
                  <button
                    ref={(el) => {
                      triggerRefs.current.insights = el;
                    }}
                    type="button"
                    aria-expanded={menu === "insights"}
                    aria-controls="menu-insights"
                    onClick={() => (menu === "insights" ? setMenu(null) : openMenu("insights"))}
                    className={triggerCls("insights", isActive("/blog"))}
                  >
                    Insights <Chevron open={menu === "insights"} />
                    {underline(menu === "insights" || isActive("/blog"))}
                  </button>
                  <div id="menu-insights" className={`absolute top-full left-1/2 -translate-x-1/2 ${dropGap} transition duration-300 ${panelState(menu === "insights")}`}>
                    <div className="w-[25rem] overflow-hidden rounded-xl border border-cream-200 bg-white normal-case tracking-normal shadow-[0_30px_60px_-20px_rgb(5_11_22/0.45)]">
                      <p className="border-b border-cream-200 px-6 pt-5 pb-3 font-display text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">
                        Latest articles
                      </p>
                      <ul className="p-2">
                        {posts.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/blog/${p.slug}`} className="group/item block rounded-lg px-4 py-3 transition hover:bg-cream-50">
                              {p.date && <span className="block text-[0.72rem] font-semibold tracking-[0.1em] text-gold-600 uppercase">{p.date}</span>}
                              <span className="mt-1 block font-serif text-[1.15rem] leading-snug font-semibold text-navy-900 transition group-hover/item:text-gold-700">
                                {p.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/blog"
                        className="flex items-center justify-between border-t border-cream-200 bg-cream-50 px-6 py-3.5 text-[0.78rem] font-semibold tracking-[0.12em] text-navy-900 uppercase transition hover:text-gold-700"
                      >
                        All articles <ArrowRightIcon width={15} height={15} />
                      </Link>
                    </div>
                  </div>
                </li>
              ) : (
                <li onMouseEnter={() => setMenu(null)}>
                  <Link href="/blog" className={linkCls(isActive("/blog"))}>
                    Insights
                    {underline(isActive("/blog"))}
                  </Link>
                </li>
              )}

              <li onMouseEnter={() => setMenu(null)}>
                <Link href="/contact" aria-current={isActive("/contact") ? "page" : undefined} className={linkCls(isActive("/contact"))}>
                  Contact
                  {underline(isActive("/contact"))}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="hidden items-center gap-6 xl:flex" onMouseEnter={() => setMenu(null)}>
            {phone && (
              <a href={telHref(phone)} className="flex items-center gap-2 border-l border-white/10 pl-6 text-sm text-white/75 transition hover:text-gold-300">
                <PhoneIcon width={16} height={16} className="text-gold-400" /> {phone}
              </a>
            )}
            <Link href="/contact" className="btn-gold !py-3 !pr-3 !pl-6">
              Free Consultation
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-950 text-gold-300">
                <ArrowUpRightIcon width={14} height={14} />
              </span>
            </Link>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition hover:border-gold-400 hover:text-gold-300 xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon width={20} height={20} /> : <MenuIcon width={20} height={20} />}
          </button>
        </div>
        <div className="gold-hairline opacity-40" />

        {/* ───────── Practice Areas mega menu ───────── */}
        <div
          id="menu-practice"
          className={`absolute inset-x-0 top-full hidden transition duration-300 xl:block ${panelState(menu === "practice")}`}
        >
          <div className="container-x">
            <div className="overflow-hidden rounded-b-2xl border border-t-0 border-cream-200 bg-white shadow-[0_40px_80px_-30px_rgb(5_11_22/0.55)]">
              <div className="grid grid-cols-[16rem_1fr_19rem]">
                {/* Intro */}
                <div className="flex flex-col border-r border-cream-200 bg-cream-50 p-8">
                  <p className="font-display text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">Practice Areas</p>
                  <p className="mt-4 font-serif text-[1.9rem] leading-[1.1] font-semibold text-navy-900">
                    Clear advice, <span className="text-gold-600 italic">every matter.</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Advice and representation for individuals, families and businesses — from first consultation to final hearing.
                  </p>
                  <Link href="/practice-areas" className="group/all mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold whitespace-nowrap text-navy-900 transition hover:text-gold-700">
                    View all practice areas <ArrowRightIcon width={15} height={15} />
                  </Link>
                </div>

                {/* Areas */}
                <div className="p-8">
                  <p className="border-b border-cream-200 pb-3 font-display text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                    How we can help
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">
                    {areas.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/practice-areas/${a.slug}`}
                          className={`group/item flex items-start gap-3.5 rounded-lg p-3 transition hover:bg-cream-50 ${
                            pathname === `/practice-areas/${a.slug}` ? "bg-cream-50" : ""
                          }`}
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream-100 text-gold-600 transition group-hover/item:bg-navy-900 group-hover/item:text-gold-300">
                            <PracticeIcon name={a.icon} width={19} height={19} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.95rem] font-semibold text-navy-900 transition group-hover/item:text-gold-700">{a.title}</span>
                            <span className="mt-0.5 line-clamp-1 text-[0.82rem] text-muted">{a.summary}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Featured card */}
                <div className="p-4 pl-0">
                  <div className="hero-pattern flex h-full flex-col overflow-hidden rounded-xl p-6 text-white">
                    <p className="font-display text-[0.68rem] font-semibold tracking-[0.22em] text-gold-300 uppercase">First step</p>
                    <p className="mt-2 font-serif text-[1.75rem] leading-tight font-semibold">Free first consultation</p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3.5">
                        <p className="text-gold-gradient font-display text-xl font-semibold">100%</p>
                        <p className="mt-0.5 text-xs text-white/65">Confidential</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3.5">
                        <p className="text-gold-gradient font-display text-xl font-semibold">1-to-1</p>
                        <p className="mt-0.5 text-xs text-white/65">With an advocate</p>
                      </div>
                    </div>
                    <Link href="/contact" className="btn-gold mt-6 self-start !py-2.5 !pr-2.5 !pl-5">
                      Book now
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-950 text-gold-300">
                        <ArrowUpRightIcon width={14} height={14} />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50 px-8 py-3.5 text-sm">
                <p className="text-muted">
                  Not sure which area fits your matter?{" "}
                  <Link href="/contact" className="font-semibold text-navy-900 underline-offset-4 hover:text-gold-700 hover:underline">
                    Speak to a lawyer
                  </Link>
                </p>
                {whatsapp ? (
                  <a
                    href={whatsappHref(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-semibold text-navy-900 transition hover:text-gold-700"
                  >
                    <WhatsAppIcon width={17} height={17} className="text-[#25D366]" /> WhatsApp us <ArrowRightIcon width={15} height={15} />
                  </a>
                ) : phone ? (
                  <a href={telHref(phone)} className="flex items-center gap-2 font-semibold text-navy-900 transition hover:text-gold-700">
                    <PhoneIcon width={16} height={16} className="text-gold-600" /> {phone} <ArrowRightIcon width={15} height={15} />
                  </a>
                ) : (
                  <Link href="/contact" className="flex items-center gap-2 font-semibold text-navy-900 transition hover:text-gold-700">
                    Contact us <ArrowRightIcon width={15} height={15} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Mobile navigation ───────── */}
        {mobileOpen && (
          <nav id="mobile-nav" aria-label="Mobile" className="h-[calc(100dvh-4.5rem)] overflow-y-auto bg-navy-950 xl:hidden">
            <ul className="container-x flex flex-col py-6">
              <li className="animate-fade-up">
                <Link href="/" className={`flex items-center justify-between border-b border-white/10 py-4 font-serif text-2xl ${isActive("/") ? "text-gold-300" : "text-white/90"}`}>
                  Home <ArrowRightIcon width={18} height={18} className="text-gold-500" />
                </Link>
              </li>

              <li className="animate-fade-up" style={{ animationDelay: "40ms" }}>
                <details className="group border-b border-white/10" open={aboutActive}>
                  <summary className={`flex cursor-pointer items-center justify-between py-4 font-serif text-2xl ${aboutActive ? "text-gold-300" : "text-white/90"}`}>
                    About
                    <ChevronDownIcon width={20} height={20} className="text-gold-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="pb-4">
                    {ABOUT_LINKS.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-white/75 transition hover:bg-white/5 hover:text-white">
                          <PracticeIcon name={l.icon} width={18} height={18} className="text-gold-400" /> {l.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>

              <li className="animate-fade-up" style={{ animationDelay: "80ms" }}>
                <details className="group border-b border-white/10" open={isActive("/practice-areas")}>
                  <summary
                    className={`flex cursor-pointer items-center justify-between py-4 font-serif text-2xl ${isActive("/practice-areas") ? "text-gold-300" : "text-white/90"}`}
                  >
                    Practice Areas
                    <ChevronDownIcon width={20} height={20} className="text-gold-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="pb-4">
                    {areas.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/practice-areas/${a.slug}`}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-white/75 transition hover:bg-white/5 hover:text-white"
                        >
                          <PracticeIcon name={a.icon} width={18} height={18} className="text-gold-400" /> {a.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/practice-areas" className="mt-1 flex items-center gap-2 px-2 py-2.5 text-[0.78rem] font-semibold tracking-[0.12em] text-gold-300 uppercase">
                        View all <ArrowRightIcon width={14} height={14} />
                      </Link>
                    </li>
                  </ul>
                </details>
              </li>

              {[
                { href: "/blog", label: "Insights" },
                { href: "/contact", label: "Contact" },
              ].map((item, i) => (
                <li key={item.href} className="animate-fade-up" style={{ animationDelay: `${120 + i * 40}ms` }}>
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
              {whatsapp && (
                <li className="pt-3">
                  <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-outline w-full text-white">
                    <WhatsAppIcon width={16} height={16} /> WhatsApp us
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
