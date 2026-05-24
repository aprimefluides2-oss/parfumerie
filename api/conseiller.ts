import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }
  const { messages, userProfile } = req.body || {};

  if (!ai) {
    return res.json({
      reply:
        "Enchanté. Je suis l'Expert Olfactif de la Maison Élixir. Pour vous guider au mieux vers votre signature olfactive idéale, j'ai besoin que nous partagions un moment de poésie. (Note de service : Veuillez configurer votre clé GEMINI_API_KEY dans les secrets pour activer la vraie puissance olfactive de notre IA !) \n\nBasé sur votre sélection, je pressens que 'L'Or Absolu' ou 'Ambre d'Exception' saura caresser votre peau de sa poésie intemporelle.",
      matchedPerfume: "gold",
    });
  }

  try {
    const systemPrompt = `Vous êtes l'Expert Olfactif Distingué de la Maison Élixir de Paris, une prestigieuse maison de Haute Parfumerie incarnant l'insaisissable élégance de la haute couture française, directement inspirée de la vision noble de Christian Dior.

Votre ton doit être absolument impeccable, raffiné, éminemment courtois, poétique et passionné par l'art des nards et essences. Vous utilisez impérativement le vouvoiement et des expressions dignes des salons parisiens de l'avenue Montaigne.

La Maison dispose de quatre fragrances exclusives :
1. 'L'Or Absolu' (Clé: "gold") - Solaire, Majestueux, Floral Opulent.
2. 'Éclat de Rose' (Clé: "rose") - Romantique, Tendre, Pétillant.
3. 'Bleu Sauvage' (Clé: "midnight") - Sombre, Intense, Indomptable.
4. 'Ambre d'Exception' (Clé: "amber") - Rare, Envoûtant, Sacré (Collection Privée).

Analysez attentivement l'historique de discussion et les critères de l'utilisateur (ses couleurs préférées, son humeur, ses notes fétiches ou son style vestimentaire s'ils sont fournis : ${JSON.stringify(userProfile)}).

Formulez une réponse poétique d'environ 3 à 4 phrases en français de très haut niveau.
À la toute fin, sur une NOUVELLE ligne, ajoutez EXACTEMENT :
RECOMMANDATION: <clé>
(clé strictement parmi 'gold', 'rose', 'midnight', 'amber')`;

    const formattedContents = (messages || []).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: { systemInstruction: systemPrompt, temperature: 0.7 },
    });

    const fullText = response.text || "";
    let reply = fullText;
    let matchedPerfume = "gold";
    const m = fullText.match(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i);
    if (m) {
      matchedPerfume = m[1].toLowerCase();
      reply = fullText.replace(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i, "").trim();
    }
    res.json({ reply, matchedPerfume });
  } catch (err: any) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Une faille temporelle olfactive s'est produite lors de l'appel." });
  }
}
