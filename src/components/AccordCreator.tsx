import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePerfumes } from "../PerfumesContext";
import { LayerNote } from "../types";
import { 
  Sparkles, 
  Trash2, 
  Droplets, 
  Award, 
  Heart, 
  Check, 
  ChevronRight,
  Info,
  Clock,
  Plus
} from "lucide-react";

interface SavedFormula {
  id: string;
  name: string;
  notes: LayerNote[];
  family: string;
  intensity: number;
  timestamp: Date;
}

export default function AccordCreator() {
  const { layering: LAYERING_NOTES } = usePerfumes();
  const [selectedNotes, setSelectedNotes] = useState<LayerNote[]>([]);
  const [savedFormulas, setSavedFormulas] = useState<SavedFormula[]>([]);
  const [customName, setCustomName] = useState("");
  const [isOrdered, setIsOrdered] = useState(false);

  const toggleNote = (note: LayerNote) => {
    // If already selected, remove it
    if (selectedNotes.some(n => n.id === note.id)) {
      setSelectedNotes(selectedNotes.filter(n => n.id !== note.id));
      return;
    }

    // Maximum 3 notes can be layered
    if (selectedNotes.length >= 3) {
      alert("Votre flacon d'accord ne peut contenir plus de 3 essences premières afin de préserver l'harmonie du sillage.");
      return;
    }

    // Don't allow multiple notes of the same category to keep it simplified or allow it? Let's allow but recommend balance
    setSelectedNotes([...selectedNotes, note]);
  };

  const handleClearFlask = () => {
    setSelectedNotes([]);
    setCustomName("");
  };

  // Calculate Olfactory Family Name on-the-fly
  const getOlfactoryFamily = (): string => {
    if (selectedNotes.length === 0) return "En attente d'essences...";
    const categories = selectedNotes.map(n => n.id);

    const hasOud = categories.includes("note_oud");
    const hasRose = categories.includes("note_rose");
    const hasJasmin = categories.includes("note_jasmin");
    const hasAmbre = categories.includes("note_ambre");
    const hasBergamote = categories.includes("note_bergamote") || categories.includes("note_mandarine");
    const hasSantal = categories.includes("note_santal") || categories.includes("note_vanille");

    if (hasOud && hasRose) return "Floral Sombre d'Assam";
    if (hasOud && hasAmbre) return "Oriental Boisé Sacré";
    if (hasRose && hasJasmin) return "Bouquet de Fleurs Royales";
    if (hasBergamote && (hasRose || hasJasmin)) return "Floral Frais Hespéridé";
    if (hasAmbre && hasSantal) return "Ambré Boisé Chaleureux";
    if (hasBergamote && hasOud) return "Boisé Frais Contrasté";
    if (hasSantal && hasJasmin) return "Santal Solaire Lacté";

    // Fallbacks
    if (selectedNotes.some(n => n.category === "fond") && selectedNotes. some(n => n.category === "cœur")) {
      return "Sublime Accord de Grasse";
    }
    return "Nectar d'Exception";
  };

  const getIntensityValue = (): number => {
    if (selectedNotes.length === 0) return 0;
    const total = selectedNotes.reduce((sum, n) => sum + n.intensity, 0);
    return Math.round(total / selectedNotes.length);
  };

  // Generate a poetic name on-the-fly
  const generatePoeticName = (): string => {
    if (selectedNotes.length === 0) return "Mon Élixir Singulier";
    const mainNote = selectedNotes[0].name.replace("Absolu de ", "").replace("Bois de ", "").replace("Gousse de ", "");
    const secondNote = selectedNotes[1] ? selectedNotes[1].name.replace("Absolu de ", "").replace("Bois de ", "").replace("Gousse de ", "") : "";
    const thirdNote = selectedNotes[2] ? selectedNotes[2].name.replace("Absolu de ", "").replace("Bois de ", "").replace("Gousse de ", "") : "";

    if (secondNote && thirdNote) {
      return `Nectar de ${mainNote}, ${secondNote} et ${thirdNote}`;
    } else if (secondNote) {
      return `Brise de ${mainNote} & ${secondNote}`;
    }
    return `L'Absolu de ${mainNote}`;
  };

  const handleSaveFormula = () => {
    if (selectedNotes.length === 0) return;
    const nameToSave = customName.trim() || generatePoeticName();
    
    const newFormula: SavedFormula = {
      id: `formula-${Date.now()}`,
      name: nameToSave,
      notes: [...selectedNotes],
      family: getOlfactoryFamily(),
      intensity: getIntensityValue(),
      timestamp: new Date()
    };

    setSavedFormulas([newFormula, ...savedFormulas]);
    setSelectedNotes([]);
    setCustomName("");
  };

  const handleDeleteFormula = (id: string) => {
    setSavedFormulas(savedFormulas.filter(f => f.id !== id));
  };

  // Note CSS coloring in simulation
  const getNoteColor = (id: string): string => {
    switch (id) {
      case "note_rose": return "bg-rose-400";
      case "note_jasmin": return "bg-amber-100";
      case "note_bergamote": return "bg-lime-400";
      case "note_mandarine": return "bg-orange-400";
      case "note_oud": return "bg-stone-800";
      case "note_santal": return "bg-amber-200";
      case "note_vanille": return "bg-amber-600";
      case "note_ambre": return "bg-yellow-700";
      default: return "bg-stone-300";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Intro section */}
      <div className="text-center mb-10">
        <h3 className="font-cinzel text-[11px] tracking-[0.35em] text-[#b8860b] uppercase mb-2 font-semibold">Atelier de Granville</h3>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-light tracking-widest text-[#e5e5e5] uppercase mb-4">
          L'Organiste des Parfums Personnels
        </h2>
        <p className="text-[#a1a1a1] font-serif text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto italic">
          "Devenez le Maître Parfumeur de votre propre sillage. Superposez de 1 à 3 essences pures pour concevoir un flacon couture entièrement sur-mesure."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* LEFT PANEL: Selecting raw notes grouped by level */}
        <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
          <div>
            <h4 className="font-cinzel text-xs tracking-[0.2em] uppercase text-white font-bold border-b border-white/5 pb-3 mb-6">
              Les Essences Nobles Disponibles
            </h4>

            {/* Top Notes */}
            <div className="mb-6">
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#b8860b] block mb-3 font-sans">
                Notes de Tête · Frais & Volatiles
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAYERING_NOTES.filter(n => n.category === "tête").map(note => {
                  const isSelected = selectedNotes.some(sn => sn.id === note.id);
                  return (
                    <button
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`p-3 border text-left rounded-none transition-all focus:outline-none flex items-center justify-between group cursor-pointer ${
                        isSelected 
                          ? "border-[#b8860b] bg-[#b8860b]/15 text-white" 
                          : "border-white/5 hover:border-white/15 bg-black hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <h5 className="text-[11px] font-sans font-semibold tracking-wider text-stone-100">{note.name}</h5>
                        <p className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{note.description}</p>
                      </div>
                      <span className={`p-1 ${isSelected ? 'text-[#b8860b]' : 'text-stone-600 group-hover:text-stone-400'}`}>
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Heart Notes */}
            <div className="mb-6">
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#b8860b] block mb-3 font-sans">
                Notes de Cœur · Personnalité de la Fleur
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAYERING_NOTES.filter(n => n.category === "cœur").map(note => {
                  const isSelected = selectedNotes.some(sn => sn.id === note.id);
                  return (
                    <button
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`p-3 border text-left rounded-none transition-all focus:outline-none flex items-center justify-between group cursor-pointer ${
                        isSelected 
                          ? "border-[#b8860b] bg-[#b8860b]/15 text-white" 
                          : "border-white/5 hover:border-white/15 bg-black hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <h5 className="text-[11px] font-sans font-semibold tracking-wider text-stone-100">{note.name}</h5>
                        <p className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{note.description}</p>
                      </div>
                      <span className={`p-1 ${isSelected ? 'text-[#b8860b]' : 'text-stone-600 group-hover:text-stone-400'}`}>
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Base Notes */}
            <div className="mb-6">
              <span className="text-[9px] tracking-widest uppercase font-bold text-[#b8860b] block mb-3 font-sans">
                Notes de Fond · Sillage et Longévité
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAYERING_NOTES.filter(n => n.category === "fond").map(note => {
                  const isSelected = selectedNotes.some(sn => sn.id === note.id);
                  return (
                    <button
                      key={note.id}
                      onClick={() => toggleNote(note)}
                      className={`p-3 border text-left rounded-none transition-all focus:outline-none flex items-center justify-between group cursor-pointer ${
                        isSelected 
                          ? "border-[#b8860b] bg-[#b8860b]/15 text-white" 
                          : "border-white/5 hover:border-white/15 bg-black hover:bg-white/5"
                      }`}
                    >
                      <div>
                        <h5 className="text-[11px] font-sans font-semibold tracking-wider text-stone-100">{note.name}</h5>
                        <p className={`text-[9px] mt-0.5 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>{note.description}</p>
                      </div>
                      <span className={`p-1 ${isSelected ? 'text-[#b8860b]' : 'text-stone-600 group-hover:text-stone-400'}`}>
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6">
            <p className="text-[10px] text-stone-500 font-sans leading-relaxed">
              * Note des créateurs : Une structure idéale intègre généralement une note de tête pour l'envolée, une note de cœur pour le coffre, et une note de fond pour le sillage pérenne.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Simulated animated crystal bottle mixing colors and results */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl flex-1">
            <div className="w-full text-center mb-4">
              <span className="text-[8px] tracking-[0.3em] text-[#b8860b] font-bold uppercase block mb-1">Flaconnage Maître</span>
              <h4 className="font-cinzel text-sm tracking-widest text-[#e5e5e5] uppercase">L'Éprouvette d'Atelier</h4>
            </div>

            {/* ART ANIMATED PERFUME BOTTLE MIX */}
            <div className="relative w-44 h-64 border-4 border-[#b8860b]/30 rounded-2xl bg-black px-1 py-1 sm:my-3 shadow-2xl flex flex-col justify-end overflow-hidden">
              {/* Bottle Neck and spray topper */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-10 h-4 border-l-4 border-r-4 border-[#b8860b]/30 bg-stone-900 z-1" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[26px] w-5 h-4 border-2 border-stone-700 bg-stone-900 z-1 rounded-sm" />

              {/* Animated layered fluid colors */}
              <div className="w-full h-[88%] rounded-xl overflow-hidden flex flex-col-reverse justify-start">
                <AnimatePresence>
                  {selectedNotes.map((note) => {
                    const colorClass = getNoteColor(note.id);
                    return (
                      <motion.div
                        key={note.id}
                        initial={{ height: 0 }}
                        animate={{ height: `${100 / (selectedNotes.length || 1)}%` }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.8, type: "spring", damping: 15 }}
                        className={`${colorClass} w-full flex items-center justify-center text-stone-950 border-t border-black/10 hover:brightness-110 cursor-default relative overflow-hidden group`}
                      >
                        {/* Ripple animation inside liquid note */}
                        <div className="absolute inset-0 bg-white/20 saturate-[1.8] animate-pulse" />
                        <span className="text-[8px] tracking-widest uppercase font-bold text-center z-10 select-none px-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                          {note.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Empty empty flask default */}
                {selectedNotes.length === 0 && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-[#050505]">
                    <Droplets className="w-7 h-7 text-stone-700 animate-bounce mb-2" />
                    <span className="text-[8px] tracking-widest text-stone-500 uppercase font-sans">
                      Fiole d'Exception Vide
                    </span>
                    <span className="text-[10px] text-stone-600 font-serif italic mt-0.5">
                      Sélectionnez des essences à gauche
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Generated Composition Metadata Spec */}
            <div className="w-full mt-4 p-4 border border-white/5 bg-[#050505] text-center">
              <div>
                <span className="text-[8px] tracking-widest text-[#b8860b] uppercase font-bold block">Poésie d'Accord</span>
                <span className="text-xs font-serif italic text-white font-medium block mt-1">
                  "{selectedNotes.length > 0 ? generatePoeticName() : "En attente de création"}"
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5">
                <div>
                  <span className="text-[7.5px] tracking-wider text-stone-550 uppercase font-sans block">Famille</span>
                  <span className="text-[10px] font-medium text-stone-300 block font-sans mt-0.5">{getOlfactoryFamily()}</span>
                </div>
                <div>
                  <span className="text-[7.5px] tracking-wider text-stone-550 uppercase font-sans block">Intensité</span>
                  <span className="text-[10px] font-medium text-[#b8860b] block font-sans mt-0.5">
                    {selectedNotes.length > 0 ? "★".repeat(getIntensityValue()) + "☆".repeat(5-getIntensityValue()) : "N/D"}
                  </span>
                </div>
              </div>
            </div>

            {/* Custom formulation Controls */}
            <div className="w-full mt-5 space-y-3">
              <input
                type="text"
                placeholder="Donnez un nom d'exception à cette fiole..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                disabled={selectedNotes.length === 0}
                className="w-full text-xs text-center border border-white/5 py-3.5 bg-[#050505] focus:outline-none focus:border-[#b8860b] text-white font-sans rounded-none disabled:opacity-40 placeholder-stone-700"
              />

              <div className="flex gap-2.5">
                <button
                  onClick={handleClearFlask}
                  disabled={selectedNotes.length === 0}
                  className="border border-white/10 hover:border-red-500/50 text-stone-400 hover:text-red-400 p-3.5 text-xs tracking-widest uppercase font-light transition-all disabled:opacity-40 focus:outline-none cursor-pointer hover:bg-white/5"
                  title="Vider"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSaveFormula}
                  disabled={selectedNotes.length === 0}
                  className="flex-1 bg-[#b8860b] text-black font-semibold hover:bg-[#8b6508] py-3.5 text-xs tracking-widest uppercase font-bold transition-all disabled:opacity-40 focus:outline-none flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  Enregistrer l'Accord
                </button>
              </div>

              <button
                onClick={() => {
                  setIsOrdered(true);
                  setTimeout(() => setIsOrdered(false), 3000);
                }}
                disabled={selectedNotes.length === 0}
                className="w-full bg-transparent hover:bg-stone-900 border border-[#b8860b] text-[#b8860b] py-3 text-xs tracking-[0.2em] uppercase font-light transition-all disabled:opacity-40 focus:outline-none block cursor-pointer"
              >
                {isOrdered ? (
                  <span className="text-green-500 font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Commande d'Essai Reçue !
                  </span>
                ) : (
                  "Commander mon flaconnage 50ml · 145 €"
                )}
              </button>
            </div>
          </div>

          {/* HISTORICAL RECENT FORMULAS BOARD */}
          <AnimatePresence>
            {savedFormulas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-white/5 p-5 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                  <Award className="w-4 h-4 text-[#b8860b]" />
                  <h4 className="font-cinzel text-xs tracking-wider uppercase text-white font-bold">
                    Votre Collection Privée d'Accords ({savedFormulas.length})
                  </h4>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {savedFormulas.map((formula) => (
                    <div 
                      key={formula.id} 
                      className="text-xs bg-[#050505] border border-white/5 p-3 flex items-center justify-between"
                    >
                      <div>
                        <h5 className="font-semibold text-white font-sans uppercase tracking-wider">{formula.name}</h5>
                        <p className="text-[10px] text-stone-400 font-serif italic mt-0.5">
                          {formula.family} · {formula.notes.map(n => n.name).join(", ")}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteFormula(formula.id)}
                        className="p-1.5 text-stone-500 hover:text-red-500 hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
