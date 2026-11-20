"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { inputCls } from "./ui";

export function SubmitButton({ children = "Save changes" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 disabled:opacity-60"
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

/** Submit button that asks for confirmation first (used for deletes). */
export function ConfirmButton({
  children = "Delete",
  message = "Delete this item? This cannot be undone.",
  className,
  ...rest
}: {
  children?: React.ReactNode;
  message?: string;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className" | "type" | "onClick">) {
  return (
    <button
      type="submit"
      {...rest}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className ?? "text-sm font-medium text-red-600 hover:text-red-800"}
    >
      {children}
    </button>
  );
}

/** Uploads an image to /api/admin/upload and stores the resulting URL in a hidden input. */
export function ImageField({ label, name, defaultValue, hint }: { label: string; name: string; defaultValue?: string; hint?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setUrl(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-slate-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              {busy ? "Uploading…" : url ? "Replace image" : "Upload image"}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={busy}
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            )}
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className={inputCls}
            aria-label={`${label} URL`}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

type ListItemField = { key: string; label: string; type: "text" | "textarea" | "icon" };

/**
 * Editable list of items (e.g. "How we work" steps). Inputs are named `${name}.${index}.${field}`
 * plus `${name}.count`, which the savePageContent action reads back in order.
 * With `fixedLabels` the number of items is fixed (no add/remove), e.g. menu links to set pages.
 */
export function ListField({
  name,
  label,
  fields,
  initial,
  max = 20,
  fixedLabels,
  icons,
}: {
  name: string;
  label: string;
  fields: ListItemField[];
  initial: Record<string, string>[];
  max?: number;
  fixedLabels?: string[];
  icons: string[];
}) {
  const nextId = useRef(initial.length);
  const [rows, setRows] = useState(() => initial.map((values, id) => ({ id, values })));
  const fixed = Boolean(fixedLabels);

  const move = (i: number, by: number) =>
    setRows((r) => {
      const j = i + by;
      if (j < 0 || j >= r.length) return r;
      const copy = [...r];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const remove = (i: number) => setRows((r) => r.filter((_, k) => k !== i));
  const add = () =>
    setRows((r) => [...r, { id: nextId.current++, values: Object.fromEntries(fields.map((f) => [f.key, f.type === "icon" ? "scale" : ""])) }]);

  const btn = "rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40";

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-slate-700">{label}</legend>
      <input type="hidden" name={`${name}.count`} value={rows.length} />
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-md border border-slate-200 bg-slate-50/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                {fixedLabels?.[i] ?? `Item ${i + 1}`}
              </span>
              {!fixed && (
                <span className="flex gap-1.5">
                  <button type="button" className={btn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                    ↑
                  </button>
                  <button type="button" className={btn} onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label="Move down">
                    ↓
                  </button>
                  <button type="button" className={`${btn} text-red-600`} onClick={() => remove(i)}>
                    Remove
                  </button>
                </span>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
              {fields.map((f) => {
                const fieldName = `${name}.${i}.${f.key}`;
                const value = row.values[f.key] ?? "";
                return (
                  <label key={f.key} className={`block ${f.type === "textarea" ? "md:col-span-full" : ""}`}>
                    <span className="mb-1 block text-xs font-medium text-slate-600">{f.label}</span>
                    {f.type === "icon" ? (
                      <select name={fieldName} defaultValue={value || "scale"} className={inputCls}>
                        {icons.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "textarea" ? (
                      <textarea name={fieldName} defaultValue={value} rows={2} className={inputCls} />
                    ) : (
                      <input name={fieldName} defaultValue={value} className={inputCls} />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-slate-500">No items — this part is hidden on the website.</p>}
      </div>
      {!fixed && rows.length < max && (
        <button type="button" onClick={add} className="mt-3 rounded-md border border-dashed border-slate-400 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-white">
          + Add item
        </button>
      )}
    </fieldset>
  );
}
