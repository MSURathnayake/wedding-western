import { CONFIG } from "./config";

const URL_ = CONFIG.APPS_SCRIPT_URL;
export const DEMO = !URL_;

// ---- demo-mode storage (only when APPS_SCRIPT_URL is empty) ----
const ls = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

async function post(payload) {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "failed");
  return json;
}

async function get(action) {
  const res = await fetch(`${URL_}?action=${action}`);
  return res.json();
}

export async function sendRsvp(data) {
  if (DEMO) {
    const all = ls.get("demo_rsvp", []);
    all.push(data);
    ls.set("demo_rsvp", all);
    return { ok: true };
  }
  return post({ action: "rsvp", ...data });
}

export async function getStats() {
  if (DEMO) {
    const all = ls.get("demo_rsvp", []);
    return { attending: all.filter((r) => r.attending).reduce((s, r) => s + Number(r.guests || 1), 0) + 48 };
  }
  try { return await get("stats"); } catch { return { attending: 0 }; }
}

export async function sendWish(data) {
  if (DEMO) {
    const all = ls.get("demo_wishes", []);
    all.unshift({ ...data, ts: new Date().toISOString() });
    ls.set("demo_wishes", all);
    return { ok: true };
  }
  return post({ action: "wish", ...data });
}

export async function getWishes() {
  if (DEMO) {
    const seed = [
      { name: "Nimali & Kasun", message: "Wishing you a lifetime of love and happiness! ආදරයෙන් සුභ මංගලයක්! 🤍", ts: "" },
      { name: "Aunty Kamani", message: "God bless you both. May your journey be filled with joy.", ts: "" },
    ];
    return { wishes: [...ls.get("demo_wishes", []), ...seed] };
  }
  try { return await get("wishes"); } catch { return { wishes: [] }; }
}

export async function sendMoment(data) {
  if (DEMO) {
    const all = ls.get("demo_moments", []);
    all.unshift({ name: data.name, caption: data.caption, url: data.image });
    ls.set("demo_moments", all.slice(0, 6)); // keep localStorage small
    return { ok: true };
  }
  return post({ action: "moment", ...data });
}

export async function getMoments() {
  if (DEMO) return { moments: ls.get("demo_moments", []) };
  try { return await get("moments"); } catch { return { moments: [] }; }
}
