const fs = require('fs');
const path = require('path');

describe('Accessibility & Web Standards Compliance Tests', () => {
  let html;

  beforeAll(() => {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    html = fs.readFileSync(htmlPath, 'utf8');
  });

  test('Document has valid html[lang="en"] attribute', () => {
    expect(html).toMatch(/<html[^>]*lang=["']en["']/i);
  });

  test('Document has a descriptive title and viewport meta tag', () => {
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    expect(titleMatch).not.toBeNull();
    expect(titleMatch[1].length).toBeGreaterThan(10);
    expect(titleMatch[1]).toContain('Islamic Studies');

    expect(html).toMatch(
      /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i
    );
    expect(html).toMatch(/<meta[^>]*name=["']description["'][^>]*content=["'][^"']+/i);
  });

  test('Has accessible Skip to Main Content navigation link', () => {
    expect(html).toMatch(
      /<a[^>]*href=["']#mainContent["'][^>]*class=["'][^"']*skip-link[^"']*["'][^>]*>[\s\S]*?Skip to main content[\s\S]*?<\/a>/i
    );
  });

  test('Has proper semantic landmarks and ARIA navigation roles', () => {
    expect(html).toMatch(/<aside[^>]*class=["'][^"']*sidebar[^"']*["'][^>]*aria-label=/i);
    expect(html).toMatch(/role=["']group["']/i);
    expect(html).toMatch(/id=["']appLogoBtn["'][^>]*role=["']button["'][^>]*aria-label=/i);
    expect(html).toMatch(/id=["']learningModeLabel["']/i);
  });

  test('Web App Manifest and touch icons are linked in head', () => {
    expect(html).toMatch(/<link[^>]*rel=["']manifest["'][^>]*href=["']\/manifest\.json["']/i);
    expect(html).toMatch(/<link[^>]*rel=["'](icon|alternate icon)["'][^>]*href=["'][^"']*icon/i);
    expect(html).toMatch(
      /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["'][^"']*apple-touch-icon/i
    );
    expect(html).toMatch(/<meta[^>]*name=["']theme-color["'][^>]*content=["']#[0-9a-fA-F]{6}["']/i);
  });

  test('Buttons have accessible labels or textual content', () => {
    const buttonMatches = html.match(/<button[\s\S]*?<\/button>/gi) || [];
    expect(buttonMatches.length).toBeGreaterThan(10);

    buttonMatches.forEach((btnHtml) => {
      const textContent = btnHtml.replace(/<[^>]+>/g, '').trim();
      const hasText = textContent.length > 0;
      const hasAriaLabel = /aria-label=["'][^"']+["']/.test(btnHtml);
      const hasTitle = /title=["'][^"']+["']/.test(btnHtml);
      const isAccessible = hasText || hasAriaLabel || hasTitle;
      expect(isAccessible).toBe(true);
    });
  });
});
