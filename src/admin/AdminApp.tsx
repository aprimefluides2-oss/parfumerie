import { useState } from "react";
import PerfumeList from "./PerfumeList";
import LayeringEditor from "./LayeringEditor";

type Tab = "perfumes" | "layering";

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>("perfumes");

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-0">
          <h1 className="font-cinzel text-sm sm:text-base tracking-widest uppercase truncate">
            <span className="hidden sm:inline">Maison Élixir · </span>Back-office
          </h1>
          <a href="/" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-stone-900 text-xs whitespace-nowrap">
            Voir le site →
          </a>
        </div>
        <nav className="flex gap-1 sm:hidden">
          <button
            onClick={() => setTab("perfumes")}
            className={`flex-1 px-3 py-2 text-xs uppercase tracking-wider rounded ${tab === "perfumes" ? "bg-stone-900 text-white" : "text-stone-600 bg-stone-100"}`}
          >
            Parfums
          </button>
          <button
            onClick={() => setTab("layering")}
            className={`flex-1 px-3 py-2 text-xs uppercase tracking-wider rounded ${tab === "layering" ? "bg-stone-900 text-white" : "text-stone-600 bg-stone-100"}`}
          >
            Layering
          </button>
        </nav>
        <nav className="hidden sm:flex gap-1 mt-2">
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
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {tab === "perfumes" && <PerfumeList />}
        {tab === "layering" && <LayeringEditor />}
      </main>
    </div>
  );
}
