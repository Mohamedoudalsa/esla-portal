import React from 'react';

export default function StatusDashboard({
  application,
  activeTierObj,
  onGoToUpload,
  onOpenRegister,
  user,
  lang,
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

  if (!application) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-4xl mx-auto">
        <span className="text-5xl">🌿</span>
        <h3 className="text-2xl font-extrabold text-slate-900">
          {lang === 'ar' ? 'مرحباً بك في بوابة الجمعية المصرية لمعماريي تنسيق الموقع' : 'Welcome to the ESLA Membership Portal'}
        </h3>
        <p className="text-slate-600 max-w-lg mx-auto text-sm">
          {lang === 'ar'
            ? 'تتيح لك البوابة تقديم أوراق اعتماد عضويتك، ومتابعة فحص المستندات بواسطة اللجنة الاستشارية حتى إصدار بطاقة العضوية والشهادة الرسمية.'
            : 'Submit your membership accreditation documents and track verification in real-time until your official card is issued.'}
        </p>
        <div className="pt-2">
          <button
            onClick={onOpenRegister}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition"
          >
            {user ? t.selectTierTitle : t.register} ➔
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Stepper */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6">
          {t.appStatusTitle}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow">
              ✓
            </div>
            <span className="text-xs font-bold text-emerald-950 mt-2">{t.step1}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{application.category}</span>
          </div>

          <div className={`flex flex-col items-center text-center p-3 rounded-xl border ${
            application.documents.length > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm ${
              application.documents.length > 0 ? 'bg-emerald-700 text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              {application.documents.length > 0 ? '✓' : '2'}
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">{t.step2}</span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {application.documents.length} مستندات
            </span>
          </div>

          <div className={`flex flex-col items-center text-center p-3 rounded-xl border ${
            application.status === 'under_verification' || application.status === 'approved'
              ? 'bg-emerald-50 border-emerald-200'
              : application.status === 'needs_action'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/20'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm ${
              application.status === 'approved'
                ? 'bg-emerald-700 text-white'
                : application.status === 'needs_action'
                ? 'bg-amber-500 text-white'
                : application.status === 'under_verification'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-300 text-slate-700'
            }`}>
              {application.status === 'approved' ? '✓' : application.status === 'needs_action' ? '⚠' : '3'}
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">{t.step3}</span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {application.status === 'needs_action' ? 'مطلوب تعديل' : 'لجنة الفحص'}
            </span>
          </div>

          <div className={`flex flex-col items-center text-center p-3 rounded-xl border ${
            application.status === 'approved'
              ? 'bg-emerald-100 border-emerald-300 ring-2 ring-emerald-500/20'
              : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-sm ${
              application.status === 'approved' ? 'bg-emerald-700 text-white' : 'bg-slate-300 text-slate-700'
            }`}>
              {application.status === 'approved' ? '★' : '4'}
            </div>
            <span className="text-xs font-bold text-slate-800 mt-2">{t.step4}</span>
            <span className="text-[10px] text-slate-500 font-semibold">
              {application.status === 'approved' ? 'معتمد رسمي' : 'بانتظار القرار'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Details */}
      <div className={`rounded-2xl p-6 border shadow-sm ${
        application.status === 'approved'
          ? 'bg-emerald-50 border-emerald-300'
          : application.status === 'needs_action'
          ? 'bg-amber-50 border-amber-300'
          : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-500">حالة ملف العضوية:</span>
              {getStatusBadge(application.status)}
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {lang === 'ar' ? (activeTierObj ? activeTierObj.title_ar : application.category) : application.category}
            </h3>
          </div>

          <button
            onClick={onGoToUpload}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition shadow-sm"
          >
            📂 {lang === 'ar' ? 'عرض / تعديل المستندات المرفوعة' : 'Manage Uploaded Documents'}
          </button>
        </div>

        {application.admin_notes && (
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <div className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <span>📝</span>
              <span>{t.adminNotesAlert}</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
              {application.admin_notes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
