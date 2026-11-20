import type { Metadata } from "next";
import { FaqList } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, PageHero } from "@/components/site/Sections";
import { getContent, getFaqs, getSettings } from "@/lib/data";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const page = content["faq.page"];
  return pageMetadata({
    settings,
    title: page.metaTitle,
    description:
      page.metaDescription ||
      `Answers to common questions about working with ${settings.firmName}: consultations, fees, documents and timelines.`,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const [settings, content, faqs] = await Promise.all([getSettings(), getContent(), getFaqs()]);
  const page = content["faq.page"];
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
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "FAQ", href: "/faq" },
        ]}
      />
      <section className="section paper">
        <div className="container-x max-w-4xl">
          {faqs.length ? <FaqList faqs={faqs} /> : <p className="text-muted">{page.emptyText}</p>}
        </div>
      </section>
      <CtaBand settings={settings} content={content} />
    </>
  );
}
