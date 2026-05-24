const TOKEN_KEY = "elixir_admin_password";

export function getAdminPassword(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminPassword(pwd: string) {
  localStorage.setItem(TOKEN_KEY, pwd);
}

export function clearAdminPassword() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(): HeadersInit {
  const pwd = getAdminPassword();
  return pwd ? { "X-Admin-Password": pwd, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function handle(res: Response) {
  if (!res.ok) {
    let msg = `Erreur HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (res.ok) {
    setAdminPassword(password);
    return true;
  }
  return false;
}

export async function getPerfumes() {
  return fetch("/api/perfumes").then(handle);
}
export async function createPerfume(p: any) {
  return fetch("/api/perfumes", { method: "POST", headers: authHeaders(), body: JSON.stringify(p) }).then(handle);
}
export async function updatePerfume(id: string, p: any) {
  return fetch(`/api/perfumes/${encodeURIComponent(id)}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(p) }).then(handle);
}
export async function deletePerfume(id: string) {
  return fetch(`/api/perfumes/${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() }).then(handle);
}

export async function getLayering() {
  return fetch("/api/layering").then(handle);
}
export async function createNote(n: any) {
  return fetch("/api/layering", { method: "POST", headers: authHeaders(), body: JSON.stringify(n) }).then(handle);
}
export async function updateNote(id: string, n: any) {
  return fetch(`/api/layering/${encodeURIComponent(id)}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(n) }).then(handle);
}
export async function deleteNote(id: string) {
  return fetch(`/api/layering/${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders() }).then(handle);
}

export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ filename: file.name, dataUrl }),
  });
  const json = await handle(res);
  return json.url;
}
