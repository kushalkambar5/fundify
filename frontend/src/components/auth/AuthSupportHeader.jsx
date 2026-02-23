import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function AuthSupportHeader() {
  return (
    <header className="w-full border-b border-emerald-100 bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 shadow-md shadow-emerald-200 rounded-lg group-hover:shadow-lg transition-all overflow-hidden bg-white flex items-center justify-center p-0.5 border border-emerald-100">
              <img
                src={logo}
                alt="Fundify Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-slate-900 text-xl font-black tracking-tight group-hover:text-emerald-600 transition-colors">
              Fundify
            </h1>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition-colors">
              Support
            </button>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 ring-2 ring-emerald-100">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AuthSupportHeader;
