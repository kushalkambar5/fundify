import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-white/5 bg-white/80 dark:bg-background-dark/90 backdrop-blur-xl shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-400/20 flex items-center justify-center text-primary border border-primary/20 group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep group-hover:shadow-[0_0_15px_rgba(13,242,185,0.4)] transition-all duration-300">
            <span className="material-symbols-outlined text-2xl font-bold">
              query_stats
            </span>
          </div>
          <span className="text-navy-deep dark:text-navy-deep text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
            Fundify
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <a
            className="text-slate-800 dark:text-slate-800 hover:text-navy-deep dark:hover:text-navy-deep hover:bg-slate-100 dark:hover:bg-slate-100/50 px-4 py-2 rounded-lg transition-all text-sm font-bold tracking-wide"
            href="#"
          >
            Solutions
          </a>
          <a
            className="text-slate-800 dark:text-slate-800 hover:text-navy-deep dark:hover:text-navy-deep hover:bg-slate-100 dark:hover:bg-slate-100/50 px-4 py-2 rounded-lg transition-all text-sm font-bold tracking-wide"
            href="#"
          >
            Analytics
          </a>
          <a
            className="text-slate-800 dark:text-slate-800 hover:text-navy-deep dark:hover:text-navy-deep hover:bg-slate-100 dark:hover:bg-slate-100/50 px-4 py-2 rounded-lg transition-all text-sm font-bold tracking-wide"
            href="#"
          >
            Security
          </a>
          <a
            className="text-slate-800 dark:text-slate-800 hover:text-navy-deep dark:hover:text-navy-deep hover:bg-slate-100 dark:hover:bg-slate-100/50 px-4 py-2 rounded-lg transition-all text-sm font-bold tracking-wide"
            href="#"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:block px-5 py-2.5 text-slate-800 dark:text-slate-800 hover:text-navy-deep dark:hover:text-navy-deep text-sm font-bold transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="flex items-center justify-center bg-gradient-to-r from-primary to-emerald-400 text-navy-deep px-6 py-2.5 rounded-xl text-sm font-bold tracking-tight shadow-[0_0_15px_rgba(13,242,185,0.4)] hover:shadow-[0_0_25px_rgba(13,242,185,0.6)] hover:scale-105 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
