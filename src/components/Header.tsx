import { Search, ShoppingBag, Compass, HelpCircle, Flame, Layers, Moon, Mail, Sparkles, X, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "collection", name: "La Collection", icon: Compass },
    { id: "advisor", name: "Conseiller Olfactif IA", icon: HelpCircle },
    { id: "creator", name: "Créateur d'Accord", icon: Layers },
    { id: "compare", name: "Prisme Comparatif", icon: Flame }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      {/* Couture Top Band */}
      <div className="bg-[#000000] text-[#b8860b] text-[10px] tracking-[0.25em] py-2 text-center uppercase font-light border-b border-white/5">
        Livraison offerte dès 150 € d'achat · Maison Élixir Paris · L'Art du Parfum
      </div>

      {/* Main Luxury Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Toggle Mobile Menu */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white"
          aria-label="Menu principal"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* High-End Brand Signature Heading */}
        <div 
          onClick={() => setActiveTab("collection")}
          className="cursor-pointer text-center md:text-left select-none relative animate-fade-in group"
        >
          <h1 className="font-cinzel text-xl sm:text-2xl lg:text-3xl font-light tracking-[0.3em] uppercase text-white transition-all group-hover:text-[#b8860b]">
            Maison Élixir
          </h1>
          <div className="text-[10px] tracking-[0.45em] uppercase text-[#a1a1a1] font-sans mt-[3px] text-center w-full md:text-left">
            Haute Parfumerie · Paris
          </div>
        </div>

        {/* Nav tabs for wider screens - Beautiful text buttons (very Dior style) */}
        <nav className="hidden md:flex space-x-8 lg:space-x-10 h-full items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`relative py-3 px-1 text-xs tracking-[0.18em] uppercase font-light transition-all flex items-center gap-1.5 focus:outline-none ${
                  isActive 
                    ? "text-[#b8860b] font-medium" 
                    : "text-[#a1a1a1] hover:text-white hover:tracking-[0.2em]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>{tab.name}</span>
                
                {/* Micro Animated Accent Line */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8860b]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Extra Actions Layout: Search and Cart */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Elegant Search Trigger */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white relative group focus:outline-none"
            aria-label="Recherche"
          >
            <Search className="w-4.5 h-4.5 stroke-[1.5] transition-transform group-hover:scale-110" />
          </button>

          {/* Premium Cart Button */}
          <button
            onClick={openCart}
            className="p-2.5 rounded-full hover:bg-white/5 transition-colors text-white/70 hover:text-white relative group flex items-center justify-center focus:outline-none"
            aria-label="Mon panier"
          >
            <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5] transition-transform group-hover:scale-110" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 bg-[#b8860b] text-stone-950 text-[8px] font-bold w-4.5 h-4.5 rounded-full border border-black flex items-center justify-center font-sans"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Dynamic Search bar drawer */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
          >
            <div className="max-w-3xl mx-auto px-4 py-5 flex items-center gap-3">
              <Search className="w-5 h-5 text-stone-500 stroke-[1.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une fragrance, une note olfactive (ex: Jasmin, Bergamote, Oud...)"
                className="w-full text-[#e5e5e5] text-sm py-2 bg-transparent focus:outline-none placeholder-stone-600 tracking-wide font-sans autofill:none"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchQuery("");
                  setShowSearch(false);
                }}
                className="p-1 rounded-full text-stone-500 hover:text-white hover:bg-white/10 transition-all focus:outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-[#0a0a0a] border-r border-white/5 shadow-2xl p-6 md:hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
                <div>
                  <h2 className="font-cinzel text-lg tracking-widest text-white">Maison Élixir</h2>
                  <p className="text-[8px] tracking-widest text-[#b8860b] uppercase">Haute Parfumerie</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-white hover:bg-white/5 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col space-y-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`py-3.5 px-3 rounded-lg text-left text-xs tracking-widest uppercase flex items-center gap-3 transition-colors ${
                        isActive
                          ? "bg-[#b8860b] text-black font-semibold"
                          : "text-[#a1a1a1] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-[10px] tracking-[0.2em] text-[#b8860b] font-sans">
                Atelier Christian Dior Paris Vibe
              </p>
              <p className="text-[9px] text-stone-500 font-sans mt-0.5">
                Créé en mai 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
