import { CONFIG } from "./config";

const SI_DAYS = ["ඉරිදා", "සඳුදා", "අඟහරුවාදා", "බදාදා", "බ්‍රහස්පතින්දා", "සිකුරාදා", "සෙනසුරාදා"];
const SI_MONTHS = ["ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි", "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්"];

// Date parts in Sri Lanka time (UTC+5:30), independent of the viewer's device settings
function lkParts() {
  const d = new Date(new Date(CONFIG.dateISO).getTime() + 5.5 * 3600 * 1000);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth(), day: d.getUTCDate(), wd: d.getUTCDay() };
}

export function dateLong(lang) {
  const { y, m, day, wd } = lkParts();
  if (lang === "si") return `${y} ${SI_MONTHS[m]} ${day}, ${SI_DAYS[wd]}`;
  const EN_D = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const EN_M = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${EN_D[wd]}, ${day} ${EN_M[m]} ${y}`;
}

export const churchOf = (lang) => CONFIG.venues[0].name[lang] + ", " + CONFIG.venues[0].place[lang];

export function downloadIcs(lang) {
  const v = CONFIG.venues[0];
  const s = new Date(CONFIG.dateISO);
  const e = new Date(s.getTime() + 5 * 3600 * 1000);
  const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const names = `${CONFIG.bride.en} & ${CONFIG.groom.en}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//EN", "BEGIN:VEVENT",
    `UID:${f(s)}@wedding`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`,
    `SUMMARY:Wedding of ${names}`, `LOCATION:${v.name.en}\\, ${v.place.en}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding.ics";
  document.body.appendChild(a); a.click(); a.remove();
}
