import fs from "fs/promises";
import path from "path";
import { kv } from "@vercel/kv";
import seedPerfumes from "../../data/perfumes.json";
import seedLayering from "../../data/layering.json";

type AnyArr = any[];

const isVercel = !!process.env.VERCEL;
const hasKv = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

const DATA_DIR = path.join(process.cwd(), "data");
const PERFUMES_FILE = path.join(DATA_DIR, "perfumes.json");
const LAYERING_FILE = path.join(DATA_DIR, "layering.json");

const KEY_PERFUMES = "elixir:perfumes";
const KEY_LAYERING = "elixir:layering";

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
  const data = await kv.get<AnyArr>(key);
  if (data && Array.isArray(data)) return data;
  await kv.set(key, seed);
  return seed;
}

async function writeKv(key: string, data: AnyArr): Promise<void> {
  await kv.set(key, data);
}

export async function getPerfumes(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_PERFUMES, seedPerfumes as AnyArr);
  return readLocal(PERFUMES_FILE, seedPerfumes as AnyArr);
}

export async function setPerfumes(data: AnyArr): Promise<void> {
  if (isVercel && hasKv) return writeKv(KEY_PERFUMES, data);
  return writeLocal(PERFUMES_FILE, data);
}

export async function getLayering(): Promise<AnyArr> {
  if (isVercel && hasKv) return readKv(KEY_LAYERING, seedLayering as AnyArr);
  return readLocal(LAYERING_FILE, seedLayering as AnyArr);
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
