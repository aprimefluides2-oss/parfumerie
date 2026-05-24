import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini SDK with telemetry headers and safety checks
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

// API Routes
app.post("/api/conseiller", async (req: Request, res: Response) => {
  const { messages, userProfile } = req.body;

  if (!ai) {
    // Elegant fallback simulation in case the API Key is not set up yet
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

    // Format chat history or prompt
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
    
    // Parse the matched perfume recommendation key
    let reply = fullText;
    let matchedPerfume = "gold"; // Default
    
    const recommendationMatch = fullText.match(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i);
    if (recommendationMatch) {
      matchedPerfume = recommendationMatch[1].toLowerCase();
      // Clean up the text to avoid revealing the raw meta-tag to the reader
      reply = fullText.replace(/RECOMMANDATION:\s*(gold|rose|midnight|amber)/i, "").trim();
    }

    res.json({ reply, matchedPerfume });
  } catch (error: any) {
    console.error("Gemini API Error in server.ts:", error);
    res.status(500).json({ error: "Une faille temporelle olfactive s'est produite lors de l'appel." });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on http://localhost:${PORT}`);
  });
}

startServer();
