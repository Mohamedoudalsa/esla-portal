import React from 'react';

export default function AdminDashboard({
  adminStats,
  adminApps,
  adminSearch,
  setAdminSearch,
  adminCategoryFilter,
  setAdminCategoryFilter,
  adminStatusFilter,
  setAdminStatusFilter,
  onRefresh,
  onSelectApp,
  t
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">✓ {t.tierApproved}</span>;
      case 'needs_action':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">⚠ {t.tierNeedsAction}</span>;
      case 'under_verification':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">⏳ {t.tierUnderReview}</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">✕ {t.tierRejected}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">⏱ {t.tierPending}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t.adminOverview}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            لجنة القيد واعتماد العضويات المهنية - الجمعية المصرية لمعماريي تنسيق الموقع
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition border border-slate-300"
          >
            🔄 تحديث البيانات
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {adminStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">{t.statsTotal}</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{adminStats.total_applications}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-blue-600">{t.statsUnderVerification}</span>
            <div className="text-2xl font-black text-blue-700 mt-1">{adminStats.under_verification}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-emerald-600">{t.statsApproved}</span>
            <div className="text-2xl font-black text-emerald-700 mt-1">{adminStats.approved}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-amber-600">{t.statsNeedsAction}</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{adminStats.needs_action}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500">{t.statsPending}</span>
            <div className="text-2xl font-black text-slate-700 mt-1">{adminStats.pending_review}</div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            className="w-full px-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={adminCategoryFilter}
            onChange={(e) => setAdminCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">{t.filterAll}</option>
            <option value="student">عضو طالب (Student)</option>
            <option value="graduate">عضو منتسب (Graduate)</option>
            <option value="professional">عضو عامل (Professional)</option>
            <option value="consultant">عضو استشاري (Consultant)</option>
          </select>

          <select
            value={adminStatusFilter}
            onChange={(e) => setAdminStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">{t.filterStatusAll}</option>
            <option value="pending_review">قيد المراجعة</option>
            <option value="under_verification">قيد التدقيق الفني</option>
            <option value="needs_action">مطلوب إجراء</option>
            <option value="approved">معتمد</option>
            <option value="rejected">مرفوض</option>
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">{t.colApplicant}</th>
                <th className="py-3.5 px-4">{t.colTier}</th>
                <th className="py-3.5 px-4">المستندات المرفقة</th>
                <th className="py-3.5 px-4">{t.colStatus}</th>
                <th className="py-3.5 px-4 text-center">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">
                    لا توجد طلبات مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                adminApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{app.user?.full_name_ar}</div>
                      <div className="text-slate-500 text-[11px]">{app.user?.email}</div>
                      <div className="text-emerald-700 text-[11px] font-semibold mt-0.5 flex items-center gap-1">
                        <span>📱 {app.user?.phone_whatsapp}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {app.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">
                        📁 {app.documents.length} ملفات مرفوعة
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onSelectApp(app)}
                        className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs shadow-sm transition"
                      >
                        🔍 {t.reviewApplicantBtn}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
