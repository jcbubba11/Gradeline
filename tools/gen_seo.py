"""Builds Gradeline's search landing pages, sitemap and robots file into site-public/.
Run: python3 -I gen_seo.py [site_url]"""
import json, os, re, sys, html as H

SITE = (sys.argv[1] if len(sys.argv) > 1 else "https://wonderful-panda-c6c673.netlify.app").rstrip("/")
OUT = "/mnt/project-files/site-public/"
TODAY = "2026-10-29"

PAGES = [
  dict(slug="free-resume-checker", nav="Resume checker",
    title="Free resume checker: score and fix your resume | Gradeline",
    desc="Check your resume for free. Get a score out of 100, red-pen suggestions you can accept with one click, and the career-center source behind every rule. No account needed.",
    h1="Free resume checker", app="grade", cta="Check my resume",
    lead="Paste your resume or drop in a PDF or Word file. Gradeline scores it out of 100, marks it up line by line, and shows the career-center guidance behind every check. It's free, with no account and no paywall.",
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
    title="Free ATS resume checker: see what hiring software reads | Gradeline",
    desc="See your resume the way applicant tracking systems read it: the plain text, the sections they find and what they miss. Free, private, and no sign-up.",
    h1="Free ATS resume checker", app="robot", cta="See what the robot sees",
    lead="Applicant tracking systems read your resume as plain text before a person does. Gradeline's \"What the robot sees\" view shows you that text, so you can catch columns, tables and headers that come out scrambled.",
    steps=["Open What the robot sees.", "Drop in your resume PDF or Word file. It's read in your browser, never uploaded.", "Fix anything that came through out of order or missing, then send the text to the grader."],
    checks=["The plain text an ATS would pull from your file, line by line",
      "What it recognized, such as your name, contact details and sections",
      "Layout warnings for things like merged columns, icons that turn into junk characters and contact details hidden in a page header",
      "Single-column templates and a builder that export ATS-readable PDF and Word files"],
    faq=[("Is this the same as a real ATS?", "No tool can copy every ATS exactly. This shows the plain-text reading most of them start from, which is where most formatting problems show up."),
      ("Do I need a special ATS template?", "A clean single-column layout with standard headings works best. All of Gradeline's templates and builder layouts follow that."),
      ("Is it free?", "Yes, with no account and no paywall.")]),
  dict(slug="resume-keyword-scanner", nav="Keyword scanner",
    title="Free resume keyword scanner: match your resume to a job | Gradeline",
    desc="Paste a job posting and your resume to see which keywords and phrases you have and which you're missing. Free, private, with no account.",
    h1="Free resume keyword scanner", app="match", cta="Scan my resume",
    lead="Paste a job posting next to your resume. Gradeline pulls out the posting's most important terms and phrases, then shows which ones your resume already covers and which are missing.",
    steps=["Paste the job posting.", "Paste or load your resume.", "Add the missing terms you can honestly claim, in your own words."],
    checks=["Multi-word phrases like \"project management\", not only single words",
      "Related words that count partly, so you aren't penalized for a synonym",
      "\"N years of experience\" requirements compared against your dates",
      "Whether the exact job title appears",
      "Tailor to a job: a side-by-side view to rework bullets for one posting"],
    faq=[("Should I copy the posting's words exactly?", "Use the posting's terms where they are true for you. Keyword stuffing without real experience behind it tends to fall apart in an interview."),
      ("Is the job posting stored?", "No. It stays in your browser.")]),
  dict(slug="cover-letter-checker", nav="Cover letter checker",
    title="Free cover letter checker: grade and improve your letter | Gradeline",
    desc="Grade your cover letter for free: length, greeting, tailoring to the company, numbers, closing ask and clichés, with the source behind each check.",
    h1="Free cover letter checker", app="grade", cta="Check my cover letter",
    lead="Switch the grader to Cover letter, paste your letter, and add the company and job title. Gradeline checks the things career centers say make a letter work, and marks up the lines to fix.",
    steps=["Choose Cover letter on the Grade page.", "Paste your letter, plus the company name and job title.", "Work through the red-pen suggestions."],
    checks=["One page, about 220 to 420 words, in three or four body paragraphs",
      "A greeting to a named person, or \"Dear Hiring Manager\" as a fallback",
      "An opening that doesn't start with \"My name is\"",
      "The company named and the position stated",
      "At least two specific numbers or results",
      "Not every sentence starting with \"I\"",
      "A closing that asks for a conversation, and a sign-off",
      "No flowery clichés, salary talk or \"as you can see on my resume\""],
    faq=[("Do you write the letter for me?", "No. Gradeline grades your letter and suggests fixes. There are free cover letter templates and a builder if you're starting from scratch."),
      ("Is my letter uploaded?", "No. Grading runs in your browser.")]),
  dict(slug="linkedin-profile-checker", nav="LinkedIn checker",
    title="Free LinkedIn profile checker: grade your headline and About | Gradeline",
    desc="Paste your LinkedIn headline, About and experience to get a free score with fixes for each section. No LinkedIn login needed.",
    h1="Free LinkedIn profile checker", app="linkedin", cta="Check my LinkedIn",
    lead="Paste your headline, About section and experience, and tick the basics like photo and banner. Gradeline grades the profile section by section. You never sign in to LinkedIn here.",
    steps=["Copy your headline, About and experience from LinkedIn.", "Paste them in and tick the profile basics you have.", "Use the fixes and the live preview to rewrite each section."],
    checks=["Headline length, and whether it says more than a bare title",
      "An About section of 100+ words, under LinkedIn's 2,600-character limit",
      "Experience entries with dates, descriptions and numbers",
      "Keywords from the jobs you're targeting",
      "10 or more skills, a custom URL, location and industry",
      "Photo, banner, connections and recommendations"],
    faq=[("Do I have to log in to LinkedIn?", "No. You paste the text yourself, so Gradeline never touches your account."),
      ("Is Gradeline part of LinkedIn?", "No. Gradeline is an independent tool and is not affiliated with LinkedIn.")]),
  dict(slug="free-resume-builder", nav="Resume builder",
    title="Free resume builder with PDF and Word download | Gradeline",
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
  dict(slug="free-alternative-to-paid-resume-checkers", nav="Free alternative",
    title="A free alternative to paid resume checkers | Gradeline",
    desc="Many resume checkers limit free scans or put fixes behind a subscription. Gradeline is free, needs no account, and shows the source behind every rule.",
    h1="A free alternative to paid resume checkers", app="grade", cta="Try it free",
    lead="Many resume checkers give you a few free scans, then ask for a subscription to see the fixes. Gradeline takes a different approach. The core tools are free with no account, and every rule shows where it comes from, so you can decide whether to follow it.",
    steps=["Check your resume, cover letter or LinkedIn.", "See the source behind each check on How we grade.", "Keep everything on your device, and back it up to a file if you like."],
    checks=["Unlimited checks, with no sign-up",
      "Line-by-line red-pen suggestions you can accept or undo",
      "Sources from career centers and hiring guides, linked on every check",
      "A builder, templates, ATS view, bullet coach, interview prep and a job tracker",
      "Grading that runs in your browser instead of on a server"],
    faq=[("What's the catch?", "There isn't one for the core tools. Gradeline doesn't sell your data or need an account."),
      ("Does Gradeline use AI to rewrite my resume?", "No. The checks are transparent rules with sources. Any suggestion is shown to you first, and nothing changes unless you accept it."),
      ("Is it as good as a paid tool?", "It covers the checks that career centers recommend most. Paid tools may add features like AI rewriting. Try both and keep whichever helps you more.")]),
]

CSS = """:root{--bg:#f5f7fa;--paper:#fff;--ink:#18202b;--muted:#586273;--line:#dde3ea;--blue:#1d4fa3;--red:#c0302b;--soft:#eef2f7}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#11161d;--paper:#1a212b;--ink:#e8edf3;--muted:#a3aebd;--line:#2d3744;--blue:#8fb1ee;--red:#ef7a73;--soft:#222b37}}
:root[data-theme=dark]{--bg:#11161d;--paper:#1a212b;--ink:#e8edf3;--muted:#a3aebd;--line:#2d3744;--blue:#8fb1ee;--red:#ef7a73;--soft:#222b37}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif}
a{color:var(--blue)}.wrap{max-width:860px;margin:0 auto;padding:0 16px}
header{background:var(--paper);border-bottom:1px solid var(--line)}header .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-block:12px;flex-wrap:wrap}
.brand{text-decoration:none;color:var(--ink);font:800 1.3rem "Bricolage Grotesque","Segoe UI",sans-serif}.brand span{color:var(--red)}
h1,h2{font-family:"Bricolage Grotesque","Segoe UI",sans-serif;line-height:1.15;text-wrap:balance}h1{font-size:clamp(2rem,5vw,2.8rem);margin:40px 0 12px}h2{font-size:1.35rem;margin:36px 0 10px}
.lead{font-size:1.12rem;color:var(--muted);max-width:68ch}.cta{display:inline-block;margin:20px 0 4px;background:var(--blue);color:var(--paper);text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:12px;padding:18px 22px}ol,ul{padding-left:22px;margin:0}li{margin:6px 0}
details{border-bottom:1px solid var(--line);padding:12px 0}summary{cursor:pointer;font-weight:700}details p{margin:8px 0 0;color:var(--muted)}
.more{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0}.more a{display:inline-block;border:1px solid var(--line);background:var(--paper);border-radius:99px;padding:6px 14px;text-decoration:none;color:var(--ink);font-size:.92rem}
footer{margin-top:48px;border-top:1px solid var(--line);padding:20px 0 40px;color:var(--muted);font-size:.9rem}footer a{color:inherit}"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,800&display=swap">'
ICON = re.search(r'<link rel="icon"[^>]+>', open(OUT + "index.html").read()).group(0)
e = lambda s: H.escape(s, quote=True)

def more_links(skip=None):
    return "".join(f'<li><a href="/{p["slug"]}/">{e(p["nav"])}</a></li>' for p in PAGES if p["slug"] != skip)

def page(p):
    url = f'{SITE}/{p["slug"]}/'
    ld = [{"@context": "https://schema.org", "@type": "WebPage", "name": p["h1"], "url": url, "description": p["desc"],
           "isPartOf": {"@type": "WebSite", "name": "Gradeline", "url": SITE + "/"}},
          {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
              {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]}]
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(p["title"])}</title>
<meta name="description" content="{e(p["desc"])}">
<link rel="canonical" href="{url}">
<meta property="og:title" content="{e(p["title"])}">
<meta property="og:description" content="{e(p["desc"])}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Gradeline">
{ICON}
{FONTS}
<style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld)}</script>
</head>
<body>
<header><div class="wrap"><a class="brand" href="/">Grade<span>line</span></a><a href="/#{p["app"]}">Open the tool</a></div></header>
<main class="wrap">
<h1>{e(p["h1"])}</h1>
<p class="lead">{e(p["lead"])}</p>
<a class="cta" href="/#{p["app"]}">{e(p["cta"])}</a>
<h2>How it works</h2>
<div class="card"><ol>{"".join(f"<li>{e(s)}</li>" for s in p["steps"])}</ol></div>
<h2>What it checks</h2>
<div class="card"><ul>{"".join(f"<li>{e(c)}</li>" for c in p["checks"])}</ul></div>
<p>See every rule and its source on <a href="/#how-we-grade">How we grade</a>.</p>
<h2>Questions</h2>
{"".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in p["faq"])}
<h2>More free tools</h2>
<ul class="more">{more_links(p["slug"])}</ul>
</main>
<footer><div class="wrap">Gradeline · free resume, cover letter and LinkedIn tools · <a href="/#privacy">Privacy</a> · <a href="/#terms">Terms</a></div></footer>
</body>
</html>
"""

for p in PAGES:
    os.makedirs(OUT + p["slug"], exist_ok=True)
    open(f'{OUT}{p["slug"]}/index.html', "w").write(page(p))

# Main page head: canonical, structured data, accurate privacy wording, crawlable links to the landing pages.
idx = open(OUT + "index.html").read()
idx = re.sub(r'\n<link rel="canonical"[^>]*>|\n<meta property="og:url"[^>]*>|\n<script type="application/ld\+json" id="ldApp">.*?</script>', "", idx, flags=re.S)
idx = idx.replace("Free resume, cover letter and LinkedIn grader backed by career-center sources. Nothing is uploaded.",
                  "Free resume, cover letter and LinkedIn grader backed by career-center sources. Grading runs in your browser.")
app_ld = {"@context": "https://schema.org", "@type": "WebApplication", "name": "Gradeline", "url": SITE + "/",
          "applicationCategory": "BusinessApplication", "operatingSystem": "Any",
          "description": "Free resume, cover letter and LinkedIn grader with source-backed checks, a resume builder, ATS view and job tracker.",
          "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}}
idx = idx.replace('<meta property="og:type" content="website">',
    f'<meta property="og:type" content="website">\n<meta property="og:url" content="{SITE}/">\n<link rel="canonical" href="{SITE}/">\n<script type="application/ld+json" id="ldApp">{json.dumps(app_ld)}</script>', 1)
idx = re.sub(r'\n<nav id="seoLinks".*?</nav>', "", idx, flags=re.S)
seo_nav = ('\n<nav id="seoLinks" aria-label="Free tools" class="wrap" style="padding-bottom:28px;font-size:.84rem;color:var(--muted)">Free tools: '
           + " · ".join(f'<a href="/{p["slug"]}/" style="color:inherit">{e(p["nav"])}</a>' for p in PAGES) + "</nav>")
idx = idx.replace("\n</body>", seo_nav + "\n</body>", 1)
open(OUT + "index.html", "w").write(idx)

urls = [SITE + "/"] + [f'{SITE}/{p["slug"]}/' for p in PAGES]
open(OUT + "sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod></url>\n" for u in urls) + "</urlset>\n")
open(OUT + "robots.txt", "w").write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")
print("built", len(PAGES), "pages for", SITE)
