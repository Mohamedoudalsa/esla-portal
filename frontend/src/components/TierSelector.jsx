import React from 'react';

export default function TierSelector({ tiers, application, onSelectTier, lang, t }) {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="inline-block px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full">
          {t.portalTitle}
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.selectTierTitle}
        </h2>
        <p className="text-slate-600 text-sm md:text-base">
          {t.selectTierSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        {tiers.map((tItem) => {
          const isSelected = application && application.category === tItem.id;
          return (
            <div
              key={tItem.id}
              className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                isSelected
                  ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-xs font-extrabold px-3 py-0.5 rounded-full shadow-sm">
                  ✓ {lang === 'ar' ? 'فئتك الحالية' : 'Selected Tier'}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-2xl">
                    {tItem.id === 'student' ? '🎓' : tItem.id === 'graduate' ? '📐' : tItem.id === 'professional' ? '🌳' : '🏛️'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {lang === 'ar' ? tItem.title_ar : tItem.title_en}
                  </h3>
                  <p className="text-xs font-medium text-emerald-700 mt-1">
                    {lang === 'ar' ? tItem.subtitle_ar : tItem.subtitle_en}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                  {lang === 'ar' ? tItem.description_ar : tItem.description_en}
                </div>

                <div className="border-t border-b border-slate-100 py-3 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">{t.annualFee}</span>
                  <div className="text-lg font-black text-emerald-900">
                    {tItem.annual_fee_egp} <span className="text-xs font-bold text-slate-500">{t.egp}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    {t.requiredDocsForTier}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {tItem.required_documents.map((doc) => (
                      <li key={doc.id} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{lang === 'ar' ? doc.name_ar : doc.name_en}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => onSelectTier(tItem.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition shadow-sm ${
                    isSelected
                      ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                      : 'bg-slate-900 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isSelected
                    ? (lang === 'ar' ? 'الانتقال إلى رفع المستندات ➔' : 'Proceed to Documents ➔')
                    : t.selectThisTier}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
