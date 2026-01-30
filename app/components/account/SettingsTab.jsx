"use client";
import { HiLockClosed, HiMail, HiExclamationCircle, HiCheckCircle } from "react-icons/hi";

const inputCls = (hasError) =>
 `w-full border rounded-xl px-4 py-3 text-gray-800 placeholder:text-gray-400
   focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
   ${hasError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-200 hover:border-gray-300"}`;

export default function SettingsTab({
 passwordForm,
 setPasswordForm,
 passwordError,
 setPasswordError,
 passwordSuccess,
 passwordLoading,
 onPasswordChange,
 notificationPreferences,
 onNotificationChange,
 onDeleteAccount,
 hasActiveOrders = false,
}) {
 const clearError = () => setPasswordError("");
 const handleChange = (key, value) => {
  setPasswordForm({ ...passwordForm, [key]: value });
  clearError();
 };

 return (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
   <div className="px-6 py-5 border-b border-gray-100">
    <h2 className="text-xl font-bold text-gray-900">Hesap Ayarları</h2>
    <p className="text-sm text-gray-500 mt-1">Şifre, bildirimler ve hesap yönetimi</p>
   </div>

   <div className="p-6 space-y-6">
    {/* Şifre Değiştir */}
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden">
     <div className="px-5 py-4 border-b border-gray-100 bg-white/80">
      <div className="flex items-center gap-2">
       <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
        <HiLockClosed size={18} />
       </div>
       <div>
        <h3 className="font-bold text-gray-900">Şifre Değiştir</h3>
        <p className="text-xs text-gray-500">Güvenliğiniz için güçlü bir şifre kullanın</p>
       </div>
      </div>
     </div>
     <form onSubmit={onPasswordChange} className="p-5 space-y-4">
      <div>
       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mevcut Şifre</label>
       <input
        type="password"
        placeholder="••••••••"
        value={passwordForm.currentPassword}
        onChange={(e) => handleChange("currentPassword", e.target.value)}
        className={inputCls(!!passwordError)}
        required
       />
      </div>
      <div>
       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Yeni Şifre</label>
       <input
        type="password"
        placeholder="••••••••"
        value={passwordForm.newPassword}
        onChange={(e) => handleChange("newPassword", e.target.value)}
        className={inputCls(!!passwordError)}
        required
       />
       <p className="text-xs text-gray-500 mt-1.5">
        En az 10 karakter, 1 büyük harf, 1 özel karakter (!, @, # vb.). Sıralı harf/rakam (abc, 123) içeremez.
       </p>
      </div>
      <div>
       <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Yeni Şifre Tekrar</label>
       <input
        type="password"
        placeholder="••••••••"
        value={passwordForm.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        className={inputCls(!!passwordError)}
        required
       />
      </div>
      {passwordError && (
       <p className="text-sm text-red-600 flex items-center gap-1.5">
        <HiExclamationCircle size={16} className="shrink-0" />
        {passwordError}
       </p>
      )}
      {passwordSuccess && (
       <p className="text-sm text-green-600 flex items-center gap-1.5">
        <HiCheckCircle size={16} className="shrink-0" />
        {passwordSuccess}
       </p>
      )}
      <button
       type="submit"
       disabled={passwordLoading}
       className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all hover:shadow-md hover:shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer"
      >
       <HiLockClosed size={16} />
       {passwordLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
      </button>
     </form>
    </div>

    {/* Bildirim Tercihleri */}
    <div className="rounded-2xl border border-gray-200 bg-gray-50/50 overflow-hidden">
     <div className="px-5 py-4 border-b border-gray-100 bg-white/80">
      <div className="flex items-center gap-2">
       <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
        <HiMail size={18} />
       </div>
       <div>
        <h3 className="font-bold text-gray-900">Bildirim Tercihleri</h3>
        <p className="text-xs text-gray-500">Sipariş ve kampanya bildirimleri</p>
       </div>
      </div>
     </div>
     <div className="p-5">
      <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group">
       <input
        type="checkbox"
        checked={notificationPreferences?.emailNotifications ?? false}
        onChange={(e) => onNotificationChange("emailNotifications", e.target.checked)}
        className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
       />
       <span className="text-gray-700 font-medium group-hover:text-gray-900">E-posta bildirimleri al</span>
      </label>
     </div>
    </div>

    {/* Tehlikeli Bölge */}
    <div className="rounded-2xl border-2 border-red-200 bg-red-50/30 overflow-hidden">
     <div className="px-5 py-4 border-b border-red-200/50">
      <div className="flex items-center gap-2">
       <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
        <HiExclamationCircle size={18} />
       </div>
       <div>
        <h3 className="font-bold text-red-700">Tehlikeli Bölge</h3>
        <p className="text-xs text-red-600/80">Geri alınamaz işlemler</p>
       </div>
      </div>
     </div>
     <div className="p-5">
      <p className="text-sm text-gray-600 mb-4">
       Hesabınızı sildiğinizde tüm verileriniz (siparişler, adresler, favoriler) kalıcı olarak silinecektir.
      </p>
      {hasActiveOrders && (
       <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
        Devam eden siparişleriniz (Beklemede, Hazırlanıyor, Kargoya Verildi) varken hesap silinemez. Siparişleriniz tamamlandıktan veya iptal edildikten sonra tekrar deneyin.
       </p>
      )}
      <button
       onClick={onDeleteAccount}
       disabled={hasActiveOrders}
       className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all hover:shadow-md hover:shadow-red-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:bg-red-600"
      >
       <HiExclamationCircle size={16} />
       Hesabı Sil
      </button>
     </div>
    </div>
   </div>
  </div>
 );
}
