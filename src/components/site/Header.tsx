"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/practice-areas", label: "Practice Areas" },
  { href: "/team", label: "Our Team" },
  { href: "/blog", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header({ firmName, phone, logoUrl }: { firmName: string; phone: string; logoUrl: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-navy-950/95 shadow-lg shadow-black/10 backdrop-blur" : "bg-navy-900"
      }`}
    >
      <div className="container-x flex h-18 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white" aria-label={`${firmName} — home`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl || "/brand/logo-mark.png"} alt="" width={53} height={40} className="h-10 w-auto" />

          <span className="font-serif text-xl leading-none tracking-wide">{firmName}</span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative py-2 transition-colors ${
                    isActive(item.href) ? "text-gold-400" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {phone && (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white">
              <PhoneIcon width={16} height={16} className="text-gold-400" />
              {phone}
            </a>
          )}
          <Link href="/contact" className="btn-gold !px-5 !py-2.5 text-sm">
            Free Consultation
          </Link>
        </div>

        <button
          type="button"
          className="text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 lg:hidden">
          <ul className="container-x flex flex-col py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-3 text-base ${isActive(item.href) ? "text-gold-400" : "text-white/85"}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link href="/contact" className="btn-gold w-full">
                Free Consultation
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
