import Link from "next/link";
import { ArrowRightIcon, PlusIcon } from "@/components/icons";
import { formatDate, plainText, renderMarkdown } from "@/lib/utils";

export function FaqList({ faqs }: { faqs: { id: number; question: string; answer: string }[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <details
          key={f.id}
          className="group card overflow-hidden open:border-gold-500/40 open:shadow-[0_20px_40px_-28px_rgb(10_22_40/0.35)]"
          open={i === 0}
        >
          <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left md:px-7">
            <h3 className="font-serif text-xl leading-snug font-semibold text-navy-900 transition group-hover:text-gold-700">
              {f.question}
            </h3>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-500/40 text-gold-600 transition duration-300 group-open:rotate-45 group-open:border-gold-500 group-open:bg-gold-500 group-open:text-navy-950">
              <PlusIcon width={18} height={18} />
            </span>
          </summary>
          <div className="border-t border-cream-200 px-6 pt-4 pb-6 md:px-7">
            <div className="content text-[1rem] text-muted" dangerouslySetInnerHTML={{ __html: renderMarkdown(f.answer) }} />
          </div>
        </details>
      ))}
    </div>
  );
}

export function PostCard({
  post,
}: {
  post: { slug: string; title: string; excerpt: string | null; body: string | null; coverUrl: string; publishedAt: Date | null };
}) {
  return (
    <article className="group card card-hover reveal flex flex-col">
      <Link href={`/blog/${post.slug}`} className="relative block" tabIndex={-1} aria-hidden>
        <div className="overflow-hidden rounded-t-[0.7rem]">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt=""
            className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="hero-pattern grid aspect-[16/10] place-items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-mark.png"
              alt=""
              width={211}
              height={160}
              loading="lazy"
              className="w-28 opacity-80 transition duration-700 group-hover:scale-110 group-hover:opacity-100"
            />
          </div>
        )}
        </div>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="absolute bottom-0 left-6 translate-y-1/2 rounded-sm bg-gradient-to-r from-gold-300 to-gold-500 px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.12em] text-navy-950 uppercase shadow-md"
          >
            {formatDate(post.publishedAt)}
          </time>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-7 pt-9">
        <h3 className="font-serif text-2xl leading-snug font-semibold text-navy-900">
          <Link href={`/blog/${post.slug}`} className="transition hover:text-gold-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{post.excerpt || plainText(post.body, 150)}</p>
        <Link href={`/blog/${post.slug}`} className="link-arrow mt-6">
          Read article <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>
    </article>
  );
}
