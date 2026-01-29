// ! İyzico hata kodları
export const IYZICO_ERROR_MESSAGES = {
 11: 'Geçersiz istek. Lütfen bilgilerinizi kontrol ediniz.',
 12: 'Kart numaranız geçerli formatta değil. Lütfen kart numaranızı kontrol ediniz.',
 13: 'Son kullanma ayı hatalı veya geçmiş. Lütfen kontrol ediniz.',
 14: 'Son kullanma yılı hatalı veya geçmiş. Lütfen kontrol ediniz.',
 15: 'Güvenlik kodu (CVC/CVV) hatalı. American Express için 4, diğer kartlar için 3 haneli olmalıdır.',
 10005: 'Ödeme işlemi sırasında hata oluştu. Bankanız ile irtibata geçiniz.',
 10012: 'Geçersiz işlem. Ödeme işlemi sırasında hata oluştu, bankanız ile irtibata geçiniz.',
 10034: 'İşleme banka tarafından izin verilmemiştir.',
 10041: 'İşleme banka tarafından izin verilmemektedir. Bankanız ile irtibata geçiniz.',
 10043: 'İşleme banka tarafından izin verilmemektedir. Bankanız ile irtibata geçiniz.',
 10051: 'Kart limiti yetersiz, yetersiz bakiye.',
 10054: 'Son kullanma tarihi hatalı. Kartınızın vadesi dolmuştur.',
 10057: 'Kartınız bu işlem için kısıtlıdır. Bankanız ile irtibata geçiniz.',
 10058: 'Ödeme sırasında hata oluştu. Firma temsilcisi ile irtibata geçiniz.',
 10084: 'Girilen CVV değeri hatalı veya geçersiz. Lütfen tekrar deneyiniz.',
 10093: 'Kartınız internet alışverişine kapalıdır. Bankanız ile irtibata geçiniz.',
 10201: 'Kart işleme izin vermedi. Bankanız ile irtibata geçiniz.',
 10202: 'Ödeme işlemi sırasında hata oluştu. Firma temsilcisi ile irtibata geçiniz.',
 10204: 'Ödeme işlemi sırasında hata oluştu. Firma temsilcisi ile irtibata geçiniz.',
 10207: 'Bankanızdan onay alınız.',
 10208: 'Ödeme işlemi sırasında hata oluştu. Firma temsilcisi ile iletişime geçiniz.',
 10209: 'Bloke statülü kart. Bankanız ile irtibata geçiniz.',
 10210: 'Hatalı CVC bilgisi. Tekrar deneyiniz.',
 10211: 'Ödeme sırasında hata oluştu. Bankanız ile irtibata geçiniz.',
 10212: 'CVC yanlış girme deneme sayısı aşıldı. Bankanız ile irtibata geçiniz.',
 10213: 'BIN bulunamadı. Firma temsilcisi ile irtibata geçiniz.',
 10214: 'Banka tarafında hata oluştu. Daha sonra tekrar deneyiniz.',
 10215: 'Geçersiz kart, hatalı kart. Kart numaranızı kontrol ediniz.',
 10216: 'Banka tarafında hata oluştu. Daha sonra tekrar deneyiniz.',
 10217: 'İşlem 3D olarak gerçekleştirilmelidir.',
 10218: 'Banka kartları ile taksit yapılamaz. Tekrar deneyiniz.',
 10219: 'Banka tarafında bir hata oluştu. Daha sonra tekrar deneyiniz.',
 10220: 'Tekrar deneyiniz. Hata alınması durumunda bankanız ile irtibata geçiniz.',
 10221: 'Yurtdışı kartlara işlem izni bulunmamaktadır.',
 10222: 'Pos taksitli işleme kapalıdır.',
 10223: 'Pos gün sonu yapılmalıdır.',
 10224: 'Kartınızın işlem limiti aşılmıştır. Bankanız ile irtibata geçiniz.',
 10225: 'Kartınız bu işlem için kısıtlıdır. Bankanız ile irtibata geçiniz.',
 10226: 'İzin verilebilir pin deneme sayısını aştınız. Bankanız ile irtibata geçiniz.',
 10227: 'Pin numarası yanlış. Tekrar deneyiniz.',
 10228: 'Banka tarafında bir hata oluştu. Daha sonra tekrar deneyiniz.',
 10229: 'Kartın son kullanma tarihi hatalıdır. Tekrar deneyiniz.',
 10230: 'Ödeme isteği banka tarafından bloklandı. Bankanız ile irtibata geçiniz.',
 10231: 'Satış tutarı kullanılan puandan düşük olamaz.',
 10232: 'Geçersiz tutar. Bankanız ile irtibata geçiniz.',
 10233: 'Geçersiz kart tipi. Bankanız ile irtibata geçiniz.',
 10234: 'Yetersiz puan.',
 10235: 'American Express kart hatası. Bankanız ile irtibata geçiniz.',
 10237: 'Debit kart işlemlerinde iade yapılamaz.',
 10238: 'Geçersiz işlem.',
 10239: 'Ödeme kullanıcı tarafından iptal edildi.',
 10240: 'Gönderilen istek zaman aşımına uğradı.',
 10241: 'İletişim veya sistem hatası.',
 10242: 'İletişim veya sistem hatası.',
 10243: 'Ödeme alınamadı.',
 10244: 'Ödeme alınamadı.',
 10245: 'Ödeme kırılımına ait iade tutarı limiti aşıldı.',
 10247: 'Banka transferi ödemesi yapılmadı.',
 10248: 'İşlem yapmak istediğiniz tutar işlem limitini aşmaktadır. Bankanız ile irtibata geçiniz.',
 10249: 'Bakiye ödemesi sırasında bir hata oluştu.',
 10250: 'Taksitli işlem için puan kullanılamaz.',
 10251: 'İşlem yapılan kart için puan ve kart limiti beraber kullanılamaz.',
};

/**
 * İyzico result (errorCode, errorMessage) için kullanıcıya gösterilecek tam mesajı döndürür.
 * @param {{ errorCode?: number | string; errorMessage?: string }} result 
 * @param {string} [cardNumber] 
 */
export function getIyzicoUserMessage(result, cardNumber) {
 const code = result?.errorCode != null ? Number(result.errorCode) : null;
 if (code != null && IYZICO_ERROR_MESSAGES[code]) {
  return IYZICO_ERROR_MESSAGES[code];
 }
 const raw = result?.errorMessage || '';
 return raw && typeof raw === 'string' ? raw : 'Ödeme işlemi başlatılamadı.';
}
