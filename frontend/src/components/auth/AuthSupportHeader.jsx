import React from "react";
import { Link } from "react-router-dom";

function AuthSupportHeader() {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-navy dark:text-white group"
          >
            <span className="material-symbols-outlined text-3xl font-bold group-hover:text-emerald-accent transition-colors">
              account_balance_wallet
            </span>
            <h1 className="text-xl font-black tracking-tight group-hover:text-emerald-accent transition-colors">
              Fundify
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors">
              Support
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-navy dark:text-white">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AuthSupportHeader;
