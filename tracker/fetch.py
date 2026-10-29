#!/usr/bin/env python3
"""Pull internship postings from public company job-board feeds and write the
site's data file.

Sources: Greenhouse, Lever, Ashby and SmartRecruiters public job-board APIs
(one board per company in companies.json), plus the USAJOBS API when the
USAJOBS_KEY and USAJOBS_EMAIL environment variables are set.

Usage: python3 tracker/fetch.py [--out public/internships/data.json]
Standard library only, so it runs on a stock GitHub Actions runner.
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
UA = "GradelineInternshipTracker/1.0 (+https://github.com/)"

INTERN_RE = re.compile(
    r"\b(intern|interns|internship|co-?op|summer (?:analyst|associate|scholar)|"
    r"student (?:trainee|researcher|worker)|apprentice(?:ship)?|fellowship)\b", re.I)
SKIP_RE = re.compile(r"\b(manager of|director|head of|senior|sr\.?|principal|staff)\b", re.I)

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


def get_json(url, headers=None, tries=3):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json", **(headers or {})})
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
    out, offset = [], 0
    while True:
        q = urllib.parse.urlencode({"q": "intern", "limit": 100, "offset": offset})
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


FETCHERS = {"greenhouse": fetch_greenhouse, "lever": fetch_lever, "ashby": fetch_ashby,
            "smartrecruiters": fetch_smartrecruiters}


def fetch_usajobs():
    key, email = os.environ.get("USAJOBS_KEY"), os.environ.get("USAJOBS_EMAIL")
    if not (key and email):
        return [], "skipped (USAJOBS_KEY / USAJOBS_EMAIL not set)"
    headers = {"Host": "data.usajobs.gov", "User-Agent": email, "Authorization-Key": key}
    seen, out = set(), []
    for params in ({"HiringPath": "student", "ResultsPerPage": 500}, {"Keyword": "intern", "ResultsPerPage": 500}):
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

    usa, usa_status = [], "skipped"
    try:
        usa, usa_status = fetch_usajobs()
    except Exception as e:
        usa_status = f"{type(e).__name__}: {e}"[:200]
    results.append(({"name": "USAJOBS", "ats": "usajobs", "token": "", "industry": "Government & Public Service"},
                    usa, None))

    for c, jobs, err in results:
        if c["ats"] == "usajobs" and usa_status != "ok":
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
            if not j.get("url") or not INTERN_RE.search(title) or SKIP_RE.search(title):
                continue
            key = f"{c['ats']}:{c['token']}:{j['id']}"
            first_seen = previous.get(key, {}).get("first_seen", now)
            postings[key] = {
                "key": key,
                "company": j.get("company") or c["name"],
                "title": title,
                "location": (j.get("location") or "").strip()[:160],
                "remote": bool(j.get("remote")),
                "url": j["url"],
                "posted": j.get("posted") or first_seen,
                "first_seen": first_seen,
                "closes": j.get("closes"),
                "industry": c["industry"],
                "majors": tag_majors(title),
                "source": c["ats"],
            }

    items = sorted(postings.values(), key=lambda p: p["posted"] or "", reverse=True)
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w") as f:
        json.dump({"updated": now, "count": len(items), "companies": len({p["company"] for p in items}),
                   "postings": items}, f, separators=(",", ":"))
    with open(args.report, "w") as f:
        json.dump({"run": now, "boards_ok": ok_boards, "boards_failed": len(failures), "usajobs": usa_status,
                   "postings": len(items), "failures": failures}, f, indent=1)
    print(f"{len(items)} postings from {ok_boards} boards; {len(failures)} boards failed; USAJOBS: {usa_status}")
    if ok_boards == 0:
        sys.exit("No boards succeeded; leaving this run uncommitted.")


if __name__ == "__main__":
    main()
