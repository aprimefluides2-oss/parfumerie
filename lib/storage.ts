import fs from "fs/promises";
import path from "path";

type AnyArr = any[];

const isVercel = !!process.env.VERCEL;
const hasKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

const DATA_DIR = path.join(process.cwd(), "data");
const PERFUMES_FILE = path.join(DATA_DIR, "perfumes.json");
const LAYERING_FILE = path.join(DATA_DIR, "layering.json");

const KEY_PERFUMES = "elixir:perfumes";
const KEY_LAYERING = "elixir:layering";

// Lazy import to avoid loading @vercel/kv unless actually needed (and avoid
// breaking the function bundle on Vercel when KV isn't configured yet).
async function getKv() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function readLocal(file: string): Promise<AnyArr> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeLocal(file: string, data: AnyArr): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

async function readKv(key: string): Promise<AnyArr> {
  const kv = await getKv();
  const data = await kv.get<AnyArr>(key);
  return Array.isArray(data) ? data : [];
}

async function writeKv(key: string, data: AnyArr): Promise<void> {
  const kv = await getKv();
  await kv.set(key, data);
}

export async function getPerfumes(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_PERFUMES);
  return readLocal(PERFUMES_FILE);
}

export async function setPerfumes(data: AnyArr): Promise<void> {
  if (isVercel && hasKv) return writeKv(KEY_PERFUMES, data);
  return writeLocal(PERFUMES_FILE, data);
}

export async function getLayering(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_LAYERING);
  return readLocal(LAYERING_FILE);
}

export async function setLayering(data: AnyArr): Promise<void> {
  if (isVercel && hasKv) return writeKv(KEY_LAYERING, data);
  return writeLocal(LAYERING_FILE, data);
}

export function assertStorageReady() {
  if (isVercel && !hasKv) {
    throw new Error(
      "Vercel KV n'est pas configuré. Ajoute KV_REST_API_URL et KV_REST_API_TOKEN dans les variables d'environnement Vercel."
    );
  }
}
