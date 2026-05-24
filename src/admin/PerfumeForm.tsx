import { useState, FormEvent } from "react";
import type { Perfume, PriceSize } from "../types";
import { uploadImage } from "./api";

interface Props {
  initial: Partial<Perfume>;
  isNew: boolean;
  onSubmit: (p: Perfume) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_THEME = {
  bg: "bg-amber-500",
  text: "text-amber-900",
  accent: "#D4AF37",
  bgLight: "bg-[#FAF8F2]",
  border: "border-amber-200",
};

function emptyPerfume(): Partial<Perfume> {
  return {
    id: "",
    name: "",
    subtitle: "",
    category: "Collection Féminine",
    gender: "Féminin",
    description: "",
    extendedDescription: "",
    priceSizes: [{ size: "50 ml", price: 100 }],
    intensity: 3,
    longevity: "",
    season: "",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    image: "",
    colorTheme: { ...DEFAULT_THEME },
    signatureNote: "",
    quote: "",
  };
}

export default function PerfumeForm({ initial, isNew, onSubmit, onCancel }: Props) {
  const [data, setData] = useState<Partial<Perfume>>({ ...emptyPerfume(), ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Perfume>(k: K, v: Perfume[K]) => setData(d => ({ ...d, [k]: v }));

  const setNotes = (k: "topNotes" | "heartNotes" | "baseNotes", v: string) =>
    set(k, v.split(",").map(s => s.trim()).filter(Boolean) as any);

  const setTheme = <K extends keyof Perfume["colorTheme"]>(k: K, v: string) =>
    set("colorTheme", { ...(data.colorTheme || DEFAULT_THEME), [k]: v });

  const setPriceSize = (i: number, field: keyof PriceSize, v: string) => {
    const next = [...(data.priceSizes || [])];
    next[i] = { ...next[i], [field]: field === "price" ? Number(v) : v } as PriceSize;
    set("priceSizes", next);
  };
  const addPriceSize = () => set("priceSizes", [...(data.priceSizes || []), { size: "", price: 0 }]);
  const removePriceSize = (i: number) => set("priceSizes", (data.priceSizes || []).filter((_, idx) => idx !== i));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      set("image", url);
    } catch (e: any) {
      setError(e.message || "Upload échoué");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!data.id || !data.name) throw new Error("id et nom requis");
      await onSubmit(data as Perfume);
    } catch (err: any) {
      setError(err.message || "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const labelCls = "block text-[11px] uppercase tracking-wider text-stone-500 mb-1 font-semibold";
  const inputCls = "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-stone-200">
      <div className="flex justify-between items-center border-b border-stone-200 pb-3">
        <h2 className="font-cinzel text-lg uppercase tracking-widest">
          {isNew ? "Nouveau parfum" : `Éditer · ${data.name}`}
        </h2>
        <button type="button" onClick={onCancel} className="text-stone-500 hover:text-stone-900 text-sm">
          ← Retour
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Identifiant (slug, unique)</label>
          <input
            className={inputCls}
            value={data.id || ""}
            onChange={e => set("id", e.target.value as any)}
            disabled={!isNew}
            required
            placeholder="ex: gold, rose..."
          />
        </div>
        <div>
          <label className={labelCls}>Nom</label>
          <input className={inputCls} value={data.name || ""} onChange={e => set("name", e.target.value)} required />
        </div>
      </div>

      <div>
        <label className={labelCls}>Sous-titre</label>
        <input className={inputCls} value={data.subtitle || ""} onChange={e => set("subtitle", e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Catégorie</label>
          <select className={inputCls} value={data.category} onChange={e => set("category", e.target.value as any)}>
            <option>Collection Féminine</option>
            <option>Collection Masculine</option>
            <option>Collection Privée</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Genre</label>
          <select className={inputCls} value={data.gender} onChange={e => set("gender", e.target.value as any)}>
            <option>Féminin</option>
            <option>Masculin</option>
            <option>Unisexe</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Intensité (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            className={inputCls}
            value={data.intensity}
            onChange={e => set("intensity", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Description courte</label>
        <textarea
          className={inputCls + " min-h-[80px]"}
          value={data.description || ""}
          onChange={e => set("description", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Description étendue (fiche produit)</label>
        <textarea
          className={inputCls + " min-h-[120px]"}
          value={data.extendedDescription || ""}
          onChange={e => set("extendedDescription", e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Formats & prix (€)</label>
        <div className="space-y-2">
          {(data.priceSizes || []).map((ps, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className={inputCls + " flex-1"}
                placeholder="50 ml"
                value={ps.size}
                onChange={e => setPriceSize(i, "size", e.target.value)}
              />
              <input
                className={inputCls + " w-32"}
                type="number"
                placeholder="125"
                value={ps.price}
                onChange={e => setPriceSize(i, "price", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removePriceSize(i)}
                className="text-red-600 hover:text-red-800 px-2"
                aria-label="Supprimer ce format"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPriceSize}
            className="text-sm text-amber-700 hover:text-amber-900 border border-amber-300 px-3 py-1 rounded"
          >
            + Ajouter un format
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Longévité</label>
          <input className={inputCls} value={data.longevity || ""} onChange={e => set("longevity", e.target.value)} placeholder="Absolue (12h+)" />
        </div>
        <div>
          <label className={labelCls}>Saison</label>
          <input className={inputCls} value={data.season || ""} onChange={e => set("season", e.target.value)} placeholder="Toutes saisons" />
        </div>
      </div>

      <div>
        <label className={labelCls}>Notes de tête (séparées par des virgules)</label>
        <input className={inputCls} value={(data.topNotes || []).join(", ")} onChange={e => setNotes("topNotes", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Notes de cœur</label>
        <input className={inputCls} value={(data.heartNotes || []).join(", ")} onChange={e => setNotes("heartNotes", e.target.value)} />
      </div>
      <div>
        <label className={labelCls}>Notes de fond</label>
        <input className={inputCls} value={(data.baseNotes || []).join(", ")} onChange={e => setNotes("baseNotes", e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Note signature</label>
        <input className={inputCls} value={data.signatureNote || ""} onChange={e => set("signatureNote", e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Citation</label>
        <textarea className={inputCls} value={data.quote || ""} onChange={e => set("quote", e.target.value)} />
      </div>

      <div>
        <label className={labelCls}>Image</label>
        <div className="flex gap-3 items-start">
          {data.image && (
            <img src={data.image} alt="" className="w-24 h-24 object-cover rounded border border-stone-200" />
          )}
          <div className="flex-1 space-y-2">
            <input
              className={inputCls}
              value={data.image || ""}
              onChange={e => set("image", e.target.value)}
              placeholder="/uploads/... ou URL externe"
            />
            <label className="inline-block text-sm cursor-pointer text-amber-700 hover:text-amber-900 border border-amber-300 px-3 py-1 rounded">
              {uploading ? "Téléversement..." : "📁 Charger une image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>

      <fieldset className="border border-stone-200 rounded p-4">
        <legend className="text-[11px] uppercase tracking-wider text-stone-500 px-2 font-semibold">Thème couleur</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>bg (classe Tailwind)</label>
            <input className={inputCls} value={data.colorTheme?.bg || ""} onChange={e => setTheme("bg", e.target.value)} placeholder="bg-amber-500" />
          </div>
          <div>
            <label className={labelCls}>text</label>
            <input className={inputCls} value={data.colorTheme?.text || ""} onChange={e => setTheme("text", e.target.value)} placeholder="text-amber-900" />
          </div>
          <div>
            <label className={labelCls}>accent (hex)</label>
            <input className={inputCls} value={data.colorTheme?.accent || ""} onChange={e => setTheme("accent", e.target.value)} placeholder="#D4AF37" />
          </div>
          <div>
            <label className={labelCls}>bgLight</label>
            <input className={inputCls} value={data.colorTheme?.bgLight || ""} onChange={e => setTheme("bgLight", e.target.value)} placeholder="bg-[#FAF8F2]" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>border</label>
            <input className={inputCls} value={data.colorTheme?.border || ""} onChange={e => setTheme("border", e.target.value)} placeholder="border-amber-200" />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-3 border-t border-stone-200 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900">
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 bg-stone-900 text-white text-sm uppercase tracking-wider rounded hover:bg-stone-700 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : isNew ? "Créer" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
