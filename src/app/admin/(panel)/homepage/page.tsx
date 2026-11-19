import { ImageField, SubmitButton } from "@/components/admin/client";
import { Card, Field, Flash, PageHeader, TextArea } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { saveSettings } from "../../actions";

export const metadata = { title: "Home & About page" };

export default async function HomepageEditor({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const [{ saved, error }, s] = await Promise.all([
    searchParams,
    db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
  ]);

  return (
    <>
      <PageHeader title="Home & About page" description="The main banner, statistics, about section and call-to-action." />
      <Flash saved={saved} error={error} />
      <form action={saveSettings} className="space-y-6">
        <input type="hidden" name="returnTo" value="/admin/homepage" />

        <Card title="Hero banner" description="The first thing visitors see. Your main heading (H1) is important for SEO — mention what you do and where.">
          <Field label="Small heading above title" name="heroEyebrow" defaultValue={s.heroEyebrow} placeholder="e.g. Advocates & Legal Consultants" />
          <Field label="Main heading" name="heroTitle" defaultValue={s.heroTitle} />
          <TextArea label="Sub-heading" name="heroSubtitle" defaultValue={s.heroSubtitle} rows={3} />
          <ImageField label="Hero image" name="heroImageUrl" defaultValue={s.heroImageUrl} hint="Portrait photo works best (4:5). Shown on large screens." />
        </Card>

        <Card title="Highlights" description="Up to four short figures shown under the banner. Only use accurate numbers. Leave blank to hide.">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="grid gap-5 md:grid-cols-[10rem_1fr]">
              <Field label={`Figure ${n}`} name={`stat${n}Value`} defaultValue={s[`stat${n}Value` as keyof typeof s] as string} placeholder="e.g. 15+" />
              <Field label={`Label ${n}`} name={`stat${n}Label`} defaultValue={s[`stat${n}Label` as keyof typeof s] as string} placeholder="e.g. Years of experience" />
            </div>
          ))}
        </Card>

        <Card title="About section" description="Shown on the home page and the About page.">
          <Field label="Heading" name="aboutTitle" defaultValue={s.aboutTitle} />
          <TextArea label="Text" name="aboutBody" defaultValue={s.aboutBody} rows={12} markdown />
          <ImageField label="About image" name="aboutImageUrl" defaultValue={s.aboutImageUrl} hint="e.g. a photo of the advocate or the office. If empty, the first team member's photo is used." />
        </Card>

        <Card title="Call-to-action band" description="The dark banner near the bottom of every page.">
          <Field label="Heading" name="ctaTitle" defaultValue={s.ctaTitle} />
          <TextArea label="Text" name="ctaText" defaultValue={s.ctaText} rows={2} />
        </Card>

        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
          <SubmitButton />
        </div>
      </form>
    </>
  );
}
