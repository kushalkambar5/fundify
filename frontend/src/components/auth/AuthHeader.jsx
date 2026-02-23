import React from "react";
import { Link } from "react-router-dom";

function AuthHeader() {
  return (
    <header className="w-full px-6 lg:px-12 py-5 flex items-center justify-between bg-white border-b border-slate-200/60">
      <Link to="/" className="flex items-center gap-2.5 text-navy">
        <div className="w-9 h-9 flex items-center justify-center">
          <svg
            className="w-full h-full"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <h1 className="text-navy text-2xl font-bold tracking-tight">Fundify</h1>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a
          className="text-slate-500 text-sm font-medium hover:text-navy transition-colors"
          href="#"
        >
          Platform
        </a>
        <a
          className="text-slate-500 text-sm font-medium hover:text-navy transition-colors"
          href="#"
        >
          Security
        </a>
        <button className="bg-navy text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-slate-800">
          Get Started
        </button>
      </div>
    </header>
  );
}

export default AuthHeader;
