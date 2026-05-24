import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getLayering, setLayering, assertStorageReady } from "../_lib/storage";
import { requireAdmin } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      assertStorageReady();
      const data = await getLayering();
      return res.json(data);
    }

    if (req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      assertStorageReady();
      const body = req.body;
      if (!body?.id || !body?.name) {
        return res.status(400).json({ error: "id et nom requis." });
      }
      const data = await getLayering();
      if (data.some((n: any) => n.id === body.id)) {
        return res.status(409).json({ error: `Une note avec l'id "${body.id}" existe déjà.` });
      }
      data.push(body);
      await setLayering(data);
      return res.status(201).json(body);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Erreur serveur." });
  }
}
