import { CONFIG } from "./config";
import { STR } from "./i18n";
import { dateLong } from "./fmt";

const GOLD = "#b8914a";
const INK = "#2b2f45";
const BROWN = "#4a4234";

function loadImg(src) {
  return new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function leaf(ctx, x, y, len, ang) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate((ang * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(len * 0.25, -len * 0.28, len * 0.75, -len * 0.28, len, 0);
  ctx.bezierCurveTo(len * 0.75, len * 0.28, len * 0.25, len * 0.28, 0, 0);
  ctx.fillStyle = "#8a9c7b"; ctx.fill();
  ctx.strokeStyle = "#6f8262"; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}

// white rose, same construction as the SVG on the site
function rose(ctx, cx, cy, size, rot = 0) {
  const k = size / 100;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate((rot * Math.PI) / 180); ctx.scale(k, k);
  ctx.translate(-50, -50);
  const petal = (a, d) => {
    ctx.save();
    ctx.translate(50, 50); ctx.rotate((a * Math.PI) / 180); ctx.translate(-50, -50);
    ctx.beginPath(); ctx.moveTo(50, 50);
    ctx.bezierCurveTo(...d);
    const g = ctx.createRadialGradient(50, 40, 2, 50, 30, 36);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.7, "#fbf7ee"); g.addColorStop(1, "#e9dfca");
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "#cdbd98"; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.restore();
  };
  [0, 60, 120, 180, 240, 300].forEach((a) => {
    ctx.save(); ctx.translate(50, 50); ctx.rotate((a * Math.PI) / 180); ctx.translate(-50, -50);
    ctx.beginPath(); ctx.moveTo(50, 50);
    ctx.bezierCurveTo(24, 44, 18, 14, 50, 6); ctx.bezierCurveTo(82, 14, 76, 44, 50, 50);
    const g = ctx.createRadialGradient(50, 40, 2, 50, 30, 38);
    g.addColorStop(0, "#fff"); g.addColorStop(0.7, "#fbf7ee"); g.addColorStop(1, "#e9dfca");
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#cdbd98"; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.restore();
  });
  [30, 102, 174, 246, 318].forEach((a) => {
    ctx.save(); ctx.translate(50, 50); ctx.rotate((a * Math.PI) / 180); ctx.translate(-50, -50);
    ctx.beginPath(); ctx.moveTo(50, 52);
    ctx.bezierCurveTo(32, 48, 29, 26, 50, 20); ctx.bezierCurveTo(71, 26, 68, 48, 50, 52);
    ctx.fillStyle = "#fffdf8"; ctx.fill(); ctx.strokeStyle = "#cdbd98"; ctx.lineWidth = 0.9; ctx.stroke();
    ctx.restore();
  });
  ctx.beginPath(); ctx.arc(50, 50, 15, 0, 7);
  ctx.fillStyle = "#f6eedb"; ctx.fill(); ctx.strokeStyle = "#cdbd98"; ctx.stroke();
  ctx.beginPath(); ctx.arc(50, 50, 3, 0, 5); ctx.arc(50, 53, 6, 0, 5); ctx.arc(50, 47, 10, 0, 5);
  ctx.strokeStyle = "#cbb98f"; ctx.stroke();
  ctx.restore();
}

function bouquet(ctx, cx, cy, s) {
  leaf(ctx, cx - 10, cy + 8, s * 1.0, 195);
  leaf(ctx, cx + 10, cy + 8, s * 1.0, -15);
  leaf(ctx, cx, cy + 14, s * 0.8, 90);
  rose(ctx, cx - s * 0.55, cy + 6, s * 0.8, -15);
  rose(ctx, cx + s * 0.55, cy + 6, s * 0.8, 20);
  rose(ctx, cx, cy - 6, s * 1.05, 5);
}

function archPath(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + h * 0.4);
  ctx.bezierCurveTo(x, y + h * 0.22, x + w * 0.34, y + h * 0.08, x + w * 0.5, y);
  ctx.bezierCurveTo(x + w * 0.66, y + h * 0.08, x + w, y + h * 0.22, x + w, y + h * 0.4);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function fit(ctx, text, maxW, size, family, weight = "") {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    s -= 2;
  } while (s > 20);
  return s;
}

export async function drawCard({ lang = "en", guestName = "", guests = 1 }) {
  const t = STR[lang];
  const si = lang === "si";
  const W = 1080, H = 1700;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const body = si ? '"Noto Serif Sinhala"' : '"Cormorant Garamond"';
  const disp = si ? '"Noto Serif Sinhala"' : "Cinzel";

  await Promise.all([
    document.fonts.load('80px "Pinyon Script"'),
    document.fonts.load('40px "Cinzel"'),
    document.fonts.load('40px "Cormorant Garamond"'),
    document.fonts.load('40px "Noto Serif Sinhala"', "දිලිනි"),
  ]).catch(() => {});

  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#fffdf8"); g.addColorStop(1, "#f3ead8");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.strokeRect(36, 36, W - 72, H - 72);
  ctx.lineWidth = 1.8; ctx.strokeRect(54, 54, W - 108, H - 108);

  ctx.textAlign = "center";
  ctx.fillStyle = GOLD;
  ctx.font = `600 ${si ? 38 : 36}px ${disp}`;
  if (!si) ctx.letterSpacing = "10px";
  ctx.fillText(si ? t.cardInvited : t.cardInvited.toUpperCase(), W / 2, 150);
  ctx.letterSpacing = "0px";

  // arch with illustration
  const aw = 560, ah = 700, ax = W / 2 - aw / 2, ay = 190;
  const img = await loadImg("/images/bg.jpg");
  ctx.save();
  archPath(ctx, ax, ay, aw, ah); ctx.clip();
  const sc = Math.max(aw / img.width, ah / img.height);
  ctx.drawImage(img, ax + (aw - img.width * sc) / 2, ay + (ah - img.height * sc) * 0.6, img.width * sc, img.height * sc);
  ctx.restore();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 6; archPath(ctx, ax, ay, aw, ah); ctx.stroke();
  ctx.lineWidth = 1.5; archPath(ctx, ax + 12, ay + 14, aw - 24, ah - 14); ctx.stroke();

  bouquet(ctx, ax + 10, ay + ah - 20, 90);
  bouquet(ctx, ax + aw - 10, ay + ah - 20, 90);

  let y = 990;
  ctx.fillStyle = INK;
  if (guestName) {
    const label = `${t.cardDear} ${guestName}`;
    const fam = body, wt = si ? "600" : "italic 600";
    const s = fit(ctx, label, 820, 50, fam, wt);
    ctx.font = `${wt} ${s}px ${fam}`;
    ctx.fillText(label, W / 2, y);
    if (guests > 1) {
      ctx.font = `500 34px ${body}`; ctx.fillStyle = GOLD;
      ctx.fillText(`${t.cardPlus} ${guests}`, W / 2, y + 50);
    }
  }

  y = 1165;
  const nm = `${CONFIG.bride[lang]} & ${CONFIG.groom[lang]}`;
  const nf = si ? '"Noto Serif Sinhala"' : '"Pinyon Script"';
  const ns = fit(ctx, nm, 860, si ? 84 : 130, nf, si ? "700" : "");
  ctx.fillStyle = INK; ctx.font = `${si ? "700" : ""} ${ns}px ${nf}`;
  ctx.fillText(nm, W / 2, y);

  // divider with small rose
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2 - 260, y + 62); ctx.lineTo(W / 2 - 50, y + 62);
  ctx.moveTo(W / 2 + 50, y + 62); ctx.lineTo(W / 2 + 260, y + 62); ctx.stroke();
  rose(ctx, W / 2, y + 62, 64);

  const v = CONFIG.venues[0], r = CONFIG.venues[1];
  ctx.fillStyle = INK;
  ctx.font = `600 ${si ? 40 : 44}px ${disp}`;
  ctx.fillText(dateLong(lang), W / 2, y + 160);
  ctx.fillStyle = BROWN;
  ctx.font = `600 ${si ? 36 : 42}px ${body}`;
  ctx.fillText(`${v.name[lang]}, ${v.place[lang]} · ${v.time[lang]}`, W / 2, y + 225);
  ctx.fillStyle = GOLD;
  ctx.font = `500 ${si ? 32 : 38}px ${body}`;
  ctx.fillText(`${t.receptionTitle}: ${r.name[lang]} · ${r.time[lang]}`, W / 2, y + 285);

  return c;
}

export function canvasToBlob(canvas, type = "image/png", q = 0.92) {
  return new Promise((res) => canvas.toBlob(res, type, q));
}
