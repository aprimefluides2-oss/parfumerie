import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const isVercel = !!process.env.VERCEL;
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function uploadImage(filename: string, dataUrl: string): Promise<string> {
  const match = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error("Format d'image invalide (PNG/JPG/WEBP/GIF en base64 attendu).");

  const ext = match[2].replace("jpeg", "jpg");
  const safeBase = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "");
  const finalName = `${safeBase}_${Date.now()}.${ext}`;
  const buffer = Buffer.from(match[3], "base64");

  if (isVercel) {
    if (!hasBlob) {
      throw new Error(
        "Vercel Blob n'est pas configuré. Active 'Blob' dans Storage sur le dashboard Vercel."
      );
    }
    const blob = await put(`perfumes/${finalName}`, buffer, {
      access: "public",
      contentType: match[1],
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, finalName), buffer);
  return `/uploads/${finalName}`;
}
