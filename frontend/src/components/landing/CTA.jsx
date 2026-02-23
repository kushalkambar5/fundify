import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function CTA() {
  const ctaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              ctaRef.current,
              { opacity: 0, scale: 0.95, y: 30 },
              { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-32">
      <div
        ref={ctaRef}
        className="relative bg-gradient-to-br from-navy-deep to-background-dark dark:border-white/10 dark:border rounded-3xl p-12 md:p-20 overflow-hidden opacity-0 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 size-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -top-24 -left-24 size-64 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl flex flex-col gap-6">
          <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-md">
            Ready to take control of your financial future?
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join 50,000+ others who use Fundify to grow their net worth. Start
            your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="bg-primary text-navy-deep px-10 py-5 rounded-xl font-bold text-lg btn-hover-animate shadow-[0_0_20px_rgba(13,242,185,0.4)]">
              Get Started with Fundify
            </button>
            <button className="text-white border border-white/20 px-10 py-5 rounded-xl font-bold text-lg btn-hover-animate backdrop-blur-sm">
              Contact Fundify Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;
