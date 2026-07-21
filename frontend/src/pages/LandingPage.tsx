import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Top Header Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Additional sections */}
      <div id="projects-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Placeholder for project grid */}
      </div>
    </div>
  );
}