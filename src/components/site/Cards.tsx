import Link from "next/link";
import { ArrowRightIcon, PlusIcon, ScaleLogo } from "@/components/icons";
import { formatDate, plainText, renderMarkdown } from "@/lib/utils";

export function FaqList({ faqs }: { faqs: { id: number; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-cream-200 border-y border-cream-200">
      {faqs.map((f) => (
        <details key={f.id} className="group py-5">
          <summary className="flex cursor-pointer items-start justify-between gap-6 text-left">
            <h3 className="font-serif text-lg text-navy-900">{f.question}</h3>
            <PlusIcon width={22} height={22} className="faq-icon mt-1 shrink-0 text-gold-500 transition-transform" />
          </summary>
          <div className="content mt-4 text-muted" dangerouslySetInnerHTML={{ __html: renderMarkdown(f.answer) }} />
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
    <article className="group flex flex-col overflow-hidden rounded-lg border border-cream-200 bg-white">
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden>
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverUrl} alt="" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="hero-pattern grid aspect-[16/9] place-items-center">
            <ScaleLogo width={48} height={48} className="text-gold-500/60" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-7">
        {post.publishedAt && (
          <time dateTime={post.publishedAt.toISOString()} className="text-xs font-semibold tracking-wider text-gold-600 uppercase">
            {formatDate(post.publishedAt)}
          </time>
        )}
        <h3 className="mt-3 font-serif text-xl leading-snug text-navy-900">
          <Link href={`/blog/${post.slug}`} className="hover:text-gold-600">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-muted">{post.excerpt || plainText(post.body, 150)}</p>
        <Link href={`/blog/${post.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-600">
          Read article <ArrowRightIcon width={16} height={16} />
        </Link>
      </div>
    </article>
  );
}
