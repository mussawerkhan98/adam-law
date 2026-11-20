import type { Metadata } from "next";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero, RichTitle } from "@/components/site/Sections";
import { getContent, getPracticeAreas, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([getSettings(), getContent()]);
  const page = content["contact.page"];
  return pageMetadata({
    settings,
    title: page.metaTitle,
    description:
      page.metaDescription ||
      `Contact ${settings.firmName}${settings.city ? ` in ${settings.city}` : ""} to book a consultation.${
      settings.phone ? ` Call ${settings.phone}.` : ""
    }`,
    path: "/contact",
  });
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const [{ area }, settings, content, areas] = await Promise.all([searchParams, getSettings(), getContent(), getPracticeAreas()]);
  const { "contact.page": page, "contact.panel": panel } = content;
  const fullAddress = [settings.address, settings.city, settings.region, settings.country].filter(Boolean).join(", ");

  const items = [
    fullAddress && { Icon: PinIcon, label: "Office", value: fullAddress },
    settings.phone && { Icon: PhoneIcon, label: "Phone", value: settings.phone, href: telHref(settings.phone) },
    settings.whatsapp && {
      Icon: WhatsAppIcon,
      label: "WhatsApp",
      value: settings.whatsapp,
      href: whatsappHref(settings.whatsapp),
    },
    settings.email && { Icon: MailIcon, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.officeHours && { Icon: ClockIcon, label: "Office hours", value: settings.officeHours },
  ].filter(Boolean) as { Icon: typeof PinIcon; label: string; value: string; href?: string }[];

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        intro={page.intro}
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <section className="section paper">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="hero-pattern overflow-hidden rounded-xl p-8 text-white shadow-2xl shadow-navy-900/25 md:p-10 lg:sticky lg:top-32">
            {panel.eyebrow && <p className="eyebrow on-dark">{panel.eyebrow}</p>}
            <h2 className="mt-5 font-serif text-[2.2rem] leading-tight font-semibold">
              <RichTitle text={panel.title} />
            </h2>
            {panel.text && <p className="mt-4 leading-relaxed text-white/65">{panel.text}</p>}
            {items.length > 0 && (
              <ul className="mt-9 space-y-6">
                {items.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-400/35 bg-gold-500/10 text-gold-300">
                      <Icon width={19} height={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          className="mt-0.5 block break-all text-[1.05rem] text-white transition hover:text-gold-300"
                          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="mt-0.5 block text-[1.05rem] text-white">{value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {panel.steps.length > 0 && (
            <>
            <div className="gold-hairline mt-10 opacity-50" />
            {panel.nextTitle && (
              <p className="mt-8 font-display text-xs font-semibold tracking-[0.2em] text-gold-300 uppercase">{panel.nextTitle}</p>
            )}
            <ol className="mt-5 space-y-4 text-sm text-white/70">
              {panel.steps.map(({ text: step }, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-500/15 font-display text-[0.7rem] text-gold-300">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            </>
            )}
          </div>
          <ContactForm areas={areas.map((a) => a.title)} defaultArea={area} text={content["contact.form"]} />
        </div>
      </section>

      {settings.mapEmbedUrl && (
        <section aria-label="Map" className="h-[420px] w-full bg-cream-100">
          <iframe
            src={settings.mapEmbedUrl}
            title={`Map to ${settings.firmName}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </section>
      )}
    </>
  );
}
