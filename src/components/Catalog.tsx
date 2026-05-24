import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PERFUMES } from "../perfumesData";
import { Perfume, PriceSize } from "../types";
import { 
  Sparkles, 
  Droplet, 
  Heart, 
  Info, 
  Check, 
  Plus, 
  TrendingUp, 
  Award, 
  Clock, 
  Compass, 
  ArrowLeft,
  X,
  ShoppingBag
} from "lucide-react";

interface CatalogProps {
  onAddToBag: (perfume: Perfume, selectedSize: string, selectedPrice: number) => void;
  searchQuery: string;
}

export default function Catalog({ onAddToBag, searchQuery }: CatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("100 ml");
  const [isSampleOrdered, setIsSampleOrdered] = useState(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState(false);

  // Filter based on search query and category
  const filteredPerfumes = PERFUMES.filter((perfume) => {
    const matchesCategory = selectedCategory === "all" || perfume.category === selectedCategory;
    const matchesSearch = 
      searchQuery === "" ||
      perfume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.signatureNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      perfume.topNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      perfume.heartNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
      perfume.baseNotes.some(n => n.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", name: "Voir Tout" },
    { id: "Collection Féminine", name: "Pour Elle" },
    { id: "Collection Masculine", name: "Pour Lui" },
    { id: "Collection Privée", name: "La Collection Privée" }
  ];

  const handleOpenDetail = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
    // Default size is usually 100 ml
    setSelectedSize("100 ml");
    setIsSampleOrdered(false);
    setIsAddedAnimation(false);
  };

  const getSelectedPrice = (perfume: Perfume, sizeStr: string): number => {
    const ps = perfume.priceSizes.find(p => p.size === sizeStr);
    return ps ? ps.price : perfume.priceSizes[1].price;
  };

  const executeAddToBag = (perfume: Perfume) => {
    const price = getSelectedPrice(perfume, selectedSize);
    onAddToBag(perfume, selectedSize, price);
    setIsAddedAnimation(true);
    setTimeout(() => {
      setIsAddedAnimation(false);
    }, 2000);
  };

  return (
    <section id="collection-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
      {/* Intro Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h3 className="font-cinzel text-[11px] tracking-[0.4em] text-[#b8860b] uppercase mb-3 font-semibold">La Haute Parfumerie d'Atelier</h3>
        <h2 className="font-cinzel text-2xl sm:text-3.5xl font-light tracking-widest text-[#e5e5e5] uppercase mb-4">
          Le Prisme des Fragrances
        </h2>
        <p className="text-[#a1a1a1] font-serif text-sm leading-relaxed italic">
          "Comme une robe de haute couture drapée sur la silhouette, chaque élixir épouse les courbes intimes de votre peau. Découvrez nos accords les plus nobles, façonnés à Grasse."
        </p>

        {/* Dynamic Category Filtering Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 border-b border-white/5 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all focus:outline-none relative ${
                selectedCategory === cat.id
                  ? "text-[#b8860b] font-semibold"
                  : "text-[#a1a1a1] hover:text-white"
              }`}
            >
              {cat.name}
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="activeCatalogCategory"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8860b]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of perfume cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPerfumes.map((perfume, idx) => (
            <motion.div
              layout
              key={perfume.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => handleOpenDetail(perfume)}
              className="bg-[#0a0a0a] border border-white/5 overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl hover:border-white/10 transition-all duration-350 flex flex-col h-full"
            >
              {/* Product Image Holder */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#111]">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />

                {/* Subtle Luxury Category Badge */}
                <span className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-[8px] tracking-[0.25em] text-[#e5e5e5] border border-white/5 uppercase font-light">
                  {perfume.gender}
                </span>

                {/* Subtle Hover Reveal Overlay with notes */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white w-full">
                    <p className="text-[9px] tracking-widest text-[#b8860b] uppercase mb-1 font-sans font-semibold">
                      Signature du Sillage
                    </p>
                    <p className="font-serif italic text-xs text-stone-250">
                      "{perfume.signatureNote}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Informative Base content */}
              <div className="p-6 flex-1 flex flex-col justify-between border-t border-white/5">
                <div className="text-center">
                  <p className="text-[10px] tracking-widest text-[#a1a1a1] uppercase font-sans mb-1">
                    {perfume.category}
                  </p>
                  <h4 className="font-cinzel text-base tracking-widest text-white font-medium group-hover:text-[#b8860b] transition-colors uppercase">
                    {perfume.name}
                  </h4>
                  <p className="text-[11px] text-[#a1a1a1] font-serif italic mt-1 line-clamp-1">
                    {perfume.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] text-[#b8860b] uppercase tracking-wider block font-sans">À partir de</span>
                    <span className="text-sm font-semibold tracking-wide text-white font-sans">
                      {perfume.priceSizes[0].price} €
                    </span>
                  </div>

                  <span className="text-[10px] tracking-widest uppercase text-[#b8860b] font-light group-hover:underline underline-offset-4 flex items-center gap-1">
                    Découvrir <Plus className="w-3 h-3 stroke-[1.5]" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPerfumes.length === 0 && (
        <div className="text-center py-20 border border-dashed border-[#222] bg-[#0a0a0a] rounded-none">
          <p className="text-[#a1a1a1] font-serif italic text-base">
            Aucun élixir ne correspond à votre recherche pour le moment.
          </p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-4 px-6 py-2.5 text-xs text-black bg-[#b8860b] font-semibold tracking-widest uppercase hover:bg-[#8b6508] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* EXQUISITE PERFUME DETAIL COMPONENT PANEL OVERLAY */}
      <AnimatePresence>
        {selectedPerfume && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-[#050505] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-white/10 rounded-none flex flex-col md:flex-row text-[#e5e5e5] relative"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedPerfume(null)}
                className="absolute top-4 right-4 z-10 p-2 text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-full transition-all focus:outline-none bg-black/60 backdrop-blur-sm border border-white/10"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Generative High-res Asset & Slogan Quote */}
              <div className="w-full md:w-1/2 bg-black min-h-[300px] md:min-h-[500px] relative flex flex-col justify-end p-8 text-white">
                <img
                  src={selectedPerfume.image}
                  alt={selectedPerfume.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
                />
                
                {/* Visual elegant filter */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                {/* Left Side Content Overlays */}
                <div className="relative z-10">
                  <span className="inline-block bg-[#b8860b]/20 backdrop-blur-md px-3 py-1 text-[8px] tracking-[0.25em] text-[#b8860b] border border-[#b8860b]/30 uppercase font-light mb-3">
                    {selectedPerfume.gender} · {selectedPerfume.category}
                  </span>
                  
                  <h3 className="font-cinzel text-2xl lg:text-3xl font-light tracking-[0.2em] text-white uppercase mb-4 leading-tight">
                    {selectedPerfume.name}
                  </h3>

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="font-serif italic text-xs lg:text-sm text-stone-300 leading-relaxed pl-4 border-l-2 border-[#b8860b]">
                      "{selectedPerfume.quote}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Specifications, Olfactory Pyramid and Sizing */}
              <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
                <div>
                  {/* Category breadcrumb */}
                  <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-[#b8860b] uppercase font-semibold mb-2">
                    <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Maison Élixir Paris</span>
                    <span>·</span>
                    <span>{selectedPerfume.category}</span>
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl tracking-[0.15em] text-white uppercase font-medium">
                    {selectedPerfume.name}
                  </h3>
                  <p className="text-xs font-serif italic text-stone-400 mt-1 mb-5">
                    {selectedPerfume.subtitle}
                  </p>

                  {/* Descriptions */}
                  <p className="text-stone-300 text-xs leading-relaxed font-sans mb-3">
                    {selectedPerfume.description}
                  </p>
                  <p className="text-stone-400 text-[11px] leading-relaxed font-sans italic mb-6">
                    {selectedPerfume.extendedDescription}
                  </p>

                  {/* INTERACTIVE OLFACTORY PYRAMID */}
                  <div className="bg-[#0a0a0a] border border-white/5 p-5 mb-6">
                    <h5 className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-white font-bold mb-4 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-[#b8860b] fill-[#b8860b]/10" /> Pyramide Olfactive
                    </h5>
                    
                    <div className="space-y-4">
                      {/* Tête */}
                      <div className="relative pl-6 border-l border-white/10 hover:border-[#b8860b] transition-colors">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#b8860b]" />
                        <span className="text-[9px] tracking-widest text-[#b8860b] font-sans uppercase block">Notes de Tête (0 - 30 min)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedPerfume.topNotes.map((note) => (
                            <span key={note} className="bg-white/5 px-2 py-0.5 text-[10px] border border-white/5 rounded-none text-[#e5e5e5] font-sans">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CŒUR */}
                      <div className="relative pl-6 border-l border-[#b8860b]/30 hover:border-[#b8860b] transition-colors">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-stone-400" />
                        <span className="text-[9px] tracking-widest text-stone-400 font-sans uppercase block">Notes de Cœur (30 min - 4h)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedPerfume.heartNotes.map((note) => (
                            <span key={note} className="bg-white/5 px-2 py-0.5 text-[10px] border border-white/5 rounded-none text-white font-medium">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* FOND */}
                      <div className="relative pl-6">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b8860b]" />
                        <span className="text-[9px] tracking-widest text-white font-sans uppercase block font-semibold">Notes de Fond (Persistance 4h - 24h)</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedPerfume.baseNotes.map((note) => (
                            <span key={note} className="bg-[#b8860b] text-black px-2 py-0.5 text-[10px] rounded-none font-sans font-semibold">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Gauges: Intensity, Longevity, Season */}
                  <div className="grid grid-cols-3 gap-3 mb-6 bg-[#0a0a0a] border border-white/5 p-4 text-center">
                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase font-sans">Intensité</span>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < selectedPerfume.intensity ? "bg-[#b8860b]" : "bg-white/10"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-sans font-medium text-[#e5e5e5] block mt-1">
                        {selectedPerfume.intensity}/5
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase font-sans">Tenue Peau</span>
                      <div className="flex justify-center mt-1 text-[#b8860b]">
                        <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#e5e5e5] font-sans block mt-1">
                        {selectedPerfume.longevity}
                      </span>
                    </div>

                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase font-sans">Saison Idéale</span>
                      <div className="flex justify-center mt-1 text-[#b8860b]">
                        <Award className="w-3.5 h-3.5 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] font-medium text-[#e5e5e5] font-sans block mt-1">
                        {selectedPerfume.season}
                      </span>
                    </div>
                  </div>

                  {/* Size selectors with dynamic pricing */}
                  <div className="mb-6">
                    <span className="text-[10px] tracking-widest text-[#b8860b] uppercase font-sans block mb-3 font-semibold">
                      Choisir le Format de Flacon
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {selectedPerfume.priceSizes.map((sizes) => (
                        <button
                          key={sizes.size}
                          onClick={() => setSelectedSize(sizes.size)}
                          className={`py-3 px-1 border text-center transition-all focus:outline-none flex flex-col justify-center items-center cursor-pointer ${
                            selectedSize === sizes.size
                              ? "border-[#b8860b] bg-[#b8860b] text-black font-semibold"
                              : "border-white/5 bg-[#0a0a0a] text-stone-300 hover:border-[#b8860b]/50"
                          }`}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider">{sizes.size}</span>
                          <span className={`text-[10px] mt-0.5 ${selectedSize === sizes.size ? 'text-[#111]' : 'text-stone-500'}`}>{sizes.price} €</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pricing / Footer interactive commands */}
                <div className="pt-6 border-t border-white/10 bg-[#0a0a0a] shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-sans">Flacon Sélectionné</span>
                      <span className="text-xs text-[#a1a1a1] font-sans">{selectedPerfume.name} · {selectedSize}</span>
                    </div>
                    <span className="text-xl font-medium text-white font-sans">
                      {getSelectedPrice(selectedPerfume, selectedSize)} €
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => executeAddToBag(selectedPerfume)}
                      disabled={isAddedAnimation}
                      className={`flex-1 text-xs tracking-[0.25em] uppercase font-bold py-4 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none cursor-pointer ${
                        isAddedAnimation 
                          ? "bg-green-700 text-white" 
                          : "bg-[#b8860b] hover:bg-[#8b6508] text-black font-bold"
                      }`}
                    >
                      {isAddedAnimation ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2]" />
                          Ajouté au flaconnage
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
                          Ajouter au Panier
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsSampleOrdered(true);
                        setTimeout(() => setIsSampleOrdered(false), 3000);
                      }}
                      className="border border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b]/10 py-4 px-6 text-xs tracking-widest uppercase font-light transition-all focus:outline-none flex justify-center items-center gap-1.5 cursor-pointer"
                    >
                      {isSampleOrdered ? (
                        <span className="text-green-500 flex items-center gap-1.5 uppercase font-medium">
                          <Check className="w-3.5 h-3.5" /> Échantillon Offert !
                        </span>
                      ) : (
                        "Recevoir l'Échantillon 2ml"
                      )}
                    </button>
                  </div>
                  <p className="text-[9px] text-[#b8860b] uppercase tracking-wider text-center mt-3 font-sans">
                    Livré dans son écrin noir plissé Couture, accompagné d'une miniature d'essai gratuite.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
