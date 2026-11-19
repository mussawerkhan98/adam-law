import type { Metadata } from "next";
import { FaqList } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getFaqs, getSettings } from "@/lib/data";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "Frequently Asked Questions",
    description: `Answers to common questions about working with ${settings.firmName}: consultations, fees, documents and timelines.`,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const [settings, faqs] = await Promise.all([getSettings(), getFaqs()]);
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          ...(faqs.length ? [faqSchema(faqs)] : []),
        ]}
      />
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="If your question is not answered here, contact us and we will be glad to help."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <section className="py-20 md:py-28">
        <div className="container-x max-w-4xl">
          {faqs.length ? <FaqList faqs={faqs} /> : <p className="text-muted">Questions will be added soon.</p>}
        </div>
      </section>
      <CtaBand settings={settings} />
    </>
  );
}
