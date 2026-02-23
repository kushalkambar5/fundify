import React from "react";

function Footer() {
  return (
    <footer className="bg-white dark:bg-background-dark relative pt-24 pb-12 px-6 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_10px_rgba(13,242,185,0.5)]"></div>

      {/* Subtle background glow */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 relative z-10">
        <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="size-10 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-400/20 flex items-center justify-center text-primary border border-primary/20 group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300">
              <span className="material-symbols-outlined text-2xl font-bold">
                query_stats
              </span>
            </div>
            <span className="text-navy-deep dark:text-navy-deep text-2xl font-black tracking-tight group-hover:text-primary transition-colors">
              Fundify
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-600 text-sm max-w-xs leading-relaxed">
            The next generation of financial management. AI-powered tracking for
            the ambitious investor, powered by Fundify.
          </p>
          <div className="flex gap-4">
            <a
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-600 hover:text-primary dark:hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-200 transition-all border border-transparent dark:hover:border-primary/30 hover:scale-110"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
            <a
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-600 hover:text-primary dark:hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-200 transition-all border border-transparent dark:hover:border-primary/30 hover:scale-110"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">share</span>
            </a>
            <a
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-100 flex items-center justify-center text-slate-600 dark:text-slate-600 hover:text-primary dark:hover:text-primary hover:bg-slate-200 dark:hover:bg-slate-200 transition-all border border-transparent dark:hover:border-primary/30 hover:scale-110"
              href="#"
            >
              <span className="material-symbols-outlined text-xl">
                alternate_email
              </span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-900 mb-6 uppercase text-xs tracking-widest">
            Platform
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-600 font-bold">
            <li>
              <a className="hover:text-primary" href="#">
                Fundify Dashboard
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Analytics
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Integrations
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Security
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-900 mb-6 uppercase text-xs tracking-widest">
            Company
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-600 font-bold">
            <li>
              <a className="hover:text-primary" href="#">
                About Fundify
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Careers
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Privacy
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Terms
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-900 mb-6 uppercase text-xs tracking-widest">
            Support
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-600 font-bold">
            <li>
              <a className="hover:text-primary" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                API Docs
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Status
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200/60 dark:border-slate-200/60 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        <p className="text-xs text-slate-500 dark:text-slate-500 font-semibold">
          © 2024 Fundify Inc. All rights reserved. Member FDIC.
        </p>
        <div className="flex gap-6">
          <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold tracking-widest">
            Bank-Level Security
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold tracking-widest">
            SOC2 Certified
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase font-bold tracking-widest">
            GDPR Compliant
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
