import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import TierSelector from './components/TierSelector';
import DocumentUpload from './components/DocumentUpload';
import StatusDashboard from './components/StatusDashboard';
import AdminDashboard from './components/AdminDashboard';
import { translations } from './translations';

export default function App() {
  const [lang, setLang] = useState('ar');
  const t = translations[lang];

  const [token, setToken] = useState(localStorage.getItem('esla_token') || null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerForm, setRegisterForm] = useState({
    full_name_ar: '',
    full_name_en: '',
    email: '',
    phone_whatsapp: '+20',
    password: ''
  });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [tiers, setTiers] = useState([]);
  const [application, setApplication] = useState(null);
  const [uploadingDocType, setUploadingDocType] = useState(null);
  const [uploadError, setUploadError] = useState('');

  const [adminApps, setAdminApps] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('all');
  const [adminStatusFilter, setAdminStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminDecision, setAdminDecision] = useState({ status: '', notes: '' });
  const [previewModalUrl, setPreviewModalUrl] = useState(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setApplication(null);
    }
  }, [token]);

  useEffect(() => {
    fetch('/api/tiers')
      .then(res => res.json())
      .then(data => setTiers(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        fetchAdminData();
        setActiveTab('admin');
      } else {
        fetchMyApplication();
      }
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyApplication = async () => {
    try {
      const res = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        if (!data) {
          setActiveTab('tiers');
        } else if (data.documents.length === 0) {
          setActiveTab('upload');
        } else {
          setActiveTab('status');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminData = async () => {
    try {
      const [appsRes, statsRes] = await Promise.all([
        fetch(`/api/admin/applications?q=${encodeURIComponent(adminSearch)}&category=${adminCategoryFilter}&status=${adminStatusFilter}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setAdminApps(appsData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setAdminStats(statsData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin' && activeTab === 'admin') {
      fetchAdminData();
    }
  }, [adminSearch, adminCategoryFilter, adminStatusFilter, activeTab]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('esla_token', data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        setAuthModal({ open: false, mode: 'login' });
      } else {
        setAuthError(data.detail || 'Login failed');
      }
    } catch (err) {
      setAuthError('Connection error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('esla_token', data.access_token);
        setToken(data.access_token);
        setUser(data.user);
        setAuthModal({ open: false, mode: 'login' });
      } else {
        setAuthError(data.detail || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Server error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('esla_token');
    setToken(null);
    setUser(null);
    setApplication(null);
    setActiveTab('status');
  };

  const handleQuickLogin = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setAuthModal({ open: true, mode: 'login' });
  };

  const handleSelectTier = async (tierId) => {
    if (!token) {
      setAuthModal({ open: true, mode: 'login' });
      return;
    }
    try {
      const res = await fetch('/api/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category: tierId })
      });
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        setActiveTab('upload');
      } else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setUploadError(lang === 'ar' ? 'حجم الملف يتجاوز 15 ميجابايت' : 'File exceeds 15MB');
      return;
    }

    setUploadError('');
    setUploadingDocType(docType);

    const formData = new FormData();
    formData.append('doc_type', docType);
    formData.append('file', file);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        await fetchMyApplication();
      } else {
        const err = await res.json();
        setUploadError(err.detail);
      }
    } catch (e) {
      setUploadError('Upload failed');
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleSubmitForVerification = async () => {
    try {
      const res = await fetch('/api/applications/my/submit-for-review', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplication(data);
        setActiveTab('status');
        alert(t.submitSuccessMsg);
      } else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminDecision = async () => {
    if (!selectedApp || !adminDecision.status) return;
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: adminDecision.status,
          admin_notes: adminDecision.notes
        })
      });
      if (res.ok) {
        await fetchAdminData();
        setSelectedApp(null);
        alert(lang === 'ar' ? 'تم تحديث القرار بنجاح' : 'Decision saved successfully');
      } else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeTierObj = useMemo(() => {
    if (!application || !tiers.length) return null;
    return tiers.find(item => item.id === application.category);
  }, [application, tiers]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Navbar
        lang={lang}
        setLang={setLang}
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onLogout={handleLogout}
        onQuickLogin={handleQuickLogin}
        t={t}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'tiers' && (
          <TierSelector
            tiers={tiers}
            application={application}
            onSelectTier={handleSelectTier}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'upload' && (
          <DocumentUpload
            application={application}
            activeTierObj={activeTierObj}
            uploadingDocType={uploadingDocType}
            uploadError={uploadError}
            setUploadError={setUploadError}
            onFileUpload={handleFileUpload}
            onPreview={(url) => setPreviewModalUrl(url)}
            onSubmitForVerification={handleSubmitForVerification}
            onChangeTier={() => setActiveTab('tiers')}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'status' && (
          <StatusDashboard
            application={application}
            activeTierObj={activeTierObj}
            onGoToUpload={() => setActiveTab('upload')}
            onOpenRegister={() => setAuthModal({ open: true, mode: 'register' })}
            user={user}
            lang={lang}
            t={t}
          />
        )}

        {activeTab === 'admin' && user && user.role === 'admin' && (
          <AdminDashboard
            adminStats={adminStats}
            adminApps={adminApps}
            adminSearch={adminSearch}
            setAdminSearch={setAdminSearch}
            adminCategoryFilter={adminCategoryFilter}
            setAdminCategoryFilter={setAdminCategoryFilter}
            adminStatusFilter={adminStatusFilter}
            setAdminStatusFilter={setAdminStatusFilter}
            onRefresh={fetchAdminData}
            onSelectApp={(app) => {
              setSelectedApp(app);
              setAdminDecision({ status: app.status, notes: app.admin_notes || '' });
            }}
            t={t}
          />
        )}
      </main>

      {/* Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs font-bold">
              <span>معاينة المستند الرسمي</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-slate-100 p-2 overflow-hidden">
              <iframe
                src={previewModalUrl}
                className="w-full h-full rounded border-0"
                title="Document Preview"
              />
            </div>
          </div>
        </div>
      )}

      {/* Admin Review Inspector Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            <div className="bg-emerald-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-300 font-bold">ملف تدقيق العضوية رقم #{selectedApp.id}</span>
                <h3 className="text-xl font-extrabold mt-1">{selectedApp.user?.full_name_ar}</h3>
                <p className="text-xs text-emerald-200 font-medium">{selectedApp.user?.full_name_en}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="w-9 h-9 rounded-full bg-emerald-800 hover:bg-emerald-700 flex items-center justify-center text-white font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">الفئة:</span>
                  <div className="text-sm font-bold text-slate-900">{selectedApp.category}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">البريد:</span>
                  <div className="text-sm font-bold text-slate-900">{selectedApp.user?.email}</div>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">واتساب:</span>
                  <div className="mt-0.5">
                    <a
                      href={`https://wa.me/${selectedApp.user?.phone_whatsapp?.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                    >
                      🟢 {selectedApp.user?.phone_whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">📄 {t.submittedDocs} ({selectedApp.documents.length})</h4>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{doc.mime_type?.includes('pdf') ? '📕' : '🖼️'}</span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{doc.doc_type} ({doc.original_filename})</div>
                          <div className="text-[10px] text-slate-500">{(doc.file_size / 1024).toFixed(1)} KB • {doc.status}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPreviewModalUrl(doc.preview_url)}
                          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300"
                        >
                          👁️ {t.previewDoc}
                        </button>
                        <a
                          href={`/api/documents/${doc.id}/download`}
                          download
                          className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300"
                        >
                          ⬇️ {t.downloadDoc}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200 space-y-4">
                <h4 className="text-sm font-bold text-emerald-950">⚖️ {t.decisionTitle}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdminDecision({ ...adminDecision, status: 'approved' })}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition ${
                      adminDecision.status === 'approved'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                        : 'bg-white text-emerald-800 border-slate-200'
                    }`}
                  >
                    ✓ {t.decisionApprove}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminDecision({ ...adminDecision, status: 'needs_action' })}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition ${
                      adminDecision.status === 'needs_action'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                        : 'bg-white text-amber-800 border-slate-200'
                    }`}
                  >
                    ⚠ {t.decisionNeedsAction}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminDecision({ ...adminDecision, status: 'rejected' })}
                    className={`p-3 rounded-xl border text-xs font-extrabold transition ${
                      adminDecision.status === 'rejected'
                        ? 'bg-rose-700 text-white border-rose-800 shadow-sm'
                        : 'bg-white text-rose-800 border-slate-200'
                    }`}
                  >
                    ✕ {t.decisionReject}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ملاحظات وتوجيهات اللجنة للمتقدم:
                  </label>
                  <textarea
                    rows="3"
                    placeholder={t.notesPlaceholder}
                    value={adminDecision.notes}
                    onChange={(e) => setAdminDecision({ ...adminDecision, notes: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleAdminDecision}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-extrabold text-xs shadow-md transition"
                >
                  💾 {t.saveDecision}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {authModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setAuthModal({ open: false, mode: 'login' })}
              className="absolute top-5 left-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
            <div className="text-center space-y-1 mb-6">
              <span className="text-3xl">🌿</span>
              <h3 className="text-xl font-extrabold text-slate-900">
                {authModal.mode === 'login' ? t.login : t.register}
              </h3>
              <p className="text-xs text-slate-500">{t.societyName}</p>
            </div>

            {authError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                ⚠️ {authError}
              </div>
            )}

            {authModal.mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.password}</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-md transition"
                >
                  {authLoading ? 'جاري التحقق...' : t.login}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal({ open: true, mode: 'register' })}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    {t.noAccount}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.fullNameAr}</label>
                  <input
                    type="text"
                    required
                    value={registerForm.full_name_ar}
                    onChange={(e) => setRegisterForm({ ...registerForm, full_name_ar: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.fullNameEn}</label>
                  <input
                    type="text"
                    required
                    value={registerForm.full_name_en}
                    onChange={(e) => setRegisterForm({ ...registerForm, full_name_en: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.phoneWhatsapp}</label>
                  <input
                    type="tel"
                    required
                    value={registerForm.phone_whatsapp}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone_whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.email}</label>
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t.password}</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold shadow-md transition mt-2"
                >
                  {authLoading ? 'جاري التسجيل...' : t.register}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthModal({ open: true, mode: 'login' })}
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    {t.alreadyHaveAccount}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div>
            <p className="font-bold text-slate-200">
              © 2026 {t.societyName} (ESLA) - جميع الحقوق محفوظة
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              بوابة القيد واعتماد المهندسين واستشاريي عمارة البيئة وتنسيق الموقع بجمهورية مصر العربية
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>معايير IFLA الدولية</span>
            <span>•</span>
            <span>نقابة المهندسين المصرية</span>
            <span>•</span>
            <span>قانون حماية البيانات</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
