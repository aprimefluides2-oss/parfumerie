import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getLayering, setLayering, assertStorageReady } from "../../lib/storage";
import { requireAdmin } from "../../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;
    if (typeof id !== "string") return res.status(400).json({ error: "id manquant." });

    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      assertStorageReady();
      const data = await getLayering();
      const idx = data.findIndex((n: any) => n.id === id);
      if (idx === -1) return res.status(404).json({ error: "Note introuvable." });
      data[idx] = { ...data[idx], ...req.body, id };
      await setLayering(data);
      return res.json(data[idx]);
    }

    if (req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      assertStorageReady();
      const data = await getLayering();
      const next = data.filter((n: any) => n.id !== id);
      if (next.length === data.length) return res.status(404).json({ error: "Note introuvable." });
      await setLayering(next);
      return res.json({ ok: true });
    }

    res.setHeader("Allow", "PUT, DELETE");
    return res.status(405).json({ error: "Méthode non autorisée." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur." });
  }
}
