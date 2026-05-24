import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const PERFUMES_FILE = path.join(DATA_DIR, "perfumes.json");
const LAYERING_FILE = path.join(DATA_DIR, "layering.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

app.use(express.json({ limit: "10mb" }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY is not defined. The AI advisor helper will run in evaluation simulation mode.");
}

// ------------------------------------------------------------------
// Admin auth middleware
// ------------------------------------------------------------------
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const provided = req.header("X-Admin-Password");
  if (!provided || provided !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Mot de passe administrateur invalide." });
  }
  next();
}

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw) as T;
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

// ------------------------------------------------------------------
// Admin login
// ------------------------------------------------------------------
app.post("/api/admin/login", (req: Request, res: Response) => {
  const { password } = req.body || {};
  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: "Mot de passe incorrect." });
});

// ------------------------------------------------------------------
// Perfumes CRUD
// ------------------------------------------------------------------
app.get("/api/perfumes", async (_req: Request, res: Response) => {
  try {
    const perfumes = await readJson<unknown[]>(PERFUMES_FILE);
    res.json(perfumes);
  } catch (err) {
    console.error("Failed to read perfumes:", err);
    res.status(500).json({ error: "Impossible de charger les parfums." });
  }
});

app.post("/api/perfumes", requireAdmin, async (req: Request, res: Response) => {
  try {
    const newPerfume = req.body;
    if (!newPerfume?.id || !newPerfume?.name) {
      return res.status(400).json({ error: "Le parfum doit contenir au moins un id et un nom." });
    }
    const perfumes = await readJson<any[]>(PERFUMES_FILE);
    if (perfumes.some(p => p.id === newPerfume.id)) {
      return res.status(409).json({ error: `Un parfum avec l'id "${newPerfume.id}" existe déjà.` });
    }
    perfumes.push(newPerfume);
    await writeJson(PERFUMES_FILE, perfumes);
    res.status(201).json(newPerfume);
  } catch (err) {
    console.error("Failed to create perfume:", err);
    res.status(500).json({ error: "Création impossible." });
  }
});

app.put("/api/perfumes/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const perfumes = await readJson<any[]>(PERFUMES_FILE);
    const idx = perfumes.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: "Parfum introuvable." });
    perfumes[idx] = { ...perfumes[idx], ...updated, id };
    await writeJson(PERFUMES_FILE, perfumes);
    res.json(perfumes[idx]);
  } catch (err) {
    console.error("Failed to update perfume:", err);
    res.status(500).json({ error: "Mise à jour impossible." });
  }
});

app.delete("/api/perfumes/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const perfumes = await readJson<any[]>(PERFUMES_FILE);
    const next = perfumes.filter(p => p.id !== id);
    if (next.length === perfumes.length) return res.status(404).json({ error: "Parfum introuvable." });
    await writeJson(PERFUMES_FILE, next);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete perfume:", err);
    res.status(500).json({ error: "Suppression impossible." });
  }
});

// ------------------------------------------------------------------
// Layering notes CRUD
// ------------------------------------------------------------------
app.get("/api/layering", async (_req: Request, res: Response) => {
  try {
    const notes = await readJson<unknown[]>(LAYERING_FILE);
    res.json(notes);
  } catch (err) {
    console.error("Failed to read layering:", err);
    res.status(500).json({ error: "Impossible de charger les notes." });
  }
});

app.post("/api/layering", requireAdmin, async (req: Request, res: Response) => {
  try {
    const note = req.body;
    if (!note?.id || !note?.name) return res.status(400).json({ error: "id et nom requis." });
    const notes = await readJson<any[]>(LAYERING_FILE);
    if (notes.some(n => n.id === note.id)) {
      return res.status(409).json({ error: `Une note avec l'id "${note.id}" existe déjà.` });
    }
    notes.push(note);
    await writeJson(LAYERING_FILE, notes);
    res.status(201).json(note);
  } catch (err) {
    console.error("Failed to create note:", err);
    res.status(500).json({ error: "Création impossible." });
  }
});

app.put("/api/layering/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = req.body;
    const notes = await readJson<any[]>(LAYERING_FILE);
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return res.status(404).json({ error: "Note introuvable." });
    notes[idx] = { ...notes[idx], ...updated, id };
    await writeJson(LAYERING_FILE, notes);
    res.json(notes[idx]);
  } catch (err) {
    console.error("Failed to update note:", err);
    res.status(500).json({ error: "Mise à jour impossible." });
  }
});

app.delete("/api/layering/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notes = await readJson<any[]>(LAYERING_FILE);
    const next = notes.filter(n => n.id !== id);
    if (next.length === notes.length) return res.status(404).json({ error: "Note introuvable." });
    await writeJson(LAYERING_FILE, next);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete note:", err);
    res.status(500).json({ error: "Suppression impossible." });
  }
});

// ------------------------------------------------------------------
// Image upload (base64 JSON payload, no multipart needed)
// ------------------------------------------------------------------
app.post("/api/admin/upload", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename, dataUrl } = req.body || {};
    if (!filename || !dataUrl) return res.status(400).json({ error: "filename et dataUrl requis." });

    const match = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/.exec(dataUrl);
    if (!match) return res.status(400).json({ error: "Format d'image invalide (PNG/JPG/WEBP/GIF en base64 attendu)." });

    const ext = match[2].replace("jpeg", "jpg");
    const safeBase = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/\.[^.]+$/, "");
    const finalName = `${safeBase}_${Date.now()}.${ext}`;

    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOADS_DIR, finalName), Buffer.from(match[3], "base64"));

    res.json({ url: `/uploads/${finalName}` });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload impossible." });
  }
});

// ------------------------------------------------------------------
// AI Olfactory advisor
// ------------------------------------------------------------------
app.post("/api/conseiller", async (req: Request, res: Response) => {
  const { messages, userProfile } = req.body;

  if (!ai) {
    return res.json({
      reply: "Enchanté. Je suis l'Expert Olfactif de la Maison Élixir. Pour vous guider au mieux vers votre signature olfactive idéale, j'ai besoin que nous partagions un moment de poésie. (Note de service : Veuillez configurer votre clé GEMINI_API_KEY dans les secrets pour activer la vraie puissance olfactive de notre IA !) \n\nBasé sur votre sélection, je pressens que 'L'Or Absolu' ou 'Ambre d'Exception' saura caresser votre peau de sa poésie intemporelle.",
      matchedPerfume: "gold"
    });
  }

  try {
    const systemPrompt = `Vous êtes l'Expert Olfactif Distingué de la Maison Élixir de Paris, une prestigieuse maison de Haute Parfumerie incarnant l'insaisissable élégance de la haute couture française, directement inspirée de la vision noble de Christian Dior.

Votre ton doit être absolument impeccable, raffiné, éminemment courtois, poétique et passionné par l'art des nards et essences. Vous utilisez impérativement le vouvoiement et des expressions dignes des salons parisiens de l'avenue Montaigne.

La Maison dispose de quatre fragrances exclusives :
1. 'L'Or Absolu' (Clé: "gold") - Solaire, Majestueux, Floral Opulent. Notes royales de Jasmin de Grasse, Rose de Mai, essence d'Ylang-Ylang et éclats d'Ambre chaud. Pour des personnes recherchant une présence magnétique, digne et royale.
2. 'Éclat de Rose' (Clé: "rose") - Romantique, Tendre, Pétillant. Notes charmantes de Pivoine fraîche, Rose sauvage fraîchement coupée, Bergamote zestée et voile de Musc blanc. Pour une âme poétique, amoureuse de la légèreté des fleurs printanières.
3. 'Bleu Sauvage' (Clé: "midnight") - Sombre, Intense, Indomptable. Bergamote sauvage de Calabre, Poivre fougueux du Sichuan, Vétiver fumé et Ambre gris brut de rivage. Pour les esprits mystérieux, libres et connectés aux forces de la nature pure.
4. 'Ambre d'Exception' (Clé: "amber") - Rare, Envoûtant, Sacré (Collection Privée). Encens d'Oman, Bois de Oud fumé, patchouli terrestre et Vanille noire cuirée. Pour les connaisseurs de parfums d'auteurs, mixte et mystique, chaleureux et impérial.

Analysez attentivement l'historique de discussion et les critères de l'utilisateur (ses couleurs préférées, son humeur, ses notes fétiches ou son style vestimentaire s'ils sont fournis : ${JSON.stringify(userProfile)}).

Formulez une réponse poétique d'environ 3 à 4 phrases en français de très haut niveau, décrivant comment vous imaginez la symphonie olfactive parfaite pour la personne.
À la toute fin de votre réponse, sur une NOUVELLE ligne, vous devez ajouter EXACTEMENT ce marqueur spécial suivi de la clé du parfum le plus recommandé (choisie strictement parmi 'gold', 'rose', 'midnight', 'amber') :
RECOMMANDATION: <clé>

Exemple de fin :
[...] Que votre sillage proclame votre noblesse singulière.
RECOMMANDATION: gold`;

    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const fullText = response.text || "";

    let reply = fullText;
    let matchedPerfume = "gold";

    const recommendationMatch = fullText.match(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i);
    if (recommendationMatch) {
      matchedPerfume = recommendationMatch[1].toLowerCase();
      reply = fullText.replace(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i, "").trim();
    }

    res.json({ reply, matchedPerfume });
  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    res.status(500).json({ error: "Une faille temporelle olfactive s'est produite lors de l'appel." });
  }
});

// ------------------------------------------------------------------
// Vite & Static Asset Handling
// ------------------------------------------------------------------
async function startServer() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  if (process.env.NODE_ENV !== "production") {
    // Rewrite /admin -> /admin.html before Vite sees the request
    app.use((req, _res, next) => {
      if (req.url === "/admin" || req.url === "/admin/") req.url = "/admin.html";
      next();
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("/admin", (_req, res) => {
      res.sendFile(path.join(distPath, "admin.html"));
    });
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on http://localhost:${PORT}`);
    console.log(`Admin back-office: http://localhost:${PORT}/admin`);
  });
}

startServer();
