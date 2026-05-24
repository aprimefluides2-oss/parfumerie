import { motion } from "motion/react";
import { Sparkles, HelpCircle, Compass } from "lucide-react";

interface HeroProps {
  onExplore: () => void;
  onDiagnose: () => void;
}

export default function Hero({ onExplore, onDiagnose }: HeroProps) {
  return (
    <div className="relative min-h-[85vh] lg:h-[88vh] bg-[#050505] text-[#e5e5e5] overflow-hidden flex items-center">
      {/* Background Hero Image with Zoom Transition and Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          src="/images/perfume_hero_banner_1779660862005.png"
          alt="Maison Élixir Éditorial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft linear shadows for text contrast and premium feel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#050505] to-transparent z-1" />
      </div>

      {/* Floating Sparkles decorative effects */}
      <div className="absolute top-[30%] right-[15%] w-0.5 h-0.5 bg-yellow-200 rounded-full animate-ping opacity-75" />
      <div className="absolute top-[45%] right-[25%] w-1 h-1 bg-white rounded-full animate-ping delay-700 opacity-60" />

      {/* Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-16 lg:py-0">
        <div className="max-w-2xl text-left">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-[#b8860b]" />
            <span className="text-xs sm:text-[11px] uppercase tracking-[0.4em] text-[#b8860b] font-sans font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 fill-[#b8860b]/20 text-[#b8860b]" /> Nouvel Art de Parfumerie
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-widest leading-[1.15] text-white uppercase"
          >
            L'Émotion <br />
            <span className="font-serif italic font-light text-[#b8860b] capitalize">Olfactive</span> Pure
          </motion.h2>

          {/* Editorial Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-6 text-sm sm:text-base text-stone-300 font-serif leading-relaxed italic max-w-lg animate-fade-in"
          >
            "Le parfum céleste ne s'explique pas, il se ressent. Dans nos flacons de cristal coulent des fragments d'éternité et de poésie parisienne, sculptés à Grasse."
          </motion.p>

          {/* Brand Pledge bullet points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-stone-400 font-sans tracking-[0.2em] uppercase font-light border-l border-[#b8860b] pl-4"
          >
            <div>· Extraction Noble</div>
            <div>· Flacons Gravés Main</div>
            <div>· 96% d'Ingrédients Naturels</div>
          </motion.div>

          {/* Dynamic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={onExplore}
              className="bg-white text-black hover:bg-[#b8860b] hover:text-white text-xs tracking-[0.22em] uppercase font-bold px-8 py-4 transition-colors duration-500 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
            >
              <Compass className="w-4 h-4 stroke-[1.2]" />
              Explorer la Collection
            </button>

            <button
              onClick={onDiagnose}
              className="bg-transparent text-[#e5e5e5] text-xs tracking-[0.22em] uppercase font-light px-8 py-4 border border-white/20 hover:border-[#b8860b] hover:text-[#b8860b] transition-colors duration-500 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 stroke-[1.2]" />
              Conseiller Olfactif IA
            </button>
          </motion.div>
        </div>
      </div>

      {/* Pure Elegant Subtle Bottom Transition */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-1.5 opacity-60">
        <span className="text-[9px] tracking-[0.45em] uppercase text-stone-400 font-sans">DÉFILER</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-1.5 h-1.5 bg-[#b8860b] rounded-full"
        />
      </div>
    </div>
  );
}
