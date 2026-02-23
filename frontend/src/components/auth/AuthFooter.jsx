import React from "react";
import { Link } from "react-router-dom";

function AuthFooter() {
  return (
    <footer className="w-full py-8 px-12 border-t border-slate-200/60 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="text-xs text-slate-400 font-medium">
        © 2024 Fundify Financial Intelligence. SEC Registered Advisor.
      </p>
      <div className="flex gap-8">
        <Link
          className="text-xs text-slate-400 font-semibold hover:text-emerald-accent transition-colors"
          to="/privacy-policy"
        >
          Privacy Policy
        </Link>
        <Link
          className="text-xs text-slate-400 font-semibold hover:text-emerald-accent transition-colors"
          to="/terms-and-conditions"
        >
          Terms
        </Link>
        <a
          className="text-xs text-slate-400 font-semibold hover:text-emerald-accent transition-colors"
          href="#"
        >
          Compliance
        </a>
      </div>
    </footer>
  );
}

export default AuthFooter;
