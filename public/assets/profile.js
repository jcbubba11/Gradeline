/* Profile page: one profile that feeds the resume builder, the LinkedIn checker and the assistant.
   Imports from LinkedIn's own exports (the profile "Save to PDF" file or the "Get a copy of your data" .zip),
   read in the browser. LinkedIn doesn't let outside sites edit profiles, so changes go back as copy-ready text
   with a link to the matching LinkedIn screen, and the person marks each section done.
   Stored in rp-profile, so it syncs with the account like other rp-* data.
   Loads on first visit (LAZY in app.js) and shares app.js globals. */
let PF = null;
const PF_LIMITS = { headline: 220, about: 2600, desc: 2000, title: 100 };
const PF_EMPTY = () => ({ name: "", headline: "", location: "", email: "", phone: "", links: "", about: "", exp: [], edu: [], projects: [], skills: "", certs: "", li: null, updatedAt: "" });
const pfN = s => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
const pfMonths = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

function pfLoad() { PF = { ...PF_EMPTY(), ...(store.get("rp-profile", null) || {}) }; ["exp", "edu", "projects"].forEach(k => { if (!Array.isArray(PF[k])) PF[k] = []; }); }
function pfSave() { PF.updatedAt = new Date().toISOString(); store.set("rp-profile", PF); }
function pfHasContent() { return !!(PF.name || PF.headline || PF.about || PF.exp.length || PF.edu.length || PF.skills); }

/* ---------- Form ---------- */
function pfField(path, label, opts = {}) {
  const id = "pf-" + path.replace(/\./g, "-");
  const val = esc(String(path.split(".").reduce((o, k) => o?.[k], PF) ?? ""));
  const lim = opts.limit ? ` <span class="hint pf-count" data-count="${path}" data-limit="${opts.limit}"></span>` : opts.hint ? ` <span class="hint">${opts.hint}</span>` : "";
  const input = opts.area ? `<textarea id="${id}" data-pk="${path}" rows="${opts.rows || 4}" placeholder="${esc(opts.ph || "")}">${val}</textarea>` : `<input type="text" id="${id}" data-pk="${path}" value="${val}" placeholder="${esc(opts.ph || "")}">`;
  return `<label class="field" for="${id}">${label}${lim}${input}</label>`;
}
function pfList(key, title, render) {
  return `<div class="sheet form-sec"><h3>${title} <button type="button" class="btn small" data-padd="${key}">+ Add</button></h3>${PF[key].map((e, i) => `<div class="entry"><div class="entry-head"><b>${title.replace(/s$/, "")} ${i + 1}</b><span class="btns">${i ? `<button type="button" class="icon-btn" data-pup="${key}.${i}" aria-label="Move up">↑</button>` : ""}<button type="button" class="icon-btn" data-pdel="${key}.${i}" aria-label="Remove">Remove</button></span></div>${render(i)}</div>`).join("") || `<p class="sub">Nothing here yet.</p>`}</div>`;
}
function pfRenderForm() {
  $("#pfForm").innerHTML = `
  <div class="sheet form-sec"><h3>Intro</h3>
    <div class="grid2">${pfField("name", "Full name", { ph: "Jordan Lee" })}${pfField("location", "Location", { ph: "Columbus, Ohio" })}</div>
    ${pfField("headline", "Headline", { limit: PF_LIMITS.headline, ph: "Marketing student at Ohio State | Social media and email campaigns | Seeking summer 2027 internships" })}
    <div class="grid2">${pfField("email", "Email")}${pfField("phone", "Phone", { hint: "Resume only" })}</div>
    ${pfField("links", "Links", { ph: "linkedin.com/in/you, github.com/you", hint: "Comma-separated. Include your LinkedIn URL." })}
  </div>
  <div class="sheet form-sec"><h3>About</h3>${pfField("about", "About", { area: true, rows: 6, limit: PF_LIMITS.about, ph: "Who you are, what you've done and what you're looking for, in your own voice." })}</div>
  ${pfList("exp", "Experiences", i => `
    <div class="grid2">${pfField(`exp.${i}.title`, "Title")}${pfField(`exp.${i}.company`, "Company")}</div>
    <div class="grid3">${pfField(`exp.${i}.loc`, "Location")}${pfField(`exp.${i}.start`, "Start", { ph: "Jun 2025" })}${pfField(`exp.${i}.end`, "End", { ph: "Present" })}</div>
    ${pfField(`exp.${i}.bullets`, "Description", { area: true, rows: 4, limit: PF_LIMITS.desc, ph: "One accomplishment per line" })}`)}
  ${pfList("edu", "Education", i => `
    <div class="grid2">${pfField(`edu.${i}.school`, "School")}${pfField(`edu.${i}.degree`, "Degree", { ph: "B.S. Biology" })}</div>
    <div class="grid2">${pfField(`edu.${i}.year`, "Years", { ph: "2023 – 2027" })}${pfField(`edu.${i}.details`, "Details", { ph: "GPA, honors, activities" })}</div>`)}
  <div class="sheet form-sec"><h3>Skills &amp; certifications</h3>
    ${pfField("skills", "Skills", { area: true, rows: 3, hint: "Comma-separated" })}
    ${pfField("certs", "Certifications", { area: true, rows: 2, hint: "One per line" })}
  </div>`;
  pfCounts();
}
function pfCounts() {
  document.querySelectorAll("#pfForm [data-count]").forEach(el => {
    const v = el.dataset.count.split(".").reduce((o, k) => o?.[k], PF) || "", lim = +el.dataset.limit;
    const n = (el.dataset.count.endsWith("bullets") ? pfDesc(v) : v).length;
    el.textContent = `${n} / ${lim}`; el.classList.toggle("over", n > lim);
  });
}
function pfSet(path, v) { const ks = path.split("."), last = ks.pop(); ks.reduce((o, k) => o[k], PF)[last] = v; }

/* ---------- What changed since the LinkedIn import ---------- */
const pfLiId = () => ((PF.links + " " + (PF.li?.url || "")).match(/linkedin\.com\/in\/([\w%-]+)/i) || [])[1] || "me";
const pfLi = path => `https://www.linkedin.com/in/${pfLiId()}/${path}`;
const pfDesc = b => (b || "").split("\n").map(l => l.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean).map(l => "• " + l).join("\n");
const pfExpKey = e => pfN(e.company) + "|" + pfN(e.title);
const pfSame = (a, b) => pfN(a) === pfN(b);
function pfSnapshot() {
  return { headline: PF.headline, location: PF.location, name: PF.name, about: PF.about, skills: PF.skills,
    exp: PF.exp.map(e => ({ ...e })), edu: PF.edu.map(e => ({ ...e })) };
}
function pfChanges() {
  const snap = PF.li?.snap, out = [];
  const st = (changed, isNew) => !snap ? "copy" : isNew ? "new" : changed ? "changed" : null;
  const intro = st(!pfSame(PF.headline, snap?.headline) || !pfSame(PF.location, snap?.location) || !pfSame(PF.name, snap?.name));
  if (intro && (PF.headline || PF.name)) out.push({ id: "intro", title: "Intro: name, headline, location", status: intro, text: PF.headline, label: "headline", limit: PF_LIMITS.headline,
    extra: [PF.name && `Name: ${PF.name}`, PF.location && `Location: ${PF.location}`].filter(Boolean).join(" · "),
    link: pfLi(""), how: "On your profile, click the pencil next to your name." });
  const about = st(!pfSame(PF.about, snap?.about));
  if (about && PF.about) out.push({ id: "about", title: "About", status: about, text: PF.about, limit: PF_LIMITS.about, link: pfLi(""), how: "On your profile, click the pencil on About." });
  PF.exp.forEach((e, i) => {
    if (!e.title && !e.company) return;
    const old = snap?.exp?.find(x => pfExpKey(x) === pfExpKey(e)) || snap?.exp?.find(x => pfSame(x.company, e.company));
    const s = st(old && (!pfSame(old.bullets, e.bullets) || !pfSame(old.title, e.title) || !pfSame(old.start, e.start) || !pfSame(old.end, e.end) || !pfSame(old.loc, e.loc)), snap && !old);
    if (s) out.push({ id: "exp." + i, title: `${e.title || "Role"}${e.company ? " at " + e.company : ""}`, status: s, text: pfDesc(e.bullets), label: "description", limit: PF_LIMITS.desc,
      extra: [[e.start, e.end].filter(Boolean).join(" – "), e.loc].filter(Boolean).join(" · "),
      link: s === "new" ? pfLi("edit/forms/position/new/") : pfLi("details/experience/"),
      how: s === "new" ? "Add a position, then paste the description." : "Click the pencil on this role, then paste the description." });
  });
  PF.edu.forEach((e, i) => {
    if (!e.school) return;
    const old = snap?.edu?.find(x => pfSame(x.school, e.school));
    const s = st(old && (!pfSame(old.degree, e.degree) || !pfSame(old.year, e.year) || !pfSame(old.details, e.details)), snap && !old);
    if (s) out.push({ id: "edu." + i, title: e.school, status: s, text: [e.degree, e.year, e.details].filter(Boolean).join("\n"), link: pfLi("details/education/"), how: s === "new" ? "Click + to add education." : "Click the pencil on this school." });
  });
  const now = PF.skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean), had = new Set((snap?.skills || "").split(/[,\n]/).map(pfN));
  const add = snap ? now.filter(s => !had.has(pfN(s))) : now;
  if (add.length) out.push({ id: "skills", title: snap ? `Skills to add (${add.length})` : "Skills", status: snap ? "new" : "copy", text: add.join(", "), link: pfLi("details/skills/"), how: "Click + and add each skill. LinkedIn takes them one at a time." });
  return out;
}
const PF_STATUS = { changed: "Changed here", new: "Not on LinkedIn yet", copy: "Copy to LinkedIn" };
function pfRenderChanges() {
  const list = pfChanges(), box = $("#pfChanges"), sub = $("#pfPushSub");
  if (!pfHasContent()) { sub.textContent = "Import from LinkedIn or fill in your profile to get started."; box.innerHTML = ""; return; }
  sub.textContent = !PF.li ? "You haven't imported from LinkedIn, so every section is listed. Import first to see only what changed."
    : list.length ? `Your LinkedIn was imported ${new Date(PF.li.at).toLocaleDateString()}. These sections differ. Copy each one, paste it on LinkedIn, then mark it done.`
    : "LinkedIn is up to date with your profile here.";
  box.innerHTML = list.map(c => {
    const over = c.limit && c.text.length > c.limit;
    return `<li class="pf-ch" data-ch="${esc(c.id)}">
      <div class="pf-ch-top"><b>${esc(c.title)}</b><span class="pill ${c.status}">${PF_STATUS[c.status]}</span></div>
      ${c.extra ? `<div class="pf-ch-extra">${esc(c.extra)}</div>` : ""}
      ${c.text ? `<pre class="pf-ch-text">${esc(c.text)}</pre>` : ""}
      ${c.limit ? `<div class="pf-ch-count${over ? " over" : ""}">${c.text.length} / ${c.limit} characters${over ? ". LinkedIn will cut this off, so shorten it first." : ""}</div>` : ""}
      <div class="pf-ch-how">${esc(c.how)}</div>
      <div class="btns">${c.text ? `<button type="button" class="btn small primary" data-pcopy="${esc(c.id)}">Copy ${esc(c.label || "text")}</button>` : ""}<a class="btn small" href="${esc(c.link)}" target="_blank" rel="noopener">Open on LinkedIn ↗</a>${PF.li ? `<button type="button" class="btn small" data-pdone="${esc(c.id)}">Mark done</button>` : ""}</div>
    </li>`;
  }).join("");
  if (PF.li && pfLiId() === "me") sub.textContent += " Add your LinkedIn URL under Links so the buttons open your exact profile.";
}
function pfMarkDone(id) {
  const snap = PF.li.snap;
  if (id === "intro") Object.assign(snap, { headline: PF.headline, location: PF.location, name: PF.name });
  else if (id === "about") snap.about = PF.about;
  else if (id === "skills") snap.skills = PF.skills;
  else {
    const [k, i] = id.split("."), cur = { ...PF[k][+i] };
    const match = k === "exp" ? x => pfExpKey(x) === pfExpKey(cur) || pfSame(x.company, cur.company) : x => pfSame(x.school, cur.school);
    const j = snap[k].findIndex(match);
    if (j >= 0) snap[k][j] = cur; else snap[k].push(cur);
  }
  pfSave(); pfRenderChanges(); toast("Marked as updated on LinkedIn");
}

/* ---------- LinkedIn PDF ("Save to PDF") ---------- */
function pfParsePdf(text) {
  const base = parseLinkedInPdf(text);
  const lines = text.split("\n").map(l => l.trim());
  const H = ["Contact", "Top Skills", "Languages", "Certifications", "Honors-Awards", "Summary", "Experience", "Education", "Publications", "Patents", "Projects", "Volunteer Experience"];
  const idx = {}; lines.forEach((l, i) => { if (H.includes(l) && idx[l] == null) idx[l] = i; });
  const block = name => {
    if (idx[name] == null) return [];
    const next = Object.values(idx).filter(i => i > idx[name]).sort((a, b) => a - b)[0] ?? lines.length;
    return lines.slice(idx[name] + 1, next).filter(l => l && !/^Page \d+ of \d+$/i.test(l));
  };
  const DATE = new RegExp(`^((?:${pfMonths})[a-z]* \\d{4}|\\d{4})\\s*[-–]\\s*(Present|(?:${pfMonths})[a-z]* \\d{4}|\\d{4})(\\s*\\(.*\\))?$`, "i");
  const DUR = /^\d+ (years?|months?)( \d+ months?)?$/i;
  const L = block("Experience"), dates = L.map((l, i) => DATE.test(l) ? i : -1).filter(i => i >= 0);
  // First work out where each role starts and which company it belongs to. A company with several roles
  // shows a total duration line ("2 years 3 months") under its name; later roles follow straight after the
  // previous role's description, so a line that reads like a sentence there means "same company".
  const looksLikeText = l => !l || l.length > 70 || /[.!,;]$/.test(l) || /^[a-z•\-*]/.test(l);
  let group = "";
  const roles = dates.map((d, k) => {
    const c = L[d - 2] || "";
    if (DUR.test(c)) { group = L[d - 3] || ""; return { d, start: d - 3, company: group }; }
    if (k && group && looksLikeText(c)) return { d, start: d - 1, company: group };
    group = c; return { d, start: d - 2, company: c };
  });
  const exp = roles.map(({ d, company }, k) => {
    const m = DATE.exec(L[d]), title = L[d - 1] || "";
    let p = d + 1, loc = "";
    if (L[p] && !DATE.test(L[p + 1] || "") && L[p].length < 70 && /,|Area|Remote|United States|Hybrid|On-site/i.test(L[p])) { loc = L[p]; p++; }
    const end = k + 1 < roles.length ? roles[k + 1].start : L.length;
    const bullets = [];
    L.slice(p, Math.max(p, end)).forEach(l => {
      if (/^[-•*▪●]\s*/.test(l) || !bullets.length) bullets.push(l.replace(/^[-•*▪●]\s*/, ""));
      else bullets[bullets.length - 1] += " " + l;
    });
    return { title, company, loc, start: m[1], end: m[2], bullets: bullets.join("\n") };
  });
  const E = block("Education"), edu = [];
  E.forEach((l, i) => {
    const m = /^(.*?)\s*·\s*\((.*)\)\s*$/.exec(l);
    if (m && E[i - 1] && !/·/.test(E[i - 1])) edu.push({ school: E[i - 1], degree: m[1].replace(/,\s*$/, ""), year: m[2].replace(/\s*-\s*/, " – "), details: "" });
  });
  if (!edu.length && E.length) edu.push({ school: E[0], degree: E[1] || "", year: "", details: "" });
  const pre = lines.slice(0, idx["Summary"] ?? idx["Experience"] ?? 0).filter(Boolean);
  const email = (block("Contact").join(" ").match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [])[0] || "";
  return {
    name: base.name || "", headline: base.liHeadline || "", location: base.liLocation ? pre[pre.length - 1] || "" : "",
    about: base.liAbout || "", email, url: base.liUrl || "", exp, edu, skills: base.liSkills || "",
    certs: block("Certifications").join("\n")
  };
}

/* ---------- LinkedIn data export (.zip of CSV files) ---------- */
async function pfUnzipCsvs(buf) {
  const u8 = new Uint8Array(buf), dv = new DataView(buf);
  let eo = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eo = i; break; }
  if (eo < 0) throw new Error("zip");
  const count = dv.getUint16(eo + 10, true), dec = new TextDecoder(), out = {};
  let p = dv.getUint32(eo + 16, true);
  for (let n = 0; n < count; n++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nl)), base = name.split("/").pop().toLowerCase();
    if (base.endsWith(".csv") && csize < 5e6) {
      const start = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
      const data = u8.subarray(start, start + csize);
      out[base] = dec.decode(method === 8 ? await inflateRaw(data) : data).replace(/^﻿/, "");
    }
    p += 46 + nl + el + cl;
  }
  return out;
}
function pfCsv(text, mustHave) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const h = rows.findIndex(r => r.includes(mustHave)); // some exports start with a notes line
  if (h < 0) return [];
  const head = rows[h].map(s => s.trim());
  return rows.slice(h + 1).filter(r => r.some(x => x.trim())).map(r => Object.fromEntries(head.map((k, i) => [k, (r[i] || "").trim()])));
}
function pfParseZip(files) {
  const get = (name, key) => files[name] ? pfCsv(files[name], key) : [];
  const prof = get("profile.csv", "First Name")[0] || {};
  const lines = s => (s || "").split(/\n+/).map(l => l.replace(/^\s*[-•*▪●]\s*/, "").trim()).filter(Boolean).join("\n");
  const emails = get("email addresses.csv", "Email Address");
  const sites = (prof.Websites || "").match(/https?:\/\/[^\s,\]]+/g) || [];
  return {
    name: [prof["First Name"], prof["Last Name"]].filter(Boolean).join(" "), headline: prof.Headline || "", location: prof["Geo Location"] || "",
    about: prof.Summary || "", email: (emails.find(e => /yes/i.test(e.Primary)) || emails[0] || {})["Email Address"] || "",
    phone: (get("phonenumbers.csv", "Number")[0] || {}).Number || "", links: sites.join(", "),
    exp: get("positions.csv", "Company Name").map(r => ({ title: r.Title, company: r["Company Name"], loc: r.Location, start: r["Started On"], end: r["Finished On"] || "Present", bullets: lines(r.Description) })),
    edu: get("education.csv", "School Name").map(r => ({ school: r["School Name"], degree: r["Degree Name"], year: [r["Start Date"], r["End Date"]].filter(Boolean).join(" – "), details: [r.Notes, r.Activities].filter(Boolean).join(" · ") })),
    projects: get("projects.csv", "Title").map(r => ({ name: r.Title, link: r.Url || [r["Started On"], r["Finished On"]].filter(Boolean).join(" – "), bullets: lines(r.Description) })),
    skills: get("skills.csv", "Name").map(r => r.Name).filter(Boolean).join(", "),
    certs: get("certifications.csv", "Name").map(r => [r.Name, r.Authority, r["Started On"]].filter(Boolean).join(", ")).join("\n")
  };
}

/* ---------- Import ---------- */
function pfApplyImport(got, source) {
  const filled = ["name", "headline", "about", "exp", "edu", "skills"].filter(k => Array.isArray(got[k]) ? got[k].length : got[k]);
  if (!filled.length) { $("#pfStatus").textContent = "Couldn't find profile sections in that file. Check it's the right file from LinkedIn."; return; }
  if (pfHasContent() && PF.updatedAt && (!PF.li || PF.updatedAt > PF.li.at) && !confirm("Replace your profile here with what's on LinkedIn?\n\nEdits you made here that aren't on LinkedIn yet will be replaced.")) return;
  const keep = { phone: PF.phone, links: PF.links, projects: PF.projects, certs: PF.certs, email: PF.email };
  PF = { ...PF_EMPTY(), ...keep };
  ["name", "headline", "location", "about", "email", "phone", "links", "skills", "certs"].forEach(k => { if (got[k]) PF[k] = got[k]; });
  ["exp", "edu", "projects"].forEach(k => { if (got[k]?.length) PF[k] = got[k]; });
  if (got.url && !/linkedin\.com\/in\//i.test(PF.links)) PF.links = [got.url, PF.links].filter(Boolean).join(", ");
  PF.li = { at: new Date().toISOString(), source, url: got.url || "", snap: pfSnapshot() };
  pfSave(); pfRenderForm(); pfRenderChanges();
  $("#pfStatus").textContent = source === "pdf"
    ? `Imported ${PF.exp.length} role${PF.exp.length === 1 ? "" : "s"} and ${PF.edu.length} school${PF.edu.length === 1 ? "" : "s"}. The PDF only has your top 3 skills and can split long descriptions oddly, so check each section. For everything, use the data export.`
    : `Imported ${PF.exp.length} role${PF.exp.length === 1 ? "" : "s"}, ${PF.edu.length} school${PF.edu.length === 1 ? "" : "s"} and ${PF.skills ? PF.skills.split(",").length : 0} skills. Check each section below.`;
}
async function pfPdfFile(file) {
  if (!file) return;
  if (!/\.pdf$/i.test(file.name)) { $("#pfStatus").textContent = "That isn't a PDF. Use Save to PDF on your LinkedIn profile."; return; }
  $("#pfStatus").textContent = "Reading your LinkedIn PDF…";
  try { pfApplyImport(pfParsePdf(await readPdf(await file.arrayBuffer())), "pdf"); }
  catch { $("#pfStatus").textContent = "Couldn't read that PDF here. Try the data export instead."; }
}
async function pfZipFile(file) {
  if (!file) return;
  if (!/\.zip$/i.test(file.name)) { $("#pfStatus").textContent = "That isn't a .zip. LinkedIn's data export arrives as a .zip file."; return; }
  $("#pfStatus").textContent = "Reading your LinkedIn data…";
  try {
    const files = await pfUnzipCsvs(await file.arrayBuffer());
    if (!files["profile.csv"] && !files["positions.csv"]) { $("#pfStatus").textContent = "That .zip doesn't look like a LinkedIn data export (no Profile.csv or Positions.csv)."; return; }
    pfApplyImport(pfParseZip(files), "export");
  } catch { $("#pfStatus").textContent = "Couldn't open that .zip here. Try unzipping it and dropping the LinkedIn PDF instead."; }
}

/* ---------- Using the profile elsewhere ---------- */
function pfToBuilder() {
  if (!pfHasContent()) { toast("Your profile is empty."); return; }
  const hasOwn = !B.example && (B.r.name || B.r.exp.some(x => x.title || x.bullets));
  if (hasOwn && !confirm("Replace the resume in your builder with your profile?\n\nYour current draft is kept as a backup in this browser.")) return;
  if (hasOwn) store.set("rp-builder-prev", B);
  B.mode = "resume"; B.example = false;
  B.r = { name: PF.name, location: PF.location, phone: PF.phone, email: PF.email, links: PF.links,
    summary: PF.about.length <= 400 ? PF.about : "",
    exp: PF.exp.map(e => ({ title: e.title, company: e.company, loc: e.loc, start: e.start, end: e.end, bullets: e.bullets })),
    projects: PF.projects.map(p => ({ name: p.name, link: p.link, bullets: p.bullets })),
    edu: PF.edu.map(e => ({ degree: e.degree, school: e.school, loc: "", year: e.year, details: e.details })),
    skills: PF.skills, certs: PF.certs };
  saveB(); initBuilder(); location.hash = "#build";
  if (PF.about.length > 400) setTimeout(() => toast("Your About was too long for a resume summary, so it was left out."), 300);
}
function pfToChecker() {
  if (!pfHasContent()) { toast("Your profile is empty."); return; }
  LI = { ...LI, name: PF.name, liHeadline: PF.headline, liAbout: PF.about, liLocation: !!PF.location,
    liExp: PF.exp.map(e => `${[e.title, e.company].filter(Boolean).join(", ")}${e.start ? ` (${[e.start, e.end].filter(Boolean).join(" – ")})` : ""}\n${pfDesc(e.bullets)}`).join("\n\n"),
    liEdu: PF.edu.map(e => [e.school, e.degree, e.year].filter(Boolean).join(", ")).join(" · "),
    liSkills: PF.skills, liUrl: (PF.links.match(/linkedin\.com\/in\/[\w%-]+/i) || [""])[0] };
  liExample = false; store.set("rp-linkedin", LI); liFill(); renderLinkedIn(); location.hash = "#linkedin";
}

/* ---------- Wiring ---------- */
function pfDrop(zone, input, handler) {
  zone.addEventListener("click", e => { if (!e.target.closest("a")) input.click(); });
  zone.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); } });
  ["dragenter", "dragover"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add("over"); }));
  ["dragleave", "drop"].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove("over"); }));
  zone.addEventListener("drop", e => handler(e.dataTransfer.files[0]));
  input.addEventListener("change", () => { handler(input.files[0]); input.value = ""; });
}
let pfReady = false, pfDeb;
function pfInit() {
  pfLoad(); pfRenderForm(); pfRenderChanges();
  if (pfReady) return;
  pfReady = true;
  pfDrop($("#pfDrop"), $("#pfPdf"), pfPdfFile);
  pfDrop($("#pfZipDrop"), $("#pfZip"), pfZipFile);
  const form = $("#pfForm");
  form.addEventListener("input", e => {
    const k = e.target.dataset.pk; if (!k) return;
    pfSet(k, e.target.value); pfCounts();
    clearTimeout(pfDeb); pfDeb = setTimeout(() => { pfSave(); pfRenderChanges(); }, 300);
  });
  form.addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return;
    const make = { exp: () => ({ title: "", company: "", loc: "", start: "", end: "", bullets: "" }), edu: () => ({ school: "", degree: "", year: "", details: "" }) };
    if (t.dataset.padd) PF[t.dataset.padd].push(make[t.dataset.padd]());
    else if (t.dataset.pdel) { const [k, i] = t.dataset.pdel.split("."); PF[k].splice(+i, 1); }
    else if (t.dataset.pup) { const [k, i] = t.dataset.pup.split("."); const a = PF[k]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; }
    else return;
    pfSave(); pfRenderForm(); pfRenderChanges();
  });
  $("#pfChanges").addEventListener("click", e => {
    const c = e.target.closest("[data-pcopy]"), d = e.target.closest("[data-pdone]");
    if (c) { const ch = pfChanges().find(x => x.id === c.dataset.pcopy); if (ch) copyText(ch.text); }
    if (d) pfMarkDone(d.dataset.pdone);
  });
  $("#pfToBuilder").onclick = pfToBuilder;
  $("#pfToChecker").onclick = pfToChecker;
  $("#pfAsk").onclick = () => window.aiAsk ? window.aiAsk("Look at my profile. Suggest a stronger LinkedIn headline and About section, and point out my weakest experience bullets with better versions.") : (location.hash = "#home");
  $("#pfClear").onclick = () => { if (!confirm("Clear your whole profile? This can't be undone.")) return; PF = PF_EMPTY(); store.set("rp-profile", null); try { localStorage.removeItem("rp-profile"); } catch {} pfRenderForm(); pfRenderChanges(); $("#pfStatus").textContent = ""; };
}
