export interface PriceSize {
  size: string; // e.g. "50 ml", "100 ml", "250 ml"
  price: number; // in Euros
}

export interface Perfume {
  id: string;
  name: string;
  subtitle: string;
  category: "Collection Féminine" | "Collection Masculine" | "Collection Privée";
  gender: "Féminin" | "Masculin" | "Unisexe";
  description: string;
  extendedDescription: string;
  priceSizes: PriceSize[];
  intensity: number; // 1 to 5 stars
  longevity: string; // e.g., "Généreuse (8h+)", "Absolue (12h+)", "Tendre (6h+)"
  season: string; // e.g., "Automne / Hiver", "Printemps / Été", "Toutes saisons"
  topNotes: string[];  // Notes de tête
  heartNotes: string[]; // Notes de cœur
  baseNotes: string[];  // Notes de fond
  image: string;       // Generative asset path
  colorTheme: {
    bg: string;
    text: string;
    accent: string;
    bgLight: string;
    border: string;
  };
  signatureNote: string;
  quote: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SearchFilters {
  searchQuery: string;
  category: string;
  intensity: number | null;
  gender: string;
}

export interface LayerNote {
  id: string;
  name: string;
  category: "tête" | "cœur" | "fond";
  description: string;
  intensity: number;
}
