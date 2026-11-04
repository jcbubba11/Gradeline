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
