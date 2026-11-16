import React, { useEffect, useState } from "react";
import { sendWish, getWishes } from "../api";
import Reveal from "./Reveal";
import { RoseDivider as Divider } from "./Ornament";

export default function Wishes({ t }) {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = () => getWishes().then((r) => setList(r.wishes || []));
  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setBusy(true); setErr("");
    try {
      await sendWish({ name: name.trim(), message: msg.trim() });
      setMsg("");
      await load();
    } catch { setErr(t.errSend); }
    setBusy(false);
  }

  return (
    <section className="sec pattern">
      <div className="wrap narrow">
        <Reveal className="center">
          <h2 className="title">{t.wishesTitle}</h2>
          <p className="sub">{t.wishesSub}</p>
          <Divider />
        </Reveal>
        <Reveal>
          <form className="card form" onSubmit={submit}>
            <label>{t.wishName}<input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></label>
            <label>{t.wishMsg}<textarea rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} /></label>
            {err && <p className="err">{err}</p>}
            <button className="btn gold-btn" disabled={busy}>{busy ? t.sending : `🤍 ${t.wishSend}`}</button>
          </form>
        </Reveal>
        <div className="wishes">
          {list.length === 0 && <p className="center sub">{t.wishEmpty}</p>}
          {list.map((w, i) => (
            <Reveal key={i} className="wish" delay={(i % 4) * 50}>
              <p>“{w.message}”</p>
              <span>— {w.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
