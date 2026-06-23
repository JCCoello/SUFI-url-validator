// spec: SUFI-108 — Card tagPosition:image, Paginator, Categories tabs smoke
// targets:
//   Storybook: https://sufi-acl.vercel.app
//   DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = '/Users/coello/SUFI-url-validator/reports/QA/SUFI-108';
const STORYBOOK_BASE = 'https://sufi-acl.vercel.app';
const DEV_CATEGORIES = 'https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/categories';

async function injectBadge(page: any, label: string) {
  await page.evaluate((text: string) => {
    const existing = document.getElementById('__qa-label');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.id = '__qa-label';
    el.textContent = text;
    Object.assign(el.style, {
      position: 'fixed', top: '10px', right: '10px', zIndex: '99999',
      background: '#D32F2F', color: '#fff', fontFamily: 'monospace',
      fontSize: '13px', padding: '4px 8px', borderRadius: '3px'
    });
    document.body.appendChild(el);
  }, label);
}

async function removeBadge(page: any) {
  await page.evaluate(() => {
    document.getElementById('__qa-label')?.remove();
  });
}

async function authenticateVercel(page: any, url: string) {
  await page.goto(url);
  const passwordInput = page.getByRole('textbox', { name: 'Enter visitor password' });
  if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await passwordInput.fill('sufi-25-apply');
    await page.getByRole('button', { name: 'Unlock' }).click();
    await page.waitForURL(url, { timeout: 15000 });
  }
}

test.describe('SUFI-108 — Card tagPosition + Paginator + Categories', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  // AC1 — Card tagPosition:image in Storybook
  test('AC1 — Card tagPosition:image overlay on image', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Authenticate Storybook and load card story with tagPosition:image arg
    await authenticateVercel(
      page,
      `${STORYBOOK_BASE}/?path=/story/molecules-card--default&args=tagPosition:image`
    );

    // Wait for Storybook shell and iframe
    await page.locator('iframe[id="storybook-preview-iframe"]').waitFor({ state: 'attached' });
    await page.waitForSelector('[role="tablist"]', { timeout: 15000 });

    // Select tagPosition:image in Controls panel
    const imageRadio = page.getByRole('radio', { name: 'image' });
    await imageRadio.waitFor({ state: 'visible', timeout: 10000 });
    await imageRadio.click();

    // Verify tag overlaps image area inside iframe
    const tagPositionResult = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[id="storybook-preview-iframe"]') as HTMLIFrameElement;
      if (!iframe) return { error: 'iframe not found' };
      const iDoc = iframe.contentDocument;
      if (!iDoc) return { error: 'cannot access iframe' };

      const mediaTag = iDoc.querySelector('.ml-card__media-tag') as HTMLElement;
      const media = iDoc.querySelector('.ml-card__media') as HTMLElement;
      const title = iDoc.querySelector('.ml-card__title, h3') as HTMLElement;

      if (!mediaTag || !media) return { error: 'tag or media not found', mediaTag: !!mediaTag, media: !!media };

      const tagRect = mediaTag.getBoundingClientRect();
      const imgRect = media.getBoundingClientRect();

      return {
        tagFound: true,
        titleFound: !!title,
        titleText: title?.textContent?.trim(),
        tagClass: mediaTag.className,
        overlapsImage: tagRect.top < imgRect.bottom && tagRect.bottom > imgRect.top,
        tagTop: tagRect.top,
        tagBottom: tagRect.bottom,
        imgTop: imgRect.top,
        imgBottom: imgRect.bottom
      };
    });

    expect((tagPositionResult as any).error).toBeUndefined();
    expect((tagPositionResult as any).tagFound).toBe(true);
    expect((tagPositionResult as any).titleFound).toBe(true);
    expect((tagPositionResult as any).overlapsImage).toBe(true);

    // Inject badge and screenshot
    await injectBadge(page, 'AC1 — tagPosition:image');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC1-card-tagposition-image.png') });
    await removeBadge(page);

    // Filter out pre-auth and external asset errors
    const componentErrors = consoleErrors.filter(e =>
      !e.includes('401') && !e.includes('figma.com') && !e.includes('bancolombia.com')
    );
    expect(componentErrors.length).toBe(0);
  });

  // AC2 — Paginator organism in Storybook
  test('AC2 — Paginator: prev/next controls and active page indicator', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Navigate to Paginator story
    await authenticateVercel(
      page,
      `${STORYBOOK_BASE}/?path=/story/organisms-paginator--default`
    );

    await page.locator('iframe[id="storybook-preview-iframe"]').waitFor({ state: 'attached' });
    await page.waitForSelector('[role="tablist"]', { timeout: 15000 });

    // Inspect paginator inside iframe
    const paginatorResult = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[id="storybook-preview-iframe"]') as HTMLIFrameElement;
      if (!iframe) return { error: 'iframe not found' };
      const iDoc = iframe.contentDocument;
      if (!iDoc) return { error: 'cannot access iframe' };

      const arrowBtns = iDoc.querySelectorAll('.or-paginator__arrow-btn');
      const prevBtn = arrowBtns[0] as HTMLElement;
      const nextBtn = arrowBtns[arrowBtns.length - 1] as HTMLElement;
      const pageButtons = iDoc.querySelectorAll('.or-paginator__page');
      const activePage = Array.from(pageButtons).find(b =>
        getComputedStyle(b as Element).backgroundColor.includes('227')
      ) as HTMLElement | undefined;

      return {
        hasPrevBtn: !!prevBtn,
        hasNextBtn: !!nextBtn,
        prevText: prevBtn?.textContent?.trim(),
        nextText: nextBtn?.textContent?.trim(),
        pageCount: pageButtons.length,
        hasActivePage: !!activePage,
        activePageText: activePage?.textContent?.trim(),
        firstPageAriaLabel: (pageButtons[0] as HTMLElement)?.getAttribute('aria-label')
      };
    });

    expect((paginatorResult as any).error).toBeUndefined();
    expect((paginatorResult as any).hasPrevBtn).toBe(true);
    expect((paginatorResult as any).hasNextBtn).toBe(true);
    expect((paginatorResult as any).pageCount).toBeGreaterThanOrEqual(1);
    expect((paginatorResult as any).hasActivePage).toBe(true);

    await injectBadge(page, 'AC2 — paginator-controls');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC2-paginator-default.png') });
    await removeBadge(page);

    const componentErrors = consoleErrors.filter(e =>
      !e.includes('401') && !e.includes('figma.com') && !e.includes('bancolombia.com') && !e.includes('503')
    );
    expect(componentErrors.length).toBe(0);
  });

  // AC3 — Categories page: tab per smCategory, first tab shows all blogs
  test('AC3 — Categories: tabs and first tab is active by default', async ({ page }) => {
    // Authenticate DEV and navigate to categories
    await authenticateVercel(page, DEV_CATEGORIES);

    // Dismiss any auto-opening modal
    await page.keyboard.press('Escape');

    // Wait for tabs to be present
    await page.locator('[role="tablist"]').waitFor({ state: 'visible', timeout: 15000 });

    const tabResult = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      const firstTab = tabs[0] as HTMLElement;
      const firstTabActive = firstTab?.className.includes('ml-tab-item--regular--active');
      const cards = document.querySelectorAll('h3');

      return {
        tabCount: tabs.length,
        tabs: Array.from(tabs).map(t => ({
          text: t.textContent?.trim().replace(/\s+/g, ' '),
          isActive: (t as HTMLElement).className.includes('ml-tab-item--regular--active')
        })),
        firstTabActive,
        cardCount: cards.length,
        cardTitles: Array.from(cards).map(c => c.textContent?.trim())
      };
    });

    expect((tabResult as any).tabCount).toBeGreaterThanOrEqual(1);
    expect((tabResult as any).firstTabActive).toBe(true);
    expect((tabResult as any).cardCount).toBeGreaterThanOrEqual(1);

    await injectBadge(page, 'AC3 — tabs-count');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC3-categories-tabs.png') });
    await removeBadge(page);
  });

  // AC4 — Category tab filtering and Paginator navigation
  test('AC4 — Tab filtering updates grid and paginator navigates between pages', async ({ page }) => {
    await authenticateVercel(page, DEV_CATEGORIES);
    await page.keyboard.press('Escape');
    await page.locator('[role="tablist"]').waitFor({ state: 'visible', timeout: 15000 });

    // Click the second tab (Créditos y financiación)
    const secondTab = page.getByRole('tab').nth(1);
    await secondTab.click();
    await page.locator('h3').first().waitFor({ state: 'visible', timeout: 10000 });

    // Verify filtered cards and paginator present
    const filterResult = await page.evaluate(() => {
      const tabs = document.querySelectorAll('[role="tab"]');
      const activeTab = Array.from(tabs).find(t =>
        (t as HTMLElement).className.includes('ml-tab-item--regular--active')
      ) as HTMLElement;
      const cards = document.querySelectorAll('h3');
      const paginator = document.querySelector('.or-paginator');

      return {
        activeTabText: activeTab?.textContent?.trim().replace(/\s+/g, ' '),
        cardCount: cards.length,
        hasPaginator: !!paginator
      };
    });

    expect((filterResult as any).cardCount).toBeGreaterThanOrEqual(1);
    expect((filterResult as any).hasPaginator).toBe(true);

    await injectBadge(page, 'AC4 — tab-filter');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC4-categories-tab2-filtered.png') });
    await removeBadge(page);

    // Navigate back to all-tabs view and test paginator page 2
    const firstTab = page.getByRole('tab').first();
    await firstTab.click();
    await page.locator('h3').first().waitFor({ state: 'visible', timeout: 10000 });

    const page2Btn = page.getByRole('button', { name: 'Página 2' });
    const page2Visible = await page2Btn.isVisible({ timeout: 3000 }).catch(() => false);

    if (page2Visible) {
      await page2Btn.click();
      await page.locator('h3').first().waitFor({ state: 'visible', timeout: 10000 });

      const page2Result = await page.evaluate(() => {
        const cards = document.querySelectorAll('h3');
        const activePage = Array.from(
          document.querySelectorAll('button[aria-label*="Página"]')
        ).find(b => getComputedStyle(b as Element).backgroundColor.includes('227')) as HTMLElement;

        return {
          cardCount: cards.length,
          activePageText: activePage?.textContent?.trim(),
          activePageAriaLabel: activePage?.getAttribute('aria-label')
        };
      });

      expect((page2Result as any).cardCount).toBeGreaterThanOrEqual(1);

      await injectBadge(page, 'AC4 — tab-filter');
      await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC4-categories-page2.png') });
      await removeBadge(page);
    }
  });

  // AC5 — Responsive: 768px tablet and 375px mobile
  test('AC5 — Responsive layout at 768px tablet and 375px mobile', async ({ page }) => {
    await authenticateVercel(page, DEV_CATEGORIES);
    await page.keyboard.press('Escape');
    await page.locator('[role="tablist"]').waitFor({ state: 'visible', timeout: 15000 });

    // --- Tablet 768px ---
    await page.setViewportSize({ width: 768, height: 1024 });

    const tabletResult = await page.evaluate(() => {
      const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      const tabs = document.querySelectorAll('[role="tab"]');
      const cards = document.querySelectorAll('h3');
      const paginator = document.querySelector('.or-paginator, button[aria-label*="Página"]');

      return {
        hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        tabCount: tabs.length,
        cardCount: cards.length,
        hasPaginator: !!paginator
      };
    });

    expect((tabletResult as any).hasHorizontalScroll).toBe(false);
    expect((tabletResult as any).tabCount).toBeGreaterThanOrEqual(1);
    expect((tabletResult as any).cardCount).toBeGreaterThanOrEqual(1);

    await injectBadge(page, 'AC5 — 768px-tablet');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC5-categories-768px.png') });
    await removeBadge(page);

    // --- Mobile 375px ---
    await page.setViewportSize({ width: 375, height: 812 });

    const mobileResult = await page.evaluate(() => {
      const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;
      const tabs = document.querySelectorAll('[role="tab"]');
      const cards = document.querySelectorAll('h3');

      return {
        hasHorizontalScroll,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        tabCount: tabs.length,
        cardCount: cards.length
      };
    });

    expect((mobileResult as any).hasHorizontalScroll).toBe(false);
    expect((mobileResult as any).tabCount).toBeGreaterThanOrEqual(1);
    expect((mobileResult as any).cardCount).toBeGreaterThanOrEqual(1);

    await injectBadge(page, 'AC5 — 375px-mobile');
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'sufi108-AC5-categories-375px.png') });
    await removeBadge(page);
  });
});
