import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import NacosWeekTimeline from "../components/landing/NacosWeekTimeline";
import FeaturedProjects from "../components/landing/FeaturedProjects";
import WinnerSection from "../components/landing/WinnerSection";
import JudgesSection from "../components/landing/JudgesSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* 5 NACOS Week Events Animated Roadmap */}
      <NacosWeekTimeline />

      {/* Featured Exhibition Projects Carousel */}
      <FeaturedProjects />

      {/* Track Winners Showcase Section */}
      <WinnerSection />

      {/* Judges Section */}
      <JudgesSection />

      {/* Small CTA Section */}
      <CTASection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}