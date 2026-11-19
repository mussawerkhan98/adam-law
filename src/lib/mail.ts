import nodemailer, { type Transporter } from "nodemailer";
import { siteUrl } from "./utils";

/**
 * Email alerts for new contact-form enquiries, sent over SMTP.
 *
 * Configure with environment variables (see .env.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   — mail server login
 *   MAIL_FROM            — sender address (defaults to SMTP_USER)
 *   CONTACT_ALERT_TO     — who receives alerts, comma-separated (defaults to the email in Admin → Settings)
 */

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter: Transporter | null = null;
function getTransport() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

/** Recipients for alerts: CONTACT_ALERT_TO, otherwise the firm email from Settings. */
export function alertRecipients(firmEmail: string) {
  const list = (process.env.CONTACT_ALERT_TO || firmEmail || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return list;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
// Keep header values on one line so user input can't add headers.
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export type EnquiryForAlert = {
  id: number;
  name: string;
  email: string;
  phone: string;
  practiceArea: string;
  message: string;
  createdAt: Date;
};

export async function sendContactAlert(enquiry: EnquiryForAlert, firm: { firmName: string; email: string }) {
  if (!mailConfigured()) return { sent: false as const, reason: "SMTP not configured" };
  const to = alertRecipients(firm.email);
  if (to.length === 0) return { sent: false as const, reason: "No recipient (set CONTACT_ALERT_TO or the email in Settings)" };

  const { subject, text, html } = buildContactAlert(enquiry, firm.firmName);
  await getTransport().sendMail({
    from: { name: `${oneLine(firm.firmName)} Website`, address: process.env.MAIL_FROM || process.env.SMTP_USER! },
    to,
    replyTo: { name: oneLine(enquiry.name), address: oneLine(enquiry.email) },
    subject,
    text,
    html,
  });
  return { sent: true as const, to };
}

/** Builds the alert's subject, plain-text and HTML versions. */
export function buildContactAlert(enquiry: EnquiryForAlert, firmName: string) {
  const adminUrl = `${siteUrl()}/admin/messages/${enquiry.id}`;
  const when = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(enquiry.createdAt);
  const name = oneLine(enquiry.name);
  const area = oneLine(enquiry.practiceArea) || "Not specified";
  const firm = { firmName };
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", oneLine(enquiry.email)],
    ["Phone", oneLine(enquiry.phone) || "—"],
    ["Legal matter", area],
    ["Received", when],
  ];

  const text = [
    `New enquiry from the ${firm.firmName} website`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    enquiry.message,
    "",
    `View in admin panel: ${adminUrl}`,
    "Reply to this email to answer the client directly.",
  ].join("\n");

  const html = `<!doctype html>
<html><body style="margin:0;background:#f6f0e3;font-family:Arial,Helvetica,sans-serif;color:#141c2c">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f0e3;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #ebe1cc">
        <tr><td style="background:#0a1628;padding:22px 28px;border-bottom:3px solid #c79a3b">
          <div style="font-family:Georgia,serif;font-size:20px;color:#dcb65c;letter-spacing:2px;text-transform:uppercase">${esc(firm.firmName)}</div>
          <div style="font-size:13px;color:#ffffffb3;margin-top:4px">New website enquiry</div>
        </td></tr>
        <tr><td style="padding:24px 28px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px">
            ${rows
              .map(
                ([k, v]) =>
                  `<tr><td style="padding:7px 0;color:#5b6577;width:120px;vertical-align:top">${esc(k)}</td><td style="padding:7px 0;font-weight:bold">${
                    k === "Email"
                      ? `<a href="mailto:${esc(v)}" style="color:#a67b24">${esc(v)}</a>`
                      : k === "Phone" && v !== "—"
                        ? `<a href="tel:${esc(v.replace(/[^\d+]/g, ""))}" style="color:#a67b24">${esc(v)}</a>`
                        : esc(v)
                  }</td></tr>`,
              )
              .join("")}
          </table>
        </td></tr>
        <tr><td style="padding:8px 28px 24px">
          <div style="font-size:13px;color:#5b6577;margin-bottom:6px">Message</div>
          <div style="background:#fcfaf5;border-left:3px solid #c79a3b;padding:14px 16px;font-size:15px;line-height:1.6;white-space:pre-wrap">${esc(enquiry.message)}</div>
        </td></tr>
        <tr><td style="padding:0 28px 28px">
          <a href="${esc(adminUrl)}" style="display:inline-block;background:#c79a3b;color:#050b16;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:1px;text-transform:uppercase;padding:12px 20px;border-radius:3px">Open in admin panel</a>
          <p style="font-size:12px;color:#5b6577;margin:16px 0 0">Reply to this email to answer ${esc(name)} directly.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const subject = oneLine(`New enquiry: ${name} — ${area}`).slice(0, 180);
  return { subject, text, html };
}
