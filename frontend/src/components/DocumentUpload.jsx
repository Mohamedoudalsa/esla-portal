import React from 'react';

export default function DocumentUpload({
  application,
  activeTierObj,
  uploadingDocType,
  uploadError,
  setUploadError,
  onFileUpload,
  onPreview,
  onSubmitForVerification,
  onChangeTier,
  lang,
  t
}) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tier summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
            📋
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold">{t.currentTier}</span>
            <h2 className="text-lg font-extrabold text-emerald-950">
              {activeTierObj ? (lang === 'ar' ? activeTierObj.title_ar : activeTierObj.title_en) : application.category}
            </h2>
          </div>
        </div>
        <button
          onClick={onChangeTier}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200 transition"
        >
          🔄 {t.changeTier}
        </button>
      </div>

      {uploadError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-semibold flex items-center justify-between">
          <span>⚠️ {uploadError}</span>
          <button onClick={() => setUploadError('')} className="text-rose-900 font-bold">✕</button>
        </div>
      )}

      <div>
        <h3 className="text-xl font-extrabold text-slate-900">
          {t.uploadCenterTitle}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {t.uploadCenterSubtitle}
        </p>
      </div>

      <div className="space-y-4">
        {activeTierObj && activeTierObj.required_documents.map((reqDoc) => {
          const existingDoc = application.documents.find(d => d.doc_type === reqDoc.id);
          const isUploading = uploadingDocType === reqDoc.id;

          return (
            <div
              key={reqDoc.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                existingDoc
                  ? existingDoc.status === 'rejected'
                    ? 'border-amber-400 bg-amber-50/20'
                    : 'border-emerald-200 bg-emerald-50/10'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">
                      {lang === 'ar' ? reqDoc.name_ar : reqDoc.name_en}
                    </h4>
                    {reqDoc.is_required && (
                      <span className="text-rose-500 text-xs font-black">* إلزامي</span>
                    )}
                    {existingDoc && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        existingDoc.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : existingDoc.status === 'rejected'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {existingDoc.status === 'verified'
                          ? '✓ معتمد'
                          : existingDoc.status === 'rejected'
                          ? '⚠ يتطلب إعادة رفع'
                          : '⏱ تم الرفع - قيد الفحص'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {lang === 'ar' ? reqDoc.description_ar : reqDoc.description_en}
                  </p>
                  {existingDoc && existingDoc.rejection_reason && (
                    <div className="text-xs text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                      سبب طلب التعديل: {existingDoc.rejection_reason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {existingDoc ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPreview(existingDoc.preview_url)}
                        className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg border border-slate-300 transition"
                      >
                        👁️ {t.previewDoc}
                      </button>
                      <a
                        href={`/api/documents/${existingDoc.id}/download`}
                        download
                        className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg border border-slate-300 transition"
                      >
                        ⬇️ {t.downloadDoc}
                      </a>
                      <label className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg cursor-pointer transition shadow-sm">
                        {t.reuploadDoc}
                        <input
                          type="file"
                          className="hidden"
                          accept={reqDoc.accepted_formats.map(f => `.${f}`).join(',')}
                          onChange={(e) => onFileUpload(reqDoc.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl cursor-pointer transition shadow-sm flex items-center gap-2">
                      {isUploading ? (
                        <span>جاري الرفع... ⏳</span>
                      ) : (
                        <span>⬆️ رفع الملف</span>
                      )}
                      <input
                        type="file"
                        disabled={isUploading}
                        className="hidden"
                        accept={reqDoc.accepted_formats.map(f => `.${f}`).join(',')}
                        onChange={(e) => onFileUpload(reqDoc.id, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission CTA */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">
            {lang === 'ar' ? 'هل انتهيت من رفع المستندات؟' : 'Finished uploading your documents?'}
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            {lang === 'ar'
              ? 'اضغط هنا لتحويل ملفك إلى لجنة القيد والتدقيق الفني بالجمعية.'
              : 'Click to transfer your dossier to the ESLA membership committee.'}
          </p>
        </div>
        <button
          onClick={onSubmitForVerification}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-extrabold text-sm shadow-lg transition"
        >
          🚀 {t.submitForReview}
        </button>
      </div>
    </div>
  );
}
