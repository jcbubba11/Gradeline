# Gradeline

A free resume, cover letter and LinkedIn grader. Everything runs in the browser; nothing is uploaded except Mentor review documents, which are stored in Firebase.

## 1. Put the site online
Netlify Drop: open app.netlify.com/drop and drag this folder onto the page. Or use Cloudflare Pages or GitHub Pages. All are free.

## 2. Turn on Mentor review (Firebase, free Spark plan)
1. Go to console.firebase.google.com → Add project → name it (e.g. `gradeline`). Google Analytics can be off.
2. Build → Firestore Database → Create database → Production mode → pick a US location.
3. Firestore → Rules → replace everything with the contents of `firestore.rules` → Publish.
4. Project settings (gear icon) → Your apps → Web (`</>`) → register the app (no hosting needed) → copy the `firebaseConfig` object.
5. In `public/assets/app.js`, find `const FIREBASE_CONFIG = null;` and replace `null` with that object. Re-upload the site.
6. Project settings → General → Authorized domains is only for sign-in; nothing to do there for now.

The `firebaseConfig` values (apiKey, projectId…) are meant to be public. The rules file is what protects the data.

## 3. Before launch
- Set `const CONTACT_EMAIL = "";` in `public/assets/app.js` to your contact address (shows in the privacy policy).

## Job alert emails (optional, free)
Anyone can save a search on Find jobs and see how many new jobs match on their next visit; that part needs no setup.
Daily emails for signed-in users need three repository secrets (Settings → Secrets and variables → Actions):
1. `FIREBASE_SERVICE_ACCOUNT`: Firebase console → Project settings → Service accounts → Generate new private key. Paste the whole JSON file.
2. `ALERTS_GMAIL_USER`: a Gmail address to send from (a new one just for One Stop is best).
3. `ALERTS_GMAIL_APP_PASSWORD`: for that Gmail account, turn on 2-step verification, then create an app password at myaccount.google.com/apppasswords.

Also publish the updated `public/firestore.rules` (Firestore → Rules) so the page can save alert settings.
The "Send job alert emails" workflow runs after each listings refresh and sends each person at most one digest a day.
Limits: Gmail allows about 500 recipients a day, so the script stops at 450 and continues on the next run; email alerts need a
confirmed email address; replies saying "unsubscribe" go to the sending inbox and must be handled by hand (or the person turns Email off on Find jobs).

## Usage stats (optional, free)
The site counts page views and which tools people open with GoatCounter (no cookies, no personal data). It stays off until you add a code.
1. Sign up at https://www.goatcounter.com/signup. Pick a code, for example `onestop`, which gives you `onestop.goatcounter.com`. The hosted service is free for reasonable public use.
2. Edit `public/assets/analytics.js` on GitHub and put your code between the quotes: `const GOATCOUNTER_CODE = "onestop";`. Commit to main and the site redeploys.
3. Open the site, click around, then check your dashboard at `https://<code>.goatcounter.com`. Tools show up as paths like `/Gradeline/#interview`.
Visitors can switch counting off on the /privacy/ page, and browsers that send Do Not Track or Global Privacy Control are never counted.

## Search pages
`python3 -I tools/gen_seo.py` rebuilds every landing page, the company interview pages, /privacy/, /about/, sitemap.xml and robots.txt in `public/`. It needs Node. Rerun it after changing the tool descriptions in the script or the company guides in `public/interview-bank.js`.

## AI assistant on Home (optional, paid per use)
The chat box on Home works without setup: it points people to the right tool and sends resume files to the grader.
To turn on real AI answers (photo-to-resume, career advice), you need a Claude API key and a free Cloudflare account.
The key lives on Cloudflare, never in the website, and only signed-in users can use it.

1. **Claude API key.** Go to https://console.anthropic.com, sign up, add a payment method under Billing, and buy some credits.
   Under Settings → Limits, set a **monthly spend limit** (for example $20) so costs can't run away. Then API Keys → Create key and copy it.
2. **Cloudflare.** Sign up free at https://dash.cloudflare.com. Copy your **Account ID** (Workers & Pages → Overview, right side).
   Then My Profile → API Tokens → Create Token → use the **Edit Cloudflare Workers** template → Create, and copy the token.
   Open Workers & Pages once and pick a workers.dev subdomain if it asks.
3. **GitHub secrets.** In this repo: Settings → Secrets and variables → Actions → New repository secret. Add
   `ANTHROPIC_API_KEY`, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. **Deploy.** Actions → "Deploy assistant server" → Run workflow. When it finishes, the log shows the server's address,
   like `https://onestop-ai.yourname.workers.dev`. Opening that address plus `/health` should show `"configured":true`.
5. **Connect the site.** Edit `public/assets/assistant.js` and paste the address between the quotes:
   `const AI_ENDPOINT = "https://onestop-ai.yourname.workers.dev";`. Commit to main and the site redeploys.
6. **Firebase sign-in domain.** Firebase console → Authentication → Settings → Authorized domains → add `jcbubba11.github.io` if it isn't there.

Model and cost: the server uses `claude-opus-5-5` (the most capable everyday model). Each reply costs roughly a few cents; a
photo-to-resume turn costs a bit more. To cut cost a lot, change `MODEL` in `worker/wrangler.toml` to `claude-haiku-5-5` and commit.
Each person can send at most 8 messages a minute. If you add a custom domain, add it to `ALLOWED_ORIGINS` in `worker/wrangler.toml`.

## Profile and LinkedIn
The Profile page (More → Profile & LinkedIn sync) imports LinkedIn's "Save to PDF" file or the data export .zip in the browser.
LinkedIn doesn't let outside sites read full profiles or edit them, so changes go back as copy-ready text with links to the
right LinkedIn screens. No setup is needed.
