import React, { useMemo } from "react";

export default function Petals({ count = 14 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 16,
        dur: 14 + Math.random() * 12,
        size: 9 + Math.random() * 11,
      })),
    [count]
  );
  return (
    <div className="petals" aria-hidden="true">
      {items.map((p, i) => (
        <i key={i} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.25, animationDelay: `-${p.delay}s`, animationDuration: `${p.dur}s` }} />
      ))}
    </div>
  );
}
