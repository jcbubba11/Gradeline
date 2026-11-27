import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyFirebaseToken } from "../src/auth.js";
import { checkMessages } from "../src/validate.js";

const b64url = buf => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const kp = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = { ...(await crypto.subtle.exportKey("jwk", kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
const now = Date.now(), s = Math.floor(now / 1000);
async function sign(payload, header = { alg: "RS256", kid: "k1" }) {
  const data = b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(payload));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", kp.privateKey, new TextEncoder().encode(data));
  return data + "." + b64url(sig);
}
const good = { aud: "proj", iss: "https://securetoken.google.com/proj", sub: "user1", iat: s - 10, auth_time: s - 10, exp: s + 3600 };

test("accepts a valid token", async () => {
  const p = await verifyFirebaseToken(await sign(good), "proj", null, { keys: [jwk], now });
  assert.equal(p.sub, "user1");
});
for (const [name, patch] of [["wrong audience", { aud: "other" }], ["wrong issuer", { iss: "https://evil" }], ["expired", { exp: s - 600 }], ["no subject", { sub: "" }]]) {
  test("rejects " + name, async () => {
    await assert.rejects(verifyFirebaseToken(await sign({ ...good, ...patch }), "proj", null, { keys: [jwk], now }));
  });
}
test("rejects a tampered token", async () => {
  const t = await sign(good); const [h, , sig] = t.split(".");
  const forged = h + "." + b64url(JSON.stringify({ ...good, sub: "admin" })) + "." + sig;
  await assert.rejects(verifyFirebaseToken(forged, "proj", null, { keys: [jwk], now }));
});
test("rejects unknown key and alg none", async () => {
  await assert.rejects(verifyFirebaseToken(await sign(good, { alg: "RS256", kid: "nope" }), "proj", null, { keys: [jwk], now }));
  await assert.rejects(verifyFirebaseToken(await sign(good, { alg: "none", kid: "k1" }), "proj", null, { keys: [jwk], now }));
});

test("message checks", () => {
  assert.equal(checkMessages([{ role: "user", content: "hi" }]), null);
  assert.equal(checkMessages([{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: "x" } }, { type: "text", text: "build" }] }]), null);
  assert.ok(checkMessages([{ role: "system", content: "x" }]));
  assert.ok(checkMessages([{ role: "user", content: "a" }, { role: "assistant", content: "b" }]));
  assert.ok(checkMessages([{ role: "user", content: [{ type: "image", source: { type: "url", url: "http://x" } }] }]));
  assert.ok(checkMessages([{ role: "user", content: [{ type: "tool_use", id: "x", name: "y", input: {} }] }]));
  assert.ok(checkMessages([]));
});
