const API = "http://localhost:8080";

export async function fetchHistory(room, limit = 50) {
  const r = await fetch(`${API}/api/rooms/${encodeURIComponent(room)}/messages?limit=${limit}`);
  if (!r.ok) throw new Error(`History failed: ${r.status}`);
  return r.json();
}
