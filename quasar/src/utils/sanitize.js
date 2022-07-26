import sanitizeHTML from "sanitize-html";

export function sanitizeDef(html) {
  return sanitizeHTML(html);
}
