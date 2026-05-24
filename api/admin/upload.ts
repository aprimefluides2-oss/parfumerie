import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../_lib/auth";
import { uploadImage } from "../_lib/upload";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
  if (!requireAdmin(req, res)) return;
  try {
    const { filename, dataUrl } = req.body || {};
    if (!filename || !dataUrl) return res.status(400).json({ error: "filename et dataUrl requis." });
    const url = await uploadImage(filename, dataUrl);
    return res.json({ url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Upload impossible." });
  }
}
