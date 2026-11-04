#!/usr/bin/env python3
"""Email One Stop job alerts: a daily digest of new listings that match each person's saved searches.

Run by .github/workflows/send-job-alerts.yml after each listings refresh. Does nothing until these
repository secrets exist:
  FIREBASE_SERVICE_ACCOUNT   JSON key for a Firebase service account (reads alerts/*, writes alertState/*)
  ALERTS_GMAIL_USER          Gmail address the digests are sent from
  ALERTS_GMAIL_APP_PASSWORD  a Google app password for that address (not the normal password)

People turn alerts on from Find jobs on the site (signed in, email confirmed). The page writes
alerts/{uid} = {email, searches (JSON list of {name, f}), updatedAt}. This script keeps
alertState/{uid} = {lastSent} so each person gets at most one email a day.

Usage: python3 tools/send_alerts.py [path/to/data.json]
"""
import html
import json
import os
import smtplib
import sys
import time
from datetime import datetime, timezone
from email.message import EmailMessage

PROJECT = "website-cd10e"
BASE = f"https://firestore.googleapis.com/v1/projects/{PROJECT}/databases/(default)/documents"
SITE = os.environ.get("SITE_URL", "https://jcbubba11.github.io/Gradeline/").rstrip("/") + "/"
DAY = 86400
MIN_GAP = 20 * 3600        # at most one digest a day (runs are every ~6h)
MAX_WINDOW = 7 * DAY       # never look back more than a week
PER_SEARCH = 10            # jobs listed per saved search
DAILY_CAP = 450            # stay under Gmail's ~500 recipients/day limit


def ts(value):
    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00")).timestamp()
    except (TypeError, ValueError):
        return None


def iso(t):
    return datetime.fromtimestamp(t, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def matches(job, f):
    """Same rules as matchF() in public/assets/job-tools.js."""
    if f.get("type") and (job.get("type") or "Internship") != f["type"]:
        return False
    if f.get("major") and f["major"] not in (job.get("majors") or []):
        return False
    if f.get("industry") and job.get("industry") != f["industry"]:
        return False
    if f.get("remote") and not job.get("remote"):
        return False
    q = (f.get("q") or "").strip().lower()
    if not q:
        return True
    hay = " ".join([str(job.get("company", "")), str(job.get("title", "")), str(job.get("industry", "")),
                    str(job.get("location", "")), "remote" if job.get("remote") else "",
                    " ".join(job.get("majors") or [])]).lower()
    return all(w in hay for w in q.replace(",", " ").split())


def is_new(job, since):
    first, posted = ts(job.get("first_seen")), ts(job.get("posted"))
    return first is not None and posted is not None and first > since and posted > since - 7 * DAY


def session():
    import google.auth.transport.requests
    from google.oauth2 import service_account
    info = json.loads(os.environ["FIREBASE_SERVICE_ACCOUNT"])
    creds = service_account.Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/datastore"])
    return google.auth.transport.requests.AuthorizedSession(creds)


def list_alerts(s):
    out, token = [], None
    while True:
        params = {"pageSize": 300}
        if token:
            params["pageToken"] = token
        r = s.get(f"{BASE}/alerts", params=params, timeout=30)
        r.raise_for_status()
        body = r.json()
        for d in body.get("documents", []):
            f = d.get("fields", {})
            out.append({"uid": d["name"].rsplit("/", 1)[-1],
                        "email": f.get("email", {}).get("stringValue", ""),
                        "searches": f.get("searches", {}).get("stringValue", "[]"),
                        "updatedAt": f.get("updatedAt", {}).get("stringValue", "")})
        token = body.get("nextPageToken")
        if not token:
            return out


def last_sent(s, uid):
    r = s.get(f"{BASE}/alertState/{uid}", timeout=30)
    if r.status_code == 404:
        return None
    r.raise_for_status()
    return ts(r.json().get("fields", {}).get("lastSent", {}).get("stringValue"))


def mark_sent(s, uid, t):
    r = s.patch(f"{BASE}/alertState/{uid}", params={"updateMask.fieldPaths": "lastSent"},
                json={"fields": {"lastSent": {"stringValue": iso(t)}}}, timeout=30)
    r.raise_for_status()


def safe_url(u):
    return u if isinstance(u, str) and u.startswith("https://") else SITE + "#internships"


def build_email(sender, to, groups):
    total = sum(len(jobs) + more for _, jobs, more in groups)
    msg = EmailMessage()
    msg["Subject"] = f"{total} new job{'s' if total != 1 else ''} for your One Stop alerts"
    msg["From"] = f"One Stop job alerts <{sender}>"
    msg["To"] = to
    msg["List-Unsubscribe"] = f"<mailto:{sender}?subject=unsubscribe>"
    stop = ("To change or stop these emails, open One Stop, go to Find jobs and switch off Email on an alert, "
            "or reply with \"unsubscribe\".")
    text = [f"New jobs matching your saved searches on One Stop ({SITE}#internships):", ""]
    parts = ['<div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#16232c;max-width:620px">',
             '<p style="font-family:Georgia,serif;font-size:22px;margin:0 0 4px">One Stop</p>',
             f'<p style="color:#5b6670;margin:0 0 18px">{total} new job{"s" if total != 1 else ""} matched your alerts since your last email.</p>']
    for name, jobs, more in groups:
        text.append(f"{name}")
        parts.append(f'<h2 style="font-family:Georgia,serif;font-weight:500;font-size:18px;margin:22px 0 8px">{html.escape(name)}</h2>')
        for j in jobs:
            line = f"{j.get('title')} - {j.get('company')}, {j.get('location') or 'location not listed'}"
            text.append(f"  {line}\n  {safe_url(j.get('url'))}")
            parts.append('<p style="margin:0 0 10px;padding:10px 12px;border:1px solid #e3e1d9;border-radius:4px">'
                         f'<a href="{html.escape(safe_url(j.get("url")))}" style="color:#2549d3;font-weight:600;text-decoration:none">{html.escape(str(j.get("title")))}</a><br>'
                         f'<span style="color:#5b6670;font-size:14px">{html.escape(str(j.get("company")))} · {html.escape(str(j.get("location") or "Location not listed"))}</span></p>')
        if more:
            text.append(f"  ...and {more} more on One Stop.")
            parts.append(f'<p style="margin:0 0 10px;font-size:14px"><a href="{SITE}#internships" style="color:#2549d3">See {more} more on One Stop</a></p>')
        text.append("")
    text += ["Always confirm details on the employer's own site before applying.", "", stop]
    parts.append(f'<p style="color:#5b6670;font-size:13px;margin-top:24px">Always confirm details on the employer\'s own site before applying.<br>{html.escape(stop)}</p></div>')
    msg.set_content("\n".join(text))
    msg.add_alternative("".join(parts), subtype="html")
    return msg


def main():
    need = ["FIREBASE_SERVICE_ACCOUNT", "ALERTS_GMAIL_USER", "ALERTS_GMAIL_APP_PASSWORD"]
    missing = [k for k in need if not os.environ.get(k)]
    if missing:
        print("Job alert emails are off: missing secrets", ", ".join(missing))
        return
    path = sys.argv[1] if len(sys.argv) > 1 else "public/internships/data.json"
    postings = json.load(open(path, encoding="utf-8")).get("postings", [])
    now = time.time()
    s = session()
    sender, pw = os.environ["ALERTS_GMAIL_USER"], os.environ["ALERTS_GMAIL_APP_PASSWORD"]
    smtp = None
    sent = skipped = 0
    for a in list_alerts(s):
        if sent >= DAILY_CAP:
            print("Daily cap reached; the rest wait for the next run.")
            break
        if "@" not in a["email"]:
            continue
        try:
            searches = json.loads(a["searches"])[:10]
        except ValueError:
            continue
        prev = last_sent(s, a["uid"])
        if prev and now - prev < MIN_GAP:
            skipped += 1
            continue
        since = max(prev or ts(a["updatedAt"]) or now - DAY, now - MAX_WINDOW)
        groups = []
        for sr in searches:
            f = sr.get("f") or {}
            hits = [j for j in postings if is_new(j, since) and matches(j, f)]
            if hits:
                hits.sort(key=lambda j: j.get("posted") or "", reverse=True)
                groups.append((str(sr.get("name") or "Your search")[:120], hits[:PER_SEARCH], max(0, len(hits) - PER_SEARCH)))
        if not groups:
            continue
        if smtp is None:
            smtp = smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30)
            smtp.login(sender, pw)
        try:
            smtp.send_message(build_email(sender, a["email"], groups))
        except smtplib.SMTPRecipientsRefused:
            print("Recipient refused for one alert; skipping.")
            continue
        mark_sent(s, a["uid"], now)
        sent += 1
    if smtp:
        smtp.quit()
    print(f"Job alert emails sent: {sent}; waiting for their daily slot: {skipped}")


if __name__ == "__main__":
    main()
