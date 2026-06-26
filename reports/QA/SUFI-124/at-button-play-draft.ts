/**
 * SUFI-124 — AtButton play() function drafts
 *
 * Target file: src/stories/atoms/at-button.stories.tsx
 * These play() functions are meant to be added to the existing story exports.
 *
 * Dependencies (already in @storybook/test):
 *   import { expect, fn, userEvent, within } from '@storybook/test';
 *
 * Add to meta args to enable onClick tracking:
 *   args: { onClick: fn() }
 */

// ─────────────────────────────────────────────
// AC1: All main variants render correctly
// Add to: Primary, Secondary, SecondaryRed, BackgroundWhite stories
// ─────────────────────────────────────────────

export const Primary: Story = {
  // ...existing args...
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('at-button__primary');
    await expect(button).not.toBeDisabled();
  },
};

export const Secondary: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('at-button__secondary');
    await expect(button).not.toBeDisabled();
  },
};

export const SecondaryRed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('at-button__secondary-red');
    await expect(button).not.toBeDisabled();
  },
};

export const BackgroundWhite: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('at-button__background-white');
    await expect(button).not.toBeDisabled();
  },
};

// ─────────────────────────────────────────────
// AC2: Disabled state — renders + blocks clicks
// Add to: PrimaryDisabled, SecondaryDisabled, SecondaryRedDisabled stories
// ─────────────────────────────────────────────

export const PrimaryDisabled: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    // Click should not fire onClick
    await userEvent.click(button, { pointerEventsCheck: 0 });
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

// Reuse same play() for SecondaryDisabled and SecondaryRedDisabled

// ─────────────────────────────────────────────
// AC3: onClick fires on enabled button
// Add to: Primary story (or CustomAction)
// ─────────────────────────────────────────────

export const CustomAction: Story = {
  args: {
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

// ─────────────────────────────────────────────
// AC4: Icon variant renders icon element
// Add to: PrimaryIconRight, SecondaryIconRight, etc.
// ─────────────────────────────────────────────

export const PrimaryIconRight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    const icon = canvas.getByTestId('at-button-icon');
    await expect(button).toBeVisible();
    await expect(icon).toBeVisible();
    // Icon element exists inside button
    await expect(button).toContainElement(icon);
  },
};

// ─────────────────────────────────────────────
// AC5: full-width variant fills container
// Add to: FullWidth story
// ─────────────────────────────────────────────

export const FullWidth: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    await expect(button).toHaveClass('at-button__full-width');
    // Width matches parent container
    const btnRect = button.getBoundingClientRect();
    const parentRect = button.parentElement!.getBoundingClientRect();
    await expect(btnRect.width).toBe(parentRect.width);
  },
};

// ─────────────────────────────────────────────
// AC6: Dropdown button (expandable) — verify toggle
// Story: likely SecondarySelect or a header-specific story
// NOTE: Confirm with Martín which story covers this AC
// ─────────────────────────────────────────────

export const SecondarySelect: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
    // Click to expand
    await userEvent.click(button);
    // Confirm expanded state — adjust selector once repo is cloned and dropdown markup is visible
    // await expect(canvas.getByRole('menu')).toBeVisible();
  },
};

// ─────────────────────────────────────────────
// AC7: Breakpoints — viewport checks
// Storybook Test Runner supports viewport via parameters
// Add to meta or individual stories
// ─────────────────────────────────────────────

export const PrimaryMobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' }, // 320px
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
  },
};

export const PrimaryTablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' }, // 768px
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('at-button');
    await expect(button).toBeVisible();
  },
};

// Desktop uses default viewport — covered by Primary story above
