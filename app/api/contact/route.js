import { NextResponse } from 'next/server';
import { createTransporter } from '@/lib/email';
import dbConnect from '@/lib/dbConnect';
import Contact from '@/models/Contact';

export async function POST(request) {
 try {
  const { name, email, phone, subject, message } = await request.json();

  if (!name || !email || !subject || !message) {
   return NextResponse.json(
    { success: false, message: 'Lütfen tüm zorunlu alanları doldurun.' },
    { status: 400 }
   );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
   return NextResponse.json(
    { success: false, message: 'Geçerli bir e-posta adresi giriniz.' },
    { status: 400 }
   );
  }

  const subjectMap = {
   siparis: 'Sipariş Sorunu',
   iade: 'İade & Değişim',
   urun: 'Ürün Sorusu',
   kargo: 'Kargo Sorunu',
   odeme: 'Ödeme Sorunu',
   diger: 'Diğer'
  };

  const subjectText = subjectMap[subject] || subject;

  await dbConnect();
  const contact = await Contact.create({
   name,
   email: email.toLowerCase(),
   phone: phone || '',
   subject: subjectText,
   message,
   read: false,
  });
  const contactId = contact._id.toString();

  const adminEmail = process.env.EMAIL_USER;

  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const adminMessageUrl = contactId
   ? `${baseUrl}/admin/mesajlar?id=${contactId}`
   : `${baseUrl}/admin/mesajlar`;

  try {
   const transporter = createTransporter();

   if (!transporter) {
    return NextResponse.json(
     { success: true, message: 'Mesajınız kaydedildi. En kısa sürede size dönüş yapacağız.' },
     { status: 200 }
    );
   }

   const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    replyTo: email,
    subject: `İletişim Formu: ${subjectText}`,
    html: `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>İletişim Formu Mesajı - Yazıcı Ticaret</title>
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
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 500;">İletişim Formu Mesajı</p>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="background-color: #f7fafc; padding: 50px 40px;">
                    <h2 style="margin: 0 0 25px 0; color: #2d3748; font-size: 24px; font-weight: 600; line-height: 1.3;">Yeni Mesaj Alındı</h2>
                    
                    <p style="margin: 0 0 35px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">Aşağıda iletişim formundan gelen mesaj detaylarını bulabilirsiniz.</p>
                    
                    <!-- İletişim Bilgileri -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
                                <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">KONU</div>
                                <div style="color: #2d3748; font-size: 18px; font-weight: 700;">${subjectText}</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
                                <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">GÖNDEREN</div>
                                <div style="color: #2d3748; font-size: 16px; font-weight: 600;">${name}</div>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
                                <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">E-POSTA</div>
                                <a href="mailto:${email}" style="color: #4299e1; text-decoration: none; font-size: 16px; font-weight: 600; word-break: break-all;">${email}</a>
                              </td>
                            </tr>
                            ${phone ? `
                            <tr>
                              <td style="padding: 20px 0 0 0;">
                                <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">TELEFON</div>
                                <a href="tel:${phone}" style="color: #4299e1; text-decoration: none; font-size: 16px; font-weight: 600;">${phone}</a>
                              </td>
                            </tr>
                            ` : ''}
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Mesaj İçeriği -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                      <tr>
                        <td style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px;">
                          <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px;">MESAJ</div>
                          <div style="color: #2d3748; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-wrap: break-word; overflow-wrap: break-word;">${message}</div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Buton -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 35px;">
                      <tr>
                        <td align="center">
                          <a
                            href="${adminMessageUrl}"
                            style="
                              display: inline-block;
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: #ffffff;
                              text-decoration: none;
                              padding: 16px 40px;
                              border-radius: 8px;
                              border: 1px solid rgba(255, 255, 255, 0.35);
                              font-weight: 600;
                              font-size: 16px;
                              text-align: center;
                            "
                          >
                            Mesajı Görüntüle →
                          </a>
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
      İletişim Formu Mesajı
      
      Konu: ${subjectText}
      Gönderen: ${name}
      E-posta: ${email}
      ${phone ? `Telefon: ${phone}` : ''}
      
      Mesaj:
      ${message}
      
      © ${new Date().getFullYear()} Yazıcı Ticaret
    `,
   };

   await transporter.sendMail(mailOptions);

   return NextResponse.json(
    { success: true, message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.' },
    { status: 200 }
   );
  } catch (emailError) {
   return NextResponse.json(
    { success: true, message: 'Mesajınız kaydedildi. En kısa sürede size dönüş yapacağız.' },
    { status: 200 }
   );
  }
 } catch (error) {
  return NextResponse.json(
   { success: false, message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
   { status: 500 }
  );
 }
}

