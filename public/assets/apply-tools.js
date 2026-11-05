/* One Stop: application kit, follow-up messages and rejection feedback.
   Loaded on demand the first time its page opens (see LAZY in assets/app.js).
   Uses the main script's globals ($, esc, store, toast, copyText, JOBS, IX, parseResume, requirements, ...). */
/* ================= Application kit ================= */
const kitA = s => (/^[aeiou]/i.test(s || "") ? "an " : "a ") + s;
const kitFirst = s => String(s || "").trim().replace(/^(mr|ms|mrs|mx|dr|prof)\.?\s+/i, "").split(/\s+/)[0] || "";
const kitCo = s => String(s || "").replace(/\s*\((?:example)\)\s*/i, "").trim();
const kitLc = s => /^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s;
const kitEnd = s => { s = String(s || "").trim().replace(/[\s;,]+$/, ""); return /[.!?]$/.test(s) ? s : s + "."; };
const kitName = s => { s = String(s || "").trim(); return s && s === s.toUpperCase() ? s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()) : s; };
const kitDots = s => s.replace(/([^.])\.\.(?!\.)/g, "$1.");
const kitAnd = a => a.length <= 1 ? (a[0] || "") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
function kitScore(checks) {
  const scored = checks.filter(c => !c.skip && c.w), tw = scored.reduce((s, c) => s + c.w, 0);
  const score = tw ? Math.round(scored.reduce((s, c) => s + c.w * VAL[c.status], 0) / tw * 100) : 0;
  return { score, letter: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F" };
}
let KIT = store.get("rp-kit", null) || { company: "", role: "", contact: "", job: "", resume: "", url: "", letter: "", note: "", msg: "", edited: {} };
KIT.edited ||= {};
const kitSave = () => store.set("rp-kit", KIT);
const KIT_IN = { kCompany: "company", kRole: "role", kContact: "contact", kJob: "job", kResume: "resume" };
function kitFromJob(j) {
  if (!j) return;
  KIT.company = kitCo(j.company); KIT.role = j.title || j.role || ""; KIT.url = j.url || j.link || "";
  KIT.job = ""; KIT.edited = {}; kitSave();
}
function kitFill() {
  if (!KIT.resume.trim()) { const r = currentDoc("resume"); if (r.trim() && !Object.values(SAMPLES).includes(r)) KIT.resume = r; }
  if (!KIT.job.trim() && !KIT.url && $("#jobText").value.trim() && $("#jobText").value !== SAMPLES.job) KIT.job = $("#jobText").value;
  const g = store.get("rp-grade", {}) || {};
  if (!KIT.company && !KIT.url && g.company) KIT.company = g.company;
  if (!KIT.role && !KIT.url && g.role) KIT.role = g.role;
  Object.entries(KIT_IN).forEach(([id, k]) => { if ($("#" + id).value !== KIT[k]) $("#" + id).value = KIT[k] || ""; });
  const n = $("#kLinkNote");
  if (KIT.url && /^https:\/\//i.test(KIT.url)) { n.hidden = false; n.innerHTML = `Copy the description from <a href="${esc(KIT.url)}" target="_blank" rel="noopener noreferrer nofollow">the ${esc(KIT.company || "company")} posting</a> and paste it above. Job sites don't let other sites read their listings, so this step is manual.`; }
  else n.hidden = true;
  $("#kPick").innerHTML = `<option value="">Load a saved job…</option>` + JOBS.map((j, i) => j.company || j.role ? `<option value="${i}">${esc(kitCo(j.company) || "Company")}${j.role ? " · " + esc(j.role) : ""}</option>` : "").join("");
}
// Pick the bullets that best cover the posting's requirements; numbers break ties.
function kitBullets(R, reqs, job) {
  const terms = reqs.length ? reqs.flatMap(r => r.terms) : units(job, 20);
  return R.bullets.map((b, i) => ({ b, i, s: relScore(b.text, terms) + (/\d|%|\$/.test(b.text) ? 1 : 0) }))
    .filter(x => x.b.text.split(/\s+/).length >= 5).sort((a, b) => b.s - a.s || a.i - b.i);
}
function kitSentence(b, lead) {
  const r = b.role, co = r && (r.company || "").trim(), t = r && (r.title || "").trim();
  const body = kitEnd(kitLc(b.text));
  if (lead === "as" && t && co) return `As ${kitA(t)} at ${co}, I ${body}`;
  if (co) return `At ${co}, I ${body}`;
  return `I ${body}`;
}
function kitLetter(R, reqs, job, contact) {
  const company = kitCo(KIT.company) || "[Company]", role = KIT.role.trim() || "[job title]";
  const picks = kitBullets(R, reqs, job);
  const [b1, b2, b3] = picks.map(p => p.b);
  const cur = R.roles[0];
  const kws = units(job, 24).filter(k => hasUnit(R.lines.join("\n"), k) && !/^(team|work|role|job|experience|skills?)$/.test(k));
  const skills = kws.filter(k => !/\s/.test(k) || k.split(/\s+/).length <= 3).slice(0, 3);
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const contactLine = [R.phone ? (R.lines.join(" ").match(/\(?\+?\d[\d\s().-]{8,}\d/) || [""])[0].trim() : "", R.email].filter(Boolean).join(" · ");
  const name = kitName(R.name) || "Your Name";
  const p1 = `I'm applying for the ${role} role at ${company} because [one specific reason ${company} stands out to you: a product you use, a project you read about, or something from their careers page]. ${cur && cur.title ? `I'd bring the same focus on results I've shown as ${kitA(cur.title)}${cur.company ? " at " + cur.company : ""}.` : "I'd bring the same focus on results I've shown in school, work and projects."}`;
  let p2 = b1 ? kitSentence(b1, "as") + (b3 ? " " + kitSentence(b3).replace(/^At [^,]+, I /, b3.role === b1.role ? "I also " : "$&") : "") + (/\d|%|\$/.test(b1.text + (b3 ? b3.text : "")) ? " That's the kind of measurable result I'd aim for in this role." : "") : "[Describe your strongest result: what you did, how you did it and the number that shows it worked.]";
  const rq = b2 ? reqs.map(r => ({ r, s: relScore(b2.text, r.terms) })).sort((a, b) => b.s - a.s)[0] : null;
  const asks = rq && rq.s > 0 ? rq.r.terms.slice(0, 2) : skills.slice(0, 2);
  let p3 = (asks.length ? `Your posting mentions ${kitAnd(asks)}. ` : "") + (b2 ? kitSentence(b2) : "[Add a second example that matches a key requirement in the posting.]");
  const more = skills.filter(s => !asks.includes(s) && !p2.toLowerCase().includes(s));
  if (more.length) p3 += ` I'm also comfortable with ${kitAnd(more)}, which ${company} lists for this role.`;
  const p4 = `I'd welcome the chance to discuss how I could help ${company} [name one goal from the posting, like growing a program or supporting a launch]. Thank you for considering my application.`;
  const greet = contact.trim() ? `Dear ${contact.trim()},` : "Dear Hiring Manager,";
  return [name, contactLine, "", date, "", greet, "", p1, "", p2, "", p3, "", p4, "", "Sincerely,", name].join("\n").replace(/\n{3,}/g, "\n\n").replace(/([^.])\.\.(?!\.)/g, "$1.");
}
function kitNote(R, job, contact) {
  const company = kitCo(KIT.company) || "[Company]", role = KIT.role.trim() || "[job title]";
  const hi = `Hi ${kitFirst(contact) || "[Name]"},`, me = kitFirst(kitName(R.name));
  const kws = units(job, 20).filter(k => hasUnit(R.lines.join("\n"), k) && !/^(team|work|role|job|experience)$/.test(k)).slice(0, 2);
  const opts = [
    `${hi} I just applied for the ${role} role at ${company}. My background is in ${kitAnd(kws)}, and I'd love to connect and learn more about the team.${me ? " " + me : ""}`,
    `${hi} I just applied for the ${role} role at ${company} and would love to connect and learn more about the team.${me ? " " + me : ""}`,
    `${hi} I just applied for the ${role} role at ${company}. I'd love to connect!`
  ];
  return opts.find(o => o.length <= 200 && (kws.length || !o.includes("background"))) || opts[2].slice(0, 200);
}
function kitMsg(R, picks, contact) {
  const company = kitCo(KIT.company) || "[Company]", role = KIT.role.trim() || "[job title]", b = picks[0] && picks[0].b;
  return `Thanks for connecting, ${kitFirst(contact) || "[Name]"}. I applied for the ${role} role at ${company} on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}. ${b ? kitSentence(b) + " " : ""}I'd be grateful for any advice on what the team looks for, or for a few minutes to talk if you're the right person to ask.\n\nThank you,\n${kitName(R.name) || "[Your name]"}`;
}
function kitRun() {
  const job = KIT.job, resume = KIT.resume;
  const sum = $("#kSum"), out = $("#kOut");
  const co = kitCo(KIT.company), role = KIT.role.trim();
  if (!job.trim() || !resume.trim()) {
    out.hidden = true;
    sum.innerHTML = `<div class="ttl"><small>Your kit</small><b>${esc(role || "Pick a job")}${co ? ` <span>at ${esc(co)}</span>` : ""}</b></div><p class="empty-msg">${!resume.trim() && !job.trim() ? "Paste the job posting and your resume above to build your kit." : !job.trim() ? "Now paste the job posting. Your kit builds as soon as both are filled in." : "Now add your resume. Your kit builds as soon as both are filled in."}</p>`;
    return;
  }
  out.hidden = false;
  const R = parseResume(resume), reqs = requirements(job);
  // 1. Resume check
  const rc = gradeResume(resume, job, role), rs = kitScore(rc);
  const kws = keywords(job), clean = resume.replace(/[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/\S+/g, " ");
  const hits = kws.filter(k => hasUnit(clean, k)), syns = kws.filter(k => !hits.includes(k) && !/[\s-]/.test(k) && synonymHit(clean, k));
  const miss = kws.filter(k => !hits.includes(k) && !syns.includes(k));
  const pct = kws.length ? Math.round((hits.length + syns.length * 0.75) / kws.length * 100) : 0;
  $("#kMissing").innerHTML = miss.length
    ? `<div class="kw">${miss.map(k => `<span class="miss">${esc(k)}</span>`).join("")}</div>` + (syns.length ? `<p class="note">Close but not exact: ${syns.map(k => `<b>${esc(k)}</b>`).join(", ")}. You use a related word; the posting's exact word is safer.</p>` : "") + `<p class="note">Already covered: ${hits.length} of ${kws.length} keywords.</p>`
    : `<p>Your resume already uses every top keyword from this posting.</p><div class="kw">${hits.map(k => `<span class="hit">${esc(k)}</span>`).join("")}</div>`;
  const fixes = rc.filter(c => !c.skip && c.w && c.status !== "pass" && c.id !== "r-keywords").sort((a, b) => (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1) || b.w - a.w).slice(0, 4);
  $("#kFixes").innerHTML = fixes.length ? fixes.map(c => `<li><span class="chip ${c.status}">${c.status === "fail" ? "fix!" : "fix"}</span><div><h4 class="ck">${esc(c.title)}</h4><p>${c.html ? c.detail.replace(/<div class="kw">[\s\S]*$/, "") : esc(c.detail || "")}</p></div></li>`).join("")
    : `<li><span class="chip pass">good</span><div><h4 class="ck">No big fixes</h4><p>Everything we score passes. Have someone proofread it before you send it.</p></div></li>`;
  // 2. Letter, 3. notes (kept if the user edited them)
  if (!KIT.edited.letter || !KIT.letter) KIT.letter = kitLetter(R, reqs, job, KIT.contact);
  if (!KIT.edited.note || !KIT.note) KIT.note = kitNote(R, job, KIT.contact);
  const picks = kitBullets(R, reqs, job);
  if (!KIT.edited.msg || !KIT.msg) KIT.msg = kitMsg(R, picks, KIT.contact);
  kitSave();
  if ($("#kLetter").value !== KIT.letter) $("#kLetter").value = KIT.letter;
  if ($("#kNote").value !== KIT.note) $("#kNote").value = KIT.note;
  if ($("#kMsg").value !== KIT.msg) $("#kMsg").value = KIT.msg;
  $("#kLetterRebuild").hidden = !KIT.edited.letter;
  kitLetterMeta();
  $("#kFindRec").href = LI_PEOPLE(`${co || "company"} ${/intern/i.test(role) ? "university recruiter" : "recruiter"}`);
  // 4. Plan
  const d = n => new Date(Date.now() + n * 864e5).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fu = t => `<button type="button" class="btn small" data-kfu="${t}">Write it</button>`;
  $("#kPlan").innerHTML = [
    ["Today", "Apply on the company's site", "Use the resume and letter above. Save a copy of exactly what you sent in your Job tracker.", ""],
    ["Today", "Send the LinkedIn note", "Connect with a recruiter or someone on the team. A short, specific note gets more replies than a long one.", ""],
    [d(7), "Follow up on your application", "If you haven't heard back after about a week, send one short, polite check-in.", fu("app")],
    ["After any interview", "Send a thank-you", "Within 24 hours. Mention one thing you talked about and why you want the job.", fu("thanks")],
    ["If you hear no", "Reply and ask for feedback", "Thank them, ask what would make you a stronger candidate, and stay in touch for future openings.", `<a class="btn small" href="#rejection">Read the email</a>`]
  ].map(([w, t, p, a]) => `<li><span class="when">${esc(w)}</span><div><b>${esc(t)}</b><p>${esc(p)}</p></div><div>${a}</div></li>`).join("");
  // Summary
  const ls = kitScore(gradeLetter(KIT.letter, job, co, role));
  sum.innerHTML = `<div class="ttl"><small>Your kit</small><b>${esc(role || "This job")}${co ? ` <span>at ${esc(co)}</span>` : ""}</b></div>
    <div class="st"><b>${rs.score}</b><span>Resume score</span></div>
    <div class="st"><b>${pct}%</b><span>Keyword match</span></div>
    <div class="st"><b>${miss.length}</b><span>Missing keywords</span></div>
    <div class="st"><b>${ls.score}</b><span>Letter score</span></div>`;
  markScrollers();
}
function kitLetterMeta() {
  const t = $("#kLetter").value, blanks = (t.match(/\[[^\]]+\]/g) || []).length, words = (t.match(/\S+/g) || []).length;
  $("#kLetterNote").textContent = `${words} words.` + (blanks ? ` ${blanks} part${blanks === 1 ? "" : "s"} in [brackets] still need your words before you send it.` : " No blanks left. Read it aloud once before you send it.");
  const n = $("#kNote").value.length; $("#kNoteCount").textContent = `${n} / 200`; $("#kNoteCount").classList.toggle("over", n > 200);
}
let kitDeb;
Object.entries(KIT_IN).forEach(([id, k]) => $("#" + id).addEventListener("input", () => {
  KIT[k] = $("#" + id).value;
  kitSave(); clearTimeout(kitDeb); kitDeb = setTimeout(kitRun, 350);
}));
[["kLetter", "letter"], ["kNote", "note"], ["kMsg", "msg"]].forEach(([id, k]) => $("#" + id).addEventListener("input", () => {
  KIT[k] = $("#" + id).value; KIT.edited[k] = true; kitSave(); kitLetterMeta(); if (k === "letter") $("#kLetterRebuild").hidden = false;
}));
$("#kPick").addEventListener("change", e => {
  const j = JOBS[+e.target.value]; e.target.value = ""; if (!j) return;
  KIT.company = kitCo(j.company); KIT.role = j.role || ""; KIT.url = j.link || ""; KIT.edited = {};
  if (j.packet && j.packet.resume && !KIT.resume.trim()) KIT.resume = j.packet.resume;
  kitSave(); kitFill(); kitRun(); toast(`Loaded ${KIT.company || "the saved job"}.`);
});
$("#kFromGrade").onclick = () => { const g = $("#resumeText").value; if (mode !== "resume" || !g.trim()) { toast("The Grade page has no resume loaded right now."); return; } KIT.resume = g; kitSave(); kitFill(); kitRun(); };
$("#kFromBuild").onclick = () => { KIT.resume = builderText("resume"); kitSave(); kitFill(); kitRun(); };
$("#kOpenGrade").onclick = () => { $("#jobText").value = KIT.job; $("#roleName").value = KIT.role; $("#companyName").value = kitCo(KIT.company); loadText(KIT.resume, "resume"); };
$("#kLetterCopy").onclick = () => copyText($("#kLetter").value);
$("#kLetterGrade").onclick = () => { $("#jobText").value = KIT.job; $("#roleName").value = KIT.role; $("#companyName").value = kitCo(KIT.company); loadText($("#kLetter").value, "letter"); };
$("#kLetterBuild").onclick = () => {
  const ps = $("#kLetter").value.split(/\n\s*\n/).map(s => s.trim());
  const gi = ps.findIndex(p => /^dear\b/i.test(p)), si = ps.findIndex((p, i) => i > gi && /^(sincerely|best|regards|kind regards|thank you),?/i.test(p));
  const body = gi >= 0 ? ps.slice(gi + 1, si > gi ? si : undefined) : ps;
  const head = (gi > 0 ? ps.slice(0, gi).join("\n") : "").split("\n").filter(Boolean);
  const R = parseResume(KIT.resume);
  B.l = { ...B.l, name: kitName(R.name) || head[0] || B.l.name, contact: head[1] || B.l.contact, date: head.find(l => /\b(19|20)\d{2}\b/.test(l) && !/@/.test(l)) || B.l.date,
    manager: gi >= 0 ? ps[gi].replace(/^dear\s+/i, "").replace(/,\s*$/, "").replace(/^hiring manager$/i, "") : B.l.manager, company: kitCo(KIT.company), role: KIT.role,
    hook: body[0] || "", story1: body[1] || "", story2: body.slice(2, -1).join("\n\n") || "", close: body.length > 2 ? body[body.length - 1] : "", signoff: "Sincerely," };
  B.mode = "letter"; B.example = false; saveB(); location.hash = "build"; setTimeout(() => { try { initBuilder(); setBMode("letter"); } catch {} }, 0);
};
$("#kLetterRebuild").onclick = () => { KIT.edited.letter = false; KIT.letter = ""; kitRun(); toast("Rebuilt from your resume."); };
document.querySelectorAll("[data-kcopy]").forEach(b => b.onclick = () => copyText($("#" + b.dataset.kcopy).value));
$("#kPlan").addEventListener("click", e => {
  const b = e.target.closest("[data-kfu]"); if (!b) return;
  const R = parseResume(KIT.resume);
  fuPrefill(b.dataset.kfu, { company: kitCo(KIT.company), role: KIT.role, them: kitFirst(KIT.contact), me: kitName(R.name) });
  location.hash = "follow-up";
});
$("#kTrack").onclick = () => {
  const co = kitCo(KIT.company);
  if (!co && !KIT.role) { toast("Add the company and job title first."); return; }
  const hit = JOBS.find(j => (KIT.url && j.link === KIT.url) || (kitCo(j.company).toLowerCase() === co.toLowerCase() && (j.role || "").toLowerCase() === KIT.role.trim().toLowerCase()));
  const packet = { resume: KIT.resume, letter: $("#kLetter").value, savedAt: new Date().toLocaleDateString() };
  if (hit) { hit.packet = packet; if (!hit.follow) hit.follow = addDays(today(), 7); }
  else JOBS.unshift({ company: co, role: KIT.role.trim(), status: "Saved", applied: "", link: KIT.url || "", follow: addDays(today(), 7), notes: "Application kit ready", packet });
  saveJobs(); renderJobs(); toast(hit ? "Updated in your Job tracker, with this resume and letter attached." : "Saved to your Job tracker, with this resume and letter attached.");
};
$("#kDownload").onclick = () => {
  const co = kitCo(KIT.company) || "Company", line = "=".repeat(48);
  const txt = [`APPLICATION KIT: ${KIT.role || "Job"} at ${co}`, new Date().toLocaleDateString(), "", line, "COVER LETTER", line, $("#kLetter").value, "", line, "LINKEDIN CONNECTION NOTE", line, $("#kNote").value, "", line, "MESSAGE AFTER THEY ACCEPT", line, $("#kMsg").value, "", line, "FOLLOW-UP PLAN", line,
    ...[...$("#kPlan").querySelectorAll("li")].map(li => `- ${li.querySelector(".when").textContent}: ${li.querySelector("b").textContent}. ${li.querySelector("p").textContent}`)].join("\n");
  saveFile(`${co.replace(/[^\w]+/g, "-")}-application-kit.txt`, txt);
};
$("#ixDetail").addEventListener("click", e => { if (e.target.closest("#ixKit")) kitFromJob(IX.sel); });
function kitInit() { kitFill(); kitRun(); }

/* ================= Follow-up messages ================= */
const FU_F = {
  me: ["Your name", "Jordan Lee"], them: ["Their first name", "Priya"], company: ["Company", "Northwind Outdoor Co."], role: ["Job title", "Marketing Coordinator"],
  when: ["When", "today"], topic: ["Something specific you talked about", "the summer product launch"], fit: ["A strength or result to mention", "I grew loyalty sign-ups 38% with an in-store campaign"],
  school: ["Your school", "Ohio State"], ask: ["What you're asking for", "15 minutes to hear about your path into marketing"], friend: ["How you know them", "we met at the fall career fair"]
};
const FU_TYPES = {
  app: { label: "Follow up on an application", ch: "email", when: "About 1 to 2 weeks after you apply, if you haven't heard back. Send it once; if there's still no answer a week later, move on.", f: ["me", "them", "company", "role", "when", "fit"], lab: { when: "When you applied" }, ex: { when: "last Tuesday" },
    build: v => ({ s: `Following up: ${v.role} application`, b: `Hi ${v.them},\n\nI applied for the ${v.role} role at ${v.company} ${v.when} and wanted to follow up. I'm still very interested in the position, and I think my experience is a strong fit: ${kitLc(v.fit)}.\n\nIf it would help, I'm happy to send anything else you need. Thank you for your time.\n\nBest,\n${v.me}` }) },
  thanks: { label: "Thank-you after an interview", ch: "email", when: "Within 24 hours of the interview. Send a separate note to each person you met, and change at least one line for each.", f: ["me", "them", "company", "role", "when", "topic", "fit"], lab: { when: "When you interviewed" }, ex: { when: "today" },
    build: v => ({ s: `Thank you, ${v.role} interview`, b: `Hi ${v.them},\n\nThank you for taking the time to talk with me ${v.when} about the ${v.role} role. I especially enjoyed hearing about ${v.topic}, and it made me even more excited about joining ${v.company}.\n\nOur conversation confirmed that the role is a great match for what I do best: ${kitLc(v.fit)}. I'd love to bring that to your team.\n\nPlease let me know if I can share anything else. I look forward to hearing about next steps.\n\nBest regards,\n${v.me}` }) },
  check: { label: "Check in after an interview", ch: "email", when: "When the date they gave you for a decision has passed by 2 or 3 business days. If they never gave a date, wait about a week after your thank-you note.", f: ["me", "them", "company", "role", "when"], lab: { when: "When you interviewed" }, ex: { when: "on October 20" },
    build: v => ({ s: `Checking in: ${v.role}`, b: `Hi ${v.them},\n\nI hope you're doing well. I interviewed for the ${v.role} role ${v.when} and wanted to check in on the timeline. I'm still very interested in joining ${v.company}.\n\nIf there's anything else I can send to help with your decision, just let me know.\n\nThank you,\n${v.me}` }) },
  recruiter: { label: "Reach out to a recruiter", ch: "email", when: "Before or right after you apply. Keep it under 120 words and make the ask easy to say yes to.", f: ["me", "them", "company", "role", "fit", "school"],
    build: v => ({ s: `${v.role} at ${v.company}: ${v.school} student`, b: `Hi ${v.them},\n\nI'm a student at ${v.school} and I'm applying for the ${v.role} role at ${v.company}. ${kitEnd(v.fit.charAt(0).toUpperCase() + v.fit.slice(1))} I'd love to bring that experience to your team.\n\nWould you be open to a quick call, or could you point me to the right person on the hiring team? I've attached my resume in case it's helpful.\n\nThank you,\n${v.me}` }) },
  referral: { label: "Ask for a referral", ch: "email", when: "Ask someone who knows you or your work. Make it easy: send the job link, your resume, and two lines they can forward.", f: ["me", "them", "company", "role", "friend", "fit"],
    build: v => ({ s: `Quick favor: ${v.role} at ${v.company}`, b: `Hi ${v.them},\n\nI hope you're doing well! I'm applying for the ${v.role} role at ${v.company}, and since ${v.friend}, I wanted to ask whether you'd be comfortable referring me.\n\nIn short: ${kitLc(v.fit)}. I've attached my resume and the job link, and I'm happy to write a short summary you can forward.\n\nNo pressure at all if it's not a good fit. Thank you either way!\n\n${v.me}` }) },
  alum: { label: "Connection note to an alum", ch: "linkedin", max: 200, when: "With your LinkedIn connection request. Free accounts get a 200-character note, so lead with your shared school.", f: ["me", "them", "company", "school", "role"],
    build: v => ({ s: "", b: [`Hi ${v.them}, I'm a ${v.school} student interested in ${v.role} roles and saw you work at ${v.company}. Would you be open to connecting? ${kitFirst(v.me)}`, `Hi ${v.them}, fellow ${v.school} student here, interested in ${v.company}. Would love to connect!`].find(t => t.length <= 200) || `Hi ${v.them}, fellow ${v.school} student here. Would love to connect!` }) },
  coffee: { label: "Ask for a coffee chat", ch: "linkedin", when: "Once they accept your connection request. Ask for 15 minutes and offer to work around their schedule.", f: ["me", "them", "company", "school", "ask"],
    build: v => ({ s: "", b: `Thanks for connecting, ${v.them}! I'm exploring careers at companies like ${v.company}, and I'd really value your perspective. Would you have ${v.ask}? I'm happy to work around your schedule.\n\nThank you,\n${v.me}` }) },
  chatThanks: { label: "Thanks after a coffee chat", ch: "email", when: "The same day. Mention one piece of advice and what you'll do with it, then follow up later to share how it went.", f: ["me", "them", "topic"], lab: { topic: "Advice they gave you" }, ex: { topic: "your advice to build a small portfolio" },
    build: v => ({ s: "Thank you for your time", b: `Hi ${v.them},\n\nThank you for taking the time to talk with me today. I really appreciated ${v.topic}, and I'm going to put it into practice this month.\n\nI'll keep you posted on how it goes. Thanks again for your help.\n\nBest,\n${v.me}` }) },
  reject: { label: "Reply to a rejection", ch: "email", when: "Within a day or two. Stay gracious: recruiters remember candidates who take a no well, and many hire them for later roles.", f: ["me", "them", "company", "role"],
    build: v => ({ s: `Re: ${v.role}`, b: `Hi ${v.them},\n\nThank you for letting me know, and for considering me for the ${v.role} role. I'm disappointed, but I really enjoyed learning about ${v.company}.\n\nIf you have a moment, I'd appreciate any feedback on how I could be a stronger candidate. I'd also love to be considered for future openings on the team.\n\nThank you again,\n${v.me}` }) }
};
let FU = store.get("rp-followup", null) || { type: "app", vals: {}, text: "", subject: "", edited: false };
const fuSave = () => store.set("rp-followup", FU);
function fuPrefill(type, vals) {
  FU.type = FU_TYPES[type] ? type : "app"; FU.edited = false;
  Object.entries(vals).forEach(([k, v]) => { if (v) FU.vals[k] = v; });
  fuSave();
}
function fuVals() {
  const T = FU_TYPES[FU.type], v = {};
  T.f.forEach(k => { const x = (FU.vals[k] || "").trim(); v[k] = x || `[${((T.lab || {})[k] || FU_F[k][0]).replace(/^Their first name$/, "Their name")}]`; });
  return v;
}
function fuRenderForm() {
  const T = FU_TYPES[FU.type];
  $("#fuTypes").innerHTML = Object.entries(FU_TYPES).map(([k, t]) => `<button type="button" data-fu="${k}" aria-pressed="${k === FU.type}">${esc(t.label)}</button>`).join("");
  $("#fuWhen").innerHTML = `<b>When to send it.</b> ${esc(T.when)}`;
  const fld = k => `<label class="field" for="fu-${k}">${esc((T.lab || {})[k] || FU_F[k][0])}<input type="text" id="fu-${k}" data-fuf="${k}" value="${esc(FU.vals[k] || "")}" placeholder="${esc((T.ex || {})[k] || FU_F[k][1])}"></label>`;
  const out = []; const f = [...T.f];
  while (f.length) { const a = f.shift(); if (["topic", "fit", "ask", "friend"].includes(a) || !f.length || ["topic", "fit", "ask", "friend"].includes(f[0])) out.push(fld(a)); else out.push(`<div class="fields-2">${fld(a)}${fld(f.shift())}</div>`); }
  $("#fuFields").innerHTML = out.join("");
}
function fuUpdate(rebuild) {
  const T = FU_TYPES[FU.type];
  if (rebuild || !FU.edited || !FU.text) { const r = T.build(fuVals()); FU.text = kitDots(r.b); FU.subject = r.s; FU.edited = false; }
  if ($("#fuText").value !== FU.text) $("#fuText").value = FU.text;
  if ($("#fuSubject").value !== FU.subject) $("#fuSubject").value = FU.subject;
  $("#fuSubjectWrap").hidden = T.ch !== "email";
  $("#fuEdited").hidden = $("#fuRebuild").hidden = !FU.edited;
  const n = FU.text.length, words = (FU.text.match(/\S+/g) || []).length;
  $("#fuCount").textContent = T.max ? `${n} / ${T.max} characters` : `${words} words`;
  const mail = $("#fuMail");
  if (T.ch === "email") { mail.textContent = "Open in email"; mail.href = `mailto:?subject=${encodeURIComponent($("#fuSubject").value)}&body=${encodeURIComponent(FU.text)}`; mail.removeAttribute("target"); }
  else { mail.textContent = "Copy and open LinkedIn"; mail.href = "https://www.linkedin.com/mynetwork/"; mail.target = "_blank"; mail.rel = "noopener"; }
  const C = [], blanks = FU.text.match(/\[[^\]]+\]/g) || [];
  C.push(blanks.length ? chk("fail", `Fill in ${blanks.length} blank${blanks.length === 1 ? "" : "s"}`, `Replace ${[...new Set(blanks)].slice(0, 4).join(", ")} before you send it.`) : chk("pass", "No blanks left", "Read it once more out loud before you send it."));
  if (T.max) C.push(n <= T.max ? chk("pass", `Fits LinkedIn's ${T.max}-character limit`, `${T.max - n} characters to spare.`) : chk("fail", `${n - T.max} characters over the limit`, `LinkedIn cuts connection notes at ${T.max} characters on free accounts. Trim it.`));
  else C.push(words <= 150 ? chk("pass", "Short enough to read on a phone", "Recruiters skim. Under 150 words is a good target.") : chk("warn", `${words} words`, "Try to keep follow-ups under 150 words."));
  if (T.ch === "email" && $("#fuSubject").value.trim() && !/\[/.test($("#fuSubject").value)) C.push(chk("pass", "Specific subject line", "Naming the role helps them find your application."));
  if (/\b(just checking|sorry to bother|i know you('re| are) busy)\b/i.test(FU.text)) C.push(chk("warn", "Sounds apologetic", "Skip \"sorry to bother you\". A polite, confident note reads better."));
  renderSimpleChecks($("#fuChecks"), C);
}
$("#fuTypes").addEventListener("click", e => { const b = e.target.closest("[data-fu]"); if (!b) return; FU.type = b.dataset.fu; FU.edited = false; fuSave(); fuRenderForm(); fuUpdate(true); });
$("#fuFields").addEventListener("input", e => { const k = e.target.dataset.fuf; if (!k) return; FU.vals[k] = e.target.value; fuSave(); fuUpdate(false); });
$("#fuText").addEventListener("input", () => { FU.text = $("#fuText").value; FU.edited = true; fuSave(); fuUpdate(false); });
$("#fuSubject").addEventListener("input", () => { FU.subject = $("#fuSubject").value; FU.edited = true; fuSave(); fuUpdate(false); });
$("#fuRebuild").onclick = () => { fuUpdate(true); fuSave(); };
$("#fuCopy").onclick = () => copyText(FU.text);
$("#fuMail").addEventListener("click", () => { if (FU_TYPES[FU.type].ch !== "email") copyText(FU.text); });
function fuInit() {
  if (!FU.vals.me) { const n = parseResume(KIT.resume || currentDoc("resume")).name; if (n && n.split(/\s+/).length <= 4 && !/@|\d/.test(n)) FU.vals.me = kitName(n); }
  if (!FU.vals.school) FU.vals.school = store.get("rp-school", "") || "";
  fuRenderForm(); fuUpdate(false);
}

/* ================= Rejection to feedback ================= */
const RJ_STAGES = [["pre", "Applied only"], ["screen", "Phone screen"], ["interview", "Interviews"], ["final", "Final round"]];
const RJ_WAITS = [["fast", "Within 3 days"], ["mid", "1 to 4 weeks"], ["slow", "Over a month"]];
const RJ_SIGNALS = [
  { id: "auto", re: /\b(do not reply|no-?reply|this (e-?mail|mailbox|inbox) is not monitored|automated (message|email))\b/i, say: "This is an automated email, so nobody will read a reply to it." },
  { id: "template", re: /\b(after careful (consideration|review)|decided (not )?to (move forward|pursue|proceed) with other|other candidates whose|not (be )?(moving|proceeding) forward with your|will not be (moving|proceeding)|unable to offer you)\b/i, say: "Standard rejection wording. Companies send this to almost everyone they turn down, so it says little about you." },
  { id: "filled", re: /\b((position|role|job|opening) (has been|was|is now|has now been) (filled|closed|cancell?ed|put on hold|on hold)|no longer (hiring|accepting|recruiting|available)|internal candidate|requisition (has been |was )?(closed|cancell?ed))\b/i, say: "The role was filled, closed or put on hold. That's often about timing or budget, not your application." },
  { id: "volume", re: /\b((high|large|overwhelming|record|significant) (volume|number) of (applicants|applications|candidates)|highly competitive|many (highly )?(qualified|talented|strong|impressive) (applicants|candidates))\b/i, say: "They mention a lot of applicants. For popular roles the bar to get noticed is mostly about how closely your resume matches the posting." },
  { id: "fit", re: /\b(more closely (match|matches|aligns?|aligned)|better (fit|match|aligned)|closely (aligned|align|match) with|(specific|current) (needs|requirements)|qualifications (that )?(more|better)( closely)?( match| align(ed)?)?)\b/i, say: "They chose people who \"more closely match\" the role. Usually that means another candidate showed the main requirements more directly." },
  { id: "experience", re: /\b((more|additional|specific|direct|relevant) experience|level of experience|more senior|years of experience)\b/i, say: "They point to experience. Either the posting asked for more than your resume shows, or your experience wasn't framed in the posting's terms." },
  { id: "met", re: /\b(interview(s|ed|ing)?|taking the time to (speak|meet|talk|interview)|speaking with (us|our team|me)|time you (spent|took)|conversations? with|meeting (with )?(us|the team))\b/i, say: "It mentions your conversations, so you made it past the resume screen." },
  { id: "close", re: /\b(final (round|stage|interview)s?|on-?site|super ?day|(difficult|tough|hard|close) (decision|call|choice)|it was (a )?(very )?(close|tough|difficult))\b/i, say: "They call it a close or difficult decision, which usually means you were one of the last few candidates." },
  { id: "future", re: /\b(keep your (resume|application|information|details|profile) on file|encourage you to (re-?apply|apply again|apply for)|future (opportunities|openings|roles|positions)|stay in touch|talent (community|network|pool))\b/i, say: "They invite you to apply again. Many companies do mean this: past finalists are often contacted first for the next opening." },
  { id: "nofeedback", re: /\b((unable|not able) to (provide|offer|share|give)|(cannot|can't|do not|don't) (provide|offer|share|give)) (individual |individualized |specific |detailed |personal )?feedback\b/i, say: "They say they can't give feedback. That's usually a legal policy, so don't press for it." },
  { id: "personal", re: /\b(I (really )?(enjoyed|appreciated|wanted to (let you know|reach out|call))|it was (great|a pleasure) (meeting|speaking|talking))\b/i, say: "It reads as written by a person, not a template. That's a good sign for future roles at this company." }
];
const RJ_REASONS = {
  ats: ["The resume didn't match the posting's keywords", "Fast rejections often come from applicant tracking software or a quick skim. If the posting's main skills aren't in your resume in the same words, you can get filtered out before a person reads it.", [["Match your resume to the next posting", "#kit"], ["See what the software reads", "#tailor"]]],
  knockout: ["A basic requirement wasn't met", "Questions about work authorization, location, graduation date, GPA or availability can reject an application automatically. Check that your answers and dates match what the posting asks for.", []],
  volume: ["Too many applicants for the openings", "Popular internships get hundreds of applications. Applying in the first week a role is posted and getting a referral both raise your odds a lot.", [["Find roles posted this week", "#internships"], ["Ask for a referral", "#follow-up:referral"]]],
  fit: ["Others showed the main requirements more directly", "When a rejection says others \"more closely match\", it usually means their resumes proved the top two or three requirements with a specific result.", [["Check which requirements you prove", "#tailor"]]],
  experience: ["They wanted more direct experience", "Projects, class work, clubs and part-time jobs count. Describe them with the posting's words and a number, and look for roles labeled intern, entry level or associate.", [["Strengthen your bullets", "#coach"]]],
  filled: ["The role was filled or closed", "Roles close because of internal hires, budget changes or a candidate who applied earlier. It's not about your application, so set a reminder and watch for the next opening.", [["Watch new openings", "#internships"]]],
  screenBasics: ["The phone screen answers missed the basics", "Phone screens check why you want the company, your availability, pay expectations and a clear two-minute story about yourself. A vague answer to \"why us?\" is a common cause.", [["Practice common questions", "#interview"]]],
  stories: ["Your interview answers needed more specifics", "Interviewers score answers on clear examples with results. Use the STAR format (situation, task, action, result) and keep each answer to about two minutes.", [["Practice with STAR", "#interview"]]],
  research: ["Not enough company research or questions", "Ask two or three thoughtful questions about the team and its goals. Not having any questions is one of the most common reasons interviewers mark a candidate down.", [["Prepare for interviews", "#interview"]]],
  closeCall: ["It came down to small differences", "At the final round most candidates can do the job. The pick often comes down to slightly more direct experience, an internal candidate or a stronger referral. Being a finalist puts you in a good spot for the next opening.", [["Write a gracious reply", "#follow-up:reject"]]]
};
let RJ = store.get("rp-reject", null) || { text: "", stage: "", wait: "", company: "", role: "", them: "", me: "" };
const rjSave = () => store.set("rp-reject", RJ);
const RJ_EX = {
  auto: "Dear Jordan,\n\nThank you for your interest in the Marketing Intern position at Northwind Outdoor Co. We received a high volume of applications for this role. After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.\n\nWe will keep your resume on file and encourage you to apply for future openings.\n\nBest,\nThe Northwind Recruiting Team\n\nThis mailbox is not monitored. Please do not reply to this email.",
  final: "Hi Jordan,\n\nThank you so much for taking the time to interview with our team last week. I really enjoyed our conversations, and everyone appreciated your ideas about the loyalty program.\n\nThis was a very difficult decision, but we've decided to move forward with a candidate who has more direct experience in email marketing. I'd love to stay in touch, and I hope you'll consider applying for future roles with us.\n\nWarmly,\nPriya Patel\nRecruiter, Northwind Outdoor Co."
};
function rjDetect(t) {
  const hits = RJ_SIGNALS.filter(s => s.re.test(t)).map(s => ({ ...s, q: (t.match(s.re) || [""])[0] }));
  const ids = new Set(hits.map(h => h.id));
  const stage = ids.has("close") ? "final" : ids.has("met") ? (/phone (screen|call|interview)|initial (call|conversation)|recruiter (call|screen)/i.test(t) ? "screen" : "interview") : "pre";
  const role = (t.match(/\b(?:for|in) the ([A-Z][\w&/,.\- ]{2,60}?) (?:position|role|internship|opening|job)\b/) || [])[1] || "";
  const co = (t.match(/\b(?:at|with|join) ([A-Z][\w&.'\-]*(?:\s+[A-Z][\w&.'\-]*){0,3})(?=[.,!\s])/) || [])[1] || "";
  const sign = t.trim().split("\n").map(s => s.trim()).filter(Boolean);
  const si = sign.findIndex(l => /^(best|warmly|thanks|thank you|sincerely|regards|kind regards|best regards|cheers|all the best)[,!.]?$/i.test(l));
  const sender = si >= 0 && sign[si + 1] && !/team|recruiting|talent|hr\b|human resources/i.test(sign[si + 1]) && sign[si + 1].split(/\s+/).length <= 4 ? kitFirst(sign[si + 1]) : "";
  const sigCo = si >= 0 ? (sign.slice(si + 1).join("\n").match(/,\s*([A-Z][\w&.'\-]*(?:\s+[A-Z][\w&.'\-]*){0,3})\s*$/m) || [])[1] || "" : "";
  const greet = (t.match(/^\s*(?:dear|hi|hello)\s+([A-Z][\w'-]+)/im) || [])[1] || "";
  return { hits, ids, stage, role, co: /^(the|our|us|this|you)$/i.test(co) || !co ? sigCo : co, sender, greet };
}
function rjChips(el, opts, cur, auto, key) {
  el.innerHTML = opts.map(([k, l]) => `<button type="button" data-${key}="${k}" aria-pressed="${k === (cur || auto)}">${esc(l)}${!cur && k === auto ? " (detected)" : ""}</button>`).join("");
}
function rjRun() {
  const t = RJ.text, out = $("#rjOut");
  const D = rjDetect(t);
  const stage = RJ.stage || D.stage, wait = RJ.wait || (D.ids.has("met") ? "mid" : "");
  rjChips($("#rjStage"), RJ_STAGES, RJ.stage, t.trim() ? D.stage : "", "rjs");
  rjChips($("#rjWait"), RJ_WAITS, RJ.wait, "", "rjw");
  $("#rjStageHint").textContent = !RJ.stage && t.trim() ? "We guessed from the email. Tap to change it." : "";
  [["rjCompany", "company", D.co], ["rjRole", "role", D.role], ["rjThem", "them", D.sender], ["rjMe", "me", D.greet]].forEach(([id, k, guess]) => { const el = $("#" + id); el.placeholder = guess || (k === "me" ? "Your name" : ""); });
  if (!t.trim()) { out.innerHTML = `<div class="rj-sec"><h3>What you'll get</h3><p>A plain-English read of the email, the most likely reasons at your stage, what to change before your next application, and a reply you can send.</p><p class="note">Nothing you paste leaves your browser.</p></div>`; return; }
  // Rank reasons from stage, timing and wording.
  const R = [];
  const add = (k, lvl) => { const ex = R.find(r => r.k === k); if (ex) { if (lvl === "likely") ex.lvl = "likely"; } else R.push({ k, lvl }); };
  if (D.ids.has("filled")) add("filled", "likely");
  if (stage === "pre") {
    if (wait === "fast") { add("ats", "likely"); add("knockout", "likely"); }
    else { add("fit", D.ids.has("fit") ? "likely" : "possible"); add("ats", "possible"); }
    add("volume", D.ids.has("volume") || wait === "slow" ? "likely" : "possible");
    if (D.ids.has("experience")) add("experience", "likely");
  } else if (stage === "screen") {
    add("screenBasics", "likely"); if (D.ids.has("experience")) add("experience", "likely"); add("fit", D.ids.has("fit") ? "likely" : "possible"); add("research", "possible");
  } else if (stage === "interview") {
    add("stories", "likely"); if (D.ids.has("experience")) add("experience", "likely"); add("research", "possible"); add("fit", D.ids.has("fit") ? "likely" : "possible");
  } else {
    add("closeCall", "likely"); if (D.ids.has("experience")) add("experience", "likely"); add("stories", "possible");
  }
  R.sort((a, b) => (a.lvl === "likely" ? 0 : 1) - (b.lvl === "likely" ? 0 : 1));
  const reasons = R.slice(0, 4);
  const go = h => h.startsWith("#follow-up:") ? `<button type="button" class="linkbtn" data-rjfu="${h.split(":")[1]}">` : `<a href="${h}">`;
  const gc = h => h.startsWith("#follow-up:") ? "</button>" : "</a>";
  // Next steps
  const S = [];
  if (D.ids.has("auto")) S.push("Don't reply to this email; nobody reads that inbox. If you want to stay on their radar, connect with a recruiter at the company on LinkedIn instead.");
  else S.push(stage === "pre" ? "A short thank-you reply is optional. Send one if a real person wrote to you." : "Reply within a day or two with the draft below. Keep it short and gracious.");
  if (stage === "pre") S.push(`Before your next application, build an <a href="#kit">application kit</a> for the posting and add the missing keywords that are true for you.`);
  if (stage === "pre" && wait === "fast") S.push("Re-read the posting's must-haves (graduation date, location, work authorization, required skills) and make sure your resume states them plainly.");
  if (stage !== "pre") S.push(`Write down the questions you were asked while you still remember them, then practice the ones that felt weakest in <a href="#interview">Interview prep</a>.`);
  if (stage === "final" || D.ids.has("future") || D.ids.has("personal")) S.push("Set a reminder to check this company's openings in 2 to 3 months. Mention this process when you apply again.");
  S.push(`Update the job in your <a href="#tracker">Job tracker</a> so your numbers stay accurate. One rejection is normal: most people apply to many roles before getting an offer.`);
  // Reply
  const co = RJ.company.trim() || D.co || "[Company]", role = RJ.role.trim() || D.role || "[job title]", them = RJ.them.trim() || D.sender || "[Name]", me = RJ.me.trim() || D.greet || "[Your name]";
  const ask = stage !== "pre" && !D.ids.has("nofeedback");
  const reply = `Hi ${them},\n\nThank you for letting me know, and for ${stage === "pre" ? "considering my application for" : "the time you and the team spent with me on"} the ${role} role. ${stage === "pre" ? `I'm still very interested in ${co}` : `I really enjoyed learning about ${co}`}, and I'd love to be considered for future openings.\n\n${ask ? "If you have a moment, I'd be grateful for any feedback on how I could be a stronger candidate next time.\n\n" : ""}Thank you again,\n${me}`;
  const inTracker = JOBS.findIndex(j => co !== "[Company]" && kitCo(j.company).toLowerCase() === co.toLowerCase());
  out.innerHTML = `
    <div class="rj-sec"><h3>What the email tells you</h3><div class="rj-read">${D.hits.length ? `<ul>${D.hits.filter(h => h.id !== "met" || !D.ids.has("close")).map(h => `<li><q>${esc(h.q)}</q>: ${esc(h.say)}</li>`).join("")}</ul>` : "It doesn't use any of the common phrases we look for, so the stage and timing you pick matter most."}</div></div>
    <div class="rj-sec"><h3>Most likely reasons</h3><ul class="rj-reasons">${reasons.map(r => { const [t1, p, links] = RJ_REASONS[r.k]; return `<li><span class="chip ${r.lvl === "likely" ? "fail" : "warn"}">${r.lvl}</span><div><b>${esc(t1)}</b><p>${esc(p)}${links.length ? " " + links.map(([l, h]) => `${go(h)}${esc(l)}${gc(h)}`).join(" · ") : ""}</p></div></li>`; }).join("")}</ul>
      <p class="note">Based on the stage, the timing and the wording of the email. Companies rarely say the real reason, so use this as a checklist, not a diagnosis.</p></div>
    <div class="rj-sec"><h3>What to do next</h3><ol class="rj-steps">${S.map(s => `<li>${s}</li>`).join("")}</ol></div>
    <div class="rj-sec"><h3>${D.ids.has("auto") ? "If you can find a real person to send it to" : "Reply you can send"}</h3><label class="field" for="rjReply"><span class="sr-only">Reply draft</span><textarea id="rjReply" style="min-height:220px">${esc(kitDots(reply))}</textarea></label>
      <div class="lp-actions"><button type="button" class="btn primary" id="rjCopy">Copy reply</button>${inTracker >= 0 && JOBS[inTracker].status !== "Rejected" ? `<button type="button" class="btn" id="rjTrack" data-i="${inTracker}">Mark ${esc(kitCo(JOBS[inTracker].company))} as rejected in my tracker</button>` : ""}</div></div>`;
}
let rjDeb;
$("#rjText").addEventListener("input", () => { RJ.text = $("#rjText").value; RJ.stage = ""; rjSave(); clearTimeout(rjDeb); rjDeb = setTimeout(rjRun, 300); });
[["rjCompany", "company"], ["rjRole", "role"], ["rjThem", "them"], ["rjMe", "me"]].forEach(([id, k]) => $("#" + id).addEventListener("input", () => { RJ[k] = $("#" + id).value; rjSave(); clearTimeout(rjDeb); rjDeb = setTimeout(rjRun, 300); }));
$("#rjStage").addEventListener("click", e => { const b = e.target.closest("[data-rjs]"); if (!b) return; RJ.stage = b.dataset.rjs; rjSave(); rjRun(); });
$("#rjWait").addEventListener("click", e => { const b = e.target.closest("[data-rjw]"); if (!b) return; RJ.wait = RJ.wait === b.dataset.rjw ? "" : b.dataset.rjw; rjSave(); rjRun(); });
document.querySelectorAll("[data-rjex]").forEach(b => b.onclick = () => { RJ = { text: RJ_EX[b.dataset.rjex], stage: "", wait: b.dataset.rjex === "auto" ? "mid" : "", company: "", role: "", them: "", me: "" }; rjSave(); rjInit(); });
$("#rjOut").addEventListener("click", e => {
  if (e.target.closest("#rjCopy")) copyText($("#rjReply").value);
  const tb = e.target.closest("#rjTrack");
  if (tb) { const j = JOBS[+tb.dataset.i]; if (j) { j.status = "Rejected"; j.follow = ""; saveJobs(); renderJobs(); toast("Marked as rejected in your Job tracker."); rjRun(); } }
  const fu = e.target.closest("[data-rjfu]");
  if (fu) { const D = rjDetect(RJ.text); fuPrefill(fu.dataset.rjfu, { company: RJ.company || D.co, role: RJ.role || D.role, them: RJ.them || D.sender, me: RJ.me || D.greet }); location.hash = "follow-up"; }
});
function rjInit() { ["rjText", "rjCompany", "rjRole", "rjThem", "rjMe"].forEach(id => { const k = { rjText: "text", rjCompany: "company", rjRole: "role", rjThem: "them", rjMe: "me" }[id]; if ($("#" + id).value !== RJ[k]) $("#" + id).value = RJ[k] || ""; }); rjRun(); }
