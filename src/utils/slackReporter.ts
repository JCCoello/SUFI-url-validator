/**
 * Slack reporter — sends a Block Kit text summary to a Slack Incoming Webhook.
 * Called exclusively from globalTeardown (runs once after all tests complete).
 *
 * Required env var:
 *   SLACK_WEBHOOK_URL — Incoming Webhook URL
 */

import * as https from 'https';
import * as http from 'http';
import * as url from 'url';
import type { ValidationSummary } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SlackBlock {
  type: string;
  [key: string]: unknown;
}

interface SlackPayload {
  blocks: SlackBlock[];
  text: string;
}

// ---------------------------------------------------------------------------
// Block Kit builder
// ---------------------------------------------------------------------------

function buildPayload(summary: ValidationSummary, releaseName: string): SlackPayload {
  const passRate = summary.passRate;
  const passRateNum = parseFloat(passRate);
  const statusEmoji = summary.failed === 0 ? ':white_check_mark:' : ':x:';
  const healthEmoji = passRateNum >= 99 ? ':green_heart:' : passRateNum >= 90 ? ':yellow_heart:' : ':red_circle:';

  const runDate = new Date(summary.endTime).toLocaleString('es-MX', {
    timeZone: 'America/Panama',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${statusEmoji} ${releaseName} — Contentful Asset Validation`,
        emoji: true,
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Run completed:* ${runDate}  |  *Duration:* ${summary.durationSeconds}s`,
        },
      ],
    },
    { type: 'divider' },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Total assets*\n${summary.totalIds}` },
        { type: 'mrkdwn', text: `*Pass rate* ${healthEmoji}\n${passRate}` },
        { type: 'mrkdwn', text: `:white_check_mark: *Passed*\n${summary.passed}` },
        { type: 'mrkdwn', text: `:x: *Failed*\n${summary.failed}` },
      ],
    },
  ];

  if (summary.failed > 0) {
    blocks.push({ type: 'divider' });
    const MAX_SHOWN = 20;
    const failures = summary.failures.slice(0, MAX_SHOWN);
    const overflow = summary.failures.length - MAX_SHOWN;
    const failureLines = failures
      .map((f) => `• \`${f.assetId}\` — ${f.cdaError ?? f.imageError ?? 'Unknown error'}`)
      .join('\n');
    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*:warning: Failed Assets (${summary.failed}):*\n${failureLines}` +
          (overflow > 0 ? `\n_...and ${overflow} more_` : ''),
      },
    });
  } else {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: ':tada: *All assets passed validation successfully.*' },
    });
  }

  blocks.push({ type: 'divider' });
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: '_Automated by contentful-asset-validator · Banitsimo Migration_' }],
  });

  return {
    blocks,
    text: `${releaseName}: ${summary.passed}/${summary.totalIds} passed (${passRate})`,
  };
}

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function postJson(webhookUrl: string, payload: SlackPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const parsed = new url.URL(webhookUrl);
    const transport = parsed.protocol === 'https:' ? https : http;

    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port ? parseInt(parsed.port, 10) : (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk: Buffer) => { responseBody += chunk.toString(); });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve();
          else reject(new Error(`Slack webhook HTTP ${res.statusCode}: ${responseBody}`));
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(10_000, () => { req.destroy(); reject(new Error('Webhook timeout')); });
    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function sendSlackReport(
  summary: ValidationSummary,
  releaseName: string,
  webhookUrl?: string
): Promise<void> {
  const resolvedWebhook = webhookUrl ?? process.env.SLACK_WEBHOOK_URL;

  if (!resolvedWebhook) {
    console.warn('[SlackReporter] SLACK_WEBHOOK_URL not set — skipping.');
    return;
  }

  const payload = buildPayload(summary, releaseName);
  await postJson(resolvedWebhook, payload);
  console.log('[SlackReporter] Summary sent to Slack.');
}
