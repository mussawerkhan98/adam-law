import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd } from "@/components/site/JsonLd";
import { WhatsAppFloat } from "@/components/site/Sections";
import { getPracticeAreas, getSettings } from "@/lib/data";
import { legalServiceSchema } from "@/lib/seo";

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
  const [settings, areas] = await Promise.all([getSettings(), getPracticeAreas()]);
  return (
    <>
      <JsonLd data={legalServiceSchema(settings, areas)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Header firmName={settings.firmName} phone={settings.phone} logoUrl={settings.logoUrl} />
      <main id="main">{children}</main>
      <Footer settings={settings} areas={areas} />
      <WhatsAppFloat number={settings.whatsapp} firmName={settings.firmName} />
    </>
  );
}
