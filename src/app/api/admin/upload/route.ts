import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/session";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (Vercel request limit is 4.5 MB)
const ALLOWED = new Map([
  ["image/jpeg", [0xff, 0xd8, 0xff]],
  ["image/png", [0x89, 0x50, 0x4e, 0x47]],
  ["image/webp", [0x52, 0x49, 0x46, 0x46]],
  ["image/gif", [0x47, 0x49, 0x46, 0x38]],
]);

export async function POST(req: Request) {
  // Middleware already checks this; verify again so the route is safe on its own.
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Image must be 4 MB or smaller." }, { status: 400 });

  const magic = ALLOWED.get(file.type);
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!magic || !magic.every((b, i) => bytes[i] === b)) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP or GIF images are allowed." }, { status: 400 });
  }

  const media = await db.media.create({
    data: { filename: file.name.slice(0, 190), mimeType: file.type, size: bytes.length, data: bytes },
    select: { id: true },
  });
  return NextResponse.json({ url: `/media/${media.id}` });
}
