import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function AuthOnboardingHeader() {
  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 shadow-md shadow-emerald-200 rounded-lg group-hover:shadow-lg transition-all overflow-hidden bg-white flex items-center justify-center p-0.5 border border-emerald-100">
              <img
                src={logo}
                alt="Fundify Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-slate-900 text-xl font-bold tracking-tight group-hover:text-emerald-600 transition-colors">
              Fundify
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AuthOnboardingHeader;
