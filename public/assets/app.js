/* One Stop main script: shared helpers, routing, grader, builder, LinkedIn checker, jobs, tracker, accounts.
   Bigger tools load on demand from assets/*.js (see LAZY below), so the first visit stays fast. */
/* ---------- Content ---------- */
const SAMPLES = {
weakResume: `JORDAN LEE
partyjordan99@email.com
Objective: Hard-working team player looking for a challenging position where I can grow my skills.

WORK EXPERIENCE
Sales Associate, BrightMart | 2021 – Present
- Responsible for helping customers
- Duties included stocking shelves and running the register
- I was in charge of training new hires when my manager asked me to and I also helped with a lot of other things around the store like cleaning and organizing displays
- Helped with inventory

Intern, Lakeside Marketing | Summer 2020
- Helped with social media
- Responsible for making posts and doing various tasks as assigned

EDUCATION
B.A. Communications, State University | 2021
Springfield High School | 2017

Date of birth: 04/12/1999
Marital status: Married
References available upon request`,

strongResume: `JORDAN LEE
Columbus, OH · (614) 555-0142 · jordan.lee@email.com · linkedin.com/in/jordanlee

SUMMARY
Retail sales lead moving into marketing coordination. Grew store loyalty sign-ups 38% with in-store campaigns and run social media accounts with 12,000 followers. Skilled in Canva, Meta Business Suite, Google Analytics, Mailchimp and Excel.

EXPERIENCE
Sales Lead, BrightMart, Columbus, OH | Jun 2021 – Present
- Trained 14 new associates on POS and customer service, cutting onboarding time from 3 weeks to 10 days
- Designed an in-store loyalty campaign that raised enrollment 38% in one quarter
- Reorganized seasonal inventory counts with a shared spreadsheet, reducing count errors by 22%
- Resolved escalated customer issues while keeping a 4.8/5 store satisfaction rating

Marketing Intern, Lakeside Marketing, Columbus, OH | May 2020 – Aug 2020
- Planned a content calendar and scheduled 60+ Instagram and Facebook posts for 3 small-business clients
- Wrote ad copy for a spring campaign that earned a 4.1% click-through rate, double the client's average
- Built a weekly social media analytics report in Google Sheets used by the account team
- Drafted 6 Mailchimp email newsletters with an average 31% open rate

EDUCATION
B.A. Communications, The Ohio State University | 2021

SKILLS
Social media marketing, content calendars, copywriting, email marketing (Mailchimp), Canva, Meta Business Suite, Google Analytics, Excel, event support, Spanish (conversational)`,

weakLetter: `To Whom It May Concern,

My name is Jordan Lee and I am writing to apply for the position at your company. I am a hard worker and a team player and I think I would be a great fit.

I have worked in retail for a few years and I did an internship. I am passionate about marketing and I am a fast learner. I believe I have the skills you are looking for.

Please contact me if you are interested. Thank you for your time.

Jordan`,

strongLetter: `Dear Ms. Patel,

When Northwind Outdoor Co.'s "Trail Ready" spring campaign showed up in my feed three times in one week, I went looking for who was behind it. I'd love to help build the next one as your Marketing Coordinator.

At BrightMart, I designed an in-store loyalty campaign from scratch: signage, a QR sign-up flow, and a short script for cashiers. Enrollment rose 38% in one quarter, and the regional office rolled the campaign out to four more stores. That project taught me how to turn a small budget and a clear message into measurable results.

Your posting asks for someone who can own a content calendar and report on what works. During my internship at Lakeside Marketing, I scheduled 60+ posts for three clients and built the weekly Google Analytics report the account team used to decide what to post next. One spring ad I wrote earned a 4.1% click-through rate, double the client's average.

I'd welcome the chance to talk about how I could support Northwind's summer launch and grow your email list. Thank you for considering my application.

Sincerely,
Jordan Lee
(614) 555-0142 · jordan.lee@email.com`,

job: `Marketing Coordinator, Northwind Outdoor Co.
We're looking for a Marketing Coordinator to support our growing brand. You will manage our social media content calendar, write copy for campaigns, and coordinate email marketing in Mailchimp. You'll track campaign performance in Google Analytics and prepare weekly reporting for the marketing team. Requirements: 1-3 years of marketing, social media or communications experience; strong copywriting skills; experience with Canva or Adobe Creative Cloud; comfortable with analytics and Excel. Nice to have: event planning, SEO basics, and experience in retail or outdoor brands. You'll work cross-functionally with sales and product teams and help manage a small campaign budget.`
};

const RESUME_TEMPLATES = [
{ name: "Reverse-chronological", look: "classic", lookName: "Classic", fonts: "Georgia headings and body, centered name", best: "BEST FOR · STEADY WORK HISTORY", desc: "The classic. Recent experience first, results in every bullet.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · linkedin.com/in/yourname

SUMMARY
[Job title] with [X] years of experience in [industry]. Known for [top strength] — [one result with a number]. Skilled in [3–4 skills from the job posting].

EXPERIENCE
[Job Title], [Company], [City, State] | [Mon YYYY] – Present
- [Action verb] [what you did] by [how], resulting in [number or outcome]
- [Action verb] [project or responsibility], [result with %, $, or time saved]
- [Action verb] [team, process, or tool] to [goal], [measurable result]

[Job Title], [Company], [City, State] | [Mon YYYY] – [Mon YYYY]
- [Action verb] [what you did], [result]
- [Action verb] [what you did], [result]

EDUCATION
[Degree], [School] | [Year]

SKILLS
[Hard skill], [Software], [Tool], [Certification], [Language]` },
{ name: "Entry-level / student", look: "modern", lookName: "Modern blue", fonts: "Calibri, blue name and section rules", best: "BEST FOR · STUDENTS & NEW GRADS", desc: "Leads with education and projects when work history is short.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · portfolio-or-linkedin.com

EDUCATION
[Degree] in [Major], [University] | Expected [Mon YYYY]
GPA: [3.5+ only if strong] · Dean's List [semesters]
Relevant coursework: [Course], [Course], [Course]

PROJECTS
[Project Name] | [Mon YYYY]
- [Built / Researched / Led] [what] using [tools], [result or who used it]
- [Action verb] [specific contribution], [number: users, grade, size of team]

EXPERIENCE
[Part-time Job Title], [Employer], [City, State] | [Mon YYYY] – [Mon YYYY]
- [Action verb] [task], [result such as customers served per shift or sales]
- [Action verb] [responsibility you were trusted with]

LEADERSHIP & ACTIVITIES
[Role], [Club or Organization] | [YYYY] – [YYYY]
- [Organized / Raised / Recruited] [what], [number]

SKILLS
[Software], [Tools], [Languages], [Certifications]` },
{ name: "Combination (hybrid)", look: "bold", lookName: "Bold block", fonts: "Arial Black name, dark heading bars", best: "BEST FOR · CAREER CHANGERS & GAPS", desc: "Transferable skills with proof up top, compact history below.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · linkedin.com/in/yourname

SUMMARY
[Current field] professional moving into [target field]. [Strongest transferable result]. Completed [relevant course or certificate] and skilled in [tools from the posting].

KEY SKILLS & ACHIEVEMENTS
[Skill area 1 from the posting]
- [Action verb] [example from any job, volunteer role, or project], [result]
- [Action verb] [second example], [result]
[Skill area 2 from the posting]
- [Action verb] [example], [result]
- [Action verb] [example], [result]

EXPERIENCE
[Job Title], [Company], [City, State] | [YYYY] – Present
- [One or two of the most relevant results]
[Job Title], [Company], [City, State] | [YYYY] – [YYYY]
- [Most relevant result]

EDUCATION & TRAINING
[Certificate or Bootcamp], [Provider] | [Year]
[Degree], [School] | [Year]

SKILLS
[Software], [Tools], [Languages]` },
{ name: "Technical", look: "compact", lookName: "Compact", fonts: "Calibri 10pt, teal side-bar headings", best: "BEST FOR · SOFTWARE, DATA, IT", desc: "Skills and shipped work first, with the stack named in each bullet.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · github.com/you · linkedin.com/in/you

TECHNICAL SKILLS
Languages: [Python, TypeScript, SQL]
Frameworks: [React, Django, FastAPI]
Tools & Cloud: [AWS, Docker, Git, Postgres]

EXPERIENCE
[Software Engineer], [Company], [City, State] | [Mon YYYY] – Present
- [Built / Designed / Migrated] [system] in [stack], [improving latency / cost / reliability by X%]
- [Automated / Optimized] [process], [saving N hours a week or $X a year]
- [Led / Mentored] [N engineers] on [project], [shipped on date or result]

PROJECTS
[Project Name] · [github.com/you/project]
- [What it does] built with [stack]; [users, stars, or performance number]

EDUCATION
[B.S. Computer Science], [University] | [Year]

CERTIFICATIONS
[AWS Certified Cloud Practitioner] | [Year]` },
{ name: "Healthcare & nursing", look: "care", lookName: "Clean clinical", fonts: "Segoe UI or Arial, soft green headings", best: "BEST FOR · RN, LPN, CNA, ALLIED HEALTH", desc: "Licenses up top, clinical rotations and patient outcomes in the bullets.",
text: `FIRST LAST, [RN, BSN]
City, State · (555) 555-5555 · you@email.com · linkedin.com/in/yourname

LICENSES & CERTIFICATIONS
[Registered Nurse], [State] License #[number] | Exp. [Mon YYYY]
[BLS, ACLS, PALS], [American Heart Association] | Exp. [Mon YYYY]

SUMMARY
[Specialty] nurse with [X] years in [unit type, e.g. med-surg or ICU]. Cared for [N] patients per shift while [result, e.g. keeping falls below unit average].

CLINICAL EXPERIENCE
[Staff Nurse], [Hospital], [Unit], [City, State] | [Mon YYYY] – Present
- [Managed / Assessed] [N] patients per shift on a [bed count]-bed [unit], [outcome]
- [Educated / Coordinated] [patients or families] on [topic], [result such as readmission or satisfaction score]
- [Charted / Trained] in [Epic, Cerner], [result such as peers onboarded]

CLINICAL ROTATIONS
[Unit], [Hospital] | [Hours] hours | [Semester YYYY]
- [Skill practiced], [patient population]

EDUCATION
[BSN], [School of Nursing] | [Year]

SKILLS
[IV insertion], [Wound care], [Telemetry], [EHR system], [Language]` },
{ name: "Sales & customer-facing", look: "creative", lookName: "Accent bar", fonts: "Trebuchet MS, red accent under the name", best: "BEST FOR · SALES, RETAIL, SERVICE", desc: "Numbers-forward: quota, revenue and customer results lead every role.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · linkedin.com/in/yourname

SUMMARY
[Sales / Customer success] professional who [hit X% of quota or grew accounts by $X] in [industry]. Strong at [prospecting, closing, retention] with [CRM].

KEY RESULTS
- [X%] of quota for [N] straight quarters
- [$X] in new revenue from [N] accounts
- [Ranked #N of N] reps in [region or company]

EXPERIENCE
[Account Executive], [Company], [City, State] | [Mon YYYY] – Present
- [Closed / Grew] [N] accounts worth [$X], [X%] above target
- [Built / Ran] [outreach or process], raising [conversion or response rate] from [X%] to [Y%]
- [Retained / Upsold] [customers], [renewal or satisfaction number]

[Sales Associate], [Store], [City, State] | [Mon YYYY] – [Mon YYYY]
- [Averaged $X per shift] or [ranked top N in add-on sales]

EDUCATION
[Degree], [School] | [Year]

SKILLS
[Salesforce or HubSpot], [Cold calling], [Negotiation], [Language]` },
{ name: "Executive & management", look: "executive", lookName: "Executive serif", fonts: "Garamond, spaced capitals, double rule", best: "BEST FOR · MANAGERS, DIRECTORS, VPs", desc: "Leads with scope: team size, budget and business results.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · linkedin.com/in/yourname

EXECUTIVE SUMMARY
[Title] with [X] years leading [function] at [company type]. Built and led teams of [N] with budgets up to [$X]. Known for [turnaround, growth, or efficiency] — [one headline result].

CORE STRENGTHS
[Strategy], [P&L ownership], [Team building], [Change management], [Industry expertise]

LEADERSHIP EXPERIENCE
[Director of Function], [Company], [City, State] | [YYYY] – Present
Lead [N]-person team across [N] sites; own [$X] budget.
- [Grew / Cut / Launched] [what], delivering [$X or X%] in [timeframe]
- [Restructured / Built] [team or process], [result such as retention or cycle time]
- [Partnered with] [executives or board] on [initiative], [outcome]

[Senior Manager], [Company], [City, State] | [YYYY] – [YYYY]
- [Biggest result in this role, with a number]

EDUCATION
[MBA], [School] | [Year]
[Bachelor's], [School] | [Year]

BOARDS & AFFILIATIONS
[Board or association], [Role] | [YYYY] – Present` },
{ name: "Creative & marketing", look: "minimal", lookName: "Minimal", fonts: "Helvetica Neue light, airy spacing, gray headings", best: "BEST FOR · DESIGN, CONTENT, MARKETING", desc: "Portfolio link up front and campaign results in every bullet.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com · yourportfolio.com

PROFILE
[Designer / Marketer / Writer] who [made what] for [brands or audiences]. Campaigns have [reached N people or lifted metric by X%].

SELECTED WORK
[Campaign or Project Name], [Client or Company] | [YYYY]
- [Concepted / Designed / Wrote] [deliverable], [result such as engagement, sign-ups, awards]
[Campaign or Project Name], [Client or Company] | [YYYY]
- [Action verb] [deliverable], [result]

EXPERIENCE
[Marketing Coordinator], [Company], [City, State] | [Mon YYYY] – Present
- [Grew / Launched] [channel], from [X] to [Y] [followers, subscribers, leads]
- [Produced] [N pieces of content] a month, [result]

EDUCATION
[Degree in Field], [School] | [Year]

TOOLS
[Figma], [Adobe Creative Cloud], [Google Analytics], [Canva], [HubSpot]` },
{ name: "Skilled trades", look: "trade", lookName: "Workshop", fonts: "Verdana, amber rules", best: "BEST FOR · ELECTRICIANS, HVAC, MECHANICS", desc: "Licenses, equipment and safety record are easy to spot at a glance.",
text: `FIRST LAST
City, State · (555) 555-5555 · you@email.com

SUMMARY
[Journeyman Electrician / HVAC Tech] with [X] years in [residential, commercial, industrial] work. [Safety record, e.g. zero lost-time incidents in X years].

LICENSES & CERTIFICATIONS
[License type], [State] #[number] | [Year]
[OSHA 30], [EPA 608], [Forklift] | [Year]

EXPERIENCE
[Technician], [Company], [City, State] | [Mon YYYY] – Present
- [Installed / Repaired / Maintained] [N systems or units] a [week or month], [result such as callbacks or on-time rate]
- [Trained / Led] [N apprentices or a crew of N] on [job type]
- [Cut / Improved] [downtime, cost, or time] by [X%] by [how]

[Apprentice], [Company], [City, State] | [Mon YYYY] – [Mon YYYY]
- [Completed] [N hours] under [license type] supervision

TRAINING
[Apprenticeship program or trade school] | [Year]

EQUIPMENT & SKILLS
[Tools], [Diagnostics], [Blueprint reading], [Codes, e.g. NEC 2023]` }

];

const LETTER_TEMPLATES = [
{ name: "Classic four-paragraph", best: "BEST FOR · MOST APPLICATIONS", desc: "Hook, proof story, second proof, clear ask.",
text: `Dear [Hiring Manager's Name],

I'm excited to apply for the [Job Title] role at [Company]. [One specific reason this company: a product, campaign, value, or recent news]. With [X years] of experience in [field] and a track record of [headline result], I'm confident I can help [team or goal from the posting].

In my current role at [Current Company], I [faced a situation or goal]. I [actions you took], which [measurable result]. That experience is directly relevant to your need for [requirement from the posting].

You also mention [second requirement]. At [Company or Project], I [short example with a number]. I'd bring the same approach to [Company]'s [team or project].

I'd welcome the chance to discuss how I can contribute to [specific goal]. Thank you for your time and consideration.

Sincerely,
[Full Name]
[Phone] · [Email] · [LinkedIn]` },
{ name: "Career changer", best: "BEST FOR · SWITCHING FIELDS", desc: "Names the switch, then bridges it with transferable proof.",
text: `Dear [Hiring Manager's Name],

After [X years] in [current field], I'm applying for the [Job Title] role at [Company] because [genuine reason you're making the move and why this company]. I recently completed [course, certificate, or project] to build on skills I've used for years.

The core of this role is [key requirement]. As a [current job title], I [transferable achievement with a number]. The setting was different, but the skill is the same: [name the skill in the posting's language].

To prepare for this move, I [project, freelance work, or volunteering], where I [result]. It confirmed that [what you learned and why you're a fit].

I'd love to talk about how my background in [current field] could give your team a different perspective on [problem]. Thank you for considering my application.

Sincerely,
[Full Name]
[Phone] · [Email]` },
{ name: "Entry-level / internship", best: "BEST FOR · STUDENTS & NEW GRADS", desc: "Leans on coursework, projects and campus roles.",
text: `Dear [Hiring Manager's Name],

I'm a [year] studying [major] at [University], and I'm applying for the [Internship / Job Title] at [Company]. [Specific reason: a class, project, or product that sparked your interest in this company].

In [course or project], I [what you did] using [tools or methods], and [result: grade, users, award, or what it achieved]. It gave me hands-on practice with [skill from the posting].

Outside class, I [job, club, or volunteer role], where I [achievement with a number]. That taught me [relevant soft skill shown through an example, not just named].

I'd welcome the opportunity to learn from your team and contribute to [specific project or goal]. Thank you for your consideration. I look forward to speaking with you.

Sincerely,
[Full Name]
[Phone] · [Email]` },
{ name: "Short email version", best: "BEST FOR · EMAIL OR REFERRALS", desc: "When the letter is the email body. Under 150 words.",
text: `Dear [Name],

[Referrer's name] suggested I reach out about the [Job Title] role at [Company]. I'm a [current title] with [X years] of experience in [field], most recently [one headline result with a number].

Your posting asks for [top requirement]. At [Current Company], I [one specific example that matches it].

My resume is attached. I'd welcome a quick call to talk about the role. Thank you for your time.

Best regards,
[Full Name]
[Phone] · [LinkedIn]` }
];

const RESUME_PAIRS = [
{ topic: "Duties vs. results", bad: "Responsible for managing social media accounts.", good: "Grew Instagram following from 2,100 to 9,800 in 8 months by posting five times a week and running two giveaway campaigns.", note: "\"Responsible for\" says what you were supposed to do. Say what happened because of you." },
{ topic: "Vague help", bad: "Helped with customer service.", good: "Resolved 40+ customer calls a day with a 96% first-call resolution rate.", note: "\"Helped\" shrinks you. Use a verb that shows you owned it, then add a number." },
{ topic: "Hidden teamwork", bad: "Worked on a team to improve the website.", good: "Redesigned the checkout page with a 3-person team, cutting cart abandonment 18%.", note: "Name your part, the team size and the outcome." },
{ topic: "Objective statement", bad: "Objective: Seeking a challenging position in a growth-oriented company where I can utilize my skills.", good: "Customer support specialist with 4 years in SaaS. Cut ticket backlog 35% by building a macro library. Fluent in Zendesk, Salesforce and Spanish.", note: "Objectives talk about what you want. A summary tells them what they get." },
{ topic: "Skills section", bad: "Skills: Microsoft Office, hard worker, email, internet, team player", good: "Skills: Excel (pivot tables, XLOOKUP), Salesforce, SQL basics, Zendesk, Spanish (fluent)", note: "List tools and abilities you can be tested on. Prove traits like \"hard worker\" in your bullets." },
{ topic: "Filler", bad: "Performed various other tasks as assigned.", good: "Took over weekly vendor ordering for 2 locations, keeping stock-outs under 1%.", note: "Every bullet should earn its line. Cut it, or make it specific." },
{ topic: "Wall of text", bad: "I was in charge of training new hires when my manager asked me to and I also helped with a lot of other things around the store like cleaning and organizing displays.", good: "Trained 14 new associates on POS and customer service, cutting onboarding from 3 weeks to 10 days.", note: "One idea per bullet, under two lines. Drop \"I\"." },
{ topic: "Outdated education", bad: "Springfield High School, Diploma, 2017 (listed under a college degree)", good: "B.A. Communications, The Ohio State University | 2021", note: "Remove high school once you have a degree or a few years of work." }
];

const LETTER_PAIRS = [
{ topic: "Opening line", bad: "My name is Jordan Lee and I am writing to apply for the open position.", good: "When Northwind's \"Trail Ready\" campaign showed up in my feed three times in one week, I went looking for who was behind it. I'd love to help build the next one as your Marketing Coordinator.", note: "Your name is already at the top. Open with why them, and name the role." },
{ topic: "Greeting", bad: "To Whom It May Concern,", good: "Dear Ms. Patel,  (or: Dear Northwind Marketing Team,)", note: "Find a name on LinkedIn or the company site. A team name beats a cold generic." },
{ topic: "Telling vs. showing", bad: "I am a hard worker and a fast learner.", good: "I learned Meta Business Suite in my first week at Lakeside and was scheduling posts for three clients by week two.", note: "Anyone can claim a trait. A short story proves it." },
{ topic: "Repeating the resume", bad: "As you can see on my resume, I worked at BrightMart from 2021 to present and before that at Lakeside Marketing.", good: "At BrightMart, I designed a loyalty campaign from scratch. Enrollment rose 38% in one quarter and four more stores adopted it.", note: "Pick one story and give the details the resume has no room for." },
{ topic: "Apologizing", bad: "I know I don't have much experience, but I hope you'll consider me.", good: "My two years in retail taught me how customers actually decide, which is what good marketing copy has to anticipate.", note: "Never argue against yourself. Lead with what you do have." },
{ topic: "Closing", bad: "Please contact me if you are interested.", good: "I'd welcome the chance to talk about how I could support Northwind's summer launch. Thank you for considering my application.", note: "End with a confident, specific ask." }
];

const RES_INC = [
["Name, city and state, phone, professional email", "A full street address is optional and often left off now."],
["LinkedIn, portfolio or GitHub link", "Only if it is up to date and supports the application."],
["A 2–3 line summary tailored to the job", "Your title, years of experience, top result, key skills."],
["Experience with achievements, not duties", "3–6 bullets per recent role, fewer for older ones."],
["Numbers: %, $, time saved, volume, team size", "Aim for a number in at least 40% of bullets."],
["Keywords from the job posting", "Use the employer's exact words for skills and tools."],
["Education, certifications and licenses", "Put them first if you are a student or the role requires them."],
["Relevant projects, volunteering or freelance work", "Especially for career changers and new grads."],
["Consistent dates (Mon YYYY – Mon YYYY)", "Pick one format and use it everywhere."]
];
const RES_OFF = [
["Photo", "Standard in parts of Europe and Asia, but avoided in the US, UK and Canada to reduce bias."],
["Date of birth, age, marital status, religion, nationality", "Employers can't legally use these, and many prefer not to see them."],
["Social Security number or ID numbers", "Never needed on a resume. Identity-theft risk."],
["\"References available upon request\"", "It's assumed. Use the line for an achievement."],
["Objective statements", "Replace with a summary of what you offer."],
["Salary history or expectations", "Save it for the conversation or the application form."],
["Reasons for leaving past jobs", "Discuss in the interview if asked."],
["High school, once you have a degree or experience", ""],
["Jobs older than 10–15 years", "Unless they are directly relevant. Summarize as \"Earlier experience\"."],
["\"I\", \"me\", \"my\"", "Resumes are written in implied first person: \"Led…\" not \"I led…\"."],
["Clichés: team player, hard worker, detail-oriented", "Show these through results instead."],
["Unprofessional email addresses", "Use a version of your name."],
["Tables, text boxes, icons and headers/footers holding key info", "Applicant tracking systems often can't read them."],
["Unexplained acronyms and internal jargon", "Spell out company-specific terms once, or replace them with plain words."],
["Anything untrue or exaggerated", "It can be checked, and it can get an offer withdrawn."]
];
const LET_INC = [
["The hiring manager's name if you can find it", "Check LinkedIn, the company site or the posting."],
["The exact job title and company name", "Mention the company more than once; it shows the letter isn't generic."],
["Why this company specifically", "A product, campaign, mission or recent news."],
["One or two proof stories with numbers", "Situation, action, result."],
["The posting's key requirements, in their words", "Mirror two or three of them directly."],
["A clear closing ask", "\"I'd welcome the chance to discuss…\""],
["Your contact details under the sign-off", ""]
];
const LET_OFF = [
["\"To Whom It May Concern\" and \"Dear Sir or Madam\"", "Use a name, or \"Dear [Team] Hiring Team\"."],
["\"My name is…\"", "It's already in your signature and header."],
["A rewrite of your resume", "Go deeper on one or two things instead."],
["Apologies for missing experience", "Lead with strengths; don't point at gaps."],
["Negative comments about past employers", "It reflects on you, not them."],
["Salary demands, unless the posting asks", ""],
["More than one page, or over ~450 words", "Hiring managers skim. Three to five short paragraphs."],
["The same letter sent to every company", "Swap at least the opening and one proof story each time."]
];
const RULES = [
["1 page", "Length", "Under about 10 years of experience. Two pages is fine for senior roles; federal and academic CVs run longer."],
["10–12 pt", "Body font size", "Name at 16–22 pt, headings at 11–14 pt. Use a common font like Calibri, Arial, Garamond or Georgia."],
["0.5–1 in", "Margins", "Keep them even on all sides. Don't shrink below 0.5\" to cram text in."],
["~7 sec", "First skim", "A Ladders eye-tracking study found recruiters' first pass averages about 7 seconds. The exact number is debated, but the top third of the page still matters most."],
["3–6", "Bullets per role", "More for your current job, fewer for older ones. Keep each under two lines."],
["PDF", "File type", "Unless the posting asks for .docx. Name it First-Last-Resume.pdf."],
["10–15 yrs", "How far back", "Older roles can be cut or summarized in one line."],
["250–400", "Cover letter words", "Three to five paragraphs on one page."]
];
const ATS = [
["Standard headings", "Use \"Experience\", \"Education\", \"Skills\". Creative labels like \"My Journey\" confuse parsers."],
["Mirror the posting", "If it says \"project management\", don't only write \"managed projects\"."],
["Acronyms both ways", "Write \"Search Engine Optimization (SEO)\" once, so either search matches."],
["Single column", "Two-column layouts and tables can scramble the reading order."],
["Contact info in the body", "Many systems skip page headers and footers."],
["Simple bullets", "Round bullets or hyphens. Skip icons, emoji, arrows and graphics."]
];
const VERBS = {
"Leading": "Led, directed, supervised, mentored, coached, coordinated, delegated, oversaw, spearheaded, headed, chaired, recruited",
"Building": "Built, created, designed, developed, launched, founded, established, engineered, produced, implemented, introduced, wrote",
"Improving": "Improved, streamlined, reduced, cut, accelerated, simplified, automated, optimized, upgraded, revamped, restructured, modernized",
"Growing": "Increased, grew, expanded, generated, boosted, raised, won, secured, exceeded, doubled, attracted, captured",
"Analyzing": "Analyzed, assessed, audited, evaluated, forecasted, identified, investigated, measured, modeled, researched, tested, tracked",
"Communicating": "Presented, negotiated, persuaded, briefed, authored, edited, published, pitched, translated, advised, consulted, facilitated",
"Organizing": "Organized, planned, scheduled, prioritized, managed, administered, budgeted, cataloged, maintained, processed, executed, delivered",
"Helping": "Resolved, supported, assisted, guided, trained, served, advocated, counseled, onboarded, answered, retained, satisfied"
};
const CHECK_RESUME = ["Name and contact details are correct, and the email is professional","Summary is tailored to this job, not generic","Every recent bullet starts with an action verb","At least 40% of bullets include a number","Keywords from the posting appear naturally","No personal details: photo, birth date, marital status","No \"References available upon request\" or objective statement","Dates are consistent and in reverse order","Fits on one page (or two if 10+ years)","Spell-checked and read aloud once","Saved as PDF named First-Last-Resume.pdf","Ran it through the grader on this site"];
const CHECK_LETTER = ["Addressed to a person or specific team","Names the company and job title","Explains why this company in the first paragraph","Includes at least one proof story with a number","Echoes two or three requirements from the posting","Ends with a clear ask for a conversation","Under one page and about 250–400 words","Company name is correct everywhere (no leftovers from another letter)"];
const RESOURCES = [
{ group: "Writing guides", items: [
["Purdue OWL: Job Search Writing", "https://owl.purdue.edu/owl/job_search_writing/index.html", "Free university guides to resumes, CVs and cover letters, with examples.", "owl.purdue.edu"],
["CareerOneStop: Resumes", "https://www.careeronestop.org/JobSearch/Resumes/resumes.aspx", "U.S. Department of Labor guide to writing, formatting and tailoring a resume.", "careeronestop.org"],
["CareerOneStop: Cover letters", "https://www.careeronestop.org/JobSearch/CoverLetters/cover-letters.aspx", "Step-by-step cover letter advice and samples from the Department of Labor.", "careeronestop.org"],
["Harvard: Resumes and cover letters", "https://careerservices.fas.harvard.edu/resources/hes-create-impactful-resumes-and-cover-letters/", "Resume and cover letter guides, templates and action verb lists.", "careerservices.fas.harvard.edu"],
["MIT Career Advising & Professional Development", "https://capd.mit.edu/", "Resume and cover letter guides with technical and research examples.", "capd.mit.edu"],
["Indeed Career Guide", "https://www.indeed.com/career-advice/resumes-cover-letters", "Hundreds of articles and samples organized by job title and industry.", "indeed.com"]
]},
{ group: "Research the job and its keywords", items: [
["O*NET OnLine", "https://www.onetonline.org/", "Tasks, skills and tools for almost every occupation. Great for finding the right words.", "onetonline.org"],
["Occupational Outlook Handbook", "https://www.bls.gov/ooh/", "Bureau of Labor Statistics profiles: duties, pay, education and job outlook.", "bls.gov"],
["USAJOBS Help Center", "https://help.usajobs.gov/", "How federal resumes differ: more detail, hours per week and specific qualifications.", "help.usajobs.gov"]
]},
{ group: "More templates", items: [
["Microsoft Create: Resume templates", "https://create.microsoft.com/en-us/templates/resumes", "Free Word templates. Pick simple, single-column ones for ATS.", "create.microsoft.com"],
["Microsoft Create: Cover letter templates", "https://create.microsoft.com/en-us/templates/cover-letters", "Matching letter designs for Word.", "create.microsoft.com"],
["Canva resume templates", "https://www.canva.com/resumes/templates/", "Design-heavy layouts. Good for creative roles; export a plain version for online applications.", "canva.com"],
["Overleaf CV gallery", "https://www.overleaf.com/gallery/tagged/cv", "LaTeX templates popular in academia and engineering.", "overleaf.com"]
]},
{ group: "Polish and feedback", items: [
["r/resumes wiki", "https://www.reddit.com/r/resumes/wiki/index", "Community-maintained guide and free peer critiques. Remove personal info before posting.", "reddit.com"],
["Hemingway Editor", "https://hemingwayapp.com/", "Highlights long sentences and passive voice. Useful for cover letters.", "hemingwayapp.com"],
["UNC Writing Center: Tips & tools", "https://writingcenter.unc.edu/tips-and-tools/", "Handouts on concise writing, word choice and editing.", "writingcenter.unc.edu"]
]},
{ group: "Research behind the advice", items: [
["Ladders eye-tracking study (HR Dive)", "https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582", "Recruiters' first scan averaged about 7 seconds and focused on titles, companies and dates.", "hrdive.com"],
["Is the 6-second scan a myth? (ERE)", "https://www.ere.net/articles/is-the-6-second-resume-scan-a-myth", "A recruiter-side look at what the skim statistic does and doesn't mean.", "ere.net"],
["NACE: High-impact skills for resumes (2026)", "https://naceweb.org/about-us/press/2026/the-high-impact-skills-college-students-should-showcase-on-their-resumes", "Employer survey on which skills new grads should show, and why examples beat lists.", "naceweb.org"],
["ResumeGo cover letter study", "https://www.resumego.net/research/cover-letters/", "Tailored cover letters drew more callbacks than generic ones. Run by a resume company, so read it with that in mind.", "resumego.net"],
["Does ATS reject resumes? (Enhancv)", "https://enhancv.com/blog/does-ats-reject-resumes/", "Recruiter interviews on how tracking systems are actually used. Vendor-run study.", "enhancv.com"],
["Recruiters on ATS vs. volume (ClearanceJobs)", "https://news.clearancejobs.com/2026/07/29/recruiters-reveal-ats-doesnt-kill-your-resume-its-overwhelming-volume/", "Why the real obstacle is application volume, not robots.", "clearancejobs.com"],
["Google's X-Y-Z bullet formula (Inc.)", "https://law.utexas.edu/wp-content/uploads/sites/44/2020/09/Google-Recruiters-Say-Using-the-X-Y-Z-Formula-on-Your-Resume-Will-Improve-Your-Odds-of-Getting-Hired-at-Google-_-Inc.com_.pdf", "The \"accomplished X, measured by Y, by doing Z\" formula used on the Tips page.", "law.utexas.edu (PDF)"]
]},
{ group: "Know your rights", items: [
["EEOC: Prohibited practices", "https://www.eeoc.gov/prohibited-employment-policiespractices", "Why age, religion, marital status and similar details don't belong on an application.", "eeoc.gov"]
]}
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
let toastTimer;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 1800); }
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast("Copied"); }
  catch {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch {}
    ta.remove(); toast(ok ? "Copied" : "Copy blocked here. Select the text in the preview instead.");
  }
}
const hl = s => esc(s).replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");

function renderResumeDoc(text) {
  const lines = text.split("\n");
  let html = "", inList = false, i = 0;
  const close = () => { if (inList) { html += "</ul>"; inList = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { close(); i++; continue; }
    if (i === 0) html += `<div class="d-name">${hl(line)}</div>`;
    else if (i === 1 && /[@·]/.test(line)) html += `<div class="d-contact">${hl(line)}</div>`;
    else if (/^[-•*]\s/.test(line)) { if (!inList) { html += "<ul>"; inList = true; } html += `<li>${hl(line.replace(/^[-•*]\s+/, ""))}</li>`; }
    else if (/^[A-Z0-9 &/,'().-]{3,}$/.test(line) && /[A-Z]{3}/.test(line)) { close(); html += `<div class="d-h">${hl(line)}</div>`; }
    else if (line.includes(" | ")) { close(); const [a, b] = line.split(" | "); html += `<div class="d-role"><span>${hl(a)}</span><span>${hl(b)}</span></div>`; }
    else { close(); html += `<p>${hl(line)}</p>`; }
    i++;
  }
  close();
  return html;
}
function renderLetterDoc(text) {
  return text.split(/\n\s*\n/).map(p => `<p>${hl(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
}

/* ---------- Routing ---------- */
const VIEWS = ["home", "grade", "build", "internships", "linkedin", "linkedin-post", "how-we-grade", "resumes", "cover-letters", "examples", "gallery", "tips", "tracker", "resources", "match", "coach", "tailor", "interview", "review", "privacy", "terms", "kit", "follow-up", "rejection"];
const BASE_TITLE = document.title;
function route() {
  const ALIAS = { robot: "tailor", human: "grade" };
  const h = ALIAS[location.hash.slice(1)] || location.hash.slice(1);
  const sub = h.startsWith("review-") ? h.slice(7) : null;
  const v = sub ? "review" : VIEWS.includes(h) ? h : "home";
  document.querySelectorAll("[data-view]").forEach(s => s.hidden = s.dataset.view !== v);
  document.querySelectorAll("nav.tabs a").forEach(a => { if (a.getAttribute("href") === "#" + v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  const inMore = document.querySelector(`.more-menu a[href="#${v}"]`);
  $("#moreLabel").textContent = inMore ? inMore.textContent : "More";
  $("#moreLabel").classList.toggle("current", !!inMore);
  $("#moreMenu").open = false;
  const navA = document.querySelector(`nav.tabs a[href="#${v}"]`);
  document.title = v === "home" ? BASE_TITLE : `${(navA?.textContent || document.querySelector(`[data-view="${v}"] h1`)?.textContent || "").trim()} | One Stop`;
  if (typeof onView === "function") onView(v, sub);
  setTimeout(markScrollers, 50);
}
// Let keyboard users scroll boxes that overflow (templates, previews, extracted text).
function markScrollers() {
  document.querySelectorAll("main [data-view]:not([hidden]) *").forEach(el => {
    if (el.tabIndex >= 0 || el.matches("textarea, input, select, button, a")) return;
    const cs = getComputedStyle(el);
    if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2)) {
      el.tabIndex = 0; if (!el.getAttribute("role") && !/^(OL|UL|TABLE)$/.test(el.tagName)) el.setAttribute("role", "region");
      if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", (el.closest("article, .sheet, .field, .mcol")?.querySelector("h2, h3, b, label")?.textContent || "Scrollable content").trim().slice(0, 60));
    }
  });
}
document.addEventListener("click", e => { const m = $("#moreMenu"); if (m.open && !m.contains(e.target)) m.open = false; });
document.addEventListener("keydown", e => { const m = $("#moreMenu"); if (e.key === "Escape" && m.open) { m.open = false; if (m.contains(document.activeElement)) m.querySelector("summary").focus(); } });
// After a page change, move focus to the new page's heading so keyboard and screen reader users land on it,
// unless focus is already inside the page that's now showing (in-page buttons that change the hash).
window.addEventListener("hashchange", () => {
  route(); window.scrollTo(0, 0);
  const a = document.activeElement, view = document.querySelector("main [data-view]:not([hidden])");
  if (!view || (a && a !== document.body && view.contains(a) && a.offsetParent)) return;
  const h = view.querySelector("h1") || $("#main");
  if (h !== $("#main")) h.tabIndex = -1;
  h.focus({ preventScroll: true });
});
$("#skipLink").addEventListener("click", e => { e.preventDefault(); $("#main").focus(); });

/* ---------- Grader ---------- */
const STRONG_VERBS = new Set(Object.values(VERBS).join(", ").toLowerCase().split(/,\s*/).concat(
 "achieved,acquired,adapted,addressed,awarded,balanced,boosted,calculated,captured,championed,clarified,collaborated,compiled,completed,conducted,configured,consolidated,converted,coordinated,cultivated,debugged,decreased,defined,deployed,devised,diagnosed,documented,drafted,drove,earned,eliminated,enabled,enhanced,ensured,exceeded,expedited,formulated,fostered,generated,handled,hired,initiated,inspected,installed,integrated,invented,launched,lowered,mapped,maximized,migrated,minimized,monitored,navigated,operated,orchestrated,outperformed,overhauled,partnered,pioneered,prepared,programmed,promoted,proposed,provided,ran,rebuilt,received,recommended,reconciled,redesigned,refined,reorganized,replaced,reported,represented,resolved,revised,saved,scaled,shaped,shipped,solved,sourced,standardized,strengthened,structured,surpassed,taught,transformed,unified,validated,volunteered".split(",")));
const WEAK_PHRASES = [
 [/\bresponsible for\b/gi, "\"responsible for\""], [/\bduties (included|include)\b/gi, "\"duties included\""], [/\bhelped (with|to)\b/gi, "\"helped with\""],
 [/\bworked on\b/gi, "\"worked on\""], [/\bin charge of\b/gi, "\"in charge of\""], [/\b(various|other) (tasks|duties)\b/gi, "\"various tasks\""],
 [/\bas assigned\b/gi, "\"as assigned\""], [/\btasked with\b/gi, "\"tasked with\""], [/\bassisted (with|in)\b/gi, "\"assisted with\""]
];
const CLICHES = ["team player","hard worker","hard-working","hardworking","detail-oriented","detail oriented","go-getter","self-starter","self starter","think outside the box","synergy","results-driven","results-oriented","dynamic","passionate","motivated individual","proven track record","go-to person","fast learner","quick learner","work well under pressure","people person","perfectionist","guru","ninja","rockstar","wear many hats","best of breed"];
const MISSPELL = { managment: "management", acheive: "achieve", acheived: "achieved", recieve: "receive", recieved: "received", responsibilty: "responsibility", seperate: "separate", definately: "definitely", occured: "occurred", accomodate: "accommodate", enviroment: "environment", excellant: "excellent", experiance: "experience", proffesional: "professional", sucessful: "successful", sucessfully: "successfully", comunication: "communication", maintainance: "maintenance", liason: "liaison", begining: "beginning", calender: "calendar", collegue: "colleague", untill: "until", wich: "which", lead: "led (past tense)" };
const STOP = new Set("comfortable growing grow prepare basics a an the and or but if of to in on for with at by from as is are be been being was were will would can could should may might must shall this that these those it its we our you your they their them he she his her i me my us who whom which what when where why how all any each few more most other some such no nor not only own same so than too very s t just don now also into about above below up down out over under again further then once here there both through during before after between per via etc able ability work working works team teams role roles job position candidate candidates company opportunity opportunities experience experienced years year required requirements requirement preferred plus strong excellent including include includes looking seeking join help support new great good ideal must responsibilities responsible duties skills skill knowledge understanding familiarity proven demonstrated track record environment day days within across well using use used make ensure ensuring other others like nice have has having do does did you'll we're you're it's we'll they're".split(" "));

function keywords(job) { return units(job); }
function hasWord(text, w) {
  const stem = w.replace(/(ing|ed|es|s)$/, "");
  const base = (stem.length >= 4 ? stem : w).replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&");
  return new RegExp("(^|[^a-z0-9])" + base, "i").test(text);
}
const SYN = [
 ["manage","managed","managing","management","manager","led","oversaw","supervised","directed","owned"],
 ["analytics","analysis","analyze","analyzed","analytical","metrics","measured"],
 ["write","writing","wrote","written","copywriting","drafted","authored"],
 ["coordinate","coordinated","coordinating","coordinator","coordination","organized","scheduled"],
 ["report","reporting","reports","reported","dashboard","dashboards"],
 ["communicate","communication","communications","presented","presentation","presentations"],
 ["customer","customers","client","clients","guest","guests"],
 ["budget","budgets","budgeting","forecast"],
 ["develop","developed","development","developing","built","build","created"],
 ["design","designed","designing","designer"],
 ["cross-functional","collaborated","collaboration","partnered","stakeholders"],
 ["sales","sell","selling","sold","revenue","quota"],
 ["train","trained","training","mentored","onboarded","coached"],
 ["improve","improved","improving","optimized","streamlined","increased","boosted"],
 ["plan","planned","planning","scheduled","organized"],
 ["email","newsletter","newsletters","mailchimp"],
 ["social","instagram","facebook","tiktok","linkedin"],
 ["seo","search engine optimization"],
 ["excel","spreadsheet","spreadsheets","sheets"],
 ["adobe","photoshop","illustrator","indesign"],
 ["campaign","campaigns","promotion","promotions"],
 ["content","posts","articles","blog"]
];
// Multi-word skills and tools. Matched as whole phrases so "planned a calendar" never counts as "event planning".
const PHRASES = ["social media", "social media marketing", "content calendar", "content creation", "content strategy", "email marketing", "digital marketing", "google analytics", "google ads", "google sheets", "google workspace", "meta business suite", "adobe creative cloud", "creative cloud", "microsoft office", "microsoft excel", "power bi", "event planning", "project management", "product management", "account management", "customer service", "customer experience", "customer success", "data analysis", "data entry", "data visualization", "machine learning", "public relations", "public speaking", "search engine optimization", "brand awareness", "market research", "lead generation", "cold calling", "sales pipeline", "inventory management", "supply chain", "quality assurance", "quality control", "financial analysis", "financial reporting", "accounts payable", "accounts receivable", "general ledger", "account reconciliation", "budget management", "cross-functional", "stakeholder management", "time management", "problem solving", "attention to detail", "written communication", "verbal communication", "conflict resolution", "team leadership", "patient care", "patient education", "vital signs", "wound care", "medication administration", "electronic health records", "lesson planning", "classroom management", "differentiated instruction", "curriculum development", "special education", "graphic design", "user experience", "user research", "web design", "video editing", "version control", "unit testing", "rest api", "front end", "back end", "full stack", "cloud computing", "technical support", "help desk", "preventive maintenance", "blueprint reading", "forklift operation", "osha 10", "osha 30", "point of sale"];
const UNIT_SKIP = /^(you|we|our|the|a|an|about|requirements?|qualifications?|nice|what|who|why|how|this|that|apply|benefits?|responsibilities)\b/;
function stemOf(w) { return w.length > 4 ? w.replace(/(ations?|ing|ed|ors?|ers?|ments?|es|s)$/, "") : w; }
function rxEsc(s) { return s.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&"); }
function phraseIn(text, p) {
  const ws = p.toLowerCase().split(/[\s-]+/).filter(Boolean);
  const pat = ws2 => "(^|[^a-z0-9])" + ws2.map(w => rxEsc(stemOf(w)) + "[a-z]*").join("[\\s\\-/&]+(?:and\\s+)?") + "([^a-z0-9]|$)";
  if (new RegExp(pat(ws), "i").test(text)) return true;
  return ws.length === 2 && new RegExp(pat([ws[1], ws[0]]), "i").test(text);
}
// Split a posting (or a requirement) into match units: known phrases, capitalized tool names, repeated two-word terms, then single words.
function units(text, max = 24) {
  const low = text.toLowerCase(), found = [];
  const add = p => { p = p.toLowerCase().trim(); if (p && !found.includes(p) && !found.some(f => f.includes(p))) { for (let i = found.length - 1; i >= 0; i--) if (p.includes(found[i])) found.splice(i, 1); found.push(p); } };
  PHRASES.forEach(p => { if (phraseIn(low, p)) add(p); });
  (text.match(/\b[A-Z][A-Za-z0-9+#]*(?:\s+(?:&\s+)?[A-Z][A-Za-z0-9+#]*){1,3}\b/g) || []).forEach(m => {
    const l = m.toLowerCase(), ws = l.split(/\s+/).filter(w => w !== "&");
    if (UNIT_SKIP.test(l) || ws.every(w => STOP.has(w)) || ws.some(w => /^(i|co|inc|llc|corp|ltd|company)$/.test(w))) return;
    add(l);
  });
  const corp = new Set((text.match(/\b(?:[A-Z][A-Za-z0-9&]*\s+){1,3}(?=(?:Co|Inc|LLC|Corp|Company|Group|Ltd)\b)/g) || []).flatMap(m => m.toLowerCase().split(/\s+/)).filter(Boolean));
  const toks = (low.match(/[a-z][a-z0-9+#.\-/]*[a-z0-9+#]/g) || []);
  const bi = {};
  for (let i = 0; i < toks.length - 1; i++) { const a = toks[i], b = toks[i + 1]; if (a.length > 2 && b.length > 2 && !STOP.has(a) && !STOP.has(b)) bi[a + " " + b] = (bi[a + " " + b] || 0) + 1; }
  Object.entries(bi).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).forEach(([p]) => add(p));
  const phrases = found.slice(0, Math.ceil(max * 0.6));
  const covered = new Set(phrases.flatMap(p => p.split(/[\s-]+/)));
  const freq = {}, form = {};
  toks.filter(w => w.length > 2 && !STOP.has(w) && !/^\d/.test(w) && !covered.has(w) && !corp.has(w)).forEach(w => { const s = stemOf(w); freq[s] = (freq[s] || 0) + 1; if (!form[s]) form[s] = w; });
  const words = Object.entries(freq).sort((a, b) => b[1] - a[1] || low.indexOf(form[a[0]]) - low.indexOf(form[b[0]])).map(e => form[e[0]]);
  return [...phrases, ...words].slice(0, max);
}
function hasUnit(text, u) { return u.includes(" ") || u.includes("-") ? phraseIn(text, u) : hasWord(text, u); }
function synonymHit(text, w) {
  const g = SYN.find(grp => grp.includes(w));
  return g ? g.some(x => x !== w && new RegExp("(^|[^a-z0-9])" + x.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "([^a-z0-9]|$)", "i").test(text)) : false;
}
function keywordCheck(text, job, passAt, warnAt, id) {
  if (!job.trim()) return { id, cat: "Keywords", w: 0, status: "warn", title: "Add a job posting to check keywords", detail: "Paste the listing below your document. Matching its language is one of the biggest factors in applicant tracking systems.", skip: true };
  const kws = keywords(job);
  text = text.replace(/[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/\S+/g, " ");
  const hits = kws.filter(k => hasUnit(text, k));
  const syns = kws.filter(k => !hits.includes(k) && !/[\s-]/.test(k) && synonymHit(text, k));
  const ratio = kws.length ? (hits.length + syns.length * 0.75) / kws.length : 0;
  const pct = Math.round(ratio * 100);
  const chips = `<div class="kw">${kws.map(k => `<span class="${hits.includes(k) ? "hit" : syns.includes(k) ? "syn" : "miss"}" title="${syns.includes(k) ? "Matched by a related word" : ""}">${esc(k)}${syns.includes(k) ? " ≈" : ""}</span>`).join("")}</div>`;
  return { id, cat: "Keywords", w: 4, status: ratio >= passAt ? "pass" : ratio >= warnAt ? "warn" : "fail",
    title: `Matches ${pct}% of the posting's top keywords`,
    detail: (ratio >= passAt ? "Strong overlap with the posting." : "Terms from the posting you haven't mentioned are dashed. Work them in only where they're true for you.") + (syns.length ? " Words marked ≈ matched a related term; using the posting's exact word is safer." : "") + chips, html: true };
}
function countCliches(t) { const l = t.toLowerCase(); return CLICHES.filter(c => new RegExp("\\b" + c.replace(/-/g, "[- ]?") + "\\b").test(l)); }
function findTypos(t) { return [...new Set((t.toLowerCase().match(/[a-z]+/g) || []).filter(w => MISSPELL[w] && w !== "lead"))]; }
function list(arr) { return arr.map(a => `"${a}"`).join(", "); }

function gradeResume(t, job, role) {
  const C = [];
  const lines = t.split("\n").map(l => l.trim()).filter(Boolean);
  const words = (t.match(/\S+/g) || []).length;
  const bullets = lines.filter(l => /^([-•*▪◦·–]|\d+[.)])\s*/.test(l)).map(l => l.replace(/^([-•*▪◦·–]|\d+[.)])\s*/, ""));
  const lower = t.toLowerCase();

  // Contact
  const email = t.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
  const phone = /(\+?\d[\d\s().-]{8,}\d)/.test(t);
  const link = /linkedin\.com|github\.com|portfolio|behance|https?:\/\//i.test(t);
  const silly = email && /(party|sexy|hot|420|69|babe|lover|princess|gangsta|xoxo|cutie|baller|killer|badboy|badgirl)/i.test(email[0]);
  const cParts = [email ? null : "email", phone ? null : "phone number"].filter(Boolean);
  C.push({ id: "r-contact", cat: "Format", w: 3, status: cParts.length === 0 ? "pass" : cParts.length === 1 ? "warn" : "fail",
    title: false ? "Email address looks unprofessional" : cParts.length ? `Missing ${cParts.join(" and ")}` : "Contact details are complete",
    detail: false ? `"${email[0]}" may get you screened out. Use a version of your name, like first.last@email.com.` : cParts.length ? "Put your phone, email and city/state on one line under your name." : (link ? "Email, phone and a profile link are all present." : "Email and phone found. Consider adding a LinkedIn or portfolio link.") });

  // Sections
  const sec = { Experience: /\b(experience|employment|work history|professional background|projects)\b/i.test(t), Education: /\b(education|degree|university|college|b\.?a\.?|b\.?s\.?|diploma|certificat)/i.test(t), Skills: /\b(skills|technical skills|competencies|tools)\b/i.test(t) };
  const missing = Object.keys(sec).filter(k => !sec[k]);
  if (silly) C.push({ id: "r-email", cat: "Format", w: 0, status: "warn", title: "Email address may look unprofessional", detail: `"${email[0]}" could give the wrong impression. A version of your name, like first.last@email.com, is safer.` });
  C.push({ id: "r-sections", cat: "Format", w: 3, status: missing.length === 0 ? "pass" : missing.length === 1 ? "warn" : "fail",
    title: missing.length ? `Missing a ${missing.join(" and ")} section` : "Has Experience, Education and Skills sections",
    detail: missing.length ? "Use standard section headings so recruiters and applicant tracking systems can find them." : "Standard headings make it easy for software and people to scan." });

  // Length
  C.push({ id: "r-length", cat: "Format", w: 2, status: words >= 300 && words <= 850 ? "pass" : (words >= 180 && words < 300) || (words > 850 && words <= 1100) ? "warn" : "fail",
    title: `${words} words`, detail: words < 300 ? "This looks thin. Most one-page resumes run 400–700 words. Add results to each role." : words > 850 ? "This may run past one page. Cut older roles and bullets that don't support this job." : "A comfortable length for one to two pages." });

  // Bullets
  C.push({ id: "r-bullets", cat: "Format", w: 2, status: bullets.length >= 6 ? "pass" : bullets.length >= 3 ? "warn" : "fail",
    title: `${bullets.length} bullet point${bullets.length === 1 ? "" : "s"} found`, detail: bullets.length >= 6 ? "Bullets make your experience easy to skim." : "Describe each role in 3–6 bullets starting with \"-\" or \"•\". Paragraphs get skipped." });

  if (bullets.length) {
    const long = bullets.filter(b => (b.match(/\S+/g) || []).length > 30);
    C.push({ id: "r-bulletlen", cat: "Format", w: 1, status: long.length === 0 ? "pass" : long.length <= Math.max(1, bullets.length * 0.2) ? "warn" : "fail",
      title: long.length ? `${long.length} bullet${long.length > 1 ? "s are" : " is"} too long` : "Bullets are a readable length",
      detail: long.length ? `Keep each bullet under about 30 words. Split or trim: "${esc(long[0].slice(0, 80))}…"` : "Every bullet is under about 30 words." });

    const first = bullets.map(b => (b.match(/^[A-Za-z]+/) || [""])[0].toLowerCase());
    const strong = first.filter(w => STRONG_VERBS.has(w) || STRONG_VERBS.has(w + "d") || STRONG_VERBS.has(w + "ed") || (/ed$/.test(w) && w.length > 4 && w !== "need"));
    const vr = strong.length / bullets.length;
    const weakStarts = bullets.filter((b, i) => !strong.includes(first[i])).slice(0, 2);
    C.push({ id: "r-verbs", cat: "Impact", w: 3, status: vr >= 0.7 ? "pass" : vr >= 0.4 ? "warn" : "fail",
      title: `${Math.round(vr * 100)}% of bullets start with an action verb`,
      detail: vr >= 0.7 ? "Strong openings like these read as ownership." : `Start bullets with verbs like Led, Built, Increased or Resolved. For example, rewrite: "${esc((weakStarts[0] || "").slice(0, 70))}"` });

    const nums = bullets.filter(b => /\d|%|\$/.test(b));
    const nr = nums.length / bullets.length;
    C.push({ id: "r-numbers", cat: "Impact", w: 3, status: nr >= 0.4 ? "pass" : nr >= 0.2 ? "warn" : "fail",
      title: `${Math.round(nr * 100)}% of bullets include a number`,
      detail: nr >= 0.4 ? "Numbers make your results concrete." : "Add %, $, counts, time saved or team size to at least 4 in 10 bullets. Honest estimates are fine." });

    const counts = {}; first.forEach(w => { if (w) counts[w] = (counts[w] || 0) + 1; });
    const rep = Object.entries(counts).filter(([w, n]) => n >= 3 && STRONG_VERBS.has(w)).map(([w]) => w);
    C.push({ id: "r-variety", cat: "Language", w: 1, status: rep.length ? "warn" : "pass",
      title: rep.length ? `Repeated opening verb: ${rep.join(", ")}` : "Good variety of opening verbs",
      detail: rep.length ? "Swap a few for alternatives from the verb bank on the Tips page." : "No verb starts more than two bullets." });
  }

  // Weak phrases
  const weakFound = WEAK_PHRASES.filter(([re]) => (t.match(re) || []).length).map(([, l]) => l);
  C.push({ id: "r-weak", cat: "Language", w: 2, status: weakFound.length === 0 ? "pass" : weakFound.length <= 2 ? "warn" : "fail",
    title: weakFound.length ? `Weak phrasing: ${weakFound.join(", ")}` : "No weak, duty-style phrasing",
    detail: weakFound.length ? "These describe duties, not results. Replace with what you did and what changed." : "You describe what you did, not what you were assigned." });

  const cl = countCliches(t);
  C.push({ id: "r-cliche", cat: "Language", w: 2, status: cl.length === 0 ? "pass" : cl.length <= 2 ? "warn" : "fail",
    title: cl.length ? `Clichés: ${list(cl)}` : "No clichés or buzzwords", detail: cl.length ? "Recruiters skim past these. Show the quality through a result instead." : "Your language is specific." });

  const pron = (t.match(/\bI\b|\b(me|my|myself)\b/gi) || []).length;
  C.push({ id: "r-pronoun", cat: "Language", w: 1, status: pron <= 2 ? "pass" : pron <= 6 ? "warn" : "fail",
    title: pron ? `"I", "me" or "my" used ${pron} time${pron > 1 ? "s" : ""}` : "No first-person pronouns", detail: pron > 2 ? "Resumes use implied first person. Write \"Led a team…\" not \"I led a team…\"." : "Written in the standard implied first person." });

  const typos = findTypos(t);
  C.push({ id: "r-typo", cat: "Language", w: 1, status: typos.length ? "fail" : "pass",
    title: typos.length ? `Possible misspelling: ${typos.join(", ")}` : "No common misspellings found",
    detail: typos.length ? typos.map(w => `${w} → ${MISSPELL[w]}`).join("; ") + ". One typo can sink an application." : "We check a list of frequent resume typos. Still run a full spell-check." });

  // Leave off
  const offs = [
    [/\b(date of birth|d\.?o\.?b\.?|born on|birth ?date)\b/i, "date of birth"], [/\bmarital status\b|\b(married|divorced|widowed)\b/i, "marital status"],
    [/\b(social security|ssn)\b/i, "Social Security number"], [/\bage\s*:\s*\d|\b\d{2} years old\b/i, "age"],
    [/\breferences (are )?available (up)?on request\b/i, "\"References available upon request\""], [/^\s*objective\b/im, "objective statement"],
    [/\bsalary (history|expectations?|requirements?)\b/i, "salary details"], [/\b(religion|nationality|gender)\s*:/i, "personal demographics"],
    [/\bhigh school\b/i, "high school"]
  ].filter(([re]) => re.test(t)).map(([, l]) => l);
  const hasDegree = /\b(b\.?a\.?|b\.?s\.?|bachelor|master|m\.?s\.?|mba|associate|ph\.?d)\b/i.test(t);
  const allOff = offs.filter(o => o !== "high school" || hasDegree);
  const offF = allOff.filter(o => o !== "high school" && o !== "objective statement");
  const offTip = allOff.filter(o => o === "high school" || o === "objective statement");
  if (offTip.length) C.push({ id: "r-objective", cat: "Content", w: 0, status: "warn", title: `Consider removing: ${offTip.join(", ")}`, detail: "Common career-center advice: a summary of what you offer beats an objective, and high school can go once you have a degree. Not scored." });
  C.push({ id: "r-leaveoff", cat: "Content", w: 2, status: offF.length === 0 ? "pass" : offF.length === 1 ? "warn" : "fail",
    title: offF.length ? `Take off: ${offF.join(", ")}` : "No personal details or outdated sections",
    detail: offF.length ? "These waste space or invite bias. See the Leave off list on the Tips page." : "Nothing that should be left off." });

  const years = (t.match(/\b(19[89]\d|20[0-3]\d)\b/g) || []).length + (/\bpresent\b/i.test(t) ? 1 : 0);
  C.push({ id: "r-dates", cat: "Content", w: 1, status: years >= 2 ? "pass" : "warn",
    title: years >= 2 ? "Roles have dates" : "Add dates to your roles", detail: years >= 2 ? "Use the same format throughout, like Jun 2021 – Present." : "Missing dates make recruiters assume the worst. Add Mon YYYY – Mon YYYY." });

  const summary = /\b(summary|profile|about)\b/i.test(t);
  C.push({ id: "r-summary", cat: "Content", w: 1, status: summary ? "pass" : "warn",
    title: summary ? "Has a summary" : "Consider a short summary", detail: summary ? "Make sure it is tailored to this specific role." : "Two or three lines under your name: title, top result, key skills from the posting." });

  C.push(keywordCheck(t, job, 0.65, 0.4, "r-keywords"));
  if (role && role.trim()) { const ok = new RegExp(role.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(t); C.push({ id: "r-title", cat: "Keywords", w: 1, status: ok ? "pass" : "warn", title: ok ? "Uses the exact job title" : "Doesn't use the posting's job title", detail: ok ? "Recruiters often search by title." : `Add "${esc(role.trim())}" where it's honest, for example in your summary. Recruiters often search by job title.` }); }
  C.push(...fieldChecks(t));
  { const A = aiSignals(t); if (A.level !== "Few") C.push({ id: "x-ai", cat: "Language", w: 0, skip: true, status: "warn", title: `Some phrasing sounds AI-written (${A.finds.length} phrase${A.finds.length === 1 ? "" : "s"})`, detail: "Recruiters notice generic AI phrasing. Swap stock phrases for the specific thing you did.", html: false }); }
  return C.map(withRubric);
}

function gradeLetter(t, job, company, role) {
  const C = [];
  const words = (t.match(/\S+/g) || []).length;
  const paras = t.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const body = paras.filter(p => (p.match(/\S+/g) || []).length > 12);
  const sentences = t.replace(/\n/g, " ").split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 3);

  C.push({ id: "l-length", cat: "Format", w: 3, status: words >= 220 && words <= 420 ? "pass" : (words >= 140 && words < 220) || (words > 420 && words <= 550) ? "warn" : "fail",
    title: `${words} words`, detail: words < 220 ? "A little short to make your case. Add one specific proof story with a result." : words > 420 ? "Long letters get skimmed. Aim for 250–400 words on one page." : "Right in the 250–400 word range." });

  C.push({ id: "l-paragraphs", cat: "Format", w: 2, status: body.length >= 3 && body.length <= 4 ? "pass" : body.length === 2 || body.length === 5 ? "warn" : "fail",
    title: `${body.length} body paragraph${body.length === 1 ? "" : "s"}`, detail: body.length < 2 ? "Break it into 3–4 short paragraphs separated by a blank line: hook, proof, proof, ask." : body.length >= 3 && body.length <= 4 ? "Easy to skim." : "Three or four short paragraphs is the sweet spot." });

  const head = paras.find(p => /^(dear|to whom|hello|hi)\b/i.test(p)) || paras[0] || "";
  const generic = /to whom it may concern|dear sir or madam|dear sir\/madam|dear sirs/i.test(head);
  const team = /dear [\w\s]*(hiring|recruit|team|committee)/i.test(head);
  const named = /^dear\s+(mr|ms|mrs|mx|dr|prof)\.?\s+\S|^dear\s+[^\s,]+(\s+[^\s,]+)?,/im.test(head) && !team && !generic;
  C.push({ id: "l-greeting", cat: "Content", w: 2, status: named || team ? "pass" : "fail",
    title: named ? "Addressed to a person" : team ? "Addressed to a team" : generic ? "Generic greeting" : "No greeting found",
    detail: named ? "A named greeting shows you did your homework." : team ? "\"Dear Hiring Manager\" is the accepted fallback. A real name is better: check LinkedIn or the company site." : "Replace with \"Dear [Name],\" or \"Dear [Company] Hiring Team,\"." });

  const opener = (body[0] || "").slice(0, 200);
  const flat = /^my name is/i.test(opener);
  C.push({ id: "l-opener", cat: "Impact", w: 2, status: flat ? "warn" : "pass",
    title: flat ? "Opens with \"My name is\"" : "Opening gets to the point",
    detail: flat ? "Your name is already in the signature. Use the first lines to name the role and show you've researched the company." : "Name the role early and show you've researched the company." });

  if (company.trim()) {
    const re = new RegExp(company.trim().split(/\s+/)[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    const n = (t.match(re) || []).length;
    C.push({ id: "l-company", cat: "Content", w: 3, status: n >= 2 ? "pass" : n === 1 ? "warn" : "fail",
      title: `Company named ${n} time${n === 1 ? "" : "s"}`, detail: n >= 2 ? "Shows this letter was written for them." : n === 1 ? "Mention them once more, ideally tied to something specific about them." : `"${esc(company)}" never appears. This reads like a form letter.` });
  } else {
    const yc = (t.match(/\byour (company|organization|firm|business)\b/gi) || []).length;
    C.push({ id: "l-company", cat: "Content", w: 3, status: yc ? "fail" : "warn", title: yc ? "Says \"your company\" instead of a name" : "Enter the company name above to check it",
      detail: yc ? "Name the company. \"Your company\" signals a copy-paste letter." : "We'll check that the letter names the company at least twice." });
  }
  if (role.trim()) {
    const ok = new RegExp(role.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(t);
    C.push({ id: "l-role", cat: "Content", w: 2, status: ok ? "pass" : "fail", title: ok ? "Names the job title" : "Doesn't name the job title",
      detail: ok ? "Clear about which role you want." : `Mention "${esc(role)}" in the first paragraph. Recruiters often hire for several roles.` });
  }

  const nums = (t.match(/\d+%|\$\d|\b\d[\d,.]*\b/g) || []).length;
  C.push({ id: "l-numbers", cat: "Impact", w: 3, status: nums >= 2 ? "pass" : nums === 1 ? "warn" : "fail",
    title: nums ? `${nums} specific number${nums > 1 ? "s" : ""}` : "No specific results", detail: nums >= 2 ? "Concrete evidence beats adjectives." : "Add at least one proof story with a measurable result: %, $, count or time." });

  const iStarts = sentences.filter(s => /^I\b/.test(s.trim())).length;
  const ir = sentences.length ? iStarts / sentences.length : 0;
  C.push({ id: "l-i", cat: "Language", w: 2, status: ir < 0.35 ? "pass" : ir < 0.5 ? "warn" : "fail",
    title: `${Math.round(ir * 100)}% of sentences start with "I"`, detail: ir < 0.35 ? "Good variety. The letter isn't all about you." : "Vary your openings: lead with the company, the result or the situation." });

  const tail = paras.slice(-3).join(" ");
  const cta = /(look forward|would welcome|welcome the (chance|opportunity)|discuss|conversation|interview|speak with|talk (with|about)|meet|call)/i.test(tail);
  C.push({ id: "l-ask", cat: "Impact", w: 2, status: cta ? "pass" : "fail", title: cta ? "Ends with a clear ask" : "No closing ask",
    detail: cta ? "You ask for the next step." : "End with a specific, confident ask: \"I'd welcome the chance to discuss…\"" });

  const sign = /(sincerely|best regards|kind regards|warm regards|regards|respectfully|thank you,|best,)/i.test(tail);
  C.push({ id: "l-signoff", cat: "Format", w: 1, status: sign ? "pass" : "warn", title: sign ? "Has a professional sign-off" : "Add a sign-off",
    detail: sign ? "Follow it with your full name and contact details." : "Close with \"Sincerely,\" or \"Best regards,\" and your full name." });

  const cl = countCliches(t);
  C.push({ id: "l-cliche", cat: "Language", w: 2, status: cl.length === 0 ? "pass" : cl.length <= 1 ? "warn" : "fail",
    title: cl.length ? `Clichés: ${list(cl)}` : "No clichés", detail: cl.length ? "Replace each with a one-sentence example that proves it." : "Specific and fresh." });

  const neg = [[/\b(hated|toxic|terrible boss|bad boss|fired|let go)\b/i, "negativity about past jobs"], [/\bsalary\b|\bcompensation\b/i, "salary"], [/\b(don't have much experience|lack of experience|although i (don't|do not) have|i know i (don't|do not))/i, "apologizing for experience"], [/\b(desperate|need this job|any position)\b/i, "sounding desperate"], [/\bas you can see (on|in|from) my resume\b/i, "repeating your resume"]].filter(([re]) => re.test(t)).map(([, l]) => l);
  const tone = neg.filter(n => ["negativity about past jobs", "apologizing for experience", "sounding desperate"].includes(n));
  if (tone.length) C.push({ id: "l-tone", cat: "Content", w: 0, status: "warn", title: `Tone: ${tone.join(", ")}`, detail: "Keep it positive and lead with strengths. Common advice, not scored." });
  neg.splice(0, neg.length, ...neg.filter(n => !tone.includes(n)));
  C.push({ id: "l-leaveout", cat: "Content", w: 2, status: neg.length === 0 ? "pass" : neg.length === 1 ? "warn" : "fail",
    title: neg.length ? `Leave out: ${neg.join(", ")}` : "Nothing that should be left out", detail: neg.length ? "Keep the letter positive and forward-looking." : "Positive and focused." });

  const typos = findTypos(t);
  C.push({ id: "l-typo", cat: "Language", w: 1, status: typos.length ? "fail" : "pass", title: typos.length ? `Possible misspelling: ${typos.join(", ")}` : "No common misspellings found",
    detail: typos.length ? typos.map(w => `${w} → ${MISSPELL[w]}`).join("; ") : "Still read it aloud before sending." });

  C.push(keywordCheck(t, job, 0.45, 0.25, "l-keywords"));
  { const A = aiSignals(t); if (A.level !== "Few") C.push({ id: "x-ai", cat: "Language", w: 0, skip: true, status: "warn", title: `Some phrasing sounds AI-written (${A.finds.length} phrase${A.finds.length === 1 ? "" : "s"})`, detail: "Recruiters notice generic AI phrasing. Swap stock phrases for the specific thing you did.", html: false }); }
  return C.map(withRubric);
}

const VAL = { pass: 1, warn: 0.5, fail: 0 };
const SRC = {
  pepperdine: { name: "Pepperdine Health Sciences Career Services: Nursing resumes", short: "Pepperdine", type: "University career center", url: "https://healthscience.pepperdine.edu/career-services/resumes/nursing.htm", note: "License status and BLS/ACLS/PALS at the top, clinical rotations with unit, hospital and hours, EMR and clinical hard skills, clinical action verbs." },
  cornellcs: { name: "Cornell Career Services: Entry-level software engineer resume", short: "Cornell Career", type: "University career center", url: "https://career.cornell.edu/blog/2026/01/21/entry-level-software-engineer-resume-what-recruiters-want-to-see/", note: "GitHub in the header, projects as a main section, tech stack named in each bullet, grouped technical skills, one page, tailored keywords." },
  uni: { name: "University of Northern Iowa Career Services: Teacher resume basics", short: "UNI Careers", type: "University career center", url: "https://careerservices.uni.edu/sites/default/files/teacher_resume_basics.pdf", note: "Certifications and licensure with education, student teaching as the most weighted section with school, grade level and dates, 1–2 full pages." },
  unl: { name: "University of Nebraska–Lincoln Business Career Center: Résumé how-to for accounting", short: "UNL Business", type: "University career center", url: "https://business.unl.edu/business-career-center/resume-how-accounting/", note: "Accurate major and cumulative GPA, a stated plan to reach 150 credit hours for the CPA, relevant coursework by name." },
  binghamton: { name: "Binghamton University Fleishman Center: Online portfolio guide", short: "Binghamton", type: "University career center", url: "https://careertools.binghamton.edu/resources/online-portfolio-resource-updated-summer-2025/", note: "Portfolio URL in your contact section, test it opens for outside viewers, a few strong pieces, caption each with client, goal, role and date." },
  wvjs: { name: "West Virginia Jumpstart: Resume guide for skilled trade workers", short: "WV Jumpstart", type: "State workforce program", url: "https://wvjumpstart.gov/what-is-jumpstart/blog/mastering-your-resume-a-guide-for-skilled-trade-workers", note: "List licenses and certifications with issuing body, include apprenticeships and vocational training, clear technical skills, achievements over duties." },
  harvard: { name: "Harvard Mignone Center: Resumes and cover letters", short: "Harvard", type: "University career center", url: "https://careerservices.fas.harvard.edu/resources/hes-create-impactful-resumes-and-cover-letters/", note: "Action verbs, no personal pronouns, quantify results, no photo/age/gender, cover letter to a named person, one page, don't overuse \"I\", don't restate the resume." },
  mit: { name: "MIT Career Advising & Professional Development: Resumes", short: "MIT CAPD", type: "University career center", url: "https://capd.mit.edu/resources/resumes/", note: "Start with strong action verbs, accomplishments over duties, quantify results, no first-person pronouns, one page, keyword scanning, leave off age/religion/marital status/photos/salary/references, proofread." },
  purdue: { name: "Purdue OWL: Action verbs in employment documents", short: "Purdue OWL", type: "University writing lab", url: "https://owl.purdue.edu/owl/job_search_writing/preparing_an_application/action_verbs_to_describe_skills_jobs_and_accomplishments_in_employment_documents/index.html", note: "Use an action verb as the first word of each bullet; avoid forms of \"to be\" (\"Was the boss of…\" → \"Supervised…\")." },
  vcu: { name: "VCU Career Services: Cover letter guide", short: "VCU Careers", type: "University career center", url: "https://careers.vcu.edu/media/vcu-careers/docs/guides/FullTimeCoverLetterGuide2018.pdf", note: "One page, three to four paragraphs, find the recipient's name or use \"Dear Hiring Manager\", 2–3 skills from the posting with quantified examples, don't rehash the resume, close by asking for an interview, proofread." },
  ladders: { name: "Ladders eye-tracking study, 2018 (via HR Dive)", short: "Ladders study", type: "Research", url: "https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582", note: "Recruiters' first screen averaged 7.4 seconds. Clear sections, headings, bold titles and bulleted accomplishments held attention; multiple columns, clutter and long sentences hurt." },
  nace: { name: "NACE Job Outlook 2026: High-impact skills", short: "NACE 2026", type: "Employer survey", url: "https://naceweb.org/about-us/press/2026/the-high-impact-skills-college-students-should-showcase-on-their-resumes", note: "Employers want teamwork, problem-solving and communication; \"Employers want to see examples\", not just a list of skills; match skills to the job description." },
  resumego: { name: "ResumeGo cover letter field experiment", short: "ResumeGo study", type: "Research (vendor-run)", url: "https://resumego.net/research/cover-letters", note: "7,287 applications: tailored letters got 53% more callbacks than none; 81% of 236 hiring professionals valued tailored letters over generic ones. ResumeGo sells resume services." },
  eeoc: { name: "U.S. EEOC: Prohibited employment practices", short: "EEOC", type: "Government", url: "https://www.eeoc.gov/prohibited-employment-policiespractices", note: "Employers may not base decisions on age, religion, sex, national origin and other protected traits, which is why those details don't belong on a resume." },
  xyz: { name: "Google's X-Y-Z formula (Inc., via UT Law)", short: "X-Y-Z formula", type: "Recruiting practice", url: "https://law.utexas.edu/wp-content/uploads/sites/44/2020/09/Google-Recruiters-Say-Using-the-X-Y-Z-Formula-on-Your-Resume-Will-Improve-Your-Odds-of-Getting-Hired-at-Google-_-Inc.com_.pdf", note: "\"Accomplished X as measured by Y by doing Z\": every bullet shows a measurable result." },
  jobscan: { name: "Jobscan ATS resume checker", short: "Jobscan", type: "Industry grader", url: "https://jobscan.co/ats-resume-checker", note: "Scores contact info, sections, date formatting, hard and soft skills, measurable results, word count, spelling, job title match and formatting. Recommends a 75%+ match on its own scale." },
  linkedin: { name: "LinkedIn: How to be an All-Star with your profile", short: "LinkedIn", type: "LinkedIn (official)", url: "https://blog.linkedin.com/2017/april/25/tuesday-tips-how-to-be-an-all-star-with-your-linkedin-profile", note: "A photo brings up to 21x more profile views, a current position up to 8x, listing your industry up to 9x, and education up to 17x more recruiter messages. Summary, location and skills help you get found. Figures are LinkedIn's own, from 2017." },
  uw: { name: "University of Washington Career & Internship Center: LinkedIn checklist", short: "UW Career Center", type: "University career center", url: "https://careers.uw.edu/resources/linkedin-profile-checklist/", note: "Recent photo, background photo, a customized headline, custom URL short enough for a resume, About covering your skills with examples and what you're looking for, all experience, and as many relevant skills as possible since recruiters search by them." },
  ttu: { name: "Texas Tech University Career Center: LinkedIn handout (2026)", short: "Texas Tech", type: "University career center", url: "https://www.depts.ttu.edu/careercenter/International_resources/LinkedIn_Handout_Updated_2026.pdf", note: "Descriptive headline, About in first person with short paragraphs, linkedin.com/in/yourname, 10–20 skills, quantified experience, keywords from job postings, and at least 50 connections." },
  villanova: { name: "Villanova University Career Center: LinkedIn guide", short: "Villanova", type: "University career center", url: "https://connections.villanova.edu/resources/linkedin-guide/", note: "Approachable photo, an engaging headline, a professional but personal About, experience with accomplishments, skills, recommendations from people who know your work, and a custom URL." },
  jobscanli: { name: "Jobscan LinkedIn Optimization", short: "Jobscan LinkedIn", type: "Industry grader", url: "https://www.jobscan.co/linkedin-optimization-guide", note: "Compares your profile to job descriptions. Checks photo, background, location, industry, Open to Work, headline length and tailoring, summary length, tone and measurable results, experience dates and titles, key skills, education, vanity URL and connections." },
  rw: { name: "Resume Worded score guide", short: "Resume Worded", type: "Industry grader", url: "https://resumeworded.com/score-guide", note: "20+ checks in Impact (quantified results, action verbs), Brevity and Style; 90–100 exceptional, 80–84 solid." }
};
const RUBRIC = {
  "f-nurse-license":   { doc: "Resume", name: "Nursing: license status", looks: "RN/LPN license or NCLEX date near the top (only when Nursing is chosen)", w: 2, src: ["pepperdine"] },
  "f-nurse-cert":      { doc: "Resume", name: "Nursing: certifications", looks: "BLS, ACLS, PALS or similar listed", w: 2, src: ["pepperdine"] },
  "f-nurse-clinical":  { doc: "Resume", name: "Nursing: clinical rotations", looks: "Clinical experience with hours", w: 2, src: ["pepperdine"] },
  "f-nurse-emr":       { doc: "Resume", name: "Nursing: EMR systems", looks: "Epic, Cerner or another EMR named", w: 2, src: ["pepperdine"] },
  "f-tech-github":     { doc: "Resume", name: "Tech: code link", looks: "GitHub or GitLab link (only when Software & tech is chosen)", w: 2, src: ["cornellcs"] },
  "f-tech-projects":   { doc: "Resume", name: "Tech: projects section", looks: "A Projects heading", w: 2, src: ["cornellcs"] },
  "f-tech-stack":      { doc: "Resume", name: "Tech: stack in bullets", looks: "40%+ of bullets name a language, framework or tool", w: 2, src: ["cornellcs"] },
  "f-teach-cert":      { doc: "Resume", name: "Teaching: certification", looks: "Certification, license or endorsement listed (only when Teaching is chosen)", w: 2, src: ["uni"] },
  "f-teach-student":   { doc: "Resume", name: "Teaching: teaching experience", looks: "Student teaching, practicum or teaching experience section", w: 2, src: ["uni"] },
  "f-teach-grade":     { doc: "Resume", name: "Teaching: grade levels", looks: "Grade levels or school level stated", w: 2, src: ["uni"] },
  "f-acct-gpa":        { doc: "Resume", name: "Accounting: GPA", looks: "GPA listed (only when Accounting & finance is chosen)", w: 2, src: ["unl"] },
  "f-acct-cpa":        { doc: "Resume", name: "Accounting: CPA plan", looks: "CPA or 150-hour plan stated", w: 2, src: ["unl"] },
  "f-acct-course":     { doc: "Resume", name: "Accounting: coursework", looks: "Relevant coursework listed", w: 2, src: ["unl"] },
  "f-creative-portfolio": { doc: "Resume", name: "Creative: portfolio link", looks: "Portfolio URL in the top quarter (only when Design, marketing & creative is chosen)", w: 2, src: ["binghamton"] },
  "f-creative-tools":  { doc: "Resume", name: "Creative: tools named", looks: "Figma, Adobe, Canva or similar named", w: 2, src: ["binghamton"] },
  "f-trades-license":  { doc: "Resume", name: "Trades: licenses and certifications", looks: "License, certification, OSHA or journeyman credential (only when Skilled trades is chosen)", w: 2, src: ["wvjs"] },
  "f-trades-training": { doc: "Resume", name: "Trades: training", looks: "Apprenticeship, trade school or vocational training listed", w: 2, src: ["wvjs"] },
  "r-contact":   { doc: "Resume", name: "Contact details", looks: "Email and phone in the body of the page", w: 3, src: ["harvard", "jobscan"] },
  "r-sections":  { doc: "Resume", name: "Standard sections", looks: "Experience (or Projects), Education and Skills headings", w: 3, src: ["ladders", "jobscan"] },
  "r-length":    { doc: "Resume", name: "Length", looks: "About 300–850 words, roughly one to two pages", w: 2, src: ["mit", "jobscan"] },
  "r-bullets":   { doc: "Resume", name: "Bulleted experience", looks: "At least 6 bullet points instead of paragraphs", w: 2, src: ["ladders", "purdue"] },
  "r-bulletlen": { doc: "Resume", name: "Bullet length", looks: "Bullets under about 30 words", w: 1, src: ["ladders", "rw"] },
  "r-verbs":     { doc: "Resume", name: "Action verbs", looks: "70%+ of bullets start with an action verb", w: 3, src: ["purdue", "mit", "harvard", "rw"] },
  "r-numbers":   { doc: "Resume", name: "Measurable results", looks: "40%+ of bullets include a number, %, or $", w: 3, src: ["mit", "harvard", "xyz", "rw", "jobscan"] },
  "r-weak":      { doc: "Resume", name: "Accomplishments, not duties", looks: "No \"responsible for\", \"duties included\", \"helped with\" and similar", w: 2, src: ["mit", "purdue"] },
  "r-cliche":    { doc: "Resume", name: "Specific language", looks: "No unproven buzzwords like \"team player\" or \"hard worker\"", w: 2, src: ["nace", "harvard"] },
  "r-pronoun":   { doc: "Resume", name: "No personal pronouns", looks: "\"I\", \"me\", \"my\" used 2 times or fewer", w: 1, src: ["harvard", "mit"] },
  "r-typo":      { doc: "Resume", name: "Spelling", looks: "No common resume misspellings", w: 2, src: ["mit", "jobscan"] },
  "r-leaveoff":  { doc: "Resume", name: "Personal details left off", looks: "No birth date, age, marital status, ID numbers, salary or \"references available\"", w: 2, src: ["mit", "harvard", "eeoc"] },
  "r-dates":     { doc: "Resume", name: "Dates on roles", looks: "Years or \"Present\" shown for roles", w: 1, src: ["jobscan", "harvard"] },
  "r-keywords":  { doc: "Resume", name: "Job posting keywords", looks: "65%+ of the posting's top terms (related words count partly)", w: 4, src: ["mit", "jobscan", "nace"] },
  "r-title":     { doc: "Resume", name: "Job title match", looks: "The posting's exact job title appears", w: 1, src: ["jobscan"] },
  "r-variety":   { doc: "Resume", name: "Verb variety", looks: "No verb starts more than two bullets", w: 0, src: ["purdue"] },
  "r-summary":   { doc: "Resume", name: "Summary", looks: "A short summary section", w: 0, src: [] },
  "r-objective": { doc: "Resume", name: "Objective / high school", looks: "Objective statements; high school listed next to a degree", w: 0, src: [] },
  "r-email":     { doc: "Resume", name: "Professional email", looks: "Email address based on your name", w: 0, src: [] },
  "l-length":    { doc: "Cover letter", name: "One page", looks: "About 220–420 words", w: 3, src: ["harvard", "vcu"] },
  "l-paragraphs":{ doc: "Cover letter", name: "Paragraphs", looks: "Three to four body paragraphs", w: 2, src: ["vcu"] },
  "l-greeting":  { doc: "Cover letter", name: "Greeting", looks: "A named person, or \"Dear Hiring Manager\" as a fallback", w: 2, src: ["harvard", "vcu"] },
  "l-opener":    { doc: "Cover letter", name: "Opening", looks: "Doesn't open with \"My name is\"", w: 1, src: ["harvard", "vcu"] },
  "l-company":   { doc: "Cover letter", name: "Tailored to the company", looks: "Company named at least twice", w: 3, src: ["resumego", "vcu", "harvard"] },
  "l-role":      { doc: "Cover letter", name: "Names the position", looks: "Job title appears", w: 2, src: ["harvard", "vcu"] },
  "l-numbers":   { doc: "Cover letter", name: "Quantified examples", looks: "At least 2 specific numbers", w: 3, src: ["vcu", "harvard"] },
  "l-i":         { doc: "Cover letter", name: "Not every sentence starts with \"I\"", looks: "Under 35% of sentences start with \"I\"", w: 2, src: ["harvard"] },
  "l-ask":       { doc: "Cover letter", name: "Closing ask", looks: "Asks for an interview or conversation", w: 2, src: ["vcu", "harvard"] },
  "l-signoff":   { doc: "Cover letter", name: "Sign-off", looks: "\"Sincerely,\" or similar", w: 1, src: ["harvard"] },
  "l-cliche":    { doc: "Cover letter", name: "No flowery clichés", looks: "No buzzwords like \"passionate\" or \"fast learner\"", w: 1, src: ["harvard"] },
  "l-leaveout":  { doc: "Cover letter", name: "Doesn't rehash the resume or raise salary", looks: "No \"as you can see on my resume\" or salary talk", w: 2, src: ["vcu", "harvard", "mit"] },
  "l-typo":      { doc: "Cover letter", name: "Spelling", looks: "No common misspellings", w: 2, src: ["vcu"] },
  "l-keywords":  { doc: "Cover letter", name: "Skills from the posting", looks: "45%+ of the posting's top terms", w: 3, src: ["vcu", "harvard", "resumego"] },
  "l-tone":      { doc: "Cover letter", name: "Positive tone", looks: "No apologizing, negativity or desperation", w: 0, src: [] },
  "li-photo":       { doc: "LinkedIn", name: "Profile photo", looks: "A professional photo is on the profile", w: 3, src: ["linkedin", "uw", "ttu", "villanova", "jobscanli"] },
  "li-headline":    { doc: "LinkedIn", name: "Headline", looks: "40–220 characters, more than a bare title or \"Student\"", w: 3, src: ["uw", "ttu", "villanova", "jobscanli"] },
  "li-about":       { doc: "LinkedIn", name: "About section", looks: "100+ words and under LinkedIn's 2,600-character limit", w: 3, src: ["uw", "villanova", "linkedin", "jobscanli"] },
  "li-experience":  { doc: "LinkedIn", name: "Experience entries", looks: "Roles with dates and descriptions", w: 3, src: ["uw", "villanova", "jobscanli"] },
  "li-keywords":    { doc: "LinkedIn", name: "Keywords from target jobs", looks: "60%+ of the postings' top terms across your profile", w: 4, src: ["ttu", "jobscanli"] },
  "li-skills":      { doc: "LinkedIn", name: "Skills", looks: "10 or more skills listed", w: 2, src: ["ttu", "uw", "jobscanli"] },
  "li-exp-numbers": { doc: "LinkedIn", name: "Quantified experience", looks: "At least 2 numbers in your experience", w: 2, src: ["ttu", "villanova"] },
  "li-current":     { doc: "LinkedIn", name: "Current position", looks: "A role marked Present, or education listed", w: 2, src: ["linkedin"] },
  "li-locind":      { doc: "LinkedIn", name: "Location and industry", looks: "Both set on the profile", w: 2, src: ["linkedin", "jobscanli"] },
  "li-results":     { doc: "LinkedIn", name: "Results in About", looks: "At least one number in About", w: 1, src: ["jobscanli"] },
  "li-voice":       { doc: "LinkedIn", name: "First-person About", looks: "Written as \"I…\", not third person", w: 1, src: ["ttu"] },
  "li-goal":        { doc: "LinkedIn", name: "What you're looking for", looks: "About says what you want next or invites contact", w: 1, src: ["uw"] },
  "li-title":       { doc: "LinkedIn", name: "Target title in headline", looks: "Your target job title appears in the headline", w: 1, src: ["jobscanli"] },
  "li-url":         { doc: "LinkedIn", name: "Custom URL", looks: "linkedin.com/in/yourname without random characters", w: 1, src: ["uw", "ttu", "villanova", "jobscanli"] },
  "li-banner":      { doc: "LinkedIn", name: "Background banner", looks: "Banner replaced with your own image", w: 1, src: ["uw", "jobscanli"] },
  "li-education":   { doc: "LinkedIn", name: "Education", looks: "Education section filled in", w: 1, src: ["linkedin", "uw", "jobscanli"] },
  "li-connections": { doc: "LinkedIn", name: "Connections", looks: "At least 50 connections", w: 1, src: ["ttu", "jobscanli"] },
  "li-recs":        { doc: "LinkedIn", name: "Recommendations", looks: "At least one recommendation received", w: 1, src: ["villanova"] },
  "li-hook":        { doc: "LinkedIn", name: "Opening before \"see more\"", looks: "About opens with your value, not your name", w: 0, src: [] },
  "li-cliche":      { doc: "LinkedIn", name: "Buzzwords", looks: "No \"passionate\", \"results-driven\" and similar", w: 0, src: [] },
  "li-open":        { doc: "LinkedIn", name: "Open to Work", looks: "Turned on while job hunting (can be recruiters only)", w: 0, src: ["jobscanli"] }
};
const GRADERS = {
  "r-contact": ["Jobscan"], "r-sections": ["Jobscan"], "r-length": ["Jobscan", "Resume Worded"], "r-bulletlen": ["Resume Worded"], "r-verbs": ["Resume Worded"],
  "r-numbers": ["Jobscan", "Resume Worded"], "r-weak": ["Resume Worded"], "r-cliche": ["Jobscan"], "r-typo": ["Jobscan"], "r-dates": ["Jobscan"],
  "r-keywords": ["Jobscan"], "r-title": ["Jobscan"],
  "li-photo": ["Jobscan", "Careerflow", "Teal"], "li-headline": ["Jobscan", "Resume Worded", "Careerflow", "Teal"], "li-about": ["Jobscan", "Resume Worded", "Careerflow", "Teal"],
  "li-experience": ["Jobscan", "Resume Worded", "Careerflow", "Teal"], "li-keywords": ["Jobscan", "Resume Worded"], "li-skills": ["Jobscan", "Careerflow", "Teal"],
  "li-locind": ["Jobscan"], "li-results": ["Jobscan"], "li-title": ["Jobscan"], "li-url": ["Jobscan", "Careerflow", "Teal"], "li-banner": ["Jobscan", "Careerflow", "Teal"],
  "li-education": ["Jobscan"], "li-connections": ["Jobscan"], "li-open": ["Jobscan"]
};
function withRubric(c) {
  const r = RUBRIC[c.id]; if (!r) return c;
  c.src = r.src;
  if (!c.skip) { c.w = r.w; if (!r.w) c.skip = true; }
  return c;
}
function sourceFor(c) { return (c.src || []).map(k => [SRC[k].short, SRC[k].url]); }
const CATS = ["Content", "Impact", "Format", "Language", "Keywords"];
let mode = "resume", filter = "issues";

function grade() {
  const t = $("#resumeText").value;
  const job = $("#jobText").value;
  if (!t.trim()) {
    $("#scoreNum").innerHTML = `–<small>/100</small>`; $("#gradeLetter").textContent = "?";
    $("#verdictTitle").textContent = "Paste something to grade"; $("#verdictText").textContent = "Or load a sample to see how it works.";
    $("#cats").innerHTML = ""; $("#checks").innerHTML = ""; renderMarkup(); return;
  }
  if (!Object.values(SAMPLES).includes(t)) store.set("rp-grade", { mode, text: t, job, company: $("#companyName").value, role: $("#roleName").value });
  const checks = mode === "resume" ? gradeResume(t, job, $("#roleName").value) : gradeLetter(t, job, $("#companyName").value, $("#roleName").value);
  const scored = checks.filter(c => !c.skip && c.w);
  const tw = scored.reduce((s, c) => s + c.w, 0);
  const score = Math.round(scored.reduce((s, c) => s + c.w * VAL[c.status], 0) / tw * 100);
  const letter = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const verdicts = { A: ["Ready to send", "Polish anything flagged and have one person proofread."], B: ["Close", "A few targeted fixes will make this stand out."], C: ["Solid start", "Work through the fixes below, starting with red ones."], D: ["Needs work", "Focus on results, numbers and removing filler."], F: ["Major revision needed", "Start from a template and use the fixes below as a guide."] };
  $("#scoreNum").innerHTML = `${score}<small>/100</small>`;
  $("#gradeLetter").textContent = letter;
  $("#verdictTitle").textContent = verdicts[letter][0];
  $("#verdictText").textContent = verdicts[letter][1];

  $("#cats").innerHTML = CATS.map(cat => {
    const cs = scored.filter(c => c.cat === cat);
    if (!cs.length) return `<div class="cat"><span>${cat}</span><div class="bar"><i style="width:0"></i></div><span class="v">n/a</span></div>`;
    const w = cs.reduce((s, c) => s + c.w, 0);
    const v = Math.round(cs.reduce((s, c) => s + c.w * VAL[c.status], 0) / w * 100);
    return `<div class="cat"><span>${cat}</span><div class="bar"><i style="width:${v}%"></i></div><span class="v">${v}</span></div>`;
  }).join("");

  const order = { fail: 0, warn: 1, pass: 2 };
  let shown = [...checks].sort((a, b) => order[a.status] - order[b.status] || b.w - a.w);
  if (filter === "issues") { const issues = shown.filter(c => c.status !== "pass"); shown = issues.length ? issues : shown; }
  $("#checks").innerHTML = shown.map(c => `<li><span class="chip ${c.skip ? "warn" : c.status}">${c.skip ? (c.w === 0 && c.id !== "r-keywords" && c.id !== "l-keywords" ? "tip" : "tip") : c.status === "pass" ? "good" : c.status === "warn" ? "fix" : "fix!"}</span><div><h2 class="ck">${esc(c.title)}</h2><p>${c.html ? c.detail : esc(c.detail)}</p><p class="src">${sourceFor(c).length ? "Based on: " : "Common advice, not scored"}${sourceFor(c).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join(" · ")}</p></div></li>`).join("");
  renderMarkup();
}

function setMode(m) {
  mode = m;
  $("#modeResume").setAttribute("aria-pressed", m === "resume");
  $("#modeLetter").setAttribute("aria-pressed", m === "letter");
  $("#letterFields").hidden = false; $("#companyWrap").hidden = m !== "letter";
  $("#docLabel").textContent = m === "resume" ? "Your resume (plain text)" : "Your cover letter (plain text)";
}
function loadSample(kind) {
  MK.history = []; MK.dismissed.clear(); MK.active = null;
  const isLetter = kind.includes("Letter");
  setMode(isLetter ? "letter" : "resume");
  $("#resumeText").value = SAMPLES[kind];
  $("#jobText").value = SAMPLES.job;
  if (isLetter) { $("#companyName").value = "Northwind Outdoor Co."; $("#roleName").value = "Marketing Coordinator"; }
  $("#sampleTag").hidden = false;
  grade();
}
function loadText(text, m) {
  MK.history = []; MK.dismissed.clear(); MK.active = null;
  setMode(m); $("#resumeText").value = text; $("#sampleTag").hidden = true; $("#sampleTag").textContent = "Sample loaded";
  location.hash = "grade"; grade();
}

let deb;
["resumeText", "jobText", "companyName", "roleName"].forEach(id => $("#" + id).addEventListener("input", () => {
  if (id === "resumeText") $("#sampleTag").hidden = true;
  clearTimeout(deb); deb = setTimeout(grade, 250);
}));
$("#modeResume").onclick = () => { setMode("resume"); grade(); };
$("#modeLetter").onclick = () => { setMode("letter"); grade(); };
$("#loadWeak").onclick = () => loadSample(mode === "resume" ? "weakResume" : "weakLetter");
$("#loadStrong").onclick = () => loadSample(mode === "resume" ? "strongResume" : "strongLetter");
$("#clearAll").onclick = () => { MK.history = []; MK.dismissed.clear(); ["resumeText", "jobText", "companyName", "roleName"].forEach(id => $("#" + id).value = ""); $("#sampleTag").hidden = true; grade(); $("#resumeText").focus(); };
document.querySelectorAll("[data-filter]").forEach(b => b.onclick = () => {
  filter = b.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(x => x.setAttribute("aria-pressed", x === b));
  grade();
});

/* ---------- Render static sections ---------- */
function tplCard(t, kind) {
  const el = document.createElement("article");
  el.className = "sheet tpl";
  el.innerHTML = `<div class="tpl-head"><span class="best">${esc(t.best)}</span><h3>${esc(t.name)}</h3><p>${esc(t.desc)}</p>${t.lookName ? `<span class="look">Look: <b>${esc(t.lookName)}</b> · ${esc(t.fonts)}</span>` : ""}</div>
    <div class="tpl-paper"><div class="doc ${kind === "letter" ? "letter" : ""} ${t.look ? "t-" + t.look : ""}">${kind === "letter" ? renderLetterDoc(t.text) : renderResumeDoc(t.text)}</div></div>
    <div class="tpl-foot"><button type="button" class="btn small primary">Copy text</button><button type="button" class="btn small">Edit in grader</button></div>`;
  const [copyB, gradeB] = el.querySelectorAll(".tpl-foot button");
  copyB.onclick = () => copyText(t.text);
  gradeB.onclick = () => loadText(t.text, kind);
  return el;
}
RESUME_TEMPLATES.forEach(t => $("#resumeTpls").appendChild(tplCard(t, "resume")));
LETTER_TEMPLATES.forEach(t => $("#letterTpls").appendChild(tplCard(t, "letter")));

const pairHTML = p => `<div class="sheet pair"><div class="topic">${esc(p.topic)}</div><div class="bad"><span class="lbl">Weak</span><q>${esc(p.bad)}</q><span class="pen">${esc(p.note)}</span></div><div class="good"><span class="lbl">Strong</span><q>${esc(p.good)}</q></div></div>`;
$("#resumePairs").innerHTML = RESUME_PAIRS.map(pairHTML).join("");
$("#letterPairs").innerHTML = LETTER_PAIRS.map(pairHTML).join("");
$("#beforeDoc").innerHTML = renderResumeDoc(SAMPLES.weakResume);
$("#afterDoc").innerHTML = renderResumeDoc(SAMPLES.strongResume);
document.querySelectorAll("[data-grade]").forEach(b => b.onclick = () => { $("#jobText").value = SAMPLES.job; loadText(SAMPLES[b.dataset.grade], "resume"); });

const li = ([a, b]) => `<li><span>${esc(a)}${b ? `<small>${esc(b)}</small>` : ""}</span></li>`;
$("#resInc").innerHTML = RES_INC.map(li).join("");
$("#resOff").innerHTML = RES_OFF.map(li).join("");
$("#letInc").innerHTML = LET_INC.map(li).join("");
$("#letOff").innerHTML = LET_OFF.map(li).join("");
$("#rules").innerHTML = RULES.map(([n, h, p]) => `<div class="rule"><b>${esc(n)}</b><h2 class="ck">${esc(h)}</h2><p>${esc(p)}</p></div>`).join("");
$("#atsRules").innerHTML = ATS.map(([h, p]) => `<div class="rule"><h2 class="ck">${esc(h)}</h2><p>${esc(p)}</p></div>`).join("");
$("#verbBank").innerHTML = Object.entries(VERBS).map(([k, v]) => `<div><h3>${esc(k)}</h3><p>${esc(v)}</p></div>`).join("");

function buildChecklist(id, items, key) {
  const box = $("#" + id), saved = store.get(key, []);
  const prog = box.querySelector(".progress");
  items.forEach((txt, i) => {
    const l = document.createElement("label");
    l.innerHTML = `<input type="checkbox" id="${key}-${i}" ${saved.includes(i) ? "checked" : ""}><span>${esc(txt)}</span>`;
    box.appendChild(l);
  });
  const update = () => {
    const on = [...box.querySelectorAll("input")].map((c, i) => c.checked ? i : -1).filter(i => i >= 0);
    prog.textContent = `${on.length}/${items.length}`; store.set(key, on);
  };
  box.addEventListener("change", update); update();
}
buildChecklist("chkResume", CHECK_RESUME, "rp-chk-resume");
buildChecklist("chkLetter", CHECK_LETTER, "rp-chk-letter");

$("#resGroups").innerHTML = RESOURCES.map(g => `<div class="res-group"><h3>${esc(g.group)}</h3><div class="res-list">${g.items.map(([n, u, d, h]) => `<a class="sheet res" href="${u}" target="_blank" rel="noopener"><b>${esc(n)}</b><span>${esc(d)}</span><em>${esc(h)} ↗</em></a>`).join("")}</div></div>`).join("");


/* ---------- Downloads ---------- */
let dl = null;
(async () => { try { dl = window.claude?.use ? await window.claude.use("downloads") : null; } catch { dl = null; } })();
async function saveFile(filename, data) {
  if (!dl) {
    let framed = true; try { framed = window.top !== window; } catch {}
    if (framed) { toast("Downloads aren't available in this view. Use Copy instead."); return; }
    const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data]));
    const a = document.createElement("a"); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast("Downloaded"); return;
  }
  try { await dl.save({ filename, data }); toast("Saved"); }
  catch (e) {
    const c = e && e.code;
    if (c === "declined") return;
    if (c === "rate_limited") toast("A save prompt is already open.");
    else toast("Couldn't save the file here. Use Copy instead.");
  }
}

/* ---------- Builder state ---------- */
const EMPTY_EXP = () => ({ title: "", company: "", loc: "", start: "", end: "", bullets: "" });
const EMPTY_EDU = () => ({ degree: "", school: "", loc: "", year: "", details: "" });
const EMPTY_PRJ = () => ({ name: "", link: "", bullets: "" });
const BLANK = () => ({
  mode: "resume", style: "classic", example: false, job: "",
  r: { name: "", location: "", phone: "", email: "", links: "", summary: "", exp: [EMPTY_EXP()], edu: [EMPTY_EDU()], projects: [], skills: "", certs: "" },
  l: { name: "", contact: "", date: "", manager: "", company: "", role: "", hook: "", story1: "", story2: "", close: "", signoff: "Sincerely," }
});
const EXAMPLE = () => ({
  mode: "resume", style: "classic", example: true, job: SAMPLES.job,
  r: {
    name: "Jordan Lee", location: "Columbus, OH", phone: "(614) 555-0142", email: "jordan.lee@email.com", links: "linkedin.com/in/jordanlee",
    summary: "Retail sales lead moving into marketing coordination. Grew store loyalty sign-ups 38% with in-store campaigns and run social media accounts with 12,000 followers. Skilled in Canva, Meta Business Suite, Google Analytics, Mailchimp and Excel.",
    exp: [
      { title: "Sales Lead", company: "BrightMart", loc: "Columbus, OH", start: "Jun 2021", end: "Present", bullets: "Trained 14 new associates on POS and customer service, cutting onboarding time from 3 weeks to 10 days\nDesigned an in-store loyalty campaign that raised enrollment 38% in one quarter\nReorganized seasonal inventory counts with a shared spreadsheet, reducing count errors by 22%\nResolved escalated customer issues while keeping a 4.8/5 store satisfaction rating" },
      { title: "Marketing Intern", company: "Lakeside Marketing", loc: "Columbus, OH", start: "May 2020", end: "Aug 2020", bullets: "Planned a content calendar and scheduled 60+ Instagram and Facebook posts for 3 small-business clients\nWrote ad copy for a spring campaign that earned a 4.1% click-through rate, double the client's average\nBuilt a weekly social media analytics report in Google Sheets used by the account team\nDrafted 6 Mailchimp email newsletters with an average 31% open rate" }
    ],
    edu: [{ degree: "B.A. Communications", school: "The Ohio State University", loc: "", year: "2021", details: "" }],
    projects: [],
    skills: "Social media marketing, content calendars, copywriting, email marketing (Mailchimp), Canva, Meta Business Suite, Google Analytics, Excel, event support, Spanish (conversational)",
    certs: "Google Analytics Certification, 2023"
  },
  l: {
    name: "Jordan Lee", contact: "(614) 555-0142 · jordan.lee@email.com · Columbus, OH", date: "October 27, 2026", manager: "Ms. Patel", company: "Northwind Outdoor Co.", role: "Marketing Coordinator",
    hook: "When Northwind Outdoor Co.'s \"Trail Ready\" spring campaign showed up in my feed three times in one week, I went looking for who was behind it. I'd love to help build the next one as your Marketing Coordinator.",
    story1: "At BrightMart, I designed an in-store loyalty campaign from scratch: signage, a QR sign-up flow, and a short script for cashiers. Enrollment rose 38% in one quarter, and the regional office rolled the campaign out to four more stores.",
    story2: "Your posting asks for someone who can own a content calendar and report on what works. During my internship at Lakeside Marketing, I scheduled 60+ posts for three clients and built the weekly Google Analytics report the account team used to plan content. One spring ad I wrote earned a 4.1% click-through rate, double the client's average.",
    close: "I'd welcome the chance to talk about how I could support Northwind's summer launch and grow your email list. Thank you for considering my application.",
    signoff: "Sincerely,"
  }
});
let B = store.get("rp-builder", null) || EXAMPLE();

/* Resume and letter as blocks shared by every renderer */
const lines = s => (s || "").split("\n").map(x => x.replace(/^\s*[-•*]\s*/, "").trim()).filter(Boolean);
function resumeBlocks(r) {
  const out = [];
  out.push({ t: "name", text: r.name || "Your Name" });
  const contact = [r.location, r.phone, r.email, ...(r.links || "").split(/[,\n]/).map(s => s.trim())].filter(Boolean).join(" · ");
  out.push({ t: "contact", text: contact || "City, State · phone · email" });
  if (r.summary.trim()) { out.push({ t: "h", text: "SUMMARY" }); out.push({ t: "p", text: r.summary.trim() }); }
  const exps = r.exp.filter(e => e.title || e.company || e.bullets);
  if (exps.length) {
    out.push({ t: "h", text: "EXPERIENCE" });
    exps.forEach(e => {
      out.push({ t: "role", left: [e.title, e.company, e.loc].filter(Boolean).join(", "), right: [e.start, e.end].filter(Boolean).join(" – ") });
      lines(e.bullets).forEach(b => out.push({ t: "li", text: b }));
    });
  }
  const prjs = r.projects.filter(p => p.name || p.bullets);
  if (prjs.length) {
    out.push({ t: "h", text: "PROJECTS" });
    prjs.forEach(p => { out.push({ t: "role", left: p.name, right: p.link }); lines(p.bullets).forEach(b => out.push({ t: "li", text: b })); });
  }
  const edus = r.edu.filter(e => e.degree || e.school);
  if (edus.length) {
    out.push({ t: "h", text: "EDUCATION" });
    edus.forEach(e => { out.push({ t: "role", left: [e.degree, e.school, e.loc].filter(Boolean).join(", "), right: e.year }); if (e.details.trim()) out.push({ t: "p", text: e.details.trim() }); });
  }
  if (r.skills.trim()) { out.push({ t: "h", text: "SKILLS" }); out.push({ t: "p", text: r.skills.trim().replace(/\n+/g, " · ") }); }
  if (r.certs.trim()) { out.push({ t: "h", text: "CERTIFICATIONS" }); lines(r.certs).forEach(c => out.push({ t: "p", text: c })); }
  return out;
}
function letterBlocks(l) {
  const out = [{ t: "name", text: l.name || "Your Name" }, { t: "contact", text: l.contact || "phone · email · city" }];
  if (l.date) out.push({ t: "p", text: l.date, gap: true });
  out.push({ t: "p", text: `Dear ${l.manager.trim() || "Hiring Manager"},`, gap: true });
  [l.hook, l.story1, l.story2, l.close].filter(s => s.trim()).forEach(s => out.push({ t: "p", text: s.trim(), gap: true }));
  out.push({ t: "p", text: l.signoff || "Sincerely," });
  out.push({ t: "p", text: l.name || "Your Name" });
  return out;
}
const blocks = () => B.mode === "resume" ? resumeBlocks(B.r) : letterBlocks(B.l);
function blocksToText(bl) {
  if (B.mode === "letter") {
    const [n, c, ...rest] = bl;
    const sign = rest.slice(-2).map(b => b.text).join("\n");
    return [n.text + "\n" + c.text, ...rest.slice(0, -2).map(b => b.text), sign].join("\n\n");
  }
  let s = "";
  bl.forEach(b => {
    if (b.t === "name") s += b.text.toUpperCase() + "\n";
    else if (b.t === "contact") s += b.text + "\n";
    else if (b.t === "h") s += "\n" + b.text + "\n";
    else if (b.t === "role") s += (s.endsWith("\n\n") || /[A-Z]\n$/.test(s) ? "" : "\n") + b.left + (b.right ? " | " + b.right : "") + "\n";
    else if (b.t === "li") s += "- " + b.text + "\n";
    else s += b.text + "\n";
  });
  return s.replace(/\n{3,}/g, "\n\n").trim();
}
function blocksToHTML(bl, inline) {
  const st = inline ? {
    name: `font-size:22pt;font-weight:bold;${B.style === "classic" ? "text-align:center;" : ""}margin:0`,
    contact: `color:#4d535c;${B.style === "classic" ? "text-align:center;" : ""}margin:0 0 8pt`,
    h: `font-weight:bold;letter-spacing:1px;border-bottom:1px solid ${B.style === "modern" ? "#1d4fa3" : "#1b1d21"};${B.style === "modern" ? "color:#1d4fa3;" : ""}margin:10pt 0 4pt`,
    p: "margin:2pt 0", li: "margin:1pt 0"
  } : null;
  let html = "", inList = false;
  const close = () => { if (inList) { html += "</ul>"; inList = false; } };
  bl.forEach(b => {
    const tx = esc(b.text || "");
    if (b.t === "li") { if (!inList) { html += "<ul>"; inList = true; } html += `<li${st ? ` style="${st.li}"` : ""}>${tx}</li>`; return; }
    close();
    if (b.t === "name") html += st ? `<p style="${st.name}">${tx}</p>` : `<div class="r-name">${tx}</div>`;
    else if (b.t === "contact") html += st ? `<p style="${st.contact}">${tx}</p>` : `<div class="r-contact">${tx}</div>`;
    else if (b.t === "h") html += st ? `<p style="${st.h}">${tx}</p>` : `<div class="r-h">${tx}</div>`;
    else if (b.t === "role") html += st ? `<p style="margin:6pt 0 0"><b>${esc(b.left)}</b>${b.right ? ` &nbsp;|&nbsp; ${esc(b.right)}` : ""}</p>` : `<div class="r-role"><span>${esc(b.left)}</span><span>${esc(b.right || "")}</span></div>`;
    else html += st ? `<p style="${st.p}">${tx}</p>` : `<p>${tx}</p>`;
  });
  close();
  return html;
}

/* ---------- Builder form ---------- */
function getPath(path) { return path.split(".").reduce((o, k) => o[k], B); }
function setPath(path, v) { const ks = path.split("."); const last = ks.pop(); ks.reduce((o, k) => o[k], B)[last] = v; }
const fld = (path, label, opts = {}) => {
  const id = "b-" + path.replace(/\./g, "-");
  const val = esc(String(getPath(path) ?? ""));
  const hint = opts.hint ? ` <span class="hint">${opts.hint}</span>` : "";
  const input = opts.area ? `<textarea id="${id}" data-k="${path}" class="${opts.cls || ""}" placeholder="${esc(opts.ph || "")}">${val}</textarea>` : `<input type="text" id="${id}" data-k="${path}" value="${val}" placeholder="${esc(opts.ph || "")}">`;
  return `<label class="field" for="${id}">${label}${hint}${input}</label>`;
};
function entryList(key, title, make, render) {
  const arr = B.r[key];
  return `<div class="sheet form-sec"><h3>${title} <button type="button" class="btn small" data-add="${key}">+ Add</button></h3>${arr.map((e, i) => `<div class="entry"><div class="entry-head"><b>${title.replace(/s$/, "")} ${i + 1}</b><span class="btns">${i ? `<button type="button" class="icon-btn" data-up="${key}.${i}" aria-label="Move up">↑</button>` : ""}<button type="button" class="icon-btn" data-del="${key}.${i}" aria-label="Remove">Remove</button></span></div>${render(i)}</div>`).join("") || `<p class="sub">Nothing here yet.</p>`}</div>`;
}
function renderForm() {
  const f = $("#bForm");
  if (B.mode === "resume") {
    f.innerHTML = `
    <div class="sheet form-sec"><h3>Contact</h3>
      <div class="grid2">${fld("r.name", "Full name", { ph: "Jordan Lee" })}${fld("r.location", "City, State", { ph: "Columbus, OH", hint: "No street address needed" })}</div>
      <div class="grid2">${fld("r.phone", "Phone", { ph: "(555) 555-5555" })}${fld("r.email", "Email", { ph: "first.last@email.com" })}</div>
      ${fld("r.links", "Links", { ph: "linkedin.com/in/you, github.com/you", hint: "Comma-separated" })}
    </div>
    <div class="sheet form-sec"><h3>Summary</h3><p class="sub">Two or three lines: your title, your best result with a number, and skills from the posting.</p>
      ${fld("r.summary", "Summary", { area: true, ph: "Customer support specialist with 4 years in SaaS. Cut ticket backlog 35%…" })}
    </div>
    ${entryList("exp", "Experience", EMPTY_EXP, i => `
      <div class="grid2">${fld(`r.exp.${i}.title`, "Job title", { ph: "Sales Lead" })}${fld(`r.exp.${i}.company`, "Company", { ph: "BrightMart" })}</div>
      <div class="grid3">${fld(`r.exp.${i}.loc`, "Location", { ph: "Columbus, OH" })}${fld(`r.exp.${i}.start`, "Start", { ph: "Jun 2021" })}${fld(`r.exp.${i}.end`, "End", { ph: "Present" })}</div>
      ${fld(`r.exp.${i}.bullets`, "Bullets", { area: true, cls: "bul", hint: "One per line. Action verb + what you did + result.", ph: "Trained 14 new associates, cutting onboarding from 3 weeks to 10 days" })}`)}
    ${entryList("projects", "Projects", EMPTY_PRJ, i => `
      <div class="grid2">${fld(`r.projects.${i}.name`, "Project name")}${fld(`r.projects.${i}.link`, "Link or date")}</div>
      ${fld(`r.projects.${i}.bullets`, "Bullets", { area: true, cls: "bul", hint: "One per line" })}`)}
    ${entryList("edu", "Education", EMPTY_EDU, i => `
      <div class="grid2">${fld(`r.edu.${i}.degree`, "Degree", { ph: "B.A. Communications" })}${fld(`r.edu.${i}.school`, "School", { ph: "The Ohio State University" })}</div>
      <div class="grid2">${fld(`r.edu.${i}.loc`, "Location", { ph: "Optional" })}${fld(`r.edu.${i}.year`, "Year", { ph: "2021 or Expected May 2027" })}</div>
      ${fld(`r.edu.${i}.details`, "Details", { ph: "GPA 3.7 · Dean's List · Relevant coursework: …", hint: "Optional" })}`)}
    <div class="sheet form-sec"><h3>Skills &amp; certifications</h3>
      ${fld("r.skills", "Skills", { area: true, ph: "Excel (pivot tables), Salesforce, SQL, Spanish (fluent)", hint: "Tools and abilities, not traits" })}
      ${fld("r.certs", "Certifications", { area: true, ph: "One per line", hint: "Optional" })}
    </div>`;
  } else {
    f.innerHTML = `
    <div class="sheet form-sec"><h3>You</h3>
      <div class="grid2">${fld("l.name", "Full name", { ph: "Jordan Lee" })}${fld("l.date", "Date", { ph: "October 27, 2026" })}</div>
      ${fld("l.contact", "Contact line", { ph: "(614) 555-0142 · you@email.com · City, ST" })}
    </div>
    <div class="sheet form-sec"><h3>The job</h3>
      <div class="grid3">${fld("l.manager", "Hiring manager", { ph: "Ms. Patel", hint: "Or a team" })}${fld("l.company", "Company", { ph: "Northwind Outdoor Co." })}${fld("l.role", "Job title", { ph: "Marketing Coordinator" })}</div>
    </div>
    <div class="sheet form-sec"><h3>Paragraph 1 · The hook</h3><p class="sub">Name the role and one specific reason you want to work at this company.</p>${fld("l.hook", "Opening", { area: true, ph: "When I saw [Company]'s [specific thing]…" })}</div>
    <div class="sheet form-sec"><h3>Paragraph 2 · Proof story</h3><p class="sub">A situation, what you did, and the measurable result.</p>${fld("l.story1", "Proof story", { area: true, ph: "At [Company], I [action], which [result with a number]." })}</div>
    <div class="sheet form-sec"><h3>Paragraph 3 · Match a requirement</h3><p class="sub">Quote a need from the posting and show you've done it.</p>${fld("l.story2", "Second proof", { area: true, ph: "Your posting asks for [requirement]. In my role at…" })}</div>
    <div class="sheet form-sec"><h3>Paragraph 4 · The ask</h3>${fld("l.close", "Closing", { area: true, ph: "I'd welcome the chance to discuss how I could help with…" })}${fld("l.signoff", "Sign-off", { ph: "Sincerely," })}</div>`;
  }
}
function saveB() { store.set("rp-builder", B); }
function renderPreview() {
  const bl = blocks();
  const doc = $("#bDoc");
  doc.className = `rdoc s-${B.style}${B.mode === "letter" ? " letter" : ""}`;
  doc.innerHTML = blocksToHTML(bl);
  fitPreview();
  const text = blocksToText(bl);
  const checks = B.mode === "resume" ? gradeResume(text, B.job) : gradeLetter(text, B.job, B.l.company, B.l.role);
  const scored = checks.filter(c => !c.skip && c.w);
  const tw = scored.reduce((s, c) => s + c.w, 0);
  const score = Math.round(scored.reduce((s, c) => s + c.w * VAL[c.status], 0) / tw * 100);
  $("#bScore").innerHTML = `${score}<small>/100</small>`;
  $("#bGradeWord").textContent = score >= 90 ? "A · ready to send" : score >= 80 ? "B · close" : score >= 70 ? "C · solid start" : score >= 60 ? "D · needs work" : "F · keep going";
  const fixes = checks.filter(c => c.status !== "pass" && !c.skip).sort((a, b) => (a.status === "fail" ? 0 : 1) - (b.status === "fail" ? 0 : 1) || b.w - a.w).slice(0, 4);
  $("#bFixes").innerHTML = fixes.length ? fixes.map(c => `<li><span class="chip ${c.status}">${c.status === "warn" ? "fix" : "fix!"}</span><span>${esc(c.title)}</span></li>`).join("") : `<li><span class="chip pass">good</span><span>No fixes flagged. Have a person proofread it.</span></li>`;
}
function fitPreview() {
  const box = $("#bScaleBox"), doc = $("#bDoc");
  const scale = Math.min(1, (box.clientWidth - 2) / 816);
  doc.style.transform = `scale(${scale})`;
  const h = doc.offsetHeight;
  box.style.height = Math.ceil(h * scale) + 2 + "px";
  const pages = Math.max(1, Math.ceil((h - 4) / 1056));
  const pm = $("#bPages");
  pm.textContent = pages === 1 ? "Fits on 1 page" : `Runs to ${pages} pages`;
  pm.classList.toggle("over", pages > 1 && B.mode === "letter" || pages > 2);
}
try { new ResizeObserver(() => fitPreview()).observe($("#bScaleBox")); } catch {}
let bDeb;
function changed() { B.example = false; $("#bSampleTag").hidden = true; saveB(); clearTimeout(bDeb); bDeb = setTimeout(renderPreview, 120); }
$("#bForm").addEventListener("input", e => { const k = e.target.dataset.k; if (k) { setPath(k, e.target.value); changed(); } });
$("#bForm").addEventListener("click", e => {
  const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.add) { const make = { exp: EMPTY_EXP, edu: EMPTY_EDU, projects: EMPTY_PRJ }[t.dataset.add]; B.r[t.dataset.add].push(make()); }
  else if (t.dataset.del) { const [k, i] = t.dataset.del.split("."); B.r[k].splice(+i, 1); }
  else if (t.dataset.up) { const [k, i] = t.dataset.up.split("."); const a = B.r[k]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; }
  else return;
  renderForm(); changed();
});
$("#bJob").addEventListener("input", e => { B.job = e.target.value; saveB(); clearTimeout(bDeb); bDeb = setTimeout(renderPreview, 200); });
function setBMode(m) { B.mode = m; $("#bModeResume").setAttribute("aria-pressed", m === "resume"); $("#bModeLetter").setAttribute("aria-pressed", m === "letter"); saveB(); renderForm(); renderPreview(); }
$("#bModeResume").onclick = () => setBMode("resume");
$("#bModeLetter").onclick = () => setBMode("letter");
$("#bStyles").addEventListener("click", e => { const s = e.target.dataset.style; if (!s) return; B.style = s; document.querySelectorAll("#bStyles button").forEach(b => b.setAttribute("aria-pressed", b.dataset.style === s)); saveB(); renderPreview(); });
function loadB(obj) { const m = B.mode; B = obj; B.mode = m; saveB(); initBuilder(); }
$("#bLoadExample").onclick = () => loadB(EXAMPLE());
$("#bBlank").onclick = () => { const s = B.style; loadB(BLANK()); B.style = s; saveB(); initBuilder(); };
$("#bFull").onclick = () => { const text = blocksToText(blocks()); $("#jobText").value = B.job; if (B.mode === "letter") { $("#companyName").value = B.l.company; $("#roleName").value = B.l.role; } loadText(text, B.mode); };
const fileBase = () => `${(B.mode === "resume" ? B.r.name : B.l.name) || "My"}-${B.mode === "resume" ? "Resume" : "Cover-Letter"}`.trim().replace(/[^\w.-]+/g, "-");
$("#bCopyText").onclick = () => copyText(blocksToText(blocks()));
$("#bCopyRich").onclick = async () => {
  const html = `<div style="font-family:${B.style === "classic" ? "Georgia,serif" : "Calibri,Arial,sans-serif"};font-size:11pt">${blocksToHTML(blocks(), true)}</div>`;
  const text = blocksToText(blocks());
  try { await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([text], { type: "text/plain" }) })]); toast("Copied with formatting. Paste into Google Docs or Word."); }
  catch { copyText(text); }
};
$("#bPdf").onclick = async () => {
  try { await needJsPdf(); } catch { toast("The PDF tool didn't load. Try Download Word instead."); return; }
  saveFile(fileBase() + ".pdf", makePdf(blocks()));
};
$("#bDocx").onclick = () => saveFile(fileBase() + ".docx", makeDocx(blocks()));
function initBuilder() {
  $("#bSampleTag").hidden = !B.example;
  $("#bJob").value = B.job || "";
  $("#bModeResume").setAttribute("aria-pressed", B.mode === "resume"); $("#bModeLetter").setAttribute("aria-pressed", B.mode === "letter");
  document.querySelectorAll("#bStyles button").forEach(b => b.setAttribute("aria-pressed", b.dataset.style === B.style));
  renderForm(); renderPreview();
}

/* ---------- PDF (jsPDF) ---------- */
const pdfSafe = s => (s || "").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/→/g, "->").replace(/•/g, "-").replace(/[^\x20-\x7E\xA0-\xFF]/g, "");
function makePdf(bl) {
  const doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
  const W = 612, H = 792, M = B.style === "compact" ? 48 : 54, maxW = W - 2 * M;
  const font = B.style === "classic" ? "times" : "helvetica";
  const base = B.style === "compact" ? 9.5 : (B.style === "classic" ? 10.5 : 10);
  const lh = base * 1.32, center = B.style === "classic" && B.mode === "resume";
  const accent = B.style === "modern" ? [29, 79, 163] : [27, 29, 33];
  let y = M;
  const ensure = h => { if (y + h > H - M) { doc.addPage(); y = M; } };
  const wrap = (txt, w) => doc.splitTextToSize(pdfSafe(txt), w);
  bl.forEach((b, i) => {
    doc.setTextColor(27, 29, 33);
    if (b.t === "name") {
      doc.setFont(font, "bold"); doc.setFontSize(B.mode === "letter" ? 18 : 21);
      y += 14; doc.text(pdfSafe(b.text), center ? W / 2 : M, y, { align: center ? "center" : "left" }); y += 8;
    } else if (b.t === "contact") {
      doc.setFont(font, "normal"); doc.setFontSize(base - 0.5); doc.setTextColor(77, 83, 92);
      wrap(b.text, maxW).forEach(l => { y += lh; doc.text(l, center ? W / 2 : M, y, { align: center ? "center" : "left" }); });
      y += B.mode === "letter" ? lh : 4;
    } else if (b.t === "h") {
      ensure(lh * 3); y += 12;
      doc.setFont(font, "bold"); doc.setFontSize(base + 0.5); doc.setTextColor(...accent);
      doc.setCharSpace(0.8); doc.text(pdfSafe(b.text), M, y); doc.setCharSpace(0);
      doc.setDrawColor(...accent); doc.setLineWidth(0.7); doc.line(M, y + 3.5, W - M, y + 3.5); y += 6;
    } else if (b.t === "role") {
      ensure(lh * 2); y += lh + 2;
      doc.setFont(font, "normal"); doc.setFontSize(base);
      const right = pdfSafe(b.right || ""); const rw = right ? doc.getTextWidth(right) + 12 : 0;
      if (right) { doc.setTextColor(77, 83, 92); doc.text(right, W - M, y, { align: "right" }); doc.setTextColor(27, 29, 33); }
      doc.setFont(font, "bold");
      const ls = wrap(b.left, maxW - rw); doc.text(ls[0] || "", M, y);
      ls.slice(1).forEach(l => { y += lh; doc.text(l, M, y); });
    } else if (b.t === "li") {
      doc.setFont(font, "normal"); doc.setFontSize(base);
      const ls = wrap(b.text, maxW - 14); ensure(lh * ls.length);
      ls.forEach((l, j) => { y += lh; if (!j) doc.circle(M + 4, y - base * 0.32, 1.2, "F"); doc.text(l, M + 14, y); });
    } else {
      doc.setFont(font, "normal"); doc.setFontSize(base);
      const ls = wrap(b.text, maxW); ensure(lh * Math.min(ls.length, 3));
      if (b.gap && i > 2) y += lh * 0.6;
      ls.forEach(l => { ensure(lh); y += lh; doc.text(l, M, y); });
    }
  });
  return doc.output("arraybuffer");
}

/* ---------- Word (.docx) without a library ---------- */
const CRC_T = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(u8) { let c = 0xFFFFFFFF; for (let i = 0; i < u8.length; i++) c = CRC_T[(c ^ u8[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(files) {
  const enc = new TextEncoder(), parts = [], central = []; let offset = 0;
  files.forEach(f => {
    const name = enc.encode(f.name), data = typeof f.data === "string" ? enc.encode(f.data) : f.data, crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, 0, true); h.setUint16(12, 0x21, true);
    h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, 0, true); c.setUint16(14, 0x21, true);
    c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + data.length;
  });
  const cdSize = central.reduce((s, p) => s + p.length, 0);
  const e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cdSize, true); e.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(e.buffer)]);
}
function makeDocx(bl) {
  const x = s => (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const font = B.style === "classic" ? "Georgia" : "Calibri";
  const sz = B.style === "compact" ? 20 : 21, accent = B.style === "modern" ? "1D4FA3" : "1B1D21";
  const center = B.style === "classic" && B.mode === "resume";
  const run = (t, o = {}) => `<w:r><w:rPr><w:rFonts w:ascii="${font}" w:hAnsi="${font}" w:cs="${font}"/>${o.b ? "<w:b/>" : ""}${o.color ? `<w:color w:val="${o.color}"/>` : ""}${o.spacing ? `<w:spacing w:val="${o.spacing}"/>` : ""}<w:sz w:val="${o.sz || sz}"/></w:rPr><w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
  const para = (runs, o = {}) => `<w:p><w:pPr>${o.keep ? "<w:keepNext/>" : ""}${o.border ? `<w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="${accent}"/></w:pBdr>` : ""}${o.tab ? `<w:tabs><w:tab w:val="right" w:pos="10080"/></w:tabs>` : ""}<w:spacing w:before="${o.before || 0}" w:after="${o.after ?? 40}"/>${o.ind ? `<w:ind w:left="300" w:hanging="200"/>` : ""}${o.jc ? `<w:jc w:val="${o.jc}"/>` : ""}</w:pPr>${runs}</w:p>`;
  const body = bl.map((b, i) => {
    if (b.t === "name") return para(run(b.text, { b: 1, sz: B.mode === "letter" ? 36 : 44 }), { jc: center ? "center" : null, after: 20 });
    if (b.t === "contact") return para(run(b.text, { color: "4D535C", sz: sz - 1 }), { jc: center ? "center" : null, after: B.mode === "letter" ? 240 : 80 });
    if (b.t === "h") return para(run(b.text, { b: 1, color: accent, spacing: 16, sz: sz + 1 }), { border: 1, keep: 1, before: 200, after: 60 });
    if (b.t === "role") return para(run(b.left, { b: 1 }) + (b.right ? `<w:r><w:tab/></w:r>` + run(b.right, { color: "4D535C" }) : ""), { tab: 1, keep: 1, before: 100, after: 20 });
    if (b.t === "li") return para(run("•  " + b.text), { ind: 1, after: 20 });
    return para(run(b.text), { after: b.gap ? 200 : 40, before: 0 });
  }).join("");
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  return zipStore([
    { name: "[Content_Types].xml", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>` },
    { name: "_rels/.rels", data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>` },
    { name: "word/document.xml", data: doc }
  ]);
}

/* ---------- Job tracker ---------- */
const STATUSES = ["Saved", "Applied", "Interview", "Offer", "Rejected"];
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (d, n) => { const t = new Date(d + "T12:00:00"); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
let JOBS = store.get("rp-jobs", null);
if (!JOBS) JOBS = [
  { company: "Northwind Outdoor Co. (example)", role: "Marketing Coordinator", status: "Interview", applied: addDays(today(), -12), link: "", follow: addDays(today(), 2), notes: "Phone screen went well. Example row: edit or delete it." },
  { company: "Lakeview Health (example)", role: "Communications Assistant", status: "Applied", applied: addDays(today(), -9), link: "", follow: addDays(today(), -2), notes: "Example row. Follow-up is overdue, so the date shows in red." }
];
const saveJobs = () => store.set("rp-jobs", JOBS);
function renderStats() {
  const c = s => JOBS.filter(j => j.status === s).length;
  const due = JOBS.filter(j => j.follow && j.follow <= today() && !["Offer", "Rejected"].includes(j.status)).length;
  $("#tStats").innerHTML = [["Total", JOBS.length], ["Applied", c("Applied")], ["Interviews", c("Interview")], ["Offers", c("Offer")], ["Follow-ups due", due]]
    .map(([k, v]) => `<div class="sheet stat"><b>${v}</b><span>${k}</span></div>`).join("");
}
let openPacket = null;
function packetRow(j, i) {
  const col = (kind, label) => `<div><b>${label}</b>${j.packet[kind] ? `<pre>${esc(j.packet[kind])}</pre><div style="display:flex;gap:6px;flex-wrap:wrap"><button type="button" class="btn small" data-pl="${i}:${kind}">Open in Grade</button><button type="button" class="btn small" data-pc="${i}:${kind}">Copy</button></div>` : `<p class="note">Nothing attached.</p>`}</div>`;
  return `<tr class="packet"><td colspan="9"><div class="toolbar" style="margin-bottom:8px"><span class="page-meta">Exactly what you sent ${esc(j.company || "this employer")}, saved ${esc(j.packet.savedAt)}</span><button type="button" class="btn small" data-pk="${i}">Replace with current</button></div><div class="packet-grid">${col("resume", "Resume")}${col("letter", "Cover letter")}</div></td></tr>`;
}
function renderJobs() {
  const tb = $("#tBody");
  if (!JOBS.length) { tb.innerHTML = `<tr><td colspan="9" class="empty">No applications yet. Click "Add application" to log your first one.</td></tr>`; renderStats(); return; }
  tb.innerHTML = JOBS.map((j, i) => {
    const due = j.follow && j.follow <= today() && !["Offer", "Rejected"].includes(j.status);
    return `<tr class="${due ? "due" : ""}">
      <td><input id="t-${i}-company" data-i="${i}" data-f="company" value="${esc(j.company)}" placeholder="Company" aria-label="Company"></td>
      <td><input id="t-${i}-role" data-i="${i}" data-f="role" value="${esc(j.role)}" placeholder="Role" aria-label="Role"></td>
      <td><select id="t-${i}-status" data-i="${i}" data-f="status" class="st-${j.status}" aria-label="Status">${STATUSES.map(s => `<option ${s === j.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
      <td><input id="t-${i}-applied" type="date" data-i="${i}" data-f="applied" value="${esc(j.applied)}" aria-label="Date applied"></td>
      <td><input id="t-${i}-link" data-i="${i}" data-f="link" value="${esc(j.link)}" placeholder="Posting URL" aria-label="Link"></td>
      <td><input id="t-${i}-follow" type="date" data-i="${i}" data-f="follow" value="${esc(j.follow)}" aria-label="Follow-up date"></td>
      <td><input id="t-${i}-notes" data-i="${i}" data-f="notes" value="${esc(j.notes)}" placeholder="Contacts, next steps" aria-label="Notes"></td>
      <td class="pk-cell">${j.packet ? `<button type="button" class="btn small" data-pv="${i}" aria-expanded="${openPacket === i}">${openPacket === i ? "Hide" : "View"}</button>` : `<button type="button" class="btn small" data-pk="${i}" title="Save the resume and cover letter you're sending">Attach</button>`}</td>
      <td><button type="button" class="icon-btn" data-tdel="${i}" aria-label="Delete row">×</button></td></tr>${j.packet && openPacket === i ? packetRow(j, i) : ""}`;
  }).join("");
  renderStats();
}
$("#tBody").addEventListener("change", e => {
  const i = e.target.dataset.i, f = e.target.dataset.f; if (i == null) return;
  JOBS[i][f] = e.target.value;
  if (f === "applied" && e.target.value && !JOBS[i].follow) JOBS[i].follow = addDays(e.target.value, 7);
  if (f === "status" && e.target.value === "Applied" && !JOBS[i].applied) { JOBS[i].applied = today(); JOBS[i].follow = JOBS[i].follow || addDays(today(), 7); }
  saveJobs();
  if (["status", "applied", "follow"].includes(f)) renderJobs(); else renderStats();
});
$("#tBody").addEventListener("click", e => { const d = e.target.dataset.tdel; if (d == null) return; JOBS.splice(+d, 1); saveJobs(); renderJobs(); });
$("#tAdd").onclick = () => { JOBS.unshift({ company: "", role: "", status: "Saved", applied: "", link: "", follow: "", notes: "" }); saveJobs(); renderJobs(); $("#t-0-company").focus(); };
$("#tCsv").onclick = () => {
  const q = v => `"${String(v || "").replace(/"/g, '""')}"`;
  const csv = ["Company,Role,Status,Applied,Link,Follow up,Notes", ...JOBS.map(j => [j.company, j.role, j.status, j.applied, j.link, j.follow, j.notes].map(q).join(","))].join("\r\n");
  saveFile("job-applications.csv", csv);
};
renderJobs();


/* ---------- File drop: PDF, Word, text ---------- */
function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("load")); document.head.appendChild(s); });
}
async function inflateRaw(u8) {
  const ds = new DecompressionStream("deflate-raw");
  const out = new Response(new Blob([u8]).stream().pipeThrough(ds));
  return new Uint8Array(await out.arrayBuffer());
}
async function unzipEntry(buf, wanted) {
  const u8 = new Uint8Array(buf), dv = new DataView(buf);
  let eo = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eo = i; break; }
  if (eo < 0) throw new Error("zip");
  const count = dv.getUint16(eo + 10, true);
  let p = dv.getUint32(eo + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count; n++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nl));
    if (name === wanted) {
      const start = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
      const data = u8.subarray(start, start + csize);
      return dec.decode(method === 8 ? await inflateRaw(data) : data);
    }
    p += 46 + nl + el + cl;
  }
  throw new Error("nodoc");
}
async function readDocx(buf) {
  const xml = await unzipEntry(buf, "word/document.xml");
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const out = [];
  for (const p of doc.getElementsByTagNameNS(W, "p")) {
    let t = "";
    const walk = n => {
      for (const c of n.childNodes) {
        if (c.namespaceURI !== W) continue;
        if (c.localName === "t") t += c.textContent;
        else if (c.localName === "tab") t += " ";
        else if (c.localName === "br" || c.localName === "cr") t += "\n";
        else if (c.localName !== "pPr" && c.localName !== "p") walk(c);
      }
    };
    walk(p);
    const ps = p.getElementsByTagNameNS(W, "pStyle")[0];
    const isList = p.getElementsByTagNameNS(W, "numPr").length > 0 || /list|bullet/i.test(ps ? ps.getAttributeNS(W, "val") || ps.getAttribute("w:val") || "" : "");
    out.push(isList && t.trim() ? "- " + t.trim() : t.replace(/\s+$/, ""));
  }
  return out.join("\n");
}
const PDFJS = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/";
async function readPdf(buf) {
  if (!window.pdfjsLib) {
    await loadScript(PDFJS + "pdf.worker.min.js");
    await loadScript(PDFJS + "pdf.min.js");
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + "pdf.worker.min.js";
  }
  const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
  const lines = [];
  let colRows = 0, images = 0;
  const imgOps = ["paintImageXObject", "paintJpegXObject", "paintInlineImageXObject"].map(k => window.pdfjsLib.OPS[k]).filter(v => v != null);
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const tc = await page.getTextContent();
    try { images += (await page.getOperatorList()).fnArray.filter(f => imgOps.includes(f)).length; } catch {}
    const rows = {};
    for (const it of tc.items) { if (!it.str.trim()) continue; (rows[Math.round(it.transform[5])] ||= []).push(it); }
    for (const r of Object.values(rows)) {
      r.sort((a, b) => a.transform[4] - b.transform[4]);
      if (r.some((it, k) => k && it.transform[4] - (r[k - 1].transform[4] + (r[k - 1].width || 0)) > 40)) colRows++;
    }
    let line = "", lastY = null, lastX = null;
    for (const it of tc.items) {
      const y = it.transform[5], x = it.transform[4];
      if (lastY !== null && Math.abs(y - lastY) > 2) { lines.push(line); line = ""; lastX = null; }
      if (lastX !== null && it.str && !line.endsWith(" ") && !it.str.startsWith(" ") && x - lastX > 1.5) line += " ";
      line += it.str;
      lastY = y; lastX = x + (it.width || 0);
      if (it.hasEOL) { lines.push(line); line = ""; lastY = null; lastX = null; }
    }
    if (line) lines.push(line);
    lines.push("");
  }
  window.LAST_PDF = { colRows, images };
  return lines.join("\n");
}
function cleanImported(t) {
  return t.replace(/\r/g, "")
    .replace(/^[ \t]*[•\uF0B7\uF0A7▪●◦‣⁃■➢✓✔·▪●◦■➢]\s*/gm, "- ")
    .replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}
async function handleFile(file) {
  if (!file) return;
  const name = file.name.toLowerCase(), st = $("#dropStatus");
  st.textContent = `Reading ${file.name}…`;
  try {
    let text;
    if (name.endsWith(".pdf")) text = await readPdf(await file.arrayBuffer());
    else if (name.endsWith(".docx")) text = await readDocx(await file.arrayBuffer());
    else if (name.endsWith(".doc")) { st.textContent = "Old .doc files can't be read here. In Word, use File > Save As > .docx or PDF, then drop that."; return; }
    else if (/\.(txt|md|rtf)$/.test(name) || file.type.startsWith("text/")) text = await file.text();
    else { st.textContent = "That file type isn't supported. Use a PDF, Word (.docx) or text file."; return; }
    text = cleanImported(text);
    if (!text) { st.textContent = "No text found. If this PDF is a scanned image, copy the text in by hand or export it from Word or Google Docs."; return; }
    const isLetter = /^\s*dear\b|sincerely|to whom it may concern/im.test(text) && !/\b(experience|education)\b/i.test(text);
    loadText(text, isLetter ? "letter" : mode);
    st.textContent = `Loaded ${file.name}. Your file isn't uploaded anywhere; it's read in this browser.`;
  } catch (e) {
    st.textContent = name.endsWith(".pdf") ? "Couldn't read that PDF here. Try the Word version, or copy and paste the text." : "Couldn't read that file. Try saving it as .docx or PDF again, or paste the text.";
  }
}
const dz = $("#dropZone");
["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("over"); }));
dz.addEventListener("drop", e => handleFile(e.dataTransfer.files[0]));
$("#fileInput").addEventListener("change", e => { handleFile(e.target.files[0]); e.target.value = ""; });
$("#resumeText").addEventListener("drop", e => { if (e.dataTransfer.files.length) { e.preventDefault(); handleFile(e.dataTransfer.files[0]); } });

/* ---------- Red-pen markup ---------- */
const MK = { original: "", history: [], dismissed: new Set(), active: null };
function mkResetState() { MK.history = []; MK.dismissed.clear(); MK.original = $("#resumeText").value; }
const IRREG = { running: "ran", leading: "led", building: "built", writing: "wrote", making: "made", selling: "sold", teaching: "taught", bringing: "brought", buying: "bought", doing: "did", getting: "got", keeping: "kept", setting: "set", sending: "sent", spending: "spent", taking: "took", giving: "gave", overseeing: "oversaw", having: "had", meeting: "met", seeing: "saw", speaking: "spoke", winning: "won", finding: "found", holding: "held", paying: "paid" };
function pastTense(g) {
  const w = g.toLowerCase();
  if (IRREG[w]) return IRREG[w];
  const stem = w.slice(0, -3);
  if (/[^aeiou]y$/.test(stem)) return stem.slice(0, -1) + "ied";
  return stem + "ed";
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
function suggestions(text, isLetter, company) {
  const out = [];
  const add = (o) => out.push(o);
  const lines = text.split("\n");
  let off = 0;
  const hasDegree = /\b(b\.?a\.?|b\.?s\.?|bachelor|master|m\.?s\.?|mba|associate|ph\.?d)\b/i.test(text);
  lines.forEach((L, li) => {
    const o = off; off += L.length + 1;
    if (!L.trim()) return;
    const bm = L.match(/^(\s*)([-•*▪◦·–]|\d+[.)])\s+/);
    const cs = bm ? bm[0].length : (L.match(/^\s*/)[0].length);
    const content = L.slice(cs);
    const atStart = idx => idx === cs;
    const rx = (re, fn) => { re.lastIndex = 0; let m; while ((m = re.exec(L))) { fn(m); if (!re.global) break; } };

    // Whole-line removals
    const LINE_OFF = [
      [/\b(date of birth|d\.?o\.?b\.?|born on|birth ?date)\b/i, "Take off your date of birth", "Employers can't use age in hiring decisions, and it invites bias. Remove this line."],
      [/\bmarital status\b/i, "Take off marital status", "This isn't relevant to the job and can invite bias. Remove this line."],
      [/\b(social security|ssn)\b/i, "Remove your Social Security number", "Never put ID numbers on a resume. It's an identity-theft risk."],
      [/\breferences (are )?available (up)?on request\b/i, "Cut this line", "Employers assume you have references. Use the space for an achievement."],
      [/\b(religion|nationality|gender)\s*:/i, "Take off personal demographics", "Not relevant to the job, and it can invite bias."]
    ];
    if (!isLetter) {
      for (const [re, label, comment] of LINE_OFF) if (re.test(L)) { add({ rule: "line", start: o, end: o + L.length, kind: "fix", label, comment, replacement: "", lineDelete: true, pr: 0 }); return; }
      if (/\bhigh school\b/i.test(L) && hasDegree) { add({ rule: "line", start: o, end: o + L.length, kind: "consider", label: "Drop high school", comment: "Once you have a degree, high school takes up space without adding anything.", replacement: "", lineDelete: true, pr: 0 }); return; }
      const obj = L.match(/^\s*objective\s*:?\s*/i);
      if (obj) add({ rule: "objective", start: o, end: o + L.length, kind: "fix", label: "Replace the objective with a summary", comment: "Objectives say what you want. A summary says what they get: your title, your best result with a number, and skills from the posting. Example: \"Retail sales lead moving into marketing. Grew loyalty sign-ups 38%…\"", replacement: null, pr: 1 });
    }
    // Typos
    rx(/[A-Za-z]+/g, m => { const w = m[0].toLowerCase(); if (MISSPELL[w] && w !== "lead") { const fix = MISSPELL[w]; add({ rule: "typo", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Spelling", comment: "Likely a typo. One spelling mistake can get an application set aside.", replacement: m[0][0] === m[0][0].toUpperCase() ? cap(fix) : fix, pr: 1 }); } });
    // Letter phrases
    if (isLetter) {
      rx(/^\s*(to whom it may concern|dear sir or madam|dear sir\/madam)\s*,?/i, m => add({ rule: "greet", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Use a real greeting", comment: "Generic greetings read like a form letter. Best is the hiring manager's name (check LinkedIn or the company site). Second best is the team.", replacement: "Dear Hiring Manager,", pr: 1 }));
      rx(/please (contact|call|email) me if you are interested\.?/i, m => add({ rule: "ask", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "End with a confident ask", comment: "This puts the work on them. Ask for the conversation directly.", replacement: "I'd welcome the chance to discuss how I can help your team.", pr: 1 }));
      rx(/\bmy name is [^.,]+?(,|\.| and)\s*/i, m => add({ rule: "name", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Cut \"My name is\"", comment: "Your name is already in the signature. Open with why this company and the role you want.", replacement: null, pr: 2 }));
      rx(/\bI am writing to (apply|express)[^.]*\./i, m => add({ rule: "writing", start: o + m.index, end: o + m.index + m[0].length, kind: "consider", label: "Stock opening line", comment: "Most letters start this way. Try opening with something specific you admire about the company, then name the role.", replacement: null, pr: 2 }));
      if (company && company.trim()) rx(/\byour (company|organization|firm)\b/gi, m => add({ rule: "yourco", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Name the company", comment: "Saying the company's name shows this letter was written for them.", replacement: company.trim(), pr: 1 }));
      rx(/\bas you can see (on|in|from) my resume,?\s*/i, m => add({ rule: "asyousee", start: o + m.index, end: o + m.index + m[0].length, kind: "consider", label: "Don't point back to the resume", comment: "Tell one story the resume can't, instead of summarizing it.", replacement: "", capNext: true, pr: 2 }));
      rx(/\bI know I (don't|do not) have (much|a lot of) experience,? but\s*/i, m => add({ rule: "apology", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Don't apologize", comment: "Never argue against yourself. Lead with what you do have.", replacement: "", capNext: true, pr: 1 }));
    }
    // Weak phrasing
    rx(/\b(I\s+)?(was\s+)?responsible for (\w+ing)\b/gi, m => { const v = pastTense(m[3]); add({ rule: "resp", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Say what you did", comment: "\"Responsible for\" describes a duty. A past-tense verb shows you did it. Then add the result.", replacement: atStart(m.index) ? cap(v) : v, pr: 2 }); });
    rx(/\b(I\s+)?(was\s+)?responsible for\b(?!\s+\w+ing\b)/gi, m => add({ rule: "resp2", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Say what you did", comment: "\"Responsible for\" describes a duty. Lead with what you did.", replacement: atStart(m.index) ? "Managed" : "managed", pr: 3 }));
    rx(/\b(I\s+)?(was\s+)?in charge of (\w+ing)\b/gi, m => { const v = pastTense(m[3]); add({ rule: "charge0", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Say what you did", comment: "Turn the duty into an action: one verb, then the result.", replacement: atStart(m.index) ? cap(v) : v, pr: 2 }); });
    rx(/\b(I\s+)?was in charge of\b/gi, m => add({ rule: "charge", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Use a stronger verb", comment: "\"Led\" is shorter and shows ownership.", replacement: atStart(m.index) ? "Led" : "led", pr: 2 }));
    rx(/\bin charge of\b/gi, m => add({ rule: "charge2", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Use a stronger verb", comment: "Try \"oversaw\" or \"led\".", replacement: atStart(m.index) ? "Oversaw" : "oversaw", pr: 3 }));
    rx(/\bhelped (with|to)\b/gi, m => add({ rule: "helped", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "\"Helped\" undersells you", comment: "Name exactly what you did: Organized, Ran, Created, Supported, Scheduled… then add how much or how often.", replacement: null, pr: 3 }));
    rx(/\bduties (included|include)\s*:?\s*/gi, m => add({ rule: "duties", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "List results, not duties", comment: "Split these into separate bullets that each start with a verb and end with a result.", replacement: null, pr: 3 }));
    rx(/\bworked on\b/gi, m => add({ rule: "workedon", start: o + m.index, end: o + m.index + m[0].length, kind: "consider", label: "Vague verb", comment: "Did you build it, design it, lead it, or deliver it? Use that verb.", replacement: null, pr: 3 }));
    rx(/\b(various|other|misc\.?|miscellaneous) (tasks|duties)( as (assigned|needed))?\b/gi, m => add({ rule: "various", start: o + m.index, end: o + m.index + m[0].length, kind: "fix", label: "Filler", comment: "Cut it, or name the one task that mattered most.", replacement: null, pr: 3 }));
    rx(/\b(tasked with|assisted (with|in))\b/gi, m => add({ rule: "assisted", start: o + m.index, end: o + m.index + m[0].length, kind: "consider", label: "Passive phrasing", comment: "Lead with the action you took instead.", replacement: null, pr: 3 }));
    // Pronoun at bullet start
    if (!isLetter && bm) rx(/^(\s*\S+\s+)(I\s+)(\w)/, m => add({ rule: "pron", start: o + m[1].length, end: o + m[1].length + m[2].length + 1, kind: "fix", label: "Drop \"I\"", comment: "Resumes use implied first person: \"Trained new hires\", not \"I trained new hires\".", replacement: m[3].toUpperCase(), pr: 4 }));
    // AI-style phrases
    AI_PHRASES.forEach(([re, rep, why]) => rx(new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"), m => { const r = applyAIFix(rep, m); add({ rule: "ai", start: o + m.index, end: o + m.index + m[0].length, kind: r == null ? "consider" : "fix", label: "Sounds AI-written", comment: why, replacement: r, capNext: r === "", pr: 4 }); }));
    // Clichés
    const lower = L.toLowerCase();
    CLICHES.forEach(c => { const re = new RegExp("\\b" + c.replace(/-/g, "[- ]?") + "\\b", "gi"); let m; while ((m = re.exec(lower))) add({ rule: "cliche", start: o + m.index, end: o + m.index + m[0].length, kind: "consider", label: "Cliché", comment: `"${L.substr(m.index, m[0].length)}" is on almost every resume. Prove it with a result instead, or cut it.`, replacement: null, pr: 5 }); });
    // Line pins for resume bullets
    if (!isLetter && bm && content.trim()) {
      const words = (content.match(/\S+/g) || []).length;
      const first = (content.match(/^[A-Za-z]+/) || [""])[0].toLowerCase();
      if (!/\d|%|\$/.test(content)) add({ rule: "num", pin: true, start: o + L.length, end: o + L.length, kind: "consider", label: "Add a number", comment: "How many, how much, how often, or how fast? An honest estimate is fine: \"about 30 customers a day\".", pr: 9 });
      if (first && !STRONG_VERBS.has(first) && !(/ed$/.test(first) && first.length > 4) && first !== "i") add({ rule: "verb", pin: true, cs: o + cs, start: o + L.length, end: o + L.length, kind: "consider", label: "Start with an action verb", comment: `Instead of "${content.split(/\s+/)[0]}", try Led, Built, Improved, Organized or Resolved (see the verb bank under Tips).`, pr: 9 });
      if (words > 30) add({ rule: "long", pin: true, start: o + L.length, end: o + L.length, kind: "consider", label: "Too long", comment: `${words} words. Split it into two bullets or trim to under 30 words.`, pr: 9 });
    }
  });
  // Keep non-overlapping range marks by priority
  const marks = [], pins = [];
  out.sort((a, b) => a.pr - b.pr || a.start - b.start).forEach(s => {
    s.key = s.rule + "|" + text.slice(s.start, s.end) + "|" + text.slice(text.lastIndexOf("\n", s.start - 1) + 1, s.start).slice(-40);
    if (MK.dismissed.has(s.key)) return;
    if (s.pin) { pins.push(s); return; }
    if (marks.some(m => s.start < m.end && m.start < s.end)) return;
    marks.push(s);
  });
  const keptPins = pins.filter(pn => !(pn.rule === "verb" && marks.some(m => m.start === pn.cs)));
  const all = [...marks, ...keptPins].sort((a, b) => a.start - b.start || (a.pin ? 1 : 0) - (b.pin ? 1 : 0));
  all.forEach((s, i) => s.n = i + 1);
  return all;
}
function applySuggestion(text, s) {
  if (s.lineDelete) {
    const ls = text.lastIndexOf("\n", s.start - 1) + 1;
    let le = text.indexOf("\n", s.start); le = le < 0 ? text.length : le + 1;
    return text.slice(0, ls) + text.slice(le);
  }
  let rest = text.slice(s.end);
  if (s.capNext) rest = rest.replace(/^(\s*)([a-z])/, (_, a, b) => a + b.toUpperCase());
  return text.slice(0, s.start) + s.replacement + rest;
}
let MK_LIST = [];
function renderMarkup() {
  const t = $("#resumeText").value;
  if (!MK.history.length) MK.original = t;
  const isLetter = mode === "letter";
  MK_LIST = t.trim() ? suggestions(t, isLetter, $("#companyName").value) : [];
  const paper = $("#mkPaper"), list = $("#mkList");
  if (!t.trim()) { paper.innerHTML = `<p class="note">Paste or drop a document above to see it marked up.</p>`; list.innerHTML = ""; $("#mkCount").textContent = ""; updateMkButtons(); return; }
  // Paper
  const lines = t.split("\n"); let off = 0, html = "";
  lines.forEach((L, li) => {
    const o = off, e = o + L.length; off = e + 1;
    const ms = MK_LIST.filter(s => !s.pin && s.start >= o && s.end <= e).sort((a, b) => a.start - b.start);
    const ps = MK_LIST.filter(s => s.pin && s.start === e);
    let h = "", cur = o;
    ms.forEach(s => { h += esc(t.slice(cur, s.start)) + `<mark class="mk ${s.kind}${s.lineDelete ? " del" : ""}" data-n="${s.n}" tabindex="0">${esc(t.slice(s.start, s.end)) || "&nbsp;"}<sup>${s.n}</sup></mark>`; cur = s.end; });
    h += esc(t.slice(cur, e));
    h += ps.map(s => `<button type="button" class="pin" data-n="${s.n}" aria-label="Suggestion ${s.n}">${s.n}</button>`).join("");
    const isHead = /^[A-Z0-9 &/,'().-]{3,}$/.test(L.trim()) && /[A-Z]{3}/.test(L);
    const isBul = /^\s*([-•*▪◦·–]|\d+[.)])\s+/.test(L);
    html += `<div class="mk-line${isHead ? " head" : ""}${isBul ? " bul" : ""}">${h || "&nbsp;"}</div>`;
  });
  paper.innerHTML = html;
  // Cards
  list.innerHTML = MK_LIST.map(s => {
    const old = t.slice(s.start, s.end);
    const diff = s.replacement != null ? `<div class="mk-diff">${old ? `<del>${esc(old.trim())}</del>` : ""}${s.replacement ? ` <ins>${esc(s.replacement)}</ins>` : `<span class="note"> (remove${s.lineDelete ? " line" : ""})</span>`}</div>` : (old && !s.pin ? `<div class="mk-diff"><q>${esc(old.length > 90 ? old.slice(0, 90) + "…" : old)}</q></div>` : "");
    const btns = s.replacement != null
      ? `<button type="button" class="btn small primary" data-acc="${s.n}">Accept</button><button type="button" class="btn small" data-dis="${s.n}">Dismiss</button>`
      : `<button type="button" class="btn small" data-dis="${s.n}">Got it</button>`;
    return `<li class="mk-card ${s.kind}" data-n="${s.n}"><span class="mk-n">${s.n}</span><div class="mk-body"><b>${esc(s.label)}</b><p>${esc(s.comment)}</p>${diff}<div class="btns">${btns}</div></div></li>`;
  }).join("") || `<li class="mk-empty">No suggestions left. Nice work. Have a person give it one last read.</li>`;
  const fixes = MK_LIST.filter(s => s.replacement != null).length;
  $("#mkCount").textContent = `${MK_LIST.length} suggestion${MK_LIST.length === 1 ? "" : "s"} · ${fixes} with a ready change${MK.history.length ? ` · ${MK.history.length} accepted` : ""}`;
  updateMkButtons();
  if (MK.active) focusMk(MK.active, false);
}
function updateMkButtons() {
  $("#mkUndo").disabled = !MK.history.length;
  $("#mkRevert").disabled = !MK.history.length;
  $("#mkAcceptAll").disabled = !MK_LIST.some(s => s.replacement != null);
}
function focusMk(n, scroll = true) {
  MK.active = n;
  document.querySelectorAll("#mkPaper .active, #mkList .active").forEach(e => e.classList.remove("active"));
  const m = document.querySelector(`#mkPaper [data-n="${n}"]`), c = document.querySelector(`#mkList [data-n="${n}"]`);
  m?.classList.add("active"); c?.classList.add("active");
  if (scroll) {
    const sc = (el, box) => { if (!el) return; const r = el.getBoundingClientRect(), b = box.getBoundingClientRect(); if (r.top < b.top || r.bottom > b.bottom) box.scrollTop += r.top - b.top - 40; };
    sc(m, $("#mkPaper")); sc(c, $("#mkList"));
  }
}
function setDoc(next) { $("#resumeText").value = next; MK.active = null; grade(); }
$("#mkPaper").addEventListener("click", e => { const m = e.target.closest("[data-n]"); if (m) focusMk(+m.dataset.n); });
$("#mkPaper").addEventListener("keydown", e => { if (e.key === "Enter") { const m = e.target.closest("[data-n]"); if (m) focusMk(+m.dataset.n); } });
$("#mkList").addEventListener("click", e => {
  const acc = e.target.dataset.acc, dis = e.target.dataset.dis;
  if (acc) { const s = MK_LIST.find(x => x.n === +acc); const t = $("#resumeText").value; MK.history.push(t); setDoc(applySuggestion(t, s)); toast("Change accepted"); return; }
  if (dis) { const s = MK_LIST.find(x => x.n === +dis); MK.dismissed.add(s.key); MK.active = null; renderMarkup(); return; }
  const c = e.target.closest(".mk-card"); if (c) focusMk(+c.dataset.n);
});
$("#mkAcceptAll").onclick = () => {
  let t = $("#resumeText").value; MK.history.push(t);
  const ready = MK_LIST.filter(s => s.replacement != null).sort((a, b) => b.start - a.start);
  ready.forEach(s => t = applySuggestion(t, s));
  setDoc(t); toast(`${ready.length} changes accepted`);
};
$("#mkUndo").onclick = () => { if (MK.history.length) { const prev = MK.history.pop(); setDoc(prev); toast("Undone"); } };
$("#mkRevert").onclick = () => { const o = MK.original; MK.history = []; setDoc(o); toast("Back to your original"); };


/* ---------- LinkedIn checker ---------- */
const LI_TEXT = ["liHeadline", "liAbout", "liExp", "liSkills", "liEdu", "liUrl", "liConnections", "liRecs", "liRole", "liJob"];
const LI_BOX = ["liPhoto", "liBanner", "liLocation", "liIndustry", "liOpen"];
const LI_EXAMPLE = {
  name: "Jordan Lee",
  liHeadline: "Marketing Coordinator | Social Media, Email & Content Campaigns | Canva · Google Analytics · Mailchimp",
  liAbout: "I help small brands turn everyday customers into loyal fans.\n\nAt BrightMart I designed an in-store loyalty campaign that raised enrollment 38% in one quarter and was rolled out to four more stores. As a marketing intern at Lakeside Marketing I planned content calendars, scheduled 60+ posts for three clients, and wrote an ad that earned a 4.1% click-through rate, double the client's average.\n\nWhat I bring: social media strategy, copywriting, email marketing in Mailchimp, and weekly reporting in Google Analytics and Excel.\n\nI'm looking for a marketing coordinator role with an outdoor or retail brand. Feel free to reach out or connect.",
  liExp: "Sales Lead\nBrightMart · Full-time\nJun 2021 - Present · Columbus, Ohio\nTrained 14 new associates, cutting onboarding from 3 weeks to 10 days. Designed a loyalty campaign that raised enrollment 38% in one quarter.\n\nMarketing Intern\nLakeside Marketing · Internship\nMay 2020 - Aug 2020\nScheduled 60+ social posts for 3 clients and built the weekly Google Analytics report used by the account team.",
  liSkills: "Social Media Marketing, Content Calendars, Copywriting, Email Marketing, Mailchimp, Canva, Google Analytics, Meta Business Suite, Microsoft Excel, Event Planning, Customer Service, Spanish",
  liEdu: "The Ohio State University · B.A. Communications · 2017 - 2021",
  liUrl: "linkedin.com/in/jordan-lee-a83b2c41",
  liConnections: "180", liRecs: "0", liRole: "Marketing Coordinator", liJob: "",
  liPhoto: true, liBanner: false, liLocation: true, liIndustry: true, liOpen: false
};
let LI = store.get("rp-linkedin", null);
let liExample = !LI;
if (!LI) LI = { ...LI_EXAMPLE, liJob: SAMPLES.job };
function liFill() {
  LI_TEXT.forEach(id => $("#" + id).value = LI[id] || "");
  LI_BOX.forEach(id => $("#" + id).checked = !!LI[id]);
  $("#liSampleTag").hidden = !liExample;
}
function liRead() { LI_TEXT.forEach(id => LI[id] = $("#" + id).value); LI_BOX.forEach(id => LI[id] = $("#" + id).checked); }

function gradeLinkedIn(d) {
  const C = [];
  const head = d.liHeadline.trim(), about = d.liAbout.trim(), exp = d.liExp.trim(), edu = d.liEdu.trim();
  const words = s => (s.match(/\S+/g) || []).length;
  // Basics
  C.push({ id: "li-photo", cat: "Basics", status: d.liPhoto ? "pass" : "fail", title: d.liPhoto ? "Has a profile photo" : "Add a profile photo", detail: d.liPhoto ? "LinkedIn reports photos bring up to 21x more profile views." : "LinkedIn reports profiles with a photo get up to 21x more views. A clear, recent headshot with good lighting is enough; a phone photo works." });
  C.push({ id: "li-banner", cat: "Basics", status: d.liBanner ? "pass" : "warn", title: d.liBanner ? "Has a background banner" : "Add a background banner", detail: d.liBanner ? "Good use of space." : "Replace the default banner with something tied to your field or city." });
  const li = [d.liLocation, d.liIndustry].filter(Boolean).length;
  C.push({ id: "li-locind", cat: "Basics", status: li === 2 ? "pass" : li === 1 ? "warn" : "fail", title: li === 2 ? "Location and industry set" : `Set your ${[d.liLocation ? null : "location", d.liIndustry ? null : "industry"].filter(Boolean).join(" and ")}`, detail: "Recruiters filter by both. LinkedIn reports listing your industry brings up to 9x more profile views." });
  const m = (d.liUrl || "").match(/linkedin\.com\/in\/([\w%-]+)/i);
  const slug = m ? m[1] : "";
  const custom = slug && !/-[0-9a-f]{6,}$/i.test(slug) && !/\d{5,}/.test(slug);
  C.push({ id: "li-url", cat: "Basics", status: custom ? "pass" : "warn", title: custom ? "Custom profile URL" : slug ? "URL still has LinkedIn's random characters" : "Add your profile URL to check it", detail: custom ? `linkedin.com/in/${slug} is short enough to put on your resume.` : "Under \"Edit public profile & URL\", change it to linkedin.com/in/yourname so it fits on your resume." });
  const conn = parseInt(String(d.liConnections).replace(/[^\d]/g, ""), 10);
  C.push({ id: "li-connections", cat: "Basics", status: isNaN(conn) ? "warn" : conn >= 50 ? "pass" : conn > 0 ? "warn" : "fail", title: isNaN(conn) ? "Enter your connection count" : `${conn}${conn >= 500 ? "+" : ""} connections`, detail: isNaN(conn) ? "Texas Tech's career center suggests at least 50." : conn >= 50 ? "Enough that your profile looks active. Keep connecting with classmates, coworkers and people in your field." : "Fewer than 50 can make a profile look inactive. Connect with classmates, coworkers, professors and people you meet." });
  const recs = parseInt(String(d.liRecs).replace(/[^\d]/g, ""), 10) || 0;
  C.push({ id: "li-recs", cat: "Basics", status: recs >= 1 ? "pass" : "warn", title: recs ? `${recs} recommendation${recs > 1 ? "s" : ""}` : "No recommendations yet", detail: recs ? "Third-party proof of your work." : "Ask a manager, professor or teammate who knows your work well to write one." });
  // Headline
  const generic = !head || /^(student|unemployed|seeking (new )?opportunities|looking for (work|a job|opportunities)|open to work|job seeker)\.?$/i.test(head);
  C.push({ id: "li-headline", cat: "Headline", status: !head ? "fail" : head.length > 220 ? "fail" : !generic && head.length >= 40 ? "pass" : "warn",
    title: !head ? "No headline" : head.length > 220 ? `Headline is ${head.length} characters` : generic || head.length < 40 ? "Headline is too thin" : `Headline: ${head.length} characters`,
    detail: !head ? "Your headline shows next to your name everywhere on LinkedIn. Write what you do and what you're targeting." : head.length > 220 ? "LinkedIn allows 220 characters. Trim it." : generic || head.length < 40 ? "Go beyond a bare title or \"Student\". Try: Title | 2–3 key skills | what you're targeting, e.g. \"Marketing Student | Social Media & Content Strategy\"." : "Descriptive and specific. Recruiters see this in search results." });
  if (d.liRole.trim()) {
    const ok = new RegExp(d.liRole.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(head);
    C.push({ id: "li-title", cat: "Headline", status: ok ? "pass" : "warn", title: ok ? "Headline uses your target title" : "Target title isn't in your headline", detail: ok ? "Recruiters search LinkedIn by job title." : `Recruiters search by title. Add "${esc(d.liRole.trim())}" to your headline if it describes you honestly.` });
  }
  // About
  const aw = words(about), ac = about.length;
  C.push({ id: "li-about", cat: "About", status: !about ? "fail" : ac > 2600 ? "fail" : aw >= 100 ? "pass" : aw >= 40 ? "warn" : "fail",
    title: !about ? "No About section" : ac > 2600 ? `About is ${ac} characters` : `About: ${aw} words`,
    detail: !about ? "Write a short introduction: what you're good at (with examples), what drives you, and what you're looking for." : ac > 2600 ? "LinkedIn cuts About off at 2,600 characters." : aw >= 100 ? "Enough room to show skills and results. Keep paragraphs short so it skims well." : "Add more: one or two examples of what you've done, and what you're looking for next." });
  if (about) {
    const first = /\b(I|I'm|I've|my|me)\b/.test(about);
    C.push({ id: "li-voice", cat: "About", status: first ? "pass" : "warn", title: first ? "Written in first person" : "Try first person", detail: first ? "Reads like you, not a press release." : "Career centers recommend writing About in first person (\"I help…\"), unlike a resume." });
    const nums = (about.match(/\d+%|\$\d|\b\d[\d,.]*\+?\b/g) || []).length;
    C.push({ id: "li-results", cat: "About", status: nums >= 1 ? "pass" : "warn", title: nums ? "About includes measurable results" : "Add a measurable result to About", detail: nums ? "Numbers make claims concrete." : "One number goes a long way: customers served, money raised, growth, time saved." });
    const goal = /(looking for|seeking|open to|interested in|reach out|connect with|let's connect|message me|feel free|happy to (chat|talk|connect)|get in touch)/i.test(about);
    C.push({ id: "li-goal", cat: "About", status: goal ? "pass" : "warn", title: goal ? "Says what you're looking for" : "Say what you're looking for", detail: goal ? "Readers know how to help you." : "End with what you want next (a role, field or connection) and invite people to reach out." });
    const fold = about.slice(0, 265);
    const hook = fold.split(/\n|(?<=[.!?])\s/)[0] || "";
    C.push({ id: "li-hook", cat: "About", status: hook.length >= 20 && !/^(i am a|i'm a|hello|hi,?|welcome|my name is)/i.test(hook.trim()) ? "pass" : "warn", title: "Opening line before \"see more\"", detail: `Only about the first two to three lines show before "see more". Yours opens: "${esc(hook.slice(0, 90))}${hook.length > 90 ? "…" : ""}". Lead with your value, not your name or title.` });
  }
  // Experience
  const dated = (exp.match(/\b(19|20)\d{2}\b|present/gi) || []).length;
  C.push({ id: "li-experience", cat: "Experience", status: !exp ? "fail" : dated >= 2 && words(exp) >= 40 ? "pass" : "warn",
    title: !exp ? "No experience listed" : dated >= 2 && words(exp) >= 40 ? "Experience has dates and descriptions" : "Experience needs more detail",
    detail: !exp ? "Add jobs, internships, volunteer roles and major projects, each with title, company and dates." : dated >= 2 && words(exp) >= 40 ? "Each role should have a title, company, dates and a short description." : "Give each role its dates and a description of what you accomplished, not just a title." });
  const expNums = (exp.replace(/\b(19|20)\d{2}\b/g, "").match(/\d+%|\$\d|\b\d[\d,.]*\+?\b/g) || []).length;
  if (exp) C.push({ id: "li-exp-numbers", cat: "Experience", status: expNums >= 2 ? "pass" : expNums === 1 ? "warn" : "fail", title: expNums ? `${expNums} number${expNums > 1 ? "s" : ""} in your experience` : "No results in your experience", detail: expNums >= 2 ? "Quantified work stands out." : "Quantify your work: team size, customers, events, growth, time saved." });
  C.push({ id: "li-current", cat: "Experience", status: /present|current/i.test(exp) ? "pass" : edu ? "pass" : "fail", title: /present|current/i.test(exp) ? "Shows a current position" : edu ? "No current role, but education is listed" : "No current position", detail: "LinkedIn reports a current position brings up to 8x more profile views. Between jobs? List current education, volunteering or freelance work." });
  C.push({ id: "li-education", cat: "Experience", status: edu ? "pass" : "warn", title: edu ? "Education listed" : "Add education", detail: edu ? "Include degree, field and graduation year." : "LinkedIn reports education brings up to 17x more messages from recruiters." });
  // Skills & keywords
  const skills = d.liSkills.split(/[,\n•·|;]+/).map(s => s.trim()).filter(Boolean);
  C.push({ id: "li-skills", cat: "Keywords", status: skills.length >= 10 ? "pass" : skills.length >= 5 ? "warn" : "fail", title: `${skills.length} skill${skills.length === 1 ? "" : "s"} listed`, detail: skills.length >= 10 ? "Recruiters search by skills. Pin your top 3, since only those show on your profile." : "Add 10–20 skills tied to your target role, using the exact words from job postings." });
  const all = [head, about, exp, d.liSkills, edu].join("\n");
  C.push(keywordCheck(all, d.liJob, 0.6, 0.35, "li-keywords"));
  // Tips
  const cl = countCliches(head + "\n" + about);
  if (cl.length) C.push({ id: "li-cliche", cat: "About", status: "warn", title: `Buzzwords: ${list(cl)}`, detail: "These appear on countless profiles. Show the quality with an example instead." });
  if (!d.liOpen) C.push({ id: "li-open", cat: "Basics", status: "warn", title: "Open to Work is off", detail: "If you're job hunting, turn it on. You can choose to show it to recruiters only." });
  return C.map(withRubric);
}
function renderLinkedIn() {
  liRead(); store.set("rp-linkedin", LI);
  $("#liHeadCount").textContent = `${LI.liHeadline.length}/220 characters`;
  $("#liAboutCount").textContent = `${LI.liAbout.length.toLocaleString()}/2,600 characters`;
  const checks = gradeLinkedIn(LI);
  const scored = checks.filter(c => !c.skip && c.w);
  const tw = scored.reduce((s, c) => s + c.w, 0);
  const score = Math.round(scored.reduce((s, c) => s + c.w * VAL[c.status], 0) / tw * 100);
  const letter = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const V = { A: ["All-star profile", "Keep it current as your work changes."], B: ["Strong profile", "A few fixes below will round it out."], C: ["Solid start", "Work through the red items first."], D: ["Needs work", "Start with your photo, headline and About."], F: ["Mostly empty", "Fill in the basics: photo, headline, About and experience."] };
  $("#liScore").innerHTML = `${score}<small>/100</small>`; $("#liGrade").textContent = letter;
  $("#liVerdict").textContent = V[letter][0]; $("#liVerdictText").textContent = V[letter][1];
  $("#liCats").innerHTML = ["Basics", "Headline", "About", "Experience", "Keywords"].map(cat => {
    const cs = scored.filter(c => c.cat === cat);
    if (!cs.length) return `<div class="cat"><span>${cat}</span><div class="bar"><i style="width:0"></i></div><span class="v">n/a</span></div>`;
    const w = cs.reduce((s, c) => s + c.w, 0), v = Math.round(cs.reduce((s, c) => s + c.w * VAL[c.status], 0) / w * 100);
    return `<div class="cat"><span>${cat}</span><div class="bar"><i style="width:${v}%"></i></div><span class="v">${v}</span></div>`;
  }).join("");
  const order = { fail: 0, warn: 1, pass: 2 };
  const shown = [...checks].sort((a, b) => (a.skip ? 1 : 0) - (b.skip ? 1 : 0) || order[a.status] - order[b.status] || b.w - a.w);
  $("#liChecks").innerHTML = shown.map(c => `<li><span class="chip ${c.skip ? "warn" : c.status}">${c.skip ? "tip" : c.status === "pass" ? "good" : c.status === "warn" ? "fix" : "fix!"}</span><div><h2 class="ck">${esc(c.title)}</h2><p>${c.html ? c.detail : esc(c.detail)}</p><p class="src">${sourceFor(c).length ? "Based on: " : "Common advice, not scored"}${sourceFor(c).map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${esc(n)}</a>`).join(" · ")}</p></div></li>`).join("");
  // Preview card
  const nm = LI.name || "Your name";
  $("#liPrevName").textContent = nm;
  $("#liAvatar").textContent = LI.liPhoto ? nm.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() : "?";
  $("#liAvatar").classList.toggle("on", !!LI.liPhoto);
  document.querySelector(".li-banner").classList.toggle("on", !!LI.liBanner);
  $("#liPrevHead").textContent = LI.liHeadline || "Your headline appears here";
  const a = LI.liAbout.trim();
  $("#liPrevAbout").textContent = a ? a.slice(0, 265).replace(/\s+\S*$/, "") + (a.length > 265 ? "… see more" : "") : "Your About section's first lines appear here.";
  $("#liFold").textContent = a.length > 265 ? "Approximately what shows before \"see more\" on desktop." : "";
}
let liDeb;
$("#liForm").addEventListener("input", () => { liExample = false; $("#liSampleTag").hidden = true; clearTimeout(liDeb); liDeb = setTimeout(renderLinkedIn, 200); });
$("#liForm").addEventListener("change", () => renderLinkedIn());
$("#liExample").onclick = () => { LI = { ...LI_EXAMPLE, liJob: SAMPLES.job }; liExample = true; liFill(); renderLinkedIn(); };
$("#liClear").onclick = () => { LI = { name: "" }; liExample = false; liFill(); renderLinkedIn(); };

/* LinkedIn "Save to PDF" import (best effort; the export layout varies) */
function parseLinkedInPdf(text) {
  const lines = text.split("\n").map(l => l.trim());
  const H = ["Contact", "Top Skills", "Languages", "Certifications", "Honors-Awards", "Summary", "Experience", "Education", "Publications", "Patents", "Projects", "Volunteer Experience"];
  const idx = {}; lines.forEach((l, i) => { if (H.includes(l) && idx[l] == null) idx[l] = i; });
  const block = name => {
    if (idx[name] == null) return "";
    const start = idx[name] + 1;
    const next = Object.values(idx).filter(i => i > idx[name]).sort((a, b) => a - b)[0] ?? lines.length;
    return lines.slice(start, next).filter(l => !/^Page \d+ of \d+$/i.test(l)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  };
  const out = {};
  const url = text.match(/linkedin\.com\/in\/[\w%-]+/i); if (url) out.liUrl = url[0];
  out.liAbout = block("Summary").replace(/\n(?!\n)/g, " ").replace(/ {2,}/g, " ");
  out.liExp = block("Experience");
  out.liEdu = block("Education").split("\n").filter(Boolean).slice(0, 3).join(" · ");
  const anchor = idx["Summary"] ?? idx["Experience"];
  if (anchor != null) {
    const sideEnd = Math.max(-1, ...["Contact", "Top Skills", "Languages", "Certifications", "Honors-Awards"].filter(h => idx[h] != null && idx[h] < anchor).map(h => idx[h]));
    const pre = lines.slice(0, anchor).filter(Boolean);
    const tail = pre.slice(-3);
    if (tail.length === 3) { out.name = tail[0]; out.liHeadline = tail[1]; out.liLocation = true; }
    else if (tail.length === 2) { out.name = tail[0]; out.liHeadline = tail[1]; }
  }
  const skip = new Set([out.name, out.liHeadline].filter(Boolean));
  const top = block("Top Skills").split("\n").filter(l => l && !skip.has(l));
  if (anchor != null && idx["Top Skills"] != null && idx["Top Skills"] < anchor) { const loc = lines.slice(0, anchor).filter(Boolean).slice(-1)[0]; if (loc) skip.add(loc); }
  const sk = top.filter(l => !skip.has(l)).slice(0, 5);
  if (sk.length) out.liSkills = sk.join(", ");
  return out;
}
async function handleLiFile(file) {
  if (!file) return;
  const st = $("#liStatus");
  if (!/\.pdf$/i.test(file.name)) { st.textContent = "Drop the PDF from LinkedIn's More → Save to PDF."; return; }
  st.textContent = "Reading your profile…";
  try {
    const text = await readPdf(await file.arrayBuffer());
    const got = parseLinkedInPdf(text);
    const found = Object.keys(got).filter(k => got[k]);
    if (!found.length) { st.textContent = "Couldn't find LinkedIn sections in that PDF. Paste your sections instead."; return; }
    LI = { ...LI, ...got, liPhoto: LI.liPhoto, liConnections: LI.liConnections };
    liExample = false; liFill(); renderLinkedIn();
    st.textContent = "Imported. Check each field: the export only includes your top 3 skills, and it doesn't show your photo, banner, connections or recommendations, so fill those in.";
  } catch { st.textContent = "Couldn't read that PDF here. Paste your sections instead."; }
}
const liDz = $("#liDrop");
["dragenter", "dragover"].forEach(ev => liDz.addEventListener(ev, e => { e.preventDefault(); liDz.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => liDz.addEventListener(ev, e => { e.preventDefault(); liDz.classList.remove("over"); }));
liDz.addEventListener("drop", e => handleLiFile(e.dataTransfer.files[0]));
$("#liFile").addEventListener("change", e => { handleLiFile(e.target.files[0]); e.target.value = ""; });
liFill(); renderLinkedIn();

/* ================= Shared helpers for the toolkit ================= */
function builderText(kind) {
  const keep = B.mode; B.mode = kind;
  const t = blocksToText(kind === "resume" ? resumeBlocks(B.r) : letterBlocks(B.l));
  B.mode = keep; return t;
}
function currentDoc(kind) {
  const g = $("#resumeText").value;
  if (mode === kind && g.trim()) return g;
  return builderText(kind);
}
const BUL_RE = /^\s*([-•*▪◦·–]|\d+[.)])\s+/;
function parseResume(text) {
  const lines = text.split("\n");
  const out = { lines, roles: [], skills: [], bullets: [], name: "", email: "", phone: "", linkedin: "", summary: "" };
  out.name = (lines.find(l => l.trim()) || "").trim();
  out.email = (text.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0].toLowerCase();
  out.phone = ((text.match(/(\+?\d[\d\s().-]{8,}\d)/) || [""])[0]).replace(/\D/g, "");
  out.linkedin = ((text.match(/linkedin\.com\/in\/([\w%-]+)/i) || [, ""])[1] || "").toLowerCase();
  let cur = null, section = "";
  lines.forEach((L, i) => {
    const t = L.trim(); if (!t) return;
    const isHead = /^[A-Z0-9 &/,'().-]{3,}$/.test(t) && /[A-Z]{3}/.test(t) && !/\d{4}/.test(t);
    if (isHead) { section = t.toUpperCase(); cur = null; return; }
    if (BUL_RE.test(L)) {
      const b = { text: L.replace(BUL_RE, "").trim(), line: i, role: cur };
      out.bullets.push(b); if (cur) cur.bullets.push(b); return;
    }
    const dated = /\b(19|20)\d{2}\b|present/i.test(t);
    if (t.includes(" | ") && dated || (dated && /,/.test(t) && !/@/.test(t) && t.length < 140 && /EXPERIENCE|EMPLOYMENT|WORK|PROJECT|LEADERSHIP|VOLUNTEER/.test(section))) {
      const [left, right = ""] = t.split(" | ");
      const parts = left.split(/,\s*/);
      cur = { title: parts[0] || "", company: parts[1] || "", dates: right || (t.match(/((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\.?\s*)?(19|20)\d{2}.*$/i) || [""])[0], years: (t.match(/\b(19|20)\d{2}\b/g) || []), line: i, bullets: [], section };
      if (/EDUCATION/.test(section)) cur.edu = true; else out.roles.push(cur);
      return;
    }
    if (/SKILL/.test(section)) out.skills.push(...t.split(/[,·;|•]+/).map(s => s.replace(/\(.*?\)/g, "").trim()).filter(s => s.length > 1));
    if (/SUMMARY|PROFILE/.test(section)) out.summary += t + " ";
  });
  return out;
}
const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
function chk(status, title, detail) { return { status, title, detail }; }
function renderSimpleChecks(el, checks) {
  const order = { fail: 0, warn: 1, info: 2, pass: 3 };
  el.innerHTML = [...checks].sort((a, b) => order[a.status] - order[b.status]).map(c => `<li><span class="chip ${c.status === "info" ? "warn" : c.status}">${c.status === "pass" ? "match" : c.status === "info" ? "note" : c.status === "warn" ? "check" : "fix!"}</span><div><h2 class="ck">${esc(c.title)}</h2><p>${c.html ? c.detail : esc(c.detail || "")}</p></div></li>`).join("");
}

/* ================= 1. Match check ================= */
function matchSrc(which) {
  const [kind, from] = which.split("-");
  const g = $("#resumeText").value;
  const txt = from === "grader" ? (mode === kind ? g : "") : builderText(kind);
  $(kind === "resume" ? "#mResume" : "#mLetter").value = txt;
  if (from === "grader" && !txt.trim()) toast(`The Grade page has no ${kind === "resume" ? "resume" : "cover letter"} loaded right now.`);
  runMatch();
}
function runMatch() {
  const R = parseResume($("#mResume").value), Lt = $("#mLetter").value, L = LI || {};
  $("#mLi").innerHTML = `<b>HEADLINE</b><span>${esc(L.liHeadline || "–")}</span><b>EXPERIENCE</b><span>${esc((L.liExp || "–").slice(0, 220))}${(L.liExp || "").length > 220 ? "…" : ""}</span><b>SKILLS</b><span>${esc(L.liSkills || "–")}</span>`;
  const C = [];
  const hasR = $("#mResume").value.trim(), hasL = Lt.trim(), hasLi = (L.liExp || L.liHeadline || "").trim();
  if (!hasR) { renderSimpleChecks($("#mChecks"), [chk("warn", "Add your resume", "Load it from the Grade page or the Builder using the links above.")]); $("#mScore").innerHTML = `–<small></small>`; $("#mVerdict").textContent = "Nothing to compare yet"; $("#mVerdictText").textContent = ""; return; }
  // Names
  const letterName = hasL ? (Lt.trim().split("\n").filter(Boolean).slice(-2).find(l => /^[A-Z][a-z]+(\s+[A-Z][a-z.'-]+)+$/.test(l.trim())) || "").trim() : "";
  const names = [["resume", R.name], ["cover letter", letterName], ["LinkedIn", L.name]].filter(([, n]) => n);
  const nset = new Set(names.map(([, n]) => norm(n)));
  if (names.length > 1) C.push(nset.size === 1 ? chk("pass", "Your name matches everywhere", names.map(([w, n]) => `${w}: ${n}`).join(" · ")) : chk("fail", "Your name is written differently", names.map(([w, n]) => `${w}: "${n}"`).join(" · ") + ". Use the same version, including any middle initial or nickname."));
  // Contact
  if (hasL) {
    const le = (Lt.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0].toLowerCase(), lp = ((Lt.match(/(\+?\d[\d\s().-]{8,}\d)/) || [""])[0]).replace(/\D/g, "");
    if (le && R.email) C.push(le === R.email ? chk("pass", "Same email on resume and letter", le) : chk("fail", "Different email addresses", `Resume: ${R.email} · Letter: ${le}. A recruiter may reply to the wrong one.`));
    if (lp && R.phone) C.push(lp.slice(-10) === R.phone.slice(-10) ? chk("pass", "Same phone number on resume and letter", "") : chk("fail", "Different phone numbers", "Make sure both list the number you answer."));
  }
  const liSlug = ((L.liUrl || "").match(/linkedin\.com\/in\/([\w%-]+)/i) || [, ""])[1].toLowerCase();
  if (R.linkedin && liSlug) C.push(R.linkedin === liSlug ? chk("pass", "Resume links to your LinkedIn URL", `linkedin.com/in/${liSlug}`) : chk("fail", "Resume links to a different LinkedIn URL", `Resume: linkedin.com/in/${R.linkedin} · Profile: linkedin.com/in/${liSlug}. The resume link may be broken.`));
  else if (liSlug && !R.linkedin) C.push(chk("warn", "Resume doesn't link to your LinkedIn", `Add linkedin.com/in/${liSlug} to your contact line.`));
  // Roles vs LinkedIn
  if (hasLi) {
    const exp = (L.liExp || "").toLowerCase();
    R.roles.forEach(r => {
      if (!r.company) return;
      const ci = exp.indexOf(r.company.toLowerCase());
      if (ci < 0) { C.push(chk("fail", `${r.company} isn't on your LinkedIn`, `Your resume lists ${r.title} at ${r.company}. Recruiters notice when a job appears in one place and not the other.`)); return; }
      const near = exp.slice(Math.max(0, ci - 250), ci + 350);
      const titleOk = r.title && near.includes(r.title.toLowerCase());
      const yearsOk = !r.years.length || r.years.every(y => near.includes(y));
      if (titleOk && yearsOk) C.push(chk("pass", `${r.title} at ${r.company} matches`, `Title and dates (${r.dates || r.years.join("–")}) line up.`));
      else C.push(chk("warn", `${r.company}: ${!titleOk ? "title" : ""}${!titleOk && !yearsOk ? " and " : ""}${!yearsOk ? "dates" : ""} may differ`, `Resume says ${r.title}${r.dates ? `, ${r.dates}` : ""}. Check that LinkedIn shows the same ${!titleOk ? "title" : ""}${!titleOk && !yearsOk ? " and " : ""}${!yearsOk ? "years" : ""}.`));
    });
    const liSk = (L.liSkills || "").split(/[,\n•·|;]+/).map(s => norm(s)).filter(Boolean);
    if (R.skills.length && liSk.length) {
      const missing = R.skills.filter(s => !liSk.some(k => k.includes(norm(s)) || norm(s).includes(k)));
      C.push(missing.length ? chk("warn", `${missing.length} resume skill${missing.length > 1 ? "s aren't" : " isn't"} on LinkedIn`, `Add to LinkedIn so recruiters searching for them find you: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}.`) : chk("pass", "Every resume skill is on LinkedIn", ""));
    }
    const headTitle = (L.liHeadline || "").split(/[|·•–-]/)[0].trim();
    const recent = R.roles[0];
    if (headTitle && recent && norm(headTitle) !== norm(recent.title) && !norm($("#mResume").value).includes(norm(headTitle))) C.push(chk("info", `LinkedIn headline says "${headTitle}"`, `Your resume never uses that title (most recent: ${recent.title}). That's fine if it's the job you're targeting; just make sure your summary explains the move.`));
  } else C.push(chk("info", "No LinkedIn profile to compare", "Fill in the LinkedIn checker to compare your profile too."));
  // Letter claims
  if (hasL) {
    const body = $("#mResume").value + "\n" + (L.liAbout || "") + "\n" + (L.liExp || "");
    const claims = [...new Set((Lt.replace(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g, "").replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(st|nd|rd|th)?\b/gi, "").replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, "").match(/\$?\d[\d,.]*\+?%?/g) || []).map(n => n.replace(/[.,]+$/, "")).filter(n => !/^(19|20)\d{2}$/.test(n) && n.replace(/\D/g, "").length && !/^\d$/.test(n)))];
    const unbacked = claims.filter(n => !body.includes(n.replace(/[.,]$/, "")));
    if (claims.length) C.push(unbacked.length ? chk("warn", `${unbacked.length} number${unbacked.length > 1 ? "s" : ""} in your letter ${unbacked.length > 1 ? "aren't" : "isn't"} on your resume`, `Check these figures: ${unbacked.join(", ")}. Interviewers may ask about anything in the letter, so make sure it matches your resume.`) : chk("pass", "Every number in your letter is backed by your resume", claims.join(", ")));
    const employers = R.roles.map(r => r.company).filter(Boolean);
    const mentioned = employers.filter(c => Lt.toLowerCase().includes(c.toLowerCase()));
    if (employers.length && !mentioned.length) C.push(chk("info", "Your letter doesn't name any past employer", "Naming where a proof story happened (\"At BrightMart, I…\") makes it concrete and ties it to your resume."));
  }
  renderSimpleChecks($("#mChecks"), C);
  const issues = C.filter(c => c.status === "fail" || c.status === "warn").length;
  $("#mScore").innerHTML = `${issues}<small> issue${issues === 1 ? "" : "s"}</small>`;
  $("#mVerdict").textContent = issues === 0 ? "Consistent story" : issues <= 2 ? "Nearly consistent" : "Some details disagree";
  $("#mVerdictText").textContent = `${C.filter(c => c.status === "pass").length} things match across your documents.`;
}
document.querySelectorAll("[data-msrc]").forEach(b => b.onclick = () => matchSrc(b.dataset.msrc));
["mResume", "mLetter"].forEach(id => $("#" + id).addEventListener("input", () => { clearTimeout(window._mDeb); window._mDeb = setTimeout(runMatch, 250); }));
function initMatch() {
  if (!$("#mResume").value.trim()) $("#mResume").value = currentDoc("resume");
  if (!$("#mLetter").value.trim()) $("#mLetter").value = currentDoc("letter");
  runMatch();
}

/* ================= 2. What the robot sees ================= */
let ROBOT_TEXT = "";
async function zipNames(buf) {
  const u8 = new Uint8Array(buf), dv = new DataView(buf), dec = new TextDecoder();
  let eo = -1; for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eo = i; break; }
  if (eo < 0) return [];
  const count = dv.getUint16(eo + 10, true); let p = dv.getUint32(eo + 16, true); const names = [];
  for (let n = 0; n < count; n++) { const nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true); names.push(dec.decode(u8.subarray(p + 46, p + 46 + nl))); p += 46 + nl + el + cl; }
  return names;
}
async function robotRead(file) {
  const st = $("#rStatus"), name = file.name.toLowerCase(), warns = [];
  st.textContent = `Reading ${file.name}…`;
  let text = "";
  try {
    if (name.endsWith(".pdf")) {
      text = await readPdf(await file.arrayBuffer());
      const s = window.LAST_PDF || {};
      if (s.colRows >= 4) warns.push(chk("fail", "Two columns detected", `${s.colRows} lines have text side by side. Many systems read straight across, mixing your sidebar into your experience. Look at the extracted text: if lines from different sections are glued together, switch to a one-column layout.`));
      else warns.push(chk("pass", "Single-column layout", "Text reads top to bottom in one stream."));
      if (s.images) warns.push(chk("warn", `${s.images} image${s.images > 1 ? "s or icons" : " or icon"} found`, "Systems can't read text inside images. Icons for phone, email or skills are lost or become stray symbols. Use plain text labels."));
    } else if (name.endsWith(".docx")) {
      const buf = await file.arrayBuffer();
      text = cleanImported(await readDocx(buf.slice(0)));
      const names = await zipNames(buf);
      const xml = await unzipEntry(buf.slice(0), "word/document.xml");
      if (/<w:tbl[ >]/.test(xml)) warns.push(chk("warn", "Table found", "Tables can merge cells into one run-on line. Check the extracted text; if columns blend together, replace the table with plain lines.")); else warns.push(chk("pass", "No tables", ""));
      if (/txbxContent/.test(xml)) warns.push(chk("fail", "Text boxes found", "Text inside text boxes is often skipped entirely. Move it into the main body."));
      const hf = names.filter(n => /^word\/(header|footer)\d*\.xml$/.test(n));
      let hfText = "";
      for (const n of hf) hfText += (await unzipEntry(buf.slice(0), n)).replace(/<[^>]+>/g, " ");
      if (/[\w.+-]+@[\w-]+\.\w+|\d{3}[\s.-]?\d{3}[\s.-]?\d{4}/.test(hfText)) warns.push(chk("fail", "Contact details are in the page header or footer", "Many systems skip headers and footers. Put your email and phone in the body, right under your name."));
      const media = names.filter(n => /^word\/media\//.test(n)).length;
      if (media) warns.push(chk("warn", `${media} image${media > 1 ? "s" : ""} or icon${media > 1 ? "s" : ""} found`, "Text inside images can't be read. Use plain text instead of icons."));
    } else { text = await file.text(); }
  } catch { st.textContent = "Couldn't read that file. Try saving it again as PDF or .docx."; return; }
  ROBOT_TEXT = text;
  if (!text.trim()) { warns.unshift(chk("fail", "No text found", "This looks like a scanned image or a design export. Hiring software would see a blank page. Export a text-based PDF from Word or Google Docs.")); }
  const junk = (text.match(/[\uE000-\uF8FF\uFFFD]/g) || []).length;
  if (junk) warns.push(chk("fail", `${junk} unreadable character${junk > 1 ? "s" : ""}`, "Highlighted in red in the extracted text. These usually come from icon fonts or special bullets. Replace them with plain text or simple bullets."));
  const long = text.split("\n").filter(l => (l.match(/\S+/g) || []).length > 45).length;
  if (long) warns.push(chk("warn", `${long} very long line${long > 1 ? "s" : ""}`, "Unusually long lines can mean columns were merged together. Check them in the extracted text."));
  // Recognized fields
  const R = parseResume(text);
  const city = (text.match(/\b[A-Z][a-zA-Z .]+,\s*[A-Z]{2}\b/) || [""])[0];
  const STD = { Summary: /^(summary|profile|professional summary|about)$/i, Experience: /^(experience|work experience|professional experience|employment|work history)$/i, Education: /^education$/i, Skills: /^(skills|technical skills|core skills|key skills)$/i, Projects: /^projects?$/i, Certifications: /^(certifications?|licenses)/i };
  const heads = text.split("\n").map(l => l.trim()).filter(l => /^[A-Z0-9 &/,'().-]{3,}$/.test(l) && /[A-Z]{3}/.test(l) && !/\d{4}/.test(l) && l.split(" ").length <= 4);
  const found = Object.keys(STD).filter(k => heads.some(h => STD[k].test(h)) || text.split("\n").some(l => STD[k].test(l.trim())));
  const odd = heads.filter(h => !Object.values(STD).some(re => re.test(h)) && !/^(leadership|activities|volunteer|awards|honors|languages|interests|leadership & activities|education & training|key skills & achievements|technical skills|core skills)/i.test(h) && h !== (R.name || "").toUpperCase());
  if (odd.length) warns.push(chk("warn", `Unusual heading${odd.length > 1 ? "s" : ""}: ${odd.slice(0, 3).join(", ")}`, "Systems map sections by standard names. Use Experience, Education, Skills, Summary or Projects."));
  const row = (k, v) => `<dt>${k}</dt><dd class="${v ? "" : "no"}">${v ? esc(v) : "Not found"}</dd>`;
  $("#rFields").innerHTML = row("Name", R.name.slice(0, 60)) + row("Email", R.email) + row("Phone", R.phone ? R.phone.replace(/(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3") : "") + row("Location", city) + row("LinkedIn", R.linkedin ? "linkedin.com/in/" + R.linkedin : "") + row("Sections", found.join(", ")) + row("Jobs with dates", R.roles.length ? String(R.roles.length) : "") + row("Bullets", R.bullets.length ? String(R.bullets.length) : "");
  if (!R.email || !R.phone) warns.push(chk("fail", "Contact details not recognized", "If your email or phone is in the file but not listed above, it's probably in a header, image or text box. Move it to plain text under your name."));
  renderSimpleChecks($("#rWarn"), warns);
  $("#rText").innerHTML = text.split("\n").map(l => `<span>${esc(l).replace(/[\uE000-\uF8FF\uFFFD]/g, m => `<mark>${m === "\uFFFD" ? "?" : "□"}</mark>`) || " "}</span>`).join("");
  $("#rOut").hidden = false;
  st.textContent = `Showing ${file.name}. Nothing was uploaded.`;
  if (text.trim()) {
    const cur = $("#resumeText").value, clean = cleanImported(text);
    if (cur.trim() && cur !== clean) MK.history.push(cur);
    setMode("resume"); $("#resumeText").value = clean; $("#sampleTag").hidden = true; grade(); runTailor();
    st.textContent = `Showing ${file.name}. Nothing was uploaded. Step 2 below now uses this file.`;
  }
}
const rDz = $("#rDrop");
["dragenter", "dragover"].forEach(ev => rDz.addEventListener(ev, e => { e.preventDefault(); rDz.classList.add("over"); }));
["dragleave", "drop"].forEach(ev => rDz.addEventListener(ev, e => { e.preventDefault(); rDz.classList.remove("over"); }));
rDz.addEventListener("drop", e => e.dataTransfer.files[0] && robotRead(e.dataTransfer.files[0]));
$("#rFile").addEventListener("change", e => { if (e.target.files[0]) robotRead(e.target.files[0]); e.target.value = ""; });
$("#rToGrader").onclick = () => loadText(cleanImported(ROBOT_TEXT), "resume");

/* ================= 3. Bullet coach ================= */
let coachLine = null, coachCat = "Improving";
const ING = { led: "leading", built: "building", wrote: "writing", won: "winning", cut: "cutting", grew: "growing", oversaw: "overseeing", ran: "running", sold: "selling", taught: "teaching", made: "making", drove: "driving", set: "setting", spoke: "speaking", got: "getting", kept: "keeping", held: "holding", found: "finding", paid: "paying", gave: "giving", took: "taking", brought: "bringing", bought: "buying", saw: "seeing", sent: "sending", spent: "spending", met: "meeting", did: "doing", had: "having", put: "putting", began: "beginning" };
function gerund(v) {
  const w = v.toLowerCase().trim();
  if (ING[w]) return ING[w];
  if (/ied$/.test(w)) return w.slice(0, -3) + "ying";
  if (/ed$/.test(w)) return w.slice(0, -2) + "ing";
  if (/e$/.test(w) && !/ee$/.test(w)) return w.slice(0, -1) + "ing";
  return w + "ing";
}
function coachBuild() {
  const v = $("#cVerb").value.trim(), what = $("#cWhat").value.trim(), scale = $("#cScale").value.trim(), how = $("#cHow").value.trim(), res = $("#cResult").value.trim();
  const V = v ? cap(v) : "[Verb]";
  const core = [what || "[what you did]", scale, how].filter(Boolean).join(" ");
  const a = `${V} ${core}${res ? ", " + res.replace(/^[,\s]+/, "") : ""}`.replace(/\s+/g, " ").replace(/\s+,/g, ",");
  const resCore = res ? cap(res.replace(/^(cutting|reducing|raising|increasing|growing|saving|improving|boosting|lowering)\s/i, (m, g) => g.replace(/ing$/i, "ed").replace(/^cutted/i, "Cut").replace(/^growed/i, "Grew") + " ").replace(/^[,\s]+/, "")) : "";
  const coreB = core.replace(/^and (\w+)/i, (m, w) => "and " + gerund(w).toLowerCase());
  const b = res ? `${resCore} by ${v ? gerund(v) : "[doing]"} ${coreB}`.replace(/\s+/g, " ") : "Add what changed (step 5) to see the result-first version.";
  $("#cOutA").textContent = a; $("#cOutB").textContent = b;
  const orig = $("#cOrig").value.trim();
  $("#cWas").innerHTML = orig ? `Was: <del>${esc(orig)}</del>` : "";
  const C = [];
  C.push(v && (STRONG_VERBS.has(v.toLowerCase()) || /ed$/i.test(v)) ? chk("pass", "Starts with an action verb", "") : chk("warn", "Pick an action verb", "Past tense for past jobs, present tense for your current one."));
  C.push(/\d|%|\$/.test(scale + res + what) ? chk("pass", "Includes a number", "") : chk("warn", "Add a number", "How many, how much, how often, or how fast? An honest estimate is fine."));
  C.push(res ? chk("pass", "Shows a result", "") : chk("warn", "Add the result", "What was better afterward? Time saved, more sales, fewer errors, happier customers."));
  const wc = (a.match(/\S+/g) || []).length;
  C.push(wc <= 30 ? chk("pass", `${wc} words`, "Short enough to skim.") : chk("warn", `${wc} words`, "Trim to under about 30 words: drop the method or shorten the scale."));
  renderSimpleChecks($("#cChecks"), C);
}
function coachFill() {
  const t = $("#resumeText").value;
  const R = parseResume(mode === "resume" ? t : "");
  const flagged = R.bullets.map(b => ({ ...b, bad: !/\d|%|\$/.test(b.text) || /responsible for|helped|duties|worked on|in charge|various/i.test(b.text) }));
  flagged.sort((a, b) => (b.bad ? 1 : 0) - (a.bad ? 1 : 0));
  $("#cPick").innerHTML = `<option value="">${flagged.length ? "Choose a bullet…" : "No resume loaded on the Grade page"}</option>` + flagged.map(b => `<option value="${b.line}">${b.bad ? "⚑ " : ""}${esc(b.text.slice(0, 90))}</option>`).join("");
}
$("#cPick").onchange = e => {
  const n = e.target.value; coachLine = n === "" ? null : +n;
  if (coachLine == null) return;
  const L = $("#resumeText").value.split("\n")[coachLine].replace(BUL_RE, "").trim();
  $("#cOrig").value = L;
  const m = L.match(/^(\w+)\s+(.*)$/);
  const first = m ? m[1].toLowerCase() : "";
  if (m && (STRONG_VERBS.has(first) || /ed$/.test(first))) { $("#cVerb").value = cap(first); $("#cWhat").value = m[2].replace(/,.*$/, ""); }
  else { $("#cVerb").value = ""; $("#cWhat").value = L.replace(/^(responsible for|helped with|helped|duties included|worked on|in charge of|i was in charge of)\s*/i, ""); }
  ["cScale", "cHow", "cResult"].forEach(id => $("#" + id).value = "");
  coachBuild();
};
$("#cOrig").addEventListener("input", () => { coachLine = null; $("#cPick").value = ""; coachBuild(); });
["cVerb", "cWhat", "cScale", "cHow", "cResult"].forEach(id => $("#" + id).addEventListener("input", coachBuild));
function coachCats() {
  $("#cCats").innerHTML = Object.keys(VERBS).map(k => `<button type="button" aria-pressed="${k === coachCat}" data-cat="${k}">${k}</button>`).join("");
  $("#cVerbs").innerHTML = VERBS[coachCat].split(/,\s*/).map(v => `<button type="button" data-verb="${cap(v)}">${cap(v)}</button>`).join("");
}
$("#cCats").addEventListener("click", e => { const c = e.target.dataset.cat; if (c) { coachCat = c; coachCats(); } });
$("#cVerbs").addEventListener("click", e => { const v = e.target.dataset.verb; if (v) { $("#cVerb").value = v; coachBuild(); } });
document.querySelectorAll("[data-ccopy]").forEach(b => b.onclick = () => copyText($(b.dataset.ccopy === "A" ? "#cOutA" : "#cOutB").textContent));
document.querySelectorAll("[data-cuse]").forEach(b => b.onclick = () => {
  const out = $(b.dataset.cuse === "A" ? "#cOutA" : "#cOutB").textContent;
  if (/\[/.test(out) || /^Add what changed/.test(out)) { toast("Fill in the steps first."); return; }
  const t = $("#resumeText").value;
  if (coachLine == null || mode !== "resume") { copyText(out); toast("Copied. Pick a bullet from your resume above to replace it directly."); return; }
  const ls = t.split("\n"); const prefix = (ls[coachLine].match(BUL_RE) || ["- "])[0];
  MK.history.push(t); ls[coachLine] = prefix + out; setDoc(ls.join("\n")); coachFill(); $("#cPick").value = String(coachLine);
  toast("Replaced in your resume. Undo is on the Grade page.");
});

/* ================= 4. Tailor to a job ================= */
let TL_ORDER = null;
function requirements(job) {
  const parts = job.replace(/\r/g, "").split(/\n|;|•|(?<=[.!?])\s+(?=[A-Z])/).map(s => s.replace(/^[-*\s]+|[.\s]+$/g, "").replace(/^(requirements|qualifications|nice to have|responsibilities|what you'll do|you will|about you)\s*:\s*/i, "").trim()).filter(Boolean);
  const out = [];
  parts.forEach(p => {
    const w = (p.match(/\S+/g) || []).length;
    if (w < 3 || w > 45) return;
    if (!/(experience|skill|ability|able to|proficien|familiar|knowledge|degree|years?|must|required|preferred|nice to have|you will|you'll|manage|coordinate|work (with|cross)|strong|excellent|comfortable|write|track|prepare|support|plan|analy|report|budget|lead)/i.test(p)) return;
    if (/^(we're looking|we are looking|join us|about us)/i.test(p) && !/require/i.test(p)) return;
    const terms = units(p, 10).filter(t => !/^(you|your|our|their|we|basics?|brands?)$/.test(t));
    const yrs = p.match(/(\d+)\s*(?:\+|-|–|to)?\s*(?:\d+\s*)?\+?\s*years?/i);
    if (terms.length) out.push({ text: p, terms, years: yrs ? +yrs[1] : 0 });
  });
  return out.slice(0, 20);
}
// Phrases weigh double; a related word counts half.
function relScore(text, terms) { return terms.reduce((s, t) => s + (/[\s-]/.test(t) ? (phraseIn(text, t) ? 2 : 0) : hasWord(text, t) ? 1 : synonymHit(text, t) ? 0.5 : 0), 0); }
function relMax(terms) { return terms.reduce((s, t) => s + (/[\s-]/.test(t) ? 2 : 1), 0); }
function resumeYears(R) {
  const now = new Date().getFullYear(); let y = 0;
  R.roles.forEach(r => { const ys = r.years.map(Number); if (!ys.length) return; const end = /present|current|now/i.test(r.dates) ? now : Math.max(...ys); y += Math.max(0.25, end - Math.min(...ys)); });
  return Math.round(y * 10) / 10;
}
$("#tlJob").addEventListener("input", () => { $("#jobText").value = $("#tlJob").value; clearTimeout(window.tlDeb); window.tlDeb = setTimeout(() => { grade(); runTailor(); }, 300); });
function runTailor() {
  if (document.activeElement !== $("#tlJob")) $("#tlJob").value = $("#jobText").value;
  const t = mode === "resume" ? $("#resumeText").value : "", job = $("#jobText").value;
  if (!t.trim() || !job.trim()) {
    $("#tlStats").innerHTML = ""; $("#tlTable").innerHTML = `<tbody><tr><td class="empty">Drop your resume in Step 1 (or load it on the <a href="#grade">Grade page</a>) and paste the job posting above.</td></tr></tbody>`; $("#tlOrder").innerHTML = ""; $("#tlApply").disabled = true; return;
  }
  const R = parseResume(t), reqs = requirements(job);
  const listed = (R.skills.join(" ") + " " + R.summary);
  let proven = 0, mentioned = 0, missing = 0;
  const yrsHave = resumeYears(R);
  const rows = reqs.map(rq => {
    const max = relMax(rq.terms), need = Math.min(2, Math.max(1, max * 0.34));
    let best = null, bestS = 0;
    R.bullets.forEach(b => { const s = relScore(b.text, rq.terms); if (s > bestS) { bestS = s; best = b; } });
    let status, note = "";
    if (rq.years) {
      const rel = R.roles.filter(r => relScore(r.title + " " + r.bullets.map(b => b.text).join(" "), rq.terms) >= 1);
      note = `About ${yrsHave} year${yrsHave === 1 ? "" : "s"} across your roles${rel.length ? ", including " + rel.map(r => r.title).join(", ") : ""}. The posting asks for ${rq.years}+.`;
      if (yrsHave >= rq.years && rel.length) { status = "Proven"; proven++; } else if (yrsHave >= rq.years * 0.5) { status = "Mentioned"; mentioned++; } else { status = "Missing"; missing++; }
      return { rq, best: null, status, note };
    }
    if (best && bestS >= need && bestS >= 1 && /\d|%|\$/.test(best.text)) { status = "Proven"; proven++; }
    else if (best && bestS >= 1 || relScore(listed, rq.terms) >= 1) { status = "Mentioned"; mentioned++; }
    else { status = "Missing"; missing++; }
    return { rq, best: bestS >= 1 ? best : null, status, note };
  });
  $("#tlStats").innerHTML = [["Requirements", reqs.length], ["Proven", proven], ["Mentioned", mentioned], ["Missing", missing]].map(([k, v]) => `<div class="sheet stat"><b>${v}</b><span>${k}</span></div>`).join("");
  const cls = { Proven: "pass", Mentioned: "warn", Missing: "fail" };
  $("#tlTable").innerHTML = `<thead><tr><th>Requirement from the posting</th><th>Status</th><th>Your best evidence</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.rq.text)}</td><td><span class="chip ${cls[r.status]}" style="padding:3px 8px">${r.status}</span></td><td>${r.note ? esc(r.note) : r.best ? esc(r.best.text) + (r.status === "Mentioned" ? `<br><span class="note">Add a number or result to prove it.</span>` : "") : r.status === "Mentioned" ? `<span class="note">Only in your skills or summary. Add a bullet that shows it.</span>` : `<span class="note">Not on your resume. Add it if it's true for you, or use the <a href="#coach">bullet coach</a>.</span>`}</td></tr>`).join("") || `<tr><td colspan="3" class="empty">Couldn't find clear requirements in this posting.</td></tr>`}</tbody>`;
  // Reorder
  const allTerms = reqs.flatMap(r => r.terms);
  TL_ORDER = R.roles.filter(r => r.bullets.length > 1).map(r => {
    const scored = r.bullets.map((b, i) => ({ b, i, s: relScore(b.text, allTerms) + (/\d|%|\$/.test(b.text) ? 0.5 : 0) }));
    const sorted = [...scored].sort((x, y) => y.s - x.s || x.i - y.i);
    return { role: r, sorted, changed: sorted.some((x, k) => x.i !== k) };
  });
  const any = TL_ORDER.some(o => o.changed);
  $("#tlOrder").innerHTML = TL_ORDER.length ? TL_ORDER.map(o => `<div style="margin-bottom:12px"><b>${esc(o.role.title)}${o.role.company ? ", " + esc(o.role.company) : ""}</b>${o.changed ? "" : ` <span class="note">already in a good order</span>`}<ol style="margin:6px 0 0;padding-left:22px">${o.sorted.map((x, k) => `<li>${esc(x.b.text)} ${x.i !== k ? `<span class="note">(${x.i > k ? "↑ up " + (x.i - k) : "↓ down " + (k - x.i)})</span>` : ""}</li>`).join("")}</ol></div>`).join("") : `<p class="note">No roles with several bullets found.</p>`;
  $("#tlApply").disabled = !any;
}
$("#tlApply").onclick = () => {
  if (!TL_ORDER) return;
  const t = $("#resumeText").value, ls = t.split("\n");
  TL_ORDER.forEach(o => { if (!o.changed) return; const slots = o.role.bullets.map(b => b.line).sort((a, b) => a - b); const orig = slots.map(n => t.split("\n")[n]); o.sorted.forEach((x, k) => ls[slots[k]] = orig[x.i]); });
  MK.history.push(t); setDoc(ls.join("\n")); runTailor(); toast("Bullets reordered. Undo is on the Grade page.");
};

/* ================= 5. Interview prep ================= */
const BEHAV = {
  Leading: "Tell me about a time you had to get people to follow your lead without formal authority.",
  Building: "Tell me about something you built from scratch. How did you decide what to do first?",
  Improving: "Describe a process you improved. How did you know it was actually better?",
  Growing: "Tell me about a goal you beat. What did you do differently from others?",
  Analyzing: "Tell me about a time data changed your mind about something.",
  Communicating: "Tell me about a time you had to persuade someone who disagreed with you.",
  Organizing: "Tell me about a time you had several deadlines at once. How did you prioritize?",
  Helping: "Tell me about a difficult customer or coworker and how you handled it."
};
const VERB_CAT = {}; Object.entries(VERBS).forEach(([k, v]) => v.toLowerCase().split(/,\s*/).forEach(x => VERB_CAT[x] = k));
let IQ = [], IA = store.get("rp-star", {});
function buildQuestions() {
  const t = currentDoc("resume"), R = parseResume(t);
  const Q = [];
  Q.push({ q: "Tell me about yourself.", why: "Almost every interview opens with this. Give a 60–90 second version of your summary: where you are, your best result, and why this role is next.", hint: { s: R.summary.trim() } });
  const job = $("#jobText").value.trim();
  Q.push({ q: job ? `Why do you want this ${($("#roleName").value || job.split(/[\n,]/)[0]).trim().slice(0, 60)} role?` : "Why do you want this job?", why: "Connect something specific about the company to what you're good at and want to do next.", hint: {} });
  const strong = R.bullets.filter(b => { const f = (b.text.match(/^\w+/) || [""])[0].toLowerCase(); return STRONG_VERBS.has(f) || /ed$/.test(f); })
    .sort((a, b) => (/\d|%|\$/.test(b.text) ? 1 : 0) - (/\d|%|\$/.test(a.text) ? 1 : 0)).slice(0, 8);
  const cats = new Set();
  strong.forEach(b => {
    const f = (b.text.match(/^\w+/) || [""])[0].toLowerCase();
    Q.push({ q: `Your resume says you ${b.text.charAt(0).toLowerCase() + b.text.slice(1).replace(/\.$/, "")}. Walk me through how you did that.`, why: `From your ${b.role ? b.role.title + " role" : "resume"}. Expect follow-ups: what was hard, what you'd do differently, who else was involved.`, hint: { a: b.text, r: (b.text.match(/[^,]*\d[^,]*$/) || [""])[0].trim() } });
    if (VERB_CAT[f]) cats.add(VERB_CAT[f]);
  });
  [...cats].forEach(c => Q.push({ q: BEHAV[c], why: `Behavioral question that fits your ${c.toLowerCase()} experience.`, hint: {} }));
  Q.push({ q: "Tell me about a time you worked on a team to solve a problem.", why: "NACE's 2026 employer survey ranks teamwork, problem-solving and communication as the top skills employers want to see.", hint: {} });
  Q.push({ q: "Tell me about a mistake you made and what you learned.", why: "Own the mistake briefly, spend most of the answer on what you changed.", hint: {} });
  Q.push({ q: "Do you have any questions for us?", why: "Always say yes. Ask about the team's goals for the first 90 days, or how success is measured in the role.", hint: {} });
  return Q;
}
const qkey = q => "q" + Array.from(q).reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0);
function renderInterview() {
  IQ = buildQuestions();
  const done = IQ.filter(x => { const a = IA[qkey(x.q)]; return a && (a.s || a.t || a.a || a.r); }).length;
  $("#iCount").textContent = `${IQ.length} questions · ${done} answered`;
  $("#iList").innerHTML = IQ.map((x, n) => {
    const k = qkey(x.q), a = IA[k] || {};
    const has = a.s || a.t || a.a || a.r;
    const f = (id, label, ph, v) => `<label class="field" for="${k}-${id}">${label}<textarea id="${k}-${id}" data-k="${k}" data-f="${id}" placeholder="${esc(ph)}">${esc(v || "")}</textarea></label>`;
    return `<details class="sheet qcard"><summary><span><b>${esc(x.q)}</b><small>${esc(x.why)}</small></span><span class="tag ${has ? "done" : ""}">${has ? "answered" : "answer"}</span></summary>
      <div class="star">${f("s", "Situation", "Where were you, and what was going on?", a.s ?? x.hint.s)}${f("t", "Task", "What were you responsible for, or what needed to happen?", a.t)}${f("a", "Action", "What did YOU do? Be specific.", a.a ?? x.hint.a)}${f("r", "Result", "What changed? Use a number if you can.", a.r ?? x.hint.r)}
      <div class="foot"><span class="page-meta" id="${k}-wc"></span><button type="button" class="btn small" data-icopy="${k}">Copy answer</button></div></div></details>`;
  }).join("");
  IQ.forEach(x => iWords(qkey(x.q)));
}
function iWords(k) {
  const a = IA[k] || {}; const w = ["s", "t", "a", "r"].map(f => a[f] || "").join(" ").match(/\S+/g)?.length || 0;
  const el = document.getElementById(k + "-wc"); if (el) el.textContent = w ? `${w} words · about ${Math.max(1, Math.round(w / 150 * 60))} seconds spoken${w > 300 ? " · trim it" : ""}` : "";
}
$("#iList").addEventListener("input", e => {
  const k = e.target.dataset.k, f = e.target.dataset.f; if (!k) return;
  IA[k] = IA[k] || {}; IA[k][f] = e.target.value; store.set("rp-star", IA); iWords(k);
});
$("#iList").addEventListener("click", e => {
  const k = e.target.dataset.icopy; if (!k) return;
  const a = IA[k] || {}; copyText(["s", "t", "a", "r"].map(f => a[f]).filter(Boolean).join(" "));
});
let iTimerId = null;
function practice() {
  if (!IQ.length) renderInterview();
  const x = IQ[Math.floor(Math.random() * IQ.length)];
  $("#iPracticeBox").hidden = false; $("#iPQ").textContent = x.q;
  let s = 120; const tm = $("#iTimer"); tm.classList.remove("over");
  clearInterval(iTimerId);
  const tick = () => { const a = Math.abs(s); tm.textContent = `${s < 0 ? "+" : ""}${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")}`; tm.classList.toggle("over", s < 0); s--; };
  tick(); iTimerId = setInterval(tick, 1000);
}
$("#iPractice").onclick = practice; $("#iNext").onclick = practice;
$("#iStop").onclick = () => { clearInterval(iTimerId); $("#iPracticeBox").hidden = true; };

/* ================= 6. Application packets (tracker) ================= */
function snapPacket(i) {
  const resume = currentDoc("resume"), letter = currentDoc("letter");
  JOBS[i].packet = { savedAt: new Date().toISOString().slice(0, 16).replace("T", " "), resume, letter };
  saveJobs(); openPacket = i; renderJobs(); toast("Current resume and cover letter attached");
}
$("#tBody").addEventListener("click", e => {
  const p = e.target.dataset.pk, v = e.target.dataset.pv, ld = e.target.dataset.pl, cp = e.target.dataset.pc;
  if (p != null) snapPacket(+p);
  else if (v != null) { openPacket = openPacket === +v ? null : +v; renderJobs(); }
  else if (ld != null) { const [i, kind] = ld.split(":"); loadText(JOBS[+i].packet[kind], kind); }
  else if (cp != null) { const [i, kind] = cp.split(":"); copyText(JOBS[+i].packet[kind]); }
});

/* ================= 7. Mentor review ================= */
let rvDb = null, rvId = null, rvUnsubs = [], rvDoc = null, rvComments = [], rvSel = null;
const rvMine = () => store.get("rp-reviews", []);
// Mentor review storage. On the public site it uses Firebase: paste your project's firebaseConfig object here
// (Firebase console → Project settings → Your apps → Web app). These values are designed to be public;
// the Firestore security rules in firestore.rules are what protect the data. On claude.ai it falls back to the page's shared storage.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDdWMe5Wfd4NJuZnnqFC5rsnTnSUSWgTkk",
  authDomain: "website-cd10e.firebaseapp.com",
  projectId: "website-cd10e",
  storageBucket: "website-cd10e.firebasestorage.app",
  messagingSenderId: "92412024883",
  appId: "1:92412024883:web:f291698bec7c3d0445ab46"
};
const FIREBASE_SDK = "https://cdn.jsdelivr.net/npm/firebase@10.14.1/";
let rvBackend = "", rvInitP = null;
function rvInit() {
  return rvInitP ||= (async () => {
    try {
      if (window.claude?.use) { rvDb = await window.claude.use("db"); rvBackend = "claude"; }
      else if (FIREBASE_CONFIG) {
        if (!window.firebase?.firestore) { await loadScript(FIREBASE_SDK + "firebase-app-compat.js"); await loadScript(FIREBASE_SDK + "firebase-firestore-compat.js"); }
        rvDb = (firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG)).firestore(); rvBackend = "firebase";
      }
    } catch { rvDb = null; rvBackend = ""; }
  })();
}
const rvDenied = e => e && (e.code === "invalid_argument" || e.code === "permission-denied");
function rvId10() { const a = "abcdefghijkmnopqrstuvwxyz23456789"; let s = ""; const r = crypto.getRandomValues(new Uint8Array(10)); r.forEach(x => s += a[x % a.length]); return s; }
function rvRenderHome() {
  const mine = rvMine();
  $("#rvMine").innerHTML = mine.length ? `<h3 style="margin-top:8px">Your reviews</h3><ul style="margin:6px 0 0;padding-left:20px">${mine.map(m => `<li><a href="#review-${m.id}">${esc(m.label)}</a> <span class="note">${esc(m.at)}</span></li>`).join("")}</ul>` : "";
}
$("#rvMake").onclick = async () => {
  await rvInit();
  if (!rvDb) { toast("Mentor review isn't set up on this copy of the site yet."); return; }
  const text = $("#resumeText").value;
  if (!text.trim()) { toast("Load a document on the Grade page first."); return; }
  if (text.length > 20000) { toast("That document is too long to share for review."); return; }
  const id = rvId10();
  try {
    await rvDb.doc("reviews/" + id).set({ text, mode, author: $("#rvName").value.trim().slice(0, 80), note: $("#rvNote").value.trim().slice(0, 300), createdAt: new Date().toISOString() });
    const mine = rvMine(); mine.unshift({ id, label: `${mode === "resume" ? "Resume" : "Cover letter"}: ${(text.trim().split("\n")[0] || "").slice(0, 40)}`, at: new Date().toLocaleDateString() }); store.set("rp-reviews", mine.slice(0, 20));
    location.hash = "review-" + id;
  } catch (e) { toast(rvDenied(e) ? "You don't have permission to save reviews on this site." : "Couldn't create the review. Try again."); }
};
function rvOpen(id) {
  rvUnsubs.forEach(u => u()); rvUnsubs = []; rvId = id; rvDoc = null; rvComments = []; rvSel = null;
  $("#rvCreate").hidden = true; $("#rvRoom").hidden = false;
  $("#rvTitle").textContent = "Review";
  $("#rvIntro").textContent = "Click any line to comment on it. Comments appear for everyone with this link.";
  $("#rvPaper").innerHTML = `<p class="note">Loading…</p>`;
  rvUnsubs.push(rvDb.doc("reviews/" + id).onSnapshot(s => { rvDoc = s.exists ? s.data() : null; rvPaint(); }, () => { $("#rvPaper").innerHTML = `<p class="note">This review couldn't be loaded. You may not have access.</p>`; }));
  rvUnsubs.push(rvDb.collection("reviews/" + id + "/comments").orderBy("createdAt").onSnapshot(s => { rvComments = s.docs.map(d => ({ id: d.id, ...d.data() })); rvPaint(); }, () => {}));
  $("#rvWho").value = store.get("rp-reviewer", "");
}
function rvPaint() {
  if (!rvDoc) { $("#rvPaper").innerHTML = `<p class="note">${rvId ? "No review found at this link." : ""}</p>`; return; }
  $("#rvShare").innerHTML = `<b>${esc(rvDoc.author ? rvDoc.author + "'s " : "")}${rvDoc.mode === "letter" ? "cover letter" : "resume"}</b>${rvDoc.note ? `<p>“${esc(rvDoc.note)}”</p>` : ""}<p class="note">Share this exact page link (it ends in #review-${esc(rvId)}).${rvBackend === "claude" ? " Reviewers need Contributor access in the Share menu to comment." : " Anyone with the link can read and comment, so only share it with people you trust."} <button type="button" class="linkbtn" id="rvLoad">Open this text in the grader</button></p>`;
  $("#rvLoad").onclick = () => loadText(rvDoc.text, rvDoc.mode === "letter" ? "letter" : "resume");
  const counts = {}; rvComments.forEach(c => { if (!c.resolved) counts[c.line] = (counts[c.line] || 0) + 1; });
  $("#rvPaper").innerHTML = rvDoc.text.split("\n").map((L, i) => `<div class="mk-line${i === rvSel ? " sel" : ""}${BUL_RE.test(L) ? " bul" : ""}${/^[A-Z0-9 &/,'().-]{3,}$/.test(L.trim()) && /[A-Z]{3}/.test(L) ? " head" : ""}" data-ln="${i}" tabindex="0" role="button" aria-label="Comment on line ${i + 1}: ${esc(L) || "blank"}">${esc(L) || "&nbsp;"}${counts[i] ? `<span class="cnt">${counts[i]}</span>` : ""}</div>`).join("");
  $("#rvComments").innerHTML = rvComments.length ? rvComments.map(c => `<li class="mk-card ${c.resolved ? "resolved" : "consider"}" data-cl="${c.line}"><span class="mk-n">${c.line + 1}</span><div class="mk-body"><span class="who">${esc(c.name || "Reviewer")} · line ${c.line + 1}${c.resolved ? " · resolved" : ""}</span><q>${esc((c.quote || "").slice(0, 80))}</q><p style="color:var(--ink)">${esc(c.text)}</p><div class="btns"><button type="button" class="btn small" data-rres="${c.id}" data-v="${c.resolved ? 0 : 1}">${c.resolved ? "Reopen" : "Resolve"}</button></div></div></li>`).join("") : `<li class="mk-empty">No comments yet. Click a line on the left to add one.</li>`;
}
$("#rvPaper").addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.dataset.ln != null) { e.preventDefault(); e.target.click(); } });
$("#rvPaper").addEventListener("click", e => {
  const l = e.target.closest("[data-ln]"); if (!l || !rvDoc) return;
  rvSel = +l.dataset.ln; $("#rvForm").hidden = false;
  $("#rvLineLabel").textContent = `Comment on line ${rvSel + 1}`; $("#rvQuote").textContent = rvDoc.text.split("\n")[rvSel];
  rvPaint(); $("#rvText").focus();
});
$("#rvCancel").onclick = () => { rvSel = null; $("#rvForm").hidden = true; rvPaint(); };
$("#rvForm").addEventListener("submit", async e => {
  e.preventDefault();
  const text = $("#rvText").value.trim(); if (!text || rvSel == null) return;
  if (text.length > 2000) { toast("Keep comments under 2,000 characters."); return; }
  const name = $("#rvWho").value.trim().slice(0, 80); store.set("rp-reviewer", name);
  try {
    await rvDb.collection("reviews/" + rvId + "/comments").add({ line: rvSel, quote: rvDoc.text.split("\n")[rvSel].slice(0, 200), text, name, resolved: false, createdAt: new Date().toISOString() });
    $("#rvText").value = ""; $("#rvForm").hidden = true; rvSel = null; toast("Comment added");
  } catch (err) { toast(rvDenied(err) ? (rvBackend === "claude" ? "You need Contributor access to comment. Ask the owner to change it in the Share menu." : "That comment couldn't be saved. Keep it under 2,000 characters.") : "Couldn't save the comment. Try again."); }
});
$("#rvComments").addEventListener("click", async e => {
  const id = e.target.dataset.rres;
  if (id) { try { await rvDb.doc(`reviews/${rvId}/comments/${id}`).update({ resolved: e.target.dataset.v === "1" }); } catch { toast(rvBackend === "claude" ? "Couldn't update. You may need Contributor access." : "Couldn't update. Try again."); } return; }
  const c = e.target.closest("[data-cl]"); if (c) { rvSel = +c.dataset.cl; rvPaint(); const l = document.querySelector(`#rvPaper [data-ln="${rvSel}"]`); l?.scrollIntoView({ block: "center", behavior: "smooth" }); }
});
async function showReview(id) {
  if (!rvDb) { $("#rvUnavailable").hidden = true; $("#rvCreate").hidden = true; $("#rvRoom").hidden = true; await rvInit(); }
  const ok = !!rvDb;
  $("#rvUnavailable").hidden = ok;
  if (!ok) { $("#rvCreate").hidden = true; $("#rvRoom").hidden = true; return; }
  if (id) rvOpen(id);
  else { rvUnsubs.forEach(u => u()); rvUnsubs = []; rvId = null; $("#rvRoom").hidden = true; $("#rvCreate").hidden = false; $("#rvTitle").textContent = "Get a second set of eyes."; $("#rvIntro").textContent = "Send the document in Grade yours to a mentor, friend or career coach. They click any line to leave a comment, and you see comments appear live."; rvRenderHome(); }
}

/* ================= Find internships ================= */
const IX = { all: [], shown: 25, loaded: false, loading: false, sel: null };
// The GitHub copy updates every few hours even when the site itself hasn't been redeployed; the site's own copy is the fallback.
const IX_SOURCES = ["https://raw.githubusercontent.com/jcbubba11/Gradeline/main/public/internships/data.json", "internships/data.json"];
function ixFetch(i = 0) {
  if (i >= IX_SOURCES.length) return Promise.reject(new Error("no source"));
  const ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl && setTimeout(() => ctl.abort(), 10000);
  return fetch(IX_SOURCES[i], { cache: "no-cache", signal: ctl && ctl.signal })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => { if (!Array.isArray(d.postings)) throw new Error("bad data"); return d; })
    .catch(() => ixFetch(i + 1))
    .finally(() => timer && clearTimeout(timer));
}
const ixN = n => (n || 0).toLocaleString();
function ixInit() {
  if (IX.loaded || IX.loading) return;
  IX.loading = true;
  ixFetch().then(data => {
    IX.all = data.postings; IX.loaded = true;
    const majors = new Set(), inds = new Set(), cos = new Set();
    IX.all.forEach(j => { (j.majors || []).forEach(m => majors.add(m)); inds.add(j.industry); cos.add(j.company); });
    const other = "Other / Any major", fill = (sel, vals) => vals.forEach(v => { const o = document.createElement("option"); o.value = o.textContent = v; sel.appendChild(o); });
    fill($("#ixMajor"), [...majors].filter(m => m !== other).sort().concat(majors.has(other) ? [other] : []));
    fill($("#ixIndustry"), [...inds].filter(Boolean).sort());
    const nInt = data.internships != null ? data.internships : IX.all.filter(j => (j.type || "Internship") === "Internship").length;
    $("#ixTotal").textContent = ixN(data.count || IX.all.length);
    $("#ixNInt").textContent = ixN(nInt);
    $("#ixNEntry").textContent = ixN(data.entry_level != null ? data.entry_level : IX.all.length - nInt);
    $("#ixNCo").textContent = ixN(data.companies || cos.size);
    $("#ixStamp").textContent = `Updated ${new Date(data.updated).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} · ${ixN(IX.all.filter(j => ixToday(j, Date.now())).length)} new today`;
    ixRender();
  }).catch(() => { IX.loading = false; $("#ixStamp").textContent = "The openings list could not load right now. Please try again in a few minutes."; $("#ixCount").textContent = "Openings unavailable"; });
}
const ixSaved = j => JOBS.some(x => x.link && x.link === j.url);
const IX_FILTERS = ["ixQ", "ixType", "ixMajor", "ixIndustry", "ixAge"];
function ixMatches(j, now) {
  const DAY = 864e5, q = $("#ixQ").value.trim().toLowerCase();
  if ($("#ixType").value && (j.type || "Internship") !== $("#ixType").value) return false;
  if ($("#ixMajor").value && !(j.majors || []).includes($("#ixMajor").value)) return false;
  if ($("#ixIndustry").value && j.industry !== $("#ixIndustry").value) return false;
  if ($("#ixRemote").checked && !j.remote) return false;
  if ($("#ixSaved").checked && !ixSaved(j)) return false;
  if ($("#ixAge").value && now - Date.parse(j.posted) > $("#ixAge").value * DAY) return false;
  if (!q) return true;
  const hay = `${j.company} ${j.title} ${j.industry} ${j.location} ${j.remote ? "remote" : ""} ${(j.majors || []).join(" ")}`.toLowerCase();
  return q.split(/[\s,]+/).filter(Boolean).every(w => hay.includes(w));
}
function ixAgo(iso, now) {
  const d = Math.floor((now - Date.parse(iso)) / 864e5);
  if (isNaN(d)) return "";
  return d <= 0 ? "today" : d === 1 ? "yesterday" : d < 60 ? d + " days ago" : new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
// Company "logo": initials on a color picked from the name, so the same company always looks the same.
const IX_TINTS = [["#eef1fb", "#2549d3"], ["#f8ece8", "#a8322a"], ["#e9f3ec", "#1f6b45"], ["#f7f0e1", "#7d540e"], ["#efebf8", "#5b3aa6"], ["#e6f1f2", "#16656e"], ["#f6e9ef", "#8e2a5b"], ["#eeefe6", "#4f5718"]];
function ixLogo(co) {
  const name = String(co || "?").replace(/[^\p{L}\p{N}\s&]/gu, " ").trim();
  const words = name.split(/\s+/).filter(w => !/^(the|inc|llc|corp|co|ltd)$/i.test(w));
  const ini = ((words[0] || "?")[0] + (words[1] ? words[1][0] : (words[0] || "")[1] || "")).toUpperCase();
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [bg, fg] = IX_TINTS[h % IX_TINTS.length];
  return `<span class="ix-logo" style="background:${bg};color:${fg}" aria-hidden="true">${esc(ini)}</span>`;
}
let IX_HITS = [];
// People to contact: LinkedIn people searches the job seeker opens themselves. Nothing is scraped or stored.
const LI_PEOPLE = q => "https://www.linkedin.com/search/results/people/?keywords=" + encodeURIComponent(q);
function ixCity(loc) { return String(loc || "").split(/;|\|/)[0].replace(/\b(remote|hybrid|on-?site|united states|usa|us)\b/gi, "").split(",")[0].replace(/[()\-–·]+/g, " ").trim(); }
const IX_IC = {
  rec: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>',
  alum: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/></svg>',
  near: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
};
function ixPeople(j) {
  const co = String(j.company || "").replace(/\s*\((?:example)\)\s*/i, "").trim(), school = $("#ixSchool").value.trim(), city = ixCity(j.location);
  const intern = (j.type || "Internship") === "Internship";
  const out = [["rec", intern ? "Company recruiters" : "Recruiters", `Find the people who hire for ${co}`, `${co} ${intern ? "university recruiter" : "recruiter"}`]];
  out.push(school ? ["alum", `Alumni from ${school}`, `Start with a shared school connection at ${co}`, `${co} ${school}`] : ["alum", "Alumni from your school", "Add your school above to search for them", `${co} alumni`]);
  if (city && city.length > 2) out.push(["near", `People who work here near ${city}`, `Explore a local connection to ${co}`, `${co} ${city}`]);
  else out.push(["near", "People who work here", `Explore connections at ${co}`, `${co}`]);
  return out.map(([ic, l, s, q]) => [ic, l, s, LI_PEOPLE(q)]);
}
try { $("#ixSchool").value = store.get("rp-school", "") || ""; } catch {}
$("#ixSchool").addEventListener("change", () => { store.set("rp-school", $("#ixSchool").value.trim()); ixDetail(); });
const IX_BM = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg>';
const IX_PIN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const IX_OUT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
const ixSafe = u => /^https:\/\//i.test(u || "") ? u : "#";
const ixWhere = j => [j.location, j.remote && !/remote/i.test(j.location || "") ? "Remote" : ""].filter(Boolean).join(" · ");
// "New" needs a recent posting date as well as a recent first sighting, so a batch of older jobs from a newly added employer isn't flagged.
const ixFresh = (j, now) => now - Date.parse(j.first_seen) < 3 * 864e5 && now - Date.parse(j.posted) < 3 * 864e5;
const ixToday = (j, now) => now - Date.parse(j.posted) < 864e5 && now - Date.parse(j.first_seen) < 1.5 * 864e5;
const ixPostedOn = (j) => { const t = Date.parse(j.posted); return isNaN(t) ? "" : "Posted " + new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); };
const ixActive = () => IX_FILTERS.some(id => $("#" + id).value) || $("#ixRemote").checked || $("#ixSaved").checked;
function ixSort(list) {
  const by = $("#ixSort").value, t = v => Date.parse(v) || 0;
  if (by === "company") return list.sort((a, b) => String(a.company).localeCompare(String(b.company)) || t(b.posted) - t(a.posted));
  if (by === "new") return list.sort((a, b) => t(b.first_seen) - t(a.first_seen) || t(b.posted) - t(a.posted));
  return list.sort((a, b) => t(b.posted) - t(a.posted));
}
function ixRender() {
  const E = v => esc(String(v ?? "")), now = Date.now();
  IX_HITS = ixSort(IX.all.filter(j => ixMatches(j, now)));
  IX_FILTERS.forEach(id => $("#" + id).closest(".ix-f").classList.toggle("on", !!$("#" + id).value));
  $("#ixClear").disabled = !ixActive();
  $("#ixCount").textContent = IX_HITS.length.toLocaleString() + (IX_HITS.length === 1 ? " opening" : " openings");
  $("#ixCountSub").textContent = ixActive() ? "match your filters" : "live right now";
  if (!IX_HITS.includes(IX.sel)) IX.sel = matchMedia("(max-width: 900px)").matches ? null : IX_HITS[0] || null;
  $("#ixList").innerHTML = IX_HITS.length ? IX_HITS.slice(0, IX.shown).map((j, i) => {
    const saved = ixSaved(j), sel = j === IX.sel;
    return `<li class="ix-card${sel ? " sel" : ""}"><button type="button" class="ix-pick" data-ix-pick="${i}" aria-current="${sel}">
      <span class="ix-co">${ixLogo(j.company)}<span><b>${E(j.company)}</b><small>${E(j.industry || "Employer")}</small></span></span>
      <h3>${E(j.title)}</h3>
      <span class="ix-where">${IX_PIN}<span>${E(ixWhere(j) || "Location not listed")}</span></span>
      <span class="ix-foot"><span><span class="ix-chip type">${E(j.type || "Internship")}</span>${ixToday(j, now) ? '<span class="ix-chip new">New today</span>' : ixFresh(j, now) ? '<span class="ix-chip new">New</span>' : ""}</span><span class="ix-cap" title="${E(ixPostedOn(j))}">${E(ixAgo(j.posted, now))}</span></span>
    </button><button type="button" class="ix-bm${saved ? " on" : ""}" data-ix-save="${i}" aria-label="${saved ? "Saved to your Job tracker" : "Save to Job tracker"}" title="${saved ? "Saved" : "Save"}">${IX_BM}</button></li>`;
  }).join("") : `<li class="ix-empty">${$("#ixSaved").checked ? "You haven't saved any jobs yet. Tap the bookmark on a job to save it to your Job tracker." : "No jobs match those filters yet. Try another major, a wider date range or a shorter search."}</li>`;
  $("#ixMore").hidden = IX_HITS.length <= IX.shown;
  $("#ixShowing").textContent = IX_HITS.length ? `Showing ${Math.min(IX.shown, IX_HITS.length).toLocaleString()} of ${IX_HITS.length.toLocaleString()}` : "";
  ixDetail();
}
function ixDetail() {
  const box = $("#ixDetail"), j = IX.sel, E = v => esc(String(v ?? "")), now = Date.now();
  if (!j) { box.innerHTML = `<div class="ix-sec"><p>${IX.loaded ? "Pick a job to see the details and who to contact." : "Loading openings…"}</p></div>`; return; }
  const saved = ixSaved(j), src = { greenhouse: "Greenhouse", lever: "Lever", ashby: "Ashby", smartrecruiters: "SmartRecruiters", usajobs: "USAJOBS" }[j.source] || "the company's careers page";
  const fmt = d => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const majors = (j.majors || []).filter(m => m !== "Other / Any major");
  box.innerHTML = `<button type="button" class="btn small ix-back" id="ixBack">← Back to results</button>
    <div class="ix-dtop">
      <span class="ix-badge">${E(j.type || "Internship")}${ixToday(j, now) ? " · New today" : ixFresh(j, now) ? " · New this week" : ""}${j.remote ? " · Remote option" : ""}</span>
      <button type="button" class="ix-bm${saved ? " on" : ""}" id="ixDetailBm" aria-label="${saved ? "Saved to your Job tracker" : "Save to Job tracker"}">${IX_BM}</button>
      <span class="ix-dco">${E(j.company)}${j.industry ? " · " + E(j.industry) : ""}</span>
      <h2>${E(j.title)}</h2>
      <span class="ix-dmeta">${E(ixWhere(j) || "Location not listed")} · Posted ${E(ixAgo(j.posted, now))}</span>
      <div class="ix-dacts"><a class="btn primary" href="${E(ixSafe(j.url))}" target="_blank" rel="noopener noreferrer nofollow">Apply on company site ${IX_OUT}</a><a class="btn" id="ixKit" href="#kit">Build application kit</a><button type="button" class="btn" id="ixDetailSave"${saved ? " disabled" : ""}>${saved ? "Saved" : "Save job"} ${IX_BM}</button></div>
      <span class="ix-dnote">Opens ${E(j.company)}'s own application, listed through ${E(src)}.</span>
    </div>
    <dl class="ix-facts">
      <div><dt>Job type</dt><dd>${E(j.type || "Internship")}</dd></div>
      <div><dt>Posted</dt><dd>${E(fmt(j.posted))}</dd></div>
      ${j.closes ? `<div><dt>Apply by</dt><dd>${E(fmt(j.closes))}</dd></div>` : ""}
      <div><dt>Related major</dt><dd>${majors.map(E).join(", ") || "Any major"}</dd></div>
    </dl>
    <div class="ix-sec"><h3>${(j.type || "Internship") === "Internship" ? "A first step into real-world work." : "A first full-time role to grow into."}</h3><p>The full description, pay and requirements are on ${E(j.company)}'s careers page. Before you apply, build an <a href="#kit">application kit</a> for this job (a resume check, a cover letter draft and a note to the recruiter), then reach out to someone below. A short, specific note to a recruiter or alum often gets your application read sooner.</p></div>
    <div class="ix-sec"><div class="ix-ph"><h3>People worth contacting</h3><span class="ix-cap">Opens LinkedIn</span></div>
      <ul class="ix-people">${ixPeople(j).map(([ic, l, s, u]) => `<li><a href="${E(u)}" target="_blank" rel="noopener noreferrer"><span class="ic">${IX_IC[ic]}</span><span class="tx"><b>${E(l)}</b><small>${E(s)}</small></span><span class="ar">${IX_OUT}</span></a></li>`).join("")}</ul>
    </div>`;
  box.scrollTop = 0;
}
function ixSave(j) {
  if (!j || ixSaved(j)) { if (j && typeof toast === "function") toast("Already in your Job tracker."); return; }
  JOBS.unshift({ company: j.company, role: j.title, status: "Saved", applied: "", link: j.url, follow: "", notes: [j.location, "Found on One Stop"].filter(Boolean).join(" · ") });
  saveJobs(); renderJobs();
  if (typeof toast === "function") toast("Saved to your Job tracker.");
}
["change", "input"].forEach(ev => $("#ixFilters").addEventListener(ev, e => { if (e.target.id === "ixSchool") return; IX.shown = 25; ixRender(); }));
$("#ixSort").addEventListener("change", () => { IX.shown = 25; ixRender(); });
$("#ixGo").addEventListener("click", () => { ixRender(); $("#ixSplit").scrollIntoView({ behavior: "smooth", block: "start" }); });
$("#ixClear").onclick = () => { IX_FILTERS.forEach(id => $("#" + id).value = ""); $("#ixRemote").checked = $("#ixSaved").checked = false; IX.shown = 25; ixRender(); };
$("#ixMore").onclick = () => { IX.shown += 25; ixRender(); };
$("#ixList").addEventListener("click", e => {
  const s = e.target.closest("[data-ix-save]");
  if (s) { ixSave(IX_HITS[+s.dataset.ixSave]); ixRender(); return; }
  const p = e.target.closest("[data-ix-pick]"); if (!p) return;
  IX.sel = IX_HITS[+p.dataset.ixPick] || null;
  $("#ixList").querySelectorAll(".ix-card").forEach(li => li.classList.toggle("sel", li.contains(p)));
  $("#ixList").querySelectorAll(".ix-pick").forEach(b => b.setAttribute("aria-current", b === p));
  ixDetail();
  if (matchMedia("(max-width: 900px)").matches) { $("#ixSplit").classList.add("open"); document.body.style.overflow = "hidden"; $("#ixBack") && $("#ixBack").focus(); }
});
$("#ixDetail").addEventListener("click", e => {
  if (e.target.closest("#ixDetailSave") || e.target.closest("#ixDetailBm")) { ixSave(IX.sel); ixRender(); return; }
  if (e.target.closest("#ixBack") || e.target.closest('a[href^="#"]')) {
    $("#ixSplit").classList.remove("open"); document.body.style.overflow = "";
    const sel = $("#ixList .ix-card.sel .ix-pick"); if (sel && e.target.closest("#ixBack")) sel.focus();
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#ixSplit").classList.contains("open")) $("#ixBack").click(); });

/* ================= View hooks ================= */
/* Bigger tools load the first time their page opens, so the first visit downloads less.
   Files load in order and share this script's globals. Paths are relative to the page. */
const LAZY = {
  "linkedin-post": ["assets/linkedin-post.js"],
  gallery: ["assets/gallery.js"],
  kit: ["assets/apply-tools.js"], "follow-up": ["assets/apply-tools.js"], rejection: ["assets/apply-tools.js"],
  interview: ["interview-bank.js", "interview-prep.js"]
};
const lazyDone = {}, lazyOk = new Set();
function lazyLoad(files) {
  return files.reduce((p, f) => p.then(() => lazyDone[f] ||= loadScript(f).then(() => lazyOk.add(f), e => { delete lazyDone[f]; throw e; })), Promise.resolve());
}
function lazyView(v, init) {
  const files = LAZY[v], sec = document.querySelector(`[data-view="${v}"]`);
  if (!files || files.every(f => lazyOk.has(f))) { init(); return; }
  sec?.setAttribute("aria-busy", "true");
  lazyLoad(files).then(() => { init(); markScrollers(); })
    .catch(() => toast("That tool didn't load. Check your connection and refresh the page."))
    .finally(() => sec?.removeAttribute("aria-busy"));
}
// Warm the cache for the tools people open most once the page is idle.
const whenIdle = fn => (window.requestIdleCallback || (f => setTimeout(f, 1500)))(fn);
let JSPDF_P = null;
const JSPDF_SRC = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
function needJsPdf() { return window.jspdf ? Promise.resolve() : (JSPDF_P ||= loadScript(JSPDF_SRC).catch(e => { JSPDF_P = null; throw e; })); }

/* ---------- Home: "What do you need?" ---------- */
function homeInit() {
  // "Every tool": built from the header menu so there's one list to keep up to date.
  const all = $("#homeAll");
  if (all && !all.dataset.done) {
    all.dataset.done = "1";
    const col = (name, links) => `<div><div class="grp">${esc(name)}</div><ul>${links.map(a => `<li><a href="${esc(a.getAttribute("href"))}">${esc(a.textContent)}</a></li>`).join("")}</ul></div>`;
    all.innerHTML = col("Start", [...document.querySelectorAll("nav.tabs > a")])
      + [...document.querySelectorAll(".more-menu .col")].map(c => col(c.querySelector(".grp").textContent, [...c.querySelectorAll("a")])).join("");
  }
  // Swap the "how it works" card for links back to saved work, when there is some.
  const items = [], g = store.get("rp-grade", null), jobs = store.get("rp-jobs", null), kit = store.get("rp-kit", null), star = store.get("rp-star", {});
  if (g && g.text && !Object.values(SAMPLES).includes(g.text)) items.push(["grade", g.mode === "letter" ? "Your cover letter" : "Your resume", `Back to the grader · scored ${parseInt($("#scoreNum").textContent, 10) || 0}/100`]);
  if (store.get("rp-builder", null)) items.push(["build", "Your resume draft", "Keep editing in the builder"]);
  const real = Array.isArray(jobs) ? jobs.filter(j => j && j.company && !/\(example\)/i.test(j.company)).length : 0;
  if (real) items.push(["tracker", `${real} application${real === 1 ? "" : "s"} tracked`, "Open your job tracker"]);
  if (kit && kit.company && !/\(example\)/i.test(kit.company)) items.push(["kit", `Application kit for ${kit.company}`, "Pick up where you stopped"]);
  const answered = Object.values(star || {}).filter(a => a && (a.s || a.t || a.a || a.r)).length;
  if (answered) items.push(["interview", `${answered} interview answer${answered === 1 ? "" : "s"} written`, "Keep practicing"]);
  if (!items.length) return;
  $("#homeSideT").textContent = "Pick up where you left off";
  $("#homeFacts").innerHTML = items.slice(0, 4).map(([h, t, d]) => `<li><a href="#${h}"><b>${esc(t)}</b><span>${esc(d)}</span></a></li>`).join("");
}

function onView(v, sub) {
  if (v === "home") setTimeout(homeInit);
  else if (v === "internships") ixInit();
  else if (v === "build") whenIdle(() => needJsPdf().catch(() => {}));
  else if (v === "match") initMatch();
  else if (v === "coach") { coachFill(); coachCats(); coachBuild(); }
  else if (v === "linkedin-post") lazyView(v, () => lpInit());
  else if (v === "gallery") lazyView(v, () => galInit());
  else if (v === "tailor") runTailor();
  else if (v === "interview") { renderInterview(); lazyView(v, () => {}); }
  else if (v === "review") showReview(sub);
  else if (v === "kit") lazyView(v, () => kitInit());
  else if (v === "follow-up") lazyView(v, () => fuInit());
  else if (v === "rejection") lazyView(v, () => rjInit());
}

/* ================= Field-specific advice ================= */
const FIELDS = {
  general: { label: "General / not listed" },
  nursing: { label: "Nursing & healthcare", src: "pepperdine", guide: [
    "Put your license status (RN, LPN, or \"NCLEX scheduled for [month year]\") and certifications such as BLS, ACLS or PALS at the top.",
    "New grads: give clinical rotations their own section with unit, hospital system and hours. It's the most important part of a new-grad resume.",
    "List hard skills like EMR systems (Epic, Cerner), IV insertion and wound care instead of generic ones like \"communication\".",
    "Write bullets with clinical verbs: \"Administered medications\", \"Monitored vital signs\", not \"Helped patients\"."] },
  tech: { label: "Software & tech", src: "cornellcs", guide: [
    "Put GitHub (and a portfolio if you have one) in your header next to LinkedIn.",
    "Projects can be your main section. Name the tech stack inside each bullet: \"Built a web app using React and Firebase…\"",
    "Group technical skills by type: languages, frameworks, databases, tools.",
    "Keep it to one page and mirror the posting's exact technology names."] },
  teaching: { label: "Teaching & education", src: "uni", guide: [
    "List your certification or license (and pending ones, with dates) in or next to Education.",
    "Student teaching is usually the most important section for new teachers: school, grade level, subject and dates, with accomplishments.",
    "Say the grade levels and subjects you've taught so a principal can match you to an opening.",
    "One to two full pages is normal; put your name on page two."] },
  accounting: { label: "Accounting & finance", src: "unl", guide: [
    "Many firms screen on GPA. List major and cumulative GPA, and make sure they're exact.",
    "Headed for public accounting? State your CPA plan: \"Plan to complete 150 credit hours by May 2027 to sit for the CPA exam.\"",
    "If the posting names required courses, list matching coursework by name, not number."] },
  creative: { label: "Design, marketing & creative", src: "binghamton", guide: [
    "Put your portfolio URL in your contact details at the top, and test that it opens without a login.",
    "Pick a few strong pieces that show the work you want to do next, rather than everything you've made.",
    "Caption each portfolio piece with the client, the goal, your role and the result.",
    "Name your tools (Figma, Adobe Creative Cloud, Canva…) so keyword searches find you."] },
  trades: { label: "Skilled trades", src: "wvjs", guide: [
    "List every license and certification with the organization that issued it, most relevant first.",
    "Include apprenticeships, trade school and vocational training in Education.",
    "Spell out your technical skills, matched to the job posting.",
    "Describe significant projects briefly and your role in finishing them."] }
};
let field = store.get("rp-field", "general");
const nearTop = (t, re) => { const ls = t.split("\n"); return re.test(ls.slice(0, Math.max(8, Math.ceil(ls.length * 0.25))).join("\n")); };
function fieldChecks(t) {
  const C = [], f = (id, status, title, detail) => C.push({ id, cat: "Content", w: 2, status, title, detail });
  if (field === "nursing") {
    const lic = /\b(RN|LPN|LVN|NCLEX|registered nurse|licensed practical|nursing license|license)\b/i;
    f("f-nurse-license", nearTop(t, lic) ? "pass" : lic.test(t) ? "warn" : "fail", nearTop(t, lic) ? "License status near the top" : lic.test(t) ? "Move your license status to the top" : "Add your license status", "Nursing employers check licensure first. New grads can write \"NCLEX scheduled for [month year]\".");
    const cert = /\b(BLS|ACLS|PALS|NRP|TNCC|CPR)\b/;
    f("f-nurse-cert", cert.test(t) ? "pass" : "warn", cert.test(t) ? "Certifications listed" : "List certifications like BLS or ACLS", "Put them near your license at the top.");
    const clin = /clinical/i.test(t), hrs = /\d+\s*(clinical\s*)?(hours|hrs)\b/i.test(t);
    f("f-nurse-clinical", clin && hrs ? "pass" : "warn", clin && hrs ? "Clinical rotations with hours" : clin ? "Add hours to your clinical rotations" : "Add clinical rotations if you're a new grad", "For each rotation: unit, hospital system and hours.");
    const emr = /\b(epic|cerner|meditech|emr|ehr|electronic (health|medical) records?)\b/i;
    f("f-nurse-emr", emr.test(t) ? "pass" : "warn", emr.test(t) ? "Names an EMR system" : "Name the EMR systems you've used", "Epic, Cerner and similar systems are common screening keywords.");
  } else if (field === "tech") {
    f("f-tech-github", /github\.com|gitlab\.com|bitbucket\.org/i.test(t) ? "pass" : "warn", /github\.com|gitlab\.com/i.test(t) ? "Code link in your header" : "Add your GitHub link", "Recruiters expect GitHub next to LinkedIn in your header.");
    f("f-tech-projects", /^\s*(technical |personal |selected |academic )?projects?\s*:?\s*$/im.test(t) ? "pass" : "warn", /^\s*(technical |personal |selected |academic )?projects?\s*:?\s*$/im.test(t) ? "Has a Projects section" : "Add a Projects section", "Projects can be your strongest section, especially early in your career.");
    const TECH = /\b(python|java|javascript|typescript|react|node|sql|postgres|mysql|mongodb|aws|azure|gcp|docker|kubernetes|git|c\+\+|c#|go|rust|swift|kotlin|django|flask|firebase|html|css|linux|api|rest|graphql|tensorflow|pytorch|pandas)\b/i;
    const bl = t.split("\n").filter(l => /^\s*[-•*]/.test(l)), wt = bl.filter(l => TECH.test(l)).length;
    const ok = bl.length && wt / bl.length >= 0.4;
    f("f-tech-stack", ok ? "pass" : "warn", ok ? `${wt} of ${bl.length} bullets name the tech used` : "Name the tech stack in your bullets", "\"Built X using React and Firebase\" shows skills in context, not just in a list.");
  } else if (field === "teaching") {
    const cert = /certif|licens|endorse/i;
    f("f-teach-cert", cert.test(t) ? "pass" : "fail", cert.test(t) ? "Certification or license listed" : "Add your teaching certification", "Include pending certifications with expected dates.");
    const st = /student teach|practicum|field experience|teaching experience/i;
    f("f-teach-student", st.test(t) ? "pass" : "warn", st.test(t) ? "Teaching experience section" : "Add student teaching or teaching experience", "School, grade level, subject and dates, with what you accomplished.");
    const gl = /\b(grades?\s*(k|\d)|k\s*[-–]\s*\d+|kindergarten|\d+(st|nd|rd|th)[- ]grade|elementary|middle school|high school|secondary|pre-?k)\b/i;
    f("f-teach-grade", gl.test(t) ? "pass" : "warn", gl.test(t) ? "Grade levels stated" : "Say which grade levels you've taught", "Principals match candidates to specific openings.");
  } else if (field === "accounting") {
    f("f-acct-gpa", /\bGPA\b/i.test(t) ? "pass" : "warn", /\bGPA\b/i.test(t) ? "GPA listed" : "Consider listing your GPA", "Many firms screen on GPA. Make sure the number is exact.");
    f("f-acct-cpa", /\bCPA\b|150 (credit )?hours/i.test(t) ? "pass" : "warn", /\bCPA\b|150 (credit )?hours/i.test(t) ? "CPA plan stated" : "State your CPA plan if you're headed for public accounting", "\"Plan to complete 150 credit hours by [month year] to sit for the CPA exam.\"");
    f("f-acct-course", /coursework/i.test(t) ? "pass" : "warn", /coursework/i.test(t) ? "Relevant coursework listed" : "List coursework the posting asks for", "Use course names, not numbers.");
  } else if (field === "creative") {
    const urls = (t.match(/\b((https?:\/\/)?(www\.)?[a-z0-9-]+\.(com|net|org|io|design|art|me|co|site|studio)(\/\S*)?)/gi) || []).filter(u => !/linkedin|@|email|gmail|outlook|yahoo/i.test(u));
    const port = urls.length || /behance|dribbble|portfolio/i.test(t);
    const atTop = port && nearTop(t, /behance|dribbble|portfolio|\.(com|net|io|design|art|me|co|site|studio)\b/i);
    f("f-creative-portfolio", atTop ? "pass" : port ? "warn" : "fail", atTop ? "Portfolio link at the top" : port ? "Move your portfolio link into your header" : "Add a portfolio link", "Put it with your contact details and check it opens without a login.");
    const tools = /\b(figma|adobe|photoshop|illustrator|indesign|after effects|premiere|lightroom|canva|sketch|procreate|blender|final cut|webflow)\b/i;
    f("f-creative-tools", tools.test(t) ? "pass" : "warn", tools.test(t) ? "Names your design tools" : "Name the tools you use", "Figma, Adobe apps, Canva and others are common search terms.");
  } else if (field === "trades") {
    const lic = /licens|certif|\bOSHA\b|journeyman|journeyworker|\bCDL\b|\bEPA\b|\bNCCER\b|\bAWS\b|welding cert/i;
    f("f-trades-license", lic.test(t) ? "pass" : "fail", lic.test(t) ? "Licenses or certifications listed" : "List your licenses and certifications", "Include the organization that issued each one.");
    const tr = /apprentic|vocational|trade school|technical (college|institute|school)|career center|\bcte\b/i;
    f("f-trades-training", tr.test(t) ? "pass" : "warn", tr.test(t) ? "Training or apprenticeship listed" : "Add apprenticeships or trade training", "List them under Education.");
  }
  return C;
}
function renderFieldGuide() {
  const F = FIELDS[field];
  $("#fieldGuide").hidden = !F.guide;
  if (F.guide) $("#fieldGuide").innerHTML = `<b>${esc(F.label)}: what matters most</b><ul>${F.guide.map(g => `<li>${esc(g)}</li>`).join("")}</ul><p class="src">Based on: <a href="${SRC[F.src].url}" target="_blank" rel="noopener">${esc(SRC[F.src].short)}</a></p>`;
}
$("#fieldSel").innerHTML = Object.entries(FIELDS).map(([k, v]) => `<option value="${k}" ${k === field ? "selected" : ""}>${esc(v.label)}</option>`).join("");
$("#fieldSel").onchange = e => { field = e.target.value; store.set("rp-field", field); renderFieldGuide(); grade(); };
renderFieldGuide();
$("#fieldTips").innerHTML = Object.entries(FIELDS).filter(([, v]) => v.guide).map(([, v]) => `<div class="sheet tip"><h3>${esc(v.label)}</h3><ul>${v.guide.map(g => `<li>${esc(g)}</li>`).join("")}</ul><p class="src">Source: <a href="${SRC[v.src].url}" target="_blank" rel="noopener">${esc(SRC[v.src].name)}</a></p></div>`).join("");

// Set this before launch so the privacy policy shows a real contact.
const CONTACT_EMAIL = "";
if (CONTACT_EMAIL) $("#contactSlot").innerHTML = `<a href="mailto:${CONTACT_EMAIL}">${esc(CONTACT_EMAIL)}</a>`;
$("#wipeData").onclick = () => {
  if (!confirm("Delete everything this site saved in this browser? This can't be undone. Download a backup first if you want to keep it.")) return;
  try { Object.keys(localStorage).filter(k => k.startsWith("rp-")).forEach(k => localStorage.removeItem(k)); } catch {}
  location.hash = "grade"; location.reload();
};

/* ================= AI-style writing signals (used by the grader) ================= */
// Phrases that show up far more in AI-drafted job documents than in plain human writing. [pattern, plain replacement or null, why]
const AI_PHRASES = [
  [/\bin today's (?:[\w-]+ ){0,3}(world|landscape|environment|market|economy|age|workplace)\b,?\s*/gi, "", "A stock AI opener. Start with your point."],
  [/\bI am (excited|thrilled|eager) to (apply|submit my application) for\b/gi, "I'm applying for", "Every AI draft starts this way. Plain and direct reads as you."],
  [/\bI am writing to express my (strong |keen )?interest in\b/gi, "I'm applying for", "A stock opening line."],
  [/\b(perfectly |seamlessly )?aligns? (perfectly |seamlessly )?with\b/gi, "fits", "\"Aligns perfectly\" is a common AI phrase. Say how it fits."],
  [/\bdelve(s|d)? into\b/gi, "dig into", "\"Delve\" is one of the most recognizable AI words."],
  [/\btapestry\b/gi, null, "Flowery AI word. Say the plain thing."],
  [/\b(is|stands as) a testament to\b/gi, "shows", "\"Testament to\" is an AI favorite."],
  [/\b(was|stood as) a testament to\b/gi, "showed", "\"Testament to\" is an AI favorite."],
  [/\btestament to\b/gi, null, "\"Testament to\" is an AI favorite."],
  [/\bleverag(e|ed|ing)\b/gi, m => ({ e: "use", ed: "used", ing: "using" })[m[1].toLowerCase()], "\"Leverage\" usually just means use."],
  [/\butiliz(e|ed|ing)\b/gi, m => ({ e: "use", ed: "used", ing: "using" })[m[1].toLowerCase()], "\"Utilize\" means use."],
  [/\bseamless(ly)?\b/gi, m => m[1] ? "smoothly" : "smooth", "Buzzword. Say what was easy, and for whom."],
  [/\brobust\b/gi, "strong", "Vague buzzword."],
  [/\bfoster(ed|ing|s)?\b/gi, m => "build" + ({ ed: "t", ing: "ing", s: "s" }[(m[1] || "").toLowerCase()] || ""), "AI-favored verb. \"Build\" is plainer."],
  [/\bharness(ed|ing)?\b/gi, m => "use" + ({ ed: "d", ing: "" }[(m[1] || "").toLowerCase()] || ""), "AI-favored verb."],
  [/\belevat(e|ed|ing)\b/gi, m => ({ e: "improve", ed: "improved", ing: "improving" })[m[1].toLowerCase()], "Vague. Say what got better, by how much."],
  [/\b(ha(?:ve|s) )?showcas(e|ed|ing)\b/gi, m => m[1] ? m[1] + "shown" : ({ e: "show", ed: "showed", ing: "showing" })[m[2].toLowerCase()], "\"Showcase\" is an AI favorite."],
  [/\bnavigat(e|ed|ing) (the )?(complexities|challenges) of\b/gi, null, "Abstract AI phrasing. Name the actual problem you handled."],
  [/\b(ever-evolving|ever-changing|cutting-edge|game-chang(er|ing)|groundbreaking)\b/gi, null, "Hype word. Cut it or replace with a fact."],
  [/\b(unwavering|meticulous|invaluable|pivotal|paramount)\b/gi, null, "Inflated adjective common in AI drafts. Show it with an example instead."],
  [/\b(realm|landscape) of\b/gi, "field of", "AI phrasing."],
  [/\bembark(ed|ing)? on\b/gi, m => "start" + ({ ed: "ed", ing: "ing" }[(m[1] || "").toLowerCase()] || ""), "AI phrasing."],
  [/\bresonates? (deeply )?with me\b/gi, "matters to me", "AI phrasing. Better: say exactly why."],
  [/\b(make|making|drive|driving) (a )?(meaningful|lasting|significant) impact\b/gi, null, "Generic. Say what you'd change, with a number if you can."],
  [/\bhon(ed|ing) my\b/gi, m => m[1].toLowerCase() === "ed" ? "built my" : "building my", "\"Honed\" is an AI favorite."],
  [/\bI thrive (in|on|under)\b/gi, null, "Common AI claim. Give an example of a time you did well under those conditions."],
  [/\bcommitment to excellence\b/gi, null, "Empty phrase. Cut it or give a concrete example."],
  [/\bkeen eye for detail\b/gi, null, "Cliché. Show one detail you caught."],
  [/(?:^|(?<=[.!?]\s))(Furthermore|Moreover|Additionally), /gm, "", "Essay connector that AI overuses. Usually you can just start the sentence."],
  [/\bI am confident that my (skills|experience|background)[^.]*\./gi, null, "A stock AI closing claim. Replace with one specific thing you'd do in the first months."]
];
function applyAIFix(rep, m) { if (rep == null) return null; const r = typeof rep === "function" ? rep(m) : rep; if (r === "") return ""; return /^[A-Z]/.test(m[0]) ? cap(r) : r; }
function aiFinds(text) {
  const out = [];
  AI_PHRASES.forEach(([re, rep, why]) => { re.lastIndex = 0; let m; while ((m = re.exec(text))) { out.push({ start: m.index, end: m.index + m[0].length, text: m[0], replacement: applyAIFix(rep, m), why }); if (!re.global) break; } });
  return out.sort((a, b) => a.start - b.start).filter((f, i, a) => !i || f.start >= a[i - 1].end);
}
function sentencesOf(text) { return (text.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+/g) || []).map(s => s.trim()).filter(s => (s.match(/\S+/g) || []).length >= 3); }
function aiSignals(text) {
  const words = (text.match(/\S+/g) || []).length || 1;
  const S = sentencesOf(text), lens = S.map(s => (s.match(/\S+/g) || []).length);
  const mean = lens.reduce((a, b) => a + b, 0) / (lens.length || 1);
  const cv = lens.length ? Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length) / (mean || 1) : 1;
  const finds = aiFinds(text);
  const dashes = (text.match(/—|\s–\s|\s--\s/g) || []).length;
  const threes = (text.match(/\b\w+(?: \w+)?, \w+(?: \w+)?,? and \w+/g) || []).length;
  const specific = S.filter(s => /\d|[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/.test(s.slice(1))).length;
  const openers = {}; S.forEach(s => { const w = (s.match(/^\W*(\w+)/) || [])[1]; if (w) openers[w.toLowerCase()] = (openers[w.toLowerCase()] || 0) + 1; });
  const topOpener = Object.entries(openers).sort((a, b) => b[1] - a[1])[0];
  const sig = [];
  const push = (on, title, detail) => sig.push({ on, title, detail });
  push(finds.length >= 2, `${finds.length} AI-style phrase${finds.length === 1 ? "" : "s"}`, finds.length ? "Highlighted below, each with a plainer option." : "None of the common ones found.");
  if (lens.length >= 6) push(cv < 0.3, cv < 0.3 ? "Sentences are all about the same length" : "Sentence length varies naturally", `People mix short and long sentences. Variation score ${cv.toFixed(2)} (under 0.30 reads machine-even).`);
  push(dashes / words * 100 > 0.6, `${dashes} long dash${dashes === 1 ? "" : "es"}`, "AI drafts lean on em dashes. One or two is fine; more reads generated. Try commas or periods.");
  push(threes >= 3, `${threes} list${threes === 1 ? "" : "s"} of three`, "\"X, Y, and Z\" over and over is a common AI rhythm.");
  if (S.length >= 4) push(specific / S.length < 0.35, `${Math.round(specific / S.length * 100)}% of sentences have a specific detail`, "Names, numbers, places and products make writing sound like a real person. Generic sentences are listed below.");
  if (topOpener && S.length >= 6) push(topOpener[1] / S.length > 0.4, `${topOpener[1]} of ${S.length} sentences start with "${topOpener[0]}"`, "Vary how sentences start.");
  const level = sig.filter(s => s.on).length;
  return { sig, finds, level: level >= 3 ? "Strong" : level >= 1 ? "Some" : "Few", S, words };
}

/* ================= Accounts (Firebase Auth) + sync ================= */
// Optional sign-in. When signed in, the same rp-* data the backup button saves is mirrored to
// Firestore at users/{uid} so it follows the person across devices. Signed out, nothing leaves the browser.
const ACCT = { auth: null, db: null, user: null, tab: "in", pushT: null, ready: null, applying: false };
const acctMark = { get() { try { return JSON.parse(localStorage.getItem("gl-acct") || "null"); } catch { return null; } }, set(v) { try { v ? localStorage.setItem("gl-acct", JSON.stringify(v)) : localStorage.removeItem("gl-acct"); } catch {} } };
function acctLoad() {
  return ACCT.ready ||= (async () => {
    if (!window.firebase?.auth) {
      if (!window.firebase) await loadScript(FIREBASE_SDK + "firebase-app-compat.js");
      await loadScript(FIREBASE_SDK + "firebase-auth-compat.js");
      if (!window.firebase.firestore) await loadScript(FIREBASE_SDK + "firebase-firestore-compat.js");
    }
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(FIREBASE_CONFIG);
    ACCT.auth = app.auth(); ACCT.db = app.firestore();
    ACCT.auth.onAuthStateChanged(acctChanged);
  })().catch(e => { ACCT.ready = null; throw e; });
}
const ACCT_ERR = {
  "auth/invalid-credential": "That email and password don't match. Try again or reset your password.",
  "auth/wrong-password": "That email and password don't match. Try again or reset your password.",
  "auth/user-not-found": "No account uses that email yet. Switch to Create account.",
  "auth/email-already-in-use": "An account already uses that email. Switch to Sign in.",
  "auth/weak-password": "Use at least 8 characters for your password.",
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/missing-password": "Enter your password.",
  "auth/too-many-requests": "Too many tries. Wait a few minutes, or reset your password.",
  "auth/network-request-failed": "Couldn't reach the sign-in service. Check your connection.",
  "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups for this site and try again.",
  "auth/operation-not-allowed": "This sign-in method isn't turned on yet.",
  "auth/unauthorized-domain": "Sign-in isn't set up for this web address yet."
};
function acctErr(e) {
  if (!e || e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") { $("#acctErr").hidden = true; return; }
  const m = $("#acctErr"); m.classList.remove("ok"); m.textContent = ACCT_ERR[e.code] || "Something went wrong. Please try again."; m.hidden = false;
}
function acctTab(t) {
  ACCT.tab = t;
  document.querySelectorAll("[data-acct-tab]").forEach(b => b.setAttribute("aria-pressed", b.dataset.acctTab === t));
  $("#acctTitle").textContent = t === "up" ? "Create your free account" : "Sign in to One Stop";
  $("#acctSubmit").textContent = t === "up" ? "Create account" : "Sign in";
  $("#acctNameRow").hidden = t !== "up"; $("#acctPwHint").hidden = t !== "up"; $("#acctForgot").hidden = t === "up";
  $("#acctPw").autocomplete = t === "up" ? "new-password" : "current-password";
  $("#acctErr").hidden = true;
}
function acctOpen(t) { acctTab(t); $("#acctDlg").showModal(); acctLoad().catch(() => acctErr({ code: "auth/network-request-failed" })); setTimeout(() => (t === "up" ? $("#acctNameIn") : $("#acctEmailIn")).focus(), 30); }
$("#acctIn").onclick = () => acctOpen("in");
$("#acctUp").onclick = () => acctOpen("up");
document.querySelectorAll("[data-acct-tab]").forEach(b => b.onclick = () => acctTab(b.dataset.acctTab));
$("#acctDlg").addEventListener("click", e => { if (e.target === $("#acctDlg")) $("#acctDlg").close(); });
$("#acctDlg").querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", () => $("#acctDlg").close()));
async function acctBusy(fn) {
  const btns = $("#acctDlg").querySelectorAll("button"); btns.forEach(b => b.disabled = true);
  try { await acctLoad(); await fn(); } catch (e) { acctErr(e); } finally { btns.forEach(b => b.disabled = false); }
}
$("#acctGoogle").onclick = () => acctBusy(async () => { await ACCT.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); });
$("#acctForm").onsubmit = e => {
  e.preventDefault();
  const email = $("#acctEmailIn").value.trim(), pw = $("#acctPw").value;
  if (ACCT.tab === "up" && pw.length < 8) { acctErr({ code: "auth/weak-password" }); return; }
  acctBusy(async () => {
    if (ACCT.tab === "up") {
      const cred = await ACCT.auth.createUserWithEmailAndPassword(email, pw);
      const name = $("#acctNameIn").value.trim();
      if (name) { await cred.user.updateProfile({ displayName: name }); acctPaint(cred.user); }
    } else await ACCT.auth.signInWithEmailAndPassword(email, pw);
  });
};
$("#acctForgot").onclick = () => {
  const email = $("#acctEmailIn").value.trim();
  if (!email) { acctErr({ code: "auth/invalid-email" }); $("#acctEmailIn").focus(); return; }
  acctBusy(async () => { await ACCT.auth.sendPasswordResetEmail(email); const m = $("#acctErr"); m.textContent = `If an account uses ${email}, a reset link is on its way.`; m.classList.add("ok"); m.hidden = false; });
};
$("#acctOut").onclick = async () => {
  const wipe = confirm("Signed out. Also remove your work from this browser?\n\nOK removes it here (it stays saved in your account). Cancel keeps it on this device.");
  await acctPush(); await ACCT.auth.signOut();
  if (wipe) { try { Object.keys(localStorage).filter(k => k.startsWith("rp-")).forEach(k => localStorage.removeItem(k)); } catch {} location.reload(); }
};
document.addEventListener("click", e => { const m = $("#acctMe"); if (m.open && !m.contains(e.target)) m.open = false; });
function acctPaint(u) {
  $("#acctIn").hidden = $("#acctUp").hidden = !!u; $("#acctMe").hidden = !u;
  if (!u) return;
  const name = u.displayName || (u.email || "").split("@")[0];
  $("#acctName").textContent = name; $("#acctEmail").textContent = u.email || name;
  const av = $("#acctAv");
  if (u.photoURL && /^https:\/\//.test(u.photoURL)) { av.style.backgroundImage = `url("${u.photoURL.replace(/"/g, "")}")`; av.textContent = ""; }
  else { av.style.backgroundImage = ""; av.textContent = (name[0] || "?").toUpperCase(); }
}
function acctHasWork() { try { return Object.keys(localStorage).some(k => k.startsWith("rp-") && k !== "rp-grade") || !!(store.get("rp-grade", {}) || {}).text; } catch { return false; } }
async function acctChanged(u) {
  ACCT.user = u; acctPaint(u);
  if (!u) { acctMark.set(null); return; }
  if ($("#acctDlg").open) $("#acctDlg").close();
  const ref = ACCT.db.collection("users").doc(u.uid);
  let snap; try { snap = await ref.get(); } catch { $("#acctSync").textContent = "Signed in. Syncing is paused (couldn't reach your saved work)."; return; }
  const mark = acctMark.get() || {}, cloud = snap.exists ? snap.data() : null;
  if (!cloud) { await acctPush(); toast("Signed in. Your work now syncs to your account."); return; }
  const sameDevice = mark.uid === u.uid;
  if (sameDevice && mark.syncedAt >= cloud.savedAt) { acctStatus(cloud.savedAt); return; }
  if (!sameDevice && acctHasWork() && !confirm(`Your account has work saved ${new Date(cloud.savedAt).toLocaleString()}.\n\nOK loads your account's work here. Cancel keeps what's in this browser and saves it to your account instead.`)) { await acctPush(); return; }
  let data; try { data = JSON.parse(cloud.data); } catch { return; }
  ACCT.applying = true;
  try { Object.keys(localStorage).filter(k => k.startsWith("rp-")).forEach(k => localStorage.removeItem(k)); } catch {}
  Object.entries(data.data || {}).forEach(([k, v]) => { if (k.startsWith("rp-")) store.set(k, v); });
  acctMark.set({ uid: u.uid, syncedAt: cloud.savedAt });
  location.reload();
}
function acctStatus(at) { $("#acctSync").textContent = `Synced ${new Date(at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}. Your work follows you to any device you sign in on.`; }
async function acctPush() {
  clearTimeout(ACCT.pushT);
  if (!ACCT.user || ACCT.applying) return;
  const json = JSON.stringify(backupData()), savedAt = new Date().toISOString();
  if (json.length > 900000) { $("#acctSync").textContent = "Your saved work is too large to sync (often big attached files in the tracker). It's still saved in this browser."; return; }
  try { await ACCT.db.collection("users").doc(ACCT.user.uid).set({ data: json, savedAt }); acctMark.set({ uid: ACCT.user.uid, syncedAt: savedAt }); acctStatus(savedAt); }
  catch { $("#acctSync").textContent = "Couldn't sync just now. Your work is still saved in this browser; we'll try again."; }
}
function acctQueue() { if (!ACCT.user || ACCT.applying) return; clearTimeout(ACCT.pushT); ACCT.pushT = setTimeout(acctPush, 4000); }
{ const set0 = store.set; store.set = (k, v) => { set0.call(store, k, v); if (k.startsWith("rp-")) acctQueue(); }; }
["resumeText", "jobText"].forEach(id => $("#" + id).addEventListener("input", acctQueue));
window.addEventListener("pagehide", () => { if (ACCT.pushT) acctPush(); });
if (acctMark.get()) acctLoad().catch(() => {});

/* ================= Backup and restore ================= */
function backupData() {
  const data = {};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("rp-")) data[k] = JSON.parse(localStorage.getItem(k)); } } catch {}
  data["rp-grade"] = { mode, text: $("#resumeText").value, job: $("#jobText").value, company: $("#companyName").value, role: $("#roleName").value };
  return { app: "gradeline", version: 1, savedAt: new Date().toISOString(), data };
}
$("#bkSave").onclick = () => saveFile(`onestop-backup-${today()}.json`, new Blob([JSON.stringify(backupData(), null, 2)], { type: "application/json" }));
$("#bkFile").onchange = async e => {
  const f = e.target.files[0]; e.target.value = ""; if (!f) return;
  let b; try { b = JSON.parse(await f.text()); } catch { toast("That file isn't a One Stop backup."); return; }
  if (!b || !["gradeline", "red-pen-resume-lab"].includes(b.app) || typeof b.data !== "object") { toast("That file isn't a One Stop backup."); return; }
  if (!confirm("Replace the work saved in this browser with this backup?")) return;
  Object.entries(b.data).forEach(([k, v]) => { if (k.startsWith("rp-")) store.set(k, v); });
  location.reload();
};
function restoreGradeDoc() {
  const g = store.get("rp-grade", null); if (!g || !g.text) return false;
  setMode(g.mode || "resume"); $("#resumeText").value = g.text; $("#jobText").value = g.job || ""; $("#companyName").value = g.company || ""; $("#roleName").value = g.role || "";
  $("#sampleTag").hidden = true; grade(); return true;
}

initBuilder();
function renderRubric() {
  const row = ([id, r]) => `<tr class="${r.w ? "" : "tip"}"><td><b>${esc(r.name)}</b></td><td>${esc(r.looks)}</td><td class="w">${r.w ? r.w : "tip"}</td><td><span class="src-links">${r.src.length ? r.src.map(k => `<a href="${SRC[k].url}" target="_blank" rel="noopener">${esc(SRC[k].short)}</a>`).join("") : "Common advice"}</span></td><td>${(GRADERS[id] || []).join(", ") || "–"}</td></tr>`;
  const head = `<thead><tr><th>Rule</th><th>What we check</th><th>Weight</th><th>Backed by</th><th>Also checked by</th></tr></thead>`;
  const sort = arr => arr.sort((a, b) => b[1].w - a[1].w);
  $("#rubricResume").innerHTML = head + "<tbody>" + sort(Object.entries(RUBRIC).filter(([, r]) => r.doc === "Resume")).map(row).join("") + "</tbody>";
  $("#rubricLetter").innerHTML = head + "<tbody>" + sort(Object.entries(RUBRIC).filter(([, r]) => r.doc === "Cover letter")).map(row).join("") + "</tbody>";
  $("#rubricLi").innerHTML = head + "<tbody>" + sort(Object.entries(RUBRIC).filter(([, r]) => r.doc === "LinkedIn")).map(row).join("") + "</tbody>";
  $("#srcList").innerHTML = Object.values(SRC).map(x => `<a class="sheet res" href="${x.url}" target="_blank" rel="noopener"><span class="src-type">${esc(x.type)}</span><b>${esc(x.name)}</b><span>${esc(x.note)}</span></a>`).join("");
}
renderRubric();
route();
if (!restoreGradeDoc()) loadSample("weakResume");
