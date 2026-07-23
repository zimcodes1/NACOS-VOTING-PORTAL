import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicStats } from "../../api/dashboardAPI";
import { useNavigate } from "@tanstack/react-router";
import MainSlide from "./hero/MainSlide";
import SoftwareSlide from "./hero/SoftwareSlide";
import GraphicSlide from "./hero/GraphicSlide";
import AISlide from "./hero/AISlide";

const SLIDE_DURATION = 7000; // 7 seconds per slide

export const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const { data: stats } = useQuery({
    queryKey: ["publicStats"],
    queryFn: fetchPublicStats,
  });

  const activeProjectsCount = stats ? stats.active_projects : 0;
  const verifiedVotersCount = stats ? stats.verified_voters : 0;
  const navigate = useNavigate();

  // Automatic slide rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  // Background ambient color glows configuration per slide
  const ambientColors = [
    { primary: "bg-primary/10", secondary: "bg-gold/10" },
    { primary: "bg-indigo-500/15", secondary: "bg-cyan-500/15" },
    { primary: "bg-amber-500/15", secondary: "bg-purple-500/15" },
    { primary: "bg-emerald-500/15", secondary: "bg-teal-500/15" },
  ];

  const currentGlow = ambientColors[currentSlide];

  return (
    <section className="relative overflow-hidden bg-background py-8 sm:py-12 border-b border-border min-h-[calc(100vh-5rem)] flex flex-col justify-between items-center sm:min-h-screen">
      {/* Dynamic Background Ambient Soft Glows */}
      <motion.div
        key={`glow-primary-${currentSlide}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className={`absolute -left-20 top-0 w-[30rem] h-[30rem] ${currentGlow.primary} rounded-full blur-3xl pointer-events-none`}
      />
      <motion.div
        key={`glow-secondary-${currentSlide}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
        className={`absolute -right-20 bottom-0 w-[30rem] h-[30rem] ${currentGlow.secondary} rounded-full blur-3xl pointer-events-none`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex items-center">
        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-main"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <MainSlide
                activeProjectsCount={activeProjectsCount}
                verifiedVotersCount={verifiedVotersCount}
                onNavigateHome={() => navigate({ to: "/home" })}
                onNavigateRegister={() => navigate({ to: "/register" })}
              />
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-software"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <SoftwareSlide
                onExploreTrack={() => navigate({ to: "/home", search: { track: "software" } })}
                onRegisterProject={() => navigate({ to: "/register" })}
              />
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-graphic"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <GraphicSlide
                onExploreTrack={() => navigate({ to: "/home", search: { track: "graphic_design" } })}
                onRegisterProject={() => navigate({ to: "/register" })}
              />
            </motion.div>
          )}

          {currentSlide === 3 && (
            <motion.div
              key="slide-ai"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full"
            >
              <AISlide
                onExploreTrack={() => navigate({ to: "/home", search: { track: "ai_prompting" } })}
                onRegisterProject={() => navigate({ to: "/register" })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Slide Indicators & Progress Bar */}
      <div className="relative z-20 pt-6 pb-2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5">
          {["Event Overview", "Software Track", "Design Track", "AI Prompting"].map((label, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className="group flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
              title={label}
            >
              <div className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 bg-border hover:bg-navy/30" style={{ width: currentSlide === idx ? "2.5rem" : "0.75rem" }}>
                {currentSlide === idx && (
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        <span className="text-[10px] font-mono font-bold text-text-muted">
          Slide {currentSlide + 1} of 4 • {["Overview", "Software", "Graphic Design", "AI Prompting"][currentSlide]}
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
