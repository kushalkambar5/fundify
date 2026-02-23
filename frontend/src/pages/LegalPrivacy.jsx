import React from "react";
import { Link } from "react-router-dom";

export default function LegalPrivacy() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] font-display text-slate-900 dark:text-slate-100 antialiased p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-2xl rounded-[2rem] p-8 md:p-16 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none rounded-[2rem]"></div>
        <div className="pointer-events-none absolute -left-20 -top-20 w-64 h-64 bg-blue-500/20 dark:bg-blue-500/10 blur-[80px] rounded-full"></div>

        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-4">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-2 font-semibold bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm w-max"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              Back to Home
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-12 uppercase tracking-widest">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-10 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us, such as when
                you create or modify your account, request on-demand services,
                contact customer support, or otherwise communicate with us.
              </p>
              <p>
                The types of information we may collect include: your name,
                email address, postal address, profile picture, payment method,
                transaction items and other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
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
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@fundify.ai"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  privacy@fundify.ai
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
