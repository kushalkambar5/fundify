import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function AuthSimpleHeader() {
  return (
    <nav className="w-full px-6 py-10 flex justify-center">
      <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-10 h-10 shadow-md shadow-emerald-200 rounded-lg group-hover:shadow-lg transition-all overflow-hidden bg-white border border-emerald-100 flex items-center justify-center p-1">
          <img
            src={logo}
            alt="Fundify Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-slate-900 text-2xl font-bold tracking-tight group-hover:text-emerald-600 transition-colors">
          Fundify
        </h1>
      </Link>
    </nav>
  );
}

export default AuthSimpleHeader;
