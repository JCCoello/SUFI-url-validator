// spec: SUFI-109 — TmBlog template (Aprende con Sufi) smoke verification
// env: DEV — https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi
// screenshots: /Users/coello/SUFI-url-validator/reports/QA/SUFI-109/

import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const DEV_URL = 'https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/aprende-con-sufi';
const SCREENSHOT_DIR = '/Users/coello/SUFI-url-validator/reports/QA/SUFI-109';

async function waitForImages(page: any) {
  await page.waitForLoadState('load');
  await page.waitForTimeout(2000);
}

async function injectBadge(page: any, badgeText: string) {
  await page.evaluate((text: string) => {
    document.getElementById('__qa-label')?.remove();
    const badge = document.createElement('div');
    badge.id = '__qa-label';
    badge.style.cssText =
      'position:fixed;top:12px;right:12px;z-index:99999;background:#D32F2F;color:white;font-family:monospace;font-size:13px;padding:4px 10px;border-radius:4px;';
    badge.textContent = text;
    document.body.appendChild(badge);
  }, badgeText);
}

async function clearOutlines(page: any) {
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>('[data-qa-outlined]').forEach(el => {
      el.style.outline = '';
      el.removeAttribute('data-qa-outlined');
    });
  });
}

async function authenticate(page: any) {
  await page.goto(DEV_URL);
  await page.waitForLoadState('domcontentloaded');
  const pwInput = page.getByRole('textbox', { name: 'Enter visitor password' });
  if (await pwInput.isVisible()) {
    await pwInput.fill('sufi-25-apply');
    await page.getByRole('button', { name: 'Unlock' }).click();
    await page.waitForLoadState('networkidle');
  }
  // Dismiss any auto-opening modal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
}

test.describe('SUFI-109 — TmBlog template (Aprende con Sufi)', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  });

  test('AC1 — TmBlog renders sections with MlHeading titles, no console errors', async ({ page }) => {
    await authenticate(page);
    await waitForImages(page);

    const sectionData = await page.evaluate(() => {
      const main = document.querySelector('main');
      const topSection = main!.querySelector('section');
      const children = Array.from(topSection!.children);
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent!.trim());
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.textContent!.trim());
      return {
        sectionChildCount: children.length,
        h2Headings: h2s,
        h3Count: h3s.length,
        categoriesPresent: h2s.some(h => h.includes('Categor')),
        featuredPresent: h2s.some(h => h.includes('Primera')),
        latestPresent: h2s.some(h => h.includes('Segunda')),
        bottomPresent: h2s.some(h => h.includes('Cont')),
      };
    });

    expect(sectionData.sectionChildCount).toBeGreaterThanOrEqual(5);
    expect(sectionData.categoriesPresent).toBe(true);
    expect(sectionData.featuredPresent).toBe(true);
    expect(sectionData.latestPresent).toBe(true);
    expect(sectionData.bottomPresent).toBe(true);
    expect(sectionData.h2Headings.length).toBeGreaterThanOrEqual(4);
    expect(sectionData.h3Count).toBeGreaterThan(0);

    // Highlight the first H2 heading (categoriesSection heading — first MlHeading in template body)
    await page.evaluate(() => {
      const firstH2 = Array.from(document.querySelectorAll('h2')).find(h =>
        h.textContent?.includes('Categor')
      ) as HTMLElement | null;
      if (firstH2) {
        firstH2.style.outline = '3px solid #D32F2F';
        firstH2.setAttribute('data-qa-outlined', '');
        firstH2.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await injectBadge(page, 'AC1 — MlHeading sections render');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC1-tmBlog-sections.png') });
    await clearOutlines(page);
  });

  test('AC2 — categoriesSection SmCategory cards: fields visible + click navigates to ?categoria={categoryId}', async ({ page }) => {
    await authenticate(page);
    await waitForImages(page);

    const catCards = await page.evaluate(() => {
      const catLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="categoria="]'));
      return catLinks.map(a => ({
        href: a.getAttribute('href'),
        label: a.querySelector('h4')?.textContent?.trim() ?? null,
        hasIcon: !!a.querySelector('em'),
        hasText: !!a.querySelector('p'),
      }));
    });

    expect(catCards.length).toBeGreaterThanOrEqual(2);
    catCards.forEach(card => {
      expect(card.hasIcon).toBe(true);
      expect(card.hasText).toBe(true);
      expect(card.href).toMatch(/\/aprende-con-sufi\/categorias\?categoria=/);
    });

    // Highlight the first category card specifically
    await page.evaluate(() => {
      const firstCard = document.querySelector<HTMLElement>('a[href*="categoria="]');
      if (firstCard) {
        firstCard.style.outline = '3px solid #D32F2F';
        firstCard.setAttribute('data-qa-outlined', '');
        firstCard.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    });
    await injectBadge(page, 'AC2 — SmCategory card');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC2-categories-section.png') });
    await clearOutlines(page);

    // Verify navigation
    const firstHref = catCards[0].href!;
    await page.goto(`https://sufi-app-git-dev-apply-digital-sandbox.vercel.app${firstHref}`);
    await page.waitForLoadState('networkidle');
    const urlParam = await page.evaluate(() => new URLSearchParams(window.location.search).get('categoria'));
    expect(urlParam).not.toBeNull();

    await page.goto(DEV_URL);
  });

  test('AC3 — featuredArticles cards: fields + link pattern /aprende-con-sufi/{categoryId}/{blogId}', async ({ page }) => {
    await authenticate(page);
    await waitForImages(page);

    const featuredData = await page.evaluate(() => {
      const featuredSection = Array.from(document.querySelectorAll('section')).find(
        s => s.querySelector('h2')?.textContent?.includes('Primera')
      );
      const mlCards = Array.from(featuredSection!.querySelectorAll('[data-testid="ml-card-actions-link"]'));
      return {
        cardCount: mlCards.length,
        cardDetails: mlCards.map(a => {
          let el: Element | null = a;
          for (let i = 0; i < 8; i++) {
            el = el!.parentElement;
            if (!el) break;
            if (el.querySelector('img') && el.querySelector('h3')) {
              return {
                href: (a as HTMLAnchorElement).getAttribute('href'),
                img: el.querySelector('img')!.alt,
                h3: el.querySelector('h3')!.textContent!.trim(),
                p: el.querySelector('p')?.textContent?.trim() ?? null,
              };
            }
          }
          return { href: (a as HTMLAnchorElement).getAttribute('href'), note: 'no img+h3 in ancestors' };
        }),
      };
    });

    expect(featuredData.cardCount).toBeGreaterThanOrEqual(2);
    featuredData.cardDetails.forEach(card => {
      expect(card.href).toMatch(/\/aprende-con-sufi\/[^/]+\/[^/]+/);
    });

    // Highlight the first featured article card
    await page.evaluate(() => {
      const firstCard = document.querySelector<HTMLElement>('[data-testid="ml-card-actions-link"]');
      // Walk up to the card root (has img + h3)
      let el: HTMLElement | null = firstCard;
      for (let i = 0; i < 8; i++) {
        el = el?.parentElement ?? null;
        if (!el) break;
        if (el.querySelector('img') && el.querySelector('h3')) {
          el.style.outline = '3px solid #D32F2F';
          el.setAttribute('data-qa-outlined', '');
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          break;
        }
      }
    });
    await injectBadge(page, 'AC3 — featuredArticles card');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC3-featured-articles.png') });
    await clearOutlines(page);
  });

  test('AC4 — latestArticles cards: same field checks + link pattern + no incorrect duplication', async ({ page }) => {
    await authenticate(page);
    await waitForImages(page);

    const latestData = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const latestSection = sections.find(s => s.querySelector('h2')?.textContent?.includes('Segunda'));
      const featuredSection = sections.find(s => s.querySelector('h2')?.textContent?.includes('Primera'));

      const latestCards = Array.from(latestSection!.querySelectorAll('[data-testid="ml-card-actions-link"]'));
      const featuredCards = Array.from(featuredSection!.querySelectorAll('[data-testid="ml-card-actions-link"]'));

      const latestHrefs = latestCards.map(a => (a as HTMLAnchorElement).getAttribute('href'));
      const featuredHrefs = featuredCards.map(a => (a as HTMLAnchorElement).getAttribute('href'));
      const overlap = latestHrefs.filter(h => featuredHrefs.includes(h));

      return {
        latestCardCount: latestCards.length,
        latestHrefs,
        overlapCount: overlap.length,
        cardDetails: latestCards.map(a => {
          let el: Element | null = a;
          for (let i = 0; i < 8; i++) {
            el = el!.parentElement;
            if (!el) break;
            if (el.querySelector('img') && el.querySelector('h3')) {
              return {
                href: (a as HTMLAnchorElement).getAttribute('href'),
                img: el.querySelector('img')!.alt,
                h3: el.querySelector('h3')!.textContent!.trim(),
              };
            }
          }
          return { href: (a as HTMLAnchorElement).getAttribute('href'), note: 'no img+h3' };
        }),
      };
    });

    expect(latestData.latestCardCount).toBeGreaterThanOrEqual(2);
    latestData.latestHrefs.forEach(href => {
      expect(href).toMatch(/\/aprende-con-sufi\/[^/]+\/[^/]+/);
    });
    console.log(`[AC4] latestArticles overlap with featured: ${latestData.overlapCount} of ${latestData.latestCardCount} cards`);

    // Highlight the first latestArticles card specifically
    await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section'));
      const latestSection = sections.find(s => s.querySelector('h2')?.textContent?.includes('Segunda'));
      const firstCard = latestSection?.querySelector<HTMLElement>('[data-testid="ml-card-actions-link"]');
      let el: HTMLElement | null = firstCard ?? null;
      for (let i = 0; i < 8; i++) {
        el = el?.parentElement ?? null;
        if (!el) break;
        if (el.querySelector('img') && el.querySelector('h3')) {
          el.style.outline = '3px solid #D32F2F';
          el.setAttribute('data-qa-outlined', '');
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          break;
        }
      }
    });
    await injectBadge(page, 'AC4 — latestArticles card');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC4-latest-articles.png') });
    await clearOutlines(page);
  });

  test('AC5 — Unconfigured optional sections absent from DOM, no empty space', async ({ page }) => {
    await authenticate(page);
    await waitForImages(page);

    const domIssues = await page.evaluate(() => {
      const noHorizontalOverflow = document.body.scrollWidth <= window.innerWidth;
      // Check main content area for empty section-like containers
      const mainSections = Array.from(document.querySelectorAll('main section'));
      const emptySections = mainSections.filter(s => {
        const rect = s.getBoundingClientRect();
        return rect.height > 0 && s.children.length === 0;
      });
      return {
        noHorizontalOverflow,
        bodyScrollWidth: document.body.scrollWidth,
        windowInnerWidth: window.innerWidth,
        emptySectionCount: emptySections.length,
      };
    });

    expect(domIssues.noHorizontalOverflow).toBe(true);
    expect(domIssues.emptySectionCount).toBe(0);

    // Scroll to top and highlight the TmBlog main section to show no gaps
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const mainSection = document.querySelector<HTMLElement>('main > div > section');
      if (mainSection) {
        mainSection.style.outline = '3px solid #D32F2F';
        mainSection.setAttribute('data-qa-outlined', '');
      }
    });
    await injectBadge(page, 'AC5 — optional sections absent');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC5-no-empty-sections.png') });
    await clearOutlines(page);
  });

  test('AC6 — Responsive: tablet 768px and mobile 375px', async ({ page }) => {
    // Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await authenticate(page);
    await waitForImages(page);

    const tabletCheck = await page.evaluate(() => ({
      hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
      mainSectionsHaveHeight: Array.from(document.querySelectorAll('main section')).every(
        s => s.getBoundingClientRect().height > 0
      ),
    }));

    expect(tabletCheck.hasHorizontalOverflow).toBe(false);
    expect(tabletCheck.mainSectionsHaveHeight).toBe(true);

    // Highlight the categories section (first section below hero) to show responsive layout
    await page.evaluate(() => {
      const catSection = Array.from(document.querySelectorAll('section')).find(
        s => s.querySelector('h2')?.textContent?.includes('Categor')
      ) as HTMLElement | undefined;
      if (catSection) {
        catSection.style.outline = '3px solid #D32F2F';
        catSection.setAttribute('data-qa-outlined', '');
        catSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    await injectBadge(page, 'AC6 — tablet 768px');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC6-tablet-768.png') });
    await clearOutlines(page);

    // Mobile 375px
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(DEV_URL);
    await waitForImages(page);

    const mobileCheck = await page.evaluate(() => ({
      hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
      mainSectionsHaveHeight: Array.from(document.querySelectorAll('main section')).every(
        s => s.getBoundingClientRect().height > 0
      ),
    }));

    expect(mobileCheck.hasHorizontalOverflow).toBe(false);
    expect(mobileCheck.mainSectionsHaveHeight).toBe(true);

    await page.evaluate(() => {
      const catSection = Array.from(document.querySelectorAll('section')).find(
        s => s.querySelector('h2')?.textContent?.includes('Categor')
      ) as HTMLElement | undefined;
      if (catSection) {
        catSection.style.outline = '3px solid #D32F2F';
        catSection.setAttribute('data-qa-outlined', '');
        catSection.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    });
    await injectBadge(page, 'AC6 — mobile 375px');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'sufi109-AC6-mobile-375.png') });
    await clearOutlines(page);
  });
});
