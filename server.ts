/**
 * Local-dev only: runs Vite middleware + thin Express wrappers around
 * the same handler logic as the Vercel API functions.
 * Production traffic goes through Vercel Functions (api/*.ts), not this file.
 */
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import perfumesIndex from "./api/perfumes/index";
import perfumesById from "./api/perfumes/[id]";
import layeringIndex from "./api/layering/index";
import layeringById from "./api/layering/[id]";
import adminLogin from "./api/admin/login";
import adminUpload from "./api/admin/upload";
import conseiller from "./api/conseiller";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Adapt a Vercel-style handler (req, res) to an Express route.
// VercelRequest extends IncomingMessage so most fields just work; we
// only need to make sure req.query has the right shape for dynamic routes.
type AnyHandler = (req: any, res: any) => any;
function wrap(handler: AnyHandler) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res);
    } catch (err) {
      next(err);
    }
  };
}

app.all("/api/perfumes", wrap(perfumesIndex));
app.all("/api/perfumes/:id", wrap((req: Request, res: Response) => {
  (req as any).query = { ...req.query, id: req.params.id };
  return (perfumesById as AnyHandler)(req, res);
}));
app.all("/api/layering", wrap(layeringIndex));
app.all("/api/layering/:id", wrap((req: Request, res: Response) => {
  (req as any).query = { ...req.query, id: req.params.id };
  return (layeringById as AnyHandler)(req, res);
}));
app.post("/api/admin/login", wrap(adminLogin));
app.post("/api/admin/upload", wrap(adminUpload));
app.post("/api/conseiller", wrap(conseiller));

async function startServer() {
  // Rewrite /admin -> /admin.html so Vite serves the right multi-page entry.
  app.use((req, _res, next) => {
    if (req.url === "/admin" || req.url === "/admin/") req.url = "/admin.html";
    next();
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server launched on http://localhost:${PORT}`);
    console.log(`Admin back-office: http://localhost:${PORT}/admin`);
  });
}

startServer();
