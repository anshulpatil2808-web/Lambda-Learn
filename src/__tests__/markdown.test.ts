// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { plainPreview, renderMarkdown } from "../lib/markdown";

describe("forum Markdown + math renderer", () => {
  it("renders inline and display maths with KaTeX", () => {
    const html = renderMarkdown("Orbit speed $v = \\sqrt{GM/r}$ and\n\n$$\\Delta v = I_{sp} g_0 \\ln\\frac{m_0}{m_f}$$");
    expect(html).toContain("katex");
    expect(html).toContain("katex-display");
    expect(html).not.toContain("katex-error");
  });
  it("leaves money and code alone", () => {
    expect(renderMarkdown("A tracker costs $300 and a lens $150.")).not.toContain("katex");
    expect(renderMarkdown("`price = $5$`")).not.toContain("katex");
  });
  it("removes scripts, event handlers and external images", () => {
    const html = renderMarkdown('<script>alert(1)</script><img src="https://tracker.example/x.png"><a href="javascript:alert(1)" onclick="x()">click</a>\n\nStill **ok** after HTML');
    expect(html).not.toMatch(/<script|<img|onclick|javascript:/i);
    expect(html).toContain("<strong>ok</strong>");
  });
  it("opens links safely in a new tab", () => {
    const html = renderMarkdown("[NASA](https://nasa.gov)");
    expect(html).toContain('target="_blank"');
    expect(html).toContain("noopener");
  });
  it("makes short plain previews", () => {
    expect(plainPreview("**Bold** [link](https://x.y) text", 100)).toBe("Bold link text");
    expect(plainPreview("x".repeat(300), 50).length).toBe(50);
  });
});
