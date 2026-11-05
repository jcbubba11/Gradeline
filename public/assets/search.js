/* One Stop site search: the header search box (opens with "/" or Ctrl/Cmd+K) and the search box on Home.
   Finds tools, sections inside pages, and company interview guides, then jumps there.
   Loads after app.js and shares its globals ($, esc, location-hash routing).
   Company names come from assets/search-data.json, written by tools/gen_seo.py from interview-bank.js. */
(() => {
const dlg = $("#sxDlg");
if (!dlg) return;

// Extra words people might type for each page, plus a one-line description. Titles come from the header menu.
const TOOLS = {
  home: ["Home", "Pick a goal and we'll point you to the right tool", "goals main menu"],
  grade: [null, "Score your resume or cover letter out of 100", "resume checker grader grade score review rate ats cover letter check feedback upload pdf red pen"],
  build: [null, "Make a resume from scratch and download a PDF", "resume builder maker create write new make pdf download"],
  internships: [null, "Search internships and entry-level jobs by major", "jobs internships internship openings search apply entry level new grad careers hiring positions co-op"],
  linkedin: [null, "Check your LinkedIn headline, About section and skills", "linkedin profile headline about summary optimize"],
  match: [null, "Compare your resume and LinkedIn side by side", "compare consistency resume vs linkedin mismatch"],
  tailor: [null, "Match your resume to a job posting's keywords", "ats keywords job description posting tailor robot applicant tracking system scan"],
  kit: [null, "A tailored cover letter, checklist and recruiter note for one job", "apply application cover letter job specific recruiter outreach kit"],
  coach: [null, "Rewrite weak bullets with action verbs and numbers", "bullet bullets points action verbs rewrite accomplishments quantify achievements"],
  "linkedin-post": [null, "Write a post about a new job, internship or project", "linkedin post announce new job share write"],
  "follow-up": [null, "Thank-you notes and follow-up emails after you apply or interview", "thank you email follow up followup message after interview networking note"],
  resumes: [null, "Resume templates you can copy and edit", "resume template templates format layout sample chronological"],
  "cover-letters": [null, "Cover letter templates you can copy and edit", "cover letter letters template sample example write"],
  examples: [null, "Good and bad resume and cover letter lines side by side", "examples good bad bullets sample lines"],
  gallery: [null, "Six resumes, before and after edits, by field", "before after examples makeover sample resumes"],
  interview: [null, "Practice questions, STAR answers and company guides", "interview interviews questions practice star behavioral technical prepare mock answers"],
  tracker: [null, "Track where you applied and what's next", "job tracker applications spreadsheet status deadlines reminders applied"],
  calendar: [null, "When each industry recruits for internships", "recruiting calendar timeline deadlines when to apply season dates"],
  rejection: [null, "Turn a rejection email into next steps and a reply", "rejected rejection email no feedback declined"],
  review: [null, "Share your resume with a mentor for comments", "mentor review share feedback comments friend advisor second opinion"],
  tips: [null, "Resume tips and a final checklist", "tips checklist advice formatting"],
  "how-we-grade": [null, "The rules behind each score and their sources", "methodology scoring sources rules rubric"],
  resources: [null, "Career guides and outside resources", "links guides career center resources"],
  privacy: ["Privacy", "What we store, and what never leaves your browser", "data privacy policy"],
  terms: ["Terms", "Terms of use", "terms of service legal"]
};
// Handy shortcuts to a spot inside a tool.
const SHORTCUTS = [
  ["STAR method", "How to answer behavioral questions, with tips", "star situation task action result behavioral tips", { ipTab: "star" }],
  ["Interview questions by company", "Guides to how big employers interview", "company companies employers guides firms", { ipTab: "company" }],
  ["Interview questions from your resume", "Questions built from the resume on the Grade page", "my resume questions", { ipTab: "resume" }]
];
const POPULAR = ["grade", "build", "internships", "interview", "kit", "cover-letters"];
const STOP = new Set("a an the and or of to for in on my me i how do does can what is are with your get make write find help need want".split(" "));

const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9+#]+/g, " ").trim();
let INDEX = null, COS_LOADED = false;

function viewTitle(v) {
  const a = document.querySelector(`header nav.tabs a[href="#${v}"]`);
  return (TOOLS[v] && TOOLS[v][0]) || (a && a.textContent.trim()) || (document.querySelector(`[data-view="${v}"] h1`)?.textContent || v).trim();
}
function entry(o) { o.tn = norm(o.t); o.kn = norm(o.k); o.dn = norm(o.d); return o; }
function buildIndex() {
  const out = [];
  Object.keys(TOOLS).forEach(v => out.push(entry({ cat: "Tools", t: viewTitle(v), d: TOOLS[v][1], k: TOOLS[v][2], go: { view: v }, boost: 8 })));
  SHORTCUTS.forEach(([t, d, k, go]) => out.push(entry({ cat: "Tools", t, d: "Interview prep · " + d, k, go, boost: 4 })));
  // Section headings inside each page, so "action verbs" or "which format" lands on the right spot.
  // Skips headings the tools write themselves (report checks, job details, tracker and calendar boxes).
  const seen = new Set(), DYNAMIC = "h2.ck, .jt-head h2, #ixSplit h2, [data-ip-pane] h2, #iPracticeBox h2";
  document.querySelectorAll("main [data-view] h2").forEach(h => {
    if (h.matches(DYNAMIC)) return;
    const sec = h.closest("[data-view]"), v = sec.dataset.view, t = h.textContent.trim();
    if (v === "home" || !t || t.length > 70 || h.classList.contains("sr-only") || h.closest("[hidden]:not([data-view])")) return;
    const key = v + "|" + t.toLowerCase();
    if (seen.has(key) || norm(t) === norm(viewTitle(v))) return;
    seen.add(key);
    if (!h.id) h.id = "sx-h-" + seen.size;
    out.push(entry({ cat: "On a page", t, d: "In " + viewTitle(v), k: "", go: { view: v, id: h.id }, boost: -2 }));
  });
  return out;
}
function loadCompanies() {
  if (COS_LOADED) return;
  COS_LOADED = true;
  fetch("assets/search-data.json").then(r => r.ok ? r.json() : Promise.reject()).then(d => {
    (d.companies || []).forEach(c => INDEX.push(entry({ cat: "Company interview guides", t: c.n, d: "Interview guide · " + c.g, k: (c.a || []).join(" ") + " interview guide", go: { co: c.n }, boost: 2 })));
    [sxHead, sxHome].forEach(s => s && s.refresh());
  }).catch(() => { COS_LOADED = false; });
}
function ensureIndex() { if (!INDEX) INDEX = buildIndex(); loadCompanies(); return INDEX; }

// Every word in the title/keywords/description that starts with the typed word counts; one typo is forgiven in longer words.
const words = s => s ? s.split(" ") : [];
function near(a, b) {
  if (Math.abs(a.length - b.length) > 1 || b.length < 5) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
function hit(text, t) {
  const ws = words(text);
  if (ws.some(w => w.startsWith(t))) return 3;
  if (t.length >= 3 && text.includes(t)) return 2;
  if (ws.some(w => near(w.slice(0, t.length + 1), t) || near(w, t))) return 1;
  return 0;
}
function score(e, qn, toks) {
  let s = 0, matched = 0;
  if (e.tn === qn) s += 120; else if (e.tn.startsWith(qn)) s += 80; else if ((" " + e.tn).includes(" " + qn)) s += 60;
  if (e.kn && (" " + e.kn + " ").includes(" " + qn + " ")) s += 40;
  toks.forEach(t => {
    const a = hit(e.tn, t), b = hit(e.kn, t), c = hit(e.dn, t);
    const best = Math.max(a * 10, b * 6, c * 3);
    if (best) { matched++; s += best; }
  });
  if (!matched || matched < Math.ceil(toks.length * 0.6)) return 0;
  return s + e.boost - (toks.length - matched) * 8;
}
function search(q) {
  const idx = ensureIndex(), qn = norm(q);
  if (!qn) return { groups: [["Popular", POPULAR.map(v => idx.find(e => e.go.view === v && !e.go.id))]], q: "" };
  let toks = qn.split(" ").filter(t => !STOP.has(t));
  if (!toks.length) toks = qn.split(" ");
  const ranked = idx.map(e => [score(e, qn, toks), e]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0]).map(x => x[1]);
  const LIMIT = { Tools: 6, "Company interview guides": 5, "On a page": 5 };
  const groups = ["Tools", "Company interview guides", "On a page"].map(c => [c, ranked.filter(e => e.cat === c).slice(0, LIMIT[c])]).filter(g => g[1].length);
  // Order groups by their best match, so "Goldman" shows the company guide first.
  groups.sort((a, b) => ranked.indexOf(a[1][0]) - ranked.indexOf(b[1][0]));
  const raw = q.trim().slice(0, 60);
  const acts = [{ cat: "Actions", t: `Find openings for “${raw}”`, d: "Search internships and entry-level jobs", go: { jobs: raw } }];
  if (!groups.some(g => g[0] === "Company interview guides" && norm(g[1][0].t) === qn)) acts.push({ cat: "Actions", t: `Interview prep for “${raw}”`, d: "A research plan and the questions most employers ask", go: { co: raw } });
  groups.push(["Search for it", acts]);
  return { groups, q: raw };
}

/* ---------- Going to a result ---------- */
function after(fn) { setTimeout(fn, 80); }
function goView(v, then) {
  if (location.hash.slice(1) === v) { if (then) then(); else window.scrollTo(0, 0); return; }
  location.hash = "#" + v;
  if (then) after(then);
}
function go(r) {
  const g = r.go;
  if (g.jobs != null) {
    goView("internships", () => { const q = $("#ixQ"); q.value = g.jobs; q.dispatchEvent(new Event("input", { bubbles: true })); q.scrollIntoView({ block: "center" }); q.focus({ preventScroll: true }); });
  } else if (g.co || g.ipTab) {
    // interview-prep.js loads on first visit; it reads window.sxPendingIp when it starts.
    window.sxPendingIp = { co: g.co, tab: g.ipTab };
    goView("interview", () => { if (window.ipOpen && window.sxPendingIp) { window.ipOpen(window.sxPendingIp); window.sxPendingIp = null; } });
  } else if (g.id) {
    goView(g.view, () => { const h = document.getElementById(g.id); if (!h) return; h.scrollIntoView({ block: "start" }); h.tabIndex = -1; h.focus({ preventScroll: true }); });
  } else goView(g.view);
}

/* ---------- Combobox ---------- */
function bind(input, list, opts) {
  let res = [], act = -1, uid = list.id;
  const live = opts.live;
  function render() {
    const { groups, q } = search(input.value);
    res = [];
    list.innerHTML = groups.map(([name, items], gi) => `<div role="group" aria-labelledby="${uid}-g${gi}"><div class="sx-grp" id="${uid}-g${gi}">${esc(name)}</div>${items.map(e => {
      const n = res.push(e) - 1;
      return `<div role="option" class="sx-opt" id="${uid}-o${n}" data-n="${n}" aria-selected="false"><b>${esc(e.t)}</b><span>${esc(e.d)}</span></div>`;
    }).join("")}</div>`).join("");
    setAct(q && res.length ? 0 : -1);
    if (live) { clearTimeout(render.t); render.t = setTimeout(() => { live.textContent = q ? `${res.length} result${res.length === 1 ? "" : "s"}` : ""; }, 400); }
  }
  function setAct(n) {
    act = n;
    list.querySelectorAll(".sx-opt").forEach(o => o.setAttribute("aria-selected", String(+o.dataset.n === n)));
    if (n >= 0) { input.setAttribute("aria-activedescendant", `${uid}-o${n}`); document.getElementById(`${uid}-o${n}`).scrollIntoView({ block: "nearest" }); }
    else input.removeAttribute("aria-activedescendant");
  }
  function pick(n) {
    const r = res[n]; if (!r) return;
    opts.close();
    input.value = "";
    go(r);
  }
  input.addEventListener("input", () => { opts.open(); render(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); opts.open();
      if (!res.length) render();
      const d = e.key === "ArrowDown" ? 1 : -1;
      setAct(act < 0 ? (d > 0 ? 0 : res.length - 1) : (act + d + res.length) % res.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (res.length) pick(act >= 0 ? act : 0);
    } else if (e.key === "Escape") {
      e.preventDefault(); e.stopPropagation();
      if (opts.isOpen() && (input.value || opts.inline)) { if (opts.inline) opts.close(); else { input.value = ""; render(); } }
      else opts.close();
    }
  });
  list.addEventListener("mousedown", e => e.preventDefault()); // keep focus in the box
  list.addEventListener("click", e => { const o = e.target.closest(".sx-opt"); if (o) pick(+o.dataset.n); });
  list.addEventListener("mousemove", e => { const o = e.target.closest(".sx-opt"); if (o && +o.dataset.n !== act) setAct(+o.dataset.n); });
  return { render, refresh() { if (opts.isOpen()) render(); } };
}

/* Header search (dialog) */
const q = $("#sxQ"), btn = $("#sxOpen");
const sxHead = bind(q, $("#sxList"), {
  live: $("#sxLive"),
  open() {}, isOpen: () => dlg.open,
  close() { if (dlg.open) dlg.close(); }
});
function openDlg(text) {
  if (dlg.open) { q.focus(); return; }
  ensureIndex();
  q.value = text || "";
  dlg.showModal();
  sxHead.render();
  q.focus();
}
btn.addEventListener("click", () => openDlg());
$("#sxClose").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); }); // click on the backdrop
dlg.addEventListener("cancel", e => { e.preventDefault(); dlg.close(); });
document.addEventListener("keydown", e => {
  const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey) && !e.altKey) { e.preventDefault(); openDlg(); }
  else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && !document.querySelector("dialog[open]")) { e.preventDefault(); openDlg(); }
});
btn.title = /Mac|iPhone|iPad/.test(navigator.platform) ? "Search (/ or ⌘K)" : "Search (/ or Ctrl+K)";

/* Home page search (inline dropdown) */
const hq = $("#homeQ"), hl = $("#homeSxList");
let sxHome = null;
if (hq && hl) {
  const wrap = hq.closest(".home-search");
  const setOpen = on => { hl.hidden = !on; hq.setAttribute("aria-expanded", String(on)); wrap.classList.toggle("open", on); };
  sxHome = bind(hq, hl, {
    inline: true, live: $("#homeSxLive"),
    open() { setOpen(true); }, isOpen: () => !hl.hidden,
    close() { setOpen(false); }
  });
  hq.addEventListener("focus", () => { ensureIndex(); setOpen(true); sxHome.render(); });
  hq.addEventListener("blur", () => setTimeout(() => setOpen(false), 120));
}
})();
