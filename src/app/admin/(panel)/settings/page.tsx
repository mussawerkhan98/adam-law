import { ImageField, SubmitButton } from "@/components/admin/client";
import { Card, Field, Flash, PageHeader, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { alertRecipients, mailConfigured } from "@/lib/mail";
import { saveSettings } from "../../actions";

export const metadata = { title: "Firm details & SEO" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ saved, error }, s] = await Promise.all([
    searchParams,
    db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);
  const recipients = alertRecipients(s.email);
  const alertHint = !mailConfigured()
    ? "Email alerts for new enquiries are off — the SMTP settings on the server are not set (see README)."
    : recipients.length
      ? `Email alerts for new enquiries are on and go to: ${recipients.join(", ")}.`
      : "Email alerts are set up on the server — enter an email here to receive them.";

  return (
    <>
      <PageHeader title="Firm details & SEO" description="Contact details appear in the header, footer and contact page, and in Google's business information." />
      <Flash saved={saved} error={error} />
      <form action={saveSettings} className="space-y-6">
        <input type="hidden" name="returnTo" value="/admin/settings" />

        <Card title="Firm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Firm name" name="firmName" defaultValue={s.firmName} required />
            <Field label="Tagline" name="tagline" defaultValue={s.tagline} placeholder="e.g. Advocates & Legal Consultants" />
          </div>
          <ImageField label="Logo (optional)" name="logoUrl" defaultValue={s.logoUrl} hint="Small emblem shown in the site header next to the firm name. Transparent PNG works best. If empty, the built-in Adam Law Chamber emblem is used." />
        </Card>

        <Card title="Contact details">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Phone" name="phone" defaultValue={s.phone} placeholder="+92 300 1234567" />
            <Field label="WhatsApp number" name="whatsapp" defaultValue={s.whatsapp} hint="With country code. Shows a WhatsApp button on every page." />
            <Field label="Email" name="email" type="email" defaultValue={s.email} hint={alertHint} />
            <Field label="Office hours" name="officeHours" defaultValue={s.officeHours} placeholder="Mo-Sa 09:00-18:00" hint="Format Mo-Fr 09:00-17:00 helps Google read it." />
          </div>
        </Card>

        <Card title="Office address" description="A complete address is one of the most important signals for local search (e.g. “lawyer near me”).">
          <Field label="Street address" name="address" defaultValue={s.address} />
          <div className="grid gap-5 md:grid-cols-4">
            <Field label="City" name="city" defaultValue={s.city} />
            <Field label="Province / State" name="region" defaultValue={s.region} />
            <Field label="Postal code" name="postalCode" defaultValue={s.postalCode} />
            <Field label="Country" name="country" defaultValue={s.country} />
          </div>
          <TextArea
            label="Google Map"
            name="mapEmbedUrl"
            defaultValue={s.mapEmbedUrl}
            rows={2}
            hint="Google Maps → find your office → Share → Embed a map → Copy HTML, and paste it here."
          />
        </Card>

        <Card title="Social media" description="Full profile links. Leave blank to hide.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Facebook" name="facebook" defaultValue={s.facebook} />
            <Field label="Instagram" name="instagram" defaultValue={s.instagram} />
            <Field label="LinkedIn" name="linkedin" defaultValue={s.linkedin} />
            <Field label="X (Twitter)" name="twitter" defaultValue={s.twitter} />
            <Field label="YouTube" name="youtube" defaultValue={s.youtube} />
          </div>
        </Card>

        <Card title="Search engine optimisation (SEO)" description="Default title and description used for the home page and when sharing links.">
          <Field label="Home page title" name="seoTitle" defaultValue={s.seoTitle} hint="50–60 characters. Include your main service and city, e.g. “Adam Law Chamber | Lawyers in Lahore”." />
          <TextArea label="Meta description" name="seoDescription" defaultValue={s.seoDescription} rows={3} hint="140–160 characters. This is the text shown under your link in Google." />
          <TextArea label="Keywords" name="seoKeywords" defaultValue={s.seoKeywords} rows={2} hint="Comma separated, e.g. family lawyer Lahore, criminal lawyer, property lawyer." />
          <ImageField label="Social share image" name="ogImageUrl" defaultValue={s.ogImageUrl} hint="1200×630 px. Shown when the site is shared on WhatsApp, Facebook, LinkedIn. If empty, a branded image is generated." />
          <Field label="Google Search Console verification code" name="googleVerification" defaultValue={s.googleVerification} hint="From Search Console → HTML tag method; paste only the content=“…” value." />
        </Card>

        <Card title="Footer">
          <TextArea label="Footer text" name="footerText" defaultValue={s.footerText} rows={3} />
        </Card>

        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
