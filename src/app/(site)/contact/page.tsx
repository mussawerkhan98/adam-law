import type { Metadata } from "next";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { JsonLd } from "@/components/site/JsonLd";
import { PageHero } from "@/components/site/Sections";
import { getPracticeAreas, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { telHref, whatsappHref } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata({
    settings,
    title: "Contact Us",
    description: `Contact ${settings.firmName}${settings.city ? ` in ${settings.city}` : ""} to book a consultation.${
      settings.phone ? ` Call ${settings.phone}.` : ""
    }`,
    path: "/contact",
  });
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const [{ area }, settings, areas] = await Promise.all([searchParams, getSettings(), getPracticeAreas()]);
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
        eyebrow="Contact"
        title="Book a consultation"
        intro="Tell us briefly about your matter. All enquiries are treated in strict confidence."
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-serif text-3xl text-navy-900">Get in touch</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Reach us by phone, WhatsApp or email, or send the form and we will respond promptly.
            </p>
            <ul className="mt-10 space-y-6">
              {items.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-900 text-gold-400">
                    <Icon width={20} height={20} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold tracking-wide text-muted uppercase">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className="text-lg break-all text-navy-900 hover:text-gold-600"
                        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-lg text-navy-900">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm areas={areas.map((a) => a.title)} defaultArea={area} />
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
