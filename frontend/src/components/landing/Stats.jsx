import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function Stats() {
  const statsRef = useRef(null);

  useEffect(() => {
    // ScrollTrigger-like reveal (using IntersectionObserver for simplicity without ScrollTrigger plugin overhead here, or just a delayed entrance)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              statsRef.current.children,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-transparent border-y border-slate-200 dark:border-white/5 py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-white/[0.02] pointer-events-none"></div>
      <div
        ref={statsRef}
        className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10"
      >
        <div className="text-center md:border-r border-slate-200 dark:border-white/10 last:border-0 opacity-0 group">
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-2 group-hover:scale-110 transition-transform duration-300">
            50k+
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
            Active Fundify Users
          </p>
        </div>

        <div className="text-center md:border-r border-slate-200 dark:border-white/10 last:border-0 opacity-0 group">
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-emerald-400 dark:from-primary dark:to-emerald-500 mb-2 group-hover:scale-110 transition-transform duration-300">
            $2.4B
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
            Assets Tracked
          </p>
        </div>

        <div className="text-center md:border-r border-slate-200 dark:border-white/10 last:border-0 opacity-0 group">
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-2 group-hover:scale-110 transition-transform duration-300">
            256-bit
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
            Security Standard
          </p>
        </div>

        <div className="text-center opacity-0 group">
          <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-2 group-hover:scale-110 transition-transform duration-300">
            99.9%
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold tracking-wide uppercase">
            Fundify Uptime
          </p>
        </div>
      </div>
    </section>
  );
}

export default Stats;
