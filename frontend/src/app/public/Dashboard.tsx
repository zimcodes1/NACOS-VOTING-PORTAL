import React, { useState, useMemo, useEffect } from "react";
import { DashboardPage } from "../../pages/home/DashboardPage";
import type { Project, Category, ExhibitionTrack, VoterState } from "../../utils/dataTypes";
import { DUMMY_PROJECTS, INITIAL_VOTER_STATE } from "../../constants/dummy";
import { EXHIBITION_CATEGORIES } from "../../constants/data";

const VOTER_STORAGE_KEY = "nacos_voter_state_v1";

export const DashboardContainer: React.FC = () => {
    // State for projects & categories (ready to be replaced with React Query / Axios API calls)
    const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS);
    const [categories] = useState<Category[]>(EXHIBITION_CATEGORIES);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Filtering State
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedTrack, setSelectedTrack] = useState<ExhibitionTrack>("all");
    const [sortBy, setSortBy] = useState<"popular" | "newest" | "title">("popular");

    // Voter Authentication & Status State (Persisted in localStorage for client UX)
    const [voterState, setVoterState] = useState<VoterState>(() => {
        try {
            const saved = localStorage.getItem(VOTER_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch {
            // fallback
        }
        return INITIAL_VOTER_STATE;
    });

    // Sync voterState with localStorage
    useEffect(() => {
        try {
            localStorage.setItem(VOTER_STORAGE_KEY, JSON.stringify(voterState));
        } catch (e) {
            console.warn("Unable to save voter state to localStorage", e);
        }
    }, [voterState]);

    // Validation function for NSUK Matriculation Number format (e.g. CSC/2021/042, NAS/2022/101)
    const handleVerifyMatric = (matricNumber: string): boolean => {
        const clean = matricNumber.trim().toUpperCase();
        // Regex allows typical university matric formats e.g. ABC/202X/123 or similar alphanumeric patterns
        const matricRegex = /^[A-Z]{2,5}\/\d{4}\/\d{3,5}$/i;
        const isValid = clean.length >= 7; // flexible validation for dev demo

        if (isValid) {
            setVoterState((prev) => ({
                ...prev,
                matricNumber: clean,
                isVerified: true,
            }));
            return true;
        }
        return false;
    };

    const handleClearMatric = () => {
        setVoterState({
            matricNumber: null,
            isVerified: false,
            votedCategoryIds: [],
        });
    };

    // Voting action handler (Wired for future POST /api/votes/ call)
    const handleVote = async (targetProject: Project, matricNumber: string): Promise<boolean> => {
        if (voterState.votedCategoryIds.includes(targetProject.category_id)) {
            return false;
        }

        try {
            // Future API Call Integration:
            // await axios.post('/api/votes/', { matric_number: matricNumber, project_id: targetProject.id });

            // Optimistic UI update
            setProjects((prevProjects) =>
                prevProjects.map((p) =>
                    p.id === targetProject.id
                        ? { ...p, vote_count: p.vote_count + 1 }
                        : p
                )
            );

            setVoterState((prev) => ({
                ...prev,
                votedCategoryIds: [...prev.votedCategoryIds, targetProject.category_id],
            }));

            return true;
        } catch (error) {
            console.error("Vote API failed", error);
            return false;
        }
    };

    // Filtered & Sorted Projects derived computation
    const filteredProjects = useMemo(() => {
        return projects
            .filter((project) => {
                // Category Filter
                if (selectedCategory !== "all" && project.category_id !== selectedCategory) {
                    return false;
                }

                // Track Filter
                if (selectedTrack !== "all" && project.track !== selectedTrack) {
                    return false;
                }

                // Search Query Filter
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const matchTitle = project.title.toLowerCase().includes(q);
                    const matchTagline = project.tagline.toLowerCase().includes(q);
                    const matchCode = project.registration_code.toLowerCase().includes(q);
                    const matchTeam = project.team_name.toLowerCase().includes(q);
                    const matchTags = project.tags?.some((t) => t.toLowerCase().includes(q));

                    if (!matchTitle && !matchTagline && !matchCode && !matchTeam && !matchTags) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                if (sortBy === "popular") return b.vote_count - a.vote_count;
                if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                if (sortBy === "title") return a.title.localeCompare(b.title);
                return 0;
            });
    }, [projects, selectedCategory, selectedTrack, searchQuery, sortBy]);

    return (
        <DashboardPage
            projects={filteredProjects}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            selectedTrack={selectedTrack}
            sortBy={sortBy}
            isLoading={isLoading}
            voterState={voterState}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onTrackChange={setSelectedTrack}
            onSortChange={setSortBy}
            onVote={handleVote}
            onVerifyMatric={handleVerifyMatric}
            onClearMatric={handleClearMatric}
        />
    );
};

export default DashboardContainer;
