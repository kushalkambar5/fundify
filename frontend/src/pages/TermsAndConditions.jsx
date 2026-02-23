import React from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

export default function TermsAndConditions() {
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased">
      <DashboardNavbar />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12 md:px-10">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 font-semibold bg-white px-4 py-2 rounded-full border border-emerald-200 shadow-sm w-max hover:shadow-md"
          >
            <span className="material-symbols-outlined text-xl">
              arrow_back
            </span>
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 md:p-14 shadow-md relative overflow-hidden">
          <div className="pointer-events-none absolute -left-20 -top-20 w-64 h-64 bg-emerald-200/40 blur-[80px] rounded-full"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-700 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-sm font-bold text-emerald-600 mb-12 uppercase tracking-widest">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-10 text-lg text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Agreement to Terms
                </h2>
                <p>
                  These Terms of Use constitute a legally binding agreement made
                  between you, whether personally or on behalf of an entity
                  ("you") and Fundify AI ("Company," "we," "us," or "our"),
                  concerning your access to and use of the website as well as
                  any other media form, media channel, mobile website or mobile
                  application related, linked, or otherwise connected thereto
                  (collectively, the "Site").
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
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
                    You have the legal capacity and you agree to comply with
                    these Terms of Use;
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
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
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Modifications and Interruptions
                </h2>
                <p>
                  We reserve the right to change, modify, or remove the contents
                  of the Site at any time or for any reason at our sole
                  discretion without notice. However, we have no obligation to
                  update any information on our Site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  5. Contact Us
                </h2>
                <p>
                  In order to resolve a complaint regarding the Site or to
                  receive further information regarding use of the Site, please
                  contact us at{" "}
                  <a
                    href="mailto:terms@fundify.ai"
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    terms@fundify.ai
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-emerald-100 bg-emerald-50 px-10 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 text-emerald-600">
              <span className="material-symbols-outlined text-sm">
                account_balance_wallet
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              © 2026 Fundify AI. Member FDIC.
            </p>
          </div>
          <div className="flex gap-8">
            <Link
              to="/privacy-policy"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-xs font-semibold text-emerald-600"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
