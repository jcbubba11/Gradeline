/* One Stop job tools: recruiting calendar, job alerts and tracker follow-up reminders.
   Loaded after the main page script and uses its globals: $, esc, store, toast, saveFile, today, addDays,
   JOBS, saveJobs, renderJobs, IX, ixInit, ixRender, ACCT, acctLoad, acctOpen, VIEWS, route.
   Everything is saved under rp-* keys, so it stays in this browser and syncs for signed-in people. */
(() => {
  if (typeof VIEWS === "undefined" || typeof JOBS === "undefined") return;
  const DAY = 864e5;
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const E = v => esc(String(v ?? ""));

  /* ---------- Styles (match the One Stop theme) ---------- */
  const css = document.createElement("style");
  css.textContent = `
.jt-box{padding:16px 18px;display:grid;gap:12px}
.jt-head{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.jt-head h2,.jt-head h3{font-size:1.15rem}
.jt-alerts{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.jt-alert{display:flex;gap:10px;align-items:center;flex-wrap:wrap;border:1px solid var(--line);border-radius:4px;padding:8px 10px;background:var(--bg)}
.jt-alert .nm{font-weight:600;flex:1 1 220px;min-width:0;overflow-wrap:anywhere}
.jt-alert .nm small{display:block;font-weight:400;color:var(--muted);font-size:.8rem}
.jt-new{font-size:.72rem;font-weight:700;color:var(--green);background:var(--green-soft);border-radius:3px;padding:2px 8px;white-space:nowrap}
.jt-new.zero{color:var(--muted);background:var(--soft)}
.jt-sw{display:inline-flex;align-items:center;gap:6px;font-size:.82rem;font-weight:600;cursor:pointer;white-space:nowrap}
.jt-x{border:0;background:none;font-size:1.2rem;line-height:1;color:var(--muted);cursor:pointer;padding:2px 6px;border-radius:4px}
.jt-x:hover{color:var(--red);background:var(--red-soft)}
.jt-due{border-left:3px solid var(--red)}
.jt-due ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.jt-due li{display:flex;gap:8px 12px;align-items:center;flex-wrap:wrap}
.jt-due li .what{flex:1 1 240px;min-width:0}
.jt-due li .what small{color:var(--red);font-weight:600;margin-left:6px}
.jt-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:.82rem;color:var(--muted);align-items:center}
.jt-legend i{display:inline-block;width:14px;height:10px;border-radius:2px;vertical-align:-1px;margin-right:5px}
.jt-filters{display:flex;gap:6px;flex-wrap:wrap}
.jt-filters button[aria-pressed=true]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.jt-soon{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.jt-soon .sheet{padding:12px 14px;display:grid;gap:4px}
.jt-soon b{font-family:var(--f-display);font-weight:500;font-size:1.05rem}
.jt-soon span{font-size:.85rem;color:var(--muted)}
.jt-st{font-size:.7rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:3px;padding:2px 7px;width:fit-content}
.jt-st.open{color:var(--green);background:var(--green-soft)}
.jt-st.soon{color:var(--amber);background:var(--amber-soft)}
.jt-st.later{color:var(--muted);background:var(--soft)}
.jt-st.rolling{color:var(--blue);background:var(--blue-soft)}
.jt-cal{display:grid;gap:12px}
.jt-row{padding:14px 16px;display:grid;gap:10px}
.jt-row-top{display:flex;gap:8px 14px;align-items:baseline;justify-content:space-between;flex-wrap:wrap}
.jt-row-top h3{font-size:1.15rem}
.jt-months{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:3px}
.jt-m{text-align:center;font-size:.7rem;font-weight:600;color:var(--muted);padding:5px 0;border-radius:3px;background:var(--soft)}
.jt-m.o{background:var(--blue-soft);color:var(--blue)}
.jt-m.p{background:var(--blue);color:#fff}
.jt-m.now{outline:2px solid var(--ink);outline-offset:1px}
.jt-firms{display:flex;gap:6px;flex-wrap:wrap}
.jt-firm{font-size:.8rem;border:1px solid var(--line);border-radius:3px;padding:2px 8px;background:var(--paper);color:var(--ink);text-decoration:none;white-space:nowrap}
a.jt-firm:hover{border-color:var(--blue);color:var(--blue)}
.jt-firm em{font-style:normal;color:var(--green);font-weight:700;margin-left:4px}
.jt-row p{font-size:.9rem;color:var(--muted);max-width:80ch}
.jt-row .jt-acts{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.jt-src{font-size:.82rem;color:var(--muted)}
.jt-src a{color:inherit}
@media (max-width:560px){.jt-m{font-size:0;padding:7px 0}.jt-m::first-letter{font-size:.62rem}}
`;
  document.head.appendChild(css);

  /* ---------- Shared helpers ---------- */
  const uid = () => Math.random().toString(36).slice(2, 10);
  const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, "");
  const icsText = s => String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  const fold = line => { const out = []; while (line.length > 74) { out.push(line.slice(0, 74)); line = " " + line.slice(74); } out.push(line); return out.join("\r\n"); };
  // events: [{ date: "YYYY-MM-DD", title, notes, url, yearly }]
  function icsFile(events) {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//One Stop//Job tools//EN", "CALSCALE:GREGORIAN"];
    events.forEach(ev => {
      const start = new Date(ev.date + "T12:00:00Z"), end = new Date(start.getTime() + DAY);
      lines.push("BEGIN:VEVENT", "UID:" + uid() + "-" + ymd(start) + "@onestop", "DTSTAMP:" + stamp,
        "DTSTART;VALUE=DATE:" + ymd(start), "DTEND;VALUE=DATE:" + ymd(end), "SUMMARY:" + icsText(ev.title));
      if (ev.notes) lines.push("DESCRIPTION:" + icsText(ev.notes));
      if (ev.url && /^https:\/\//.test(ev.url)) lines.push("URL:" + ev.url);
      if (ev.yearly) lines.push("RRULE:FREQ=YEARLY");
      lines.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + icsText(ev.title), "TRIGGER:PT9H", "END:VALARM", "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return new Blob([lines.map(fold).join("\r\n") + "\r\n"], { type: "text/calendar" });
  }
  const fmtDate = d => new Date(d + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const daysFrom = d => Math.round((Date.parse(d + "T12:00:00") - Date.parse(today() + "T12:00:00")) / DAY);

  /* ================= 1. Tracker follow-up reminders ================= */
  const CLOSED = ["Offer", "Rejected"];
  const dueJobs = () => JOBS.map((j, i) => [j, i]).filter(([j]) => j.follow && j.follow <= today() && !CLOSED.includes(j.status));
  const tStats = $("#tStats");
  const dueBox = document.createElement("div");
  dueBox.className = "sheet jt-box jt-due"; dueBox.id = "jtDue"; dueBox.hidden = true;
  tStats.parentNode.insertBefore(dueBox, tStats);
  const calBtn = document.createElement("button");
  calBtn.type = "button"; calBtn.className = "btn small"; calBtn.id = "jtIcsAll"; calBtn.textContent = "Add follow-ups to my calendar";
  $("#tCsv").after(calBtn);

  function renderDue() {
    const due = dueJobs();
    dueBox.hidden = !due.length;
    if (!due.length) return;
    dueBox.innerHTML = `<div class="jt-head"><h2>${due.length === 1 ? "1 follow-up is due" : due.length + " follow-ups are due"}</h2><span class="note">A short, polite check-in a week or two after applying keeps you on the recruiter's radar.</span></div>
      <ul>${due.map(([j, i]) => {
        const d = -daysFrom(j.follow);
        return `<li><span class="what"><b>${E(j.company || "Untitled")}</b>${j.role ? " · " + E(j.role) : ""}<small>${d === 0 ? "due today" : d === 1 ? "1 day overdue" : d + " days overdue"}</small></span>
          <button type="button" class="btn small" data-jt-done="${i}">Done, remind me in a week</button>
          <button type="button" class="btn small" data-jt-clear="${i}">No more reminders</button></li>`;
      }).join("")}</ul>`;
  }
  dueBox.addEventListener("click", e => {
    const d = e.target.dataset.jtDone, c = e.target.dataset.jtClear;
    if (d != null) { JOBS[+d].follow = addDays(today(), 7); toast("Next reminder set for " + fmtDate(JOBS[+d].follow)); }
    else if (c != null) JOBS[+c].follow = "";
    else return;
    saveJobs(); renderJobs();
  });
  calBtn.onclick = () => {
    const ev = JOBS.filter(j => j.follow && j.follow >= today() && !CLOSED.includes(j.status)).map(j => ({
      date: j.follow, title: `Follow up: ${j.company || "application"}${j.role ? " (" + j.role + ")" : ""}`,
      notes: `Status: ${j.status}. ${j.notes || ""}\nFrom your One Stop job tracker.`, url: j.link
    }));
    if (!ev.length) { toast("No upcoming follow-up dates yet. Add one in the Follow up column."); return; }
    saveFile("one-stop-follow-ups.ics", icsFile(ev));
  };
  const renderJobs0 = renderJobs;
  renderJobs = function () { renderJobs0.apply(this, arguments); renderDue(); };
  renderDue();
  // Once a day, mention due follow-ups when the site opens (not on the tracker itself, which already shows them).
  setTimeout(() => {
    const due = dueJobs().length, seen = store.get("rp-due-nudge", "");
    if (!due || seen === today() || location.hash === "#tracker") return;
    store.set("rp-due-nudge", today());
    toast(due === 1 ? "1 job follow-up is due. See Job tracker." : due + " job follow-ups are due. See Job tracker.");
  }, 1500);

  /* ================= 2. Job alerts (saved searches) ================= */
  // Each alert: { id, name, f: {q,type,major,industry,remote}, since, email }
  // "New" = postings first seen after the last check that were also posted recently, so a big batch of
  // older jobs added in one refresh doesn't count as new.
  let ALERTS = store.get("rp-alerts", []) || [];
  const saveAlerts = () => { store.set("rp-alerts", ALERTS); syncEmail(); };
  const MAX_ALERTS = 10;
  function matchF(j, f) {
    if (f.type && (j.type || "Internship") !== f.type) return false;
    if (f.major && !(j.majors || []).includes(f.major)) return false;
    if (f.industry && j.industry !== f.industry) return false;
    if (f.remote && !j.remote) return false;
    const q = (f.q || "").trim().toLowerCase();
    if (!q) return true;
    const hay = `${j.company} ${j.title} ${j.industry} ${j.location} ${j.remote ? "remote" : ""} ${(j.majors || []).join(" ")}`.toLowerCase();
    return q.split(/[\s,]+/).filter(Boolean).every(w => hay.includes(w));
  }
  const isNewSince = (j, since) => { const s = Date.parse(since); return Date.parse(j.first_seen) > s && Date.parse(j.posted) > s - 7 * DAY; };
  const newCount = a => IX.loaded ? IX.all.reduce((n, j) => n + (isNewSince(j, a.since) && matchF(j, a.f) ? 1 : 0), 0) : null;
  const curF = () => ({ q: $("#ixQ").value.trim(), type: $("#ixType").value, major: $("#ixMajor").value, industry: $("#ixIndustry").value, remote: $("#ixRemote").checked });
  const fName = f => [f.q && `"${f.q}"`, f.type === "Entry-level" ? "Entry-level" : f.type === "Internship" ? "Internships" : "", f.major, f.industry, f.remote && "Remote"].filter(Boolean).join(" · ") || "All openings";

  const alertBox = document.createElement("div");
  alertBox.className = "sheet jt-box"; alertBox.id = "jtAlerts";
  $("#ixFilters").after(alertBox);
  const saveBtn = document.createElement("button");
  saveBtn.type = "button"; saveBtn.className = "ix-clear"; saveBtn.id = "jtSaveSearch"; saveBtn.textContent = "Save search as alert";
  $("#ixClear").before(saveBtn);

  let counts = {};
  function recount() { counts = {}; ALERTS.forEach(a => counts[a.id] = newCount(a)); }
  function renderAlerts() {
    const signed = !!(typeof ACCT !== "undefined" && ACCT.user);
    if (!ALERTS.length) {
      alertBox.innerHTML = `<div class="jt-head"><h2>Job alerts</h2><span class="note">Set your filters above, then press <b>Save search as alert</b>. Next time you visit, we'll show how many new jobs match. Signed-in users can also get a daily email.</span></div>`;
      return;
    }
    alertBox.innerHTML = `<div class="jt-head"><h2>Your job alerts</h2><span class="note">${signed ? "Turn on Email for a daily digest when new jobs match." : "Sign in to also get new matches by email once a day."}</span></div>
      <ul class="jt-alerts">${ALERTS.map(a => {
        const n = counts[a.id];
        return `<li class="jt-alert"><span class="nm">${E(a.name)}<small>Checked ${E(new Date(a.since).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))}</small></span>
          <span class="jt-new${n ? "" : " zero"}">${n == null ? "…" : n === 1 ? "1 new" : n.toLocaleString() + " new"}</span>
          <button type="button" class="btn small primary" data-jt-view="${E(a.id)}">Show jobs</button>
          <label class="jt-sw"><input type="checkbox" data-jt-email="${E(a.id)}"${a.email ? " checked" : ""}> Email me</label>
          <button type="button" class="jt-x" data-jt-del="${E(a.id)}" aria-label="Delete alert ${E(a.name)}">×</button></li>`;
      }).join("")}</ul><p class="note" id="jtEmailNote" hidden></p>`;
  }
  saveBtn.onclick = () => {
    const f = curF();
    if (!f.q && !f.type && !f.major && !f.industry && !f.remote) { toast("Pick a major, industry, job type or search words first."); return; }
    if (ALERTS.some(a => JSON.stringify(a.f) === JSON.stringify(f))) { toast("You already have an alert for this search."); return; }
    if (ALERTS.length >= MAX_ALERTS) { toast(`You can keep up to ${MAX_ALERTS} alerts. Delete one to add another.`); return; }
    ALERTS.unshift({ id: uid(), name: fName(f), f, since: new Date().toISOString(), email: false });
    saveAlerts(); recount(); renderAlerts();
    toast("Alert saved. We'll count new matches each time you visit.");
  };
  alertBox.addEventListener("click", e => {
    const v = e.target.dataset.jtView, d = e.target.dataset.jtDel;
    if (d) { ALERTS = ALERTS.filter(a => a.id !== d); saveAlerts(); renderAlerts(); return; }
    if (!v) return;
    const a = ALERTS.find(x => x.id === v); if (!a) return;
    const n = counts[a.id];
    $("#ixQ").value = a.f.q || ""; $("#ixType").value = a.f.type || ""; $("#ixMajor").value = a.f.major || "";
    $("#ixIndustry").value = a.f.industry || ""; $("#ixRemote").checked = !!a.f.remote; $("#ixSaved").checked = false;
    $("#ixAge").value = ""; $("#ixSort").value = "new";
    a.since = new Date().toISOString(); store.set("rp-alerts", ALERTS);
    IX.shown = 25; ixRender(); counts[a.id] = 0; renderAlerts();
    $("#ixSplit").scrollIntoView({ behavior: "smooth", block: "start" });
    if (n) toast(`${n.toLocaleString()} new since your last check, newest first.`);
  });
  alertBox.addEventListener("change", async e => {
    const id = e.target.dataset.jtEmail; if (!id) return;
    const a = ALERTS.find(x => x.id === id); if (!a) return;
    const box = e.target, note = () => $("#jtEmailNote");
    if (!box.checked) { a.email = false; saveAlerts(); return; }
    if (!ACCT.user) { box.checked = false; toast("Create a free account to get alerts by email."); acctOpen("up"); return; }
    try { await ACCT.user.reload(); } catch {}
    if (!ACCT.user.emailVerified) {
      box.checked = false;
      try { await ACCT.user.sendEmailVerification(); } catch {}
      const n = note(); n.hidden = false;
      n.textContent = `First confirm your email: we sent a link to ${ACCT.user.email}. Open it, then come back and turn on Email again.`;
      return;
    }
    a.email = true; saveAlerts();
    toast(`Daily emails will go to ${ACCT.user.email}.`);
  });
  // Email alerts live in Firestore at alerts/{uid}; a GitHub Action reads them after each listings refresh.
  let syncT = null;
  function syncEmail() {
    clearTimeout(syncT);
    syncT = setTimeout(async () => {
      if (typeof ACCT === "undefined" || !ACCT.user || !ACCT.db) return;
      const on = ALERTS.filter(a => a.email).map(a => ({ name: a.name, f: a.f }));
      const ref = ACCT.db.collection("alerts").doc(ACCT.user.uid);
      try {
        if (!on.length) await ref.delete();
        else await ref.set({ email: ACCT.user.email, searches: JSON.stringify(on), updatedAt: new Date().toISOString() });
      } catch {
        const n = $("#jtEmailNote"); if (n) { n.hidden = false; n.textContent = "Couldn't save your email alert settings just now. Your alerts still work on this device; try again in a minute."; }
      }
    }, 800);
  }
  // A signed-out browser can't send emails; if someone signs out, keep the flags for when they sign back in.
  if (typeof ACCT !== "undefined" && typeof acctPaint === "function") {
    const paint0 = acctPaint;
    acctPaint = function (u) { paint0.apply(this, arguments); renderAlerts(); if (u && ALERTS.some(a => a.email)) syncEmail(); };
  }

  /* ================= 3. Recruiting calendar ================= */
  // Typical windows from recent recruiting seasons (see sources on the page). months: [first, last] of the
  // open window and of the busiest stretch, 0 = Jan. lead: years between the window opening and the internship.
  const CAL = [
    { id: "ib", name: "Investment banking", open: [11, 2], peak: [0, 1], lead: 1, field: "Finance",
      firms: [["JPMorgan", /jp ?morgan/i], ["Goldman Sachs", /goldman/i], ["Morgan Stanley", /morgan stanley/i], ["Bank of America", /bank of america/i], ["Citi", /^citi$/i], ["Wells Fargo", /wells fargo/i], ["Evercore", /evercore/i], ["Lazard", /lazard/i]],
      text: "The earliest big window. Summer analyst roles for the summer after junior year open in the winter of sophomore year, about 18 months ahead. Many banks also run sophomore and diversity programs that open in the fall." },
    { id: "am", name: "Asset management", open: [11, 2], peak: [0, 1], lead: 1, field: "Finance",
      firms: [["BlackRock", /blackrock/i], ["Fidelity", /^fidelity investments/i], ["Vanguard", /vanguard/i], ["AllianceBernstein", /alliancebernstein/i]],
      text: "Large firms tend to follow the bank calendar, so watch for postings in December. Smaller firms keep hiring into the spring." },
    { id: "quant", name: "Quant and trading", open: [6, 9], peak: [7, 8], lead: 0, field: "Finance",
      firms: [["Jane Street", /jane street/i], ["Citadel", /citadel/i], ["Hudson River Trading", /hudson river/i], ["Two Sigma", /two sigma/i]],
      text: "Opens in summer for the next summer and fills fast. Applying in the first few weeks matters more here than almost anywhere." },
    { id: "big4", name: "Big 4 accounting", open: [6, 9], peak: [7, 8], lead: 0, field: "Accounting",
      firms: [["Deloitte", /deloitte/i], ["PwC", /pwc|pricewaterhouse/i], ["EY", /^ey\b|ernst/i], ["KPMG", /kpmg/i]],
      text: "Junior-year audit and tax internships open in July and August, with interviews in September and offers by October. Sophomore leadership programs take applications from late summer into winter." },
    { id: "consult", name: "Consulting", open: [2, 7], peak: [5, 7], lead: 1, field: "Consulting",
      firms: [["McKinsey", /mckinsey/i], ["BCG", /boston consulting|^bcg/i], ["Bain", /^bain/i], ["Accenture", /accenture/i]],
      text: "Firms take applications from spring through August for the following summer. Deadlines are often in June to August, so plan your resume and networking for the spring." },
    { id: "tech", name: "Big tech and software", open: [6, 9], peak: [8, 9], lead: 0, field: "Tech",
      firms: [["Google", /^google/i], ["Microsoft", /^microsoft/i], ["Meta", /^meta$|meta platforms/i], ["Amazon", /^amazon/i], ["Apple", /^apple(?! bank)/i], ["NVIDIA", /nvidia/i]],
      text: "Some of the largest companies post in July to September for the next summer. Most roles are filled by the new year, though smaller tech companies keep posting into the spring." },
    { id: "cpg", name: "Consumer goods and marketing", open: [7, 4], peak: [8, 9], lead: 0, field: "Marketing",
      firms: [["Procter & Gamble", /procter/i], ["Kraft Heinz", /kraft heinz/i], ["Unilever", /unilever/i], ["PepsiCo", /pepsico/i], ["General Mills", /general mills/i]],
      text: "Big consumer brands recruit in the fall for brand and sales internships. Marketing roles at smaller companies and agencies post mostly from January to May." },
    { id: "eng", name: "Engineering, aerospace and defense", open: [7, 2], peak: [8, 10], lead: 0, field: "Engineering",
      firms: [["Lockheed Martin", /lockheed/i], ["Boeing", /boeing/i], ["Northrop Grumman", /northrop/i], ["RTX", /^rtx/i], ["GE Aerospace", /ge aerospace/i], ["General Motors", /general motors/i]],
      text: "Fall career fairs drive most hiring, with postings open into the spring. Jobs that need a security clearance often hire early, so apply in the fall." },
    { id: "ops", name: "Retail, supply chain and operations", open: [7, 10], peak: [8, 9], lead: 0, field: "Business",
      firms: [["Target", /^target$/i], ["Walmart", /^walmart/i], ["Amazon Operations", /^amazon/i]],
      text: "Large companies post in August and September and make offers in October and November. A second, smaller wave of postings comes in February and March." },
    { id: "startup", name: "Startups and smaller companies", open: [11, 3], peak: [0, 2], lead: 0, field: "Business",
      firms: [],
      text: "Startups usually hire closer to the start date, from winter into spring. It's a good second round if fall recruiting didn't work out." },
    { id: "wealth", name: "Wealth management and financial advising", rolling: true, field: "Finance",
      firms: [["Northwestern Mutual", /northwestern mutual/i], ["Edward Jones", /edward jones/i], ["Ameriprise", /ameriprise/i], ["Moneta", /moneta/i]],
      text: "Hires all year. Financial representative internships open by local office, so check every few weeks and contact the office near your school." },
    { id: "gov", name: "Federal government", rolling: true, field: "Government",
      firms: [["USAJOBS Pathways", /^$/], ["NASA", /nasa/i], ["CIA", /central intelligence/i]],
      text: "Postings appear all year on USAJOBS, often with short deadlines. Jobs that need a security clearance can take months, so apply early in the school year." }
  ];
  const inRange = (m, [a, b]) => a <= b ? m >= a && m <= b : m >= a || m <= b;
  // Status as of now, plus the next window's start and the summer it hires for.
  function calStatus(g, now = new Date()) {
    if (g.rolling) return { k: "rolling", label: "Hiring all year" };
    const m = now.getMonth(), y = now.getFullYear();
    const startYear = (mm, yy) => { const a = g.open[0]; return a <= mm ? yy : yy - 1; }; // year the current/last window started
    if (inRange(m, g.open)) {
      const sy = g.open[0] <= g.open[1] ? y : startYear(m, y);
      const summer = sy + (g.open[0] >= 6 ? 1 : 0) + g.lead;
      return { k: "open", label: inRange(m, g.peak) ? "Open now, busiest month" : "Open now", summer, next: null };
    }
    let ny = y, nm = g.open[0]; if (nm < m) ny++;
    const months = (ny - y) * 12 + nm - m;
    const summer = ny + (nm >= 6 ? 1 : 0) + g.lead;
    return { k: months <= 2 ? "soon" : "later", label: months <= 1 ? "Opens next month" : `Opens in ${MON[nm]}`, months, start: `${ny}-${String(nm + 1).padStart(2, "0")}-01`, summer };
  }
  function firmCount(rx) {
    if (!IX.loaded) return 0;
    let n = 0; for (const j of IX.all) if ((j.type || "Internship") === "Internship" && rx.test(j.company)) n++;
    return n;
  }

  // The view: add it to the router without touching the main script's list.
  const nav = document.querySelector('.more-menu a[href="#tracker"]');
  if (nav && !document.querySelector('.more-menu a[href="#calendar"]')) {
    const a = document.createElement("a"); a.href = "#calendar"; a.textContent = "Recruiting calendar"; nav.after(a);
  }
  if (!VIEWS.includes("calendar")) VIEWS.push("calendar");
  let calField = "";
  function renderCal() {
    const root = $("#jtCal"); if (!root) return;
    const now = new Date(), m = now.getMonth();
    const fields = [...new Set(CAL.map(g => g.field))];
    const rows = CAL.filter(g => !calField || g.field === calField).map(g => ({ g, s: calStatus(g, now) }));
    const order = { open: 0, soon: 1, rolling: 3, later: 2 };
    rows.sort((a, b) => order[a.s.k] - order[b.s.k] || (a.s.months || 0) - (b.s.months || 0));
    const soon = rows.filter(r => r.s.k === "open" || r.s.k === "soon");
    root.innerHTML = `
      ${soon.length ? `<div class="jt-head"><h2>Open now or opening soon</h2></div><div class="jt-soon">${soon.map(({ g, s }) => `<a class="sheet" href="#cal-${g.id}" style="text-decoration:none;color:inherit"><span class="jt-st ${s.k}">${E(s.label)}</span><b>${E(g.name)}</b><span>${s.summer ? "For summer " + s.summer + " internships" : ""}</span></a>`).join("")}</div>` : ""}
      <div class="jt-head"><h2>Every industry, month by month</h2>
        <div class="jt-filters" role="group" aria-label="Filter by field"><button type="button" class="btn small" data-jt-field="" aria-pressed="${!calField}">All</button>${fields.map(f => `<button type="button" class="btn small" data-jt-field="${E(f)}" aria-pressed="${calField === f}">${E(f)}</button>`).join("")}</div></div>
      <div class="jt-legend"><span><i style="background:var(--blue)"></i>Busiest months</span><span><i style="background:var(--blue-soft)"></i>Usually open</span><span><i style="background:var(--soft);outline:2px solid var(--ink)"></i>This month</span></div>
      <div class="jt-cal">${rows.map(({ g, s }) => {
        const cells = Array.from({ length: 12 }, (_, k) => {
          const mm = (m + k) % 12, c = g.rolling ? "o" : inRange(mm, g.peak) ? "p" : inRange(mm, g.open) ? "o" : "";
          return `<span class="jt-m ${c}${k === 0 ? " now" : ""}" title="${MON[mm]}${c === "p" ? ": busiest" : c === "o" ? ": usually open" : ""}">${MON[mm]}</span>`;
        }).join("");
        const firms = g.firms.map(([name, rx]) => {
          const n = firmCount(rx);
          return n ? `<a class="jt-firm" href="#internships" data-jt-firm="${E(name === "Amazon Operations" ? "Amazon" : name)}" title="See ${n} open ${E(name)} internships">${E(name)}<em>${n} open</em></a>` : `<span class="jt-firm">${E(name)}</span>`;
        }).join("");
        return `<article class="sheet jt-row" id="cal-${g.id}"><div class="jt-row-top"><h3>${E(g.name)}</h3><span class="jt-st ${s.k}">${E(s.label)}${s.summer ? " · summer " + s.summer : ""}</span></div>
          <div class="jt-months" aria-label="${E(g.rolling ? "Open all year" : `Usually open ${MON[g.open[0]]} to ${MON[g.open[1]]}, busiest ${MON[g.peak[0]]} to ${MON[g.peak[1]]}`)}">${cells}</div>
          ${firms ? `<div class="jt-firms">${firms}</div>` : ""}
          <p>${E(g.text)}</p>
          ${s.start ? `<div class="jt-acts"><button type="button" class="btn small" data-jt-remind="${g.id}">Remind me in ${MON[+s.start.slice(5, 7) - 1]}</button><span class="note">Adds a yearly reminder to your calendar.</span></div>` : ""}
        </article>`;
      }).join("")}</div>
      <p class="jt-src">Windows are typical patterns from recent seasons, not promises. Firms shift dates every year and some open roles early, so check each firm's careers page and set a reminder a few weeks before. Counts show internships open on One Stop right now. Sources: <a href="https://simplify.jobs/blog/summer-2027-internship-timeline" target="_blank" rel="noopener">Simplify internship timeline</a>, <a href="https://miamioh.edu/fsb/student-resources/career-development/recruitment-timelines.html" target="_blank" rel="noopener">Miami University Farmer School recruiting timelines</a>, <a href="https://legacy.vault.com/blogs/in-the-black-vaults-finance-careers-blog/investment-banking-internships-for-summer-2027-are-open-how-when-and-where-to-apply" target="_blank" rel="noopener">Vault on banking internships</a>.</p>`;
  }
  function calView() {
    if (location.hash !== "#calendar") return;
    renderCal();
    if (!IX.loaded) ixInit(); // live counts fill in once the listings load
  }
  const calRoot = $("#jtCal");
  if (calRoot) {
    calRoot.addEventListener("click", e => {
      const f = e.target.closest("[data-jt-field]");
      if (f) { calField = f.dataset.jtField; renderCal(); return; }
      const r = e.target.closest("[data-jt-remind]");
      if (r) {
        const g = CAL.find(x => x.id === r.dataset.jtRemind), s = calStatus(g);
        saveFile(`recruiting-${g.id}.ics`, icsFile([{ date: s.start, title: `${g.name} internship applications usually open`, notes: `${g.text}\nCheck One Stop's Find jobs and recruiting calendar.`, yearly: true }]));
        return;
      }
      const firm = e.target.closest("[data-jt-firm]");
      if (firm) {
        e.preventDefault();
        ["ixType", "ixMajor", "ixIndustry", "ixAge"].forEach(id => $("#" + id).value = "");
        $("#ixRemote").checked = $("#ixSaved").checked = false;
        $("#ixType").value = "Internship"; $("#ixQ").value = firm.dataset.jtFirm;
        location.hash = "#internships"; IX.shown = 25; if (IX.loaded) ixRender();
        return;
      }
      const jump = e.target.closest('a[href^="#cal-"]');
      if (jump) { e.preventDefault(); const t = document.getElementById(jump.getAttribute("href").slice(1)); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
    window.addEventListener("hashchange", calView);
    if (location.hash === "#calendar") route();
    calView();
  }

  /* ---------- Hook listings loads/refreshes ---------- */
  const ixRender0 = ixRender;
  let lastLoaded = false;
  ixRender = function () {
    ixRender0.apply(this, arguments);
    if (IX.loaded && !lastLoaded) { lastLoaded = true; recount(); renderAlerts(); if (location.hash === "#calendar") renderCal(); }
  };
  renderAlerts();
})();
