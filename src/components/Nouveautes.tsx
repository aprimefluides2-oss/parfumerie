import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePerfumes } from "../PerfumesContext";
import { Perfume } from "../types";
import {
  Sparkles,
  Star,
  Clock,
  Award,
  Droplet,
  ArrowRight,
  ShoppingBag,
  Check,
  X,
  Compass,
  Gift,
  Eye
} from "lucide-react";

interface NouveautesProps {
  onAddToBag: (perfume: Perfume, selectedSize: string, selectedPrice: number) => void;
}

export default function Nouveautes({ onAddToBag }: NouveautesProps) {
  const { perfumes, loading } = usePerfumes();
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("100 ml");
  const [isAdded, setIsAdded] = useState(false);
  const [detailPerfume, setDetailPerfume] = useState<Perfume | null>(null);

  const nouveautes = perfumes.slice(0, 3);
  const featured = nouveautes[featuredIndex] || null;

  const handleAddToBag = (perfume: Perfume) => {
    const ps = perfume.priceSizes.find(p => p.size === selectedSize);
    const price = ps ? ps.price : perfume.priceSizes[1]?.price ?? perfume.priceSizes[0].price;
    onAddToBag(perfume, selectedSize, price);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-[#b8860b] mx-auto mb-4 animate-pulse" />
          <p className="text-[10px] tracking-[0.3em] text-[#a1a1a1] uppercase">Chargement des nouveautés...</p>
        </div>
      </div>
    );
  }

  if (nouveautes.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-[#b8860b] mx-auto mb-4" />
          <p className="text-stone-500 font-serif italic">Aucune nouveauté pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F5]">
      {/* Hero Banner */}
      <section className="relative bg-[#050505] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        {featured && (
          <img
            src={featured.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-sm"
          />
        )}

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-[#b8860b]/10 border border-[#b8860b]/20 px-4 py-1.5 text-[9px] tracking-[0.35em] text-[#b8860b] uppercase font-semibold mb-6">
              <Sparkles className="w-3 h-3" />
              Collection Printemps-Été 2026
            </span>

            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.25em] uppercase text-white mb-4">
              Nouveautés
            </h1>

            <p className="max-w-xl mx-auto text-stone-400 font-serif italic text-sm sm:text-base leading-relaxed">
              "Découvrez les dernières créations de nos Maîtres Parfumeurs, des compositions audacieuses qui réinventent l'art du sillage."
            </p>

            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <Gift className="w-5 h-5 text-[#b8860b] mx-auto mb-1 stroke-[1.2]" />
                <span className="text-[9px] tracking-widest text-stone-400 uppercase block">Échantillon offert</span>
              </div>
              <div className="text-center">
                <Star className="w-5 h-5 text-[#b8860b] mx-auto mb-1 stroke-[1.2]" />
                <span className="text-[9px] tracking-widest text-stone-400 uppercase block">Édition limitée</span>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 text-[#b8860b] mx-auto mb-1 stroke-[1.2]" />
                <span className="text-[9px] tracking-widest text-stone-400 uppercase block">Exclusivité Maison</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Spotlight */}
      {featured && (
        <section className="bg-[#050505] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Image Side */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden bg-[#111] min-h-[400px] lg:min-h-[500px]"
                >
                  <img
                    src={featured.image}
                    alt={featured.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/30 hidden lg:block" />

                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="bg-[#b8860b] text-black px-3 py-1 text-[8px] tracking-[0.3em] uppercase font-bold">
                      Nouveau
                    </span>
                    <span className="bg-black/70 backdrop-blur-md text-[#e5e5e5] px-3 py-1 text-[8px] tracking-[0.2em] uppercase border border-white/10">
                      {featured.gender}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Details Side */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id + "-details"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-[#b8860b] uppercase font-semibold mb-3">
                    <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>{featured.category}</span>
                  </div>

                  <h2 className="font-cinzel text-2xl sm:text-3xl font-light tracking-[0.2em] uppercase text-white mb-2">
                    {featured.name}
                  </h2>
                  <p className="text-xs font-serif italic text-stone-400 mb-6">
                    {featured.subtitle}
                  </p>

                  <p className="text-stone-300 text-xs leading-relaxed font-sans mb-6">
                    {featured.description}
                  </p>

                  {/* Notes Preview */}
                  <div className="bg-[#0a0a0a] border border-white/5 p-4 mb-6">
                    <div className="flex items-center gap-1.5 mb-3">
                      <Droplet className="w-3.5 h-3.5 text-[#b8860b] fill-[#b8860b]/10" />
                      <span className="text-[9px] tracking-widest text-white uppercase font-bold">Notes Signature</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {featured.heartNotes.map((note) => (
                        <span key={note} className="bg-white/5 px-2.5 py-1 text-[10px] border border-white/5 text-[#e5e5e5] font-sans">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                    <div className="bg-[#0a0a0a] border border-white/5 py-3">
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase block">Intensité</span>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < featured.intensity ? "bg-[#b8860b]" : "bg-white/10"}`} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 py-3">
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase block">Tenue</span>
                      <Clock className="w-3.5 h-3.5 text-[#b8860b] mx-auto mt-1 stroke-[1.5]" />
                      <span className="text-[9px] text-[#e5e5e5] block mt-0.5">{featured.longevity}</span>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/5 py-3">
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase block">Saison</span>
                      <Award className="w-3.5 h-3.5 text-[#b8860b] mx-auto mt-1 stroke-[1.5]" />
                      <span className="text-[9px] text-[#e5e5e5] block mt-0.5">{featured.season}</span>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="mb-6">
                    <span className="text-[10px] tracking-widest text-[#b8860b] uppercase font-semibold block mb-3">Format</span>
                    <div className="grid grid-cols-3 gap-2">
                      {featured.priceSizes.map((ps) => (
                        <button
                          key={ps.size}
                          onClick={() => setSelectedSize(ps.size)}
                          className={`py-2.5 border text-center transition-all focus:outline-none flex flex-col items-center cursor-pointer ${
                            selectedSize === ps.size
                              ? "border-[#b8860b] bg-[#b8860b] text-black font-semibold"
                              : "border-white/5 bg-[#0a0a0a] text-stone-300 hover:border-[#b8860b]/50"
                          }`}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider">{ps.size}</span>
                          <span className={`text-[10px] mt-0.5 ${selectedSize === ps.size ? "text-[#111]" : "text-stone-500"}`}>{ps.price} €</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToBag(featured)}
                      disabled={isAdded}
                      className={`flex-1 text-xs tracking-[0.25em] uppercase font-bold py-4 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none cursor-pointer ${
                        isAdded
                          ? "bg-green-700 text-white"
                          : "bg-[#b8860b] hover:bg-[#8b6508] text-black"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2]" />
                          Ajouté
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
                          Ajouter au Panier
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setDetailPerfume(featured)}
                      className="border border-[#b8860b] text-[#b8860b] hover:bg-[#b8860b]/10 py-4 px-6 text-xs tracking-widest uppercase font-light transition-all focus:outline-none flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                      Détails
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Featured Selector Pills */}
            <div className="flex justify-center gap-3 pb-10 px-4">
              {nouveautes.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setFeaturedIndex(i);
                    setSelectedSize("100 ml");
                    setIsAdded(false);
                  }}
                  className={`flex items-center gap-3 px-5 py-3 border transition-all focus:outline-none cursor-pointer ${
                    featuredIndex === i
                      ? "border-[#b8860b] bg-[#b8860b]/10"
                      : "border-white/5 bg-[#0a0a0a] hover:border-white/15"
                  }`}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 object-cover rounded-sm"
                  />
                  <div className="text-left hidden sm:block">
                    <span className={`text-[10px] tracking-widest uppercase block ${featuredIndex === i ? "text-[#b8860b] font-semibold" : "text-stone-400"}`}>
                      {p.name}
                    </span>
                    <span className="text-[9px] text-stone-500">{p.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Nouveautés Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.35em] text-[#b8860b] uppercase font-semibold block mb-3">Explorez</span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-stone-900 mb-3">
            Toutes les Nouveautés
          </h2>
          <p className="text-stone-500 font-serif italic text-sm max-w-lg mx-auto">
            Chaque création est une invitation au voyage sensoriel, une nouvelle page dans l'histoire de Maison Élixir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {nouveautes.map((perfume, idx) => (
            <motion.div
              key={perfume.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -6 }}
              onClick={() => setDetailPerfume(perfume)}
              className="bg-white border border-[#EAE6DB] overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-350"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ef]">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-[#b8860b] text-black px-3 py-1 text-[8px] tracking-[0.3em] uppercase font-bold">
                  Nouveau
                </span>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="text-white w-full">
                    <p className="text-[9px] tracking-widest text-[#b8860b] uppercase mb-1 font-semibold">Signature</p>
                    <p className="font-serif italic text-xs text-stone-200">"{perfume.signatureNote}"</p>
                  </div>
                </div>
              </div>

              <div className="p-6 text-center">
                <p className="text-[10px] tracking-widest text-[#B2A790] uppercase mb-1">{perfume.category}</p>
                <h4 className="font-cinzel text-base tracking-widest text-stone-900 font-medium group-hover:text-[#b8860b] transition-colors uppercase">
                  {perfume.name}
                </h4>
                <p className="text-[11px] text-stone-500 font-serif italic mt-1 line-clamp-1">{perfume.subtitle}</p>

                <div className="mt-4 pt-4 border-t border-[#EAE6DB] flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] text-[#b8860b] uppercase tracking-wider block">À partir de</span>
                    <span className="text-sm font-semibold tracking-wide text-stone-900">{perfume.priceSizes[0].price} €</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-[#b8860b] font-light group-hover:underline underline-offset-4 flex items-center gap-1">
                    Découvrir <ArrowRight className="w-3 h-3 stroke-[1.5]" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Editorial Band */}
      <section className="bg-[#050505] border-y border-white/5 py-16 px-4 text-center">
        <span className="text-[10px] tracking-[0.35em] text-[#b8860b] uppercase font-bold mb-4 block">L'Art de la Création</span>
        <h3 className="font-cinzel text-lg sm:text-xl font-light tracking-[0.2em] uppercase text-white mb-6 max-w-2xl mx-auto">
          Chaque Nouveauté Naît d'une Obsession pour la Perfection
        </h3>
        <p className="text-stone-400 font-serif text-sm leading-relaxed italic max-w-xl mx-auto">
          "Nos maîtres parfumeurs voyagent aux quatre coins du monde pour dénicher les matières les plus rares.
          Chaque flacon est le fruit de centaines d'essais, d'une patience infinie et d'un amour absolu du beau."
        </p>
        <div className="flex justify-center gap-8 mt-10">
          <div className="text-center">
            <span className="font-cinzel text-2xl text-[#b8860b] font-light">200+</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider block mt-1">Essais par création</span>
          </div>
          <div className="text-center">
            <span className="font-cinzel text-2xl text-[#b8860b] font-light">18</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider block mt-1">Mois de maturation</span>
          </div>
          <div className="text-center">
            <span className="font-cinzel text-2xl text-[#b8860b] font-light">96%</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-wider block mt-1">Ingrédients naturels</span>
          </div>
        </div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {detailPerfume && (
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
              className="bg-[#050505] shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-white/10 flex flex-col md:flex-row text-[#e5e5e5] relative"
            >
              <button
                onClick={() => setDetailPerfume(null)}
                className="absolute top-4 right-4 z-10 p-2 text-[#a1a1a1] hover:text-white hover:bg-white/5 rounded-full transition-all focus:outline-none bg-black/60 backdrop-blur-sm border border-white/10"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 bg-black min-h-[300px] md:min-h-[500px] relative flex flex-col justify-end p-8 text-white">
                <img
                  src={detailPerfume.image}
                  alt={detailPerfume.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="relative z-10">
                  <span className="inline-block bg-[#b8860b]/20 backdrop-blur-md px-3 py-1 text-[8px] tracking-[0.25em] text-[#b8860b] border border-[#b8860b]/30 uppercase font-light mb-3">
                    {detailPerfume.gender} · {detailPerfume.category}
                  </span>
                  <h3 className="font-cinzel text-2xl lg:text-3xl font-light tracking-[0.2em] text-white uppercase mb-4 leading-tight">
                    {detailPerfume.name}
                  </h3>
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="font-serif italic text-xs lg:text-sm text-stone-300 leading-relaxed pl-4 border-l-2 border-[#b8860b]">
                      "{detailPerfume.quote}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
                <div>
                  <div className="flex items-center gap-1.5 text-[9px] tracking-widest text-[#b8860b] uppercase font-semibold mb-2">
                    <Compass className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Maison Élixir Paris</span>
                    <span>·</span>
                    <span>{detailPerfume.category}</span>
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl tracking-[0.15em] text-white uppercase font-medium">
                    {detailPerfume.name}
                  </h3>
                  <p className="text-xs font-serif italic text-stone-400 mt-1 mb-5">{detailPerfume.subtitle}</p>

                  <p className="text-stone-300 text-xs leading-relaxed font-sans mb-3">{detailPerfume.description}</p>
                  <p className="text-stone-400 text-[11px] leading-relaxed font-sans italic mb-6">{detailPerfume.extendedDescription}</p>

                  {/* Olfactory Pyramid */}
                  <div className="bg-[#0a0a0a] border border-white/5 p-5 mb-6">
                    <h5 className="font-cinzel text-[10px] tracking-[0.25em] uppercase text-white font-bold mb-4 flex items-center gap-1.5">
                      <Droplet className="w-3.5 h-3.5 text-[#b8860b] fill-[#b8860b]/10" /> Pyramide Olfactive
                    </h5>
                    <div className="space-y-4">
                      <div className="relative pl-6 border-l border-white/10 hover:border-[#b8860b] transition-colors">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#b8860b]" />
                        <span className="text-[9px] tracking-widest text-[#b8860b] font-sans uppercase block">Notes de Tête</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {detailPerfume.topNotes.map((n) => (
                            <span key={n} className="bg-white/5 px-2 py-0.5 text-[10px] border border-white/5 text-[#e5e5e5] font-sans">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="relative pl-6 border-l border-[#b8860b]/30 hover:border-[#b8860b] transition-colors">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-stone-400" />
                        <span className="text-[9px] tracking-widest text-stone-400 font-sans uppercase block">Notes de Cœur</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {detailPerfume.heartNotes.map((n) => (
                            <span key={n} className="bg-white/5 px-2 py-0.5 text-[10px] border border-white/5 text-white font-medium">{n}</span>
                          ))}
                        </div>
                      </div>
                      <div className="relative pl-6">
                        <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#b8860b]" />
                        <span className="text-[9px] tracking-widest text-white font-sans uppercase block font-semibold">Notes de Fond</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {detailPerfume.baseNotes.map((n) => (
                            <span key={n} className="bg-[#b8860b] text-black px-2 py-0.5 text-[10px] font-semibold">{n}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tech Details */}
                  <div className="grid grid-cols-3 gap-3 mb-6 bg-[#0a0a0a] border border-white/5 p-4 text-center">
                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase">Intensité</span>
                      <div className="flex items-center justify-center gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < detailPerfume.intensity ? "bg-[#b8860b]" : "bg-white/10"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#e5e5e5] block mt-1">{detailPerfume.intensity}/5</span>
                    </div>
                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase">Tenue</span>
                      <Clock className="w-3.5 h-3.5 text-[#b8860b] mx-auto mt-1 stroke-[1.5]" />
                      <span className="text-[10px] text-[#e5e5e5] block mt-1">{detailPerfume.longevity}</span>
                    </div>
                    <div>
                      <span className="text-[8px] tracking-wider text-stone-400 uppercase">Saison</span>
                      <Award className="w-3.5 h-3.5 text-[#b8860b] mx-auto mt-1 stroke-[1.5]" />
                      <span className="text-[10px] text-[#e5e5e5] block mt-1">{detailPerfume.season}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest">À partir de</span>
                    <span className="text-xl font-medium text-white">{detailPerfume.priceSizes[0].price} €</span>
                  </div>
                  <button
                    onClick={() => {
                      const ps = detailPerfume.priceSizes[1] || detailPerfume.priceSizes[0];
                      onAddToBag(detailPerfume, ps.size, ps.price);
                      setDetailPerfume(null);
                    }}
                    className="w-full bg-[#b8860b] hover:bg-[#8b6508] text-black text-xs tracking-[0.25em] uppercase font-bold py-4 transition-all flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
                    Ajouter au Panier
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
