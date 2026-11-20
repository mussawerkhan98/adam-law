import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmButton, ListField, SubmitButton } from "@/components/admin/client";
import { Card, Checkbox, Field, Flash, PageHeader, TextArea } from "@/components/admin/ui";
import { PRACTICE_ICON_KEYS } from "@/components/icons";
import { PAGES, type Item } from "@/lib/content";
import { getContent } from "@/lib/data";
import { resetPageSection, savePageContent } from "../../../actions";

export const metadata = { title: "Pages & sections" };

const VIEW: Record<string, string> = {
  home: "/",
  about: "/about",
  practice: "/practice-areas",
  team: "/team",
  blog: "/blog",
  faq: "/faq",
  contact: "/contact",
  menu: "/",
  footer: "/",
};

export default async function PageEditor({
  params,
  searchParams,
}: {
  params: Promise<{ page: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const [{ page: id }, { saved, error }, content] = await Promise.all([params, searchParams, getContent()]);
  const page = PAGES.find((p) => p.id === id);
  if (!page) notFound();
  const values = content as unknown as Record<string, Record<string, string | boolean | Item[]>>;

  return (
    <>
      <PageHeader title="Pages & sections" description="Edit the text, headings, buttons and sections on every page of the website." />

      <nav aria-label="Pages" className="mb-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <Link
            key={p.id}
            href={`/admin/pages/${p.id}`}
            aria-current={p.id === page.id ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              p.id === page.id ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </nav>

      <div className="mb-6 flex flex-col justify-between gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center">
        <p>{page.description}</p>
        <a href={VIEW[page.id] ?? "/"} target="_blank" rel="noopener" className="shrink-0 font-semibold underline underline-offset-2">
          View on website ↗
        </a>
      </div>

      <Flash saved={saved} error={error} />

      <form action={savePageContent} className="space-y-6">
        <input type="hidden" name="page" value={page.id} />
        {page.sections.map((section) => {
          const v = values[section.key];
          return (
            <Card key={section.key} title={section.title} description={section.description}>
              {section.fields.map((f) => {
                const name = `${section.key}.${f.key}`;
                const value = v[f.key];
                if (f.type === "toggle") return <Checkbox key={name} label={f.label} name={name} defaultChecked={value === true} hint={f.hint} />;
                if (f.type === "list")
                  return (
                    <ListField
                      key={name}
                      name={name}
                      label={f.label}
                      fields={f.item ?? []}
                      initial={Array.isArray(value) ? value : []}
                      max={f.max}
                      fixedLabels={f.fixedLabels}
                      icons={PRACTICE_ICON_KEYS}
                    />
                  );
                const hint = [f.hint, f.required ? "Leave empty to use the default text." : ""].filter(Boolean).join(" ");
                return f.type === "textarea" ? (
                  <TextArea key={name} label={f.label} name={name} defaultValue={String(value ?? "")} rows={3} hint={hint || undefined} />
                ) : (
                  <Field key={name} label={f.label} name={name} defaultValue={String(value ?? "")} hint={hint || undefined} />
                );
              })}
              <div className="border-t border-slate-100 pt-4 text-right">
                {/* Submits its own small form (rendered after the main one) — forms can't be nested. */}
                <ConfirmButton
                  form={`reset-${section.key}`}
                  message={`Restore the original text for “${section.title}”? Your changes to this section will be lost.`}
                  className="text-xs font-medium text-slate-500 hover:text-red-600"
                >
                  Restore original text
                </ConfirmButton>
              </div>
            </Card>
          );
        })}

        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
          <SubmitButton />
        </div>
      </form>

      {page.sections.map((section) => (
        <form key={section.key} id={`reset-${section.key}`} action={resetPageSection} hidden>
          <input type="hidden" name="page" value={page.id} />
          <input type="hidden" name="section" value={section.key} />
        </form>
      ))}
    </>
  );
}
