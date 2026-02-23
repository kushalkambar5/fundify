import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import CTA from "../components/landing/CTA";
import Footer from "../components/Footer";

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
