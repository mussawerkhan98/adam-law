import { db } from "@/lib/db";

// Serves uploaded images stored in the database. Images are immutable (new upload = new id),
// so they can be cached aggressively by browsers and CDNs.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": String(media.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
