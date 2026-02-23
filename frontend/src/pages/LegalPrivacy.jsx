import React from "react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";

export default function LegalPrivacy() {
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
              Privacy Policy
            </h1>
            <p className="text-sm font-bold text-emerald-600 mb-12 uppercase tracking-widest">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            <div className="space-y-10 text-lg text-slate-600 leading-relaxed">
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information you provide directly to us, such as
                  when you create or modify your account, request on-demand
                  services, contact customer support, or otherwise communicate
                  with us.
                </p>
                <p>
                  The types of information we may collect include: your name,
                  email address, postal address, profile picture, payment
                  method, transaction items and other information you choose to
                  provide.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Use of Information
                </h2>
                <p className="mb-4">
                  We may use the information we collect about you to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services;</li>
                  <li>
                    Provide and deliver the products and services you request;
                  </li>
                  <li>
                    Send you technical notices, updates, security alerts and
                    support;
                  </li>
                  <li>
                    Respond to your comments, questions and requests and provide
                    customer service;
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Security
                </h2>
                <p>
                  We take reasonable measures to help protect information about
                  you from loss, theft, misuse and unauthorized access,
                  disclosure, alteration and destruction. All financial data is
                  encrypted with 256-bit AES algorithms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at{" "}
                  <a
                    href="mailto:privacy@fundify.ai"
                    className="text-emerald-600 font-bold hover:underline"
                  >
                    privacy@fundify.ai
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
              className="text-xs font-semibold text-emerald-600"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
