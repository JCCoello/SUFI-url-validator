// spec: SUFI-115 — MlContextualItem Accessibility Checks (Playwright)
// targets:
//   Storybook (iframe direct): https://sufi-acl.vercel.app/iframe.html?id=molecules-contextual-item--default&viewMode=story
//   DEV: https://sufi-app-git-dev-apply-digital-sandbox.vercel.app/#contacto

import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS_DIR = '/Users/coello/SUFI-url-validator/reports/QA/manual-runs/SUFI-115';
const STORYBOOK_IFRAME_URL = 'https://sufi-acl.vercel.app/iframe.html?id=molecules-contextual-item--default&viewMode=story';
const DEV_BASE = 'https://sufi-app-git-dev-apply-digital-sandbox.vercel.app';

// ─── Helpers ────────────────────────────────────────────────────────────────

async function authenticateVercel(page: any, url: string) {
  await page.goto(url);
  const passwordInput = page.getByRole('textbox', { name: 'Enter visitor password' });
  if (await passwordInput.isVisible({ timeout: 4000 }).catch(() => false)) {
    await passwordInput.fill('sufi-25-apply');
    await page.getByRole('button', { name: 'Unlock' }).click();
  }
}

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
      fontSize: '13px', padding: '4px 8px', borderRadius: '3px',
    });
    document.body.appendChild(el);
  }, label);
}

async function injectHighlight(page: any, selector: string) {
  await page.evaluate((sel: string) => {
    const existing = document.getElementById('__qa-highlight');
    if (existing) existing.remove();
    const target = document.querySelector(sel) as HTMLElement | null;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const box = document.createElement('div');
    box.id = '__qa-highlight';
    box.style.cssText =
      'position:fixed;z-index:99998;pointer-events:none;border:3px solid #D32F2F;';
    box.style.top    = (rect.top  - 3) + 'px';
    box.style.left   = (rect.left - 3) + 'px';
    box.style.width  = (rect.width  + 6) + 'px';
    box.style.height = (rect.height + 6) + 'px';
    document.body.appendChild(box);
  }, selector);
}

async function removeBadgeAndHighlight(page: any) {
  await page.evaluate(() => {
    document.getElementById('__qa-label')?.remove();
    document.getElementById('__qa-highlight')?.remove();
  });
}

async function takeScreenshot(page: any, filename: string) {
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, filename) });
}

// ─── Tests ──────────────────────────────────────────────────────────────────

test.describe('SUFI-115 — MlContextualItem A11y', () => {
  test.beforeAll(() => {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
  });

  // ── AC1 + AC2 — Storybook: button role, accessible name, focusability, keyboard ──
  test('AC1/AC2 — Storybook CTA button: role, accessible name, tabIndex, keyboard', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Authenticate Storybook then load direct iframe URL
    await authenticateVercel(page, 'https://sufi-acl.vercel.app');
    await page.goto(STORYBOOK_IFRAME_URL);

    // Wait for article (component root) to be present
    await page.locator('article').waitFor({ state: 'visible', timeout: 15000 });

    // AC1 — Check all interactive elements for role, accessible name, tabIndex
    const interactiveElements = await page.evaluate(() => {
      const article = document.querySelector('article');
      const ctaAll = article ? Array.from(article.querySelectorAll('a, button')) : [];
      return ctaAll.map(function(el) {
        var htmlEl = el as HTMLElement;
        return {
          tagName: htmlEl.tagName.toLowerCase(),
          role: htmlEl.getAttribute('role'),
          ariaLabel: htmlEl.getAttribute('aria-label'),
          ariaHidden: htmlEl.getAttribute('aria-hidden'),
          tabIndex: htmlEl.tabIndex,
          textContent: (htmlEl.textContent || '').trim().substring(0, 100),
          offsetWidth: htmlEl.offsetWidth,
          isVisible: htmlEl.offsetWidth > 0 && htmlEl.offsetParent !== null,
          hasAccessibleName: !!(htmlEl.textContent && htmlEl.textContent.trim() || htmlEl.getAttribute('aria-label')),
          isFocusable: htmlEl.tabIndex >= 0,
        };
      });
    });

    // At least one interactive element (the CTA button) should be present
    expect(interactiveElements.length).toBeGreaterThanOrEqual(1);

    // Find the CTA button specifically
    const ctaEl = interactiveElements.find(el => el.tagName === 'button');
    expect(ctaEl, 'CTA button element must exist').toBeTruthy();
    expect(ctaEl!.hasAccessibleName, 'CTA button must have accessible name').toBe(true);
    expect(ctaEl!.isFocusable, 'CTA button must be focusable (tabIndex >= 0)').toBe(true);
    expect(ctaEl!.isVisible, 'CTA button must be visible').toBe(true);
    expect(ctaEl!.ariaHidden, 'CTA button must not have aria-hidden').toBeNull();

    // AC1/AC2 — Check aria-hidden ancestors and ARIA state
    const ariaState = await page.evaluate(() => {
      const article = document.querySelector('article');
      const ctaBtn = article ? article.querySelector('button') : null;
      if (!ctaBtn) return { error: 'button not found' };

      let cursor: Element | null = ctaBtn;
      const ariaHiddenAncestors: string[] = [];
      while (cursor && cursor !== document.body) {
        if (cursor.getAttribute('aria-hidden') === 'true') {
          ariaHiddenAncestors.push(cursor.tagName + '.' + cursor.className.substring(0, 60));
        }
        cursor = cursor.parentElement;
      }

      return {
        buttonTagName: ctaBtn.tagName.toLowerCase(),
        buttonRole: ctaBtn.getAttribute('role'),
        buttonAriaLabel: ctaBtn.getAttribute('aria-label'),
        buttonAriaHidden: ctaBtn.getAttribute('aria-hidden'),
        buttonTabIndex: (ctaBtn as HTMLElement).tabIndex,
        buttonText: (ctaBtn.textContent || '').trim(),
        buttonOffsetWidth: (ctaBtn as HTMLElement).offsetWidth,
        buttonVisible: (ctaBtn as HTMLElement).offsetWidth > 0 && (ctaBtn as HTMLElement).offsetParent !== null,
        ariaHiddenAncestors,
        hasNoAriaHiddenAncestors: ariaHiddenAncestors.length === 0,
        articleClasses: article ? article.className.substring(0, 200) : null,
      };
    });

    expect((ariaState as any).error).toBeUndefined();
    expect((ariaState as any).buttonTagName).toBe('button');
    // CTA is rendered as <button> with role="link" — verify role is set
    expect((ariaState as any).buttonRole).toBeTruthy();
    // Accessible name via aria-label or text content
    const hasName = !!(
      (ariaState as any).buttonAriaLabel ||
      (ariaState as any).buttonText
    );
    expect(hasName, 'Button must have accessible name (aria-label or text)').toBe(true);
    expect((ariaState as any).buttonAriaHidden, 'Button aria-hidden must be null').toBeNull();
    expect((ariaState as any).hasNoAriaHiddenAncestors, 'No ancestor should have aria-hidden=true').toBe(true);
    expect((ariaState as any).buttonVisible, 'Button must be visible').toBe(true);

    // AC1 — Keyboard: focus() and Enter/Space dispatch do not throw
    const keyboardResult = await page.evaluate(() => {
      const article = document.querySelector('article');
      const ctaBtn = article ? article.querySelector('button') : null;
      if (!ctaBtn) return { error: 'button not found' };

      const errors: string[] = [];
      try { (ctaBtn as HTMLElement).focus(); } catch (e: any) { errors.push('focus() threw: ' + e.message); }
      const hasFocus = document.activeElement === ctaBtn;
      try {
        ctaBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        ctaBtn.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
      } catch (e: any) { errors.push('Enter key dispatch threw: ' + e.message); }
      try {
        ctaBtn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        ctaBtn.dispatchEvent(new KeyboardEvent('keyup',   { key: ' ', bubbles: true }));
      } catch (e: any) { errors.push('Space key dispatch threw: ' + e.message); }

      return { focusable: hasFocus, keyboardErrors: errors, noKeyboardErrors: errors.length === 0 };
    });

    expect((keyboardResult as any).focusable, 'Button must receive focus').toBe(true);
    expect((keyboardResult as any).noKeyboardErrors, 'Enter/Space must not throw JS errors').toBe(true);

    // Screenshot — AC1/AC2
    await injectBadge(page, 'AC1-AC2 — a11y (Storybook)');
    await injectHighlight(page, 'article button');
    await takeScreenshot(page, 'sufi115-AC1-a11y-storybook-cta.png');
    await removeBadgeAndHighlight(page);

    // Filter noise from console errors
    const componentErrors = consoleErrors.filter(e =>
      !e.includes('401') && !e.includes('figma.com') && !e.includes('bancolombia.com')
    );
    expect(componentErrors.length, 'No component-level console errors').toBe(0);
  });

  // ── AC3 — Storybook: horizontal variant has no a11y regressions ──
  test('AC3 — Storybook horizontal variant: no missing labels, no aria-hidden violations', async ({ page }) => {
    await authenticateVercel(page, 'https://sufi-acl.vercel.app');
    await page.goto(STORYBOOK_IFRAME_URL);
    await page.locator('article').waitFor({ state: 'visible', timeout: 15000 });

    // AC3 — All interactive elements in the horizontal variant must have accessible names
    const a11yResult = await page.evaluate(() => {
      const article = document.querySelector('article');
      const isHorizontal = article ? article.className.includes('ml-contextual-item__horizontal') : false;
      const allInteractive = article ? Array.from(article.querySelectorAll('a, button')) : [];
      const missingName = allInteractive.filter(function(el) {
        const text = (el.textContent || '').trim();
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        return !text && !ariaLabel && !ariaLabelledBy;
      });
      const images = article ? Array.from(article.querySelectorAll('img')) : [];
      const imagesMissingAlt = images.filter(function(img) { return !img.getAttribute('alt'); });

      return {
        isHorizontal,
        interactiveCount: allInteractive.length,
        missingAccessibleNameCount: missingName.length,
        imagesMissingAlt: imagesMissingAlt.length,
        allElementsHaveAccessibleNames: missingName.length === 0,
      };
    });

    expect((a11yResult as any).isHorizontal, 'Default variant must be horizontal').toBe(true);
    expect((a11yResult as any).interactiveCount).toBeGreaterThanOrEqual(1);
    expect((a11yResult as any).allElementsHaveAccessibleNames, 'All interactive elements must have accessible names').toBe(true);
    expect((a11yResult as any).imagesMissingAlt, 'No images missing alt text').toBe(0);

    await injectBadge(page, 'AC3 — a11y (horizontal, no regression)');
    await injectHighlight(page, 'article');
    await takeScreenshot(page, 'sufi115-AC3-a11y-horizontal-no-regression.png');
    await removeBadgeAndHighlight(page);
  });

  // ── AC4 — DEV live page: #contacto vertical variant a11y checks ──
  test('AC4 — DEV #contacto vertical variant: role, accessible name, keyboard, no aria-hidden', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Authenticate DEV
    await authenticateVercel(page, DEV_BASE + '/');
    // Dismiss any auto-opening modal
    await page.keyboard.press('Escape');
    // Navigate to #contacto
    await page.goto(DEV_BASE + '/#contacto');
    await page.keyboard.press('Escape');

    // Wait for the section to be present
    await page.locator('#contacto').waitFor({ state: 'attached', timeout: 15000 });

    // AC4 — Find MlContextualItem in the #contacto section
    const sectionResult = await page.evaluate(() => {
      const section = document.querySelector('#contacto');
      if (!section) return { error: 'contacto section not found' };
      const buttons = section.querySelectorAll('button');
      return {
        sectionFound: true,
        buttonCount: buttons.length,
        firstButtonText: buttons[0] ? (buttons[0].textContent || '').trim() : null,
        firstButtonRole: buttons[0] ? buttons[0].getAttribute('role') : null,
        firstButtonAriaLabel: buttons[0] ? buttons[0].getAttribute('aria-label') : null,
      };
    });

    expect((sectionResult as any).error).toBeUndefined();
    expect((sectionResult as any).sectionFound).toBe(true);
    expect((sectionResult as any).buttonCount).toBeGreaterThanOrEqual(1);

    // AC4 — Full a11y check on the CTA button
    const a11yResult = await page.evaluate(() => {
      const section = document.querySelector('#contacto');
      if (!section) return { error: 'contacto section not found' };

      const article = section.querySelector('article');
      const ctaBtn = section.querySelector('button') as HTMLElement | null;
      if (!ctaBtn) return { error: 'button not found in contacto' };

      let cursor: Element | null = ctaBtn;
      const ariaHiddenAncestors: string[] = [];
      while (cursor && cursor !== document.body) {
        if (cursor.getAttribute('aria-hidden') === 'true') {
          ariaHiddenAncestors.push(cursor.tagName + '.' + cursor.className.substring(0, 60));
        }
        cursor = cursor.parentElement;
      }

      const variantClass = article ? article.className : '';
      return {
        buttonTagName: ctaBtn.tagName.toLowerCase(),
        buttonRole: ctaBtn.getAttribute('role'),
        buttonAriaLabel: ctaBtn.getAttribute('aria-label'),
        buttonAriaHidden: ctaBtn.getAttribute('aria-hidden'),
        buttonTabIndex: ctaBtn.tabIndex,
        buttonText: (ctaBtn.textContent || '').trim(),
        buttonOffsetWidth: ctaBtn.offsetWidth,
        buttonVisible: ctaBtn.offsetWidth > 0 && ctaBtn.offsetParent !== null,
        hasAccessibleName: !!((ctaBtn.textContent || '').trim() || ctaBtn.getAttribute('aria-label')),
        isFocusable: ctaBtn.tabIndex >= 0,
        ariaHiddenAncestors,
        hasNoAriaHiddenAncestors: ariaHiddenAncestors.length === 0,
        isVertical: variantClass.includes('ml-contextual-item__vertical'),
      };
    });

    expect((a11yResult as any).error).toBeUndefined();
    expect((a11yResult as any).isVertical, 'Live component must render vertical variant').toBe(true);
    expect((a11yResult as any).buttonTagName).toBe('button');
    expect((a11yResult as any).hasAccessibleName, 'Button must have accessible name').toBe(true);
    expect((a11yResult as any).isFocusable, 'Button must be focusable').toBe(true);
    expect((a11yResult as any).buttonAriaHidden, 'Button aria-hidden must be null').toBeNull();
    expect((a11yResult as any).hasNoAriaHiddenAncestors, 'No ancestor must have aria-hidden=true').toBe(true);
    expect((a11yResult as any).buttonVisible, 'Button must be visible').toBe(true);

    // AC4 — Keyboard focus and Enter/Space must not throw
    const keyboardResult = await page.evaluate(() => {
      const section = document.querySelector('#contacto');
      const ctaBtn = section ? section.querySelector('button') : null;
      if (!ctaBtn) return { error: 'button not found' };

      const errors: string[] = [];
      try { (ctaBtn as HTMLElement).focus(); } catch (e: any) { errors.push('focus() threw: ' + e.message); }
      const hasFocus = document.activeElement === ctaBtn;
      try {
        ctaBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        ctaBtn.dispatchEvent(new KeyboardEvent('keyup',   { key: 'Enter', bubbles: true }));
      } catch (e: any) { errors.push('Enter key threw: ' + e.message); }
      try {
        ctaBtn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
        ctaBtn.dispatchEvent(new KeyboardEvent('keyup',   { key: ' ', bubbles: true }));
      } catch (e: any) { errors.push('Space key threw: ' + e.message); }

      return { focusable: hasFocus, keyboardErrors: errors, noKeyboardErrors: errors.length === 0 };
    });

    expect((keyboardResult as any).focusable, 'Button must receive focus').toBe(true);
    expect((keyboardResult as any).noKeyboardErrors, 'Enter/Space must not throw').toBe(true);

    await injectBadge(page, 'AC4 — a11y (live DEV #contacto vertical)');
    await injectHighlight(page, '#contacto button');
    await takeScreenshot(page, 'sufi115-AC4-a11y-dev-contacto-vertical.png');
    await removeBadgeAndHighlight(page);

    const componentErrors = consoleErrors.filter(e =>
      !e.includes('401') && !e.includes('figma.com') && !e.includes('bancolombia.com') &&
      !e.includes('vercel') && !e.includes('503')
    );
    expect(componentErrors.length, 'No component console errors in DEV').toBe(0);
  });

  // ── AC5 — DEV live page: responsive visibility at 768px and 375px ──
  test('AC5 — DEV #contacto: button visible and not hidden at 768px and 375px', async ({ page }) => {
    await authenticateVercel(page, DEV_BASE + '/');
    await page.keyboard.press('Escape');
    await page.goto(DEV_BASE + '/#contacto');
    await page.keyboard.press('Escape');
    await page.locator('#contacto').waitFor({ state: 'attached', timeout: 15000 });

    // ── 768px tablet ──
    await page.setViewportSize({ width: 768, height: 1024 });

    const tabletResult = await page.evaluate(() => {
      const section = document.querySelector('#contacto');
      const ctaBtn = section ? section.querySelector('button') as HTMLElement | null : null;
      if (!ctaBtn) return { error: 'button not found' };
      const computed = window.getComputedStyle(ctaBtn);
      const hiddenAncestors: string[] = [];
      let cursor: Element | null = ctaBtn;
      while (cursor && cursor !== document.body) {
        const style = window.getComputedStyle(cursor);
        if (style.display === 'none' || style.visibility === 'hidden') {
          hiddenAncestors.push(cursor.tagName);
        }
        cursor = cursor.parentElement;
      }
      return {
        offsetWidth: ctaBtn.offsetWidth,
        offsetParentExists: ctaBtn.offsetParent !== null,
        display: computed.display,
        visibility: computed.visibility,
        buttonHasHidingClass: ctaBtn.className.includes('d-none') || ctaBtn.className.includes('hidden') || ctaBtn.className.includes('sr-only'),
        hiddenAncestors,
        isVisible: ctaBtn.offsetWidth > 0 && ctaBtn.offsetParent !== null && computed.display !== 'none' && computed.visibility !== 'hidden',
      };
    });

    expect((tabletResult as any).error).toBeUndefined();
    expect((tabletResult as any).isVisible, 'Button must be visible at 768px').toBe(true);
    expect((tabletResult as any).offsetWidth, 'Button offsetWidth must be > 0 at 768px').toBeGreaterThan(0);
    expect((tabletResult as any).offsetParentExists, 'Button offsetParent must exist at 768px').toBe(true);
    expect((tabletResult as any).buttonHasHidingClass, 'Button must not have a hiding CSS class at 768px').toBe(false);

    await injectBadge(page, 'AC5 — a11y (768px responsive check)');
    await injectHighlight(page, '#contacto button');
    await page.evaluate(() => {
      const btn = document.querySelector('#contacto button');
      if (btn) btn.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await takeScreenshot(page, 'sufi115-AC5-a11y-responsive-768px.png');
    await removeBadgeAndHighlight(page);

    // ── 375px mobile ──
    await page.setViewportSize({ width: 375, height: 812 });

    const mobileResult = await page.evaluate(() => {
      const section = document.querySelector('#contacto');
      const ctaBtn = section ? section.querySelector('button') as HTMLElement | null : null;
      if (!ctaBtn) return { error: 'button not found' };
      const computed = window.getComputedStyle(ctaBtn);
      const hiddenAncestors: string[] = [];
      let cursor: Element | null = ctaBtn;
      while (cursor && cursor !== document.body) {
        const style = window.getComputedStyle(cursor);
        if (style.display === 'none' || style.visibility === 'hidden') {
          hiddenAncestors.push(cursor.tagName);
        }
        cursor = cursor.parentElement;
      }
      return {
        offsetWidth: ctaBtn.offsetWidth,
        offsetParentExists: ctaBtn.offsetParent !== null,
        display: computed.display,
        visibility: computed.visibility,
        buttonHasHidingClass: ctaBtn.className.includes('d-none') || ctaBtn.className.includes('hidden') || ctaBtn.className.includes('sr-only'),
        hiddenAncestors,
        isVisible: ctaBtn.offsetWidth > 0 && ctaBtn.offsetParent !== null && computed.display !== 'none' && computed.visibility !== 'hidden',
      };
    });

    expect((mobileResult as any).error).toBeUndefined();
    expect((mobileResult as any).isVisible, 'Button must be visible at 375px').toBe(true);
    expect((mobileResult as any).offsetWidth, 'Button offsetWidth must be > 0 at 375px').toBeGreaterThan(0);
    expect((mobileResult as any).offsetParentExists, 'Button offsetParent must exist at 375px').toBe(true);
    expect((mobileResult as any).buttonHasHidingClass, 'Button must not have a hiding CSS class at 375px').toBe(false);

    await injectBadge(page, 'AC5 — a11y (375px mobile check)');
    await injectHighlight(page, '#contacto button');
    await takeScreenshot(page, 'sufi115-AC5-a11y-responsive-375px.png');
    await removeBadgeAndHighlight(page);
  });
});
