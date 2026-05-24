import { useState } from "react";
import { PERFUMES } from "../perfumesData";
import { Perfume } from "../types";
import { 
  Sparkles, 
  Columns, 
  Clock, 
  DollarSign, 
  Flame, 
  Droplets,
  Bookmark,
  Percent,
  TrendingDown
} from "lucide-react";

export default function CompareSection() {
  const [perfumeId1, setPerfumeId1] = useState<string>("gold");
  const [perfumeId2, setPerfumeId2] = useState<string>("midnight");

  const perfume1 = PERFUMES.find(p => p.id === perfumeId1) || PERFUMES[0];
  const perfume2 = PERFUMES.find(p => p.id === perfumeId2) || PERFUMES[2];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Editorial Intro */}
      <div className="text-center mb-10">
        <h3 className="font-cinzel text-[11px] tracking-[0.35em] text-[#b8860b] uppercase mb-2 font-semibold">Similitudes & Contrastes</h3>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-light tracking-widest text-[#e5e5e5] uppercase mb-4">
          Le Prisme Comparatif
        </h2>
        <p className="text-[#a1a1a1] font-serif text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto italic">
          "Deux expressions contraires ou complémentaires de l'élégance parisienne. Comparez leurs architectures moléculaires, leurs signatures et déterminez le sillage qui vous transcendera."
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 p-4 sm:p-8 shadow-2xl">
        {/* Selecting Dropdowns */}
        <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6 mb-8 text-center bg-black/40 p-4">
          <div>
            <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-semibold block mb-2">Première Essence</label>
            <select
              value={perfumeId1}
              onChange={(e) => setPerfumeId1(e.target.value)}
              className="font-cinzel text-xs sm:text-sm tracking-wider uppercase bg-[#050505] border border-white/5 py-3 px-4 focus:outline-none focus:border-[#b8860b] text-[#e5e5e5] rounded-none w-full text-center"
            >
              {PERFUMES.map(p => (
                <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                  {p.name} ({p.gender})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-semibold block mb-2">Seconde Essence</label>
            <select
              value={perfumeId2}
              onChange={(e) => setPerfumeId2(e.target.value)}
              className="font-cinzel text-xs sm:text-sm tracking-wider uppercase bg-[#050505] border border-white/5 py-3 px-4 focus:outline-none focus:border-[#b8860b] text-[#e5e5e5] rounded-none w-full text-center"
            >
              {PERFUMES.map(p => (
                <option key={p.id} value={p.id} className="bg-[#050505] text-white">
                  {p.name} ({p.gender})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COMPARATIVE GRIDS CELLS */}
        <div className="grid grid-cols-12 gap-1 items-stretch">
          {/* Header images column */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center items-center p-4 text-center border-b md:border-b-0 md:border-r border-white/5">
            <Columns className="w-8 h-8 text-[#b8860b] stroke-[1] mb-2" />
            <span className="font-cinzel text-xs tracking-widest text-white uppercase font-bold">Face-À-Face</span>
            <p className="text-[11px] text-[#a1a1a1] font-sans leading-relaxed mt-2 max-w-xs">
              Mettez en perspective les sillages de la Maison pour apprécier la noblesse des contrastes aromatiques de nos maîtres-gantiers.
            </p>
          </div>

          {/* Perfume 1 info Card */}
          <div className="col-span-6 md:col-span-4 bg-white/5 p-5 text-center border-r border-white/5">
            <div className="w-16 h-20 bg-[#050505] border border-white/10 overflow-hidden mx-auto mb-3">
              <img
                src={perfume1.image}
                alt={perfume1.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h4 className="font-cinzel text-sm sm:text-base tracking-widest text-white font-semibold uppercase">{perfume1.name}</h4>
            <span className="text-[8px] tracking-widest text-[#b8860b] uppercase font-bold block mt-1">{perfume1.category}</span>
          </div>

          {/* Perfume 2 info Card */}
          <div className="col-span-6 md:col-span-4 bg-white/5 p-5 text-center">
            <div className="w-16 h-20 bg-[#050505] border border-white/10 overflow-hidden mx-auto mb-3">
              <img
                src={perfume2.image}
                alt={perfume2.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h4 className="font-cinzel text-sm sm:text-base tracking-widest text-white font-semibold uppercase">{perfume2.name}</h4>
            <span className="text-[8px] tracking-widest text-[#b8860b] uppercase font-bold block mt-1">{perfume2.category}</span>
          </div>

          {/* Row: Signature Note */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" /> Signature Olfactive
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs font-semibold text-center text-white font-sans bg-transparent">
            {perfume1.signatureNote}
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs font-semibold text-center text-white font-sans bg-transparent">
            {perfume2.signatureNote}
          </div>

          {/* Row: Gender */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <Droplets className="w-3.5 h-3.5 text-[#b8860b]" /> Tempérament Céleste
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume1.gender}
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume2.gender}
          </div>

          {/* Row: Intensity */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <Flame className="w-3.5 h-3.5 text-[#b8860b]" /> Échelle d'Intensité
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-center">
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < perfume1.intensity ? "bg-[#b8860b]" : "bg-white/10"}`} />
              ))}
            </div>
            <span className="text-[10px] text-stone-400 font-sans block mt-1">{perfume1.intensity}/5</span>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-center">
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < perfume2.intensity ? "bg-[#b8860b]" : "bg-white/10"}`} />
              ))}
            </div>
            <span className="text-[10px] text-stone-400 font-sans block mt-1">{perfume2.intensity}/5</span>
          </div>

          {/* Row: Longevity */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <Clock className="w-3.5 h-3.5 text-[#b8860b]" /> Tenue Peau de Soie
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume1.longevity}
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume2.longevity}
          </div>

          {/* Row: Golden Season */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <Bookmark className="w-3.5 h-3.5 text-[#b8860b]" /> Saison Idéale
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume1.season}
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-xs text-center text-stone-300 font-sans">
            {perfume2.season}
          </div>

          {/* Row: Price sizing */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-b border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 shrink-0 bg-black/60">
            <DollarSign className="w-3.5 h-3.5 text-[#b8860b]" /> Échelles Tarifs
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-b border-l border-white/5 text-center text-stone-300 font-sans text-xs">
            {perfume1.priceSizes.map(p => `${p.size} : ${p.price}€`).join(" · ")}
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-b border-l border-white/5 text-center text-stone-300 font-sans text-xs">
            {perfume2.priceSizes.map(p => `${p.size} : ${p.price}€`).join(" · ")}
          </div>

          {/* Comparing Pyramid notes directly (Tête) */}
          <div className="col-span-12 md:col-span-4 p-4 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 bg-black/60">
            <span>Notes de Tête</span>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume1.topNotes.map(n => (
                <span key={n} className="bg-white/5 border border-white/5 text-stone-300 text-[10px] px-2 py-0.5">{n}</span>
              ))}
            </div>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume2.topNotes.map(n => (
                <span key={n} className="bg-white/5 border border-white/5 text-stone-300 text-[10px] px-2 py-0.5">{n}</span>
              ))}
            </div>
          </div>

          {/* Comparing Pyramid notes directly (Cœur) */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 bg-black/60">
            <span>Notes de Cœur</span>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume1.heartNotes.map(n => (
                <span key={n} className="bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/20 text-[10px] px-2 py-0.5 font-sans font-medium">{n}</span>
              ))}
            </div>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume2.heartNotes.map(n => (
                <span key={n} className="bg-[#b8860b]/10 text-[#b8860b] border border-[#b8860b]/20 text-[10px] px-2 py-0.5 font-sans font-medium">{n}</span>
              ))}
            </div>
          </div>

          {/* Comparing Pyramid notes directly (Fond) */}
          <div className="col-span-12 md:col-span-4 p-4 border-t border-b border-white/5 text-[10px] text-stone-300 uppercase font-sans font-bold flex items-center md:justify-start justify-center gap-1.5 bg-black/60">
            <span>Notes de Fond</span>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-b border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume1.baseNotes.map(n => (
                <span key={n} className="bg-[#b8860b] text-black font-semibold text-[10px] px-2 py-0.5">{n}</span>
              ))}
            </div>
          </div>
          <div className="col-span-6 md:col-span-4 p-4 border-t border-b border-l border-white/5 text-center">
            <div className="flex flex-wrap gap-1 justify-center">
              {perfume2.baseNotes.map(n => (
                <span key={n} className="bg-[#b8860b] text-black font-semibold text-[10px] px-2 py-0.5">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
