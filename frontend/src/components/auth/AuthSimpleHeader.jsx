import React from "react";
import { Link } from "react-router-dom";

function AuthSimpleHeader() {
  return (
    <nav className="w-full px-6 py-10 flex justify-center">
      <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
        <div className="bg-[#1A202C] text-white p-2 rounded-lg">
          <svg
            className="w-6 h-6"
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
        <h1 className="text-[#1A202C] dark:text-slate-100 text-2xl font-bold tracking-tight">
          Fundify
        </h1>
      </Link>
    </nav>
  );
}

export default AuthSimpleHeader;
