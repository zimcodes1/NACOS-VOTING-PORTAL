import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SearchX,
  ArrowUpDown,
  Filter,
  Code2,
  Palette,
  BrainCircuit,
  ShieldCheck,
  Grid,
  Lock,
} from "lucide-react";
import type { Project, Category, ExhibitionTrack } from "../../utils/dataTypes";
import { SORT_OPTIONS } from "../../constants/data";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "../ui";
import { cn } from "../../utils/cn";

interface ProjectGridProps {
  projects: Project[];
  categories: Category[];
  selectedCategoryId?: string;
  selectedTrack: ExhibitionTrack;
  sortBy: "popular" | "newest" | "title";
  votedCategoryIds: string[];
  searchQuery: string;
  onSortChange: (sortBy: "popular" | "newest" | "title") => void;
  onVote: (project: Project) => void;
  onCategorySelect?: (categoryId: string) => void;
  onTrackSelect?: (track: ExhibitionTrack) => void;
  onResetFilters: () => void;
}

const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case "Code2":
      return <Code2 className="w-4 h-4" />;
    case "Palette":
      return <Palette className="w-4 h-4" />;
    case "BrainCircuit":
      return <BrainCircuit className="w-4 h-4" />;
    case "ShieldCheck":
      return <ShieldCheck className="w-4 h-4" />;
    default:
      return <Grid className="w-4 h-4" />;
  }
};

const TRACK_TABS: { id: ExhibitionTrack; name: string; icon: React.ReactNode }[] = [
  { id: "all", name: "All Tracks", icon: <Grid className="w-4 h-4" /> },
  { id: "software", name: "Software Track", icon: <Code2 className="w-4 h-4" /> },
  { id: "graphic_design", name: "Design Track", icon: <Palette className="w-4 h-4" /> },
  { id: "ai_prompting", name: "AI Prompting", icon: <BrainCircuit className="w-4 h-4" /> },
];

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  categories,
  selectedTrack = "all",
  sortBy,
  votedCategoryIds,
  searchQuery,
  onSortChange,
  onVote,
  onTrackSelect,
  onResetFilters,
}) => {
  // Filter categories by selected track (if specific track selected)
  const trackCategories = categories.filter((cat) => {
    if (selectedTrack === "all") return true;
    return cat.track === selectedTrack;
  });

  // SORT CATEGORIES: Categories with voting_open === true appear at the VERY TOP
  const sortedCategories = [...trackCategories].sort((a, b) => {
    const aOpen = a.voting_open !== false ? 1 : 0;
    const bOpen = b.voting_open !== false ? 1 : 0;
    if (aOpen !== bOpen) return bOpen - aOpen; // open first
    return a.name.localeCompare(b.name);
  });

  // Group projects by category
  const projectsByCategory = sortedCategories.map((cat) => {
    const catProjects = projects.filter((p) => {
      const pCatId = String(p.category_id || (p.category as any)?.id || "");
      return pCatId === String(cat.id);
    });
    return {
      category: cat,
      projects: catProjects,
    };
  });

  // Projects not matching any category (if any)
  const orphanProjects = projects.filter((p) => {
    const pCatId = String(p.category_id || (p.category as any)?.id || "");
    return !categories.some((c) => String(c.id) === pCatId);
  });

  return (
    <div className="space-y-8">
      {/* Top Track Tabs Navigation */}
      <div className="w-full border-b border-border pb-4">
        <div className="flex w-full overflow-x-scroll max-sm:flex-wrap items-center gap-2 no-scrollbar py-1 scroll-smooth">
          {TRACK_TABS.map((tab) => {
            const isSelected = selectedTrack === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTrackSelect && onTrackSelect(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border select-none",
                  isSelected
                    ? "bg-navy text-white border-navy shadow-md shadow-navy/20"
                    : "bg-surface text-text-secondary border-border hover:bg-background hover:text-navy hover:border-border/80"
                )}
              >
                <span
                  className={cn(
                    "p-1 rounded-lg shrink-0 transition-colors",
                    isSelected ? "bg-white/15 text-white" : "bg-background text-text-muted"
                  )}
                >
                  {tab.icon}
                </span>
                <span>{tab.name}</span>
                {isSelected && (
                  <motion.div
                    layoutId="activeTrackTab"
                    className="absolute inset-0 rounded-2xl bg-navy -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Search & Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold text-navy tracking-tight">
            {selectedTrack === "all"
              ? "All Exhibition Entries"
              : TRACK_TABS.find((t) => t.id === selectedTrack)?.name}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Showing {projects.length} {projects.length === 1 ? "entry" : "entries"} across {sortedCategories.length} categories
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-text-muted flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort:
          </span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as "popular" | "newest" | "title")
            }
            className="px-3 py-1.5 text-xs font-bold bg-surface border border-border rounded-xl text-navy focus:outline-none focus:border-primary transition-all cursor-pointer shadow-xs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Category Sections (Voting OPEN categories sorted at the TOP) */}
      {projects.length > 0 ? (
        <div className="space-y-12">
          {projectsByCategory.map(({ category, projects: catProjects }) => {
            const isVotingOpen = category.voting_open !== false;

            if (catProjects.length === 0 && searchQuery) return null;

            return (
              <section key={category.id} className="space-y-4">
                {/* Category Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-primary-light text-primary">
                        {getCategoryIcon(category.icon_name)}
                      </span>
                      <h2 className="text-lg font-bold text-navy tracking-tight">
                        {category.name}
                      </h2>

                      {/* Voting Status Indicator Badge */}
                      {isVotingOpen ? (
                        <Badge variant="success" size="sm" pulse>
                          Voting Active
                        </Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          <Lock className="w-3 h-3 mr-1" />
                          Voting Closed
                        </Badge>
                      )}
                    </div>
                    {category.description && (
                      <p className="text-xs text-text-secondary pl-8">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <Badge variant="muted" size="sm" className="self-start sm:self-auto">
                    {catProjects.length} {catProjects.length === 1 ? "Entry" : "Entries"}
                  </Badge>
                </div>

                {/* Category Projects Grid */}
                {catProjects.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {catProjects.map((project) => {
                        const hasVoted = votedCategoryIds.includes(project.category_id);
                        return (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            hasVotedInCategory={hasVoted}
                            isVotingOpen={isVotingOpen}
                            onVote={onVote}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <div className="py-6 px-4 text-center rounded-2xl bg-background border border-dashed border-border text-xs text-text-muted">
                    No submissions verified in this category yet.
                  </div>
                )}
              </section>
            );
          })}

          {/* Orphan projects fallback (if any) */}
          {orphanProjects.length > 0 && (
            <section className="space-y-4 pt-4">
              <div className="pb-2 border-b border-border">
                <h2 className="text-lg font-bold text-navy">Other Entries</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {orphanProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    hasVotedInCategory={votedCategoryIds.includes(project.category_id)}
                    isVotingOpen={true}
                    onVote={onVote}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Empty State Fallback */
        <div className="py-16 px-4 text-center rounded-3xl bg-surface border border-dashed border-border space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy">No matching entries found</h3>
            <p className="text-xs text-text-secondary">
              {searchQuery
                ? `No projects matched "${searchQuery}" in this track.`
                : "No project submissions have been verified for this filter combination yet."}
            </p>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-primary bg-primary-light/60 border border-primary/30 rounded-xl hover:bg-primary-light transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
