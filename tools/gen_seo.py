"""Builds One Stop's search landing pages (one per tool, plus one per company interview guide),
the Privacy and About pages, sitemap.xml and robots.txt into public/.
Needs Node (reads the company guides from public/interview-bank.js).
Run: python3 -I tools/gen_seo.py [site_url]
The default site_url is the old Netlify address; tools/build_pages.py swaps it for the GitHub Pages URL at deploy."""
import json, os, re, subprocess, sys, urllib.parse, html as H

SITE = (sys.argv[1] if len(sys.argv) > 1 else "https://enchanting-cobbler-9bc669.netlify.app").rstrip("/")
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public") + "/"
TODAY = "2026-11-04"

PAGES = [
  dict(slug="free-resume-checker", nav="Resume checker",
    title="Free resume checker: score and fix your resume | One Stop",
    desc="Check your resume for free. Get a score out of 100, red-pen suggestions you can accept with one click, and the career-center source behind every rule. No account needed.",
    h1="Free resume checker", app="grade", cta="Check my resume",
    lead="Paste your resume or drop in a PDF or Word file. One Stop scores it out of 100, marks it up line by line, and shows the career-center guidance behind every check. It's free, with no account and no paywall.",
    steps=["Drop in your resume (PDF, Word or text), or paste it.", "Optionally paste the job posting and pick your field.", "Read the score, then accept or skip each red-pen suggestion."],
    checks=["Contact details, standard sections and dates on every role",
      "Bullets that start with an action verb and include a number, % or $",
      "Duty language like \"responsible for\" and unproven buzzwords like \"team player\"",
      "Length (about one to two pages) and bullet length",
      "Personal details to leave off, such as birth date, marital status or \"references available\"",
      "Keywords and the job title from the posting you paste",
      "Extra checks for nursing, tech, teaching, accounting, creative and skilled-trades resumes"],
    faq=[("Is it really free?", "Yes. The grader, builder, templates and downloads are free, with no account and no paywall."),
      ("Is my resume uploaded?", "No. Grading runs in your browser and your resume stays on your device. The only time anything is saved online is if you choose to create a Mentor review link to share."),
      ("Where do the rules come from?", "Each check links the career-center or hiring guidance it is based on, from sources such as Harvard, MIT and Purdue career offices. The How we grade page lists them all."),
      ("Can a score guarantee an interview?", "No. It is an automated first pass. It can't judge truthfulness, design or fit for a role, so have a person read your resume too.")]),
  dict(slug="ats-resume-checker", nav="ATS check",
    title="Free ATS resume checker: see what hiring software reads | One Stop",
    desc="See your resume the way applicant tracking systems read it: the plain text, the sections they find and what they miss. Free, private, and no sign-up.",
    h1="Free ATS resume checker", app="tailor", cta="See what the robot sees",
    lead="Applicant tracking systems read your resume as plain text before a person does. One Stop's ATS view shows you that text, so you can catch columns, tables and headers that come out scrambled.",
    steps=["Open Tailor & ATS check.", "Drop in your resume PDF or Word file. It's read in your browser, never uploaded.", "Fix anything that came through out of order or missing, then send the text to the grader."],
    checks=["The plain text an ATS would pull from your file, line by line",
      "What it recognized, such as your name, contact details and sections",
      "Layout warnings for things like merged columns, icons that turn into junk characters and contact details hidden in a page header",
      "Single-column templates and a builder that export ATS-readable PDF and Word files"],
    faq=[("Is this the same as a real ATS?", "No tool can copy every ATS exactly. This shows the plain-text reading most of them start from, which is where most formatting problems show up."),
      ("Do I need a special ATS template?", "A clean single-column layout with standard headings works best. All of One Stop's templates and builder layouts follow that."),
      ("Is it free?", "Yes, with no account and no paywall.")]),
  dict(slug="resume-keyword-scanner", nav="Keyword scanner",
    title="Free resume keyword scanner: match your resume to a job | One Stop",
    desc="Paste a job posting and your resume to see which keywords and phrases you have and which you're missing. Free, private, with no account.",
    h1="Free resume keyword scanner", app="match", cta="Scan my resume",
    lead="Paste a job posting next to your resume. One Stop pulls out the posting's most important terms and phrases, then shows which ones your resume already covers and which are missing.",
    steps=["Paste the job posting.", "Paste or load your resume.", "Add the missing terms you can honestly claim, in your own words."],
    checks=["Multi-word phrases like \"project management\", not only single words",
      "Related words that count partly, so you aren't penalized for a synonym",
      "\"N years of experience\" requirements compared against your dates",
      "Whether the exact job title appears",
      "Tailor to a job: a side-by-side view to rework bullets for one posting"],
    faq=[("Should I copy the posting's words exactly?", "Use the posting's terms where they are true for you. Keyword stuffing without real experience behind it tends to fall apart in an interview."),
      ("Is the job posting stored?", "No. It stays in your browser.")]),
  dict(slug="cover-letter-checker", nav="Cover letter checker",
    title="Free cover letter checker: grade and improve your letter | One Stop",
    desc="Grade your cover letter for free: length, greeting, tailoring to the company, numbers, closing ask and clichés, with the source behind each check.",
    h1="Free cover letter checker", app="grade", cta="Check my cover letter",
    lead="Switch the grader to Cover letter, paste your letter, and add the company and job title. One Stop checks the things career centers say make a letter work, and marks up the lines to fix.",
    steps=["Choose Cover letter on the Grade page.", "Paste your letter, plus the company name and job title.", "Work through the red-pen suggestions."],
    checks=["One page, about 220 to 420 words, in three or four body paragraphs",
      "A greeting to a named person, or \"Dear Hiring Manager\" as a fallback",
      "An opening that doesn't start with \"My name is\"",
      "The company named and the position stated",
      "At least two specific numbers or results",
      "Not every sentence starting with \"I\"",
      "A closing that asks for a conversation, and a sign-off",
      "No flowery clichés, salary talk or \"as you can see on my resume\""],
    faq=[("Do you write the letter for me?", "No. One Stop grades your letter and suggests fixes. There are free cover letter templates and a builder if you're starting from scratch."),
      ("Is my letter uploaded?", "No. Grading runs in your browser.")]),
  dict(slug="linkedin-profile-checker", nav="LinkedIn checker",
    title="Free LinkedIn profile checker: grade your headline and About | One Stop",
    desc="Paste your LinkedIn headline, About and experience to get a free score with fixes for each section. No LinkedIn login needed.",
    h1="Free LinkedIn profile checker", app="linkedin", cta="Check my LinkedIn",
    lead="Paste your headline, About section and experience, and tick the basics like photo and banner. One Stop grades the profile section by section. You never sign in to LinkedIn here.",
    steps=["Copy your headline, About and experience from LinkedIn.", "Paste them in and tick the profile basics you have.", "Use the fixes and the live preview to rewrite each section."],
    checks=["Headline length, and whether it says more than a bare title",
      "An About section of 100+ words, under LinkedIn's 2,600-character limit",
      "Experience entries with dates, descriptions and numbers",
      "Keywords from the jobs you're targeting",
      "10 or more skills, a custom URL, location and industry",
      "Photo, banner, connections and recommendations"],
    faq=[("Do I have to log in to LinkedIn?", "No. You paste the text yourself, so One Stop never touches your account."),
      ("Is One Stop part of LinkedIn?", "No. One Stop is an independent tool and is not affiliated with LinkedIn.")]),
  dict(slug="free-resume-builder", nav="Resume builder",
    title="Make a resume free: resume builder with PDF and Word download | One Stop",
    desc="Build a resume or cover letter that grades itself as you type. Three ATS-readable layouts, free PDF and Word downloads, no account.",
    h1="Free resume builder", app="build", cta="Start building",
    lead="Fill in the form and watch your resume take shape and score itself as you type. Download it as a PDF or Word file for free. There's no account and no watermark.",
    steps=["Start blank or load the example.", "Fill in each section. The score and top fixes update live.", "Pick Classic, Modern or Compact, then download PDF or Word."],
    checks=["Three single-column layouts that hiring software can read",
      "A live score and top fixes while you write",
      "Keyword match against a posting you paste",
      "A page counter so you know when you've run past one page",
      "A cover letter builder in the same place"],
    faq=[("Is the download really free?", "Yes, PDF and Word, with no account and no watermark."),
      ("Where is my draft saved?", "In this browser only. You can back it up to a file from the bottom of any page.")]),
  dict(slug="job-search", nav="Job search",
    title="Job search for students and new grads: internships and entry-level jobs | One Stop",
    desc="Search thousands of internships and entry-level jobs by major, pulled from company career pages several times a day. Free, with links to recruiters and alumni to contact.",
    h1="Internship and entry-level job search", app="internships", cta="Search jobs",
    lead="One Stop pulls internships and entry-level openings straight from company career pages several times a day and sorts them by major. Each listing links to the employer's own application page and to people worth contacting: recruiters, alumni from your school, and people who work there near you.",
    steps=["Open Find jobs and pick internships or entry-level.", "Filter by major, industry, city, date posted or remote.", "Apply on the company's site, reach out to a recruiter or alum, and save the job to your tracker."],
    checks=["Internships, co-ops and full-time new-grad roles",
      "Openings from hundreds of employers, refreshed every few hours",
      "Filters for major, industry, location, date posted and remote",
      "Recruiter and alumni contact links for every listing",
      "One-click save to a free job tracker"],
    faq=[("Do you post jobs or take applications?", "No. Every listing links to the employer's own careers page, so you always apply directly."),
      ("How do the contact links work?", "They open a LinkedIn people search for that company's recruiters, your school's alumni there, or people in that city. One Stop doesn't collect or store anyone's profile."),
      ("Is it free?", "Yes. No account is needed to search, apply or save jobs.")]),
  dict(slug="resume-maker", nav="Resume maker",
    title="Free resume maker: make a resume online in minutes | One Stop",
    desc="Make a resume online for free. Pick from nine ATS-friendly templates, fill in a builder that grades itself as you type, and download PDF or Word with no watermark.",
    h1="Make a resume online, free", app="build", cta="Make my resume",
    lead="Pick a template or start from scratch, fill in your experience, and watch the score update as you type. When it looks right, download it as a PDF or Word file. No paywall, no watermark.",
    steps=["Choose one of nine templates, or start blank in the builder.", "Fill in each section. Fixes appear as you write.", "Download a PDF or Word file and apply."],
    checks=["Nine templates for students, career changers, healthcare, sales, trades and more",
      "Single-column layouts that applicant tracking systems can read",
      "A live score with the top fixes to make next",
      "Free PDF and Word downloads",
      "A cover letter builder and job search in the same place"],
    faq=[("How long does it take to make a resume?", "Most people finish a first draft in 20 to 30 minutes with a template."),
      ("Do I need an account?", "No. Sign in only if you want your draft synced across devices.")]),
  dict(slug="free-alternative-to-paid-resume-checkers", nav="Free alternative",
    title="A free alternative to paid resume checkers | One Stop",
    desc="Many resume checkers limit free scans or put fixes behind a subscription. One Stop is free, needs no account, and shows the source behind every rule.",
    h1="A free alternative to paid resume checkers", app="grade", cta="Try it free",
    lead="Many resume checkers give you a few free scans, then ask for a subscription to see the fixes. One Stop takes a different approach. The core tools are free with no account, and every rule shows where it comes from, so you can decide whether to follow it.",
    steps=["Check your resume, cover letter or LinkedIn.", "See the source behind each check on How we grade.", "Keep everything on your device, and back it up to a file if you like."],
    checks=["Unlimited checks, with no sign-up",
      "Line-by-line red-pen suggestions you can accept or undo",
      "Sources from career centers and hiring guides, linked on every check",
      "A builder, templates, ATS view, bullet coach, interview prep and a job tracker",
      "Grading that runs in your browser instead of on a server"],
    faq=[("What's the catch?", "There isn't one for the core tools. One Stop doesn't sell your data or need an account."),
      ("Does One Stop use AI to rewrite my resume?", "No. The checks are transparent rules with sources. Any suggestion is shown to you first, and nothing changes unless you accept it."),
      ("Is it as good as a paid tool?", "It covers the checks that career centers recommend most. Paid tools may add features like AI rewriting. Try both and keep whichever helps you more.")]),
  # ---- Tools added after the first round of landing pages (interview prep, writing helpers, job tools) ----
  dict(slug="interview-prep", nav="Interview prep",
    title="Free interview prep: practice questions with a STAR answer builder | One Stop",
    desc="Practice for your interview free: 490+ questions by field, questions built from your own resume, a timed practice mode and a STAR answer guide. No account needed.",
    h1="Free interview prep", app="interview", cta="Start practicing",
    lead="Practice for the interview you actually have. Pick your field to get the questions employers in it tend to ask, or let One Stop build questions from the bullets on your own resume. Write your answers in the STAR format and rehearse them against a two-minute timer.",
    steps=["Open Interview prep and pick your field, or search the question bank.", "Write an answer for each question. It saves in your browser as you type.", "Press Practice to get random questions against a timer, like a recorded video interview."],
    checks_h="What's inside",
    checks=["More than 490 practice questions across 28 fields and question types, from behavioral to case, technical and nursing",
      "Questions written from your own resume, because every bullet is a claim an interviewer may ask about",
      "Interview guides for 63 large employers of students and new grads",
      "A STAR guide with a worked example, a story-bank checklist and common mistakes",
      "Tips for recorded video interviews such as HireVue",
      "A two-minute practice timer and an \"only unanswered\" filter"],
    faq=[("What is the STAR method?", "STAR stands for situation, task, action and result. It's a simple way to answer \"Tell me about a time...\" questions: a sentence or two of background, then most of your time on what you did and what happened as a result."),
      ("How long should an interview answer be?", "About one to two minutes for most behavioral answers. The practice timer is set to two minutes so you can get a feel for it."),
      ("Are my answers saved?", "Yes, in your browser on this device. They aren't uploaded. If you sign in, they sync to your account so you can see them on another device."),
      ("Is it free?", "Yes, with no account and no paywall.")]),
  dict(slug="linkedin-post-helper", nav="LinkedIn post helper",
    title="Free LinkedIn post generator for students and new grads | One Stop",
    desc="Write a LinkedIn post about a new job, internship, graduation, project or award. Answer a few questions and get a draft with a strong first line, a preview and hashtags.",
    h1="LinkedIn post helper", app="linkedin-post", cta="Write my post",
    lead="Pick what you're posting about and answer a few questions in your own words. One Stop turns your answers into a draft with a clear opening line, short paragraphs and a few hashtags, shows what people see before \"...more\", and checks it against common LinkedIn advice.",
    steps=["Pick a topic, such as a new job, a finished internship or a project you built.", "Answer a few short questions and choose a tone.", "Edit the draft, check the preview, then copy it into LinkedIn."],
    checks_h="What it helps with",
    checks=["Posts for a new job, starting or finishing an internship, graduation, a project, a certification or award, an event or career fair, looking for a job, or a lesson you learned",
      "Three tones: professional, friendly and short",
      "A choice of opening line, so the first words make people stop scrolling",
      "A preview of the part that shows before \"...more\"",
      "A character count against LinkedIn's 3,000-character limit",
      "Suggested hashtags you can tap to add or remove"],
    faq=[("Does it write the post with AI?", "No. It assembles a draft from your own answers using simple templates, so it sounds like you. You can edit every word."),
      ("Do I need to sign in to LinkedIn?", "No. One Stop never connects to your LinkedIn account. You copy the post and paste it in yourself."),
      ("Is One Stop part of LinkedIn?", "No. One Stop is an independent tool and is not affiliated with LinkedIn.")]),
  dict(slug="internship-recruiting-calendar", nav="Recruiting calendar",
    title="Internship recruiting calendar: when applications open by industry | One Stop",
    desc="See when internship applications usually open for investment banking, consulting, Big 4, tech, engineering and more, plus who's hiring now and a calendar reminder.",
    h1="Internship recruiting calendar", app="calendar", cta="Open the calendar",
    lead="Big employers open internship applications on a yearly rhythm, and some fill months before the internship starts. The recruiting calendar shows when each industry usually opens, which firms are hiring on One Stop right now, and lets you add a reminder to your own calendar.",
    steps=["Find your industry on the calendar.", "See which firms in it have openings posted right now.", "Download a reminder for Google Calendar, Outlook or Apple Calendar so you apply in the first few weeks."],
    checks_h="Industries covered",
    checks=["Investment banking, where summer analyst roles open about 18 months ahead",
      "Asset management, and quant and trading",
      "Big 4 accounting, including sophomore leadership programs",
      "Consulting",
      "Big tech and software",
      "Consumer goods and marketing",
      "Engineering, aerospace and defense",
      "Retail, supply chain and operations",
      "Startups and smaller companies"],
    faq=[("When should I start applying for summer internships?", "It depends on the industry. Banking and some quant firms open more than a year ahead, Big 4 and big tech open in late summer and early fall, and smaller companies and startups keep hiring into the spring."),
      ("Are these exact deadlines?", "No. They're the usual windows based on how each industry has recruited in recent years. Always check the employer's own careers page for the real date."),
      ("Can I get alerts for new openings?", "Yes. Save a search on Find jobs, and if you sign in with a confirmed email you can get a daily email when new matches are posted.")]),
  dict(slug="job-application-kit", nav="Application kit",
    title="Free job application kit: tailored resume check, cover letter and follow-up | One Stop",
    desc="Paste a job posting and your resume to get a resume check for that job, a cover letter draft from your own bullets, a LinkedIn note for the recruiter and a follow-up plan.",
    h1="Job application kit", app="kit", cta="Build my kit",
    lead="One job, everything you need to apply. Paste the posting and your resume. You'll get a resume check against that posting with the keywords you're missing, a cover letter draft built from your strongest bullets, a short LinkedIn note for the recruiter, and a follow-up plan with dates.",
    steps=["Paste the job posting, or load a job you saved from Find jobs.", "Load your resume from the grader or the builder.", "Work through the kit: fix your resume, finish the cover letter, then send the note and follow up on schedule."],
    checks_h="What's in the kit",
    checks=["A resume score for this posting, with the keywords it uses that your resume doesn't",
      "Each requirement in the posting matched to the line on your resume that proves it",
      "A cover letter draft built from your own bullets, with [brackets] where you add your own words",
      "A short LinkedIn connection note for the recruiter or hiring manager",
      "A follow-up plan you can add to your job tracker"],
    faq=[("Does it write my cover letter for me?", "It drafts one from your own resume bullets so you aren't starting from a blank page. You fill in the bracketed parts and edit it until it sounds like you."),
      ("Is the posting or my resume uploaded?", "No. The kit is worked out in your browser and nothing is uploaded."),
      ("Is it free?", "Yes, with no account and no paywall.")]),
  dict(slug="follow-up-email-templates", nav="Follow-up templates",
    title="Free follow-up email templates: thank-you notes, check-ins and referral asks | One Stop",
    desc="Fill in a few details and get a short follow-up email or LinkedIn message: after applying, thank-you after an interview, checking in, asking for a referral or a coffee chat.",
    h1="Follow-up email and message templates", app="follow-up", cta="Write my message",
    lead="Know what to send, and when to send it. Pick the moment you're at and fill in a few details, and One Stop gives you a short message you can copy into email or LinkedIn. Anything you leave blank shows up in [brackets], so you don't send a template by mistake.",
    steps=["Pick the message you need, such as a thank-you after an interview.", "Fill in the company, the person and a detail or two.", "Copy the message, or open it straight in your email app."],
    checks_h="Messages included",
    checks=["Following up on an application",
      "A thank-you after an interview, and a check-in when you haven't heard back",
      "Reaching out to a recruiter",
      "Asking for a referral",
      "A connection note to an alum, asking for a coffee chat, and a thank-you afterwards",
      "Replying to a rejection in a way that keeps the door open"],
    faq=[("How long should I wait to follow up after applying?", "About one to two weeks is common. After an interview, send a thank-you within a day, then check in if you haven't heard back by the date they gave you, or after about a week."),
      ("Is my message saved?", "Your answers stay in your browser on this device. Nothing is sent until you copy it or open it in your own email.")]),
  dict(slug="rejection-email-feedback", nav="Rejection feedback",
    title="Got a rejection email? Find likely reasons and what to change next | One Stop",
    desc="Paste a job rejection email to see what it does and doesn't say, the likely reasons at that stage, what to change before your next application, and a reply that keeps the door open.",
    h1="Turn a rejection email into a next step", app="rejection", cta="Read my rejection",
    lead="Paste the rejection email you got and say how far you got. One Stop reads what the email does and doesn't say, lists the most likely reasons for a rejection at that stage, suggests what to change before your next application, and drafts a reply that keeps the door open.",
    steps=["Paste the rejection email, or try one of the examples.", "Say how far you got and how long after applying it arrived.", "Read the likely reasons and next steps, then send the reply if it fits."],
    checks_h="What you get",
    checks=["What the email does and doesn't tell you",
      "Likely reasons for a rejection after applying, a phone screen, interviews or a final round",
      "What to change before your next application",
      "A short, gracious reply you can send"],
    faq=[("Can it tell me the real reason I was rejected?", "No. Rejection emails rarely give the real reason. This gives a best guess based on the stage and the wording, not a verdict."),
      ("Should I reply to a rejection email?", "If you met people in interviews, a short thank-you that asks to be considered for future roles is worth sending. For an automatic email after applying, it usually isn't needed."),
      ("Is the email uploaded?", "No. It's read in your browser.")]),
  dict(slug="resume-examples-before-and-after", nav="Before & after examples",
    title="Resume examples before and after: six real-style rewrites, scored | One Stop",
    desc="See six resumes before and after one round of edits, for nursing, tech, accounting, creative, teaching and trades jobs, each scored by the same checker you can use free.",
    h1="Resume examples, before and after", app="gallery", cta="See the examples",
    lead="Six resumes, before and after one round of edits. Each is graded by the same checker you use on the Grade page, against a realistic job posting for its field. Switch between versions, read what changed, and open either one in the grader to see every check.",
    steps=["Pick an example in your field.", "Switch between the before and after versions and read what changed.", "Open either version in the grader to see every check, then apply the same fixes to your own resume."],
    checks_h="Fields covered",
    checks=["Nursing and healthcare", "Software and tech", "Accounting and finance", "Design, marketing and creative", "Teaching and education", "Skilled trades"],
    faq=[("Are these real people's resumes?", "No. They're made-up examples written to show common fixes. The people, schools and employers are fictional, and no user's resume is shown."),
      ("Why are the scores live?", "Each example is scored by the current checker when you open it, so the numbers always match what the grader would give you today.")]),
]

CSS = """:root{--bg:#f6f5f0;--paper:#fff;--ink:#16232c;--muted:#5b6670;--line:#e3e1d9;--blue:#2549d3;--red:#c0302b;--soft:#eef2f7;--night:#19303a}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#11161d;--paper:#1a212b;--ink:#e8edf3;--muted:#a3aebd;--line:#2d3744;--blue:#8fb1ee;--red:#ef7a73;--soft:#222b37;--night:#0c1f27}}
:root[data-theme=dark]{--bg:#11161d;--paper:#1a212b;--ink:#e8edf3;--muted:#a3aebd;--line:#2d3744;--blue:#8fb1ee;--red:#ef7a73;--soft:#222b37;--night:#0c1f27}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 Inter,"Segoe UI",system-ui,sans-serif}
a{color:var(--blue)}.wrap{max-width:860px;margin:0 auto;padding:0 16px}
header{background:var(--paper);border-bottom:1px solid var(--line)}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:12px;flex-wrap:wrap}
.brand{text-decoration:none;color:var(--ink);font:500 1.3rem "Source Serif 4",Georgia,serif}.brand span{color:inherit}
h1,h2,h3{font-family:"Source Serif 4",Georgia,serif;font-weight:500;line-height:1.15;text-wrap:balance}h1{font-size:clamp(2rem,5vw,2.8rem);margin:40px 0 12px}h2{font-size:1.35rem;margin:36px 0 10px}h3{font-size:1.1rem;margin:22px 0 6px}
.lead{font-size:1.12rem;color:var(--muted);max-width:68ch}.cta{display:inline-block;margin:20px 0 4px;background:var(--blue);color:var(--paper);text-decoration:none;font-weight:700;padding:12px 22px;border-radius:4px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:4px;padding:18px 22px}ol,ul{padding-left:22px;margin:0}li{margin:6px 0}
.card p{margin:0 0 10px}.card p:last-child{margin-bottom:0}.card+.card{margin-top:12px}
.night{background:var(--night);color:#fff;border-radius:4px;padding:20px 22px}.night h2{color:#fff;margin-top:0}.night p,.night li{color:#dfe7ea}.night a{color:#fff}
.tip{display:block;color:var(--muted);font-size:.92rem}
.cos{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:4px 18px;list-style:none;padding:0}.cos li{margin:3px 0}
details{border-bottom:1px solid var(--line);padding:12px 0}summary{cursor:pointer;font-weight:700}details p{margin:8px 0 0;color:var(--muted)}
.more{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0}.more a{display:inline-block;border:1px solid var(--line);background:var(--paper);border-radius:3px;padding:6px 14px;text-decoration:none;color:var(--ink);font-size:.92rem}
.btn{font:inherit;font-size:.92rem;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:4px;padding:8px 14px;cursor:pointer}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
footer{margin-top:48px;border-top:1px solid var(--line);padding:20px 0 40px;color:var(--muted);font-size:.9rem}footer a{color:inherit}"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap">'
ICON = re.search(r'<link rel="icon"[^>]+>', open(OUT + "index.html").read()).group(0)
# Usage stats (GoatCounter). Off until a site code is set in public/assets/analytics.js.
STATS = '<script src="/assets/analytics.js" defer></script>'
e = lambda s: H.escape(s, quote=True)

FOOTER = ('<footer><div class="wrap">One Stop · free resume builder, resume checker, interview prep and job search · '
          '<a href="/about/">About</a> · <a href="/privacy/">Privacy</a> · <a href="/#terms">Terms</a></div></footer>')

def more_links(skip=None):
    links = [(f'/{p["slug"]}/', p["nav"]) for p in PAGES if p["slug"] != skip]
    if skip != "company-interview-questions":
        links.insert(len(links) - 1, ("/company-interview-questions/", "Company interview questions"))
    return "".join(f'<li><a href="{u}">{e(n)}</a></li>' for u, n in links)

def shell(title, desc, url, h1_ld, body, faq=(), header_href="/", header_text="Open One Stop", extra_head=""):
    """One full page: head with canonical, Open Graph and JSON-LD, then the shared header and footer."""
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "name": h1_ld, "url": url, "description": desc,
           "isPartOf": {"@type": "WebSite", "name": "One Stop", "url": SITE + "/"}}]
    if faq:
        ld.append({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]})
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="One Stop">
{ICON}
{FONTS}
<style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld)}</script>
{STATS}{extra_head}
</head>
<body>
<header><div class="wrap"><a class="brand" href="/">One<span> Stop</span></a><a href="{header_href}">{e(header_text)}</a></div></header>
<main class="wrap">
{body}
</main>
{FOOTER}
</body>
</html>
"""

def faq_html(faq):
    return "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in faq)

def page(p):
    url = f'{SITE}/{p["slug"]}/'
    href = p.get("href", f'/#{p["app"]}')
    rules = '<p>See every rule and its source on <a href="/#how-we-grade">How we grade</a>.</p>\n' if "checks_h" not in p else ""
    body = f"""<h1>{e(p["h1"])}</h1>
<p class="lead">{e(p["lead"])}</p>
<a class="cta" href="{href}">{e(p["cta"])}</a>
<h2>How it works</h2>
<div class="card"><ol>{"".join(f"<li>{e(s)}</li>" for s in p["steps"])}</ol></div>
<h2>{e(p.get("checks_h", "What it checks"))}</h2>
<div class="card"><ul>{"".join(f"<li>{e(c)}</li>" for c in p["checks"])}</ul></div>
{rules}<h2>Questions</h2>
{faq_html(p["faq"])}
<h2>More free tools</h2>
<ul class="more">{more_links(p["slug"])}</ul>"""
    return shell(p["title"], p["desc"], url, p["h1"], body, p["faq"], href, "Open the tool")

def write(slug, html_text):
    os.makedirs(OUT + slug, exist_ok=True)
    open(f"{OUT}{slug}/index.html", "w").write(html_text)

for p in PAGES:
    write(p["slug"], page(p))

# ---- Company interview pages, built from the same data the Interview prep tool uses ----
def load_interview_data():
    """Read IP_COMPANIES and IP_CO_GROUPS out of public/interview-bank.js with Node."""
    js = ("const fs=require('fs');const src=fs.readFileSync(process.argv[1],'utf8');"
          "const f=new Function(src+';return {groups:IP_CO_GROUPS,cos:IP_COMPANIES,fields:IP_FIELDS};');"
          "process.stdout.write(JSON.stringify(f()));")
    out = subprocess.run(["node", "-e", js, OUT + "interview-bank.js"], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def co_slug(name):
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower().replace("&", " and "))).strip("-")

IP = load_interview_data()
COS = IP["cos"]
QCOUNT = sum(len(g["qs"]) for f in IP["fields"] for g in f["groups"])
CO_URLS = []

def app_link(name):
    return "/?co=" + urllib.parse.quote_plus(name) + "#interview"

def company_page(c):
    slug = co_slug(c["n"])
    url = f"{SITE}/company-interview-questions/{slug}/"
    group = IP["groups"][c["g"]]
    title = f'{c["n"]} interview questions and process for students | One Stop'
    desc = (f'How {c["n"]} interviews usually run, what they say they look for, and {len(c["qs"])} commonly reported questions '
            f'with tips. Practice your answers free with a STAR guide and timer.')
    faq = [(f'What is the {c["n"]} interview process like?', " ".join(s.rstrip(".") + "." for s in c["steps"]) + " Steps vary by team, role and year, so ask your recruiter."),
           (f'What does {c["n"]} look for?', c["look"])]
    qs = "".join(f'<li>{e(q)}{f"<span class=tip>{e(t)}</span>" if t else ""}</li>' for q, t in c["qs"])
    near = [x for x in COS if x["g"] == c["g"] and x is not c][:8]
    body = f"""<p><a href="/company-interview-questions/">Company interview questions</a> · {e(group)}</p>
<h1>{e(c["n"])} interview questions</h1>
<p class="lead">How {e(c["n"])} interviews students and new grads, what they say they look for, and the questions candidates commonly report. Write your answers and practice them against a timer in One Stop's free interview prep.</p>
<a class="cta" href="{app_link(c["n"])}">Practice these questions</a>
<h2>How the interview usually goes</h2>
<div class="card"><ol>{"".join(f"<li>{e(s)}</li>" for s in c["steps"])}</ol></div>
<h2>What {e(c["n"])} looks for</h2>
<div class="card"><p>{e(c["look"])}</p></div>
<h2>Questions to prepare</h2>
<div class="card"><ol>{qs}</ol></div>
<p>Based on what {e(c["n"])} publishes about its hiring and on commonly reported questions. Steps and questions vary by team, role and year, so ask your recruiter what to expect. That's a normal question. One Stop isn't affiliated with {e(c["n"])}.</p>
<h2>How to prepare</h2>
<div class="card"><ol>
<li>Answer behavioral questions with STAR: situation, task, action, result. Spend most of your time on what you did and what happened.</li>
<li>Prepare six to eight stories you can adapt, and one for each of the values {e(c["n"])} talks about.</li>
<li>Read the job posting and your resume again the day before. Every bullet is a claim they may ask about.</li>
<li>Have two or three questions ready to ask them about the team and the role.</li></ol></div>
{f'<h2>More {e(group)} employers</h2><ul class="cos">' + "".join(f'<li><a href="/company-interview-questions/{co_slug(x["n"])}/">{e(x["n"])}</a></li>' for x in near) + "</ul>" if near else ""}
<h2>Questions</h2>
{faq_html(faq)}
<h2>More free tools</h2>
<ul class="more">{more_links()}</ul>"""
    write(f"company-interview-questions/{slug}", shell(title, desc, url, f'{c["n"]} interview questions', body, faq, app_link(c["n"]), "Practice in One Stop"))
    CO_URLS.append(url)

for c in COS:
    company_page(c)

hub_faq = [("Which companies are covered?", f"{len(COS)} large employers of students and new grads across banking, consulting, tech, engineering, consumer goods, healthcare, government and more. For any other company, type its name into Interview prep to get a research plan and the questions almost every employer asks."),
           ("Where do the questions come from?", "From what each employer publishes about its own hiring and from questions candidates commonly report. They vary by team, role and year, so use them to prepare, not to memorize answers."),
           ("Is it free?", "Yes, with no account and no paywall.")]
hub_body = f"""<h1>Company interview questions</h1>
<p class="lead">Interview guides for {len(COS)} large employers of students and new grads: how their interviews usually run, what they say they look for, and the questions candidates commonly report. Pick a company, then practice your answers in One Stop's free interview prep.</p>
<a class="cta" href="/#interview">Open interview prep</a>
""" + "".join(
    f'<h2>{e(g)}</h2><ul class="cos">' + "".join(f'<li><a href="/company-interview-questions/{co_slug(c["n"])}/">{e(c["n"])}</a></li>' for c in COS if c["g"] == i) + "</ul>"
    for i, g in enumerate(IP["groups"]) if any(c["g"] == i for c in COS)) + f"""
<h2>Questions</h2>
{faq_html(hub_faq)}
<h2>More free tools</h2>
<ul class="more">{more_links("company-interview-questions")}</ul>"""
write("company-interview-questions", shell(
    "Company interview questions: guides for 60+ big employers | One Stop",
    f"Interview questions and process guides for {len(COS)} employers that hire students and new grads, including Goldman Sachs, Deloitte, Amazon, Google and P&G. Free practice with a STAR guide.",
    f"{SITE}/company-interview-questions/", "Company interview questions", hub_body, hub_faq, "/#interview", "Open interview prep"))

# ---- Privacy and About ----
PRIVACY_DATE = "November 4, 2026"
privacy_body = f"""<h1>Privacy</h1>
<p class="lead">Your resume stays on your device. One Stop reads your files and grades them inside your browser, so we never receive them. Accounts are optional. Effective {PRIVACY_DATE}.</p>
<h2>The short version</h2>
<div class="night"><ul>
<li>Files you drop in are read by your browser. They are never uploaded to us.</li>
<li>Your work is saved in your browser's storage on your device, not on a server, unless you sign in.</li>
<li>Accounts are optional. If you don't sign in, we don't collect your name, email or resume.</li>
<li>No advertising, no tracking cookies, and we don't sell data.</li>
<li>We count visits with GoatCounter, which doesn't use cookies or collect personal information, so we can see which tools people use.</li>
</ul></div>
<h2>What is stored, and where</h2>
<div class="card">
<p><b>In your browser only.</b> The resume or letter you're grading, job postings you paste, builder content, LinkedIn checker entries and post drafts, application kits, follow-up messages, tracker rows, saved jobs, interview answers, your chosen field and checklist ticks. Clearing your browser's site data deletes them, and so does the button at the bottom of this page.</p>
<p><b>If you create an account (optional).</b> Sign-in is handled by Google Firebase Authentication, which stores your name, email address and, if you use Google sign-in, your profile picture. While you're signed in, the same work listed above is copied to this site's database (Google Cloud Firestore) under your account, so it syncs across your devices. Security rules let only you read it.</p>
<p><b>Job alerts (only if you turn them on).</b> Alerts need an account with a confirmed email. We store your email address, your saved searches and when we last emailed you. About once a day, a scheduled job compares new listings with your searches and sends one digest email through Gmail. Turn alerts off on Find jobs to stop them.</p>
<p><b>Job tracker reminders.</b> Follow-up reminders are worked out in your browser. If you download a calendar file, it goes to your device and we never see it.</p>
<p><b>Mentor review (only if you use it).</b> When you create a review link, the document text, your name and note, and reviewers' names and comments are saved in the site's database so people with the link can see them. Links are random and not listed anywhere, but anyone who has one can read and comment, so think about removing your phone number and address first.</p>
<p><b>Backups.</b> "Download backup" saves a file to your device. We never see it.</p>
</div>
<h2>Usage stats</h2>
<div class="card">
<p>To learn which tools are useful, we count page views with <a href="https://www.goatcounter.com/">GoatCounter</a>, an open-source, privacy-friendly analytics service. It records the page or tool opened (for example "Interview prep"), the site that linked you here, and your browser, operating system, screen size and country. It doesn't use cookies, doesn't store your IP address, and doesn't follow you to other sites. It never sees your resume or anything you type.</p>
<p>Review links are counted as "review" without their ID. Visits aren't counted if your browser sends Do Not Track or Global Privacy Control, or if you switch counting off here:</p>
<p><button type="button" class="btn" id="statsToggle" hidden></button> <span id="statsState" aria-live="polite"></span></p>
<p>See <a href="https://www.goatcounter.com/help/privacy">GoatCounter's privacy policy</a>.</p>
</div>
<h2>Job listings</h2>
<div class="card"><p>Find jobs shows openings collected from employers' public career pages several times a day. Searching and filtering happen in your browser. When you apply, you go to the employer's own site, and their privacy policy applies there.</p></div>
<h2>Services the site loads</h2>
<div class="card"><p>Pages load fonts from Google Fonts and code libraries (jsPDF and pdf.js) from cdnjs, run by Cloudflare. Signing in, job alerts and Mentor review load Google's Firebase library from jsDelivr. The site is hosted on GitHub Pages. Like any website request, these services receive your IP address and browser details. They don't receive your resume. See the privacy policies of <a href="https://policies.google.com/privacy">Google</a>, <a href="https://www.cloudflare.com/privacypolicy/">Cloudflare</a> and <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub</a>.</p></div>
<h2>Children</h2>
<div class="card"><p>This site isn't directed at children under 13, and we don't knowingly collect information from them.</p></div>
<h2>Deleting your data</h2>
<div class="card"><p>Use "Delete all my data in this browser" on the <a href="/#privacy">in-app privacy page</a> to clear everything stored on this device. If you have an account, sign in first and remove your work, turn off alerts, then contact us to delete the account itself.</p></div>
<h2>Changes</h2>
<div class="card"><p>If this policy changes, we'll update the date at the top.</p></div>
<script>
(() => {{
  const b = document.getElementById("statsToggle"), s = document.getElementById("statsState");
  const get = () => {{ try {{ return localStorage.getItem("gl-no-stats") === "1"; }} catch {{ return false; }} }};
  const paint = () => {{ const off = get(); b.textContent = off ? "Count my visits again" : "Don't count my visits"; s.textContent = off ? "Counting is off in this browser." : "Counting is on in this browser."; }};
  b.hidden = false; paint();
  b.onclick = () => {{ try {{ get() ? localStorage.removeItem("gl-no-stats") : localStorage.setItem("gl-no-stats", "1"); }} catch {{}} paint(); }};
}})();
</script>"""
write("privacy", shell("Privacy: your resume stays in your browser | One Stop",
    "How One Stop handles your data: resumes are graded in your browser and never uploaded, accounts are optional, and usage stats are cookie-free.",
    f"{SITE}/privacy/", "Privacy", privacy_body))

about_body = f"""<h1>About One Stop</h1>
<p class="lead">One Stop is a free place for students and early-career job seekers to do the whole job search: find openings, fix a resume, apply, follow up and prepare for the interview. There's no paywall and no account needed.</p>
<a class="cta" href="/">Open One Stop</a>
<h2>Why it exists</h2>
<div class="card"><p>Most resume checkers give you a few free scans, then charge a monthly fee to see the fixes. Career-center advice is free, but it's spread across dozens of PDFs. One Stop puts that advice into tools you can use on your own resume, and shows the source behind every rule.</p></div>
<h2>How it works</h2>
<div class="card"><ul>
<li><b>Transparent rules, not a black box.</b> Every check on the grader links to the career-center or hiring guidance it comes from, from sources such as university career offices. The <a href="/#how-we-grade">How we grade</a> page lists them all.</li>
<li><b>Private by design.</b> Grading runs in your browser, so your resume isn't uploaded. Read the <a href="/privacy/">privacy page</a> for the details.</li>
<li><b>Real openings.</b> Find jobs collects internships and entry-level roles from employers' own career pages several times a day, and every listing links to the employer's site to apply.</li>
<li><b>Honest about limits.</b> A score is an automated first pass. It can't judge truthfulness or fit, so have a person read your resume too.</li>
</ul></div>
<h2>What you can do here</h2>
<ul class="more">{more_links()}</ul>
<h2>Contact</h2>
<div class="card"><p>Found a bug, a broken listing or a rule you disagree with? Contact details are coming soon. One Stop isn't affiliated with any employer, university or LinkedIn.</p></div>"""
write("about", shell("About One Stop: a free job search and resume toolkit",
    "One Stop is a free job search toolkit for students and new grads: a resume checker with sources, job search, application tools and interview prep, with your resume kept in your browser.",
    f"{SITE}/about/", "About One Stop", about_body))

# ---- Main page: canonical, structured data, crawlable links to the landing pages, usage stats ----
idx = open(OUT + "index.html").read()
idx = re.sub(r'\n<link rel="canonical"[^>]*>|\n<meta property="og:url"[^>]*>|\n<script type="application/ld\+json" id="ldApp">.*?</script>', "", idx, flags=re.S)
idx = idx.replace("Free resume, cover letter and LinkedIn grader backed by career-center sources. Nothing is uploaded.",
                  "Free resume, cover letter and LinkedIn grader backed by career-center sources. Grading runs in your browser.")
app_ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": "One Stop", "url": SITE + "/",
          "applicationCategory": "BusinessApplication", "operatingSystem": "Any",
          "description": "Free resume builder, resume checker and job search: make a resume, check it for ATS, and find internships and entry-level jobs by major.", "alternateName": ["One Stop Resume Builder", "One Stop Job Search"],
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}
idx = idx.replace('<meta property="og:type" content="website">',
    f'<meta property="og:type" content="website">\n<meta property="og:url" content="{SITE}/">\n<link rel="canonical" href="{SITE}/">\n<script type="application/ld+json" id="ldApp">{json.dumps(app_ld)}</script>', 1)
if 'src="assets/analytics.js"' not in idx:
    idx = idx.replace("\n</head>", '\n<script src="assets/analytics.js" defer></script>\n</head>', 1)
idx = re.sub(r'\n<nav id="seoLinks".*?</nav>', "", idx, flags=re.S)
nav_links = [(f'/{p["slug"]}/', p["nav"]) for p in PAGES] + [("/company-interview-questions/", "Company interview questions"), ("/about/", "About"), ("/privacy/", "Privacy")]
seo_nav = ('\n<nav id="seoLinks" aria-label="Free tools" class="wrap" style="padding-bottom:28px;font-size:.84rem;color:var(--muted)">Free tools: '
           + " · ".join(f'<a href="{u}" style="color:inherit">{e(n)}</a>' for u, n in nav_links) + "</nav>")
idx = idx.replace("\n</body>", seo_nav + "\n</body>", 1)
open(OUT + "index.html", "w").write(idx)

urls = ([SITE + "/", SITE + "/internships/"] + [f'{SITE}/{p["slug"]}/' for p in PAGES]
        + [SITE + "/company-interview-questions/"] + CO_URLS + [SITE + "/about/", SITE + "/privacy/"])
open(OUT + "sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>\n" for u in urls) + "</urlset>\n")
open(OUT + "robots.txt", "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
print("built", len(PAGES), "tool pages,", len(COS), "company pages, privacy and about for", SITE, f"({len(urls)} sitemap URLs)")
