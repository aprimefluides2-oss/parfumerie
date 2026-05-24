import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Check, 
  ChevronRight, 
  Gift, 
  Truck, 
  CreditCard,
  CheckCircle2,
  Lock,
  Calendar
} from "lucide-react";
import { Perfume } from "../types";

export interface CartItem {
  id: string; // unique cart item id (perfumeId - size)
  perfume: Perfume;
  size: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartModalProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery" | "confirmation">("cart");
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    giftOption: true, // Gift wrap by default
    giftMessage: ""
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal >= 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleNextStep = () => {
    if (checkoutStep === "cart") {
      setCheckoutStep("delivery");
    } else if (checkoutStep === "delivery") {
      // Validate inputs lightly
      if (!shippingInfo.firstName || !shippingInfo.address || !shippingInfo.email) {
        alert("Veuillez renseigner votre prénom, adresse et email de livraison pour notre coursier de luxe.");
        return;
      }
      setCheckoutStep("confirmation");
    }
  };

  const handlePlaceOrder = () => {
    // Direct link to the confirmation screen
    setCheckoutStep("confirmation");
  };

  const resetProcess = () => {
    onClearCart();
    setCheckoutStep("cart");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Fading Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#000000]/80 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            {/* Sliding Panel sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-screen max-w-md bg-[#0a0a0a] border-l border-white/5 shadow-2.5xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#050505] shadow-sm">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#b8860b] stroke-[1.5]" />
                  <h3 className="font-cinzel text-sm sm:text-base tracking-widest text-white uppercase font-bold">
                    {checkoutStep === "cart" && `Votre Panier (${cartItems.length})`}
                    {checkoutStep === "delivery" && "Détails de Livraison"}
                    {checkoutStep === "confirmation" && "Sceau de Validation"}
                  </h3>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/5 text-stone-400 hover:text-white rounded-full transition-all focus:outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CORE SCROLLABLE CONTENT BLOCK */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* STEP 1: CART OVERVIEW */}
                {checkoutStep === "cart" && (
                  <>
                    {cartItems.length === 0 ? (
                      <div className="text-center py-20">
                        <ShoppingBag className="w-12 h-12 text-[#b8860b]/30 stroke-[1] mx-auto mb-4 animate-bounce" />
                        <p className="text-stone-400 font-serif italic text-sm">
                          Votre panier est encore vide de fragrances d'exception...
                        </p>
                        <button
                          onClick={onClose}
                          className="mt-6 px-6 py-3 text-[10px] tracking-widest uppercase bg-[#b8860b] text-black font-bold hover:bg-[#8b6508] transition-colors focus:outline-none cursor-pointer"
                        >
                          Découvrir la Collection
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div 
                            key={item.id} 
                            className="bg-[#050505] border border-white/5 p-4 flex items-center gap-4 shadow-lg"
                          >
                            <div className="w-16 h-20 bg-black border border-white/5 shrink-0 overflow-hidden">
                              <img
                                src={item.perfume.image}
                                alt={item.perfume.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>

                            <div className="flex-1">
                              <span className="text-[8px] tracking-widest text-[#b8860b] uppercase font-bold block">{item.perfume.category}</span>
                              <h4 className="text-xs sm:text-sm font-semibold text-stone-100 tracking-wide font-sans">{item.perfume.name}</h4>
                              <span className="text-[10px] text-stone-400 font-semibold">{item.size}</span>
                              <div className="text-xs font-semibold text-white mt-1">{item.price} €</div>
                            </div>

                            <div className="flex flex-col items-center justify-between h-full gap-3">
                              <div className="flex items-center border border-white/15 bg-black">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 py-0.5 text-[#b8860b] hover:bg-white/5 focus:outline-none cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="px-2 text-xs font-semibold text-stone-200">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 py-0.5 text-[#b8860b] hover:bg-white/5 focus:outline-none cursor-pointer"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-stone-500 hover:text-red-400 p-1 rounded transition-colors focus:outline-none cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* White glove notice */}
                        <div className="border border-white/5 bg-white/5 p-4 flex gap-3 mt-6">
                          <Gift className="w-5 h-5 text-[#b8860b] shrink-0 stroke-[1.5]" />
                          <div>
                            <span className="text-[10px] tracking-wider text-[#b8860b] uppercase font-bold block">Écrin de Cérémonie Dior</span>
                            <p className="text-[10px] text-stone-300 font-sans leading-relaxed mt-1">
                              Vos flacons seront parfumés, scellés de cire rouge et enveloppés sous papier de soie et ruban tressé, offerts à la commande.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* STEP 2: DELIVERY SHIPPING FORM */}
                {checkoutStep === "delivery" && (
                  <div className="space-y-4 font-sans text-xs">
                    <p className="text-stone-400 font-serif italic mb-4">
                      Veuillez inscrire vos coordonnées pour notre service de livraison à domicile par porteur en gants blancs.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Prénom *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.firstName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                          className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Nom *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.lastName}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                          className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Adresse Email *</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                        className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Adresse de résidence *</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                        className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                        placeholder="Rue, avenue, étage..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Code Postal *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold block mb-1">Ville *</label>
                        <input
                          type="text"
                          required
                          value={shippingInfo.city}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                          className="w-full p-2.5 border border-white/5 bg-[#050505] text-white focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                    </div>

                    {/* Gift wrap checkbox */}
                    <div className="pt-4 border-t border-white/5 mt-6">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shippingInfo.giftOption}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, giftOption: e.target.checked })}
                          className="w-4.5 h-4.5 accent-[#b8860b] cursor-pointer"
                        />
                        <span className="text-[10px] tracking-widest uppercase text-white font-bold flex items-center gap-1.5">
                          <Gift className="w-4 h-4 text-[#b8860b]" /> Emballage cadeau Maison offert
                        </span>
                      </label>

                      {shippingInfo.giftOption && (
                        <div className="mt-3">
                          <label className="text-[8.5px] tracking-widest text-stone-400 uppercase font-bold block mb-1">Lettre poétique jointe</label>
                          <textarea
                            placeholder="Saisissez le mot doux à inscrire à la plume calligraphique..."
                            value={shippingInfo.giftMessage}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, giftMessage: e.target.value })}
                            className="w-full p-2.5 border border-white/5 bg-[#050505] text-white text-xs focus:outline-none focus:border-[#b8860b] font-serif italic"
                            rows={3}
                          />
                        </div>
                      )}
                    </div>

                    {/* Secure payment pledge */}
                    <div className="bg-black/55 p-3 text-[10px] text-stone-300 font-sans tracking-wide leading-relaxed border-l-2 border-[#b8860b] flex items-center gap-2 mt-4 select-none">
                      <Lock className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                      <span>Transaction confidentielle cryptée selon les normes de la Haute Parfumerie.</span>
                    </div>
                  </div>
                )}

                {/* STEP 3: ORDER SUCCESS CONGRATULATIONS */}
                {checkoutStep === "confirmation" && (
                  <div className="text-center py-6 font-sans flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.5, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-20 h-20 rounded-full border-4 border-[#b8860b] bg-black flex items-center justify-center text-[#b8860b] shadow-2xl mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12 stroke-[1.5]" />
                    </motion.div>

                    <span className="text-[8px] tracking-[0.4em] text-[#b8860b] uppercase font-bold block mb-1">Atelier Élixir Paris</span>
                    <h3 className="font-cinzel text-base tracking-widest text-white uppercase font-bold">
                      Commande Enregistrée
                    </h3>
                    
                    <p className="text-[11px] text-[#b8860b] font-mono tracking-widest mt-1">
                      SCEAU DE SÉCURITÉ : N° ELX-{Math.floor(Math.random() * 900000 + 100000)}
                    </p>

                    <p className="text-stone-300 font-serif italic text-xs leading-relaxed mt-4 max-w-sm">
                      "Nous vous remercions chaleureusement pour votre confiance, cher {shippingInfo.firstName || "client"}. Notre maître gantier extrait les fioles de nos alcôves scellées. Un récépissé d'envoi scellé vient de vous être envoyé à {shippingInfo.email || "votre email"}."
                    </p>

                    {/* Interactive delivery ticket mockup info */}
                    <div className="w-full border border-white/5 bg-black/45 text-stone-200 text-left p-5 mt-8 select-none shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-[#b8860b]/10 text-[#b8860b] font-bold uppercase text-[7px] tracking-widest rounded-bl-sm border-l border-b border-[#b8860b]/10">
                        PORT COUTURE REPRÉSENTÉ
                      </div>

                      <h4 className="text-[9px] tracking-widest text-[#b8860b] uppercase font-bold border-b border-white/5 pb-2 mb-3 font-sans">
                        RÉCÉPISSÉ DE COURRIER DE LUXE
                      </h4>

                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold uppercase text-[8px] tracking-wider">Destinataire :</span>
                          <span className="text-white font-bold">{shippingInfo.firstName} {shippingInfo.lastName || "L'Amateur d'Élégance"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold uppercase text-[8px] tracking-wider">Adresse :</span>
                          <span className="text-white text-right font-medium max-w-[200px] line-clamp-1">{shippingInfo.address}, {shippingInfo.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400 font-semibold uppercase text-[8px] tracking-wider">Écrin Cadeau :</span>
                          <span className="text-stone-200 font-bold text-xs">{shippingInfo.giftOption ? "Oui, Coffret Plissé Couture" : "Option Standard"}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-white/5">
                          <span className="text-stone-400 font-bold uppercase text-[8px] tracking-widest">Achat Total :</span>
                          <span className="text-[#b8860b] font-black text-xs">{total} € (Payé)</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={resetProcess}
                      className="mt-8 w-full bg-[#b8860b] text-black font-bold hover:bg-[#8b6508] py-4 text-xs tracking-widest uppercase font-semibold transition-all focus:outline-none cursor-pointer"
                    >
                      Terminer la Consultation
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Summary - Billing calculations inside Checkout overlay */}
              {cartItems.length > 0 && checkoutStep !== "confirmation" && (
                <div className="p-6 border-t border-white/5 bg-[#050505] shadow-inner-top">
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex justify-between text-stone-400">
                      <span>Sous-total flacons</span>
                      <span className="font-semibold text-white">{subtotal} €</span>
                    </div>
                    <div className="flex justify-between text-stone-400">
                      <span>Coursier de prestige (Gants blancs)</span>
                      <span>{shippingCost === 0 ? <strong className="text-emerald-400 uppercase tracking-widest text-[9px] font-bold">OFFERT</strong> : `${shippingCost} €`}</span>
                    </div>
                    
                    {shippingCost > 0 && (
                      <p className="text-[10px] text-[#b8860b] italic font-serif mt-1">
                        * Ajoutez {150 - subtotal} € de flacons pour débloquer les frais de ports offerts.
                      </p>
                    )}

                    <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/5">
                      <span>Total Consigné</span>
                      <span className="text-base font-black text-[#b8860b]">{total} €</span>
                    </div>
                  </div>

                  {checkoutStep === "cart" && (
                    <button
                      onClick={handleNextStep}
                      className="w-full bg-[#b8860b] text-black font-semibold hover:bg-[#8b6508] py-4 text-xs tracking-[0.22em] uppercase font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
                    >
                      Procéder au paiement
                      <ChevronRight className="w-4 h-4 text-black" />
                    </button>
                  )}

                  {checkoutStep === "delivery" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckoutStep("cart")}
                        className="border border-white/10 hover:bg-white/5 text-stone-300 px-4 text-xs tracking-widest uppercase font-light focus:outline-none cursor-pointer"
                      >
                        Retour
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="flex-1 bg-[#b8860b] text-black py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#8b6508] transition-all flex items-center justify-center gap-1 focus:outline-none cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4 stroke-[1.2] text-black" /> Confirmer l'Expédition d'Or
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
