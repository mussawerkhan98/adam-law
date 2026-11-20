import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/icons";
import { PostCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand, Ornament, SectionHeading } from "@/components/site/Sections";
import { getContent, getPost, getPosts, getSettings } from "@/lib/data";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate, plainText, readingMinutes, renderMarkdown, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [settings, post] = await Promise.all([getSettings(), getPost(slug)]);
  if (!post) return {};
  return pageMetadata({
    settings,
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || plainText(post.body),
    path: `/blog/${post.slug}`,
    image: post.coverUrl || undefined,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [settings, content, post, recent] = await Promise.all([getSettings(), getContent(), getPost(slug), getPosts(4)]);
  if (!post) notFound();
  const t = content["blog.post"];

  const path = `/blog/${post.slug}`;
  const author = post.author || settings.firmName;
  const more = recent.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/blog" },
            { name: post.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.seoDescription || post.excerpt || plainText(post.body),
            mainEntityOfPage: absoluteUrl(path),
            ...(post.coverUrl ? { image: absoluteUrl(post.coverUrl) } : {}),
            datePublished: post.publishedAt?.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            author: { "@type": post.author ? "Person" : "Organization", name: author },
            publisher: { "@id": `${siteUrl()}/#organization` },
          },
        ]}
      />

      <article>
        <header className="hero-pattern overflow-hidden text-white">
          <div className="container-x relative max-w-4xl py-20 text-center md:py-28">
            <nav aria-label="Breadcrumb" className="mb-8 text-[0.8rem] tracking-[0.08em] text-white/55 uppercase">
              <ol className="flex flex-wrap items-center justify-center gap-2.5">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="h-1.5 w-1.5 rotate-45 bg-gold-500/70" />
                <li>
                  <Link href="/blog" className="text-gold-300 transition hover:text-white">
                    Insights
                  </Link>
                </li>
              </ol>
            </nav>
            <h1 className="animate-fade-up font-serif text-[2.6rem] leading-[1.08] font-semibold md:text-[3.75rem]">{post.title}</h1>
            <Ornament className="mx-auto mt-8" width="w-48" />
            <p className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/65">
              <span>
                By <span className="text-white">{author}</span>
              </span>
              {post.publishedAt && (
                <>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-gold-500" />
                  <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
                </>
              )}
              <span aria-hidden className="h-1 w-1 rounded-full bg-gold-500" />
              <span>{readingMinutes(post.body)} min read</span>
            </p>
          </div>
          <div className="gold-hairline" />
        </header>

        <div className="container-x max-w-3xl py-16 md:py-24">
          {post.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverUrl}
              alt=""
              className="relative z-10 mb-14 aspect-[16/9] w-full rounded-xl object-cover shadow-2xl shadow-navy-900/15"
            />
          )}
          {post.excerpt && (
            <p className="mb-12 border-l-2 border-gold-500 pl-6 font-serif text-2xl leading-relaxed text-navy-800 italic">
              {post.excerpt}
            </p>
          )}
          <div className="content text-[1.1rem]" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

          <aside className="hero-pattern mt-16 overflow-hidden rounded-xl p-8 text-white md:p-10">
            {t.adviceTitle && <p className="font-serif text-[1.75rem] leading-tight font-semibold">{t.adviceTitle}</p>}
            {t.adviceText && <p className="mt-3 text-white/70">{t.adviceText}</p>}
            <Link href="/contact" className="btn-gold mt-7">
              {t.adviceButton} <ArrowRightIcon width={16} height={16} />
            </Link>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section paper border-t border-cream-200">
          <div className="container-x">
            <SectionHeading eyebrow={t.moreEyebrow} title={t.moreTitle} />
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand settings={settings} content={content} />
    </>
  );
}
