import Link from "next/link";

export const inputCls =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      <div className={title || description ? "mt-5 space-y-5" : "space-y-5"}>{children}</div>
    </section>
  );
}

export function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        required={required}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  hint,
  rows = 4,
  required,
  markdown,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  hint?: string;
  rows?: number;
  required?: boolean;
  markdown?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>
          {label}
          {required && <span className="text-red-600"> *</span>}
        </span>
        {markdown && (
          <span className="text-xs font-normal text-slate-400">
            Markdown: ## Heading, **bold**, - list, [link](https://…)
          </span>
        )}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ""}
        required={required}
        className={`${inputCls} ${markdown ? "font-mono text-[13px] leading-relaxed" : ""}`}
      />
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export function Checkbox({ label, name, defaultChecked, hint }: { label: string; name: string; defaultChecked?: boolean; hint?: string }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 accent-amber-700" />
      <span>
        <span className="block text-sm font-medium text-slate-700">{label}</span>
        {hint && <span className="block text-xs text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

export function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Flash({ saved, error }: { saved?: string; error?: string }) {
  if (error)
    return <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (saved)
    return (
      <p className="mb-6 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {saved === "deleted" ? "Deleted." : "Saved successfully."}
      </p>
    );
  return null;
}

export function StatusBadge({ on, onLabel = "Published", offLabel = "Hidden" }: { on: boolean; onLabel?: string; offLabel?: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        on ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      {on ? onLabel : offLabel}
    </span>
  );
}

export function SeoFields({
  title,
  description,
  titleHint,
}: {
  title?: string | null;
  description?: string | null;
  titleHint?: string;
}) {
  return (
    <Card title="Search engine (SEO)" description="Optional. Leave blank to generate automatically from the content.">
      <Field label="SEO title" name="seoTitle" defaultValue={title} hint={titleHint ?? "Aim for 50–60 characters."} />
      <TextArea label="Meta description" name="seoDescription" defaultValue={description} rows={3} hint="Aim for 140–160 characters. Shown under your link in Google." />
    </Card>
  );
}
