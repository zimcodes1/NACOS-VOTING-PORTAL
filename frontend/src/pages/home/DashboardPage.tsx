import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Trophy, Flame } from "lucide-react";
import type { DashboardProps, Project } from "../../utils/dataTypes";
import { HomeLayout, ProjectGrid, MatricVoteModal } from "../../components/home";
import { toast } from "../../components/ui";

export const DashboardPage: React.FC<DashboardProps> = ({
    projects,
    categories,
    selectedCategory,
    searchQuery,
    selectedTrack,
    sortBy,
    voterState,
    onSearchChange,
    onCategoryChange,
    onTrackChange,
    onSortChange,
    onVote,
    onVerifyMatric,
    onClearMatric,
}) => {
    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [targetProjectToVote, setTargetProjectToVote] = useState<Project | null>(null);

    // Compute stats
    const totalVotesCount = projects.reduce((acc, p) => acc + p.vote_count, 0);

    // Handle clicking "Vote" on a card
    const handleInitiateVote = (project: Project) => {
        // Check if voter already voted in this category
        if (voterState.votedCategoryIds.includes(project.category_id)) {
            toast.warning("Category Vote Limit Reached", {
                description: `You have already voted in ${project.category_name}.`,
            });
            return;
        }

        if (!voterState.isVerified || !voterState.matricNumber) {
            setTargetProjectToVote(project);
            setIsVoteModalOpen(true);
            toast.info("Voter Verification Required", {
                description: "Please enter your matric number to cast your vote.",
            });
            return;
        }

        // Directly confirm vote if already verified
        setTargetProjectToVote(project);
        setIsVoteModalOpen(true);
    };

    const handleConfirmVoteSubmit = async (project: Project, matricNumber: string) => {
        const success = await onVote(project, matricNumber);
        if (success) {
            toast.success("Vote Successfully Cast!", {
                description: `Your vote for "${project.title}" (${project.registration_code}) has been recorded.`,
                action: {
                    label: "View Leaderboard",
                    onClick: () => {
                        window.location.href = "/dashboard";
                    },
                },
            });
        } else {
            toast.error("Unable to Cast Vote", {
                description: "Failed to submit vote. You may have already voted in this category.",
            });
        }
    };

    return (
        <HomeLayout
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            selectedTrack={selectedTrack}
            onTrackSelect={onTrackChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            voterState={voterState}
            onOpenVoteModal={() => {
                setTargetProjectToVote(null);
                setIsVoteModalOpen(true);
            }}
            totalProjects={projects.length}
            totalVotes={totalVotesCount}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
            >
                {/* Top Exhibition Welcome Hero Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy to-primary-dark p-6 sm:p-8 text-white shadow-xl">
                    <div className="absolute hidden sm:block -right-10 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute hidden sm:block right-20 top-0 w-48 h-48 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-gold-light">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Annual NACOS Exhibition & Competition</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                            Discover Student Software & Design Innovations
                        </h1>

                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                            Cast your vote for the best student software projects and design works. Real-time voting rules enforce <strong className="text-white font-bold">1 vote per category per matric number</strong>.
                        </p>

                        {/* Stat pills inside banner */}
                        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-white/90">
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <Flame className="w-4 h-4 text-gold" />
                                {projects.length} Verified Entries
                            </span>
                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                                <Trophy className="w-4 h-4 text-emerald-400" />
                                {totalVotesCount} Total Audience Votes
                            </span>
                        </div>
                    </div>
                    {/* Circle decoration top right */}
                    <div className="w-50 sm:w-100 h-50 sm:h-100 rounded-full border-15 sm:border-30 border-background absolute -bottom-25 -right-25 sm:-top-50 sm:-right-50 bg-amber-400"></div>
                </div>

                {/* Project Discovery Grid */}
                <ProjectGrid
                    projects={projects}
                    categories={categories}
                    selectedCategoryId={selectedCategory}
                    selectedTrack={selectedTrack}
                    sortBy={sortBy}
                    votedCategoryIds={voterState.votedCategoryIds}
                    searchQuery={searchQuery}
                    onSortChange={onSortChange}
                    onVote={handleInitiateVote}
                    onCategorySelect={onCategoryChange}
                    onTrackSelect={onTrackChange}
                    onResetFilters={() => {
                        onSearchChange("");
                        onCategoryChange("all");
                        onTrackChange("all");
                        toast.info("Filters Reset", { description: "Showing all exhibition entries." });
                    }}
                />
            </motion.div>

            {/* Matric Verification & Vote Confirmation Modal */}
            <MatricVoteModal
                isOpen={isVoteModalOpen}
                onClose={() => {
                    setIsVoteModalOpen(false);
                    setTargetProjectToVote(null);
                }}
                voterState={voterState}
                selectedProjectToVote={targetProjectToVote}
                onVerify={async (matric) => {
                    const res = await onVerifyMatric(matric);
                    let isValid = false;
                    let error: string | undefined;
                    if (typeof res === "object") {
                        isValid = res.valid;
                        error = res.error;
                    } else {
                        isValid = Boolean(res);
                    }
                    if (isValid) {
                        toast.success("Matric Verified", {
                            description: `Voter status activated for ${matric}.`,
                        });
                    }
                    return { valid: isValid, error };
                }}
                onConfirmVote={handleConfirmVoteSubmit}
                onClearMatric={onClearMatric}
            />
        </HomeLayout>
    );
};

export default DashboardPage;
