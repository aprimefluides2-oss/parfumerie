import { useState } from "react";
import PerfumeList from "./PerfumeList";
import LayeringEditor from "./LayeringEditor";

type Tab = "perfumes" | "layering";

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>("perfumes");

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-cinzel text-base tracking-widest uppercase">Maison Élixir · Back-office</h1>
          <nav className="flex gap-1">
            <button
              onClick={() => setTab("perfumes")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded ${tab === "perfumes" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}
            >
              Parfums
            </button>
            <button
              onClick={() => setTab("layering")}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded ${tab === "layering" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"}`}
            >
              Notes layering
            </button>
          </nav>
        </div>
        <div className="flex gap-4 items-center text-xs">
          <a href="/" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-stone-900">
            Voir le site →
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "perfumes" && <PerfumeList />}
        {tab === "layering" && <LayeringEditor />}
      </main>
    </div>
  );
}
