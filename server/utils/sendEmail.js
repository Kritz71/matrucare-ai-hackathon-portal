
import nodemailer from 'nodemailer';

let transporter;

const getSender = () =>
  process.env.EMAIL_FROM ||
  `"MatruCare AI" <${process.env.EMAIL_USER}>`;

function isEmailConfigured() {
  return Boolean(
    process.env.EMAIL_USER && process.env.EMAIL_PASS
  );
}

function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error('Gmail SMTP credentials are not configured.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });
  }

  return transporter;
}

async function sendEmail(options, developmentOtp = null) {
  try {
    await getTransporter().sendMail(options);
    console.log(`Email successfully sent to ${options.to}`);
  } catch (error) {
    console.error('Gmail SMTP error:', {
      message: error.message,
      code: error.code,
      command: error.command,
    });

    if (process.env.NODE_ENV === 'production') {
      throw error;
    }

    if (developmentOtp) {
      console.log('\n================================');
      console.log('[DEVELOPMENT MODE] OTP');
      console.log(`Email: ${options.to}`);
      console.log(`OTP: ${developmentOtp}`);
      console.log('Expires in 10 minutes.');
      console.log('================================\n');
    } else {
      console.log(
        `[DEVELOPMENT MODE] Confirmation email not sent to ${options.to}.`
      );
    }
  }
}

export async function sendOtpEmail(toEmail, otp) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured.');
    }

    console.log('\n================================');
    console.log('[DEVELOPMENT MODE] EMAIL NOT CONFIGURED');
    console.log(`Email: ${toEmail}`);
    console.log(`OTP: ${otp}`);
    console.log('Expires in 10 minutes.');
    console.log('================================\n');

    return;
  }

  await sendEmail(
    {
      from: getSender(),
      to: toEmail,
      subject: 'Your MatruCare AI verification code',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:32px;color:#172033">
          <h2>Verify your email</h2>
          <p>Use this one-time verification code to continue:</p>
          <div style="font-size:34px;font-weight:700;letter-spacing:10px;background:#f1f4fa;padding:20px;text-align:center;border-radius:12px">
            ${escapeHtml(otp)}
          </div>
          <p>This code expires in <b>10 minutes</b> and can only be used once.</p>
          <p>If you did not request this code, you can ignore this email.</p>
          <p>MatruCare AI Team</p>
        </div>
      `,
    },
    otp
  );
}

export async function sendConfirmationEmail(toEmail, data) {
  const members = data.teamMembers?.length
    ? data.teamMembers
        .map(
          (member) =>
            `<li>${escapeHtml(member.memberName)} — ${escapeHtml(member.memberEmail)}</li>`
        )
        .join('')
    : '<li>Solo participant</li>';

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Email service is not configured.');
    }

    console.log(
      `[DEVELOPMENT MODE] Registration confirmation email not sent to ${toEmail}.`
    );

    return;
  }

  await sendEmail({
    from: getSender(),
    to: toEmail,
    subject: 'Hackathon registration confirmed — MatruCare AI',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#172033">
        <h2>Registration received!</h2>
        <p>Your registration for <b>MatruCare AI National Hackathon 2026</b> has been received.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:9px;border-bottom:1px solid #ddd">Domain / Track</td>
            <td>${escapeHtml(data.domain)}</td>
          </tr>
          <tr>
            <td style="padding:9px;border-bottom:1px solid #ddd">Project</td>
            <td>${escapeHtml(data.projectName)}</td>
          </tr>
          <tr>
            <td style="padding:9px;border-bottom:1px solid #ddd">Team size</td>
            <td>${escapeHtml(data.teamSize)}</td>
          </tr>
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
  return String(value).replace(/[&<>"']/g, (character) =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[character]
  );
}
