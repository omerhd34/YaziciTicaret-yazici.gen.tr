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
   from: `Yazıcı Ticaret <${process.env.EMAIL_USER}>`,
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
        <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
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

export const sendProductRequestEmail = async (requestData) => {
 try {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const mailOptions = {
   from: `Yazıcı Ticaret <${process.env.EMAIL_USER}>`,
   to: adminEmail,
   subject: `Yeni Ürün İsteği - ${requestData.productName}`,
   html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Yeni Ürün İsteği - Yazıcı Ticaret</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
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
                      <h2 style="margin: 0 0 25px 0; color: #2d3748; font-size: 24px; font-weight: 600; line-height: 1.3;">Yeni Ürün İsteği</h2>
                      
                      <div style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px; font-weight: 600;">İstek Detayları</h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">Ürün Adı:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px; font-weight: 600;">${requestData.productName}</p>
                            </td>
                          </tr>
                          ${requestData.brand ? `
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">Marka:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px;">${requestData.brand}</p>
                            </td>
                          </tr>
                          ` : ''}
                          ${requestData.model ? `
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">Model:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px;">${requestData.model}</p>
                            </td>
                          </tr>
                          ` : ''}
                          ${requestData.productDescription ? `
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">Açıklama:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px; white-space: pre-wrap;">${requestData.productDescription}</p>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>

                      <div style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px; font-weight: 600;">İletişim Bilgileri</h3>
                        
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">İsim:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px;">${requestData.name}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                              <strong style="color: #4a5568; font-size: 14px;">E-posta:</strong>
                              <p style="margin: 5px 0 0 0; color: #4299e1; font-size: 16px;"><a href="mailto:${requestData.email}" style="color: #4299e1; text-decoration: none;">${requestData.email}</a></p>
                            </td>
                          </tr>
                          ${requestData.phone ? `
                          <tr>
                            <td style="padding: 8px 0;">
                              <strong style="color: #4a5568; font-size: 14px;">Telefon:</strong>
                              <p style="margin: 5px 0 0 0; color: #2d3748; font-size: 16px;"><a href="tel:${requestData.phone}" style="color: #4299e1; text-decoration: none;">${requestData.phone}</a></p>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
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
        Yeni Ürün İsteği
        
        Ürün Adı: ${requestData.productName}
        ${requestData.brand ? `Marka: ${requestData.brand}\n` : ''}
        ${requestData.model ? `Model: ${requestData.model}\n` : ''}
        ${requestData.productDescription ? `Açıklama: ${requestData.productDescription}\n` : ''}
        
        İletişim Bilgileri:
        İsim: ${requestData.name}
        E-posta: ${requestData.email}
        ${requestData.phone ? `Telefon: ${requestData.phone}\n` : ''}
      `,
  };

  const info = await transporter.sendMail(mailOptions);

  return { success: true, messageId: info.messageId };
 } catch (error) {
  throw error;
 }
};

// Müşteriye ürün isteği onay e-postası gönder
export const sendProductRequestApprovedEmail = async (requestData) => {
 try {
  const transporter = createTransporter();

  if (!transporter) {
   return { success: false, error: 'E-posta ayarları eksik' };
  }

  const mailOptions = {
   from: `Yazıcı Ticaret <${process.env.EMAIL_USER}>`,
   to: requestData.email,
   subject: `✅ Ürün İsteğiniz Onaylandı - ${requestData.productName}`,
   html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ürün İsteğiniz Onaylandı - Yazıcı Ticaret</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: ui-sans-serif, system-ui, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d3748; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">YAZICI TİCARET</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 50px 40px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px; color: #ffffff;">✓</span>
                        </div>
                        <h2 style="margin: 0 0 15px 0; color: #10b981; font-size: 28px; font-weight: 700;">İsteğiniz Onaylandı!</h2>
                      </div>
                      
                      <div style="background-color: #ffffff; border: 2px solid #d1fae5; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
                        <p style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Merhaba <strong>${requestData.name}</strong>,
                        </p>
                        <p style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          <strong>${requestData.productName}</strong> ürün isteğiniz onaylanmıştır. Yakın zamanda ürün şubelerimize gelecektir ve stok durumu hakkında size e-posta veya telefon ile bilgi verilecektir.
                        </p>
                        ${requestData.brand || requestData.model ? `
                        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                          <p style="margin: 0; color: #2d3748; font-size: 14px;">
                            <strong>Ürün Detayları:</strong><br>
                            ${requestData.brand ? `Marka: ${requestData.brand}<br>` : ''}
                            ${requestData.model ? `Model: ${requestData.model}` : ''}
                          </p>
                        </div>
                        ` : ''}
                        <p style="margin: 20px 0 0 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Ürün stoklarımıza geldiğinde size haber vereceğiz. Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                      </div>
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
        İsteğiniz Onaylandı!
        
        Merhaba ${requestData.name},
        
        ${requestData.productName} ürün isteğiniz onaylanmıştır. Yakın zamanda ürün şubelerimize gelecektir ve stok durumu hakkında size e-posta veya telefon ile bilgi verilecektir.
        
        ${requestData.brand || requestData.model ? `Ürün Detayları:\n${requestData.brand ? `Marka: ${requestData.brand}\n` : ''}${requestData.model ? `Model: ${requestData.model}\n` : ''}` : ''}
        Ürün stoklarımıza geldiğinde size haber vereceğiz. Sorularınız için bizimle iletişime geçebilirsiniz.
        
        © ${new Date().getFullYear()} Yazıcı Ticaret - Tüm hakları saklıdır.
      `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
 } catch (error) {
  throw error;
 }
};

// Müşteriye ürün isteği red e-postası gönder
export const sendProductRequestRejectedEmail = async (requestData) => {
 try {
  const transporter = createTransporter();

  if (!transporter) {
   return { success: false, error: 'E-posta ayarları eksik' };
  }

  const mailOptions = {
   from: `Yazıcı Ticaret <${process.env.EMAIL_USER}>`,
   to: requestData.email,
   subject: `❌ Ürün İsteğiniz Reddedildi - ${requestData.productName}`,
   html: `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ürün İsteğiniz Reddedildi - Yazıcı Ticaret</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: ui-sans-serif, system-ui, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d3748; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">YAZICI TİCARET</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="background-color: #f7fafc; padding: 50px 40px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <div style="width: 80px; height: 80px; background-color: #ef4444; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                          <span style="font-size: 40px; color: #ffffff;">✕</span>
                        </div>
                        <h2 style="margin: 0 0 15px 0; color: #ef4444; font-size: 28px; font-weight: 700;">İsteğiniz Reddedildi</h2>
                      </div>
                      
                      <div style="background-color: #ffffff; border: 2px solid #fee2e2; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
                        <p style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Merhaba <strong>${requestData.name}</strong>,
                        </p>
                        <p style="margin: 0 0 20px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Maalesef <strong>${requestData.productName}</strong> ürün isteğiniz reddedilmiştir. Bu ürün şu anda tedarik edilememektedir veya stokta bulunmamaktadır.
                        </p>
                        ${requestData.brand || requestData.model ? `
                        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                          <p style="margin: 0; color: #2d3748; font-size: 14px;">
                            <strong>Ürün Detayları:</strong><br>
                            ${requestData.brand ? `Marka: ${requestData.brand}<br>` : ''}
                            ${requestData.model ? `Model: ${requestData.model}` : ''}
                          </p>
                        </div>
                        ` : ''}
                        <p style="margin: 20px 0 0 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                          Farklı bir ürün arayışındaysanız, kataloğumuzu inceleyebilir veya yeni bir ürün isteğinde bulunabilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                      </div>
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
        İsteğiniz Reddedildi
        
        Merhaba ${requestData.name},
        
        Maalesef ${requestData.productName} ürün isteğiniz reddedilmiştir. Bu ürün şu anda tedarik edilememektedir veya stokta bulunmamaktadır.
        
        ${requestData.brand || requestData.model ? `Ürün Detayları:\n${requestData.brand ? `Marka: ${requestData.brand}\n` : ''}${requestData.model ? `Model: ${requestData.model}\n` : ''}` : ''}
        Farklı bir ürün arayışındaysanız, kataloğumuzu inceleyebilir veya yeni bir ürün isteğinde bulunabilirsiniz. Sorularınız için bizimle iletişime geçebilirsiniz.
        
        © ${new Date().getFullYear()} Yazıcı Ticaret - Tüm hakları saklıdır.
      `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
 } catch (error) {
  throw error;
 }
};