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
} from "lucide-react";
import type { Project, Category, ExhibitionTrack } from "../../utils/dataTypes";
import { SORT_OPTIONS } from "../../constants/data";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "../ui";
import { cn } from "../../utils/cn";

interface ProjectGridProps {
  projects: Project[];
  categories: Category[];
  selectedCategoryId: string;
  selectedTrack?: ExhibitionTrack;
  sortBy: "popular" | "newest" | "title";
  votedCategoryIds: string[];
  searchQuery: string;
  onSortChange: (sortBy: "popular" | "newest" | "title") => void;
  onVote: (project: Project) => void;
  onCategorySelect?: (categoryId: string) => void;
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

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  categories,
  selectedCategoryId,
  sortBy,
  votedCategoryIds,
  searchQuery,
  onSortChange,
  onVote,
  onCategorySelect,
  onResetFilters,
}) => {
  const allCategories: Category[] = [
    {
      id: "all",
      name: "All Projects",
      slug: "all",
      description: "Browse all student software and design entries across all categories",
      requires_payment: false,
      fee_amount: 0,
      project_count: projects.length,
      icon_name: "Grid",
    },
    ...(categories || []),
  ];

  const currentCategory = allCategories.find((c) => String(c.id) === String(selectedCategoryId));
  const activeCategoryName = currentCategory ? currentCategory.name : "All Projects";

  return (
    <div className="space-y-6">
      {/* Top Categories Tabs Navigation */}
      {allCategories.length > 0 && (
        <div className="w-full border-b border-border pb-4">
          <div className="flex w-full overflow-x-scroll max-sm:flex-wrap items-center gap-2 no-scrollbar py-1 scroll-smooth">
            {allCategories.map((cat) => {
              const isSelected = String(selectedCategoryId) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategorySelect && onCategorySelect(cat.id)}
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
                      isSelected
                        ? "bg-white/15 text-white"
                        : "bg-background text-text-muted"
                    )}
                  >
                    {getCategoryIcon(cat.icon_name)}
                  </span>
                  <span>{cat.name}</span>
                  {cat.project_count > 0 && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-background text-text-muted border border-border"
                      )}
                    >
                      {cat.project_count}
                    </span>
                  )}
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryTab"
                      className="absolute inset-0 rounded-2xl bg-navy -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-navy tracking-tight">
              {activeCategoryName}
            </h1>
            <Badge variant="primary" size="md">
              {projects.length} {projects.length === 1 ? "Entry" : "Entries"}
            </Badge>
          </div>
          {currentCategory && (
            <p className="text-xs font-medium text-text-secondary mt-1 max-w-2xl">
              {currentCategory.description}
            </p>
          )}
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

      {/* Grid Cards Container */}
      {projects.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {projects.map((project) => {
              const hasVoted = votedCategoryIds.includes(project.category_id);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  hasVotedInCategory={hasVoted}
                  onVote={onVote}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
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
                ? `No projects matched "${searchQuery}" in this category.`
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
