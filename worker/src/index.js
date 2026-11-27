/* One Stop assistant server (Cloudflare Worker).
   The website sends the conversation here with the student's Firebase sign-in token. This server checks the
   token, adds the system prompt and tools, calls Claude with the key it keeps as a secret, and streams the reply
   back as server-sent events. The API key never reaches the browser.

   Secrets (set by the deploy workflow): ANTHROPIC_API_KEY.
   Vars (wrangler.toml): ALLOWED_ORIGINS, FIREBASE_PROJECT_ID, MODEL, EFFORT. Optional binding: LIMITER. */
import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM, TOOLS } from "./prompt.js";
import { verifyFirebaseToken } from "./auth.js";
import { checkMessages } from "./validate.js";

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : allowed[0] || "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    };
    const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (url.pathname === "/health") return json(200, { ok: true, model: env.MODEL, configured: !!env.ANTHROPIC_API_KEY });
    if (url.pathname !== "/chat" || request.method !== "POST") return json(404, { error: "not_found" });
    if (!allowed.includes(origin)) return json(403, { error: "origin", message: "This page isn't allowed to use the assistant." });
    if (!env.ANTHROPIC_API_KEY) return json(503, { error: "not_configured", message: "The assistant isn't set up yet." });

    // Sign-in check: only people signed in to One Stop can use the assistant, which keeps costs in check.
    let uid;
    try {
      const token = (request.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      uid = (await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID, ctx)).sub;
    } catch {
      return json(401, { error: "auth", message: "Sign in to use the assistant." });
    }
    if (env.LIMITER) {
      const { success } = await env.LIMITER.limit({ key: uid });
      if (!success) return json(429, { error: "rate", message: "That's a lot of messages in a minute. Wait a moment and try again." });
    }

    const raw = await request.text();
    if (raw.length > 12_000_000) return json(413, { error: "too_large", message: "Those attachments are too large. Try fewer or smaller files." });
    let body;
    try { body = JSON.parse(raw); } catch { return json(400, { error: "bad_json" }); }
    const problem = checkMessages(body.messages);
    if (problem) return json(400, { error: "bad_request", message: problem });

    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, ...(env.ANTHROPIC_BASE_URL ? { baseURL: env.ANTHROPIC_BASE_URL } : {}) });
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter(), enc = new TextEncoder();
    const send = obj => writer.write(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));

    ctx.waitUntil((async () => {
      try {
        const stream = client.beta.messages.stream({
          model: env.MODEL || "claude-opus-5-5",
          max_tokens: 16000,
          system: SYSTEM,
          tools: TOOLS,
          messages: body.messages,
          output_config: { effort: env.EFFORT || "medium" },
          cache_control: { type: "ephemeral" },
          // If a safety check declines a harmless request, Anthropic retries it on its recommended model.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          metadata: { user_id: await hashId(uid) }
        });
        for await (const event of stream) {
          if (event.type === "content_block_start" || event.type === "content_block_delta" || event.type === "content_block_stop") await send(event);
        }
        const message = await stream.finalMessage();
        await send({ type: "final", message: { content: message.content, stop_reason: message.stop_reason, model: message.model } });
      } catch (e) {
        const status = e?.status;
        const message = status === 429 || status === 529 ? "The assistant is busy right now. Try again in a minute."
          : status === 400 ? "The assistant couldn't read that message. Try removing an attachment."
          : "Something went wrong reaching the assistant. Try again.";
        console.error("chat error", status, e?.message);
        try { await send({ type: "error", message }); } catch {}
      } finally {
        try { await writer.close(); } catch {}
      }
    })());

    return new Response(readable, { headers: { ...cors, "Content-Type": "text/event-stream", "Cache-Control": "no-store" } });
  }
};

// Anthropic only needs a stable, anonymous id per person for abuse checks; send a hash, not the Firebase uid.
async function hashId(uid) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("onestop:" + uid));
  return [...new Uint8Array(d)].slice(0, 16).map(b => b.toString(16).padStart(2, "0")).join("");
}
