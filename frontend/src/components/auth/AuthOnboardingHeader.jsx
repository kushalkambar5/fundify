import React from "react";
import { Link } from "react-router-dom";

function AuthOnboardingHeader() {
  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-[#1A202C] text-white p-1.5 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
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
            <h1 className="text-[#1A202C] text-xl font-bold tracking-tight">
              Fundify
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AuthOnboardingHeader;
