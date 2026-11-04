# Gradeline live internship tracker

GitHub Pages publishes the `public/` folder (https://jcbubba11.github.io/Gradeline/) through `.github/workflows/pages.yml`. `public/internships/` is the live tracker page and its data file.

## How it updates
- `tracker/companies.json`: the employers we watch (name, job-board system, board id, industry).
- `tracker/fetch.py`: pulls each employer's public job feed (Greenhouse, Lever, Ashby, SmartRecruiters) plus USAJOBS, keeps internship/co-op/summer-analyst titles, tags each by major from its title, and writes `public/internships/data.json`.
- `.github/workflows/update-internships.yml`: runs the script every 6 hours and commits the new data, and the Pages workflow republishes after each run.
- `tracker/last_run.json`: the last run's report. Boards that failed (wrong id, company moved systems) are listed there; fix or delete them in companies.json.

## Adding an employer
Open its careers page and look at a job link:
- `boards.greenhouse.io/ACME/...` or `job-boards.greenhouse.io/ACME/...` → `"ats": "greenhouse", "token": "acme"`
- `jobs.lever.co/ACME/...` → `"ats": "lever", "token": "acme"`
- `jobs.ashbyhq.com/ACME/...` → `"ats": "ashby", "token": "acme"`
- `jobs.smartrecruiters.com/AcmeInc/...` → `"ats": "smartrecruiters", "token": "AcmeInc"` (case matters)

Workday, Oracle/Taleo and iCIMS sites aren't supported: they have no public feed.

## USAJOBS (federal internships)
Request a free key at developer.usajobs.gov, then in the GitHub repo go to Settings → Secrets and variables → Actions and add `USAJOBS_KEY` (the key) and `USAJOBS_EMAIL` (the email you registered with).

## Run it by hand
GitHub → Actions → "Update internship listings" → Run workflow. Locally: `python3 tracker/fetch.py`.

## Site setup
Firebase / Mentor review notes are in SETUP.md. Netlify is no longer used: netlify.toml only tells any leftover Netlify link to skip every build.

## How the main app is split
`public/index.html` holds the page markup only. Styles are in `public/assets/app.css` and the main script in `public/assets/app.js`. Bigger tools load the first time their page opens (see `LAZY` in app.js): `assets/linkedin-post.js`, `assets/gallery.js`, `assets/apply-tools.js` (application kit, follow-up, rejection), `interview-bank.js` + `interview-prep.js`, and jsPDF (when the builder opens). `assets/job-tools.js` adds the recruiting calendar, job alerts and tracker reminders. All files share one set of globals, so keep new code in the file for its page. The Pages build (`tools/build_pages.py`) adds `?v=<hash>` to each of these file names so a deploy never mixes old and new files.
