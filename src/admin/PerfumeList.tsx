import { useEffect, useState } from "react";
import type { Perfume } from "../types";
import { createPerfume, deletePerfume, getPerfumes, updatePerfume } from "./api";
import PerfumeForm from "./PerfumeForm";

export default function PerfumeList() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [editing, setEditing] = useState<Perfume | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setPerfumes(await getPerfumes());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (p: Perfume) => {
    if (creating) {
      await createPerfume(p);
    } else if (editing) {
      await updatePerfume(editing.id, p);
    }
    setEditing(null);
    setCreating(false);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Supprimer le parfum "${id}" ?`)) return;
    try {
      await deletePerfume(id);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div className="text-stone-500 text-sm">Chargement...</div>;

  if (creating) {
    return <PerfumeForm initial={{}} isNew onSubmit={handleSubmit} onCancel={() => setCreating(false)} />;
  }
  if (editing) {
    return <PerfumeForm initial={editing} isNew={false} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="font-cinzel text-base sm:text-lg uppercase tracking-widest">Parfums ({perfumes.length})</h2>
        <button
          onClick={() => setCreating(true)}
          className="w-full sm:w-auto px-4 py-2 bg-stone-900 text-white text-sm uppercase tracking-wider rounded hover:bg-stone-700"
        >
          + Nouveau parfum
        </button>
      </div>

      {/* Mobile: stacked cards */}
      <div className="sm:hidden space-y-3">
        {perfumes.map(p => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
            <div className="flex gap-3">
              {p.image && <img src={p.image} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{p.name}</div>
                <div className="text-xs text-stone-500 font-mono">{p.id}</div>
                <div className="text-xs text-stone-600 mt-1">{p.category} · {p.gender}</div>
              </div>
            </div>
            <div className="text-xs text-stone-600 mt-2 break-words">
              {(p.priceSizes || []).map(ps => `${ps.size}: ${ps.price}€`).join(" · ")}
            </div>
            <div className="flex gap-3 mt-3 pt-3 border-t border-stone-100">
              <button onClick={() => setEditing(p)} className="flex-1 text-amber-700 hover:text-amber-900 text-xs font-semibold py-2">
                Éditer
              </button>
              <button onClick={() => handleDelete(p.id)} className="flex-1 text-red-600 hover:text-red-800 text-xs font-semibold py-2">
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {perfumes.length === 0 && (
          <div className="bg-white rounded-lg border border-stone-200 px-3 py-6 text-center text-stone-400">Aucun parfum</div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-stone-100 text-[11px] uppercase tracking-wider text-stone-600">
            <tr>
              <th className="text-left px-3 py-2 w-16"></th>
              <th className="text-left px-3 py-2">Nom</th>
              <th className="text-left px-3 py-2">Catégorie</th>
              <th className="text-left px-3 py-2">Genre</th>
              <th className="text-left px-3 py-2">Prix (formats)</th>
              <th className="text-right px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {perfumes.map(p => (
              <tr key={p.id} className="border-t border-stone-100 hover:bg-stone-50">
                <td className="px-3 py-2">
                  {p.image && <img src={p.image} alt="" className="w-12 h-12 object-cover rounded" />}
                </td>
                <td className="px-3 py-2">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-stone-500 font-mono">{p.id}</div>
                </td>
                <td className="px-3 py-2">{p.category}</td>
                <td className="px-3 py-2">{p.gender}</td>
                <td className="px-3 py-2 text-xs">
                  {(p.priceSizes || []).map(ps => `${ps.size}: ${ps.price}€`).join(" · ")}
                </td>
                <td className="px-3 py-2 text-right space-x-3 whitespace-nowrap">
                  <button className="text-amber-700 hover:text-amber-900 text-xs" onClick={() => setEditing(p)}>
                    Éditer
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-xs" onClick={() => handleDelete(p.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {perfumes.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-stone-400">Aucun parfum</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
