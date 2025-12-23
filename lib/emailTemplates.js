// Ana e-posta wrapper'ı
export const emailWrapper = (content, title = "Yazıcı Ticaret") => {
 return `
  <!DOCTYPE html>
  <html lang="tr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #2d3748; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #2d3748; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);">
              ${content}
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
 `;
};

// Header bölümü
export const emailHeader = ({ title, subtitle, orderId = null }) => {
 return `
  <tr>
    <td style="background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); padding: 40px 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">YAZICI TİCARET</h1>
      <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px; font-weight: 500;">${title}</p>
      ${orderId ? `<p style="margin: 8px 0 0 0; color: #ffffff; font-size: 14px; font-weight: 400;">Sipariş No: ${orderId}</p>` : ""}
    </td>
  </tr>
 `;
};

// Content wrapper
export const emailContent = (content) => {
 return `
  <tr>
    <td style="background-color: #f7fafc; padding: 50px 40px;">
      ${content}
    </td>
  </tr>
 `;
};

// Footer
export const emailFooter = () => {
 return `
  <tr>
    <td style="background-color: #2d3748; padding: 30px; text-align: center;">
      <p style="margin: 0; color: #a0aec0; font-size: 13px; line-height: 1.5;">
        © ${new Date().getFullYear()} Yazıcı Ticaret - Tüm hakları saklıdır.
      </p>
    </td>
  </tr>
 `;
};

// Başlık
export const emailTitle = (text) => {
 return `<h2 style="margin: 0 0 25px 0; color: #2d3748; font-size: 24px; font-weight: 600; line-height: 1.3;">${text}</h2>`;
};

// Paragraf
export const emailParagraph = (text, marginBottom = "20px") => {
 return `<p style="margin: 0 0 ${marginBottom} 0; color: #4a5568; font-size: 16px; line-height: 1.6;">${text}</p>`;
};

// Info box (beyaz arka plan, border)
export const emailInfoBox = (content, marginBottom = "30px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
    <tr>
      <td style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px;">
        ${content}
      </td>
    </tr>
  </table>
 `;
};

// Label + Value çifti
export const emailLabelValue = (label, value, valueColor = "#2d3748", valueSize = "16px", valueWeight = "600") => {
 return `
  <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">${label}</div>
  <div style="color: ${valueColor}; font-size: ${valueSize}; font-weight: ${valueWeight};">${value}</div>
 `;
};

// İki sütunlu label-value (üst-alt)
export const emailLabelValuePair = (label1, value1, label2, value2, value2Color = "#667eea", value2Size = "24px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        ${emailLabelValue(label1, value1)}
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 0 0 0;">
        ${emailLabelValue(label2, value2, value2Color, value2Size, "900")}
      </td>
    </tr>
  </table>
 `;
};

// Durum güncelleme kutusu
export const emailStatusUpdate = (oldStatus, newStatus) => {
 return emailInfoBox(`
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    ${oldStatus ? `
    <tr>
      <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        ${emailLabelValue("ÖNCEKİ DURUM", oldStatus, "#9ca3af")}
      </td>
    </tr>
    ` : ""}
    <tr>
      <td style="padding: ${oldStatus ? '20px 0 0 0' : '0 0 0 0'};">
        ${emailLabelValue("YENİ DURUM", newStatus, "#667eea", "24px", "900")}
      </td>
    </tr>
  </table>
 `);
};

// Button
export const emailButton = (text, href, marginBottom = "35px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
    <tr>
      <td align="center" style="padding: 0;">
        <a
          href="${href}"
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
            transition: all 0.3s ease;
          "
        >
          ${text} →
        </a>
      </td>
    </tr>
  </table>
 `;
};

// Özel renkli info box (başarı, uyarı, hata vb.)
export const emailColoredBox = (content, bgColor, borderColor, textColor, marginBottom = "30px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
    <tr>
      <td style="background-color: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; padding: 30px;">
        <div style="color: ${textColor}; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word;">${content}</div>
      </td>
    </tr>
  </table>
 `;
};

// Label ile renkli box
export const emailColoredBoxWithLabel = (label, content, bgColor, borderColor, textColor, marginBottom = "30px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: ${marginBottom};">
    <tr>
      <td style="background-color: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 8px; padding: 30px;">
        <div style="color: ${textColor}; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">${label}</div>
        <div style="color: ${textColor}; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word;">${content}</div>
      </td>
    </tr>
  </table>
 `;
};

// Doğrulama kodu kutusu
export const emailVerificationCode = (code) => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 35px;">
    <tr>
      <td align="center" style="padding: 0;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background-color: #edf2f7; border: 2px solid #667eea; border-radius: 8px; padding: 30px 20px;">
          <tr>
            <td align="center">
              <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Doğrulama Kodu</div>
              <div style="font-size: 36px; font-weight: 900; color: #667eea; letter-spacing: 6px; font-family: 'Courier New', monospace;">${code}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
 `;
};

// Bölüm başlığı
export const emailSectionTitle = (text, marginBottom = "20px") => {
 return `<h3 style="margin: 0 0 ${marginBottom} 0; color: #2d3748; font-size: 20px; font-weight: 600; line-height: 1.3;">${text}</h3>`;
};

// Müşteri bilgileri kutusu
export const emailCustomerInfo = (userName, userEmail, userPhone) => {
 return emailInfoBox(`
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr>
      <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
        ${emailLabelValue("MÜŞTERİ", userName || "-")}
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
        <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">E-POSTA</div>
        <a href="mailto:${userEmail}" style="color: #4299e1; text-decoration: none; font-size: 16px; font-weight: 600; word-break: break-all;">${userEmail || "-"}</a>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 0 0 0;">
        <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">TELEFON</div>
        <a href="tel:${userPhone}" style="color: #4299e1; text-decoration: none; font-size: 16px; font-weight: 600;">${userPhone || "-"}</a>
      </td>
    </tr>
  </table>
 `);
};

// Ürün listesi
export const emailItemsList = (items) => {
 if (!Array.isArray(items) || items.length === 0) {
  return emailInfoBox(`
   <div style="color: #718096; font-size: 14px; text-align: center;">Ürün bulunamadı.</div>
  `);
 }

 const itemsHtml = items.map((it) => {
  const name = String(it.name || "-").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const qty = Number(it.quantity || 1) || 1;
  const price = Number(it.price || 0);
  const lineTotal = price * qty;
  return `
   <tr>
     <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
       <div style="color: #2d3748; font-size: 16px; font-weight: 600; line-height: 1.4; margin-bottom: 8px;">${name}</div>
       <div style="color: #718096; font-size: 14px; line-height: 1.5;">
         Adet: <strong style="color: #2d3748;">${qty}</strong> • Birim: ${price.toFixed(2)} ₺ • Toplam: <strong style="color: #667eea;">${lineTotal.toFixed(2)} ₺</strong>
       </div>
     </td>
   </tr>
  `;
 }).join("");

 return emailInfoBox(`
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    ${itemsHtml}
  </table>
 `);
};

// Uyarı/önemli bilgi kutusu
export const emailNotice = (content, marginTop = "30px") => {
 return `
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: ${marginTop};">
    <tr>
      <td style="border-top: 2px solid #e2e8f0; padding-top: 30px;">
        <div style="color: #718096; font-size: 13px; line-height: 1.6;">${content}</div>
      </td>
    </tr>
  </table>
 `;
};

// Adres kutusu
export const emailAddressBox = (addressSummary) => {
 if (!addressSummary) return "";
 return `
  ${emailSectionTitle("Adres")}
  ${emailInfoBox(`<div style="color: #2d3748; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word;">${String(addressSummary).replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`)}
 `;
};

// Sipariş durumu güncelleme e-postası şablonu
export const orderStatusUpdateTemplate = ({
 userName,
 orderId,
 oldStatus,
 newStatus,
 statusMessage,
 orderDate,
 total,
 baseUrl,
}) => {
 const formattedDate = orderDate ? new Date(orderDate).toLocaleString("tr-TR") : new Date().toLocaleString("tr-TR");

 const content = `
  ${emailTitle("Sipariş Durumunuz Güncellendi.")}
  ${emailParagraph(`Merhaba ${userName || "Müşterimiz"},`)}
  ${emailParagraph(statusMessage, "35px")}
  ${emailStatusUpdate(oldStatus, newStatus)}
  ${emailInfoBox(emailLabelValuePair("SİPARİŞ TARİHİ", formattedDate, "TOPLAM TUTAR", `${Number(total || 0).toFixed(2)} ₺`))}
  ${emailButton("Siparişlerimi Görüntüle", `${baseUrl}/hesabim?tab=siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Sipariş Durumu Güncellendi.", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Sipariş Durumu Güncellendi - Yazıcı Ticaret"
 );
};

// Email doğrulama şablonu
export const emailVerificationTemplate = ({ userName, verificationCode, verificationLink }) => {
 const content = `
  ${emailTitle("Hesabınızı Aktifleştirin")}
  ${emailParagraph(`Merhaba ${userName || "Kullanıcı"},`)}
  ${emailParagraph("Yazıcı Ticaret'e hoş geldiniz! Hesabınızı aktifleştirmek için aşağıdaki doğrulama kodunu kullanabilir veya doğrudan linke tıklayabilirsiniz.", "35px")}
  ${emailVerificationCode(verificationCode)}
  ${emailButton("Email'i Doğrula", verificationLink, "35px")}
  ${emailNotice(`
   <strong style="color: #e53e3e; display: block; margin-bottom: 8px; font-size: 14px;">⚠️ Önemli:</strong>
   Bu kod <strong style="color: #2d3748;">1 saat</strong> süreyle geçerlidir. Eğer bu işlemi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.
  `)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Email Doğrulama" })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Email Doğrulama - Yazıcı Ticaret"
 );
};

// Admin yeni sipariş şablonu
export const adminNewOrderTemplate = ({
 orderId,
 userName,
 userEmail,
 userPhone,
 total,
 paymentMethod,
 addressSummary,
 items,
 baseUrl,
}) => {
 const content = `
  ${emailTitle("Sipariş Özeti")}
  ${emailInfoBox(`
   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
     <tr>
       <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
         ${emailLabelValue("ÖDEME YÖNTEMİ", paymentMethod || "-", "#2d3748", "18px", "700")}
       </td>
     </tr>
     <tr>
       <td style="padding: 20px 0 0 0;">
         ${emailLabelValue("TOPLAM TUTAR", `${Number(total || 0).toFixed(2)} ₺`, "#667eea", "28px", "900")}
       </td>
     </tr>
   </table>
  `)}
  ${emailSectionTitle("Müşteri Bilgileri")}
  ${emailCustomerInfo(userName, userEmail, userPhone)}
  ${emailAddressBox(addressSummary)}
  ${emailSectionTitle("Ürünler")}
  ${emailItemsList(items)}
  ${emailButton("Admin Paneline Git", `${baseUrl}/admin/son-siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Yeni Sipariş Alındı.", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Yeni Sipariş - Yazıcı Ticaret"
 );
};

// Müşteri sipariş onay şablonu
export const userOrderConfirmationTemplate = ({
 userName,
 orderId,
 orderDate,
 total,
 paymentMethod,
 addressSummary,
 items,
 baseUrl,
}) => {
 const formattedDate = orderDate ? new Date(orderDate).toLocaleString("tr-TR") : new Date().toLocaleString("tr-TR");

 const content = `
  ${emailTitle("Siparişiniz Başarıyla Alındı!")}
  ${emailParagraph(`Merhaba ${userName || "Müşterimiz"},`)}
  ${emailParagraph("Siparişiniz başarıyla alınmıştır. Siparişiniz hazırlandığında size bilgi vereceğiz.", "35px")}
  ${emailInfoBox(`
   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
     <tr>
       <td style="padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
         ${emailLabelValue("SİPARİŞ TARİHİ", formattedDate)}
       </td>
     </tr>
     <tr>
       <td style="padding: 20px 0; border-bottom: 1px solid #e2e8f0;">
         ${emailLabelValue("ÖDEME YÖNTEMİ", paymentMethod || "-")}
       </td>
     </tr>
     <tr>
       <td style="padding: 20px 0 0 0;">
         ${emailLabelValue("TOPLAM TUTAR", `${Number(total || 0).toFixed(2)} ₺`, "#667eea", "28px", "900")}
       </td>
     </tr>
   </table>
  `)}
  ${addressSummary ? `${emailSectionTitle("Teslimat Adresi")}${emailAddressBox(addressSummary)}` : ""}
  ${emailSectionTitle("Sipariş Detayları")}
  ${emailItemsList(items)}
  ${emailButton("Siparişlerimi Görüntüle", `${baseUrl}/hesabim?tab=siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Siparişiniz Alındı.", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Sipariş Onayı - Yazıcı Ticaret"
 );
};

// Admin sipariş iptal şablonu
export const adminOrderCancelledTemplate = ({
 orderId,
 userName,
 userEmail,
 userPhone,
 total,
 orderDate,
 addressSummary,
 items,
 baseUrl,
}) => {
 const formattedDate = orderDate ? new Date(orderDate).toLocaleString("tr-TR") : new Date().toLocaleString("tr-TR");

 const content = `
  ${emailTitle("Sipariş İptal Edildi")}
  ${emailParagraph("Müşteri tarafından sipariş iptal edilmiştir.", "35px")}
  ${emailInfoBox(emailLabelValuePair("SİPARİŞ TARİHİ", formattedDate, "TOPLAM TUTAR", `${Number(total || 0).toFixed(2)} ₺`, "#e53e3e", "28px"))}
  ${emailSectionTitle("Müşteri Bilgileri")}
  ${emailCustomerInfo(userName, userEmail, userPhone)}
  ${emailAddressBox(addressSummary)}
  ${emailSectionTitle("Ürünler")}
  ${emailItemsList(items)}
  ${emailButton("Admin Paneline Git", `${baseUrl}/admin/son-siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Sipariş İptal Edildi", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Sipariş İptal Edildi - Yazıcı Ticaret"
 );
};

// Admin iade talebi şablonu
export const adminReturnRequestTemplate = ({
 orderId,
 userName,
 userEmail,
 userPhone,
 total,
 deliveredAt,
 note,
 baseUrl,
}) => {
 const deliveredText = deliveredAt ? new Date(deliveredAt).toLocaleString("tr-TR") : "-";
 const safeNote = String(note || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

 const content = `
  ${emailTitle("İade Talebi Detayları")}
  ${emailSectionTitle("Müşteri Bilgileri")}
  ${emailCustomerInfo(userName, userEmail, userPhone)}
  ${emailInfoBox(emailLabelValuePair("TESLİM TARİHİ", deliveredText, "SİPARİŞ TUTARI", `${Number(total || 0).toFixed(2)} ₺`))}
  ${emailSectionTitle("İade Nedeni")}
  ${emailColoredBoxWithLabel("MÜŞTERİNİN BELİRTTİĞİ NEDEN", safeNote, "#fff7ed", "#fed7aa", "#9a3412", "35px")}
  ${emailButton("Admin Panelinde Gör", `${baseUrl}/admin/son-siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "İade Talebi Oluşturuldu.", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "İade Talebi - Yazıcı Ticaret"
 );
};

// Müşteri iade onay şablonu
export const userReturnApprovedTemplate = ({
 userName,
 orderId,
 explanation,
 returnAddress,
 handDeliveryAddress,
 returnWindowText,
 shippingFeeText,
 handDeliveryText,
 baseUrl,
}) => {
 const returnAddressHtml = String(returnAddress || "").replace(/\n/g, "<br/>");
 const handDeliveryAddressHtml = String(handDeliveryAddress || "").replace(/\n/g, "<br/>");
 const safeExplanation = explanation ? String(explanation).slice(0, 2000).replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;

 const content = `
  ${emailTitle("İade Talebi Onaylandı")}
  ${emailParagraph(`Merhaba ${userName || "Müşterimiz"},`)}
  ${emailParagraph("İade talebiniz onaylanmıştır. Aşağıdaki talimatları takip ederek iade sürecini başlatabilirsiniz.", "35px")}
  ${safeExplanation ? emailColoredBoxWithLabel("İADE AÇIKLAMASI", safeExplanation, "#ecfdf5", "#bbf7d0", "#065f46") : ""}
  ${returnAddress ? emailInfoBox(`
   ${emailLabelValue("İADE GÖNDERİM ADRESİ", "", "#718096", "12px", "600")}
   <div style="color: #2d3748; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word; margin-top: 12px;">${returnAddressHtml}</div>
  `) : ""}
  ${emailColoredBox(`
   <div style="color: #1e3a8a; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">ELDEN TESLİM (OPSİYONEL)</div>
   <div style="color: #1e3a8a; font-size: 15px; font-weight: 700; margin-bottom: 8px; line-height: 1.4;">${handDeliveryText}</div>
   <div style="color: #1e3a8a; font-size: 15px; line-height: 1.4; word-wrap: break-word; overflow-wrap: break-word;">${handDeliveryAddressHtml}</div>
  `, "#eef2ff", "#c7d2fe", "#1e3a8a")}
  ${emailColoredBox(`
   <div style="color: #9a3412; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">ÖNEMLİ BİLGİLER</div>
   <div style="color: #9a3412; font-size: 15px; font-weight: 700; margin-bottom: 12px; line-height: 1.5;">Lütfen dikkat:</div>
   <ul style="margin: 0; padding-left: 20px; color: #9a3412; font-size: 15px; line-height: 1.7;">
     <li style="margin: 8px 0;">${returnWindowText}</li>
     <li style="margin: 8px 0;">${shippingFeeText}</li>
   </ul>
  `, "#fff7ed", "#fed7aa", "#9a3412", "35px")}
  ${emailButton("Siparişlerime Git", `${baseUrl}/hesabim?tab=siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "İade Talebiniz Onaylandı", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "İade Talebi Onayı - Yazıcı Ticaret"
 );
};

// Müşteri iade red şablonu
export const userReturnRejectedTemplate = ({ userName, orderId, reason, baseUrl }) => {
 const safeReason = reason ? String(reason).slice(0, 2000).replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;

 const content = `
  ${emailTitle("İade Talebiniz Reddedildi")}
  ${emailParagraph(`Merhaba ${userName || "Müşterimiz"},`)}
  ${emailParagraph("Maalesef iade talebiniz incelendikten sonra reddedilmiştir.", "35px")}
  ${safeReason ? emailColoredBoxWithLabel("RED NEDENİ", safeReason, "#fed7d7", "#fc8181", "#c53030") : ""}
  ${emailColoredBox(`
   <div style="color: #9a3412; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">BİLGİ</div>
   <div style="color: #9a3412; font-size: 15px; line-height: 1.7;">
     <p style="margin: 0 0 12px 0;">İade talebinizle ilgili sorularınız varsa veya itiraz etmek isterseniz, bizimle iletişime geçebilirsiniz.</p>
     <p style="margin: 0;">Müşteri hizmetlerimiz size yardımcı olmaktan memnuniyet duyacaktır.</p>
   </div>
  `, "#fff7ed", "#fed7aa", "#9a3412", "35px")}
  ${emailButton("Siparişlerime Git", `${baseUrl}/hesabim?tab=siparisler`)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "İade Talebi Reddedildi", orderId })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "İade Talebi Reddedildi - Yazıcı Ticaret"
 );
};

// Fiyat değişikliği şablonu
export const priceChangeTemplate = ({
 userName,
 productName,
 oldPrice,
 newPrice,
 productUrl,
 baseUrl,
}) => {
 const priceChange = newPrice < oldPrice ? 'düştü' : 'arttı';
 const priceChangePercent = Math.abs(((newPrice - oldPrice) / oldPrice) * 100).toFixed(1);
 const isPriceDrop = newPrice < oldPrice;
 const priceColor = isPriceDrop ? '#10b981' : '#ef4444';

 const content = `
  ${emailTitle("Favori Ürününüzde Fiyat Değişikliği")}
  ${emailParagraph(`Merhaba <strong style="color: #2d3748;">${userName}</strong>,`)}
  ${emailParagraph(`Favorilerinizdeki <strong style="color: #2d3748;">"${productName}"</strong> ürününün fiyatı <strong style="color: ${priceColor};">${priceChange}</strong>!`, "35px")}
  ${emailInfoBox(`
   <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
     <tr>
       <td align="center" style="padding-bottom: 20px;">
         <div style="color: #718096; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">ESKİ FİYAT</div>
         <div style="color: #9ca3af; text-decoration: line-through; font-size: 22px; font-weight: 600;">${oldPrice.toFixed(2)} ₺</div>
       </td>
     </tr>
     <tr>
       <td align="center" style="padding: 20px 0;">
         <div style="background-color: ${priceColor}; border-radius: 50%; width: 50px; height: 50px; text-align: center; vertical-align: middle; margin: 0 auto;">
           <span style="color: #ffffff; font-size: 24px; font-weight: bold; line-height: 50px; display: block;">${isPriceDrop ? '↓' : '↑'}</span>
         </div>
       </td>
     </tr>
     <tr>
       <td align="center" style="padding-bottom: 20px;">
         ${emailLabelValue("YENİ FİYAT", `${newPrice.toFixed(2)} ₺`, priceColor, "36px", "900")}
       </td>
     </tr>
     <tr>
       <td align="center" style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
         ${emailLabelValue("DEĞİŞİM", `%${priceChangePercent} ${priceChange}`, priceColor, "20px", "700")}
       </td>
     </tr>
   </table>
  `, "35px")}
  ${emailButton("Ürünü Görüntüle", productUrl)}
  ${emailNotice(`
   Bu bildirimi almak istemiyorsanız, <a href="${baseUrl}/hesabim" style="color: #4299e1; text-decoration: underline;">hesap ayarlarınızdan</a> e-posta bildirimlerini kapatabilirsiniz.
  `)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Fiyat Değişikliği" })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Fiyat Değişikliği - Yazıcı Ticaret"
 );
};

// Stok bildirimi şablonu
export const stockAvailableTemplate = ({ userName, productName, productUrl, baseUrl }) => {
 const content = `
  ${emailTitle("Favori Ürününüz Stokta!")}
  ${emailParagraph(`Merhaba <strong style="color: #2d3748;">${userName}</strong>,`)}
  ${emailParagraph(`Favorilerinizdeki <strong style="color: #2d3748;">"${productName}"</strong> ürünü artık stokta!`, "35px")}
  ${emailButton("Ürünü Görüntüle", productUrl)}
  ${emailNotice(`
   Bu bildirimi almak istemiyorsanız, <a href="${baseUrl}/hesabim" style="color: #4299e1; text-decoration: underline;">hesap ayarlarınızdan</a> e-posta bildirimlerini kapatabilirsiniz.
  `)}
 `;

 return emailWrapper(
  `${emailHeader({ title: "Stok Bildirimi" })}
   ${emailContent(content)}
   ${emailFooter()}`,
  "Stok Bildirimi - Yazıcı Ticaret"
 );
};