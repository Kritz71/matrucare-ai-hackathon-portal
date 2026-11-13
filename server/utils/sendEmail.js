
import nodemailer from 'nodemailer';

const FROM = '"MatruCare AI" <matrucareai@gmail.com>';
let transporter;

function isEmailConfigured() {
  return (
    process.env.EMAIL_USER === 'matrucareai@gmail.com' &&
    Boolean(process.env.EMAIL_PASS)
  );
}

function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error(
      'Authorized Gmail SMTP credentials are required for email delivery.'
    );
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}

export async function sendOtpEmail(toEmail, otp) {
  // Development-only fallback: print OTP in backend terminal.
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured.');
    }

    console.log('\n================================');
    console.log('[DEVELOPMENT MODE] EMAIL NOT SENT');
    console.log(`Verification OTP for ${toEmail}: ${otp}`);
    console.log('This OTP expires in 10 minutes.');
    console.log('================================\n');
    return;
  }

  await getTransporter().sendMail({
    from: FROM,
    to: toEmail,
    subject: 'Your MatruCare AI verification code',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#172033">
        <h2>Verify your email</h2>
        <p>Use this one-time verification code to continue:</p>
        <div style="font-size:34px;font-weight:700;letter-spacing:10px;background:#f1f4fa;padding:20px;text-align:center;border-radius:12px">${otp}</div>
        <p>This code expires in <b>10 minutes</b> and can only be used once.</p>
        <p>If you did not request this code, you can ignore this email.</p>
        <p>MatruCare AI Team</p>
      </div>
    `,
  });
}

export async function sendConfirmationEmail(toEmail, data) {
  const members = data.teamMembers?.length
    ? data.teamMembers
        .map(
          (m) =>
            `<li>${escapeHtml(m.memberName)} — ${escapeHtml(m.memberEmail)}</li>`
        )
        .join('')
    : '<li>Solo participant</li>';

  // Development-only fallback when company SMTP credentials are unavailable.
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured.');
    }

    console.log(
      `[DEVELOPMENT MODE] Registration confirmation email not sent to ${toEmail}.`
    );
    return;
  }

  await getTransporter().sendMail({
    from: FROM,
    to: toEmail,
    subject: 'Hackathon registration confirmed — MatruCare AI',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#172033">
        <h2>Registration received!</h2>
        <p>Your registration for <b>MatruCare AI National Hackathon 2026</b> has been received.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:9px;border-bottom:1px solid #ddd">Domain / Track</td><td>${escapeHtml(data.domain)}</td></tr>
          <tr><td style="padding:9px;border-bottom:1px solid #ddd">Project</td><td>${escapeHtml(data.projectName)}</td></tr>
          <tr><td style="padding:9px;border-bottom:1px solid #ddd">Team size</td><td>${data.teamSize}</td></tr>
        </table>
        <h3>Team members</h3>
        <ul>${members}</ul>
        <p>Keep this email for your records.</p>
        <p>MatruCare AI Team</p>
      </div>
    `,
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (c) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[c]
  );
}

