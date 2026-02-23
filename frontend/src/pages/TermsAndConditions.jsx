import React from "react";
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-display text-slate-900 dark:text-slate-100 antialiased p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-2xl rounded-[2rem] p-8 md:p-16 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none rounded-[2rem]"></div>
        <div className="pointer-events-none absolute -left-20 -top-20 w-64 h-64 bg-indigo-500/20 dark:bg-indigo-500/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-4">
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center gap-2 font-semibold bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm w-max"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              Back to Home
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-12 uppercase tracking-widest">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-10 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                These Terms of Use constitute a legally binding agreement made
                between you, whether personally or on behalf of an entity
                (“you”) and Fundify AI ("Company," "we," "us," or "our"),
                concerning your access to and use of the website as well as any
                other media form, media channel, mobile website or mobile
                application related, linked, or otherwise connected thereto
                (collectively, the “Site”).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. User Representations
              </h2>
              <p className="mb-4">
                By using the Site, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  All registration information you submit will be true,
                  accurate, current, and complete;
                </li>
                <li>
                  You will maintain the accuracy of such information and
                  promptly update such registration information as necessary;
                </li>
                <li>
                  You have the legal capacity and you agree to comply with these
                  Terms of Use;
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Prohibited Activities
              </h2>
              <p>
                You may not access or use the Site for any purpose other than
                that for which we make the Site available. The Site may not be
                used in connection with any commercial endeavors except those
                that are specifically endorsed or approved by us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Modifications and Interruptions
              </h2>
              <p>
                We reserve the right to change, modify, or remove the contents
                of the Site at any time or for any reason at our sole discretion
                without notice. However, we have no obligation to update any
                information on our Site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. Contact Us
              </h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive
                further information regarding use of the Site, please contact us
                at{" "}
                <a
                  href="mailto:terms@fundify.ai"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  terms@fundify.ai
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
