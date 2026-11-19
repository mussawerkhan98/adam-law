import Link from "next/link";

export default function NotFound() {
  return (
    <main className="hero-pattern grid min-h-screen place-items-center px-6 text-center text-white">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-mark.png" alt="" width={211} height={160} className="mx-auto h-20 w-auto" />
        <p className="mt-6 text-sm tracking-[0.3em] text-gold-400 uppercase">Error 404</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">The page you are looking for may have moved or no longer exists.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-gold">
            Back to home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
