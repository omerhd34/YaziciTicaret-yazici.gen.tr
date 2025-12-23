import nodemailer from 'nodemailer';

export const createTransporter = () => {
 if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
  return nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: parseInt(process.env.EMAIL_PORT, 10),
   secure: process.env.EMAIL_PORT === '465',
   auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
   },
  });
 }

 if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD &&
  (process.env.EMAIL_USER.includes('@outlook.com') ||
   process.env.EMAIL_USER.includes('@hotmail.com') ||
   process.env.EMAIL_USER.includes('@office365.com'))) {

  const originalPassword = process.env.EMAIL_PASSWORD.trim();
  const cleanPassword = originalPassword.replace(/-/g, '').trim();

  return nodemailer.createTransport({
   host: 'smtp-mail.outlook.com',
   port: 587,
   secure: false,
   requireTLS: true,
   auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: cleanPassword,
   },
   tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
   },
   debug: process.env.NODE_ENV === 'development',
   logger: process.env.NODE_ENV === 'development'
  });
 }

 if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  return nodemailer.createTransport({
   service: 'gmail',
   auth: {
    user: process.env.EMAIL_USER.trim(),
    pass: process.env.EMAIL_PASSWORD.trim(),
   },
  });
 }

 throw new Error('E-posta ayarları eksik. Lütfen .env.local dosyanıza EMAIL_USER ve EMAIL_PASSWORD ekleyin.');
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
 try {
  const transporter = createTransporter();

  const mailOptions = {
   from: process.env.EMAIL_USER,
   to: email,
   subject: 'Şifre Sıfırlama - Yazıcı Ticaret',
   html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>Şifre Sıfırlama - Yazıcı Ticaret</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d3748; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">YAZICI TİCARET</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 50px 40px;">
                      <h2 style="margin: 0 0 25px 0; color: #2d3748; font-size: 24px; font-weight: 600; line-height: 1.3;">Şifre Sıfırlama Talebi</h2>
                      
                      <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">Merhaba,</p>
                      
                      <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:</p>
                      
                      <!-- Button -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 0 0 35px 0;">
                            <a
                              href="${resetUrl}"
                              style="
                                display: inline-block;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: #ffffff;
                                text-decoration: none;
                                padding: 16px 40px;
                                border-radius: 8px;
                                border: 1px solid rgba(255, 255, 255, 0.35);
                                background-color: #667eea;
                                font-weight: 600;
                                font-size: 16px;
                                text-align: center;
                                transition: all 0.3s ease;
                              "
                            >
                              Şifremi Sıfırla
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 15px 0; color: #718096; font-size: 14px; line-height: 1.5;">Veya bu linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
                      
                      <!-- URL Box -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="background-color: #edf2f7; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 30px;">
                            <p style="margin: 0; color: #4299e1; word-break: break-all; font-size: 13px; line-height: 1.5; font-family: 'Courier New', monospace;">${resetUrl}</p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Important Notice -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="border-top: 2px solid #e2e8f0; padding-top: 30px; margin-top: 30px;">
                            <p style="margin: 0; color: #718096; font-size: 13px; line-height: 1.6;">
                              <strong style="color: #e53e3e; display: block; margin-bottom: 8px; font-size: 14px;">⚠️ Önemli:</strong>
                              Bu link <strong style="color: #2d3748;">1 saat</strong> süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #2d3748; padding: 30px; text-align: center;">
                      <p style="margin: 0; color: #a0aec0; font-size: 13px; line-height: 1.5;">
                        © ${new Date().getFullYear()} Yazıcı Ticaret - Tüm hakları saklıdır.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
   text: `
        Şifre Sıfırlama Talebi
        
        Merhaba,
        
        Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
        ${resetUrl}
        
        Önemli: Bu link 1 saat süreyle geçerlidir. Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
        
        © ${new Date().getFullYear()} Yazıcı Ticaret - Tüm hakları saklıdır.
      `,
  };

  const info = await transporter.sendMail(mailOptions);

  return { success: true, messageId: info.messageId };
 } catch (error) {
  throw error;
 }
};
