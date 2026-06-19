import sgMail from '@sendgrid/mail';

// Set API key if provided
const apiKey = process.env.SENDGRID_API_KEY;
const isPlaceholder = !apiKey || apiKey.includes('placeholder') || apiKey === 'SG.your_sendgrid_api_key';

if (!isPlaceholder) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn('WARNING: SendGrid API Key is not configured or is a placeholder. Mail dispatches will be logged to console.');
}

/**
 * Send password reset email to a user
 * @param {string} email - Recipient email
 * @param {string} resetUrl - Password reset URL
 * @param {string} userName - Recipient user name
 */
export const sendPasswordResetEmail = async (email, resetUrl, userName = 'Valued User') => {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'no-reply@homehub.com';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Reset Your Password - HomeHub Homeopathy</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
        body, table, td, a { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
        table, td { mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; width: 100% !important; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        .btn-teal { background-color: #0d9488; color: #ffffff !important; text-decoration: none; padding: 12px 30px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; transition: background-color 0.2s ease; box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15); }
        .btn-teal:hover { background-color: #0f766e; }
      </style>
    </head>
    <body style="background-color: #f8fafc; padding: 40px 10px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.02);">
              <!-- Header Brand Banner -->
              <tr>
                <td align="center" style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 30px 20px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">HomeHub Homeopathy</h1>
                  <p style="color: #ccfbf1; margin: 5px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Security Desk</p>
                </td>
              </tr>
              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 30px; color: #334155; line-height: 1.6; font-size: 15px;">
                  <h2 style="color: #1e293b; font-size: 18px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">Hello ${userName},</h2>
                  <p style="margin-bottom: 24px;">We received a request to reset the password for your HomeHub Homeopathy account. Click the button below to establish a new secure credential:</p>
                  
                  <div style="text-align: center; margin-bottom: 30px; margin-top: 30px;">
                    <a href="${resetUrl}" target="_blank" class="btn-teal">Reset Password</a>
                  </div>

                  <p style="margin-bottom: 16px; font-size: 13px; color: #64748b;">
                    <strong>Security Reminder:</strong> This password reset link is valid for <strong>10 minutes</strong>. If you did not initiate this request, you can safely ignore this email. Your current password will remain unchanged.
                  </p>
                  <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
                  <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin-bottom: 0;">
                    If the button above does not work, copy and paste this URL into your web browser:<br>
                    <a href="${resetUrl}" style="color: #0d9488; word-break: break-all;">${resetUrl}</a>
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #f8fafc; padding: 24px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px;">
                  <p style="margin: 0 0 4px 0;">HomeHub Clinic Booking & Management Portal</p>
                  <p style="margin: 0;">&copy; 2026 HomeHub Homeopathy. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const msg = {
    to: email,
    from: fromEmail,
    subject: 'Reset Your Password - HomeHub Homeopathy',
    html: htmlContent,
  };

  if (isPlaceholder) {
    console.log('\n=================== MOCK SENDGRID DISPATCH ===================');
    console.log(`To: ${email}`);
    console.log(`From: ${fromEmail}`);
    console.log(`Subject: ${msg.subject}`);
    console.log(`Reset URL Link: ${resetUrl}`);
    console.log('==============================================================\n');
    return { success: true, mock: true };
  }

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid dispatch error details:', error.response ? error.response.body : error);
    throw new Error('Failed to send transactional email via SendGrid');
  }
};
