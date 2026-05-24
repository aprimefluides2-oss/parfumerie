import { useEffect, useState } from "react";
import type { LayerNote } from "../types";
import { createNote, deleteNote, getLayering, updateNote } from "./api";

function empty(): LayerNote {
  return { id: "", name: "", category: "tête", description: "", intensity: 3 };
}

export default function LayeringEditor() {
  const [notes, setNotes] = useState<LayerNote[]>([]);
  const [editing, setEditing] = useState<LayerNote | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      setNotes(await getLayering());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.id || !editing.name) {
      setError("id et nom requis");
      return;
    }
    setError(null);
    try {
      if (isNew) await createNote(editing);
      else await updateNote(editing.id, editing);
      setEditing(null);
      setIsNew(false);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Supprimer "${id}" ?`)) return;
    try {
      await deleteNote(id);
      await refresh();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const labelCls = "block text-[11px] uppercase tracking-wider text-stone-500 mb-1 font-semibold";
  const inputCls = "w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white";

  if (loading) return <div className="text-stone-500 text-sm">Chargement...</div>;

  return (
    <div className="space-y-4">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{error}</div>}

      <div className="flex justify-between items-center">
        <h2 className="font-cinzel text-lg uppercase tracking-widest">Notes de layering</h2>
        <button
          onClick={() => { setEditing(empty()); setIsNew(true); }}
          className="px-4 py-2 bg-stone-900 text-white text-sm uppercase tracking-wider rounded hover:bg-stone-700"
        >
          + Nouvelle note
        </button>
      </div>

      {editing && (
        <div className="bg-white p-5 rounded-lg shadow-sm border border-stone-200 space-y-3">
          <h3 className="font-semibold">{isNew ? "Nouvelle note" : `Éditer · ${editing.name}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Identifiant</label>
              <input
                className={inputCls}
                value={editing.id}
                onChange={e => setEditing({ ...editing, id: e.target.value })}
                disabled={!isNew}
                placeholder="note_xxx"
              />
            </div>
            <div>
              <label className={labelCls}>Nom</label>
              <input className={inputCls} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Catégorie</label>
              <select
                className={inputCls}
                value={editing.category}
                onChange={e => setEditing({ ...editing, category: e.target.value as any })}
              >
                <option value="tête">tête</option>
                <option value="cœur">cœur</option>
                <option value="fond">fond</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Intensité (1-5)</label>
              <input
                type="number" min={1} max={5}
                className={inputCls}
                value={editing.intensity}
                onChange={e => setEditing({ ...editing, intensity: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={inputCls + " min-h-[70px]"}
              value={editing.description}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setEditing(null); setIsNew(false); }} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900">
              Annuler
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-700">
              Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-100 text-[11px] uppercase tracking-wider text-stone-600">
            <tr>
              <th className="text-left px-3 py-2">id</th>
              <th className="text-left px-3 py-2">Nom</th>
              <th className="text-left px-3 py-2">Cat.</th>
              <th className="text-left px-3 py-2">Intensité</th>
              <th className="text-right px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {notes.map(n => (
              <tr key={n.id} className="border-t border-stone-100 hover:bg-stone-50">
                <td className="px-3 py-2 font-mono text-xs text-stone-500">{n.id}</td>
                <td className="px-3 py-2">{n.name}</td>
                <td className="px-3 py-2">{n.category}</td>
                <td className="px-3 py-2">{"★".repeat(n.intensity)}</td>
                <td className="px-3 py-2 text-right space-x-3">
                  <button className="text-amber-700 hover:text-amber-900 text-xs" onClick={() => { setEditing(n); setIsNew(false); }}>
                    Éditer
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-xs" onClick={() => handleDelete(n.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {notes.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-stone-400">Aucune note</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
