"use client";

export default function ProfileTab({ userInfo, setUserInfo, profileErrors, setProfileErrors, updatingProfile, onSubmit }) {
 return (
  <div className="bg-white rounded-xl shadow-sm p-6">
   <h2 className="text-2xl font-bold mb-6">Profil Bilgileri</h2>

   <form onSubmit={onSubmit} className="space-y-6">
    <div className="grid md:grid-cols-2 gap-6">
     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Ad <span className="text-red-500">*</span>
      </label>
      <input
       type="text"
       value={userInfo.firstName}
       onChange={(e) => {
        const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ\s]/g, '');
        setUserInfo({ ...userInfo, firstName: value });
        if (profileErrors.firstName) {
         setProfileErrors({ ...profileErrors, firstName: '' });
        }
       }}
       className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none ${profileErrors.firstName ? 'border-red-500' : 'border-gray-300'
        }`}
       required
      />
      {profileErrors.firstName && (
       <p className="text-xs text-red-500 mt-1">{profileErrors.firstName}</p>
      )}
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Soyad <span className="text-red-500">*</span>
      </label>
      <input
       type="text"
       value={userInfo.lastName}
       onChange={(e) => {
        const value = e.target.value.replace(/[^a-zA-ZçğıöşüÇĞIİÖŞÜ]/g, '').split(' ')[0];
        setUserInfo({ ...userInfo, lastName: value });
        if (profileErrors.lastName) {
         setProfileErrors({ ...profileErrors, lastName: '' });
        }
       }}
       className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none ${profileErrors.lastName ? 'border-red-500' : 'border-gray-300'
        }`}
       required
      />
      {profileErrors.lastName && (
       <p className="text-xs text-red-500 mt-1">{profileErrors.lastName}</p>
      )}
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       E-posta <span className="text-red-500">*</span>
      </label>
      <input
       type="email"
       value={userInfo.email}
       onChange={(e) => {
        setUserInfo({ ...userInfo, email: e.target.value });
        if (profileErrors.email) {
         setProfileErrors({ ...profileErrors, email: '' });
        }
       }}
       onBlur={(e) => {
        const email = e.target.value.trim();
        if (email) {
         const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
         if (!emailRegex.test(email)) {
          setProfileErrors(prev => ({ ...prev, email: "Geçerli bir e-posta adresi giriniz! (Örn: ornek@email.com)" }));
         } else {
          const parts = email.split('@');
          if (parts.length !== 2) {
           setProfileErrors(prev => ({ ...prev, email: "Geçerli bir e-posta adresi giriniz!" }));
          } else {
           const domain = parts[1];
           if (domain.endsWith('.') || !domain.includes('.') || domain.split('.').pop().length < 2) {
            setProfileErrors(prev => ({ ...prev, email: "E-posta adresinin domain kısmı geçersiz! (Örn: @gmail.com)" }));
           } else {
            setProfileErrors(prev => ({ ...prev, email: '' }));
           }
          }
         }
        }
       }}
       className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none ${profileErrors.email ? 'border-red-500' : 'border-gray-300'
        }`}
       required
      />
      {profileErrors.email && (
       <p className="text-xs text-red-500 mt-1">{profileErrors.email}</p>
      )}
     </div>

     <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
       Telefon <span className="text-red-500">*</span>
      </label>
      <input
       type="tel"
       value={userInfo.phone}
       onChange={(e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        setUserInfo({ ...userInfo, phone: value });
        if (profileErrors.phone) {
         setProfileErrors({ ...profileErrors, phone: '' });
        }
       }}
       maxLength={11}
       placeholder="0XXXXXXXXXX"
       className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none ${profileErrors.phone ? 'border-red-500' : 'border-gray-300'
        }`}
       required
      />
      {profileErrors.phone && (
       <p className="text-xs text-red-500 mt-1">{profileErrors.phone}</p>
      )}
     </div>
    </div>

    <button
     type="submit"
     disabled={updatingProfile}
     className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
     {updatingProfile ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
    </button>
   </form>
  </div>
 );
}
