import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { fetchProjects } from "../../api/dashboardAPI";
import { ProjectCard } from "../home/ProjectCard";
import { Card, Button } from "../ui";
import type { Project } from "../../utils/dataTypes";

export const FeaturedProjects: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Fetch up to 10 recent projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["featuredProjects"],
    queryFn: () => fetchProjects(),
  });

  const featuredList = projects.slice(0, 10);

  // Handle responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const maxIndex = Math.max(0, featuredList.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const visibleProjects = featuredList.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="py-16 sm:py-24 bg-background border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header & Carousel Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EXHIBITION SHOWCASE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight leading-tight">
              Featured Exhibition Entries
            </h2>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
              Explore ground-breaking software, AI prompts, and graphic design creations submitted by NACOS innovators for the 2026 Innovation Event.
            </p>
          </div>

          {/* Carousel Buttons */}
          {featuredList.length > itemsPerPage && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Project"
                className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-navy hover:bg-primary-light hover:text-primary hover:border-primary/30 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Project"
                className="w-11 h-11 rounded-2xl bg-surface border border-border flex items-center justify-center text-navy hover:bg-primary-light hover:text-primary hover:border-primary/30 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-surface border border-border p-6 animate-pulse space-y-4"
              >
                <div className="h-40 bg-border/60 rounded-xl" />
                <div className="h-6 bg-border/60 rounded w-2/3" />
                <div className="h-4 bg-border/60 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : featuredList.length === 0 ? (
          <Card variant="surface" className="p-8 text-center rounded-2xl border border-border space-y-2">
            <p className="text-xs text-text-muted italic">
              No exhibition projects available at the moment.
            </p>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[420px]">
              <AnimatePresence mode="popLayout">
                {visibleProjects.map((proj) => (
                  <motion.div
                    key={proj.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="h-full"
                  >
                    <ProjectCard
                      project={proj}
                      hasVotedInCategory={false}
                      onVote={() => {
                        const el = document.getElementById("projects-grid");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.location.href = "/home";
                        }
                      }}
                      exhibit={true}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination Indicators & View All Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/60">
              {/* Dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? "w-8 bg-primary"
                        : "w-2.5 bg-border hover:bg-text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* View Full Discovery Grid CTA */}
              <Button
                variant="outline"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  window.location.href = "/home";
                }}
                className="font-extrabold text-navy border-border hover:border-primary"
              >
                Explore All Exhibition Projects
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
