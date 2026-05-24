import { Perfume, LayerNote } from "./types";

export const PERFUMES: Perfume[] = [
  {
    id: "gold",
    name: "L'Or Absolu",
    subtitle: "L'éclat d'une féminité souveraine et solaire",
    category: "Collection Féminine",
    gender: "Féminin",
    description: "Une création majestueuse qui rend hommage à la féminité sacrée. Un bouquet opulent de fleurs blanches et de sillage d'or liquide, couronné par l'élégance suprême du jasmin noble de Grasse.",
    extendedDescription: "Inspiré par les drapés de haute couture scintillants d'or, L'Or Absolu s'ouvre sur un souffle de bergamote dorée et de pêche charnue avant de révéler son cœur de jasmin Sambac impérial et de rose centifolia. Son sillage, dense et velouté, épouse la peau comme une étoffe précieuse tissée de vanille de Madagascar et de muscs vanillés chaleureux.",
    priceSizes: [
      { size: "50 ml", price: 125 },
      { size: "100 ml", price: 180 },
      { size: "250 ml", price: 340 }
    ],
    intensity: 4,
    longevity: "Absolue (12h+)",
    season: "Toutes saisons",
    topNotes: ["Bergamote dorée", "Amande amère", "Fleur de pêcher de Grasse"],
    heartNotes: ["Jasmin Sambac noble", "Rose Centifolia Royale", "Fleur d'oranger"],
    baseNotes: ["Ambre liquide", "Vanille de Madagascar", "Héliotrope chaleureux", "Santal de Mysore"],
    image: "/src/assets/images/perfume_gold_1779660881863.png",
    colorTheme: {
      bg: "bg-amber-500",
      text: "text-amber-900",
      accent: "#D4AF37",
      bgLight: "bg-[#FAF8F2]",
      border: "border-amber-200"
    },
    signatureNote: "Jasmin de Grasse & Or Liquide",
    quote: "Le parfum est l'indispensable complément de la personnalité féminine, c'est le morceau de robe qui s'en va dans l'air."
  },
  {
    id: "rose",
    name: "Éclat de Rose",
    subtitle: "La délicatesse fleurie d'un premier amour",
    category: "Collection Féminine",
    gender: "Féminin",
    description: "Un murmure printanier romantique et irrésistible. Un sillage ultra-délicat mêlant la fraîcheur de la pivoine sauvage au raffinement d'une rose sauvage satinée d'un élégant ruban de soie.",
    extendedDescription: "Né des souvenirs du jardin de Granville emblématique de Christian Dior, Éclat de Rose est une ode romantique moderne. L'insolence zestée de la mandarine verte italienne s'associe à la délicatesse sensuelle d'un cœur de pivoine fraîche et de rose de Damas, avant de se déposer dans le confort apaisant et chic d'un fond de muscs blancs vaporeux et de cèdre délicat.",
    priceSizes: [
      { size: "50 ml", price: 110 },
      { size: "100 ml", price: 165 },
      { size: "250 ml", price: 310 }
    ],
    intensity: 3,
    longevity: "Généreuse (8h+)",
    season: "Printemps / Été",
    topNotes: ["Mandarine verte d'Italie", "Zeste d'orange douce", "Baies de poivre rose"],
    heartNotes: ["Rose de mai sauvage", "Pivoine de Granville", "Iris de Florence"],
    baseNotes: ["Voile de Musc blanc", "Bois de Cèdre de l'Atlas", "Fève tonka fine"],
    image: "/src/assets/images/perfume_rose_1779660918617.png",
    colorTheme: {
      bg: "bg-rose-400",
      text: "text-rose-900",
      accent: "#E0A899",
      bgLight: "bg-[#FDFBF9]",
      border: "border-rose-100"
    },
    signatureNote: "Rose Sauvage & Pivoine fraîche",
    quote: "Le parfum d'une femme en dit plus sur elle que son écriture."
  },
  {
    id: "midnight",
    name: "Bleu Sauvage",
    subtitle: "L'instinct noble, sombre et indomptable",
    category: "Collection Masculine",
    gender: "Masculin",
    description: "Une fraîcheur radicale, brute et boisée. La rencontre de la majestueuse bergamote sauvage de Calabre et de l'ardeur noble d'un accord fumé d'ambre brut et de cuir précieux.",
    extendedDescription: "Inspiré des déserts mystiques à la tombée du jour, là où la fraîcheur de la nuit enveloppe la terre brûlante, Bleu Sauvage libère une masculinité noble et indomptable. L'ouverture est vive, dictée par la bergamote d'Italie poivrée par le Sichuan. Elle s'épanouit dans les notes aromatiques de lavande séchée pour finir dans l'intensité cuirée et fumée de l'ambre gris de rivage.",
    priceSizes: [
      { size: "50 ml", price: 115 },
      { size: "100 ml", price: 170 },
      { size: "250 ml", price: 320 }
    ],
    intensity: 5,
    longevity: "Absolue (12h+)",
    season: "Toutes saisons",
    topNotes: ["Bergamote de Calabre sauvage", "Poivre noir du Sichuan", "Écorce de pamplemousse"],
    heartNotes: ["Lavande de Haute-Provence", "Vétiver de Haïti fumé", "Patchouli d'Indonésie"],
    baseNotes: ["Ambre gris de rivage", "Ciste Labdanum sauvage", "Cuir de Russie", "Cèdre de Virginie"],
    image: "/src/assets/images/perfume_midnight_1779660900238.png",
    colorTheme: {
      bg: "bg-slate-700",
      text: "text-slate-900",
      accent: "#2C3E50",
      bgLight: "bg-[#F5F6F8]",
      border: "border-slate-300"
    },
    signatureNote: "Bergamote Calabre & Vétiver fumé",
    quote: "Le parfum est l'élégance ultime. C'est l'autographe invisible de l'homme sophistiqué."
  },
  {
    id: "amber",
    name: "Ambre d'Exception",
    subtitle: "Le sillage confidentiel d'une nuit d'Orient",
    category: "Collection Privée",
    gender: "Unisexe",
    description: "Une œuvre d'art confidentielle issue des alcôves privées de nos maîtres créateurs. Un accord divin mêlant l'encens noble d'Oman au faste boisé du oud sacré.",
    extendedDescription: "Ambre d'Exception est une fragrance mixte hautement singulière et charnelle. C'est le contraste saisissant entre la fraîcheur épicée du safran de Perse et la profondeur mystique de l'encens traditionnel. En son cœur repose le précieux Oud d'Assam fumé à la chaleur veloutée de la fève de vanille noire et du bois de gaïac, offrant un sillage à la résonance quasi mythologique.",
    priceSizes: [
      { size: "50 ml", price: 145 },
      { size: "100 ml", price: 230 },
      { size: "250 ml", price: 410 }
    ],
    intensity: 5,
    longevity: "Suprême (16h+)",
    season: "Automne / Hiver",
    topNotes: ["Safran de Perse sacré", "Cardamome verte", "Note de thé fumé Lapsang"],
    heartNotes: ["Encens sacré d'Oman", "Rose de Damas caramélisée", "Absolu Oud d'Assam"],
    baseNotes: ["Vanille noire cuirée", "Baume de Tolu doux", "Bois de Santal lacté", "Ambre sec"],
    image: "/src/assets/images/perfume_amber_1779660938970.png",
    colorTheme: {
      bg: "bg-[#8E5132]",
      text: "text-amber-950",
      accent: "#B85C2A",
      bgLight: "bg-[#FAF7F4]",
      border: "border-amber-900/10"
    },
    signatureNote: "Encens d'Oman & Bois de Oud",
    quote: "Créer un parfum est un acte d'amour et de mémoire. C'est sculpter du vent."
  }
];

export const LAYERING_NOTES: LayerNote[] = [
  { id: "note_rose", name: "Absolu de Rose", category: "cœur", description: "Un cœur charnel de pétales de rose de Damas veloutés.", intensity: 4 },
  { id: "note_jasmin", name: "Jasmin Impérial", category: "cœur", description: "Une nuance solaire, florale opulente d'un blanc crémeux.", intensity: 5 },
  { id: "note_bergamote", name: "Bergamote de Calabre", category: "tête", description: "Une envolée pétillante, zestée, fraîche de l'Italie du sud.", intensity: 3 },
  { id: "note_mandarine", name: "Mandarine Douce", category: "tête", description: "Une brise fruitée, vibrante, douce et addictive.", intensity: 2 },
  { id: "note_oud", name: "Bois de Oud Fumé", category: "fond", description: "Une profondeur sombre, boisée sacrée d'or noir d'Assam.", intensity: 5 },
  { id: "note_santal", name: "Santal crémeux", category: "fond", description: "Une texture lactée, boisée douce et souveraine.", intensity: 3 },
  { id: "note_vanille", name: "Gousse de Vanille Noire", category: "fond", description: "Une essence suave, cuirée et noble de Bourbon.", intensity: 4 },
  { id: "note_ambre", name: "Ambre Chaud", category: "fond", description: "Un souffle de résines dorées, sensuel et poudré.", intensity: 4 }
];
