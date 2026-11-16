import React, { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { dateLong, downloadIcs } from "../fmt";
import Reveal from "./Reveal";
import { RoseDivider, RoseCluster, Rose, Icon } from "./Ornament";
import Lightbox from "./Lightbox";

export function Hero({ t, lang }) {
  const v = CONFIG.venues[0];
  return (
    <header className="hero" id="top">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <clipPath id="archClip" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.4 C0,0.22 0.34,0.08 0.5,0 C0.66,0.08 1,0.22 1,0.4 L1,1 Z" />
        </clipPath>
      </svg>
      <p className="eyebrow top">{t.marrying}</p>
      <div className="arch-wrap">
        <div className="arch">
          <img src="/images/bg.jpg" alt={`${CONFIG.bride.en} & ${CONFIG.groom.en}`} />
        </div>
        <svg className="arch-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 100 V40 C0 22 34 8 50 0 C66 8 100 22 100 40 V100" vectorEffect="non-scaling-stroke" />
          <path d="M2.2 100 V41 C2.2 24 35 11 50 3.5 C65 11 97.8 24 97.8 41 V100" vectorEffect="non-scaling-stroke" className="thin" />
        </svg>
        <RoseCluster className="hero-rc left" />
        <RoseCluster className="hero-rc right" flip />
      </div>
      <div className="hero-text">
        <h1 className="names script">
          {CONFIG.bride[lang]}<span className="amp"> & </span>{CONFIG.groom[lang]}
        </h1>
        <p className="hero-date">{dateLong(lang)}</p>
        <p className="hero-venue">{v.name[lang]}, {v.place[lang]}</p>
        <a href="#couple" className="scroll-hint" aria-label="more">⌄</a>
      </div>
    </header>
  );
}

export function Couple({ t, lang }) {
  const v = CONFIG.venues[0];
  return (
    <section className="sec" id="couple">
      <Reveal className="wrap center">
        <p className="eyebrow">{t.together}</p>
        <div className="couple">
          <div className="person">
            <h2 className="pname">{CONFIG.bride[lang]}</h2>
            <p className="parents">{CONFIG.brideParents[lang]}</p>
          </div>
          <div className="amp-big script" aria-hidden="true">&</div>
          <div className="person">
            <h2 className="pname">{CONFIG.groom[lang]}</h2>
            <p className="parents">{CONFIG.groomParents[lang]}</p>
          </div>
        </div>
        <RoseDivider />
        <p className="request">{t.request}</p>
        <div className="when">
          <div className="k">{dateLong(lang)}</div>
          <div className="k small">{v.time[lang]} · {v.name[lang]}, {v.place[lang]}</div>
        </div>
        <p className="verse">“{t.verse}”<span>{t.verseRef}</span></p>
        <button className="btn outline" onClick={() => downloadIcs(lang)}>📅 {t.addCal}</button>
      </Reveal>
    </section>
  );
}

function useCountdown() {
  const target = new Date(CONFIG.dateISO).getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    done: diff === 0,
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff / 36e5) % 24),
    m: Math.floor((diff / 6e4) % 60),
    s: Math.floor((diff / 1e3) % 60),
  };
}

export function Countdown({ t }) {
  const c = useCountdown();
  const box = (n, label) => (
    <div className="cd-box">
      <div className="cd-num">{String(n).padStart(2, "0")}</div>
      <div className="cd-label">{label}</div>
    </div>
  );
  return (
    <section className="sec alt">
      <Reveal className="wrap center">
        <h2 className="title">{t.countTitle}</h2>
        <RoseDivider />
        {c.done ? <p className="today">{t.today}</p> : (
          <div className="cd">{box(c.d, t.days)}{box(c.h, t.hours)}{box(c.m, t.minutes)}{box(c.s, t.seconds)}</div>
        )}
      </Reveal>
    </section>
  );
}

function fmtTime(str, t) {
  const [h, m] = str.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${t.ampm[ap]}`;
}

export function Program({ t }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="center">
          <h2 className="title">{t.programTitle}</h2>
          <p className="sub">{t.programSub}</p>
        </Reveal>
        <ol className="timeline">
          {CONFIG.program.map((p, i) => (
            <Reveal as="li" className="tl-item" key={i} delay={i * 60}>
              <div className="tl-icon"><Icon name={p.icon} /></div>
              <div className="tl-body">
                <span className="tl-time">{fmtTime(p.time, t)}</span>
                <h3>{t.program[i][0]}</h3>
                <p>{t.program[i][1]}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Venue({ t, lang }) {
  return (
    <section className="sec alt">
      <div className="wrap center">
        <Reveal>
          <h2 className="title">{t.venueTitle}</h2>
          <p className="sub">{t.venueSub}</p>
          <RoseDivider />
        </Reveal>
        <div className="venues">
          {CONFIG.venues.map((v, i) => (
            <Reveal key={v.key} className="venue-card" delay={i * 120}>
              <div className="vc-icon"><Icon name={v.key === "church" ? "church" : "lunch"} /></div>
              <p className="eyebrow">{v.key === "church" ? t.churchTitle : t.receptionTitle}</p>
              <h3>{v.name[lang]}</h3>
              <p className="vc-sub">{v.place[lang]} · {v.time[lang]}</p>
              <a className="btn outline" href={v.mapsUrl} target="_blank" rel="noreferrer">📍 {t.openMaps}</a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Gallery({ t }) {
  const [open, setOpen] = useState(null);
  const files = CONFIG.gallery.length
    ? CONFIG.gallery.map((f) => ({ src: `/gallery/${f}`, pos: "center" }))
    : [
        { src: "/images/bg.jpg", pos: "50% 60%" },
        { src: "/images/bg.jpg", pos: "30% 90%" },
        { src: "/images/bg.jpg", pos: "70% 85%" },
        { src: "/images/bg.jpg", pos: "50% 30%" },
        { src: "/images/bg.jpg", pos: "5% 50%" },
        { src: "/images/bg.jpg", pos: "95% 50%" },
      ]; // placeholders until real photos are added
  return (
    <section className="sec">
      <div className="wrap">
        <Reveal className="center">
          <h2 className="title">{t.galleryTitle}</h2>
          <p className="sub">{t.gallerySub}</p>
        </Reveal>
        <div className="grid gallery">
          {files.map((f, i) => (
            <Reveal key={i} delay={(i % 3) * 80} className={`tile t${i % 5}`}>
              <button onClick={() => setOpen(f.src)} aria-label="open photo">
                <img src={f.src} alt="" loading="lazy" style={{ objectPosition: f.pos }} />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox src={open} onClose={() => setOpen(null)} />
    </section>
  );
}

export function Footer({ t, lang }) {
  return (
    <footer className="footer">
      <Rose size={64} />
      <p className="script foot-names">{t.footer}</p>
      <p className="script foot-names two">{CONFIG.bride[lang]} & {CONFIG.groom[lang]}</p>
    </footer>
  );
}
