import React, { useEffect, useState } from "react";
import { CONFIG } from "../config";
import { dateLong } from "../fmt";
import { sendRsvp, getStats } from "../api";
import { drawCard, canvasToBlob } from "../card";
import Reveal from "./Reveal";
import { RoseDivider as Divider } from "./Ornament";

export default function Rsvp({ t, lang }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", guests: 1, attending: true });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null); // { attending, canvas, emailed }
  const [count, setCount] = useState(0);

  useEffect(() => { getStats().then((s) => setCount(s.attending || 0)); }, [done]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr("");
    if (!form.name.trim()) return setErr(t.errName);
    if (!form.phone.trim() && !form.email.trim()) return setErr(t.errContact);
    setBusy(true);
    try {
      const guests = form.attending ? Math.max(1, Number(form.guests) || 1) : 0;
      let canvas = null, cardImage = "";
      if (form.attending) {
        canvas = await drawCard({ lang, guestName: form.name.trim(), guests });
        if (form.email.trim()) cardImage = canvas.toDataURL("image/jpeg", 0.86); // for the email copy
      }
      await sendRsvp({
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        attending: form.attending, guests, lang, cardImage,
      });
      setDone({ attending: form.attending, canvas, emailed: !!form.email.trim() && form.attending });
    } catch (ex) {
      console.error(ex);
      setErr(t.errSend);
    } finally {
      setBusy(false);
    }
  }

  const fileName = () => `invitation-${form.name.trim().replace(/\s+/g, "-").toLowerCase() || "guest"}.png`;

  async function download() {
    const blob = await canvasToBlob(done.canvas);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = fileName();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }

  async function shareWa() {
    const text = `${t.waText.replace("{names}", `${CONFIG.bride[lang]} & ${CONFIG.groom[lang]}`).replace("{date}", dateLong(lang))}\n${location.origin}`;
    try {
      const blob = await canvasToBlob(done.canvas);
      const file = new File([blob], fileName(), { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text });
        return;
      }
    } catch (ex) {
      if (ex && ex.name === "AbortError") return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <section className="sec alt" id="rsvp">
      <Reveal className="wrap narrow center">
        <h2 className="title">{t.rsvpTitle}</h2>
        <p className="sub">{t.rsvpSub}</p>
        <p className="deadline">{t.rsvpBy} <b>{CONFIG.rsvpDeadline[lang]}</b></p>
        <Divider />

        {!done ? (
          <form className="card form" onSubmit={submit} noValidate>
            <div className="choice">
              <button type="button" className={form.attending ? "on" : ""} onClick={() => setForm({ ...form, attending: true })}>🪷 {t.yes}</button>
              <button type="button" className={!form.attending ? "on" : ""} onClick={() => setForm({ ...form, attending: false })}>{t.no}</button>
            </div>
            <label>{t.name}<input value={form.name} onChange={set("name")} autoComplete="name" /></label>
            <label>{t.phone}<input value={form.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" placeholder="07X XXX XXXX" /></label>
            <label>{t.email}<input value={form.email} onChange={set("email")} type="email" autoComplete="email" /></label>
            {form.attending && (
              <label>{t.guests}
                <div className="stepper">
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.max(1, Number(form.guests) - 1) })}>−</button>
                  <output>{form.guests}</output>
                  <button type="button" onClick={() => setForm({ ...form, guests: Math.min(20, Number(form.guests) + 1) })}>+</button>
                </div>
              </label>
            )}
            {err && <p className="err">{err}</p>}
            <button className="btn gold-btn" disabled={busy}>{busy ? t.sending : t.confirm}</button>
            {count > 0 && <p className="tiny">🪷 {count} {t.joined}</p>}
          </form>
        ) : (
          <div className="card done">
            <p className="thanks">{done.attending ? t.thanksYes : t.thanksNo}</p>
            {done.attending && (
              <>
                <p className="sub">{t.yourCard}</p>
                <img className="card-preview" alt="invitation card" src={done.canvas.toDataURL("image/jpeg", 0.8)} />
                <div className="actions">
                  <button className="btn gold-btn" onClick={download}>⬇ {t.download}</button>
                  <button className="btn wa" onClick={shareWa}>💬 {t.shareWa}</button>
                </div>
                {done.emailed && <p className="tiny">✉ {t.emailNote}</p>}
              </>
            )}
          </div>
        )}
      </Reveal>
    </section>
  );
}
