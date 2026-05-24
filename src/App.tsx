import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import OlfactoryAdvisor from "./components/OlfactoryAdvisor";
import AccordCreator from "./components/AccordCreator";
import CompareSection from "./components/CompareSection";
import CartModal, { CartItem } from "./components/CartModal";
import { Perfume } from "./types";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Calendar,
  X,
  Plus,
  Check,
  ShoppingBag,
  Clock,
  Award
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("collection");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handler to open direct detail from the Advisor Matched Teaser Button
  const handleSelectPerfumeFromAdvisor = (perfume: Perfume) => {
    setActiveTab("collection");
    // Find the element on screen or let the catalog view handle showing this detail
    // We can simulate opening this perfume detail by scrolling or updating catalog query
    setSearchQuery(perfume.name);
    setTimeout(() => {
      const catalogGrid = document.getElementById("collection-grid");
      if (catalogGrid) {
        catalogGrid.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  // Add to cart operations
  const handleAddToBag = (perfume: Perfume, selectedSize: string, selectedPrice: number) => {
    const itemId = `${perfume.id}-${selectedSize}`;
    
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === itemId);
      if (existing) {
        return prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          perfume,
          size: selectedSize,
          price: selectedPrice,
          quantity: 1
        };
        return [...prevItems, newItem];
      }
    });

    // Elegant sound notifier or delay opening cart for better user pacing? 
    // We can open the overlay drawer automatically to deliver instant delight feedback
    setTimeout(() => {
      setIsCartOpen(true);
    }, 600);
  };

  const handleUpdateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#B2A790] selection:text-white">
      {/* Dior-inspired layout top header component wrapper */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Dynamic View routing based on active tabs */}
      <main className="flex-1 bg-[#FAF9F5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full"
          >
            {activeTab === "collection" && (
              <>
                {/* Visual Editorial introduction Hero Section banner */}
                <Hero
                  onExplore={() => {
                    const el = document.getElementById("collection-grid");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  onDiagnose={() => setActiveTab("advisor")}
                />

                {/* Primary Interactive grid catalog containing filters and pyramids */}
                <Catalog 
                  onAddToBag={handleAddToBag} 
                  searchQuery={searchQuery} 
                />

                {/* MAISON STORY EDITORIAL SECTION - Classic Christian Dior vibes */}
                <section className="bg-white border-y border-[#EAE6DB] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-stone-900 select-none">
                  {/* Subtle watermarked background crest letters */}
                  <span className="absolute -bottom-16 -right-16 text-[180px] font-cinzel text-stone-100 font-extralight select-none leading-none opacity-40">
                    E
                  </span>

                  <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="text-[10px] tracking-[0.35em] text-[#B2A790] uppercase font-bold mb-4 block">Héritage d'Élérence</span>
                    <h3 className="font-cinzel text-xl sm:text-2.5xl font-light tracking-[0.2em] uppercase text-stone-950 mb-6">
                      L'Art de Vivre de Granville à l'Avenue Montaigne
                    </h3>
                    <p className="text-stone-600 font-serif text-sm sm:text-base leading-relaxed italic max-w-2xl mx-auto">
                      "Dans les jardins secrets de notre domaine, les roses sauvages s'ouvrent au crépuscule pour distiller l'enchantement le plus secret. Christian Dior disait qu'un parfum est le morceau de robe qui s'en va dans l'air. Notre mission chez Maison Élixir est de rendre cet air inoubliable."
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center">
                      <div className="p-4 border border-[#F5F2EA] bg-[#FAF9F5]/40">
                        <span className="font-cinzel text-sm text-[#B2A790] uppercase tracking-widest font-bold">1947</span>
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider block mt-1">Savoir-Faire Historique</p>
                        <p className="text-xs text-stone-500 font-sans mt-2">Respect des méthodes précieuses d'extraction à froid de Grasse.</p>
                      </div>

                      <div className="p-4 border border-[#F5F2EA] bg-[#FAF9F5]/40">
                        <Sparkles className="w-5 h-5 text-[#B2A790] mx-auto mb-1 stroke-[1.2]" />
                        <p className="text-[10px] text-stone-400 uppercase tracking-wider block">Artisans Ciriers</p>
                        <p className="text-xs text-stone-500 font-sans mt-2">Chaque flaconnage en cristal lourd est gravé et scellé à la main à Paris.</p>
                      </div>

                      <div className="p-4 border border-[#F5F2EA] bg-[#FAF9F5]/40">
                        <ShieldCheck className="w-5 h-5 text-[#B2A790] mx-auto mb-1 stroke-[1.2]" />
                        <p className="text-[10px] text-stone-400 tracking-wider uppercase block">Engagement Responsable</p>
                        <p className="text-xs text-stone-500 font-sans mt-2">Près de 96% d'extraits naturels issus de pépinières partenaires éthiques.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === "advisor" && (
              <OlfactoryAdvisor onSelectPerfume={handleSelectPerfumeFromAdvisor} />
            )}

            {activeTab === "creator" && (
              <AccordCreator />
            )}

            {activeTab === "compare" && (
              <CompareSection />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ELEGANT EDITORIAL FOOTER COMPONENT */}
      <footer className="bg-stone-950 text-[#FAF9F5] border-t border-stone-850 pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 font-sans text-xs">
          {/* Brand Signature Column */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-base tracking-[0.3em] uppercase font-bold text-white">Maison Élixir</h4>
            <div className="text-[9px] tracking-[0.25em] text-[#B2A790] uppercase">Haute Parfumerie · Grasse · Paris</div>
            <p className="text-stone-400 font-serif italic leading-relaxed text-[11px]">
              "Chaque sillage est un poème sans titre, gravé sur le parchemin de votre présence."
            </p>
          </div>

          {/* Boutique Addresses */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-[10px] tracking-[0.25em] text-white uppercase font-bold">Nos Salons de Parfum</h5>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-[#B2A790] shrink-0 stroke-[1.5]" />
                <span>30 Avenue Montaigne, <br />75008 Paris, France</span>
              </div>
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-[#B2A790] shrink-0 stroke-[1.5]" />
                <span>Grand Hôtel de l'Atelier, <br />06130 Grasse, France</span>
              </div>
            </div>
          </div>

          {/* Customer Relations */}
          <div className="space-y-3">
            <h5 className="font-cinzel text-[10px] tracking-[0.25em] text-white uppercase font-bold">L'Atelier d'Accueil</h5>
            <div className="space-y-2 text-stone-400">
              <div className="flex gap-2.5 items-center">
                <Phone className="w-4 h-4 text-[#B2A790] stroke-[1.5]" />
                <span>+33 (0)1 47 20 00 01</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="w-4 h-4 text-[#B2A790] stroke-[1.5]" />
                <span>concierge@maison-elixir.com</span>
              </div>
              <p className="text-[10px] text-stone-500">Service disponible du lundi au samedi, de 10h à 19h.</p>
            </div>
          </div>

          {/* Newsletter signup form */}
          <div className="space-y-4">
            <h5 className="font-cinzel text-[10px] tracking-[0.25em] text-white uppercase font-bold">Le Bulletin d'Exception</h5>
            <p className="text-stone-400 font-serif leading-relaxed italic text-[11px]">
              Inscrivez-vous pour recevoir nos invitations de dégustations d'accords et lancements de flacons privés.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert("Grand merci. Vous êtes désormais inscrit à notre bulletin de prestige.");
            }} className="flex border-b border-stone-800 pb-1.5 focus-within:border-[#B2A790] transition-colors gap-2">
              <input
                type="email"
                placeholder="Votre adresse courriel..."
                required
                className="bg-transparent text-xs py-1.5 w-full focus:outline-none placeholder-stone-600 text-[#FAF9F5] font-sans"
              />
              <button
                type="submit"
                className="text-[#FAF9F5] hover:text-[#B2A790] text-[9px] uppercase tracking-widest font-semibold focus:outline-none"
              >
                Rejoindre
              </button>
            </form>
          </div>
        </div>

        {/* Legal block */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-900 mt-12 pt-8 text-center text-[10px] text-stone-500 font-sans">
          <p>© 2026 Maison Élixir Paris. Inspiré par l'esprit couture de Christian Dior. Tous droits de sillage réservés.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="hover:text-stone-300">Mentions Légales</a>
            <span>·</span>
            <a href="#" className="hover:text-stone-300">Charte de Confidentialité</a>
            <span>·</span>
            <a href="#" className="hover:text-stone-300">Conditions de Vente</a>
          </div>
        </div>
      </footer>

      {/* PERSISTENT SHOPPING BAG SIDE OVER DETAILED OVERLAY */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
