# Church Wedding Invitation (React + Google Sheets)

Christian / Catholic-style, bilingual (English / සිංහල) invitation: cathedral doors cover, white roses, intro film, music, countdown,
day program, RSVP + personalised invitation card, wishes wall and guest photo sharing.

## 1. Run locally
```bash
npm install
npm run dev      # http://localhost:5173
```
With `APPS_SCRIPT_URL` empty the site runs in **demo mode** (data stays in your browser only).
Open `/?demo=1` to test the guest-photo upload before the wedding day.

## 2. Google Sheet + Apps Script (the "database")
1. Create a new Google Sheet, name it e.g. "Wedding RSVP".
2. **Extensions → Apps Script**. Delete the default code, paste all of `apps-script/Code.gs`, save.
3. In the function dropdown choose **setup** → **Run** → accept the permissions
   (Sheets, Drive for photos, Gmail for the email copy). It creates the tabs RSVP / Wishes / Moments.
4. **Deploy → New deployment → type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the **Web app URL**.
5. Paste that URL into `src/config.js` → `APPS_SCRIPT_URL`.
6. If you change `Code.gs` later: Deploy → Manage deployments → edit → **New version**.

Excel: in the Sheet use **File → Download → Microsoft Excel (.xlsx)** any time.

## 3. Content to edit (`src/config.js`, `src/i18n.js`)
- Day program times (`program`) — current times are **placeholders**; titles/descriptions are in `i18n.js`.
- Maps link, wedding date, pre-shoot photos (put files in `public/gallery/`, list names in `gallery`).
- Music: replace `public/music.mp3`.

## 4. Deploy (Vercel)
Push to GitHub → import into Vercel (Framework: Vite). Build `npm run build`, output `dist`.

## How guests receive the invitation
After RSVP the guest instantly sees their personal card (PNG) with **Download** and
**Send via WhatsApp** buttons (on phones this opens the share sheet with the image attached).
If they typed an email, Apps Script also emails the card (Gmail limit ≈ 100 emails/day for free accounts).

## Notes
- Browsers block autoplay, so music starts when the guest taps "Open Invitation".
- Guest photos are compressed in the browser (max 1280px) and saved to a Drive folder.
- Anyone with the site link can post wishes/photos; moderate in the Sheet/Drive if needed.

## Intro film (couple entering the church)
Put your AI-generated video at `public/intro.mp4` (a 6-second placeholder is included — replace it).
It plays behind the church doors as they open; guests can tap **Skip**.
In `src/config.js`: `introVideoHasAudio: true` if the video has its own sound (music pauses meanwhile).
Use H.264 MP4, ideally under ~10 MB, portrait 9:16 works best on phones. Set `introVideo: ""` to disable.

## Personalised links
`https://your-site.vercel.app/?guest=Mr%20%26%20Mrs%20Silva` shows "Dear MR & MRS SILVA" on the doors.
