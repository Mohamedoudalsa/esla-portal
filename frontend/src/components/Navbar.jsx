import React from 'react';

export default function Navbar({
  lang,
  setLang,
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onQuickLogin,
  t
}) {
  return (
    <>
      {/* Quick Demo Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 flex flex-wrap items-center justify-between border-b border-emerald-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-amber-400">⚡ {t.quickDemo}</span>
          <button onClick={() => onQuickLogin('admin@esla.org.eg', 'Admin@ESLA2026')} className="bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 transition">
            {t.demoAdmin}
          </button>
          <button onClick={() => onQuickLogin('student@esla.org.eg', 'student123')} className="bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 transition">
            {t.demoStudent}
          </button>
          <button onClick={() => onQuickLogin('yasmine@esla.org.eg', 'member123')} className="bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-amber-200 transition">
            {t.demoGraduate}
          </button>
          <button onClick={() => onQuickLogin('tarek@esla.org.eg', 'member123')} className="bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 transition">
            {t.demoProfessional}
          </button>
          <button onClick={() => onQuickLogin('sami@esla.org.eg', 'member123')} className="bg-emerald-800 hover:bg-emerald-700 px-2 py-0.5 rounded text-emerald-100 transition">
            {t.demoConsultant}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="bg-emerald-800 hover:bg-emerald-700 px-2.5 py-0.5 rounded font-semibold text-amber-300 transition flex items-center gap-1"
          >
            🌐 {t.langToggle}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('status')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-md ring-2 ring-emerald-500/30">
              🌿
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-extrabold text-emerald-950 tracking-tight">
                {t.societyName}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{t.societySubtitle}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {user && user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                🛡️ {t.navAdmin}
              </button>
            )}
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'tiers'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.navTiers}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'upload'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.navUpload}
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === 'status'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.navStatus}
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800">
                    {lang === 'ar' ? user.full_name_ar : user.full_name_en}
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold">
                    {user.role === 'admin' ? '🛡️ مسؤول النظام' : 'عضو مسجل'}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
