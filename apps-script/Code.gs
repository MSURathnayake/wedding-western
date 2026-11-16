/**
 * Wedding invitation backend — Google Apps Script
 * Bound to a Google Sheet (Extensions → Apps Script). See README.md.
 *
 * Sheets used (created automatically by setup()):
 *   RSVP    : Time | Name | Phone | Email | Attending | Guests | Language
 *   Wishes  : Time | Name | Message
 *   Moments : Time | Name | Caption | FileId | Url
 * Guest photos are saved in a Drive folder named FOLDER_NAME.
 */

var FOLDER_NAME = "Wedding - Guest Moments";
var EVENT_EN = "Saturday, 24 April 2027 · 10.00 AM · St. Mary's Church, Colombo"; // <- change
var EVENT_SI = "2027 අප්‍රේල් 24 · පෙ.ව. 10.00 · ශාන්ත මරියා දේවස්ථානය, කොළඹ"; // <- change
var COUPLE = "Dilini & Ruwan"; // <- change to your names

var HEADERS = {
  RSVP: ["Time", "Name", "Phone", "Email", "Attending", "Guests", "Language"],
  Wishes: ["Time", "Name", "Message"],
  Moments: ["Time", "Name", "Caption", "FileId", "Url"],
};

// Run this ONCE from the editor (select "setup" → Run) and accept permissions.
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HEADERS).forEach(function (n) {
    var sh = ss.getSheetByName(n) || ss.insertSheet(n);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS[n]);
      sh.getRange(1, 1, 1, HEADERS[n].length).setFontWeight("bold").setBackground("#f3e3b5");
      sh.setFrozenRows(1);
    }
  });
  getFolder_();
  MailApp.getRemainingDailyQuota(); // triggers the email permission prompt
}

function getFolder_() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  if (it.hasNext()) return it.next();
  var f = DriveApp.createFolder(FOLDER_NAME);
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f;
}

function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name);
  if (!sh) { setup(); sh = ss.getSheetByName(name); }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Prevent spreadsheet formula injection (=, +, -, @ at start of a cell)
function clean_(v, max) {
  v = String(v == null ? "" : v).substring(0, max || 500);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var d = JSON.parse(e.postData.contents);
    var now = new Date();

    if (d.action === "rsvp") {
      sheet_("RSVP").appendRow([
        now, clean_(d.name, 80), clean_(d.phone, 30), clean_(d.email, 120),
        d.attending ? "YES" : "NO", Number(d.guests) || 0, d.lang === "si" ? "Sinhala" : "English",
      ]);
      var emailed = false;
      if (d.attending && d.email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
        emailed = sendCard_(d);
      }
      return json_({ ok: true, emailed: emailed });
    }

    if (d.action === "wish") {
      sheet_("Wishes").appendRow([now, clean_(d.name, 60), clean_(d.message, 500)]);
      return json_({ ok: true });
    }

    if (d.action === "moment") {
      var m = /^data:(image\/\w+);base64,(.+)$/.exec(d.image || "");
      if (!m) return json_({ ok: false, error: "bad image" });
      var blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], "moment-" + now.getTime() + ".jpg");
      var file = getFolder_().createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      var id = file.getId();
      sheet_("Moments").appendRow([now, clean_(d.name, 60), clean_(d.caption, 120), id, "https://drive.google.com/thumbnail?id=" + id + "&sz=w1000"]);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var a = e && e.parameter && e.parameter.action;

  if (a === "wishes") {
    var rows = rows_("Wishes", 200);
    return json_({ wishes: rows.map(function (r) { return { name: r[1], message: r[2] }; }) });
  }
  if (a === "moments") {
    var mr = rows_("Moments", 120);
    return json_({ moments: mr.map(function (r) { return { name: r[1], caption: r[2], url: r[4] }; }) });
  }
  if (a === "stats") {
    var sh = sheet_("RSVP");
    var n = sh.getLastRow() > 1 ? sh.getRange(2, 5, sh.getLastRow() - 1, 2).getValues() : [];
    var total = 0;
    n.forEach(function (r) { if (r[0] === "YES") total += Number(r[1]) || 0; });
    return json_({ attending: total });
  }
  return json_({ ok: true, service: "wedding" });
}

// newest first
function rows_(name, limit) {
  var sh = sheet_(name);
  var last = sh.getLastRow();
  if (last < 2) return [];
  var start = Math.max(2, last - limit + 1);
  return sh.getRange(start, 1, last - start + 1, sh.getLastColumn()).getValues().reverse();
}

function sendCard_(d) {
  try {
    var si = d.lang === "si";
    var attachments = [];
    var m = /^data:(image\/\w+);base64,(.+)$/.exec(d.cardImage || "");
    if (m) attachments.push(Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], "Wedding-Invitation.jpg"));
    var subject = si ? "ඔබේ මංගල ආරාධනා පත්‍රය — " + COUPLE : "Your wedding invitation — " + COUPLE;
    var html = si
      ? "<p>ආදරණීය " + esc_(d.name) + ",</p><p>අපගේ මංගල උත්සවයට එක්වීමට එකඟ වීම ගැන ස්තූතියි! ඔබේ ආරාධනා පත්‍රය මෙයට අමුණා ඇත.</p><p><b>" + EVENT_SI + "</b></p><p>ආදරයෙන්,<br>" + COUPLE + "</p>"
      : "<p>Dear " + esc_(d.name) + ",</p><p>Thank you for confirming! Your personal invitation is attached.</p><p><b>" + EVENT_EN + "</b></p><p>With love,<br>" + COUPLE + "</p>";
    MailApp.sendEmail({ to: d.email, subject: subject, htmlBody: html, attachments: attachments, name: COUPLE + " Wedding" });
    return true;
  } catch (err) {
    return false;
  }
}

function esc_(s) {
  return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
}
