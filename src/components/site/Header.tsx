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

// The About mega menu also links to Contact so its grid matches the others.
const ABOUT_MENU = [
  ...ABOUT_LINKS,
  { href: "/contact", icon: "building", title: "Contact & Office", text: "Visit, call or send us a message" },
];

const panelState = (open: boolean) =>
  open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-2 opacity-0";

/** One entry in a mega menu grid: icon tile, title and a one-line description. */
function MegaItem({
  href,
  icon,
  title,
  text,
  current,
  longTitle = false,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
  current: boolean;
  /** Allow two lines for the title (used for article titles). */
  longTitle?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={`group/item flex items-start gap-3.5 rounded-lg p-3 transition hover:bg-cream-50 ${current ? "bg-cream-50" : ""}`}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cream-100 text-gold-600 transition group-hover/item:bg-navy-900 group-hover/item:text-gold-300">
          <PracticeIcon name={icon} width={19} height={19} />
        </span>
        <span className="min-w-0">
          <span
            className={`${longTitle ? "line-clamp-2 leading-snug" : "line-clamp-1"} text-[0.95rem] font-semibold text-navy-900 transition group-hover/item:text-gold-700`}
          >
            {title}
          </span>
          <span className="mt-0.5 line-clamp-1 text-[0.82rem] text-muted">{text}</span>
        </span>
      </Link>
    </li>
  );
}

/**
 * Full-width dropdown panel shared by every menu, so they all look the same:
 * intro column · two-column grid of links · consultation card, with a help bar underneath.
 */
function MegaPanel({
  id,
  open,
  eyebrow,
  title,
  emphasis,
  intro,
  viewAll,
  heading,
  help,
  phone,
  whatsapp,
  children,
}: {
  id: string;
  open: boolean;
  eyebrow: string;
  title: string;
  emphasis: string;
  intro: string;
  viewAll: { href: string; label: string };
  heading: string;
  help: { text: string; href: string; label: string };
  phone: string;
  whatsapp: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={`absolute inset-x-0 top-full hidden transition duration-300 xl:block ${panelState(open)}`}>
      <div className="container-x">
        <div className="overflow-hidden rounded-b-2xl border border-t-0 border-cream-200 bg-white shadow-[0_40px_80px_-30px_rgb(5_11_22/0.55)]">
          <div className="grid min-h-[20rem] grid-cols-[15rem_1fr_17rem]">
            {/* Intro */}
            <div className="flex flex-col border-r border-cream-200 bg-cream-50 p-8">
              <p className="font-display text-[0.7rem] font-semibold tracking-[0.22em] text-gold-600 uppercase">{eyebrow}</p>
              <p className="mt-4 font-serif text-[1.9rem] leading-[1.1] font-semibold text-navy-900">
                {title} <span className="text-gold-600 italic">{emphasis}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted">{intro}</p>
              <Link
                href={viewAll.href}
                className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold whitespace-nowrap text-navy-900 transition hover:text-gold-700"
              >
                {viewAll.label} <ArrowRightIcon width={15} height={15} />
              </Link>
            </div>

            {/* Links */}
            <div className="p-8">
              <p className="border-b border-cream-200 pb-3 font-display text-[0.7rem] font-semibold tracking-[0.22em] text-muted uppercase">
                {heading}
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1">{children}</ul>
            </div>

            {/* Consultation card */}
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

          {/* Help bar */}
          <div className="flex items-center justify-between border-t border-cream-200 bg-cream-50 px-8 py-3.5 text-sm">
            <p className="text-muted">
              {help.text}{" "}
              <Link href={help.href} className="font-semibold text-navy-900 underline-offset-4 hover:text-gold-700 hover:underline">
                {help.label}
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
  );
}

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
  const triggers: { key: MenuKey; label: string; active: boolean }[] = [
    { key: "about", label: "About", active: aboutActive },
    { key: "practice", label: "Practice Areas", active: isActive("/practice-areas") },
    { key: "insights", label: "Insights", active: isActive("/blog") },
  ];

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

          {/* ───────── Desktop navigation — every dropdown opens the same full-width panel ───────── */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-9 text-[0.82rem] font-medium">
              {triggers.map((t) => (
                <li key={t.key} onMouseEnter={() => openMenu(t.key)}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[t.key] = el;
                    }}
                    type="button"
                    aria-expanded={menu === t.key}
                    aria-controls={`menu-${t.key}`}
                    onClick={() => (menu === t.key ? setMenu(null) : openMenu(t.key))}
                    className={triggerCls(t.key, t.active)}
                  >
                    {t.label} <Chevron open={menu === t.key} />
                    {underline(menu === t.key || t.active)}
                  </button>
                </li>
              ))}
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

        {/* ───────── Mega menu panels (same layout for every menu) ───────── */}
        <MegaPanel
          id="menu-about"
          open={menu === "about"}
          eyebrow="About Us"
          title="Committed to"
          emphasis="your rights."
          intro="A client-focused chamber offering dependable advice and strong representation."
          viewAll={{ href: "/about", label: "More about the chamber" }}
          heading="Get to know us"
          help={{ text: "Have a question about working with us?", href: "/faq", label: "Read the FAQ" }}
          phone={phone}
          whatsapp={whatsapp}
        >
          {ABOUT_MENU.map((l) => (
            <MegaItem key={l.href} href={l.href} icon={l.icon} title={l.title} text={l.text} current={isActive(l.href)} />
          ))}
        </MegaPanel>

        <MegaPanel
          id="menu-practice"
          open={menu === "practice"}
          eyebrow="Practice Areas"
          title="Clear advice,"
          emphasis="every matter."
          intro="Advice and representation for individuals, families and businesses — from first consultation to final hearing."
          viewAll={{ href: "/practice-areas", label: "View all practice areas" }}
          heading="How we can help"
          help={{ text: "Not sure which area fits your matter?", href: "/contact", label: "Speak to a lawyer" }}
          phone={phone}
          whatsapp={whatsapp}
        >
          {areas.map((a) => (
            <MegaItem
              key={a.slug}
              href={`/practice-areas/${a.slug}`}
              icon={a.icon}
              title={a.title}
              text={a.summary}
              current={pathname === `/practice-areas/${a.slug}`}
            />
          ))}
        </MegaPanel>

        <MegaPanel
          id="menu-insights"
          open={menu === "insights"}
          eyebrow="Legal Insights"
          title="Know where"
          emphasis="you stand."
          intro="Practical guides that explain legal issues in plain language."
          viewAll={{ href: "/blog", label: "Browse all articles" }}
          heading="Latest articles"
          help={{ text: "Need advice on your own situation?", href: "/contact", label: "Speak to a lawyer" }}
          phone={phone}
          whatsapp={whatsapp}
        >
          {posts.map((p) => (
            <MegaItem
              key={p.slug}
              href={`/blog/${p.slug}`}
              icon="document"
              title={p.title}
              text={p.date}
              current={pathname === `/blog/${p.slug}`}
              longTitle
            />
          ))}
          <MegaItem href="/blog" icon="globe" title="All articles" text={posts.length ? "Browse every guide and update" : "New articles are coming soon"} current={false} />
        </MegaPanel>

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
