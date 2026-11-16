import React from "react";
import { CONFIG } from "../config";
import { dateLong } from "../fmt";
import { Rose, Leaf, RoseCluster } from "./Ornament";

const GOLD = "#b8914a";

function DoorSvg() {
  // One full gothic double door (viewBox 400x800); each half shows one side.
  return (
    <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffefb" /><stop offset="1" stopColor="#efe4cb" />
        </linearGradient>
        {/* soft plain area behind the names so the seam and the carving never cross the text */}
        <radialGradient id="plaque" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fffefb" stopOpacity="1" />
          <stop offset=".72" stopColor="#fffefb" stopOpacity=".96" />
          <stop offset="1" stopColor="#fffefb" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow" cx="50%" cy="38%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M14 800V300C14 175 128 58 200 6C272 58 386 175 386 300V800Z" fill="url(#ivory)" stroke={GOLD} strokeWidth="5" />
      <path d="M14 800V300C14 175 128 58 200 6C272 58 386 175 386 300V800Z" fill="url(#glow)" />
      <path d="M36 780V305C36 195 136 86 200 38C264 86 364 195 364 305V780Z" fill="none" stroke={GOLD} strokeWidth="2.4" />
      <path d="M48 780V308C48 205 142 100 200 56C258 100 352 205 352 308V780Z" fill="none" stroke={GOLD} strokeWidth="1" opacity=".6" />
      {/* tracery */}
      <g fill="none" stroke={GOLD} strokeWidth="1.8">
        <circle cx="200" cy="112" r="16" /><circle cx="200" cy="112" r="6" />
        <path d="M200 96v-8M200 128v8M184 112h-8M216 112h8" />
      </g>
      {/* centre seam */}
      <path d="M200 40V800" stroke="#c7b27f" strokeWidth="2.5" />
      <path d="M197 40V800M203 40V800" stroke="#fff" strokeWidth="1" opacity=".6" />
      <ellipse cx="200" cy="335" rx="178" ry="150" fill="url(#plaque)" />
      {/* lower quatrefoil panels */}
      {[0, 1].map((i) => {
        const x = i ? 212 : 62;
        return (
          <g key={i} fill="none" stroke={GOLD} strokeWidth="2">
            <rect x={x} y="610" width="126" height="150" rx="3" />
            <rect x={x + 8} y="618" width="110" height="134" rx="2" opacity=".5" />
            <g transform={`translate(${x + 63} 685)`}>
              <circle cx="0" cy="-17" r="15" /><circle cx="0" cy="17" r="15" />
              <circle cx="-17" cy="0" r="15" /><circle cx="17" cy="0" r="15" />
              <circle r="5" fill={GOLD} />
            </g>
          </g>
        );
      })}
      {/* hinges */}
      {[330, 520, 700].map((y) => (
        <g key={y} fill="#cfae6a" stroke="#9a7a38" strokeWidth="1">
          <path d={`M14 ${y}h26l6 5-6 5H14z`} /><path d={`M386 ${y}h-26l-6 5 6 5h26z`} />
        </g>
      ))}
      {/* door rings */}
      {[172, 228].map((x) => (
        <g key={x}>
          <path d={`M${x - 10} 478h20l-3 24h-14z`} fill="#cfae6a" stroke="#9a7a38" strokeWidth="1" />
          <circle cx={x} cy="516" r="15" fill="none" stroke="#a8863f" strokeWidth="4" />
        </g>
      ))}
    </svg>
  );
}

/* White roses and leaves around the doors. s = size in vmin (kept between 56 and 150 px). */
const ROSES = [
  // [left %, top %, s, rotate]
  [-3, 2, 22, 15], [14, -3, 16, -25], [30, 4, 11, 40], [70, 4, 11, -40], [86, -3, 16, 25], [101, 2, 22, -15],
  [-5, 26, 18, -10], [103, 26, 18, 10], [-2, 48, 20, 30], [102, 48, 20, -30],
  [-4, 70, 18, -20], [104, 70, 18, 20], [8, 92, 20, 10], [92, 92, 20, -10], [28, 98, 14, 35], [72, 98, 14, -35],
  // centre of the wall: hidden behind the doors until they open
  [50, 12, 18, 5], [30, 28, 15, 50], [70, 26, 15, -50], [50, 38, 22, 20], [36, 54, 17, -30], [64, 56, 17, 35], [50, 70, 24, -15], [30, 80, 15, 25], [70, 82, 15, -25], [50, 94, 18, 40],
];
const LEAVES = [
  [6, 12, 100, -30], [94, 12, 100, 210], [2, 36, 90, 10], [98, 36, 90, 170], [3, 58, 96, -20], [97, 58, 96, 200],
  [18, 88, 90, 20], [82, 88, 90, 160], [22, 6, 80, 60], [78, 6, 80, 120],
];

function RoseWall() {
  return (
    <div className="rosewall" aria-hidden="true">
      {LEAVES.map(([l, t, s, r], i) => (
        <span key={`l${i}`} className="rw" style={{ left: `${l}%`, top: `${t}%` }}>
          <Leaf size={s} rotate={r} />
        </span>
      ))}
      {ROSES.map(([l, t, s, r], i) => (
        <span key={`r${i}`} className="rw rw-rose" style={{ left: `${l}%`, top: `${t}%`, "--s": s }}>
          <Rose size="100%" rotate={r} />
        </span>
      ))}
    </div>
  );
}

export default function Gate({ t, lang, onOpen, leaving, hold, done }) {
  const guest = typeof location !== "undefined" ? new URLSearchParams(location.search).get("guest") : null;
  return (
    <div className={`gate ${leaving ? "leaving" : ""} ${hold ? "hold" : ""} ${done ? "done" : ""}`}>
      <div className="gate-wall"><RoseWall /></div>
      <RoseCluster className="gate-rc left" />
      <RoseCluster className="gate-rc right" flip />
      <div className="doors">
        <div className="door l"><DoorSvg /></div>
        <div className="door r"><DoorSvg /></div>
        <div className="gate-text">
          <p className="eyebrow">{t.theWeddingOf}</p>
          <h1 className="gate-names script">
            <span className="gn">{CONFIG.bride[lang]}</span>
            <span className="amp">&amp;</span>
            <span className="gn">{CONFIG.groom[lang]}</span>
          </h1>
          <p className="gate-date">{dateLong(lang)}</p>
          <button className="btn outline" onClick={onOpen}>{t.open}</button>
        </div>
        {guest && (
          <div className="gate-guest">
            <span className="eyebrow small">{t.dear}</span>
            <b>{guest}</b>
          </div>
        )}
      </div>
      <p className="tiny gate-note">{t.tapMusic}</p>
    </div>
  );
}