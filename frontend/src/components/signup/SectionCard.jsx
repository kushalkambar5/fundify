import React from "react";

function SectionCard({
  icon,
  title,
  subtitle,
  saved,
  loading,
  error,
  onSave,
  children,
  iconBg = "bg-emerald-50",
  iconColor = "text-emerald-600",
  headerAction,
  saveBtnText,
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-center">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {icon}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {headerAction}
          {saved && (
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold tracking-wider">
              <span className="material-symbols-outlined text-[12px]">
                check_circle
              </span>
              SAVED
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      <div className="mb-2 flex-grow">{children}</div>

      <div className="pt-6 mt-4 border-t border-slate-50">
        <button
          onClick={onSave}
          disabled={loading || saved}
          className={`w-full text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm ${
            loading || saved
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-emerald-500 hover:bg-emerald-600"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : saved ? (
            <>
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
              Saved
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">
                {saveBtnText && saveBtnText.includes("don't")
                  ? "skip_next"
                  : "save"}
              </span>
              {saveBtnText || `Save ${title}`}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default SectionCard;
