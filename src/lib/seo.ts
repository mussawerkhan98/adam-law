import type { Metadata } from "next";
import type { Settings } from "./data";
import { absoluteUrl, siteUrl } from "./utils";

/** Builds page metadata with canonical URL, Open Graph and Twitter cards. */
export function pageMetadata(opts: {
  settings: Settings;
  title?: string;
  description?: string | null;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  const { settings, path } = opts;
  const description = opts.description || settings.seoDescription || settings.tagline || undefined;
  const image = opts.image || settings.ogImageUrl || undefined;
  const fullTitle = opts.title ? `${opts.title} | ${settings.firmName}` : settings.seoTitle || settings.firmName;

  return {
    title: opts.title ? opts.title : { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: opts.type ?? "website",
      url: path,
      siteName: settings.firmName,
      title: fullTitle,
      description,
      locale: "en",
      ...(image ? { images: [{ url: image }] } : {}),
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/** schema.org LegalService (a LocalBusiness subtype) for Google rich results / local SEO. */
export function legalServiceSchema(settings: Settings, areas: { title: string }[] = []) {
  const sameAs = [settings.facebook, settings.instagram, settings.linkedin, settings.twitter, settings.youtube].filter(
    Boolean,
  );
  const hasAddress = settings.address || settings.city;
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${siteUrl()}/#organization`,
    name: settings.firmName,
    description: settings.seoDescription || settings.tagline || undefined,
    url: siteUrl(),
    logo: absoluteUrl(settings.logoUrl || "/brand/logo-square.png"),
    image: absoluteUrl(settings.ogImageUrl || settings.heroImageUrl || "/opengraph-image"),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: settings.address || undefined,
            addressLocality: settings.city || undefined,
            addressRegion: settings.region || undefined,
            postalCode: settings.postalCode || undefined,
            addressCountry: settings.country || undefined,
          },
        }
      : {}),
    ...(settings.city ? { areaServed: settings.city } : {}),
    ...(settings.officeHours ? { openingHours: settings.officeHours } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(areas.length
      ? {
          knowsAbout: areas.map((a) => a.title),
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Legal services",
            itemListElement: areas.map((a) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: a.title } })),
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
