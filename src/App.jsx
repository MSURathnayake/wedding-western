import React, { useEffect, useRef, useState } from "react";
import { CONFIG } from "./config";
import { STR } from "./i18n";
import Gate from "./components/Gate";
import Petals from "./components/Petals";
import { Hero, Couple, Countdown, Program, Venue, Gallery, Footer } from "./components/Sections";
import Rsvp from "./components/Rsvp";
import Wishes from "./components/Wishes";
import Moments from "./components/Moments";
import IntroVideo from "./components/IntroVideo";

export default function App() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("lang") || "en"; } catch { return "en"; }
  });
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);
  const video = useRef(null);
  const [videoOk, setVideoOk] = useState(CONFIG.introVideo ? null : false);
  const [stage, setStage] = useState("gate"); // gate | video | site
  const [vFade, setVFade] = useState(false);
  const videoRef = useRef(null);
  videoRef.current = videoOk;
  const t = STR[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "si" ? "si" : "en";
    document.documentElement.classList.toggle("si", lang === "si");
    try { localStorage.setItem("lang", lang); } catch {}
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
  }, [opened]);

  function open() {
    // The click gives us permission to start the music and, later, the intro film.
    audio.current?.play().then(() => setPlaying(true)).catch(() => {});
    setLeaving(true);
    const v = video.current;
    if (videoRef.current !== false && v) {
      // Unlock the video with this click, then hold it back: the film must not start (or show)
      // while the doors are still opening.
      v.muted = true;
      v.play().then(() => { v.pause(); v.currentTime = 0; }).catch(() => {});
    }
    // The doors swing open first (1.7 s). Only when they are fully open does the film start,
    // so the two never overlap.
    setTimeout(() => {
      if (videoRef.current === true && video.current) {
        const film = video.current;
        if (CONFIG.introVideoHasAudio) audio.current?.pause();
        film.muted = !CONFIG.introVideoHasAudio;
        film.currentTime = 0;
        film.play().catch(() => {});
        setStage("video");
      } else finish(true);
    }, 1900);
  }

  function finish(immediate) {
    if (CONFIG.introVideoHasAudio) audio.current?.play().then(() => setPlaying(true)).catch(() => {});
    if (immediate) { setStage("site"); setOpened(true); return; }
    setVFade(true);
    setTimeout(() => { setStage("site"); setOpened(true); }, 900);
  }

  function toggleMusic() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  }

  return (
    <>
      <audio ref={audio} src={CONFIG.music} loop preload="auto" />

      <div className="topbar">
        <div className="lang" role="group" aria-label="language">
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "si" ? "on" : ""} onClick={() => setLang("si")}>සිං</button>
        </div>
      </div>

      <IntroVideo
        ref={video}
        src={CONFIG.introVideo}
        show={stage === "video" && !opened}
        fading={vFade}
        skipLabel={t.skip}
        onReady={() => setVideoOk(true)}
        onFail={() => setVideoOk(false)}
        onEnd={() => finish(false)}
        onSkip={() => { video.current?.pause(); finish(false); }}
      />

      {!opened && (
        <Gate t={t} lang={lang} onOpen={open} leaving={leaving} hold={videoOk === true} done={stage === "video"} />
      )}

      <main className={opened || (leaving && videoOk !== true) ? "app in" : "app"}>
        <Petals />
        <Hero t={t} lang={lang} />
        <Couple t={t} lang={lang} />
        <Countdown t={t} />
        <Program t={t} />
        <Venue t={t} lang={lang} />
        <Gallery t={t} />
        <Rsvp t={t} lang={lang} />
        <Wishes t={t} />
        <Moments t={t} />
        <Footer t={t} lang={lang} />
      </main>

      <button className={`music ${playing ? "on" : ""}`} onClick={toggleMusic} aria-label="music">
        {playing ? "♪" : "♪̸"}
      </button>
    </>
  );
}