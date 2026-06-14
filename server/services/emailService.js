/**
 * Email Service — Nodemailer integration
 * Sends transactional emails (password reset, appointment confirmations, etc.)
 */
import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use environment config or fallback to ethereal for dev
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Development: log emails to console
  return {
    sendMail: async (options) => {
      console.log('📧 [DEV EMAIL] Would send email:');
      console.log(`   To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Text: ${options.text?.substring(0, 100)}...`);
      return { messageId: 'dev-mode-' + Date.now() };
    },
  };
};

/**
 * Send an email.
 * @param {object} options - { to, subject, text, html }
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.FROM_EMAIL || '"HomeHub Homeopathy" <noreply@homehub.com>',
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

/**
 * Send password reset email.
 */
export const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #14b8a6; margin: 0;">HomeHub Homeopathy</h1>
        <p style="color: #94a3b8; margin-top: 4px;">Password Reset Request</p>
      </div>
      <p>You requested a password reset. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background: #14b8a6; color: #0f172a; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #94a3b8; font-size: 14px;">This link will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      <hr style="border: 1px solid #1e293b; margin: 24px 0;" />
      <p style="color: #64748b; font-size: 12px; text-align: center;">© HomeHub Homeopathy. Safe • Natural • Root-Cause Cure</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Password Reset — HomeHub Homeopathy',
    text: `You requested a password reset. Visit: ${resetUrl}\nThis link expires in 10 minutes.`,
    html,
  });
};

/**
 * Send appointment confirmation email.
 */
export const sendAppointmentConfirmation = async (email, appointmentDetails) => {
  const { patientName, doctorName, date, time, status } = appointmentDetails;

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 40px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #14b8a6; margin: 0;">HomeHub Homeopathy</h1>
        <p style="color: #94a3b8; margin-top: 4px;">Appointment ${status === 'confirmed' ? 'Confirmed' : 'Update'}</p>
      </div>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been <strong style="color: #14b8a6;">${status}</strong>.</p>
      <div style="background: #1e293b; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Doctor:</strong> ${doctorName}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
      </div>
      <hr style="border: 1px solid #1e293b; margin: 24px 0;" />
      <p style="color: #64748b; font-size: 12px; text-align: center;">© HomeHub Homeopathy. Safe • Natural • Root-Cause Cure</p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Appointment ${status === 'confirmed' ? 'Confirmed' : 'Update'} — HomeHub Homeopathy`,
    text: `Dear ${patientName}, your appointment with ${doctorName} on ${date} at ${time} has been ${status}.`,
    html,
  });
};
