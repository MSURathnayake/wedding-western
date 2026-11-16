// ============================================================
//  EDIT THIS FILE to change anything about the invitation.
//  (Names, date, venues, program times are PLACEHOLDERS.)
// ============================================================

export const CONFIG = {
  // Paste your Google Apps Script "Web app" URL here (see README.md).
  // Leave empty ("") to run in DEMO mode (data kept only in this browser).
  APPS_SCRIPT_URL: "",

  bride: { en: "Dilini", si: "දිලිනි" },
  groom: { en: "Ruwan", si: "රුවන්" },

  brideParents: {
    en: "Daughter of Mr & Mrs Fernando",
    si: "ප්‍රනාන්දු මහතාගේ සහ එම මැතිණියගේ දියණිය",
  },
  groomParents: {
    en: "Son of Mr & Mrs Perera",
    si: "පෙරේරා මහතාගේ සහ එම මැතිණියගේ පුත්‍රයා",
  },

  // Wedding date & church service time — Sri Lanka time (+05:30)
  dateISO: "2027-04-24T10:00:00+05:30",
  rsvpDeadline: { en: "10 April 2027", si: "2027 අප්‍රේල් 10" },

  venues: [
    {
      key: "church",
      name: { en: "St. Mary's Church", si: "ශාන්ත මරියා දේවස්ථානය" },
      place: { en: "Colombo", si: "කොළඹ" },
      time: { en: "10.00 AM", si: "පෙ.ව. 10.00" },
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=St+Marys+Church+Colombo",
    },
    {
      key: "reception",
      name: { en: "The Reception Hall", si: "මංගල සංග්‍රහ ශාලාව" },
      place: { en: "Colombo", si: "කොළඹ" },
      time: { en: "1.00 PM", si: "ප.ව. 1.00" },
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Colombo",
    },
  ],

  // Guest "Moments" uploads open from this moment (wedding morning).
  // Tip: open the site with ?demo=1 to test uploads before that.
  momentsOpenFrom: "2027-04-24T00:00:00+05:30",

  // Day program (7 items — titles are in i18n.js). Times are placeholders.
  // icon: arrive | church | ring | camera | lunch | cake | car
  program: [
    { time: "09:30", icon: "arrive" },
    { time: "10:00", icon: "church" },
    { time: "11:15", icon: "ring" },
    { time: "12:00", icon: "camera" },
    { time: "13:00", icon: "lunch" },
    { time: "15:00", icon: "cake" },
    { time: "16:30", icon: "car" },
  ],

  // Pre-shoot gallery: put photos in /public/gallery and list the file names.
  gallery: [
    // "preshoot-1.jpg",
  ],

  // Intro film that plays when the church doors open (couple entering the church).
  // Replace public/intro.mp4 with your AI-generated video (portrait 9:16 or landscape both work).
  // Set to "" to disable. If the file is missing/unplayable the site simply skips it.
  introVideo: "/intro.mp4",
  // true  = the video has its own sound (background music pauses while it plays)
  // false = video is muted and the background music keeps playing
  introVideoHasAudio: false,

  // Replace public/music.mp3 with your hymn / song (e.g. Ave Maria, Canon in D).
  music: "/music.mp3",
};
