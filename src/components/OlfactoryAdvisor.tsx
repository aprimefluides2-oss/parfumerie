import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  User, 
  ChevronRight, 
  Trash2, 
  Clock, 
  Droplets,
  AlertCircle
} from "lucide-react";
import { ChatMessage, Perfume } from "../types";
import { PERFUMES } from "../perfumesData";

interface OlfactoryAdvisorProps {
  onSelectPerfume: (perfume: Perfume) => void;
}

export default function OlfactoryAdvisor({ onSelectPerfume }: OlfactoryAdvisorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Bonjour. Je suis l'Expert Virtuel en Parfumerie de la Maison Élixir de Paris. \n\nInstallez-vous dans notre salon de consultation. Décrivez-moi un souvenir précieux, une humeur recherchée, votre style vestimentaire ou vos notes de prédilection... Laissez-moi traduire votre âme en un sillage poétique d'exception.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendedPerfume, setRecommendedPerfume] = useState<Perfume | null>(null);
  const [userProfile, setUserProfile] = useState({
    mood: "",
    style: "",
    notes: ""
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const starterChips = [
    { label: "Un floral lumineux pour le printemps", value: "Je recherche une essence florale très lumineuse, tendre et pétillante pour célébrer le retour du printemps." },
    { label: "Un boisé sombre pour homme mystérieux", value: "Quel sillage boisé sauvage, sombre et intense conseilleriez-vous pour un homme de caractère ?" },
    { label: "Une fragrance mystique d'Oud et d'Encens", value: "Je suis passionné de haute parfumerie sacrée et d'accords d'Orient mêlant le Oud, l'Ambre et l'encens impérial." },
    { label: "Un sillage luxueux pour une soirée noble", value: "Conseillez-moi une fragrance majestueuse, solaire et royale pour un gala de couture ou un grand mariage à Paris." }
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);
    setRecommendedPerfume(null);

    // Call the server API
    try {
      // Structure all messages for context flow
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch("/api/conseiller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: apiMessages,
          userProfile: userProfile
        })
      });

      if (!response.ok) {
        throw new Error("Erreur de communication avec l'expert olfactif");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Look up matched perfume details if returned
      if (data.matchedPerfume) {
        const perf = PERFUMES.find(p => p.id === data.matchedPerfume);
        if (perf) {
          setRecommendedPerfume(perf);
        }
      }
    } catch (err) {
      console.error("Error chatting with Olfactory Advisor:", err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Veuillez m'excuser, la fiole de transmission olfactive s'est obscurcie un instant. Pouvez-vous répéter votre souhait, s'il vous plaît ? Notre atelier reste dévoué à votre écoute.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Notre atelier renaît. Je me tiens de nouveau à votre écoute pour sculpter votre sillage imaginaire. Quel poème parfumons-nous aujourd'hui ?",
        timestamp: new Date()
      }
    ]);
    setRecommendedPerfume(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Visual Section Intro */}
      <div className="text-center mb-10">
        <h3 className="font-cinzel text-[11px] tracking-[0.35em] text-[#b8860b] uppercase mb-2 font-semibold">Technologie Harmonique</h3>
        <h2 className="font-cinzel text-2xl sm:text-3xl font-light tracking-widest text-[#e5e5e5] uppercase mb-4">
          Le Conseil Olfactif Suprême
        </h2>
        <p className="text-[#a1a1a1] font-serif text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto italic">
          "Nos parchemins d'accords s'éclairent par le souffle de l'Intelligence Artificielle. Confiez-lui vos rêveries et laissez la formule cristalliser votre sillage idéal."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Custom settings panel (very Dior-like diagnostics filter) */}
        <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/5 p-6 text-[#e5e5e5] shadow-lg flex flex-col gap-6">
          <div>
            <h4 className="font-cinzel text-xs tracking-[0.2em] uppercase text-white font-bold border-b border-white/5 pb-3 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" /> Filtres Sensoriels IA
            </h4>
            <p className="text-[11px] text-[#a1a1a1] font-sans leading-relaxed mb-4">
              Aidez l'IA à cerner votre signature. Ces détails seront transmis en filigrane à notre Expert Olfactif.
            </p>
          </div>

          <div className="space-y-4">
            {/* Filter 1: Mood */}
            <div>
              <label className="text-[9px] tracking-widest text-stone-300 uppercase font-bold block mb-1">Votre Tempérament</label>
              <select
                value={userProfile.mood}
                onChange={(e) => setUserProfile({ ...userProfile, mood: e.target.value })}
                className="w-full text-xs bg-[#050505] border border-white/5 py-3 px-3 rounded-none focus:outline-none focus:border-[#b8860b] text-[#e5e5e5] font-sans"
              >
                <option value="">Non défini (laisser libre cours)</option>
                <option value="Souverain, Majestueux, Rayonnant">Souverain - Marquant & Royal</option>
                <option value="Romantique, Rêveur, Passionné">Romantique - Tendre & Floral</option>
                <option value="Sauvage, Rebelle, Indomptable">Sauvage - Intense & Libre</option>
                <option value="Mystique, Énigmatique, Rare">Mystique - Collection Confidentielle</option>
              </select>
            </div>

            {/* Filter 2: Clothing/Occasion Style */}
            <div>
              <label className="text-[9px] tracking-widest text-stone-300 uppercase font-bold block mb-1">Votre Silhouette</label>
              <select
                value={userProfile.style}
                onChange={(e) => setUserProfile({ ...userProfile, style: e.target.value })}
                className="w-full text-xs bg-[#050505] border border-white/5 py-3 px-3 rounded-none focus:outline-none focus:border-[#b8860b] text-[#e5e5e5] font-sans"
              >
                <option value="">Non défini</option>
                <option value="Tuxedo haute couture noir, robe de soie somptueuse">Costume Blanc / Robe de Soie Dorée</option>
                <option value="Robes fleuries, lin blanc, bohème chic">Voile de mousseline de Granville</option>
                <option value="Veste en cuir brute, allure urbaine sauvage">Veste de cuir brut d'Aventure</option>
                <option value="Costume d'auteur minimaliste, drapés rares noirs">Minimaliste Noir confidentiel</option>
              </select>
            </div>

            {/* Filter 3: Preferred scents type */}
            <div>
              <label className="text-[9px] tracking-widest text-stone-300 uppercase font-bold block mb-1">Éléments de Prédilection</label>
              <input
                type="text"
                placeholder="Ex: Rose de Mai, Vétiver, Ambre sec..."
                value={userProfile.notes}
                onChange={(e) => setUserProfile({ ...userProfile, notes: e.target.value })}
                className="w-full text-xs bg-[#050505] border border-white/5 py-3 px-3 rounded-none focus:outline-none focus:border-[#b8860b] text-white font-sans placeholder-stone-600"
              />
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-2">
            <div className="bg-[#050505] p-4 text-[10px] text-[#a1a1a1] font-sans leading-relaxed border-l-2 border-[#b8860b] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
              <span>Chaque mot partagé inspire l'intelligence artistique. Nos essences sont issues de cultures responsables à Grasse et Calabre.</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Chat box and matcing preview */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-white/5 shadow-lg flex flex-col h-[520px]">
            {/* Header of Chatbox with clear indicator */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#050505]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h4 className="font-cinzel text-xs tracking-wider uppercase text-white font-bold block">
                    Salon Privé Élixir
                  </h4>
                  <span className="text-[9px] text-[#b8860b] font-mono block">MODÈLE INTELLIGENT DIRECT</span>
                </div>
              </div>

              <button
                onClick={handleClearHistory}
                className="p-2 text-stone-500 hover:text-red-500 hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                title="Effacer la conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans bg-transparent">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-none p-4 ${
                      m.role === "user"
                        ? "bg-[#050505] border border-white/10 text-stone-100"
                        : "bg-white/5 border border-white/5 text-[#e5e5e5]"
                    }`}>
                      {/* Speaker Badge */}
                      <div className="flex items-center gap-1.5 mb-1.5 opacity-65">
                        {m.role === "user" ? (
                          <User className="w-3 h-3 text-stone-400" />
                        ) : (
                          <Sparkles className="w-3 h-3 text-[#b8860b]" />
                        )}
                        <span className="text-[8px] tracking-widest uppercase text-stone-400">
                          {m.role === "user" ? "Votre souhait" : "Conseiller Élixir"}
                        </span>
                      </div>

                      {/* Content text */}
                      <p className={`text-xs leading-relaxed whitespace-pre-wrap ${
                        m.role === "assistant" ? "font-serif italic text-stone-200 text-[13px]" : "font-sans text-stone-100"
                      }`}>
                        {m.content}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-white/5 max-w-[85%] rounded-none p-4">
                      <span className="text-[8px] tracking-widest text-[#a1a1a1] uppercase block mb-2">L'Atelier compose...</span>
                      <div className="flex items-center gap-1">
                        <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                        <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                        <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#b8860b]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={chatEndRef} />
            </div>

            {/* Starter prompts (Chips Layout) */}
            <div className="p-4 border-t border-white/5 flex flex-wrap gap-2 overflow-x-auto bg-[#050505]">
              {starterChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleSendMessage(chip.value)}
                  disabled={isTyping}
                  className="bg-black hover:bg-[#b8860b] hover:text-black border border-white/10 text-[#a1a1a1] text-[9px] tracking-wider uppercase font-light px-3 py-2 transition-all duration-300 disabled:opacity-50 inline-block focus:outline-none cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input form wrapper */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-4 border-t border-white/5 flex gap-2 bg-[#050505]"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Écrivez ici vos aspirations... (Ex: Je veux un sillage boisé et ténébreux...)"
                disabled={isTyping}
                className="flex-1 text-xs border border-white/5 bg-[#0a0a0a] py-3.5 px-4 focus:outline-none focus:border-[#b8860b] font-sans text-white rounded-none disabled:opacity-50 placeholder-stone-600"
              />
              <button
                type="submit"
                disabled={isTyping || !inputValue.trim()}
                className="bg-[#b8860b] text-black hover:bg-[#8b6508] p-3.5 px-6 rounded-none font-sans text-xs uppercase tracking-widest disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 focus:outline-none font-bold cursor-pointer"
              >
                <span>Envoyer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* DYNAMIC MATCHED REAL-TIME PERFUME CARD DISPLAY */}
          <AnimatePresence>
            {recommendedPerfume && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.98 }}
                className="bg-[#0a0a0a] border border-[#b8860b]/40 rounded-none p-5 flex flex-col sm:flex-row items-center gap-5 shadow-2xl relative overflow-hidden"
              >
                {/* Radiant luxury light splash */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#b8860b]/15 blur-xl rounded-full" />

                <div className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-[#050505] border border-white/10 overflow-hidden">
                  <img
                    src={recommendedPerfume.image}
                    alt={recommendedPerfume.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-[8px] tracking-[0.3em] text-[#b8860b] font-bold uppercase block mb-1">
                    Accord Révélé par l'Expert Olfactif
                  </span>
                  <h4 className="font-cinzel text-base tracking-widest text-white uppercase font-bold">
                    {recommendedPerfume.name}
                  </h4>
                  <p className="text-[10px] text-stone-400 uppercase font-sans tracking-wider mt-0.5">
                    {recommendedPerfume.category} · {recommendedPerfume.gender}
                  </p>
                  <p className="text-[11px] font-serif text-stone-300 italic mt-2">
                    "{recommendedPerfume.subtitle}"
                  </p>
                </div>

                <button
                  onClick={() => onSelectPerfume(recommendedPerfume)}
                  className="bg-[#b8860b] text-black font-bold hover:bg-[#8b6508] text-[10px] tracking-widest uppercase px-5 py-3 h-fit flex items-center gap-1 rounded-none select-none focus:outline-none cursor-pointer"
                >
                  Dévoiler le Flacon
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
