import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import type { Perfume, LayerNote } from "./types";

interface PerfumesContextValue {
  perfumes: Perfume[];
  layering: LayerNote[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const PerfumesContext = createContext<PerfumesContextValue>({
  perfumes: [],
  layering: [],
  loading: true,
  refresh: async () => {},
});

export function PerfumesProvider({ children }: { children: ReactNode }) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [layering, setLayering] = useState<LayerNote[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, l] = await Promise.all([
        fetch("/api/perfumes").then(r => r.json()),
        fetch("/api/layering").then(r => r.json()),
      ]);
      setPerfumes(p);
      setLayering(l);
    } catch (err) {
      console.error("Failed to load perfumes/layering:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <PerfumesContext.Provider value={{ perfumes, layering, loading, refresh }}>
      {children}
    </PerfumesContext.Provider>
  );
}

export function usePerfumes() {
  return useContext(PerfumesContext);
}
