import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { WhatsAppFloat } from "@/components/site/Sections";
import { getPosts, getPracticeAreas, getSettings } from "@/lib/data";
import { legalServiceSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.seoTitle || s.firmName, template: `%s | ${s.firmName}` },
    description: s.seoDescription || s.tagline || undefined,
    keywords: s.seoKeywords
      ? s.seoKeywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
      : undefined,
    applicationName: s.firmName,
    ...(s.googleVerification ? { verification: { google: s.googleVerification } } : {}),
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, areas, posts] = await Promise.all([getSettings(), getPracticeAreas(), getPosts(3)]);
  // Only what the menus need — keeps long article/practice text out of the client bundle.
  const menuAreas = areas.map(({ title, slug, summary, icon }) => ({ title, slug, summary, icon }));
  const menuPosts = posts.map(({ title, slug, publishedAt }) => ({ title, slug, date: formatDate(publishedAt) }));
  return (
    <>
      <JsonLd data={legalServiceSchema(settings, areas)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy-900"
      >
        Skip to content
      </a>
      <Header
        firmName={settings.firmName}
        phone={settings.phone}
        email={settings.email}
        whatsapp={settings.whatsapp}
        officeHours={settings.officeHours}
        logoUrl={settings.logoUrl}
        areas={menuAreas}
        posts={menuPosts}
      />
      <main id="main">{children}</main>
      <Footer settings={settings} areas={areas} />
      <WhatsAppFloat number={settings.whatsapp} firmName={settings.firmName} />
    </>
  );
}
