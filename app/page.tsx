"use client";

import Footer from "@/components/landing-page/Footer";
import Header from "@/components/landing-page/Header";
import LandingHeroSection from "@/components/landing-page/LandingHero";

export default function Home() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <Header />
      <LandingHeroSection />
      <Footer />
    </div>
  );
}
