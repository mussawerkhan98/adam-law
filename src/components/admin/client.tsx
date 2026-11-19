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
}: {
  children?: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      type="submit"
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
