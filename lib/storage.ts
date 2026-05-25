import fs from "fs/promises";
import path from "path";
import { SEED_PERFUMES, SEED_LAYERING } from "./seed.js";

type AnyArr = any[];

const isVercel = !!process.env.VERCEL;
const hasKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

const DATA_DIR = path.join(process.cwd(), "data");
const PERFUMES_FILE = path.join(DATA_DIR, "perfumes.json");
const LAYERING_FILE = path.join(DATA_DIR, "layering.json");

const KEY_PERFUMES = "elixir:perfumes";
const KEY_LAYERING = "elixir:layering";

// Lazy dynamic import — keeps the function bundle small and resilient
// when @vercel/kv isn't actually invoked.
async function getKv() {
  const mod = await import("@vercel/kv");
  return mod.kv;
}

async function readLocal(file: string, seed: AnyArr): Promise<AnyArr> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

async function writeLocal(file: string, data: AnyArr): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

async function readKv(key: string, seed: AnyArr): Promise<AnyArr> {
  const kv = await getKv();
  const data = await kv.get<AnyArr>(key);
  if (data && Array.isArray(data)) return data;
  await kv.set(key, seed);
  return seed;
}

async function writeKv(key: string, data: AnyArr): Promise<void> {
  const kv = await getKv();
  await kv.set(key, data);
}

export async function getPerfumes(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_PERFUMES, SEED_PERFUMES);
  if (isVercel) return SEED_PERFUMES; // no KV → show seed in read-only
  return readLocal(PERFUMES_FILE, SEED_PERFUMES);
}

export async function setPerfumes(data: AnyArr): Promise<void> {
  if (isVercel && hasKv) return writeKv(KEY_PERFUMES, data);
  if (isVercel) throw new StorageNotPersistedError();
  return writeLocal(PERFUMES_FILE, data);
}

export async function getLayering(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_LAYERING, SEED_LAYERING);
  if (isVercel) return SEED_LAYERING;
  return readLocal(LAYERING_FILE, SEED_LAYERING);
}

export async function setLayering(data: AnyArr): Promise<void> {
  if (isVercel && hasKv) return writeKv(KEY_LAYERING, data);
  if (isVercel) throw new StorageNotPersistedError();
  return writeLocal(LAYERING_FILE, data);
}

export class StorageNotPersistedError extends Error {
  constructor() {
    super(
      "Vercel KV n'est pas configuré : les lectures fonctionnent en mode démo, mais les modifications ne peuvent pas être sauvegardées. Active KV dans Storage → Create Database sur le dashboard Vercel."
    );
    this.name = "StorageNotPersistedError";
  }
}

export function assertStorageReady() {
  // No-op : reads work without KV (seed fallback), writes throw on demand.
}
