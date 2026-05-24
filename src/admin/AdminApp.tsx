import { useState, FormEvent } from "react";
import { clearAdminPassword, getAdminPassword, login } from "./api";
import PerfumeList from "./PerfumeList";
import LayeringEditor from "./LayeringEditor";

type Tab = "perfumes" | "layering";

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean>(!!getAdminPassword());
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("perfumes");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const ok = await login(password);
      if (ok) {
        setAuthed(true);
        setPassword("");
      } else {
        setLoginError("Mot de passe incorrect.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Erreur de connexion.");
    }
  };

  const handleLogout = () => {
    clearAdminPassword();
    setAuthed(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow border border-stone-200 p-8 w-full max-w-sm space-y-4">
          <div className="text-center">
            <h1 className="font-cinzel text-2xl tracking-widest uppercase">Maison Élixir</h1>
            <p className="text-xs uppercase tracking-wider text-stone-500 mt-1">Back-office administrateur</p>
          </div>
          {loginError && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">{loginError}</div>}
          <input
            type="password"
            placeholder="Mot de passe administrateur"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-stone-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            required
          />
          <button
            type="submit"
            className="w-full px-5 py-2 bg-stone-900 text-white text-sm uppercase tracking-wider rounded hover:bg-stone-700"
          >
            Se connecter
          </button>
          <p className="text-[10px] text-stone-400 text-center">
            Mot de passe défini via <code>ADMIN_PASSWORD</code> dans <code>.env</code> (défaut : <code>admin</code>)
          </p>
        </form>
      </div>
    );
  }

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
          <button onClick={handleLogout} className="text-stone-500 hover:text-stone-900">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "perfumes" && <PerfumeList />}
        {tab === "layering" && <LayeringEditor />}
      </main>
    </div>
  );
}
