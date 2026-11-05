/* One Stop interview prep: question bank, company lookup and STAR guide.
   Runs after the main script and reuses its helpers ($, esc, store, toast, copyText),
   the saved answers object IA ("rp-star"), qkey(), iWords() and renderInterview(). */
(() => {
const sec = document.querySelector('[data-view="interview"]');
if (!sec || typeof IP_FIELDS === "undefined") return;

/* ---------- styles (kept here so index.html stays small) ---------- */
const css = document.createElement("style");
css.textContent = `
.ip-tabs { margin: 4px 0 16px; flex-wrap: wrap; border-radius: 4px; }
.ip-tabs button { border-radius: 3px; }
.ip-note { color: var(--muted); font-size: .9rem; margin: 0 0 10px; max-width: 70ch; }
.ip-top { display: grid; gap: 12px; margin-bottom: 14px; }
.ip-search { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.ip-search input { flex: 1 1 260px; min-width: 0; font: inherit; font-size: .95rem; border: 1px solid var(--line); border-radius: 4px; padding: 10px 12px; background: var(--paper); color: var(--ink); }
.ip-search .lp-toggle { white-space: nowrap; }
.ip-search input:focus { outline: 2px solid var(--blue); outline-offset: 1px; }
.ip-chiprow { display: grid; gap: 6px; }
.ip-chiprow > b { font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.ip-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.ip-chips button { font: inherit; font-size: .82rem; border: 1px solid var(--line); background: var(--paper); color: var(--ink); border-radius: 3px; padding: 5px 11px; cursor: pointer; }
.ip-chips button:hover { border-color: var(--blue); color: var(--blue); }
.ip-chips button[aria-pressed="true"] { background: var(--night); color: #fff; border-color: var(--night); }
.ip-chips button small { color: inherit; opacity: .65; margin-left: 4px; }
.ip-group { margin: 18px 0 8px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.ip-group h3 { font-size: 1.15rem; }
.ip-group span { font-size: .8rem; color: var(--muted); }
.ip-empty { padding: 18px; color: var(--muted); }
.qcard .tag.notes { color: var(--muted); background: var(--soft); }
.ip-one { padding: 0 18px 16px; display: grid; gap: 10px; }
.ip-one textarea { min-height: 90px; font-size: .86rem; }
.ip-one .foot { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; }
.ip-co-hero { background: var(--night); color: #fff; border-radius: 4px; padding: 22px 24px; display: grid; gap: 14px; margin-bottom: 14px; }
.ip-co-hero .k { font-size: .66rem; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: #b9c8ce; }
.ip-co-hero h2 { font-weight: 400; font-size: 2rem; color: #fff; }
.ip-co-hero p { color: #dfe7ea; font-size: .92rem; max-width: 75ch; }
.ip-co-hero ol { margin: 0; padding-left: 20px; display: grid; gap: 4px; font-size: .92rem; color: #dfe7ea; }
.ip-co-cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; }
.ip-co-hero a { color: #fff; }
.ip-co-links { display: flex; flex-wrap: wrap; gap: 8px; }
.ip-co-links a { font-size: .82rem; font-weight: 600; color: #fff; border: 1px solid rgba(255,255,255,.35); border-radius: 3px; padding: 5px 10px; text-decoration: none; }
.ip-co-links a:hover { background: rgba(255,255,255,.1); }
.ip-co-fine { font-size: .78rem; color: #b9c8ce !important; }
.ip-browse { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; margin-top: 6px; }
.ip-browse section { background: var(--paper); border: 1px solid var(--line); border-radius: 4px; padding: 14px 16px; }
.ip-browse h3 { font-size: 1rem; margin-bottom: 8px; }
.ip-browse ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
.ip-browse button { font: inherit; font-size: .88rem; background: none; border: 0; padding: 3px 0; color: var(--blue); cursor: pointer; text-align: left; }
.ip-browse button:hover { text-decoration: underline; }
.ip-how { background: var(--paper); border: 1px solid var(--line); border-radius: 4px; padding: 16px 18px; margin-top: 14px; font-size: .9rem; }
.ip-how h3 { font-size: 1.05rem; margin-bottom: 6px; }
.ip-how ol, .ip-how ul { margin: 6px 0 0; padding-left: 20px; display: grid; gap: 4px; }
.ip-guide { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; }
.ip-guide .sheet { padding: 18px 20px; border-radius: 4px; }
.ip-guide h2 { font-size: 1.3rem; margin-bottom: 8px; }
.ip-guide ul, .ip-guide ol { margin: 6px 0 0; padding-left: 20px; display: grid; gap: 5px; font-size: .9rem; }
.ip-guide p { font-size: .9rem; }
.ip-star-ex { display: grid; gap: 8px; margin-top: 8px; }
.ip-star-ex div { border-left: 3px solid var(--blue); padding: 2px 0 2px 12px; font-size: .9rem; }
.ip-star-ex b { display: block; font-size: .7rem; letter-spacing: .1em; text-transform: uppercase; color: var(--blue); }
.ip-wide { grid-column: 1 / -1; }
@media (max-width: 760px) { .ip-co-cols, .ip-guide { grid-template-columns: minmax(0, 1fr); } .ip-co-hero { padding: 18px; } .ip-co-hero h2 { font-size: 1.6rem; } }
`;
document.head.appendChild(css);

/* ---------- shared answer cards ---------- */
const ALL = []; // every bank question: { q, tip, kind, field, group }
IP_FIELDS.forEach(f => f.groups.forEach(g => g.qs.forEach(([q, tip]) => ALL.push({ q, tip: tip || "", kind: g.kind, field: f.id, group: g.name }))));
const hasAns = k => { const a = IA[k]; return !!(a && (a.s || a.t || a.a || a.r)); };
const tagFor = (k, kind) => hasAns(k) ? `<span class="tag done">answered</span>` : `<span class="tag ${kind === "notes" ? "notes" : ""}">${kind === "notes" ? "notes" : "STAR"}</span>`;
let uid = 0;
function card(x) {
  const k = qkey(x.q);
  return `<details class="sheet qcard" data-ipk="${k}" data-uid="ip${++uid}" data-kind="${x.kind}"><summary><span><b>${esc(x.q)}</b>${x.tip ? `<small>${esc(x.tip)}</small>` : ""}</span>${tagFor(k, x.kind)}</summary></details>`;
}
function fillCard(d) {
  if (d.dataset.filled) return; d.dataset.filled = "1";
  const k = d.dataset.ipk, u = d.dataset.uid, a = IA[k] || {};
  const f = (id, label, ph) => `<label class="field" for="${u}-${id}">${label}<textarea id="${u}-${id}" data-k="${k}" data-f="${id}" placeholder="${esc(ph)}">${esc(a[id] || "")}</textarea></label>`;
  const foot = `<div class="foot"><span class="page-meta" data-wc></span><button type="button" class="btn small" data-ipcopy="${k}">Copy answer</button></div>`;
  d.insertAdjacentHTML("beforeend", d.dataset.kind === "notes"
    ? `<div class="ip-one">${f("a", "Your answer or notes", "Write the key points you want to hit. Short phrases are fine.")}${foot}</div>`
    : `<div class="star">${f("s", "Situation", "Where were you, and what was going on?")}${f("t", "Task", "What were you responsible for, or what needed to happen?")}${f("a", "Action", "What did YOU do? Be specific.")}${f("r", "Result", "What changed? Use a number if you can.")}${foot}</div>`);
  words(d);
}
function words(d) {
  const a = IA[d.dataset.ipk] || {}, w = ["s", "t", "a", "r"].map(f => a[f] || "").join(" ").match(/\S+/g)?.length || 0;
  const el = d.querySelector("[data-wc]"); if (el) el.textContent = w ? `${w} words · about ${Math.max(1, Math.round(w / 150 * 60))} seconds spoken${w > 300 ? " · trim it" : ""}` : "";
}
function wire(el) {
  el.addEventListener("toggle", e => { if (e.target.matches && e.target.matches("details.qcard[data-ipk]") && e.target.open) fillCard(e.target); }, true);
  el.addEventListener("input", e => {
    const k = e.target.dataset.k, f = e.target.dataset.f; if (!k) return;
    const was = hasAns(k);
    IA[k] = IA[k] || {}; IA[k][f] = e.target.value; store.set("rp-star", IA);
    const d = e.target.closest("details"); if (d) words(d);
    if (was !== hasAns(k)) { const t = d && d.querySelector("summary .tag"); if (t) t.outerHTML = tagFor(k, d.dataset.kind); counts(); }
  });
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-ipcopy]"); if (!b) return;
    const a = IA[b.dataset.ipcopy] || {}; const txt = ["s", "t", "a", "r"].map(f => a[f]).filter(Boolean).join(" ");
    if (txt) copyText(txt); else toast("Write an answer first.");
  });
}

/* ---------- practice timer (shared box) ---------- */
let pool = null;
function practiceFrom(list) { pool = list.slice(); nextQ(); $("#iPracticeBox").scrollIntoView({ block: "nearest", behavior: "smooth" }); }
function nextQ() {
  if (!pool || !pool.length) { if (!IQ.length) renderInterview(); pool = IQ.map(x => x.q); }
  $("#iPracticeBox").hidden = false; $("#iPQ").textContent = pool[Math.floor(Math.random() * pool.length)];
  let s = 120; const tm = $("#iTimer"); tm.classList.remove("over"); clearInterval(iTimerId);
  const tick = () => { const a = Math.abs(s); tm.textContent = `${s < 0 ? "+" : ""}${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")}`; tm.classList.toggle("over", s < 0); s--; };
  tick(); iTimerId = setInterval(tick, 1000);
}
$("#iPractice").onclick = () => { if (!IQ.length) renderInterview(); practiceFrom(IQ.map(x => x.q)); };
$("#iNext").onclick = nextQ;

/* ---------- tabs ---------- */
const TABS = ["bank", "company", "resume", "star"];
function showTab(t) {
  if (!TABS.includes(t)) t = "bank";
  sec.querySelectorAll("[data-ip-tab]").forEach(b => b.setAttribute("aria-pressed", b.dataset.ipTab === t));
  sec.querySelectorAll("[data-ip-pane]").forEach(p => p.hidden = p.dataset.ipPane !== t);
  store.set("rp-ip-tab", t);
  clearInterval(iTimerId); $("#iPracticeBox").hidden = true;
  if (t === "resume") renderInterview();
  if (t === "company") renderCoHome();
}
sec.querySelector(".ip-tabs").addEventListener("click", e => { const b = e.target.closest("[data-ip-tab]"); if (b) showTab(b.dataset.ipTab); });

/* ---------- question bank ---------- */
const FIELD_FOR = { nursing: "nursing", tech: "swe", teaching: "teaching", accounting: "accounting", creative: "marketing", trades: "trades" };
const BK = { field: store.get("rp-ip-field", null) || FIELD_FOR[store.get("rp-field", "general")] || "behavioral", q: "", open: false };
const bank = $("#ipBank");
const chip = f => { const n = f.groups.reduce((s, g) => s + g.qs.length, 0); return `<button type="button" data-ipf="${f.id}" aria-pressed="${BK.field === f.id}">${esc(f.label)}<small>${n}</small></button>`; };
bank.innerHTML = `<div class="ip-top">
  <div class="ip-search"><input type="search" id="ipQ" placeholder="Search ${ALL.length} questions: conflict, DCF, patient..." aria-label="Search the question bank"><label class="lp-toggle"><input type="checkbox" id="ipOpen"> Only unanswered</label></div>
  <div class="ip-chiprow"><b>Any job</b><div class="ip-chips">${IP_FIELDS.filter(f => f.any).map(chip).join("")}</div></div>
  <div class="ip-chiprow"><b>By field</b><div class="ip-chips">${IP_FIELDS.filter(f => !f.any).map(chip).join("")}</div></div>
</div>
<div class="toolbar"><span class="page-meta" id="ipCount"></span><div class="btns"><button type="button" class="btn small primary" id="ipPractice">Practice a random question from this list</button></div></div>
<div id="ipList"></div>`;
wire($("#ipList"));
let shown = [];
function bankList() {
  const q = BK.q.trim().toLowerCase();
  let list = q ? ALL.filter(x => (x.q + " " + x.tip + " " + x.group).toLowerCase().includes(q)) : ALL.filter(x => x.field === BK.field);
  if (BK.open) list = list.filter(x => !hasAns(qkey(x.q)));
  const seen = new Set(); return list.filter(x => !seen.has(x.q) && seen.add(x.q));
}
function renderBank() {
  shown = bankList();
  bank.querySelectorAll("[data-ipf]").forEach(b => b.setAttribute("aria-pressed", !BK.q.trim() && b.dataset.ipf === BK.field));
  const label = id => (IP_FIELDS.find(f => f.id === id) || {}).label;
  const groups = []; shown.forEach(x => { const key = BK.q.trim() ? label(x.field) + " · " + x.group : x.group; let g = groups.find(y => y.key === key); if (!g) groups.push(g = { key, items: [] }); g.items.push(x); });
  $("#ipList").innerHTML = shown.length ? groups.map(g => `<div class="ip-group"><h3>${esc(g.key)}</h3><span>${g.items.length} question${g.items.length > 1 ? "s" : ""}</span></div><div class="qlist">${g.items.map(card).join("")}</div>`).join("")
    : `<div class="sheet ip-empty">${BK.open ? "You've answered every question here. Nice work. Untick \"Only unanswered\" to review them." : "No questions match. Try a shorter word."}</div>`;
  counts();
}
function counts() {
  const done = shown.filter(x => hasAns(qkey(x.q))).length;
  const el = $("#ipCount"); if (el) el.textContent = `${shown.length} questions · ${done} answered · ${ALL.filter(x => hasAns(qkey(x.q))).length} answered in the whole bank`;
}
bank.addEventListener("click", e => { const b = e.target.closest("[data-ipf]"); if (!b) return; BK.field = b.dataset.ipf; BK.q = ""; $("#ipQ").value = ""; store.set("rp-ip-field", BK.field); renderBank(); });
let qT; $("#ipQ").addEventListener("input", e => { clearTimeout(qT); qT = setTimeout(() => { BK.q = e.target.value; renderBank(); }, 120); });
$("#ipOpen").addEventListener("change", e => { BK.open = e.target.checked; renderBank(); });
$("#ipPractice").onclick = () => shown.length ? practiceFrom(shown.map(x => x.q)) : toast("No questions in this list.");

/* ---------- company lookup ---------- */
const co = $("#ipCompany");
const norm = s => s.toLowerCase().replace(/[^a-z0-9&]+/g, " ").trim();
function findCo(name) {
  const n = norm(name); if (!n) return null;
  const names = c => [c.n, ...c.a].map(norm), pad = ` ${n} `;
  return IP_COMPANIES.find(c => names(c).includes(n))
    || (n.length >= 3 ? IP_COMPANIES.find(c => names(c).some(x => x.startsWith(n))) : null)
    || IP_COMPANIES.find(c => names(c).some(x => x.length >= 4 && pad.includes(` ${x} `)));
}
const gsearch = q => "https://www.google.com/search?q=" + encodeURIComponent(q);
function trackerCos() {
  const rows = (typeof JOBS !== "undefined" && Array.isArray(JOBS)) ? JOBS : [];
  const names = rows.filter(j => j && j.company && !/\(example\)/i.test(j.company)).map(j => j.company.trim());
  return [...new Set(names)].slice(0, 12);
}
function coSearchBar(val) {
  const tc = trackerCos();
  return `<div class="ip-top"><form class="ip-search" id="ipCoForm"><input type="search" id="ipCoQ" list="ipCoList" value="${esc(val || "")}" placeholder="Type any company, e.g. Goldman Sachs, Amazon, PwC" aria-label="Company name"><datalist id="ipCoList">${IP_COMPANIES.map(c => `<option value="${esc(c.n)}">`).join("")}</datalist><button type="submit" class="btn primary">Find questions</button></form>
  ${tc.length ? `<div class="ip-chiprow"><b>From your job tracker</b><div class="ip-chips">${tc.map(n => `<button type="button" data-ipco="${esc(n)}">${esc(n)}</button>`).join("")}</div></div>` : ""}</div>`;
}
function renderCoHome() {
  if (co.dataset.view === "home") return;
  co.dataset.view = "home";
  co.innerHTML = coSearchBar("") + `<p class="ip-note">Guides for ${IP_COMPANIES.length} large employers of students and new grads: how their interviews usually run, what they say they look for, and questions candidates commonly report. Type any other company for a research plan and a tailored question set.</p>
  <div class="ip-browse">${IP_CO_GROUPS.map((g, i) => { const list = IP_COMPANIES.filter(c => c.g === i); return list.length ? `<section><h3>${esc(g)}</h3><ul>${list.map(c => `<li><button type="button" data-ipco="${esc(c.n)}">${esc(c.n)}</button></li>`).join("")}</ul></section>` : ""; }).join("")}</div>`;
}
function genericQs(name) {
  return [
    [`Why do you want to work at ${name}?`, "Name something specific: a product, a project, a value, or a person you talked to."],
    [`What do you know about ${name}?`, "What they sell, who their customers are, how they make money, and one recent piece of news."],
    [`Who do you think ${name}'s main competitors are, and how is ${name} different?`, "Shows you understand their market."],
    [`What's something ${name} could do better?`, "Be respectful and specific, and offer an idea."],
    [`Which ${name} product, service or project interests you most?`, "Pick one and explain why."],
    [`Where do you see ${name} in five years?`, "Tie it to industry trends you've read about."],
    [`Which of ${name}'s values do you connect with most?`, "Look up their values page and have a STAR story ready for each value."],
    [`Why this role at ${name} instead of a similar role somewhere else?`, ""]
  ].map(([q, tip]) => ({ q, tip, kind: "notes" })).concat([
    ["Tell me about yourself.", "60 to 90 seconds, ending with why this company and role."],
    ["Tell me about a time you worked on a team to reach a goal.", ""],
    ["Tell me about a time you faced a challenge and how you handled it.", ""],
    ["Tell me about a time you made a mistake and what you learned.", ""],
    ["Do you have any questions for us?", "Always have two or three ready about the team and the role."]
  ].map(([q, tip]) => ({ q, tip, kind: q.startsWith("Tell me about a time") ? "star" : "notes" })));
}
function fieldChips(ids) {
  return ids.map(id => IP_FIELDS.find(f => f.id === id)).filter(Boolean).map(f => `<button type="button" data-ipgo="${f.id}">${esc(f.label)}</button>`).join("");
}
let coShown = [];
function showCo(name) {
  name = (name || "").trim(); if (!name) return;
  const c = findCo(name); co.dataset.view = "co";
  const title = c ? c.n : name;
  const site = c && c.site;
  const links = `<div class="ip-co-links">
    ${site ? `<a href="${gsearch(`interview tips site:${site}`)}" target="_blank" rel="noopener">Their own interview tips</a>` : `<a href="${gsearch(`${name} careers interview tips`)}" target="_blank" rel="noopener">Their careers site</a>`}
    <a href="${gsearch(`${title} values mission`)}" target="_blank" rel="noopener">Their values</a>
    <a href="${gsearch(`"${title}" interview questions`)}" target="_blank" rel="noopener">What candidates report</a>
    <a href="https://news.google.com/search?q=${encodeURIComponent(title)}" target="_blank" rel="noopener">Recent news</a>
    <a href="https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(title)}" target="_blank" rel="noopener">People to ask on LinkedIn</a></div>`;
  coShown = c ? c.qs.map(([q, tip]) => ({ q, tip, kind: /^(tell me about|describe|give an example)/i.test(q) ? "star" : "notes" })) : genericQs(title);
  const hero = c ? `<div class="ip-co-hero"><span class="k">Company guide · ${esc(IP_CO_GROUPS[c.g])}</span><h2>${esc(c.n)}</h2>
      <div class="ip-co-cols"><div><span class="k">How interviews usually go</span><ol>${c.steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>
      <div><span class="k">What they look for</span><p>${esc(c.look)}</p></div></div>${links}
      <p class="ip-co-fine">Based on what ${esc(c.n)} publishes about its hiring and on commonly reported questions. Steps and questions vary by team, role and year, so ask your recruiter what to expect. That's a normal question.</p></div>`
    : `<div class="ip-co-hero"><span class="k">Company research plan</span><h2>${esc(title)}</h2>
      <p>We don't have a guide for ${esc(title)} yet, so here are the questions almost every company asks, tailored to ${esc(title)}, plus links to research them.</p>${links}
      <p class="ip-co-fine">Tip: candidate reports on sites like Glassdoor and Reddit are useful examples, but they're one person's memory. Use them to spot patterns, not to memorize answers.</p></div>`;
  const more = c ? fieldChips(c.fields) : fieldChips(["behavioral", "openers", "ask"]);
  co.innerHTML = coSearchBar(title) + hero +
    `<div class="toolbar"><span class="page-meta">${coShown.length} questions for ${esc(title)}</span><div class="btns"><button type="button" class="btn small primary" id="ipCoPractice">Practice these</button><button type="button" class="btn small" id="ipCoBack">All companies</button></div></div>
    <div class="qlist">${coShown.map(card).join("")}</div>
    <div class="ip-how"><h3>Keep practicing for this kind of job</h3><div class="ip-chips">${more}</div></div>
    <div class="ip-how"><h3>How to find the questions ${esc(title)} asks</h3><ol>
      <li>Ask your recruiter what the format is: video, phone, case, technical or panel. They expect the question.</li>
      <li>Read ${esc(title)}'s careers pages. Many big employers publish interview tips and say what they look for.</li>
      <li>Find their values or mission page and prepare one STAR story for each value.</li>
      <li>Message two or three alumni or employees on LinkedIn and ask what their interview was like.</li>
      <li>Skim candidate reports on Glassdoor, Indeed or Reddit for patterns, then practice those themes here.</li>
      <li>Read recent news so you can answer "What do you know about us?" with something current.</li></ol></div>`;
  co.scrollIntoView({ block: "start", behavior: "smooth" });
}
wire(co);
co.addEventListener("submit", e => { if (e.target.id === "ipCoForm") { e.preventDefault(); showCo($("#ipCoQ").value); } });
co.addEventListener("click", e => {
  const b = e.target.closest("[data-ipco]"); if (b) { showCo(b.dataset.ipco); return; }
  const g = e.target.closest("[data-ipgo]"); if (g) { BK.field = g.dataset.ipgo; BK.q = ""; $("#ipQ").value = ""; store.set("rp-ip-field", BK.field); renderBank(); showTab("bank"); sec.scrollIntoView({ block: "start" }); return; }
  if (e.target.id === "ipCoPractice") practiceFrom(coShown.map(x => x.q));
  if (e.target.id === "ipCoBack") { co.dataset.view = ""; renderCoHome(); }
});

/* ---------- STAR & tips ---------- */
$("#ipStar").innerHTML = `<div class="ip-guide">
  <div class="sheet"><h2>How STAR works</h2><p>Behavioral questions ("Tell me about a time...") are easiest to answer in four parts. Spend most of your time on Action and Result.</p>
    <ul><li><b>Situation</b>: one or two sentences of background.</li><li><b>Task</b>: what you were responsible for, or the goal.</li><li><b>Action</b>: what <i>you</i> did, step by step. Say "I", not only "we".</li><li><b>Result</b>: what changed, with a number if you can, and what you learned.</li></ul></div>
  <div class="sheet"><h2>An example answer</h2><p><i>"Tell me about a time you improved a process."</i></p><div class="ip-star-ex">
    <div><b>Situation</b>Our campus food pantry ran out of stock most Fridays.</div>
    <div><b>Task</b>As volunteer coordinator, I needed to keep shelves full all week.</div>
    <div><b>Action</b>I tracked what ran out first for three weeks, moved our big donation pickup from Monday to Wednesday, and set up a shared sign-up sheet for restocking shifts.</div>
    <div><b>Result</b>We didn't run out on a Friday for the rest of the semester, and served about 40 more students a week.</div></div></div>
  <div class="sheet"><h2>Build a story bank</h2><p>You don't need a different story for every question. Prepare six to eight strong stories and adapt them.</p>
    <ul><li>A team success, and a team conflict</li><li>A time you led something</li><li>A failure or mistake, and what you changed</li><li>A hard problem you solved</li><li>A time you went above and beyond for someone</li><li>A time you handled a lot of pressure or deadlines</li><li>A time you learned something fast</li></ul></div>
  <div class="sheet"><h2>Mistakes to avoid</h2><ul><li>Talking about the team so much the interviewer can't tell what you did.</li><li>Skipping the result, or ending with "and it went well".</li><li>Answers over two minutes. Aim for 150 to 300 words.</li><li>A "weakness" that's really a brag.</li><li>Criticizing a past boss, teacher or teammate.</li><li>Making up a story. Follow-up questions will expose it.</li></ul></div>
  <div class="sheet"><h2>Recorded video interviews</h2><p>Many large employers, especially banks, use one-way video interviews (such as HireVue) for first rounds.</p>
    <ul><li>Look at the camera, not your own face on screen.</li><li>You usually get about 30 seconds to think and 2 to 3 minutes to answer. Use the practice timer here to get used to it.</li><li>Quiet room, plain background, light in front of you, laptop at eye level.</li><li>Check whether you get retakes before you start.</li><li>Dress as you would in person.</li></ul></div>
  <div class="sheet"><h2>The day before</h2><ul><li>Reread the job posting and your resume.</li><li>Look up your interviewers on LinkedIn.</li><li>Prepare three questions to ask them (see "Questions to ask them" in the question bank).</li><li>Plan your route or test your video link.</li><li>Within 24 hours after, send a short thank-you note that mentions something specific you discussed.</li></ul></div>
</div>`;

/* ---------- init ---------- */
renderBank();
// Links from the company guide pages arrive as ?co=<company>#interview: open that company's guide.
// The site search opens a company guide or a tab through ipOpen, or leaves a request in sxPendingIp
// when it sends someone here before this file has loaded.
window.ipOpen = ({ co: name, tab } = {}) => {
  if (name) { showTab("company"); showCo(String(name).slice(0, 80)); } else if (tab) showTab(tab);
  sec.querySelector(".ip-tabs")?.scrollIntoView({ block: "start" });
};
const coParam = new URLSearchParams(location.search).get("co");
if (coParam) { showTab("company"); showCo(coParam.slice(0, 80)); history.replaceState(null, "", location.pathname + location.hash); }
else if (window.sxPendingIp) { const p = window.sxPendingIp; window.sxPendingIp = null; showTab(store.get("rp-ip-tab", "bank")); window.ipOpen(p); }
else showTab(store.get("rp-ip-tab", "bank"));
})();
