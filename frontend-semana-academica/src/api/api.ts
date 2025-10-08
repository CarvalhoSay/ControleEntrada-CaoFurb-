export const API_BASE = '/api'; // ajuste se necessário

export async function get<T>(url:string): Promise<T>{
  const r = await fetch(url);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
