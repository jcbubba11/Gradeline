# Gradeline

A free resume, cover letter and LinkedIn grader. Everything runs in the browser; nothing is uploaded except Mentor review documents, which are stored in Firebase.

## 1. Put the site online
Netlify Drop: open app.netlify.com/drop and drag this folder onto the page. Or use Cloudflare Pages or GitHub Pages. All are free.

## 2. Turn on Mentor review (Firebase, free Spark plan)
1. Go to console.firebase.google.com → Add project → name it (e.g. `gradeline`). Google Analytics can be off.
2. Build → Firestore Database → Create database → Production mode → pick a US location.
3. Firestore → Rules → replace everything with the contents of `firestore.rules` → Publish.
4. Project settings (gear icon) → Your apps → Web (`</>`) → register the app (no hosting needed) → copy the `firebaseConfig` object.
5. In `index.html`, find `const FIREBASE_CONFIG = null;` and replace `null` with that object. Re-upload the site.
6. Project settings → General → Authorized domains is only for sign-in; nothing to do there for now.

The `firebaseConfig` values (apiKey, projectId…) are meant to be public. The rules file is what protects the data.

## 3. Before launch
- Set `const CONTACT_EMAIL = "";` in `index.html` to your contact address (shows in the privacy policy).
