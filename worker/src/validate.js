// Checks the conversation the browser sends before it goes to Claude. Only plain user and assistant turns
// are accepted (no system turns), with content block types the site actually produces.
const USER_BLOCKS = new Set(["text", "image", "document", "tool_result"]);
const ASSISTANT_BLOCKS = new Set(["text", "thinking", "redacted_thinking", "tool_use", "fallback"]);
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export function checkMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) return "No message to send.";
  if (messages.length > 60) return "This conversation is long. Start a new chat to keep going.";
  let files = 0;
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const want = i % 2 === 0 ? "user" : "assistant";
    if (!m || m.role !== want) return "The conversation is out of order. Start a new chat.";
    if (typeof m.content === "string") { if (m.content.length > 40000) return "That message is too long."; continue; }
    if (!Array.isArray(m.content) || !m.content.length) return "Empty message.";
    for (const b of m.content) {
      const okTypes = want === "user" ? USER_BLOCKS : ASSISTANT_BLOCKS;
      if (!b || !okTypes.has(b.type)) return "The conversation has something the assistant can't read. Start a new chat.";
      if (b.type === "text" && (typeof b.text !== "string" || b.text.length > 60000)) return "That message is too long.";
      if (b.type === "image") {
        if (b.source?.type !== "base64" || !IMAGE_TYPES.has(b.source.media_type)) return "Images must be JPEG, PNG, GIF or WebP.";
        files++;
      }
      if (b.type === "document") {
        if (b.source?.type !== "base64" || b.source.media_type !== "application/pdf") return "Only PDF documents can be attached.";
        files++;
      }
    }
  }
  if (messages[messages.length - 1].role !== "user") return "The last message must be yours.";
  if (files > 20) return "Too many attachments in this chat. Start a new chat to add more.";
  return null;
}
