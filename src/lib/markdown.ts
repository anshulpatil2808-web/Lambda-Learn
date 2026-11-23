import { marked } from "marked";
import DOMPurify from "dompurify";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Turn a forum post (Markdown + LaTeX math) into safe HTML.
 *
 *  - $...$        inline math     e.g.  $v = \sqrt{GM/r}$
 *  - $$...$$      display math    e.g.  $$\Delta v = I_{sp} g_0 \ln\frac{m_0}{m_f}$$
 *  - Markdown     **bold**, lists, `code`, ```code blocks```, tables, links
 *
 * Math inside code is left alone. The final HTML is sanitised with DOMPurify,
 * so nobody can inject scripts. Images in post text are removed on purpose:
 * photos must be uploaded (so we never load trackers from other websites).
 */
const MATH = /\$\$([\s\S]+?)\$\$|(?<![\\$\w])\$(?!\s)((?:\\\$|[^$\n])+?)(?<!\s)\$(?!\w)/g;

function renderMath(src: string, store: string[]) {
  return src.replace(MATH, (_m, display: string | undefined, inline: string | undefined) => {
    const expr = (display ?? inline ?? "").trim();
    const html = katex.renderToString(expr, { displayMode: display !== undefined, throwOnError: false, strict: "ignore", maxSize: 20, maxExpand: 200 });
    store.push(html);
    return `MATHTOKEN${store.length - 1}END`;
  });
}

let hooked = false;
function hookLinks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer nofollow ugc");
    }
  });
}

export function renderMarkdown(text: string): string {
  hookLinks();
  const store: string[] = [];
  // Only replace math outside code spans / fenced blocks.
  const parts = text.split(/(```[\s\S]*?```|`[^`\n]*`)/g);
  const withTokens = parts.map((p, i) => (i % 2 ? p : renderMath(p, store))).join("");
  let html = marked.parse(withTokens, { gfm: true, breaks: true, async: false }) as string;
  html = html.replace(/MATHTOKEN(\d+)END/g, (_m, n) => store[Number(n)] ?? "");
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, mathMl: true, svg: true },
    FORBID_TAGS: ["img", "style", "iframe", "form", "input", "video", "audio"],
    FORBID_ATTR: ["srcset"],
  });
}

/** Plain-text preview for post cards (no Markdown symbols, math kept as written). */
export function plainPreview(text: string, max = 180) {
  const t = text
    .replace(/```[\s\S]*?```/g, " [code] ")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}
