import React, { useId } from "react";

/* A white rose, drawn in SVG (layered petals + spiral heart). */
export function Rose({ size = 60, rotate = 0, className = "" }) {
  const id = useId().replace(/:/g, "");
  const outer = [0, 60, 120, 180, 240, 300];
  const mid = [30, 102, 174, 246, 318];
  return (
    <svg className={`rose ${className}`} width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <defs>
        <radialGradient id={`g${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#fbf7ee" />
          <stop offset="100%" stopColor="#e9dfca" />
        </radialGradient>
        <radialGradient id={`h${id}`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#f0e6cf" />
          <stop offset="100%" stopColor="#fffdf8" />
        </radialGradient>
      </defs>
      <g stroke="#cdbd98" strokeWidth="0.8" strokeLinejoin="round">
        {outer.map((a) => (
          <path key={a} transform={`rotate(${a} 50 50)`} d="M50 50 C24 44 18 14 50 6 C82 14 76 44 50 50Z" fill={`url(#g${id})`} />
        ))}
        {mid.map((a) => (
          <path key={a} transform={`rotate(${a} 50 50)`} d="M50 52 C32 48 29 26 50 20 C71 26 68 48 50 52Z" fill={`url(#g${id})`} />
        ))}
        <circle cx="50" cy="50" r="15" fill={`url(#h${id})`} />
      </g>
      <g fill="none" stroke="#cbb98f" strokeWidth="0.9" strokeLinecap="round">
        <path d="M50 50 m-3 0 a3 3 0 1 1 3 3 a6 6 0 1 1 -6 -6 a9 9 0 0 1 12 -2 a11 11 0 0 1 -4 16" />
        <path d="M40 40 q10 -8 20 0" opacity=".6" />
      </g>
    </svg>
  );
}

export function Leaf({ size = 40, rotate = 0 }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 80 40" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d="M2 20 C20 -4 56 -2 78 20 C56 42 20 44 2 20Z" fill="#8a9c7b" stroke="#6f8262" strokeWidth="1" />
      <path d="M4 20 H72" stroke="#6f8262" strokeWidth="1" opacity=".7" />
    </svg>
  );
}

/* line — rose — line */
export function RoseDivider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
      <Leaf size={30} rotate={-8} />
      <Rose size={44} />
      <Leaf size={30} rotate={188} />
      <span />
    </div>
  );
}

/* a small bouquet-like cluster of roses + leaves for corners */
export function RoseCluster({ className = "", flip = false }) {
  return (
    <div className={`cluster ${className}`} style={flip ? { transform: "scaleX(-1)" } : null} aria-hidden="true">
      <Leaf size={90} rotate={-35} />
      <Leaf size={80} rotate={20} />
      <Rose size={86} rotate={10} />
      <Rose size={62} rotate={-20} />
      <Rose size={50} rotate={40} />
    </div>
  );
}

export function Icon({ name }) {
  const p = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "arrive":
      return (<svg {...p}><path d="M4 21V4l9-1v18" /><path d="M13 7h6v14" /><path d="M2 21h20" /><circle cx="10.5" cy="12.5" r=".6" fill="currentColor" /></svg>);
    case "church":
      return (<svg {...p}><path d="M12 2v4M10 4h4" /><path d="M7 21V11l5-4 5 4v10" /><path d="M3 21h18" /><path d="M10 21v-5a2 2 0 0 1 4 0v5" /><path d="M3 21v-7l4-3M21 21v-7l-4-3" /></svg>);
    case "ring":
      return (<svg {...p}><circle cx="9" cy="14" r="5" /><circle cx="15.5" cy="14" r="5" /><path d="M7 5l2 2 2-2-1.5-2h-1z" /></svg>);
    case "camera":
      return (<svg {...p}><path d="M4 8h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>);
    case "lunch":
      return (<svg {...p}><path d="M7 3v8a2 2 0 0 0 2 2v8" /><path d="M5 3v6M9 3v6" /><path d="M17 21V3c-2.5 1.5-3.5 5-3.5 8h3.5" /></svg>);
    case "cake":
      return (<svg {...p}><path d="M4 21h16v-7H4z" /><path d="M4 17c2 2 4-2 6 0s4-2 6 0 3 0 4 0" /><path d="M7 14v-3h10v3" /><path d="M12 11V7M12 5c-1 1-1 2 0 2s1-1 0-2z" /></svg>);
    case "car":
      return (<svg {...p}><path d="M5 16V11l2-5h10l2 5v5" /><path d="M3 16h18v3H3z" /><circle cx="7.5" cy="16" r="1" /><circle cx="16.5" cy="16" r="1" /><path d="M5 11h14" /></svg>);
    default:
      return (<svg {...p}><path d="M9 18V6l10-2v12" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></svg>);
  }
}
