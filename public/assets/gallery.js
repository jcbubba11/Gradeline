/* One Stop: before and after resume gallery.
   Loaded on demand the first time its page opens (see LAZY in assets/app.js).
   Uses the main script's globals ($, esc, gradeResume, renderResumeDoc, FIELDS, ...). */
/* ================= Before & after gallery =================
   Fictional example resumes (no real users). Scores are not typed in:
   each version is run through gradeResume() with its field and posting. */
const GALLERY = [
{
  id: "nursing", field: "nursing", fieldLabel: "Nursing", name: "Maya Torres", who: "New grad nurse",
  role: "Registered Nurse", company: "Riverside Health",
  job: `Registered Nurse – Medical-Surgical (New Graduate Residency), Riverside Health
We are hiring new graduate Registered Nurses for our 12-month residency on a 32-bed medical-surgical unit. You will provide direct patient care, administer medications, monitor vital signs, perform patient assessments and document in Epic. Requirements: BSN, active RN license or NCLEX scheduled, BLS certification (ACLS preferred). Strong communication with patients, families and the interdisciplinary care team. Experience with patient education, discharge planning, wound care and IV therapy is a plus.`,
  before: `MAYA TORRES
mayat.nurse@email.com

Objective: Caring and compassionate nursing graduate looking for a position where I can make a difference and grow as a nurse.

EXPERIENCE
Patient Care Tech, Mercy General | 2023 – Present
- Responsible for taking care of patients on my floor
- Helped nurses with whatever they needed
- Duties included vitals, charting and bathing patients

Clinicals, various hospitals | 2022 – 2024
I did clinicals at a few hospitals during nursing school and learned a lot about different units and how to work with patients and families. I am a hard worker and a team player.

EDUCATION
Bachelor of Science in Nursing, Lakeview University | 2024

References available upon request`,
  after: `MAYA TORRES, BSN, RN
Dayton, OH · (937) 555-0188 · maya.torres@email.com · linkedin.com/in/mayatorresrn
RN license, Ohio (2024) · BLS · ACLS

SUMMARY
New graduate Registered Nurse with 680 clinical hours, 18 months as a patient care tech on a 30-bed medical-surgical unit and daily charting in Epic. Focused on patient education, safe medication administration and clear handoffs with the care team.

CLINICAL ROTATIONS
Medical-Surgical Capstone, Mercy General Hospital | Jan 2024 – Apr 2024
- Managed care for 4–5 patients per shift under an RN preceptor across 180 capstone hours
- Administered oral, IV and subcutaneous medications with zero medication errors
- Delivered discharge teaching to 25+ patients and families using teach-back

Critical Care, Mercy General Hospital | Sep 2023 – Dec 2023
- Monitored vital signs and telemetry for ICU patients across 120 clinical hours
- Performed wound care and central line dressing changes for 3 post-surgical patients

EXPERIENCE
Patient Care Technician, Mercy General Hospital, Dayton, OH | Jun 2023 – Present
- Measure vital signs and blood glucose for up to 12 patients per shift and escalate changes to the charge nurse
- Document intake, output and assessments in Epic within 30 minutes of care
- Trained 6 new patient care techs on unit safety protocols and fall prevention
- Reduced call-light response time on the unit by 2 minutes by proposing hourly rounding

EDUCATION
Bachelor of Science in Nursing (BSN), Lakeview University | May 2024
GPA 3.6 · Dean's List, 4 semesters

SKILLS
Epic, patient assessment, medication administration, IV therapy, wound care, patient education, discharge planning, telemetry, interdisciplinary communication, Spanish (conversational)`,
  edits: [
    ["Put license and certifications at the top", "Nurse recruiters check licensure first. \"RN license, BLS, ACLS\" now sits right under the name."],
    ["Turned clinicals into their own section", "Each rotation names the unit, hospital and hours, which is what new grad residencies screen for."],
    ["Swapped duties for results", "\"Helped nurses with whatever they needed\" became bullets with patient counts, hours and outcomes."],
    ["Used the posting's words", "Epic, medication administration, discharge planning and patient education all come straight from the listing."],
    ["Cut the objective and the extras", "A two-line summary replaced the objective, and \"References available upon request\" came off."]
  ]
},
{
  id: "tech", field: "tech", fieldLabel: "Software", name: "Ethan Park", who: "CS junior",
  role: "Software Engineering Intern", company: "Northwind Labs",
  job: `Software Engineering Intern (Summer), Northwind Labs
Join our product engineering team for 12 weeks. You will build features in our web application using React and TypeScript, write REST APIs in Python, and work with PostgreSQL. You will write unit tests, take part in code reviews and ship to production using Git and CI/CD. We look for students pursuing a degree in computer science or a related field who have built projects outside of class, understand data structures and algorithms, and communicate clearly. Experience with AWS or Docker is a plus.`,
  before: `Ethan Park
ethanpark@email.com | (555) 555-0101

Objective: To obtain a software internship at a company where I can use my skills.

Education
Computer Science, Westfield University, Expected 2026
Relevant classes: Data Structures, Algorithms, Databases

Projects
Personal Website - made my own website with HTML and CSS.
Weather App - an app that shows the weather. Used an API.
Group project for class where we made a game.

Work
Cashier, Corner Café | 2023 – Present
- Responsible for taking orders and handling money
- Helped with closing duties

Skills
Java, Python, HTML, CSS, JavaScript, Microsoft Office, hard worker, quick learner`,
  after: `ETHAN PARK
Seattle, WA · (206) 555-0101 · ethan.park@email.com · github.com/ethanpark · linkedin.com/in/ethan-park

SUMMARY
Computer science junior looking for a Software Engineering Intern role. Builds full-stack web applications in React, TypeScript and Python, with unit tests, code reviews and CI/CD on every project.

EDUCATION
B.S. Computer Science, Westfield University | Expected May 2026
GPA 3.5 · Coursework: Data Structures, Algorithms, Databases, Operating Systems, Software Engineering

PROJECTS
StudySync, React, TypeScript, Python, PostgreSQL | Jan 2025 – Present
- Built a web application that matches classmates into study groups, now used by 340 students on campus
- Wrote 14 REST API endpoints in Python (FastAPI) backed by PostgreSQL, keeping median response time under 120 ms
- Added unit tests with pytest and Jest that cover 82% of the codebase, run on every pull request through GitHub Actions CI/CD
- Deployed with Docker on AWS (EC2 and RDS) for under $15 a month

Weather Now, JavaScript, Node.js | Sep 2024 – Nov 2024
- Created a weather dashboard that caches API results, cutting external API calls by 70%
- Reached 1,200 visits in its first month after sharing it on the campus Discord

Campus Game Jam, C#, Unity | Mar 2024
- Led a team of 4 to ship a 2D puzzle game in 48 hours, placing 2nd of 22 teams
- Ran code reviews in Git and resolved merge conflicts for the team

EXPERIENCE
Cashier, Corner Café, Seattle, WA | Sep 2023 – Present
- Handle 150+ orders per shift with a cash drawer accuracy of 99.8%
- Built a Google Sheets tracker for weekly inventory that cut supply over-ordering by 15%

SKILLS
Languages: Python, TypeScript, JavaScript, Java, SQL, C#
Frameworks: React, Node.js, FastAPI, Jest, pytest
Tools: Git, GitHub Actions, Docker, AWS, PostgreSQL, Linux`,
  edits: [
    ["Added GitHub to the header", "Tech recruiters look for code links first. GitHub and LinkedIn now sit next to the email."],
    ["Named the tech stack in every project", "Each project lists its languages and tools, and the bullets say what was built with them."],
    ["Gave projects real numbers", "340 users, 14 endpoints, 82% test coverage and 120 ms response time show scale and quality."],
    ["Mirrored the posting", "React, TypeScript, REST APIs, PostgreSQL, unit tests, code reviews and CI/CD all match the listing."],
    ["Grouped skills by type", "Soft skills like \"hard worker\" and Microsoft Office came off; languages, frameworks and tools got their own lines."]
  ]
},
{
  id: "accounting", field: "accounting", fieldLabel: "Accounting", name: "Priya Shah", who: "Accounting sophomore",
  role: "Audit Intern", company: "Hartwell & Crane LLP",
  job: `Audit Intern, Hartwell & Crane LLP
Our audit interns join engagement teams serving public and private companies. You will perform audit testing, review financial statements, prepare workpapers, reconcile accounts and support internal controls testing. Candidates should be pursuing a bachelor's degree in accounting with a strong GPA, plan to meet the 150-hour requirement for CPA licensure, and be comfortable in Excel (pivot tables, VLOOKUP). Strong attention to detail, analytical skills and client communication are required. Leadership in student organizations such as Beta Alpha Psi is a plus.`,
  before: `PRIYA SHAH
priya.shah@email.com · (555) 555-0144

EDUCATION
Accounting major, Brookfield University
Brookfield High School, Class of 2023

WORK EXPERIENCE
Bookkeeping Help, Shah Family Pharmacy | 2022 – Present
- Did the books for my parents' store
- Helped with taxes
- Responsible for paying bills and other things as needed

Volunteer, Brookfield Food Bank | 2021
- Volunteered at the food bank

SKILLS
Excel, detail oriented, hard working, good with numbers, team player`,
  after: `PRIYA SHAH
Hartford, CT · (860) 555-0144 · priya.shah@email.com · linkedin.com/in/priyashah-acct

SUMMARY
Accounting student applying for an Audit Intern position. Three years of hands-on bookkeeping, account reconciliation and financial statement preparation for a small business, plus volunteer tax preparation. Strong in Excel and detail-focused audit testing.

EDUCATION
Bachelor of Science in Accounting, Brookfield University | Expected May 2027
GPA 3.8 · Dean's List · On track for the 150-hour CPA requirement through the integrated M.S. in Accounting
Relevant coursework: Intermediate Accounting I, Auditing Principles, Cost Accounting, Business Law

EXPERIENCE
Bookkeeper, Shah Family Pharmacy, Hartford, CT | Jun 2022 – Present
- Reconcile 3 bank and 2 credit card accounts each month in QuickBooks with no open differences at month-end
- Process $40K in monthly vendor payments and track invoices in an Excel aging report built with pivot tables and VLOOKUP
- Prepare quarterly financial statements and sales tax workpapers for the outside CPA, saving the store about $1,200 a year in fees
- Found $3,100 in duplicate vendor charges by matching invoices to purchase orders

Treasurer, Beta Alpha Psi, Brookfield Chapter | Aug 2024 – Present
- Manage a $9,500 chapter budget and present monthly variance reports to 60 members
- Set up approval controls for reimbursements, cutting processing time from 2 weeks to 4 days

Volunteer Tax Preparer, VITA Program | Jan 2024 – Apr 2024
- Prepared 45 federal and state returns for low-income families, with every return passing quality review

SKILLS
Excel (pivot tables, VLOOKUP, XLOOKUP), QuickBooks Online, account reconciliation, financial statements, audit testing, internal controls, workpapers, client communication`,
  edits: [
    ["Added GPA and a CPA plan", "Accounting firms screen on GPA and on whether you will meet the 150-hour rule, so both are now in Education."],
    ["Removed high school", "Once you are in college, the degree replaces it."],
    ["Showed the family job as real bookkeeping", "Reconciliations, vendor payments and $3,100 in found errors read like audit work, which is what it was."],
    ["Added leadership with numbers", "Treasurer of Beta Alpha Psi, the honor society the posting names, with a real budget and a control she set up."],
    ["Listed the posting's tools", "Pivot tables, VLOOKUP, workpapers and internal controls replace \"good with numbers\"."]
  ]
},
{
  id: "marketing", field: "creative", fieldLabel: "Marketing", name: "Jasmine Wright", who: "Recent grad",
  role: "Marketing Coordinator", company: "Bloom & Field",
  job: `Marketing Coordinator, Bloom & Field
Bloom & Field, a growing home goods brand, is hiring a Marketing Coordinator to plan and run social media, email and content campaigns. You will manage the content calendar, write copy, design graphics in Figma or Adobe Creative Cloud, schedule posts, run email campaigns in Klaviyo or Mailchimp and report on performance with Google Analytics. We want someone organized and creative with 0–2 years of experience, a portfolio of work, and comfort with paid social and A/B testing.`,
  before: `Jasmine Wright
jazzyj2000@email.com

Profile
Passionate, creative and results-driven communications graduate with a love for all things social media! I am a fast learner who thrives in a fast-paced environment.

Experience
Social Media Intern, City Arts Council | Summer 2024
I ran their Instagram and made posts for events. I also helped with the newsletter and made flyers in Canva.

Server, Olive Table | 2021 – 2024
- Served customers
- Responsible for upselling specials

Education
B.A. Communications, Ridgeway College, 2024

Skills
Instagram, TikTok, Canva, creative, organized, people person`,
  after: `JASMINE WRIGHT
Charlotte, NC · (704) 555-0177 · jasmine.wright@email.com · jasminewright.design · linkedin.com/in/jasminewright

SUMMARY
Marketing coordinator with a communications degree and hands-on social media, email and design experience. Grew a nonprofit's Instagram 64% in one summer and wrote email campaigns that beat the arts industry's average open rate. Portfolio: jasminewright.design

EXPERIENCE
Social Media Intern, City Arts Council, Charlotte, NC | May 2024 – Aug 2024
- Planned a 12-week content calendar and published 85 posts across Instagram and TikTok
- Grew Instagram followers from 2,300 to 3,770 (64%) and doubled average engagement rate to 4.2%
- Designed 30+ event graphics and flyers in Figma and Canva that matched the council's brand guide
- Wrote and A/B tested 8 Mailchimp newsletters, raising open rate from 24% to 33%
- Tracked campaign performance in Google Analytics and presented a monthly report to the director

Server, Olive Table, Charlotte, NC | Aug 2021 – May 2024
- Sold featured specials to 1 in 3 tables, the highest add-on rate among 15 servers
- Wrote the weekly specials board copy and posted it to the restaurant's Instagram, which drove 40+ reservations a month

PROJECTS
Paid Social Test, Ridgeway Bookstore | Feb 2024
- Ran a $300 Meta ads campaign with two creative variants and cut cost per click by 38% after the first week

EDUCATION
B.A. Communications, Ridgeway College | May 2024

SKILLS
Social media strategy, content calendars, copywriting, email marketing (Mailchimp, Klaviyo), Figma, Adobe Photoshop, Adobe Illustrator, Canva, Google Analytics, Meta Ads Manager, A/B testing`,
  edits: [
    ["Put the portfolio link at the top", "Creative hiring managers want to see work first, so the portfolio URL is in the header and the summary."],
    ["Replaced the buzzwords", "\"Passionate, results-driven, fast learner\" became a summary with two real results."],
    ["Turned a paragraph into bullets", "The internship went from one paragraph to five bullets with follower growth, open rates and post counts."],
    ["Showed design tools", "Figma, Adobe and Canva are named, matching the posting's request."],
    ["Fixed the email address", "A name-based address replaced the nickname."]
  ]
},
{
  id: "teaching", field: "teaching", fieldLabel: "Teaching", name: "Daniel Okafor", who: "Student teacher",
  role: "Elementary Teacher", company: "Maple Grove School District",
  job: `Elementary Teacher, Grade 4, Maple Grove School District
We are seeking a Grade 4 elementary teacher to plan and deliver standards-aligned lessons in reading, writing, math and science. The teacher will use data from formative assessments to differentiate instruction, support students with IEPs and English learners, manage a positive classroom environment and communicate regularly with families. Requirements: bachelor's degree in elementary education, state teaching certification (or eligible), and student teaching experience. Experience with Google Classroom, small-group instruction and PBIS is preferred.`,
  before: `DANIEL OKAFOR
dokafor@email.com · (555) 555-0122

OBJECTIVE
To become a teacher who inspires students to love learning.

EDUCATION
Elementary Education, Clearwater State University, 2025

EXPERIENCE
Student Teacher | 2025
- Taught lessons to students
- Helped the teacher grade papers
- Responsible for classroom management

Camp Counselor, Sunny Pines Camp | 2022 – 2024
- Watched kids at summer camp
- Did activities with campers

SKILLS
Patient, organized, good with kids, Microsoft Word, PowerPoint`,
  after: `DANIEL OKAFOR
Columbus, OH · (614) 555-0122 · daniel.okafor@email.com · linkedin.com/in/danielokafor
Ohio Resident Educator License, Grades P–5 (issued Jun 2025)

SUMMARY
Elementary teacher certified for grades P–5 with a full semester of student teaching in Grade 4. Plans standards-aligned lessons, uses formative assessment data to differentiate instruction, and builds strong partnerships with families.

STUDENT TEACHING
Grade 4 Student Teacher, Oakview Elementary, Maple Grove School District | Jan 2025 – May 2025
- Planned and taught 60+ standards-aligned lessons in reading, writing, math and science for 26 students
- Used weekly formative assessments to run small-group instruction, raising the class reading benchmark pass rate from 58% to 77%
- Adapted lessons and materials for 4 students with IEPs and 3 English learners in partnership with the intervention team
- Built a PBIS reward system that cut office referrals from 9 to 2 per month
- Sent weekly family newsletters through Google Classroom and held 26 parent conferences

Practicum, Grade 2, Riverside Elementary | Aug 2024 – Dec 2024
- Led 12 math lessons and 3 science labs, and graded and recorded assessments for 22 students

EXPERIENCE
Camp Counselor, Sunny Pines Camp | Jun 2022 – Aug 2024
- Supervised groups of 12 campers ages 7–10 and planned 40 daily STEM and outdoor activities each summer
- Promoted to lead counselor in 2024 and trained 5 new counselors

EDUCATION
B.S. Elementary Education, Clearwater State University | May 2025
GPA 3.7 · Reading Endorsement

SKILLS
Lesson planning, differentiated instruction, formative assessment, classroom management, PBIS, IEP support, English learner support, Google Classroom, Seesaw, family communication`,
  edits: [
    ["Listed the teaching license up top", "Districts screen for certification first, so the license and grade band are under the name."],
    ["Gave student teaching its own section", "School, district, grade level and dates now lead, with the biggest results in bullets."],
    ["Added classroom results", "A reading benchmark that rose from 58% to 77% says more than \"taught lessons\"."],
    ["Matched the district's language", "Differentiated instruction, formative assessment, IEPs, English learners and PBIS all come from the posting."],
    ["Cut the objective", "A summary that names the grade band and strengths replaced it."]
  ]
},
{
  id: "trades", field: "trades", fieldLabel: "Skilled trades", name: "Luis Romero", who: "Career changer",
  role: "Electrician Apprentice", company: "Summit Electric",
  job: `Electrician Apprentice, Summit Electric
Summit Electric is hiring apprentices for commercial and residential projects. Apprentices work under a licensed journeyman electrician to install conduit, pull wire, mount panels and devices, read blueprints and follow the National Electrical Code (NEC). Requirements: high school diploma or GED, valid driver's license, reliable transportation, OSHA 10 certification, and the ability to lift 50 lbs and work on ladders. Pre-apprenticeship or trade school training, hand and power tool experience and a strong safety record are preferred.`,
  before: `Luis Romero
(555) 555-0190

Objective: Hard working guy looking for an apprentice job.

Work History
Warehouse Worker, FastShip | 2020 – 2025
- Moving boxes
- Driving forklift
- Did whatever my supervisor told me to

Helper, my uncle's handyman business
- Helped my uncle on jobs

School
GED`,
  after: `LUIS ROMERO
Phoenix, AZ · (602) 555-0190 · luis.romero@email.com · Valid AZ driver's license, own transportation
OSHA 10 Construction · Forklift Certified · CPR/First Aid

SUMMARY
Electrician apprentice candidate with 160 hours of electrical pre-apprenticeship training, 5 years of safe warehouse work and hands-on experience with hand and power tools. Comfortable reading blueprints and working to the NEC.

TRAINING
Electrical Pre-Apprenticeship, Valley Trade Institute | Jan 2025 – May 2025
- Completed 160 hours of classroom and lab training in residential wiring, conduit bending and the National Electrical Code (NEC)
- Wired 6 practice panels and 20+ circuits, passing every instructor inspection on the first try
- Read blueprints and load calculations for 3 residential lab projects

EXPERIENCE
Warehouse Associate, FastShip, Phoenix, AZ | Mar 2020 – Jan 2025
- Operated forklifts and pallet jacks for 5 years with zero safety incidents
- Loaded and unloaded 300+ packages per shift, regularly lifting 50+ lbs
- Trained 8 new associates on lockout/tagout and safe lifting

Handyman Helper, Romero Home Repair, Phoenix, AZ | Jun 2017 – Present (part time)
- Replaced 40+ outlets, switches and light fixtures under supervision on residential jobs
- Installed drywall, shelving and ceiling fans using drills, saws and other power tools

EDUCATION
GED, Arizona Department of Education | 2017

SKILLS
Conduit bending, pulling wire, installing panels and devices, blueprint reading, NEC basics, hand and power tools, ladder safety, lockout/tagout`,
  edits: [
    ["Put certifications and the license line first", "OSHA 10, forklift certification and a valid driver's license are hard requirements, so they lead."],
    ["Added training as its own section", "160 hours of pre-apprenticeship training is the strongest qualification here and was missing."],
    ["Showed safety and physical work in numbers", "Five years with zero incidents and lifting 50+ lbs answer the posting directly."],
    ["Turned \"helped my uncle\" into electrical work", "Replacing 40+ outlets and fixtures is relevant experience, and the business now has a name and dates."],
    ["Added an email and dates", "The old version had no email and no dates on one job, which recruiters read as a gap."]
  ]
}
];

function galScore(text, job, role, fieldKey) {
  const prev = field; field = fieldKey;
  let checks; try { checks = gradeResume(text, job, role); } finally { field = prev; }
  const scored = checks.filter(c => !c.skip && c.w);
  const tw = scored.reduce((s, c) => s + c.w, 0);
  const score = Math.round(scored.reduce((s, c) => s + c.w * VAL[c.status], 0) / tw * 100);
  const letter = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  return { score, letter, checks: scored };
}
function galOpen(g, which) {
  const set = (id, v) => { const el = $("#" + id); if (el) el.value = v; };
  set("jobText", g.job); set("roleName", g.role); set("companyName", g.company);
  field = g.field; set("fieldSel", g.field); if (typeof renderFieldGuide === "function") renderFieldGuide();
  loadText(g[which], "resume");
}
function galInit() {
  const list = $("#galList"); if (!list || list.dataset.ready) return;
  list.dataset.ready = "1";
  const R = GALLERY.map(g => ({ g, b: galScore(g.before, g.job, g.role, g.field), a: galScore(g.after, g.job, g.role, g.field) }));
  const avgB = Math.round(R.reduce((s, r) => s + r.b.score, 0) / R.length);
  const avgA = Math.round(R.reduce((s, r) => s + r.a.score, 0) / R.length);
  $("#galAvg").innerHTML = `<div><b>${R.length}</b><span>example resumes</span></div><div><b>${avgB}</b><span>average before</span></div><div><b>${avgA}</b><span>average after</span></div><div><b>+${avgA - avgB}</b><span>average gain</span></div>`;
  $("#galFilter").innerHTML = `<button type="button" class="gal-f" aria-pressed="true" data-f="all">All fields</button>` + GALLERY.map(g => `<button type="button" class="gal-f" aria-pressed="false" data-f="${g.id}">${esc(g.fieldLabel)}</button>`).join("");
  list.innerHTML = R.map(({ g, b, a }) => {
    const before = Object.fromEntries(b.checks.map(c => [c.id, c.status]));
    const fixed = a.checks.filter(c => c.status === "pass" && before[c.id] && before[c.id] !== "pass").map(c => (RUBRIC[c.id] || {}).name || c.title);
    const bar = (r, cls) => `<div class="gal-bar ${cls}"><span class="gal-lbl">${cls === "b" ? "Before" : "After"}</span><span class="gal-track"><i style="width:${r.score}%"></i></span><b>${r.score}</b><span class="gal-grade">${r.letter}</span></div>`;
    return `<article class="sheet gal-card" data-gal="${g.id}">
      <div class="gal-head">
        <div><span class="eyebrow">${esc(g.fieldLabel)} · Example</span><h3>${esc(g.name)}, ${esc(g.who.toLowerCase())}</h3><p>Applying for <b>${esc(g.role)}</b> at ${esc(g.company)}</p></div>
        <div class="gal-scores">${bar(b, "b")}${bar(a, "a")}<span class="gal-gain">+${a.score - b.score} points</span></div>
      </div>
      <div class="gal-body">
        <div class="gal-doc">
          <div class="gal-tabs" role="group" aria-label="Choose version"><button type="button" class="gal-t" data-v="before" aria-pressed="false">Before · ${b.score}</button><button type="button" class="gal-t" data-v="after" aria-pressed="true">After · ${a.score}</button></div>
          <div class="tpl-paper"><div class="doc" data-doc="after">${renderResumeDoc(g.after)}</div><div class="doc" data-doc="before" hidden>${renderResumeDoc(g.before)}</div></div>
        </div>
        <div class="gal-notes">
          <h4>What changed</h4>
          <ol class="gal-edits">${g.edits.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ol>
          ${fixed.length ? `<h4>Checks that now pass</h4><ul class="gal-fixed">${fixed.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
          <details class="gal-job"><summary>The job posting it was graded against</summary><p>${esc(g.job).replace(/\n/g, "<br>")}</p></details>
          <div class="gal-actions"><button type="button" class="btn small primary" data-open="after">Grade the after version</button><button type="button" class="btn small" data-open="before">Grade the before version</button></div>
        </div>
      </div>
    </article>`;
  }).join("");
  list.querySelectorAll(".gal-card").forEach(card => {
    const g = GALLERY.find(x => x.id === card.dataset.gal);
    card.querySelectorAll(".gal-t").forEach(t => t.onclick = () => {
      card.querySelectorAll(".gal-t").forEach(x => x.setAttribute("aria-pressed", x === t));
      card.querySelectorAll("[data-doc]").forEach(d => d.hidden = d.dataset.doc !== t.dataset.v);
    });
    card.querySelectorAll("[data-open]").forEach(btn => btn.onclick = () => galOpen(g, btn.dataset.open));
  });
  $("#galFilter").querySelectorAll(".gal-f").forEach(f => f.onclick = () => {
    $("#galFilter").querySelectorAll(".gal-f").forEach(x => x.setAttribute("aria-pressed", x === f));
    list.querySelectorAll(".gal-card").forEach(c => c.hidden = f.dataset.f !== "all" && c.dataset.gal !== f.dataset.f);
  });
}
