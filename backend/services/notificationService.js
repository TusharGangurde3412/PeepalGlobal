const nodemailer = require('nodemailer');

let transporter;
let transporterVerified = false;
const notificationDebug = String(process.env.NOTIFICATION_DEBUG || 'false') === 'true';

function mask(value) {
  if (!value) return '(missing)';
  if (value.length <= 6) return `${value[0]}***${value[value.length - 1]}`;
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.OWNER_EMAIL
  );
}

function getTransporter() {
  if (transporter) return transporter;

  if (notificationDebug) {
    console.log('[notification:init] Creating SMTP transporter', {
      host: process.env.SMTP_HOST || '(missing)',
      port: process.env.SMTP_PORT || '(missing)',
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      user: mask(process.env.SMTP_USER || ''),
      ownerEmail: mask(process.env.OWNER_EMAIL || '')
    });
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
}

function formatFields(fields) {
  return Object.entries(fields)
    .map(([key, value]) => `${key}: ${value || '-'}`)
    .join('\n');
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (m) => m.toUpperCase())
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtmlTemplate(type, fields) {
  const rows = Object.entries(fields)
    .map(([key, value]) => {
      const displayValue = value === undefined || value === null || value === '' ? '-' : String(value);
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e7eee9;color:#486556;font-size:13px;font-weight:600;vertical-align:top;">
            ${escapeHtml(formatLabel(key))}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e7eee9;color:#1f3f31;font-size:13px;line-height:1.5;">
            ${escapeHtml(displayValue)}
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <div style="margin:0;background:#f2f7f4;padding:24px;font-family:Segoe UI,Arial,sans-serif;">
      <div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #d9e7df;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(120deg,#1f5f42,#319264);padding:18px 22px;">
          <div style="color:#dff5e8;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Peepal Export Notification</div>
          <h2 style="margin:6px 0 0;color:#ffffff;font-size:20px;">New ${escapeHtml(type)}</h2>
        </div>

        <div style="padding:18px 22px;">
          <p style="margin:0 0 14px;color:#456357;font-size:14px;">
            A new request has been submitted on the website. Details are below.
          </p>

          <table style="width:100%;border-collapse:collapse;border:1px solid #e7eee9;border-radius:8px;overflow:hidden;">
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div style="padding:12px 22px;background:#f8fbf9;border-top:1px solid #e7eee9;color:#678576;font-size:12px;">
          Sent automatically by Peepal Export backend.
        </div>
      </div>
    </div>
  `;
}

async function sendOwnerNotification(type, fields) {
  if (!process.env.OWNER_EMAIL) {
    if (notificationDebug) {
      console.warn('[notification:skip] OWNER_EMAIL not configured, skipping notification');
    }
    return;
  }

  const text = formatFields(fields);
  const html = buildHtmlTemplate(type, fields);
  const subjectPrefix = process.env.NOTIFY_SUBJECT_PREFIX || 'Peepal Export';
  const subject = `[${subjectPrefix}] New ${type}`;

  if (!hasSmtpConfig()) {
    // Keep submission flow successful even when SMTP is not configured.
    if (notificationDebug) {
      console.warn(`[notification:skip] SMTP config incomplete for ${subject}`);
      console.log('[notification:debug] Required vars:', {
        SMTP_HOST: Boolean(process.env.SMTP_HOST),
        SMTP_PORT: Boolean(process.env.SMTP_PORT),
        SMTP_USER: Boolean(process.env.SMTP_USER),
        SMTP_PASS: Boolean(process.env.SMTP_PASS),
        OWNER_EMAIL: Boolean(process.env.OWNER_EMAIL)
      });
      console.log(`[notification:payload] ${subject}\n${text}`);
    }
    return;
  }

  const mailer = getTransporter();
  // For providers like Gmail, mismatched "from" can be rejected.
  const from =
    process.env.SMTP_USER && process.env.SMTP_HOST && process.env.SMTP_HOST.includes('gmail.com')
      ? process.env.SMTP_USER
      : (process.env.SMTP_FROM || process.env.SMTP_USER);

  if (!transporterVerified) {
    try {
      await mailer.verify();
      transporterVerified = true;
      if (notificationDebug) {
        console.log('[notification:verify] SMTP connection verified successfully');
      }
    } catch (verifyErr) {
      console.error('[notification:verify:error]', {
        message: verifyErr.message,
        code: verifyErr.code,
        response: verifyErr.response
      });
      throw verifyErr;
    }
  }

  if (notificationDebug) {
    console.log('[notification:send] Sending email', {
      subject,
      from,
      to: process.env.OWNER_EMAIL
    });
  }

  const info = await mailer.sendMail({
    from,
    to: process.env.OWNER_EMAIL,
    subject,
    text,
    html
  });

  if (notificationDebug) {
    console.log('[notification:sent] Email queued', {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response
    });
  }
}

module.exports = {
  sendOwnerNotification
};
