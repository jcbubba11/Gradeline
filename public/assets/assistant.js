/* One Stop home assistant: a chat box on Home where people ask questions or attach photos and files.
   Replies come from Claude through our own small server (worker/ in the repo), which keeps the API key secret
   and only answers signed-in users. Until AI_ENDPOINT is set, the box still works: it points people to the
   right tool and sends resume files to the grader.
   Loads after app.js and search.js and shares their globals ($, esc, store, B, ACCT, acctLoad, acctOpen,
   readDocx, handleFile, resumeBlocks, blocksToHTML, blocksToText, initBuilder, saveB, loadText, toast). */

// After the first deploy of the assistant server, paste its address here (see SETUP.md), for example
// "https://onestop-ai.yourname.workers.dev". Leave it empty to keep the AI off.
const AI_ENDPOINT = "";

(() => {
const root = $("#ai");
if (!root) return;
const home = root.closest(".home"), log = $("#aiLog"), form = $("#aiForm"), q = $("#aiQ"), sendBtn = $("#aiSend");
const filesEl = $("#aiFiles"), fileIn = $("#aiFile"), newBtn = $("#aiNew"), ctxWrap = $("#aiCtxWrap"), ctxBox = $("#aiCtx");
const AI = { history: [], files: [], busy: false, ctrl: null, pendingTools: [], waitingAuth: false, offline: !AI_ENDPOINT };
const MAX_FILES = 5, MAX_PDF = 8e6, IMG_EDGE = 1600;
const TOOL_NAMES = { grade: "Grade yours", build: "Resume builder", internships: "Find jobs", linkedin: "LinkedIn checker", profile: "Your profile", match: "Match check", tailor: "Tailor & ATS check", kit: "Application kit", coach: "Bullet coach", "linkedin-post": "LinkedIn post helper", "follow-up": "Follow-up messages", interview: "Interview prep", tracker: "Job tracker", calendar: "Recruiting calendar", rejection: "Rejection to feedback", review: "Mentor review", gallery: "Before & after gallery", resumes: "Resume templates", "cover-letters": "Cover letter templates", tips: "Tips & checklist" };

/* ---------- Greeting ---------- */
function hello() {
  const name = ($("#acctMe")?.hidden === false && ($("#acctName").textContent || "").trim().split(/\s+/)[0]) || "";
  const h = new Date().getHours(), part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  $("#aiHello").textContent = name ? `${part}, ${name}` : "What can I help you with?";
}
hello();
new MutationObserver(hello).observe($("#acct"), { subtree: true, childList: true, attributes: true, attributeFilter: ["hidden"] });
function refreshCtx() { ctxWrap.hidden = AI.offline || !profileText() || AI.history.length > 0; }

/* ---------- Typing ---------- */
function grow() { q.style.height = "auto"; q.style.height = Math.min(q.scrollHeight, window.innerHeight * 0.4) + "px"; }
function canSend() { sendBtn.disabled = !AI.busy && !q.value.trim() && !AI.files.length; }
q.addEventListener("input", () => { grow(); canSend(); try { sessionStorage.setItem("gl-ai-draft", q.value); } catch {} });
q.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing && !matchMedia("(pointer: coarse)").matches) { e.preventDefault(); form.requestSubmit(); }
});
try { const d = sessionStorage.getItem("gl-ai-draft"); if (d) { q.value = d; grow(); } } catch {}
document.querySelectorAll("#aiChips button").forEach(b => b.addEventListener("click", () => {
  q.value = b.dataset.p; grow(); canSend(); q.focus();
  if (b.dataset.attach) fileIn.click();
}));

/* ---------- Attachments ---------- */
const b64 = buf => { const u8 = new Uint8Array(buf); let s = ""; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
function shrinkImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, IMG_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      res(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("img")); };
    img.src = url;
  });
}
async function addFiles(list) {
  for (const file of list) {
    if (AI.files.length >= MAX_FILES) { toast(`Up to ${MAX_FILES} files per message.`); break; }
    const name = file.name || "photo", low = name.toLowerCase();
    try {
      if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic|heif)$/.test(low)) {
        const url = await shrinkImage(file);
        AI.files.push({ kind: "image", name, file, thumb: url, block: { type: "image", source: { type: "base64", media_type: "image/jpeg", data: url.split(",")[1] } } });
      } else if (low.endsWith(".pdf")) {
        if (file.size > MAX_PDF) { toast("That PDF is over 8 MB. Try a smaller file."); continue; }
        AI.files.push({ kind: "pdf", name, file, block: { type: "document", source: { type: "base64", media_type: "application/pdf", data: b64(await file.arrayBuffer()) } } });
      } else if (low.endsWith(".docx") || /\.(txt|md)$/.test(low) || file.type.startsWith("text/")) {
        const text = low.endsWith(".docx") ? await readDocx(await file.arrayBuffer()) : await file.text();
        if (!text.trim()) { toast(`No text found in ${name}.`); continue; }
        AI.files.push({ kind: "text", name, file, block: { type: "text", text: `Attached file "${name}":\n\n${text.slice(0, 50000)}` } });
      } else if (low.endsWith(".doc")) { toast("Old .doc files can't be read. Save it as .docx or PDF first."); }
      else toast(`${name} isn't a photo, PDF, Word or text file.`);
    } catch { toast(/\.hei[cf]$/.test(low) ? "This browser can't open HEIC photos. Take a screenshot of it, or set your camera to JPEG." : `Couldn't read ${name}.`); }
  }
  paintFiles(); canSend();
}
function paintFiles() {
  filesEl.hidden = !AI.files.length;
  filesEl.innerHTML = AI.files.map((f, i) => `<li class="ai-file">${f.thumb ? `<img src="${f.thumb}" alt="">` : `<span class="ai-ft">${f.kind === "pdf" ? "PDF" : "DOC"}</span>`}<span>${esc(f.name)}</span><button type="button" data-rm="${i}" aria-label="Remove ${esc(f.name)}">×</button></li>`).join("");
}
filesEl.addEventListener("click", e => { const b = e.target.closest("[data-rm]"); if (!b) return; AI.files.splice(+b.dataset.rm, 1); paintFiles(); canSend(); q.focus(); });
fileIn.addEventListener("change", () => { addFiles([...fileIn.files]); fileIn.value = ""; });
["dragenter", "dragover"].forEach(ev => form.addEventListener(ev, e => { if ([...e.dataTransfer.types].includes("Files")) { e.preventDefault(); form.classList.add("over"); } }));
["dragleave", "drop"].forEach(ev => form.addEventListener(ev, e => { e.preventDefault(); if (ev === "drop" || !form.contains(e.relatedTarget)) form.classList.remove("over"); }));
form.addEventListener("drop", e => addFiles([...e.dataTransfer.files]));
q.addEventListener("paste", e => { const fs = [...(e.clipboardData?.files || [])]; if (fs.length) { e.preventDefault(); addFiles(fs); } });

/* ---------- Rendering ---------- */
function inline(s) {
  return esc(s)
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[\s(])\*([^*\s][^*\n]*?)\*(?=[\s).,!?:;]|$)/g, "$1<i>$2</i>")
    .replace(/\[([^\]\n]+)\]\((#[\w-]+|https:\/\/[^\s)<>"]+)\)/g, (m, t, u) => `<a href="${u}"${u[0] === "#" ? "" : ' target="_blank" rel="noopener"'}>${t}</a>`)
    .replace(/\[([^\]\n]{1,60})\](?!\()/g, "<mark>[$1]</mark>");
}
function md(src) {
  let html = "", list = null, para = [];
  const flushP = () => { if (para.length) { html += `<p>${para.map(inline).join("<br>")}</p>`; para = []; } };
  const flushL = () => { if (list) { html += `</${list}>`; list = null; } };
  for (const raw of String(src).replace(/\r/g, "").split("\n")) {
    const line = raw.trimEnd(); let m;
    if (!line.trim()) { flushP(); flushL(); continue; }
    if ((m = /^#{1,4}\s+(.*)$/.exec(line))) { flushP(); flushL(); html += `<h3>${inline(m[1])}</h3>`; continue; }
    if ((m = /^\s*[-*•]\s+(.*)$/.exec(line)) || (m = /^\s*\d+[.)]\s+(.*)$/.exec(line))) {
      flushP(); const kind = /^\s*\d/.test(line) ? "ol" : "ul";
      if (list !== kind) { flushL(); html += `<${kind}>`; list = kind; }
      html += `<li>${inline(m[1])}</li>`; continue;
    }
    if (/^\s*(---|\*\*\*)\s*$/.test(line)) { flushP(); flushL(); continue; }
    flushL(); para.push(line.trim());
  }
  flushP(); flushL();
  return html;
}
function nearBottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160; }
function toBottom(force) { if (force || nearBottom()) requestAnimationFrame(() => window.scrollTo(0, document.documentElement.scrollHeight)); }
function setChat(on) {
  root.dataset.state = on ? "chat" : "idle"; home.classList.toggle("chatting", on);
  log.hidden = !on; newBtn.hidden = !on; refreshCtx();
}
function meBubble(text, atts) {
  const el = document.createElement("div"); el.className = "ai-msg me";
  el.innerHTML = (atts.length ? `<div class="ai-att">${atts.map(f => f.thumb ? `<img src="${f.thumb}" alt="${esc(f.name)}">` : `<span>${esc(f.name)}</span>`).join("")}</div>` : "") + (text ? `<div>${esc(text)}</div>` : "");
  log.appendChild(el); return el;
}
function botBubble() { const el = document.createElement("div"); el.className = "ai-msg bot"; log.appendChild(el); return el; }

/* ---------- Tool cards ---------- */
const S = v => (typeof v === "string" ? v : v == null ? "" : String(v)).slice(0, 5000);
const A = (v, f) => (Array.isArray(v) ? v.slice(0, 12).map(f) : []);
function cleanResume(x) {
  x = x && typeof x === "object" ? x : {};
  return {
    name: S(x.name), location: S(x.location), phone: S(x.phone), email: S(x.email), links: S(x.links), headline: S(x.headline).slice(0, 220), summary: S(x.summary),
    exp: A(x.exp, e => ({ title: S(e?.title), company: S(e?.company), loc: S(e?.loc), start: S(e?.start), end: S(e?.end), bullets: S(e?.bullets) })),
    projects: A(x.projects, p => ({ name: S(p?.name), link: S(p?.link), bullets: S(p?.bullets) })),
    edu: A(x.edu, e => ({ degree: S(e?.degree), school: S(e?.school), loc: S(e?.loc), year: S(e?.year), details: S(e?.details) })),
    skills: S(x.skills), certs: S(x.certs)
  };
}
function resumeOnly(r) { const { headline, ...rest } = r; return rest; }
function resumeText(r) { const keep = B.mode; B.mode = "resume"; const t = blocksToText(resumeBlocks(r)); B.mode = keep; return t; }
// Same shape the profile page uses (assets/profile.js). Keeps any LinkedIn import snapshot.
function resumeToProfile(r) {
  const old = store.get("rp-profile", null) || {};
  return {
    ...old, name: r.name || old.name || "", headline: r.headline || old.headline || "", location: r.location || old.location || "",
    email: r.email || old.email || "", phone: r.phone || old.phone || "", links: r.links || old.links || "",
    about: r.summary || old.about || "",
    exp: r.exp.length ? r.exp.map(e => ({ title: e.title, company: e.company, loc: e.loc, start: e.start, end: e.end, bullets: e.bullets })) : old.exp || [],
    edu: r.edu.length ? r.edu.map(e => ({ school: e.school, degree: e.degree, year: e.year, details: e.details })) : old.edu || [],
    projects: r.projects.length ? r.projects : old.projects || [],
    skills: r.skills || old.skills || "", certs: r.certs || old.certs || "",
    updatedAt: new Date().toISOString()
  };
}
function resumeCard(input, host) {
  const r = cleanResume(input), card = document.createElement("div");
  card.className = "ai-card";
  card.innerHTML = `<span class="k">Resume draft</span><h4>${esc(r.name || "Your resume")}</h4>
    <div class="rdoc s-${esc(B.style || "classic")}">${blocksToHTML(resumeBlocks(resumeOnly(r)))}</div>
    <p>Check every line before you use it. Anything in [brackets] needs a real number or detail from you.</p>
    <div class="btns"><button type="button" class="btn primary" data-a="build">Open in the resume builder</button><button type="button" class="btn" data-a="profile">Save to my profile</button><button type="button" class="btn" data-a="grade">Grade it</button></div>`;
  card.addEventListener("click", e => {
    const a = e.target.closest("[data-a]")?.dataset.a; if (!a) return;
    if (a === "build") {
      const hasOwn = !B.example && (B.r.name || B.r.exp.some(x => x.title || x.bullets));
      if (hasOwn && !confirm("Replace the resume in your builder with this draft?\n\nYour current draft is kept as a backup in this browser.")) return;
      if (hasOwn) store.set("rp-builder-prev", B);
      B.mode = "resume"; B.example = false; B.r = resumeOnly(r); saveB(); initBuilder();
      location.hash = "#build";
    } else if (a === "profile") {
      store.set("rp-profile", resumeToProfile(r));
      toast("Saved to your profile"); location.hash = "#profile";
    } else loadText(resumeText(resumeOnly(r)), "resume");
  });
  host.appendChild(card);
}
function toolCard(input, host) {
  const tool = TOOL_NAMES[input?.tool] ? input.tool : null; if (!tool) return;
  const card = document.createElement("div"); card.className = "ai-card tool";
  const label = input.search && tool === "internships" ? `Search jobs for “${S(input.search).slice(0, 60)}”` : input.company && tool === "interview" ? `${S(input.company).slice(0, 60)} interview guide` : `Open ${TOOL_NAMES[tool]}`;
  card.innerHTML = `<p>${esc(S(input.why).slice(0, 200) || TOOL_NAMES[tool])}</p><div class="btns"><button type="button" class="btn primary">${esc(label)}</button></div>`;
  card.querySelector("button").onclick = () => {
    if (tool === "internships" && input.search && window.sxGo) window.sxGo({ go: { jobs: S(input.search).slice(0, 80) } });
    else if (tool === "interview" && input.company && window.sxGo) window.sxGo({ go: { co: S(input.company).slice(0, 80) } });
    else location.hash = "#" + tool;
  };
  host.appendChild(card);
}
function renderAssistant(content, host) {
  host.innerHTML = "";
  for (const b of content || []) {
    if (b.type === "text" && b.text.trim()) { const d = document.createElement("div"); d.className = "ai-text"; d.innerHTML = md(b.text); host.appendChild(d); }
    else if (b.type === "tool_use" && b.name === "build_resume") resumeCard(b.input, host);
    else if (b.type === "tool_use" && b.name === "open_tool") toolCard(b.input, host);
  }
}
function errorIn(host, msg) { const d = document.createElement("div"); d.className = "ai-err"; d.textContent = msg; host.appendChild(d); }

/* ---------- Saved conversation (this tab only) ---------- */
function save() { try { sessionStorage.setItem("gl-ai-chat", JSON.stringify(AI.history)); } catch { try { sessionStorage.removeItem("gl-ai-chat"); } catch {} } }
function restore() {
  let h; try { h = JSON.parse(sessionStorage.getItem("gl-ai-chat") || "null"); } catch {}
  if (!Array.isArray(h) || !h.length || AI.offline) return;
  AI.history = h; setChat(true);
  h.forEach(m => {
    if (m.role === "user") {
      const blocks = Array.isArray(m.content) ? m.content : [{ type: "text", text: m.content }];
      const atts = blocks.filter(b => b.type === "image" || b.type === "document" || (b.type === "text" && b.text.startsWith("Attached file")))
        .map(b => b.type === "image" ? { name: "photo", thumb: `data:${b.source.media_type};base64,${b.source.data}` } : { name: b.type === "document" ? "PDF" : (b.text.match(/^Attached file "([^"]+)"/) || [])[1] || "file" });
      const said = blocks.filter(b => b.type === "text" && !b.text.startsWith("Attached file") && !b.text.startsWith(PROFILE_PREFIX)).map(b => b.text).pop() || "";
      meBubble(said === FILE_ONLY ? "" : said, atts);
    } else renderAssistant(m.content, botBubble());
  });
  const last = h[h.length - 1];
  AI.pendingTools = last.role === "assistant" ? (last.content || []).filter(b => b.type === "tool_use").map(b => b.id) : [];
  toBottom(true);
}

/* ---------- Sending ---------- */
const PROFILE_PREFIX = "My saved One Stop profile, for context:", FILE_ONLY = "Please look at what I attached.";
function profileText() {
  const p = store.get("rp-profile", null); if (!p) return "";
  const parts = [p.name, p.headline, p.location, p.about && "About: " + p.about,
    ...(p.exp || []).map(e => `Experience: ${[e.title, e.company, e.loc].filter(Boolean).join(", ")} (${[e.start, e.end].filter(Boolean).join(" to ")})${e.bullets ? "\n" + e.bullets : ""}`),
    ...(p.edu || []).map(e => `Education: ${[e.degree, e.school, e.year].filter(Boolean).join(", ")}${e.details ? " · " + e.details : ""}`),
    p.skills && "Skills: " + p.skills, p.certs && "Certifications: " + p.certs].filter(Boolean);
  return parts.length > 1 ? parts.join("\n").slice(0, 12000) : "";
}
function busy(on) {
  AI.busy = on; sendBtn.classList.toggle("stop", on);
  sendBtn.setAttribute("aria-label", on ? "Stop" : "Send");
  sendBtn.innerHTML = on ? '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  canSend();
}
form.addEventListener("submit", e => {
  e.preventDefault();
  if (AI.busy) { AI.ctrl?.abort(); return; }
  const text = q.value.trim();
  if (!text && !AI.files.length) return;
  if (AI.offline) { offlineReply(text); return; }
  submit();
});
newBtn.onclick = () => {
  AI.ctrl?.abort(); AI.history = []; AI.pendingTools = []; save(); log.innerHTML = ""; setChat(false);
  hello(); q.focus();
};

async function signedInUser() {
  if (ACCT.user) return ACCT.user;
  try { await acctLoad(); } catch { return null; }
  if (ACCT.auth.currentUser) return ACCT.auth.currentUser;
  return new Promise(res => { const off = ACCT.auth.onAuthStateChanged(u => { off(); res(u); }); });
}
let authHooked = false;
function askSignIn(host) {
  const card = document.createElement("div"); card.className = "ai-card dark";
  card.innerHTML = `<span class="k" style="color:#b9c8ce">One more step</span><h4>Sign in to use the assistant</h4><p>It's free. An account keeps the assistant for real students and saves your work across devices. Your message is still in the box.</p><div class="btns"><button type="button" class="btn primary" data-t="up">Create free account</button><button type="button" class="btn" data-t="in">Sign in</button></div>`;
  card.addEventListener("click", e => { const t = e.target.closest("[data-t]")?.dataset.t; if (t) acctOpen(t); });
  host.appendChild(card);
  AI.waitingAuth = true;
  if (!authHooked && ACCT.auth) { authHooked = true; ACCT.auth.onAuthStateChanged(u => { if (u && AI.waitingAuth) { AI.waitingAuth = false; card.remove(); if (!log.children.length) setChat(false); submit(); } }); }
}

async function submit() {
  const text = q.value.trim();
  busy(true);
  const user = await signedInUser();
  if (!user) {
    busy(false);
    if (!log.querySelector(".ai-card.dark")) { setChat(true); askSignIn(log); toBottom(true); }
    return;
  }
  const files = AI.files.slice(), first = !AI.history.length;
  const content = AI.pendingTools.map(id => ({ type: "tool_result", tool_use_id: id, content: "Shown to the student as a card with buttons." }));
  files.forEach(f => content.push(f.block));
  if (first && !ctxWrap.hidden && ctxBox.checked) { const p = profileText(); if (p) content.push({ type: "text", text: `${PROFILE_PREFIX}\n${p}` }); }
  content.push({ type: "text", text: text || FILE_ONLY });
  AI.history.push({ role: "user", content });
  q.value = ""; grow(); AI.files = []; paintFiles();
  try { sessionStorage.removeItem("gl-ai-draft"); } catch {}
  setChat(true);
  const mine = meBubble(text, files), bot = botBubble();
  bot.innerHTML = '<span class="ai-think">Thinking…</span>';
  toBottom(true);

  const fail = msg => {
    AI.history.pop(); // keep the saved conversation valid: the failed turn is dropped
    if (!q.value) { q.value = text; grow(); }
    if (!AI.files.length) { AI.files = files; paintFiles(); }
    mine.style.opacity = ".55"; bot.innerHTML = ""; errorIn(bot, msg); toBottom();
  };
  AI.ctrl = new AbortController();
  let res;
  try {
    res = await fetch(AI_ENDPOINT.replace(/\/$/, "") + "/chat", {
      method: "POST", signal: AI.ctrl.signal,
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + await user.getIdToken() },
      body: JSON.stringify({ messages: AI.history })
    });
  } catch (e) { busy(false); fail(e.name === "AbortError" ? "Stopped." : "Couldn't reach the assistant. Check your connection and try again."); return; }
  if (!res.ok || !res.body) {
    let msg = "The assistant isn't available right now. Try again in a minute.";
    try { const j = await res.json(); if (j.message) msg = j.message; } catch {}
    busy(false); fail(msg); return;
  }

  // Server-sent events: content_block_* events as they stream, then one "final" event with the whole message.
  const blocks = [], reader = res.body.getReader(), dec = new TextDecoder();
  let buf = "", final = null, err = null, raf = 0;
  const paint = () => {
    raf = 0;
    const live = blocks.filter(Boolean).map(b => b.type === "tool_use" ? { type: "_tool", name: b.name } : b);
    bot.innerHTML = "";
    live.forEach(b => {
      if (b.type === "text" && b.text) { const d = document.createElement("div"); d.className = "ai-text"; d.innerHTML = md(b.text); bot.appendChild(d); }
      else if (b.type === "_tool") { const d = document.createElement("div"); d.className = "ai-think"; d.textContent = b.name === "build_resume" ? "Putting your resume together…" : "Adding a link…"; bot.appendChild(d); }
    });
    if (!bot.children.length) bot.innerHTML = '<span class="ai-think">Thinking…</span>';
    toBottom();
  };
  const handle = ev => {
    if (ev.type === "content_block_start") { blocks[ev.index] = { ...ev.content_block, text: ev.content_block.text || "" }; if (!raf) raf = requestAnimationFrame(paint); }
    else if (ev.type === "content_block_delta" && ev.delta.type === "text_delta" && blocks[ev.index]) { blocks[ev.index].text += ev.delta.text; if (!raf) raf = requestAnimationFrame(paint); }
    else if (ev.type === "final") final = ev.message;
    else if (ev.type === "error") err = ev.message;
  };
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i;
      while ((i = buf.indexOf("\n\n")) >= 0) {
        const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
        const data = chunk.split("\n").filter(l => l.startsWith("data:")).map(l => l.slice(5).trim()).join("");
        if (data) { try { handle(JSON.parse(data)); } catch {} }
      }
    }
  } catch (e) { err = e.name === "AbortError" ? "Stopped. That reply won't be part of the conversation." : "The connection dropped before the reply finished. Try again."; }
  if (raf) cancelAnimationFrame(raf);
  busy(false); AI.ctrl = null;

  const toolTruncated = final && final.stop_reason === "max_tokens" && final.content.some(b => b.type === "tool_use");
  if (!final || err || toolTruncated) {
    const partial = bot.querySelectorAll(".ai-text").length;
    fail(err || (toolTruncated ? "That reply was too long to finish. Try asking for less at once." : "The reply didn't finish. Try again."));
    if (partial && /^Stopped/.test(err || "")) { mine.style.opacity = ""; }
    return;
  }
  if (final.stop_reason === "refusal") { fail("I can't help with that one. Try asking another way."); return; }
  AI.history.push({ role: "assistant", content: final.content });
  AI.pendingTools = final.content.filter(b => b.type === "tool_use").map(b => b.id);
  renderAssistant(final.content, bot);
  if (!bot.children.length) errorIn(bot, "The assistant didn't say anything. Try rephrasing.");
  save(); toBottom();
}

/* ---------- Without AI: route to the right tool ---------- */
function offlineReply(text) {
  const files = AI.files.slice();
  setChat(true);
  meBubble(text, files);
  q.value = ""; grow(); AI.files = []; paintFiles(); canSend();
  try { sessionStorage.removeItem("gl-ai-draft"); } catch {}
  const bot = botBubble(), doc = files.find(f => f.kind !== "image"), photo = files.find(f => f.kind === "image");
  let html = "";
  if (doc) html += `<p>I can grade <b>${esc(doc.name)}</b> right away in your browser.</p>`;
  if (photo) html += `<p>Reading photos needs the AI assistant, which isn't switched on yet. For now, upload your resume as a PDF or Word file, or start fresh in the builder.</p>`;
  // Search on the meaningful words only, then word by word if the whole phrase finds no tool.
  const FILLER = new Set("i im i'm me my want wanna need to a an the and or for of in on with help can could you please how do does what where when should would get find make looking some any about it is are be this that am".split(" "));
  const words = (text.toLowerCase().match(/[a-z0-9+#']+/g) || []).filter(w => !FILLER.has(w));
  const query = words.join(" ");
  let hits = [];
  if (query && window.sxFind) {
    const res = window.sxFind(query);
    hits = res.groups.filter(g => g[0] !== "Search for it").flatMap(g => g[1]);
    if (!hits.length) words.filter(w => w.length > 3).forEach(w => window.sxFind(w).groups.filter(g => g[0] === "Tools").forEach(g => g[1].forEach(h => { if (!hits.some(x => x.t === h.t)) hits.push(h); })));
    hits = hits.slice(0, 3).concat(res.groups.filter(g => g[0] === "Search for it").flatMap(g => g[1]).slice(0, 1));
  }
  if (!doc && !photo) html += hits.length ? "<p>The AI assistant is coming soon. Here's where to go for that:</p>" : "<p>The AI assistant is coming soon. Try one of these tools:</p>";
  bot.innerHTML = `<div class="ai-text">${html}</div>`;
  if (doc) { const c = document.createElement("div"); c.className = "ai-card tool"; c.innerHTML = `<p>Score it out of 100 with line-by-line fixes.</p><div class="btns"><button type="button" class="btn primary">Grade ${esc(doc.name)}</button></div>`; c.querySelector("button").onclick = () => handleFile(doc.file); bot.appendChild(c); }
  if (photo && !doc) toolCard({ tool: "build", why: "Fill in a short form and download a PDF or Word resume." }, bot);
  (hits.length ? hits : ["build", "grade", "internships"].map(v => ({ t: TOOL_NAMES[v], d: "", go: { view: v } }))).forEach(h => {
    const c = document.createElement("div"); c.className = "ai-card tool";
    c.innerHTML = `<p><b>${esc(h.t)}</b>${h.d ? `<br><span style="color:var(--muted)">${esc(h.d)}</span>` : ""}</p><div class="btns"><button type="button" class="btn">Open</button></div>`;
    c.querySelector("button").onclick = () => window.sxGo ? window.sxGo(h) : (location.hash = "#" + (h.go.view || "home"));
    bot.appendChild(c);
  });
  toBottom(true);
}

/* ---------- Other pages can hand the assistant a question ---------- */
window.aiAsk = (text) => {
  location.hash = "#home";
  setTimeout(() => { q.value = text; grow(); canSend(); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }, 60);
};

restore(); refreshCtx(); canSend();
if (AI.offline) $("#aiFine").textContent = "The AI assistant is coming soon. Until then, ask here and we'll point you to the right free tool.";
window.addEventListener("hashchange", () => { if (location.hash === "#home" || !location.hash) refreshCtx(); });
})();
