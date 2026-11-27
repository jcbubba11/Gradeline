// Checks a Firebase Authentication ID token (an RS256 JWT) with Google's published public keys.
// https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_a_third-party_jwt_library
const JWKS_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
let cache = { keys: null, until: 0 };

async function getKeys(fetchImpl = fetch) {
  if (cache.keys && Date.now() < cache.until) return cache.keys;
  const res = await fetchImpl(JWKS_URL);
  if (!res.ok) throw new Error("jwks");
  const maxAge = +(/max-age=(\d+)/.exec(res.headers.get("Cache-Control") || "") || [])[1] || 3600;
  cache = { keys: (await res.json()).keys, until: Date.now() + maxAge * 1000 };
  return cache.keys;
}

const b64urlBytes = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")), c => c.charCodeAt(0));
const b64urlJson = s => JSON.parse(new TextDecoder().decode(b64urlBytes(s)));

export async function verifyFirebaseToken(token, projectId, _ctx, opts = {}) {
  if (!token || !projectId) throw new Error("missing");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("format");
  const header = b64urlJson(parts[0]), payload = b64urlJson(parts[1]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("alg");
  const now = Math.floor((opts.now ?? Date.now()) / 1000);
  if (payload.aud !== projectId) throw new Error("aud");
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) throw new Error("iss");
  if (!payload.sub || typeof payload.sub !== "string" || payload.sub.length > 128) throw new Error("sub");
  if (!(payload.exp > now - 30)) throw new Error("exp");
  if (!(payload.iat <= now + 300) || !(payload.auth_time <= now + 300)) throw new Error("iat");
  const jwk = (opts.keys || await getKeys(opts.fetch)).find(k => k.kid === header.kid);
  if (!jwk) throw new Error("kid");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
  if (!ok) throw new Error("sig");
  return payload;
}
