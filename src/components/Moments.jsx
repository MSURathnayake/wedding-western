import React, { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { sendMoment, getMoments } from "../api";
import { compressImage } from "../utils";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { RoseDivider as Divider } from "./Ornament";

export default function Moments({ t }) {
  const demo = typeof location !== "undefined" && new URLSearchParams(location.search).has("demo");
  const open = demo || Date.now() >= new Date(CONFIG.momentsOpenFrom).getTime();
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [prog, setProg] = useState(null);
  const [msg, setMsg] = useState("");
  const [light, setLight] = useState(null);
  const input = useRef();

  const load = () => getMoments().then((r) => setList(r.moments || []));
  useEffect(() => { load(); }, []);

  async function upload(e) {
    e.preventDefault();
    if (!files.length) return;
    setMsg("");
    try {
      for (let i = 0; i < files.length; i++) {
        setProg(`${t.uploading} ${i + 1}/${files.length}…`);
        const image = await compressImage(files[i]);
        await sendMoment({ name: name.trim() || "Guest", caption: caption.trim(), image });
      }
      setMsg(t.uploaded);
      setFiles([]); setCaption("");
      if (input.current) input.current.value = "";
      await load();
    } catch (ex) {
      console.error(ex);
      setMsg(t.errSend);
    }
    setProg(null);
  }

  return (
    <section className="sec alt">
      <div className="wrap">
        <Reveal className="center">
          <h2 className="title">{t.momentsTitle}</h2>
          <p className="sub">{t.momentsSub}</p>
          <Divider />
        </Reveal>

        {open ? (
          <Reveal className="narrow">
            <form className="card form" onSubmit={upload}>
              <label>{t.yourName}<input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></label>
              <label>{t.caption}<input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={120} /></label>
              <label className="filebtn">
                📷 {files.length ? `${files.length} ✓` : t.pickPhotos}
                <input ref={input} type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} hidden />
              </label>
              <button className="btn gold-btn" disabled={!files.length || !!prog}>{prog || t.upload}</button>
              {msg && <p className="tiny">{msg}</p>}
            </form>
          </Reveal>
        ) : (
          <p className="center sub locked">🔒 {t.momentsLocked}</p>
        )}

        <div className="grid moments">
          {list.length === 0 && open && <p className="center sub" style={{ gridColumn: "1/-1" }}>{t.momentsEmpty}</p>}
          {list.map((m, i) => (
            <figure key={i} className="moment">
              <button onClick={() => setLight(m.url)}><img src={m.url} alt={m.caption || ""} loading="lazy" /></button>
              {(m.caption || m.name) && <figcaption>{m.caption && <b>{m.caption}</b>}<span>{m.name}</span></figcaption>}
            </figure>
          ))}
        </div>
      </div>
      <Lightbox src={light} onClose={() => setLight(null)} />
    </section>
  );
}
