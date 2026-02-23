import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

function Hero() {
  const contentRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    // Initial timeline for entrance animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Animate the left content elements (badge, h1, p, buttons, social proof)
    tl.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
    );

    // Animate the right visual card
    tl.fromTo(
      cardRef.current,
      { opacity: 0, x: 50, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1 },
      "-=0.6",
    );
  }, []);

  return (
    <section className="relative pt-20 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <div ref={contentRef} className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            New: Fundify AI Wealth Optimization
          </div>

          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.04em]">
            Understand Your Money. Improve Your{" "}
            <span className="text-primary drop-shadow-[0_0_15px_rgba(13,242,185,0.3)]">
              Financial Health.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-lg">
            Fundify provides AI-driven insights to track net worth, optimize
            spending, and reach your goals faster. Secure, automated, and built
            for the modern investor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/signup"
              className="text-center bg-navy-deep dark:bg-primary text-white dark:text-navy-deep px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_40px_-10px_rgba(10,25,47,0.5)] dark:shadow-[0_10px_40px_-10px_rgba(13,242,185,0.5)] hover:-translate-y-1 hover:scale-[1.02] transition-all"
            >
              Start Fundify Free Trial
            </Link>
            <button className="flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors dark:text-white">
              <span className="material-symbols-outlined">play_circle</span>
              See How Fundify Works
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex -space-x-3">
              <img
                alt="User avatar 1"
                className="size-10 rounded-full border-2 border-white dark:border-navy-deep object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA06eR1icPqjI-EiR2dOSkCN6L1kdOmCHsvWWzn3BQK_jVD8R6k7oqeiuC12TkD-uhSu31TS6xgKSf6oKS2S-qnjGg8WzcxtW7Jiv7kkYnjBhC0c-vseqX6FEzgwAoNpHEThdBp9S_sDU1O8ZmInw4SZsMWMtLHz7bZ1GfIWNpM8NvukhbhNJCUNiI52QHlWouTQNd40OSO1OXC5P_32zjPMtvPYosJcEjAKqsprMWPY4rucRt1HV5gsyBv4L3vm0vmJVRb_rRK_rQ"
              />
              <img
                alt="User avatar 2"
                className="size-10 rounded-full border-2 border-white dark:border-navy-deep object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-pAQJuoesM5hU81LLE74YqDhM929gIrE3kNy65_3oQxbADCbCkCqLZfptFWXkPh4bOWrv5wOHN2xZX6OEPkzvdq2x7ukmS-GniTat1KjsdLL8vTBveX0-BZe1HiogKNu4K3_Xzs-acYsM44CmDXwwz9vNtaRH28pgSQ_kub6Xe1j0V_jebiICt3ti4PhfWqtNZy5AOGZ9eUug_kBKulR6mdQknVZRmSZvAYSjwSXAXOaGlw9lquNuhPwzWWfrV4PuVV3rNmW3Mi4"
              />
              <img
                alt="User avatar 3"
                className="size-10 rounded-full border-2 border-white dark:border-navy-deep object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_SyLCaobfLVXWFGn_BjvHsyFGOqugp9i25-qygJifJWwztgQkQHriuodbAMcYFO3_EfUyPDPA9WNu_jWTirYfkxbfMJmNKSovqugqMhRkp7KfjKdxQ_ONJxN01s4qfgZYJK6RAUSb6oRdI89lmPTXz4qe0Zoqhyyop0BvsB4LecUtAIf1iKlsOXxxAp4HTJWqJkyMrV4BukqMO0euVos_f1Lxs9ViEBsk3J5BX9pvv7qe_cD785FIKX178uroHiVKCvzoEBPsydY"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Trusted by{" "}
              <span className="text-slate-900 dark:text-white font-bold">
                50,000+
              </span>{" "}
              active Fundify users
            </p>
          </div>
        </div>

        {/* Right Side: Visual Data Card */}
        <div ref={cardRef} className="relative opacity-0">
          {" "}
          {/* Initial opacity 0 for GSAP */}
          {/* Background blurred element */}
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full -z-10 transform translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-sky-500/20 blur-[100px] rounded-full w-64 h-64 -z-10"></div>
          <div className="glass-card dark:bg-background-dark/80 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                  Fundify Portfolio Balance
                </p>
                <h3 className="text-3xl font-black tracking-tight">
                  $248,392.10
                </h3>
                <p className="text-primary text-sm font-bold flex items-center gap-1 mt-1">
                  <span className="material-symbols-outlined text-sm">
                    trending_up
                  </span>
                  +12.4% vs last month
                </p>
              </div>
              <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">
                  account_balance_wallet
                </span>
              </div>
            </div>

            {/* Chart visualization bars */}
            <div className="h-48 w-full flex items-end gap-2 mb-6">
              <div className="bg-primary/20 w-full h-[40%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300"></div>
              <div className="bg-primary/30 w-full h-[55%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300"></div>
              <div className="bg-primary/40 w-full h-[45%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300"></div>
              <div className="bg-primary/60 w-full h-[70%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300"></div>
              <div className="bg-primary/80 w-full h-[60%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300"></div>
              <div className="bg-primary w-full h-[95%] rounded-t-md transform origin-bottom hover:scale-y-105 transition-transform duration-300 relative group">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-navy-deep text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Current: $248k
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Health Score
                </p>
                <p className="text-xl font-black dark:text-white">84/100</p>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-primary/50 to-primary h-full rounded-full w-0 animate-[growWidth_1.5s_ease-out_forwards] shadow-[0_0_10px_rgba(13,242,185,0.5)]"
                    style={{ "--target-width": "84%" }}
                  ></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/50 transition-colors backdrop-blur-sm">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Savings Rate
                </p>
                <p className="text-xl font-black dark:text-white">22.5%</p>
                <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-400/50 to-emerald-400 h-full rounded-full w-0 animate-[growWidth_1.5s_ease-out_forwards_0.5s] shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ "--target-width": "45%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-12 hidden md:block bg-navy-deep dark:bg-background-dark/90 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-white/10 max-w-[200px] hover:scale-105 transition-transform origin-bottom-left cursor-default group z-20">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">
                  auto_awesome
                </span>
              </div>
              <p className="text-xs font-bold">Fundify Assistant</p>
            </div>
            <p className="relative text-[11px] leading-relaxed opacity-80 italic">
              "Based on current trends in your Fundify account, you can retire 2
              years earlier."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
