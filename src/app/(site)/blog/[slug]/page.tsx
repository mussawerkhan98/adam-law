import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/icons";
import { PostCard } from "@/components/site/Cards";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/Sections";
import { getPost, getPosts, getSettings } from "@/lib/data";
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
  const [settings, post, recent] = await Promise.all([getSettings(), getPost(slug), getPosts(4)]);
  if (!post) notFound();

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
        <header className="hero-pattern text-white">
          <div className="container-x max-w-4xl py-16 md:py-24">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
              <Link href="/" className="hover:text-white">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/blog" className="hover:text-white">
                Insights
              </Link>
            </nav>
            <h1 className="font-serif text-4xl leading-tight md:text-5xl">{post.title}</h1>
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
              <span>By {author}</span>
              {post.publishedAt && (
                <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
              )}
              <span>{readingMinutes(post.body)} min read</span>
            </p>
          </div>
        </header>

        <div className="container-x max-w-3xl py-16 md:py-20">
          {post.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverUrl} alt="" className="mb-12 aspect-[16/9] w-full rounded-lg object-cover" />
          )}
          {post.excerpt && <p className="mb-10 font-serif text-xl leading-relaxed text-navy-800">{post.excerpt}</p>}
          <div className="content" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />

          <aside className="mt-14 rounded-lg border border-cream-200 bg-white p-8">
            <p className="font-serif text-xl text-navy-900">Need advice on your specific situation?</p>
            <p className="mt-2 text-muted">
              This article is general information, not legal advice. Contact us to discuss your circumstances.
            </p>
            <Link href="/contact" className="btn-gold mt-6">
              Contact {settings.firmName} <ArrowRightIcon width={18} height={18} />
            </Link>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-cream-200 bg-white py-20">
          <div className="container-x">
            <h2 className="font-serif text-3xl text-navy-900">More insights</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {more.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand settings={settings} />
    </>
  );
}
