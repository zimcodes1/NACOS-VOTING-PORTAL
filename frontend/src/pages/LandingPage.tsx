import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import NacosWeekTimeline from "../components/landing/NacosWeekTimeline";
import FeaturedProjects from "../components/landing/FeaturedProjects";
import WinnerSection from "../components/landing/WinnerSection";
import JudgesSection from "../components/landing/JudgesSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
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

      {/* Additional sections */}
      <div id="projects-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Placeholder for project grid */}
      </div>
    </div>
  );
}