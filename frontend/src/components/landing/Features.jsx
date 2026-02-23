import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function Features() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              containerRef.current.querySelectorAll(".feature-card"),
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.2)",
              },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto" ref={containerRef}>
        <div className="text-center mb-20 max-w-2xl mx-auto flex flex-col gap-4 feature-card opacity-0">
          <p className="text-primary font-bold text-xs uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(13,242,185,0.4)]">
            Institutional-Grade Features
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            Master your finances with Fundify
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Fundify combines AI intelligence with institutional-grade analytics
            to give you a complete, crystal-clear picture of your wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                analytics
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Financial Health Score</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Real-time analysis of your standing based on 20+ proprietary
              Fundify metrics including liquidity and debt-to-income.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              Explore Fundify Scoring{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                pie_chart
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Net Worth Analytics</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Consolidated view of all assets. Track real estate, crypto, and
              portfolios in one institutional Fundify dashboard.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              View Analytics{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                smart_toy
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">AI Financial Assistant</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Natural language queries in Fundify to understand your spending
              habits. Ask for instant answers about your history.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              Chat with Fundify AI{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Budgeting</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Automated categorization and personalized limit alerts. Fundify
              algorithms predict future bills based on history.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              Manage Budgets{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                trending_up
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Investment Tracking</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Real-time performance monitoring across all global portfolios.
              Compare your performance against market benchmarks.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              Track Portfolio{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>

          <div className="feature-card opacity-0 group bg-white/60 dark:bg-white/[0.03] backdrop-blur-md p-8 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-primary/20 transition-all hover:-translate-y-2 hover:border-primary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-emerald-400 group-hover:text-navy-deep transition-all duration-300 shadow-inner group-hover:shadow-[0_0_15px_rgba(13,242,185,0.5)] relative z-10">
              <span className="material-symbols-outlined text-3xl">
                security
              </span>
            </div>
            <h3 className="text-xl font-bold mb-3">Bank-Level Security</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Fundify data is read-only and protected with enterprise-grade
              256-bit encryption. We never store your credentials.
            </p>
            <a
              className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              href="#"
            >
              Privacy Policy{" "}
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
