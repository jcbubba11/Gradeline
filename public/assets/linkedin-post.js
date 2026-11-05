/* One Stop: LinkedIn post helper.
   Loaded on demand the first time its page opens (see LAZY in assets/app.js).
   Uses the main script's globals ($, esc, store, toast, copyText, VERBS, LI). */
/* ================= LinkedIn post helper ================= */
// Builds a draft from short answers. Each field is [key, label, hint, short name for a placeholder, example].
// Keys a/o are the "headline facts" used in the opening line; b is required; c (story), d (thanks), e (ask) are optional.
const lpA = s => (/^[aeiou]/i.test(s) ? "an " : "a ") + s;
// "Looking for a job": put the chosen job type in front of what they typed ("a nursing job" -> "a full-time nursing job").
function lpJob(g) {
  const a = g("a"), t = g("t", true).toLowerCase();
  if (!t || a.toLowerCase().includes(t) || /^\[/.test(a)) return t && /^\[/.test(a) ? `${t} ${a}` : a;
  if (t === "internship" && !/intern/i.test(a)) return lpA(a.replace(/^(an?|the)\s+/i, "").replace(/\s+(roles?|jobs?|positions?|work|opportunities)$/i, "") + " internship");
  const m = a.match(/^(an?|the)\s+(.*)$/i);
  return m ? (/^the$/i.test(m[1]) ? `the ${t} ${m[2]}` : lpA(`${t} ${m[2]}`)) : `${t} ${a}`;
}
const LP_TYPES = {
  job: { label: "New job", emoji: "💼", tags: ["NewJob", "Careers"],
    fields: [["a", "Your new title", "", "your title", "Marketing Coordinator"], ["o", "Company", "", "company", "Northwind Foods"],
      ["b", "What you'll work on", "A sentence or two, in your own words", "what you'll work on", "I'll be running email and social campaigns for 40 grocery stores across Ohio."],
      ["c", "What got you here", "A real moment or lesson. Used for the Story opening.", "", "Two years on a retail sales floor taught me more about customers than any class did."],
      ["d", "Who helped you", "Names, so you can tag them", "", "Priya Patel and my teammates at Target"],
      ["e", "A question or ask for readers", "", "", "If you work in retail marketing, what do you wish you'd known in your first month?"]],
    news: (g, w) => w ? `I'm happy to share that I've started a new position as ${g("a")} at ${g("o")}!` : `I've started a new position as ${g("a")} at ${g("o")}.`,
    direct: g => `New job: ${g("a")} at ${g("o")}.`,
    bridge: g => `Now I get to bring that to my new role as ${g("a")} at ${g("o")}.`,
    thanks: "for helping me get here" },
  internStart: { label: "Starting an internship", emoji: "🌱", tags: ["Internship", "Careers"],
    fields: [["a", "Your internship title", "", "your title", "Software Engineering Intern"], ["o", "Company", "", "company", "Acme Health"],
      ["b", "What you'll work on", "", "what you'll work on", "I'll be on the patient portal team, working on the appointment booking flow."],
      ["c", "Why it matters to you", "Used for the Story opening", "", "The first time I booked a doctor's appointment online, it took me 25 minutes and three phone calls."],
      ["d", "Who helped you", "Recruiters, professors, mentors", "", "Professor Kim and the Career Services team"],
      ["e", "A question or ask for readers", "", "", "Past interns: what's one thing you'd tell yourself on day one?"]],
    news: (g, w) => w ? `Big news: I'm starting an internship at ${g("o")} as ${lpA(g("a"))}!` : `I'm starting an internship at ${g("o")} as ${lpA(g("a"))}.`,
    direct: g => `Internship: ${g("a")}, ${g("o")}.`,
    bridge: g => `That's part of why I'm joining ${g("o")} as ${lpA(g("a"))}.`,
    thanks: "for helping me land it" },
  internEnd: { label: "Finished an internship", emoji: "📌", tags: ["Internship", "LessonsLearned"],
    fields: [["a", "Your internship title", "", "your title", "Marketing Intern"], ["o", "Company", "", "company", "City of Columbus"],
      ["b", "What you did", "Include a number if you can", "what you did", "I ran the city's summer events Instagram and grew it from 2,100 to 3,400 followers in 10 weeks."],
      ["c", "Your biggest takeaway", "Used for the Story opening", "", "The posts that did best weren't the polished ones. They were the ones that showed real people at real events."],
      ["d", "Who helped you", "Your manager, mentor or team", "", "Dana Ortiz and the Parks & Rec communications team"],
      ["e", "What's next or a question", "", "", "I'm looking for full-time marketing roles starting in May. If your team is hiring, I'd love to talk."]],
    news: (g, w) => w ? `That's a wrap on my internship as ${lpA(g("a"))} at ${g("o")}!` : `I just finished my internship as ${lpA(g("a"))} at ${g("o")}.`,
    direct: g => `What I learned as ${lpA(g("a"))} at ${g("o")}:`,
    bridge: g => `That was my biggest takeaway from my internship at ${g("o")}.`,
    thanks: "for the mentoring and the trust" },
  grad: { label: "Graduation", emoji: "🎓", tags: ["Graduation", "NewGrad"],
    fields: [["a", "Your degree", "", "your degree", "a B.S. in Nursing"], ["o", "School", "", "school", "Ohio State University"],
      ["b", "What you did along the way", "Projects, jobs, clubs, a number that shows the work", "what you did", "Along the way I finished 800 clinical hours across three hospitals and worked nights as a patient care tech."],
      ["c", "A moment you'll remember", "Used for the Story opening", "", "Four years ago I almost switched majors after failing my first chemistry exam."],
      ["d", "Who you want to thank", "Family, professors, friends", "", "my parents, Dr. Alvarez and my study group"],
      ["e", "What's next or a question", "", "", "Next up: studying for the NCLEX and starting on a med-surg unit this summer."]],
    news: (g, w) => w ? `I did it! I graduated from ${g("o")} with ${g("a")}.` : `I graduated from ${g("o")} with ${g("a")}.`,
    direct: g => `Officially a ${g("o")} graduate.`,
    bridge: g => `This month I graduated from ${g("o")} with ${g("a")}.`,
    thanks: "for getting me here" },
  project: { label: "Project I built", emoji: "🚀", tags: ["Projects", "Portfolio"],
    fields: [["a", "What you built", "A short description, with the name if it has one", "what you built", "a budgeting app for college students called Pocket"],
      ["b", "What it does and how", "Tools you used and a result", "what it does", "It splits rent and groceries between roommates. I built it with React and Firebase, and 60 students used it in the first month."],
      ["c", "Why you built it", "Used for the Story opening", "", "My roommates and I kept losing track of who owed what."],
      ["d", "Who helped", "Collaborators or testers", "", "Sam and Leah, who tested every version"],
      ["e", "A question or ask", "Feedback, testers, ideas", "", "What feature should I build next?"]],
    news: (g, w) => w ? `I built something I'm proud of: ${g("a")}.` : `I built ${g("a")}.`,
    direct: g => `New project: ${g("a")}.`,
    bridge: g => `So I built ${g("a")}.`,
    thanks: "for the feedback along the way" },
  cert: { label: "Certification or award", emoji: "📜", tags: ["Certification", "Learning"],
    fields: [["a", "What you earned", "", "what you earned", "the Google Data Analytics Certificate"],
      ["b", "What you learned or did to earn it", "A skill, a project, how long it took", "what you learned", "Over 4 months I learned SQL, spreadsheets and Tableau, and finished a case study on bike-share data."],
      ["c", "Why you went for it", "Used for the Story opening", "", "At my last job I kept wishing I could answer my own questions with data instead of waiting on a report."],
      ["d", "Who helped", "", "", ""],
      ["e", "What's next or a question", "", "", "Next I'm building a portfolio project with public transit data. Any datasets you'd recommend?"]],
    news: (g, w) => w ? `Happy to share that I earned ${g("a")}!` : `I earned ${g("a")}.`,
    direct: g => `Done: ${g("a")}.`,
    bridge: g => `So I went for ${g("a")}, and I just earned it.`,
    thanks: "for the encouragement" },
  event: { label: "Event or career fair", emoji: "🤝", tags: ["Networking", "CareerFair"],
    fields: [["a", "The event", "", "the event", "the Ohio State Fall Career Fair"],
      ["b", "What you did or learned there", "One or two specific takeaways", "what you learned", "I talked with recruiters from 12 companies. The best conversations started with a question about their team, not my resume."],
      ["c", "One moment that stuck with you", "Used for the Story opening", "", "One recruiter told me she remembers the students who ask about her job, not the ones who recite their GPA."],
      ["d", "Who you met or want to thank", "", "", "everyone at Huntington and Nationwide who took the time to talk"],
      ["e", "A question for readers", "", "", "What's the best question you've been asked at a career fair?"]],
    news: (g, w) => w ? `I had a great day at ${g("a")}!` : `I spent the day at ${g("a")}.`,
    direct: g => `A few notes from ${g("a")}:`,
    bridge: g => `That stuck with me from ${g("a")}.`,
    thanks: "for the conversations" },
  search: { label: "Looking for a job", emoji: "🔎", tags: ["OpenToWork", "JobSearch"],
    fields: [["a", "What kind of job do you want?", "Type any job title or field, the way you'd say it", "the job you want", "entry-level marketing or communications roles"],
      ["t", "Job type", "", "", "Full-time", ["Full-time", "Part-time", "Internship", "Contract", "Freelance"]],
      ["o", "Where", "City, region or remote", "", "in Columbus or remote"],
      ["b", "What you bring", "Skills and one result", "what you bring", "I've run social accounts with 12,000 followers, written weekly email newsletters, and I'm fluent in Canva, Google Analytics and Mailchimp."],
      ["c", "A bit of your story", "Used for the Story opening", "", "I spent three years in retail, and the part I loved most was getting people excited about a new product."],
      ["d", "Who to thank", "People who referred you, gave advice or reviewed your resume", "", "Ms. Rivera in Career Services"],
      ["e", "Your ask", "Be specific: an intro, a share, a referral", "", "If you know a team that's hiring, I'd be grateful for an introduction or a share."]],
    news: (g, w) => `I'm looking for ${lpJob(g)}${g("o", true) ? " " + g("o") : ""}${w ? ", and I'd love your help" : ""}.`,
    direct: g => `I'm job hunting, and I could use your help.`,
    bridge: g => `Now I'm looking for ${lpJob(g)}${g("o", true) ? " " + g("o") : ""}.`,
    thanks: "for the help so far" },
  lesson: { label: "A lesson or tip", emoji: "💡", tags: ["CareerAdvice", "LessonsLearned"],
    fields: [["a", "The lesson, in one line", "", "your lesson", "Most of my interviews came from one message, not from applying"],
      ["b", "What happened", "The details that back it up, with a number", "what happened", "I sent 80 applications this fall and got 2 replies. Then I messaged 15 alumni at companies I liked, and 4 of those chats turned into interviews."],
      ["c", "The moment it clicked", "Used for the Story opening", "", "For two months I treated the job search like a numbers game."],
      ["d", "Who helped", "", "", "Marcus, who told me to stop applying and start talking"],
      ["e", "A question for readers", "", "", "What got you your first interview?"]],
    news: (g, w) => `${lpFin(g("a"))}`,
    direct: g => `One thing I wish I'd known sooner: ${g("a").replace(/^./, c => c.toLowerCase()).replace(/[.!]$/, "")}.`,
    bridge: g => lpFin(g("a")),
    thanks: "for the push" }
};
const LP_FIELD_TAGS = { nursing: ["Nursing", "Healthcare"], tech: ["SoftwareEngineering", "Tech"], teaching: ["Education", "Teaching"], accounting: ["Accounting", "Finance"], creative: ["Marketing", "Design"], trades: ["SkilledTrades", "Apprenticeship"] };
const LP_CLICHES = [[/\b(thrilled|excited|delighted|pleased) to announce\b/i, "\"thrilled to announce\""], [/\bhumbled\b/i, "\"humbled\""], [/\bbeyond grateful\b/i, "\"beyond grateful\""], [/\bgame[- ]?changer\b/i, "\"game-changer\""], [/\bsynerg/i, "\"synergy\""], [/\bleverag(e|ing)\b/i, "\"leverage\""], [/\bpassionate about\b/i, "\"passionate about\""], [/\bthought leader/i, "\"thought leader\""], [/\bagree\?\s*$/im, "\"Agree?\""]];
const lpFin = s => { s = (s || "").trim().replace(/\s+/g, " "); if (!s) return s; s = s[0].toUpperCase() + s.slice(1); return /[.!?:…"')]$/.test(s) ? s : s + "."; };
const lpAsk = s => { s = (s || "").trim(); if (!s || /[.!?]$/.test(s)) return lpFin(s); return lpFin(s + (/^(what|how|who|which|why|where|when|anyone|any|has|have|do|does|did|is|are|would|could|should|can)\b/i.test(s) ? "?" : ".")); };
const lpTag = s => "#" + s.replace(/^#/, "").split(/[^A-Za-z0-9]+/).filter(Boolean).map(w => /[A-Z]/.test(w.slice(1)) ? w[0].toUpperCase() + w.slice(1) : w[0].toUpperCase() + w.slice(1).toLowerCase()).join("");
function lpExampleVals() { const v = {}; Object.entries(LP_TYPES).forEach(([k, T]) => { v[k] = {}; T.fields.forEach(f => v[k][f[0]] = f[4]); }); return v; }
let LP = store.get("rp-lipost", null) || { type: "job", tone: "pro", hook: "news", emoji: false, vals: lpExampleVals(), picked: null, topics: "", text: "", edited: false, example: true };
const lpSave = () => store.set("rp-lipost", LP);
const lpVals = () => (LP.vals[LP.type] ||= {});
function lpSuggestTags() {
  const T = LP_TYPES[LP.type], f = store.get("rp-field", "general");
  const own = (LP.topics || "").split(/[,\n]/).map(s => s.trim()).filter(Boolean).map(lpTag);
  return [...new Set([...own, ...T.tags.map(lpTag), ...(LP_FIELD_TAGS[f] || []).map(lpTag), "#Careers", "#CareerGrowth", "#Hiring"].filter(t => t.length > 1))].slice(0, 12);
}
function lpPicked() {
  const sug = lpSuggestTags();
  if (!LP.picked) LP.picked = [...LP_TYPES[LP.type].tags.map(lpTag), sug.find(t => !LP_TYPES[LP.type].tags.map(lpTag).includes(t))].filter(Boolean);
  return LP.picked.filter(t => sug.includes(t));
}
function lpCompose() {
  const T = LP_TYPES[LP.type], v = lpVals(), warm = LP.tone === "warm", short = LP.tone === "short";
  const g = (k, raw) => { const s = (v[k] || "").trim().replace(/[.]$/, ""); if (raw) return s; const f = T.fields.find(x => x[0] === k); return s || (f && f[3] ? `[${f[3]}]` : ""); };
  const story = LP.hook === "story" && (v.c || "").trim();
  let hook = story ? lpFin(v.c) : LP.hook === "direct" ? T.direct(g) : T.news(g, warm);
  if (LP.emoji) hook = T.emoji + " " + hook;
  const P = [hook];
  if (story) P.push(T.bridge(g));
  P.push((v.b || "").trim() ? lpFin(v.b) : `[${T.fields.find(x => x[0] === "b")[3]}]`);
  if (!story && !short && (v.c || "").trim()) P.push(lpFin(v.c));
  const d = (v.d || "").trim();
  if (d) P.push(short ? `Thank you, ${d}.` : `Thank you to ${d}${/\b(who|for)\b/i.test(d) ? "" : " " + (T.thanks || "for the support")}.${warm ? " I couldn't have done it without you." : ""}`);
  if ((v.e || "").trim()) P.push(lpAsk(v.e));
  const tags = lpPicked();
  if (tags.length) P.push(tags.join(" "));
  return P.filter(Boolean).join("\n\n");
}
// Recommendations shown with each post type: people to thank (tap to add), how to write it, and what else to include.
const LP_GUIDE = {
  job: { thank: ["my manager", "the recruiter who hired me", "my references", "my professors", "Career Services", "my mentors", "my family"],
    tips: ["Put the title and company in the first line. That's what people skim for.", "Say what you'll actually do in one sentence. \"I'll run email campaigns for 40 stores\" says more than \"I'm excited for this opportunity.\"", "Thank people by name, then tag them with @ in LinkedIn. It's kind, and the post shows up for their connections too.", "Tag the company: type @ and pick its page from the list.", "Wait until your offer is signed and you know the company is fine with you sharing. Many people post on their first day."],
    extras: ["A photo from your first day: your desk, badge or the building.", "Update your headline and Experience section first, so people who click your name see the new job.", "One skill you'll use or learn in the role.", "Turn off Open to Work if it's still on."] },
  internStart: { thank: ["the recruiter", "the hiring team", "my professors", "my academic advisor", "Career Services", "the friend who referred me", "my family"],
    tips: ["Name the company, team and role in the first line.", "Say what you'll work on or hope to learn, in one or two sentences.", "Thank whoever helped you get it: the recruiter, a professor who was a reference, Career Services, a friend who referred you.", "Tag the company with @ so its recruiters and employees see the post.", "Not sure you can share project details? Describe the team, not the project."],
    extras: ["When and where: \"this summer in Chicago\".", "Your school and major, so classmates and alumni find you.", "A photo once you start.", "Add the internship to your Experience section."] },
  internEnd: { thank: ["my manager", "my mentor", "my team", "my fellow interns", "the recruiter"],
    tips: ["Open with your biggest result or takeaway, not \"my internship is over.\"", "Give one specific thing you did, with a number if you can.", "Thank your manager and mentor by name and tag them. They're the people most likely to give you a reference or a return offer.", "Keep confidential work vague: describe the kind of work, not internal numbers or unreleased products.", "Say what you're looking for next. Recruiters read these posts."],
    extras: ["A team photo (ask your team first).", "Two or three skills you learned.", "Ask your manager for a LinkedIn recommendation while the work is fresh.", "Update your Experience section with bullets and results."] },
  grad: { thank: ["my family", "my professors", "my academic advisor", "my friends", "my roommates", "my coaches", "my mentors"],
    tips: ["Say your degree and school in the first line.", "Pick one or two highlights instead of listing everything: a project, a job you worked through school, an honor.", "Thank family, professors and friends by name. That's what makes a graduation post personal.", "Say what's next: a job, grad school, or that you're looking. If you're looking, say for what kind of role."],
    extras: ["A cap-and-gown photo.", "Honors such as Dean's List or cum laude.", "Clubs, sports or leadership roles.", "Update your Education section and headline."] },
  project: { thank: ["my teammates", "my professor", "everyone who tested it", "my mentor", "the friends who gave feedback"],
    tips: ["Open with the problem it solves, not the tech stack.", "Say who it's for and one result: users, time saved, a grade, a prize.", "Name the tools in one line. Recruiters search for those skills.", "Put the link in the first comment and write \"link in the comments.\"", "Ask for something specific: feedback, testers or ideas."],
    extras: ["A screenshot or short demo video.", "Tag your teammates.", "Add it to the Projects section of your profile.", "What you'd build or fix next."] },
  cert: { thank: ["my manager", "my instructor", "my study group", "my mentor", "my family"],
    tips: ["Name the exact certificate and who issued it.", "Say why you went for it and one thing you can do now that you couldn't before.", "Mention a project you finished while earning it, if there was one.", "Tag the issuer, such as @Google or @Coursera."],
    extras: ["The certificate or badge image.", "Add it to Licenses & certifications on your profile.", "Add the new skills to your Skills section.", "What you plan to learn next."] },
  event: { thank: ["the organizers", "the speakers", "the recruiters I met", "the classmates who came with me", "Career Services"],
    tips: ["Share one or two specific takeaways, not just \"had a great time.\"", "Tag people you actually talked to, and say what you talked about.", "Post within a day or two, while the people you met still remember you.", "Tag the event or the group that ran it."],
    extras: ["A photo from the event.", "The event's own hashtag.", "Send connection requests with a short note to the people you met.", "What you'll do with what you learned."] },
  search: { thank: ["the people who referred me", "my former manager", "my mentors", "Career Services", "everyone who reviewed my resume"],
    tips: ["Say exactly what you want: the job or field, the job type and the location. Vague posts get vague help.", "Give two or three specifics about what you bring, including one result.", "Make one clear, easy ask: an introduction, a referral or a share.", "If you were laid off, keep it short and positive about your last employer."],
    extras: ["Turn on Open to Work (you can show it to recruiters only).", "A short list of companies you'd love to work for.", "How to reach you: \"message me\" or your email.", "Ask a few friends to share or comment so it travels further."] },
  lesson: { thank: ["the person who taught me this", "my mentor", "my manager", "my classmates"],
    tips: ["Put the lesson in the first line so people know why to keep reading.", "Back it up with what actually happened, including numbers.", "Tell it as your own experience rather than telling others what to do.", "End with a question so readers share theirs."],
    extras: ["Short numbered steps people can try.", "A before-and-after.", "Credit and tag the person who taught you.", "One thing readers can do today."] }
};
function lpRenderGuide() {
  const G = LP_GUIDE[LP.type], T = LP_TYPES[LP.type];
  $("#lpGuide").innerHTML = `<summary>How to write a "${esc(T.label.toLowerCase())}" post</summary><div class="lp-guide-in"><div><b>Tips</b><ul>${G.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div><div><b>Also think about adding</b><ul>${G.extras.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div></div>`;
}
// Tapping a "who to thank" chip adds it to the thanks field: "A", "A and B", "A, B and C".
function lpAddThanks(who) {
  const v = lpVals(), cur = (v.d || "").trim();
  if (cur.toLowerCase().includes(who.toLowerCase())) return;
  const parts = cur ? cur.split(/,\s*|\s+and\s+/).filter(Boolean) : [];
  parts.push(who);
  v.d = parts.length > 1 ? parts.slice(0, -1).join(", ") + " and " + parts[parts.length - 1] : parts[0];
}
function lpRenderForm() {
  $("#lpTypes").innerHTML = Object.entries(LP_TYPES).map(([k, T]) => `<button type="button" data-lptype="${k}" aria-pressed="${k === LP.type}">${esc(T.label)}</button>`).join("");
  const v = lpVals();
  $("#lpFields").innerHTML = LP_TYPES[LP.type].fields.map(([k, label, hint, ph, ex, opts]) => {
    if (opts) return `<div class="field"><span>${esc(label)} <span class="opt">optional</span></span><div class="lp-chips" role="group" aria-label="${esc(label)}">${opts.map(o => `<button type="button" data-lpopt="${k}" data-val="${esc(o)}" aria-pressed="${v[k] === o}">${esc(o)}</button>`).join("")}</div></div>`;
    const long = ["b", "c", "e"].includes(k), opt = !ph;
    const chips = k === "d" ? `<span class="lp-sugg"><span class="hint">Not sure who? Tap to add, then swap in real names so you can tag them:</span><span class="lp-chips">${LP_GUIDE[LP.type].thank.map(w => `<button type="button" data-lpthank="${esc(w)}">+ ${esc(w)}</button>`).join("")}</span></span>` : "";
    const tag = long ? `<textarea id="lpf-${k}" data-lpf="${k}" placeholder="${esc(ex)}">${esc(v[k] || "")}</textarea>` : `<input type="text" id="lpf-${k}" data-lpf="${k}" placeholder="${esc(ex)}" value="${esc(v[k] || "")}">`;
    return `<label class="field" for="lpf-${k}"><span>${esc(label)}${opt ? ' <span class="opt">optional</span>' : ""}</span>${hint ? ` <span class="hint">${esc(hint)}</span>` : ""}${tag}${chips}</label>`;
  }).join("");
  document.querySelectorAll("#lpTone button").forEach(b => b.setAttribute("aria-pressed", b.dataset.tone === LP.tone));
  document.querySelectorAll("#lpHook button").forEach(b => b.setAttribute("aria-pressed", b.dataset.hook === LP.hook));
  $("#lpEmoji").checked = !!LP.emoji; $("#lpTopics").value = LP.topics || "";
  $("#lpSampleTag").hidden = !LP.example;
  lpRenderGuide(); lpRenderTags();
}
function lpRenderTags() {
  const picked = lpPicked();
  $("#lpTags").innerHTML = lpSuggestTags().map(t => `<button type="button" data-lptag="${esc(t)}" aria-pressed="${picked.includes(t)}">${esc(t)}</button>`).join("");
}
function lpUpdate(rebuild) {
  if (rebuild || !LP.edited) { LP.text = lpCompose(); LP.edited = false; $("#lpText").value = LP.text; }
  const st = LP.hook === "story" && !(lpVals().c || "").trim();
  $("#lpHookNote").textContent = st ? `The Story opening uses your answer to "${LP_TYPES[LP.type].fields.find(f => f[0] === "c")[1]}". Fill it in to use it.` : LP.hook === "story" ? "Opens with your story, then the news. Story openings tend to get more people to tap \"...more\"." : LP.hook === "direct" ? "A short, plain first line. Good when the news speaks for itself." : "Leads with the news, the clearest option for announcements.";
  $("#lpRebuild").hidden = $("#lpEditedNote").hidden = !LP.edited;
  lpSave(); lpPreview(); lpCheck();
}
function lpPreview() {
  const t = $("#lpText").value, n = t.length;
  $("#lpCount").textContent = `${n.toLocaleString()} / 3,000 characters`;
  $("#lpCount").style.color = n > 3000 ? "var(--red)" : "";
  const nm = (LI && LI.name) || (B && B.r && B.r.name) || "Your name";
  $("#lpName").textContent = nm; $("#lpAv").textContent = nm.split(/\s+/).map(w => w[0] || "").join("").slice(0, 2).toUpperCase() || "?";
  $("#lpHeadline").textContent = (LI && LI.liHeadline) || "Your headline";
  const fmt = s => hl(s).replace(/(^|\s)(#[A-Za-z0-9_]+)/g, '$1<span class="tag">$2</span>');
  // LinkedIn cuts a post after about three lines (roughly 200 characters on desktop), blank lines included.
  const CUT = 210, lines = t.split("\n");
  let cut = t.length > CUT ? Math.max(t.lastIndexOf(" ", CUT), 1) : t.length;
  if (lines.length > 3) cut = Math.min(cut, lines.slice(0, 3).join("\n").length);
  const box = $("#lpPreview");
  if (!t.trim()) { box.innerHTML = `<span class="note">Your post will appear here.</span>`; return; }
  if (t.slice(cut).trim() && !box.dataset.open) box.innerHTML = fmt(t.slice(0, cut).replace(/\s+$/, "")) + ` <button type="button" class="more-btn" id="lpMore">…more</button>`;
  else box.innerHTML = fmt(t);
}
function lpCheck() {
  const t = $("#lpText").value.trim(), C = [];
  const body = t.replace(/(^|\s)#[A-Za-z0-9_]+/g, " ").trim();
  const first = (t.split("\n").find(l => l.trim()) || "").trim();
  const words = (body.match(/\S+/g) || []).length;
  const tags = (t.match(/(^|\s)#[A-Za-z0-9_]+/g) || []).length;
  const paras = t.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  if (!t) { renderSimpleChecks($("#lpChecks"), [chk("warn", "Start writing", "Answer the questions on the left, or type straight into the draft.")]); return; }
  if (/\[[^\]]+\]/.test(t)) C.push(chk("fail", "Fill in the blanks", "Replace the bracketed parts, like [company], before you post."));
  C.push(t.length > 3000 ? chk("fail", `${t.length.toLocaleString()} characters`, "LinkedIn posts max out at 3,000 characters. Cut it down.") : chk("pass", "Under LinkedIn's 3,000-character limit", ""));
  C.push(first.length <= 150 ? chk("pass", "Short opening line", "Only the first two or three lines show before \"...more\", so your opening line has to carry the post.") : chk("warn", "Shorten your opening line", `It's ${first.length} characters. Keep it under about 150 so the whole line shows before "...more".`));
  C.push(words < 25 ? chk("warn", `${words} words`, "A little thin. Add one specific detail: what you'll do, what you built, or what you learned.") : words > 300 ? chk("warn", `${words} words`, "Long for a feed post. Most people skim; try to keep it under about 300 words.") : chk("pass", `${words} words`, "A comfortable length to read on a phone."));
  const longP = paras.filter(p => p.length > 320 || (p.match(/[.!?](\s|$)/g) || []).length > 3);
  C.push(longP.length ? chk("warn", "Break up long paragraphs", "Keep paragraphs to one to three sentences with a blank line between them. Big blocks are hard to read on a phone.") : chk("pass", "Short paragraphs", "Easy to skim on a phone."));
  C.push(/\d/.test(body) ? chk("pass", "Includes a specific number", "") : chk("warn", "Add a specific detail", "A number, name or result (\"60 students used it\", \"12 companies\") makes a post more believable than adjectives."));
  C.push(tags === 0 ? chk("warn", "Add a few hashtags", "Three to five relevant hashtags at the end help people who follow those topics find you.") : tags > 5 ? chk("warn", `${tags} hashtags`, "Trim to three to five. A long string of hashtags reads as spam.") : chk("pass", `${tags} hashtag${tags > 1 ? "s" : ""}`, ""));
  const lastText = paras.filter(p => !/^#/.test(p)).slice(-1)[0] || "";
  C.push(/\?/.test(lastText) || /(let me know|reach out|message me|introduction|share|refer|hiring|talk)/i.test(lastText) ? chk("pass", "Ends with a question or ask", "Comments help a post reach more people, and a question gives readers something to say.") : chk("warn", "End with a question or ask", "Close with something readers can answer, like \"What do you wish you'd known in your first month?\""));
  if (/https?:\/\/|www\.|\.com\//i.test(body)) C.push(chk("warn", "Move links to the first comment", "Many LinkedIn writers find posts with outside links get shown to fewer people. Post the link as a comment instead and say \"link in the comments\"."));
  const cl = LP_CLICHES.filter(([re]) => re.test(t)).map(x => x[1]);
  if (cl.length) C.push(chk("warn", cl.length > 1 ? "Swap the clichés" : "Swap the cliché", `${cl.join(", ")} ${cl.length > 1 ? "show" : "shows"} up in so many posts that readers skip past them. Say what happened plainly.`));
  if ((lpVals().d || "").trim() && /thank/i.test(t)) C.push(chk("info", "Tag the people you thank", "After pasting into LinkedIn, retype each name starting with @ and pick them from the list so they're notified."));
  renderSimpleChecks($("#lpChecks"), C);
}
function lpInit() { lpRenderForm(); lpUpdate(false); }
$("#lpTypes").addEventListener("click", e => { const k = e.target.closest("[data-lptype]")?.dataset.lptype; if (!k || k === LP.type) return; LP.type = k; LP.picked = null; LP.edited = false; lpRenderForm(); lpUpdate(true); });
$("#lpFields").addEventListener("input", e => { const k = e.target.dataset.lpf; if (!k) return; lpVals()[k] = e.target.value; LP.example = false; $("#lpSampleTag").hidden = true; lpUpdate(false); });
$("#lpFields").addEventListener("click", e => { const th = e.target.closest("[data-lpthank]"); if (th) { e.preventDefault(); lpAddThanks(th.dataset.lpthank); LP.example = false; $("#lpf-d").value = lpVals().d; $("#lpSampleTag").hidden = true; lpUpdate(false); return; } const b = e.target.closest("[data-lpopt]"); if (!b) return; const k = b.dataset.lpopt, v = lpVals(); v[k] = v[k] === b.dataset.val ? "" : b.dataset.val; LP.example = false; lpRenderForm(); lpUpdate(false); });
$("#lpTone").addEventListener("click", e => { const k = e.target.closest("[data-tone]")?.dataset.tone; if (!k) return; LP.tone = k; lpRenderForm(); lpUpdate(false); });
$("#lpHook").addEventListener("click", e => { const k = e.target.closest("[data-hook]")?.dataset.hook; if (!k) return; LP.hook = k; lpRenderForm(); lpUpdate(false); });
$("#lpTags").addEventListener("click", e => { const t = e.target.closest("[data-lptag]")?.dataset.lptag; if (!t) return; const p = lpPicked(); LP.picked = p.includes(t) ? p.filter(x => x !== t) : [...p, t]; lpRenderTags(); lpUpdate(false); });
// Tags typed into "Add your own" are picked automatically; deleting the text drops them.
$("#lpTopics").addEventListener("input", e => { const before = lpSuggestTags(), kept = lpPicked(); LP.topics = e.target.value; const now = lpSuggestTags(); LP.picked = [...new Set([...kept.filter(t => now.includes(t)), ...now.filter(t => !before.includes(t))])]; lpRenderTags(); lpUpdate(false); });
$("#lpEmoji").addEventListener("change", e => { LP.emoji = e.target.checked; lpUpdate(false); });
$("#lpText").addEventListener("input", e => { LP.text = e.target.value; LP.edited = true; delete $("#lpPreview").dataset.open; $("#lpRebuild").hidden = $("#lpEditedNote").hidden = false; lpSave(); lpPreview(); lpCheck(); });
$("#lpPreview").addEventListener("click", e => { if (e.target.id === "lpMore") { $("#lpPreview").dataset.open = "1"; lpPreview(); } });
$("#lpRebuild").onclick = () => { if (confirm("Replace your edited draft with a fresh one from your answers?")) lpUpdate(true); };
$("#lpCopy").onclick = () => copyText($("#lpText").value);
$("#lpOpen").addEventListener("click", () => { copyText($("#lpText").value).then(() => toast("Copied. Paste it into the LinkedIn post box.")); });
$("#lpExample").onclick = () => { LP.vals[LP.type] = lpExampleVals()[LP.type]; LP.example = true; LP.edited = false; lpRenderForm(); lpUpdate(true); };
$("#lpClear").onclick = () => { if (LP.edited && !confirm("Clear your answers and your edited draft?")) return; LP.vals[LP.type] = {}; LP.example = false; LP.edited = false; lpRenderForm(); lpUpdate(true); };
