#!/usr/bin/env python3
"""Pull internship and entry-level job postings from public company job-board feeds and write the
site's data file.

Sources: Greenhouse, Lever, Ashby and SmartRecruiters public job-board APIs, Workday, Oracle
Recruiting Cloud and ADP career-site searches
(one board per company in companies.json), plus USAJOBS, Adzuna and Jooble when their keys are set
(USAJOBS_KEY + USAJOBS_EMAIL, ADZUNA_APP_ID + ADZUNA_APP_KEY, JOOBLE_KEY).

Usage: python3 tracker/fetch.py [--out public/internships/data.json]
Standard library only, so it runs on a stock GitHub Actions runner.
"""
import argparse
import json
import os
import re
import sys
import threading
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
UA = "OneStopJobTracker/1.0 (+https://github.com/)"

INTERN_RE = re.compile(
    r"\b(intern|interns|internship|co-?op|summer (?:analyst|associate|scholar)|"
    r"student (?:trainee|researcher|worker)|apprentice(?:ship)?|fellowship)\b", re.I)
SKIP_RE = re.compile(r"\b(manager of|director|head of|senior|sr\.?|principal|staff|lead|vp|vice president|chief|"
                     r"architect|ii|iii|iv|level [2-9])\b", re.I)
# Full-time roles that say plainly they're for new grads or early career.
ENTRY_RE = re.compile(
    r"\b(entry[- ]level|new grad(?:uate)?s?|recent grad(?:uate)?s?|university grad(?:uate)?|college grad(?:uate)?|"
    r"graduate (?:program|scheme|analyst|engineer|trainee|rotational)|early[- ]career|early[- ]in[- ]career|"
    r"junior|jr\.?|associate (?:analyst|engineer|consultant|developer|scientist|designer|product manager|"
    r"accountant|specialist|coordinator)|analyst i\b|engineer i\b|level 1|level i\b|rotational program|"
    r"leadership development program|campus hire|university hire|class of 20\d\d|20\d\d start)\b", re.I)


# Food service and hourly store roles are out of scope: the site is for business and professional careers.
NOT_BUSINESS_RE = re.compile(r"\b(crew member|crew trainer|cashier|cook|line cook|prep cook|dishwasher|food server|busser|hostess|"
                             r"barista|bartender|baker|food service|restaurant|kitchen|shift (?:lead|manager|supervisor)|"
                             r"store associate|retail sales associate|stocker|merchandiser|lot attendant|janitor|custodian|"
                             r"housekeep(?:er|ing)|delivery driver|warehouse associate|package handler)\b", re.I)


def job_type(title):
    if INTERN_RE.search(title):
        return "Internship"
    if ENTRY_RE.search(title):
        return "Entry-level"
    return None

# Major groups, matched against the posting title. A posting can land in several.
MAJORS = [
    ("Computer Science & Software", r"software|developer|swe\b|full.?stack|front.?end|back.?end|mobile|ios|android|"
     r"web|devops|\bsre\b|site reliability|cloud|platform|infrastructure|security|cyber|\bit\b|systems engineer|computer|"
     r"technical staff|technology intern|linux|forward deployed|system architect|programm"),
    ("Data, AI & Analytics", r"\bdata\b|machine learning|\bml\b|\bai\b|artificial intelligence|analytics|scientist|"
     r"statistic|research engineer|deep learning|nlp|natural language|computer vision|\bvision\b|reinforcement learning|"
     r"robot learning|interpretab|research intern|researcher|research fellow|phd"),
    ("Engineering (EE, ME, Aero, Civil)", r"hardware|electrical|mechanical|aerospace|civil|chemical engineer|manufacturing|"
     r"firmware|embedded|\brf\b|asic|fpga|silicon|robotics|propulsion|structural|industrial engineer|test engineer|"
     r"technician|turbo|thermal|materials|nuclear|process engineer|quality engineer"),
    ("Finance, Accounting & Economics", r"financ|accounting|accountant|investment|invest|trading|trader|quant|banking|"
     r"treasury|\btax\b|audit|fp&a|equity|credit|risk|actuar|econom|capital markets|wealth|summer analyst"),
    ("Business, Strategy & Consulting", r"strategy|business operations|bizops|consult|business analyst|corporate development|"
     r"\bmba\b|general management|business intern"),
    ("Marketing, Communications & Media", r"marketing|communications|social media|content|brand|\bpr\b|public relations|"
     r"journalis|editorial|editor|video|podcast|media|copywrit|growth|seo|market research"),
    ("Design & Creative Arts", r"design|designer|\bux\b|\bui\b|graphic|illustrat|animation|creative|\barts?\b|photograph"),
    ("Product & Project Management", r"product manag|product intern|\bapm\b|program manag|project manag|product owner|technical program|product innovation|special projects"),
    ("Sales & Customer Success", r"sales|account exec|account manag|business development|\bbdr\b|\bsdr\b|customer|partnerships"),
    ("HR, People & Operations", r"\bhr\b|human resources|people|employee experience|recruit|talent|operations|supply chain|logistics|procurement|facilities"),
    ("Law, Policy & Government", r"legal|\blaw\b|paralegal|policy|government|public affairs|compliance|regulatory|privacy"),
    ("Health, Biology & Life Sciences", r"biolog|\bbio|clinical|health|medical|pharma|chemist|\blab\b|laboratory|genom|"
     r"neuro|nurs|patient|life science|biotech"),
    ("Education & Nonprofit", r"educat|teach|curriculum|tutor|nonprofit|non-profit|community|social impact|grants|fundrais|philanthrop"),
]
MAJORS = [(name, re.compile(rx, re.I)) for name, rx in MAJORS]
OTHER = "Other / Any major"
ENGINEER_RE = re.compile(r"\bengineer", re.I)


def tag_majors(title):
    hits = [name for name, rx in MAJORS if rx.search(title)]
    if not hits and ENGINEER_RE.search(title):
        hits = ["Engineering (EE, ME, Aero, Civil)", "Computer Science & Software"]
    return hits or [OTHER]


def get_json(url, headers=None, tries=3, body=None):
    data = json.dumps(body).encode() if body is not None else None
    hdrs = {"User-Agent": UA, "Accept": "application/json", **({"Content-Type": "application/json"} if data else {}), **(headers or {})}
    req = urllib.request.Request(url, data=data, headers=hdrs)
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (404, 410):
                raise
            if attempt == tries - 1:
                raise
        except Exception:
            if attempt == tries - 1:
                raise
        time.sleep(2 * (attempt + 1))


def iso(value):
    """Normalise epoch-ms, epoch-s or ISO strings to an ISO date string (or None)."""
    if value in (None, ""):
        return None
    if isinstance(value, (int, float)):
        if value > 1e12:
            value /= 1000
        return datetime.fromtimestamp(value, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        dt = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    except ValueError:
        return None


def is_remote(*parts):
    return any(p and re.search(r"\bremote\b", str(p), re.I) for p in parts)


# ---------- per-ATS fetchers: each returns a list of raw dicts ----------

def fetch_greenhouse(token):
    data = get_json(f"https://boards-api.greenhouse.io/v1/boards/{urllib.parse.quote(urllib.parse.unquote(token))}/jobs")
    out = []
    for j in data.get("jobs", []):
        loc = (j.get("location") or {}).get("name") or ""
        out.append(dict(id=j.get("id"), title=j.get("title") or "", location=loc, url=j.get("absolute_url"),
                        posted=iso(j.get("first_published") or j.get("updated_at")), remote=is_remote(loc)))
    return out


def fetch_lever(token):
    data = get_json(f"https://api.lever.co/v0/postings/{urllib.parse.quote(urllib.parse.unquote(token))}?mode=json")
    out = []
    for j in data if isinstance(data, list) else []:
        cat = j.get("categories") or {}
        locs = cat.get("allLocations") or [cat.get("location") or ""]
        loc = "; ".join(l for l in locs if l)
        out.append(dict(id=j.get("id"), title=j.get("text") or "", location=loc, url=j.get("hostedUrl"),
                        posted=iso(j.get("createdAt")),
                        remote=j.get("workplaceType") == "remote" or is_remote(loc)))
    return out


def fetch_ashby(token):
    data = get_json(f"https://api.ashbyhq.com/posting-api/job-board/{urllib.parse.quote(urllib.parse.unquote(token))}")
    out = []
    for j in data.get("jobs", []):
        if j.get("isListed") is False:
            continue
        loc = j.get("location") or ""
        extra = [s.get("location") for s in j.get("secondaryLocations") or [] if s.get("location")]
        if extra:
            loc = "; ".join([loc] + extra)
        out.append(dict(id=j.get("id"), title=j.get("title") or "", location=loc,
                        url=j.get("jobUrl") or j.get("applyUrl"), posted=iso(j.get("publishedAt")),
                        remote=bool(j.get("isRemote")) or is_remote(loc)))
    return out


def fetch_smartrecruiters(token):
    out, seen = [], set()
    for term in ("intern", "entry level", "graduate", "junior"):
        for j in fetch_smartrecruiters_term(token, term):
            if j["id"] not in seen:
                seen.add(j["id"]); out.append(j)
    return out


def fetch_smartrecruiters_term(token, term):
    out, offset = [], 0
    while True:
        q = urllib.parse.urlencode({"q": term, "limit": 100, "offset": offset})
        data = get_json(f"https://api.smartrecruiters.com/v1/companies/{urllib.parse.quote(urllib.parse.unquote(token))}/postings?{q}")
        for j in data.get("content", []):
            l = j.get("location") or {}
            loc = ", ".join(x for x in (l.get("city"), l.get("region"), l.get("country", "").upper()) if x)
            out.append(dict(id=j.get("id"), title=j.get("name") or "", location=loc,
                            url=f"https://jobs.smartrecruiters.com/{token}/{j.get('id')}",
                            posted=iso(j.get("releasedDate")), remote=bool(l.get("remote")) or is_remote(loc)))
        offset += 100
        if offset >= data.get("totalFound", 0) or offset >= 500:
            return out


# Workday and Oracle career sites are searched by keyword, so only early-career postings come back.
SEARCH_TERMS = ("intern", "internship", "co-op", "graduate", "entry level", "early career")
# Workday hosts many employers on shared servers: keep the load on them light.
WORKDAY_GATE = threading.Semaphore(6)


def workday_posted(text):
    """Workday says "Posted Today", "Posted Yesterday", "Posted 3 Days Ago" or "Posted 30+ Days Ago"."""
    t = (text or "").lower()
    days = 0 if "today" in t else 1 if "yesterday" in t else None
    m = re.search(r"(\d+)\+?\s*days?", t)
    if m:
        days = int(m.group(1))
    if days is None:
        return None
    return iso(time.time() - days * 86400)


def fetch_workday(token):
    # token: "tenant|wd5|site", or "tenant|wd1|site|myworkdaysite" for sites under wdN.myworkdaysite.com/recruiting
    tenant, wd, site, *kind = token.split("|")
    if kind and kind[0] == "myworkdaysite":
        api = f"https://{wd}.myworkdaysite.com/wday/cxs/{tenant}/{site}/jobs"
        page = f"https://{wd}.myworkdaysite.com/en-US/recruiting/{tenant}/{site}"
    else:
        api = f"https://{tenant}.{wd}.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs"
        page = f"https://{tenant}.{wd}.myworkdayjobs.com/en-US/{site}"
    out, seen = [], set()
    for term in SEARCH_TERMS:
        offset = 0
        while offset < 100:
            with WORKDAY_GATE:
                data = get_json(api, body={"appliedFacets": {}, "limit": 20, "offset": offset, "searchText": term})
                time.sleep(0.2)
            jobs = data.get("jobPostings") or []
            for j in jobs:
                path = j.get("externalPath")
                if not path or path in seen:
                    continue
                seen.add(path)
                loc = j.get("locationsText") or ""
                out.append(dict(id=path.rsplit("_", 1)[-1] or path, title=j.get("title") or "", location=loc,
                                url=page + path, posted=workday_posted(j.get("postedOn")),
                                remote=is_remote(loc, j.get("remoteType"))))
            offset += 20
            if len(jobs) < 20 or offset >= (data.get("total") or 0):
                break
    return out


def fetch_oracle(token):
    # token: "host|dc|site" for host.fa.dc.oraclecloud.com, career site "site" (e.g. CX_1001)
    host, dc, site = token.split("|")
    base = f"https://{host}.fa.{dc}.oraclecloud.com" if dc else f"https://{host}.fa.oraclecloud.com"
    out, seen = [], set()
    for term in SEARCH_TERMS:
        offset = 0
        while offset < 100:
            finder = f'findReqs;siteNumber={site},facetsList=NONE,limit=25,offset={offset},keyword="{term}",sortBy=POSTING_DATES_DESC'
            data = get_json(f"{base}/hcmRestApi/resources/latest/recruitingCEJobRequisitions?onlyData=true&finder={urllib.parse.quote(finder, safe='=;,')}")
            items = (data.get("items") or [{}])[0]
            reqs = items.get("requisitionList") or []
            for j in reqs:
                jid = j.get("Id")
                if not jid or jid in seen:
                    continue
                seen.add(jid)
                loc = j.get("PrimaryLocation") or ""
                out.append(dict(id=jid, title=j.get("Title") or "", location=loc,
                                url=f"{base}/hcmUI/CandidateExperience/en/sites/{site}/job/{jid}",
                                posted=iso(j.get("PostedDate")), remote=is_remote(loc, j.get("WorkplaceType"))))
            offset += 25
            if len(reqs) < 25 or offset >= (items.get("TotalJobsCount") or 0):
                break
    return out


def fetch_adp(token):
    # token: the "cid" from an ADP Workforce Now career center link
    url = ("https://workforcenow.adp.com/mascsr/default/careercenter/public/events/staffing/v1/job-requisitions"
           f"?cid={urllib.parse.quote(token)}&lang=en_US&locale=en_US&$top=200")
    data = get_json(url)
    out = []
    for j in data.get("jobRequisitions") or []:
        locs = []
        for l in j.get("requisitionLocations") or []:
            a = l.get("address") or {}
            city, st = a.get("cityName"), (a.get("countrySubdivisionLevel1") or {}).get("codeValue")
            locs.append(", ".join(x for x in (city, st) if x) or (l.get("nameCode") or {}).get("shortName") or "")
        jid = j.get("itemID")
        out.append(dict(id=jid, title=j.get("requisitionTitle") or "", location="; ".join(x for x in locs if x),
                        url=("https://workforcenow.adp.com/mascsr/default/mdf/recruitment/recruitment.html"
                             f"?cid={urllib.parse.quote(token)}&jobId={jid}&lang=en_US"),
                        posted=iso(j.get("postDate")), remote=is_remote(*locs)))
    return out


FETCHERS = {"greenhouse": fetch_greenhouse, "lever": fetch_lever, "ashby": fetch_ashby,
            "smartrecruiters": fetch_smartrecruiters, "workday": fetch_workday, "oracle": fetch_oracle,
            "adp": fetch_adp}


# Job-search aggregators (optional, keys in repo secrets). These fill in employers whose career sites
# we can't read directly, such as Edward Jones or Northwestern Mutual field offices.
BUSINESS_FIELDS = {  # Adzuna category -> our industry
    "accounting-finance-jobs": "Finance & Trading", "consultancy-jobs": "Consulting & Accounting",
    "sales-jobs": "Sales & Business Development", "pr-advertising-marketing-jobs": "Media & Marketing",
    "hr-jobs": "HR & Operations", "legal-jobs": "Law & Policy", "it-jobs": "Technology",
    "engineering-jobs": "Engineering & Hardware", "admin-jobs": "HR & Operations",
    "logistics-warehouse-jobs": "HR & Operations",
}
JOOBLE_FIELDS = {"finance": "Finance & Trading", "accounting": "Consulting & Accounting",
                 "financial advisor": "Finance & Trading", "investment banking": "Finance & Trading",
                 "consulting": "Consulting & Accounting", "marketing": "Media & Marketing",
                 "sales": "Sales & Business Development", "business analyst": "Consulting & Accounting",
                 "human resources": "HR & Operations", "supply chain": "HR & Operations",
                 "insurance": "Finance & Trading", "data analyst": "Technology"}


def fetch_adzuna():
    app_id, app_key = os.environ.get("ADZUNA_APP_ID"), os.environ.get("ADZUNA_APP_KEY")
    if not (app_id and app_key):
        return [], "skipped (ADZUNA_APP_ID / ADZUNA_APP_KEY not set)"
    out, seen = [], set()
    for cat, industry in BUSINESS_FIELDS.items():
        for what in ("intern", "graduate"):
            for page in (1, 2):
                q = urllib.parse.urlencode({"app_id": app_id, "app_key": app_key, "results_per_page": 50,
                                            "what": what, "category": cat, "max_days_old": 45,
                                            "content-type": "application/json"})
                data = get_json(f"https://api.adzuna.com/v1/api/jobs/us/search/{page}?{q}")
                time.sleep(2.6)  # free tier allows about 25 calls a minute
                rows = data.get("results") or []
                for r in rows:
                    if r.get("id") in seen:
                        continue
                    seen.add(r.get("id"))
                    loc = (r.get("location") or {}).get("display_name") or ""
                    out.append(dict(id=r.get("id"), title=r.get("title") or "", location=loc,
                                    url=r.get("redirect_url"), posted=iso(r.get("created")), remote=is_remote(loc),
                                    company=(r.get("company") or {}).get("display_name"), industry=industry))
                if len(rows) < 50:
                    break
    return out, "ok"


def fetch_jooble():
    key = os.environ.get("JOOBLE_KEY")
    if not key:
        return [], "skipped (JOOBLE_KEY not set)"
    out, seen = [], set()
    for field, industry in JOOBLE_FIELDS.items():
        for level in ("intern", "entry level"):
            for page in (1, 2):
                data = get_json(f"https://jooble.org/api/{key}",
                                body={"keywords": f"{field} {level}", "location": "United States", "page": str(page)})
                time.sleep(1)
                rows = data.get("jobs") or []
                for r in rows:
                    if r.get("id") in seen:
                        continue
                    seen.add(r.get("id"))
                    loc = r.get("location") or ""
                    out.append(dict(id=r.get("id"), title=r.get("title") or "", location=loc, url=r.get("link"),
                                    posted=iso(r.get("updated")), remote=is_remote(loc, r.get("type") or ""),
                                    company=r.get("company"), industry=industry))
                if len(rows) < 20:
                    break
    return out, "ok"


def fetch_usajobs():
    key, email = os.environ.get("USAJOBS_KEY"), os.environ.get("USAJOBS_EMAIL")
    if not (key and email):
        return [], "skipped (USAJOBS_KEY / USAJOBS_EMAIL not set)"
    headers = {"Host": "data.usajobs.gov", "User-Agent": email, "Authorization-Key": key}
    seen, out = set(), []
    for params in ({"HiringPath": "student", "ResultsPerPage": 500}, {"Keyword": "intern", "ResultsPerPage": 500},
                   {"HiringPath": "graduates", "ResultsPerPage": 500}):
        for page in range(1, 6):
            q = urllib.parse.urlencode({**params, "Page": page})
            data = get_json(f"https://data.usajobs.gov/api/search?{q}", headers)
            items = (data.get("SearchResult") or {}).get("SearchResultItems") or []
            for it in items:
                m = it.get("MatchedObjectDescriptor") or {}
                pid = m.get("PositionID") or it.get("MatchedObjectId")
                if pid in seen:
                    continue
                seen.add(pid)
                loc = m.get("PositionLocationDisplay") or ""
                out.append(dict(id=pid, title=m.get("PositionTitle") or "", location=loc,
                                url=m.get("PositionURI"), posted=iso(m.get("PublicationStartDate")),
                                closes=iso(m.get("ApplicationCloseDate")), remote=is_remote(loc),
                                company=m.get("OrganizationName") or "U.S. Government"))
            if len(items) < params["ResultsPerPage"]:
                break
    return out, "ok"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--companies", default=os.path.join(HERE, "companies.json"))
    ap.add_argument("--out", default=os.path.join(ROOT, "public", "internships", "data.json"))
    ap.add_argument("--report", default=os.path.join(HERE, "last_run.json"))
    ap.add_argument("--workers", type=int, default=16)
    args = ap.parse_args()

    companies = json.load(open(args.companies))
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        previous = {p["key"]: p for p in json.load(open(args.out)).get("postings", [])}
    except (OSError, ValueError):
        previous = {}

    def run(c):
        try:
            return c, FETCHERS[c["ats"]](c["token"]), None
        except Exception as e:  # one bad board must never sink the run
            return c, [], f"{type(e).__name__}: {e}"[:200]

    postings, failures, ok_boards = {}, [], 0
    with ThreadPoolExecutor(args.workers) as pool:
        results = list(pool.map(run, companies))

    extra_status = {}
    for name, ats, industry, fn in (("USAJOBS", "usajobs", "Government & Public Service", fetch_usajobs),
                                    ("Adzuna", "adzuna", "Business", fetch_adzuna),
                                    ("Jooble", "jooble", "Business", fetch_jooble)):
        jobs, status = [], "skipped"
        try:
            jobs, status = fn()
        except Exception as e:
            status = f"{type(e).__name__}: {e}"[:200]
        extra_status[ats] = status
        results.append(({"name": name, "ats": ats, "token": "", "industry": industry, "extra": True}, jobs,
                        None if status == "ok" else status))
    usa_status = extra_status["usajobs"]

    for c, jobs, err in results:
        if c.get("extra") and err and err.startswith("skipped"):
            continue
        if err:
            failures.append({"name": c["name"], "ats": c["ats"], "token": c["token"], "error": err})
            # Keep yesterday's postings for a board that failed this run, so a blip doesn't wipe it.
            for k, p in previous.items():
                if k.startswith(f"{c['ats']}:{c['token']}:"):
                    postings[k] = p
            continue
        ok_boards += 1
        for j in jobs:
            title = re.sub(r"\s+", " ", j["title"]).strip()
            kind = job_type(title)
            if c["ats"] == "usajobs" and not kind:
                kind = "Entry-level"  # USAJOBS results here come from the student and recent-graduate hiring paths
            if not j.get("url") or not kind or SKIP_RE.search(title) or NOT_BUSINESS_RE.search(title):
                continue
            key = f"{c['ats']}:{c['token']}:{j['id']}"
            first_seen = previous.get(key, {}).get("first_seen", now)
            postings[key] = {
                "key": key,
                "company": (j.get("company") or c["name"]).strip(),
                "title": title,
                "location": (j.get("location") or "").strip()[:160],
                "remote": bool(j.get("remote")),
                "url": j["url"],
                "posted": j.get("posted") or first_seen,
                "first_seen": first_seen,
                "closes": j.get("closes"),
                "industry": j.get("industry") or c["industry"],
                "majors": tag_majors(title),
                "type": kind,
                "source": c["ats"],
            }

    # The same opening can come from a company's own board and an aggregator; keep the direct one.
    direct = {(p["company"].lower(), p["title"].lower()) for p in postings.values()
              if p["source"] not in ("adzuna", "jooble")}
    seen_pair = set()
    for k in [k for k, p in postings.items() if p["source"] in ("adzuna", "jooble")]:
        pair = ((postings[k]["company"] or "").lower(), postings[k]["title"].lower(), postings[k]["location"].lower())
        if pair[:2] in direct or pair in seen_pair:
            del postings[k]
        else:
            seen_pair.add(pair)
    items = sorted(postings.values(), key=lambda p: p["posted"] or "", reverse=True)
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w") as f:
        json.dump({"updated": now, "count": len(items),
                   "internships": sum(p.get("type") == "Internship" for p in items),
                   "entry_level": sum(p.get("type") == "Entry-level" for p in items), "companies": len({p["company"] for p in items}),
                   "postings": items}, f, separators=(",", ":"))
    with open(args.report, "w") as f:
        json.dump({"run": now, "boards_ok": ok_boards, "boards_failed": len(failures), "usajobs": usa_status, "aggregators": extra_status,
                   "postings": len(items), "failures": failures}, f, indent=1)
    print(f"{len(items)} postings from {ok_boards} boards; {len(failures)} boards failed; extra sources: {extra_status}")
    if ok_boards == 0:
        sys.exit("No boards succeeded; leaving this run uncommitted.")


if __name__ == "__main__":
    main()
