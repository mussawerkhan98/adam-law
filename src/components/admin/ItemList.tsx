import Link from "next/link";
import { ConfirmButton, SubmitButton } from "./client";
import { StatusBadge } from "./ui";

export type Row = { id: number; title: string; subtitle?: string; published?: boolean; extra?: string };

/** Simple table of items with edit + delete, shared by all admin content lists. */
export function ItemList({
  rows,
  basePath,
  deleteAction,
  empty,
}: {
  rows: Row[];
  basePath: string;
  deleteAction: (f: FormData) => Promise<void>;
  empty: string;
}) {
  if (rows.length === 0)
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center text-sm text-slate-500">
        {empty}
      </div>
    );

  return (
    <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {rows.map((r) => (
        <li key={r.id} className="flex items-center gap-4 px-5 py-4">
          <div className="min-w-0 flex-1">
            <Link href={`${basePath}/${r.id}`} className="font-medium text-slate-900 hover:text-amber-700">
              {r.title}
            </Link>
            {r.subtitle && <p className="truncate text-sm text-slate-500">{r.subtitle}</p>}
          </div>
          {r.extra && <span className="hidden text-xs text-slate-400 sm:block">{r.extra}</span>}
          {r.published !== undefined && <StatusBadge on={r.published} />}
          <Link href={`${basePath}/${r.id}`} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Edit
          </Link>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={r.id} />
            <ConfirmButton />
          </form>
        </li>
      ))}
    </ul>
  );
}

export function FormFooter({ backHref }: { backHref: string }) {
  return (
    <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/95 px-4 py-4 backdrop-blur sm:mx-0 sm:px-0">
      <Link href={backHref} className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
        Cancel
      </Link>
      <SubmitButton />
    </div>
  );
}
