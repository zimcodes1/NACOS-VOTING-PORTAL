import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardPage } from "../../pages/home/DashboardPage";
import type { Project, Category, ExhibitionTrack, VoterState } from "../../utils/dataTypes";
import { INITIAL_VOTER_STATE } from "../../constants/dummy";
import { fetchCategories, fetchProjects, castVote } from "../../api/dashboardAPI";
import Preloader from "../../components/ui/Preloader";

const VOTER_STORAGE_KEY = "nacos_voter_state_v1";
const MATRIC_REGEX = /^(?:FT\d{2}[A-Z]{3,4}\d{3,5}|[A-Z]{2,5}\/\d{4}\/\d{3,5}|[A-Z0-9]{7,15})$/i;

export const DashboardContainer: React.FC = () => {
    const queryClient = useQueryClient();

    // Track preloader animation completion (strictly once on initial mount)
    const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

    // Filtering State
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedTrack, setSelectedTrack] = useState<ExhibitionTrack>("all");
    const [sortBy, setSortBy] = useState<"popular" | "newest" | "title">("popular");

    // TanStack Queries for categories and projects
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const { data: projects = [], isLoading: isProjectsLoading } = useQuery<Project[]>({
        queryKey: ["projects", selectedCategory, selectedTrack, searchQuery],
        queryFn: () =>
            fetchProjects({
                category: selectedCategory !== "all" ? selectedCategory : undefined,
                search: searchQuery.trim() || undefined,
                track: selectedTrack !== "all" ? selectedTrack : undefined,
            }),
    });

    // Voter Authentication & Status State (Persisted in localStorage)
    const [voterState, setVoterState] = useState<VoterState>(() => {
        try {
            const saved = localStorage.getItem(VOTER_STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch {
            // fallback
        }
        return INITIAL_VOTER_STATE;
    });

    useEffect(() => {
        try {
            localStorage.setItem(VOTER_STORAGE_KEY, JSON.stringify(voterState));
        } catch (e) {
            console.warn("Unable to save voter state to localStorage", e);
        }
    }, [voterState]);

    const handleVerifyMatric = (matricNumber: string): boolean => {
        const clean = matricNumber.trim().toUpperCase();
        const isValid = MATRIC_REGEX.test(clean);

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

    // TanStack Mutation for voting
    const voteMutation = useMutation({
        mutationFn: ({ project, matricNumber }: { project: Project; matricNumber: string }) =>
            castVote(project.id, matricNumber),
        onSuccess: (res, { project }) => {
            if (!res.success) {
                if (res.isConflict) {
                    setVoterState((prev) => ({
                        ...prev,
                        votedCategoryIds: Array.from(new Set([...prev.votedCategoryIds, project.category_id])),
                    }));
                }
                return;
            }

            // Optimistically update query cache with new vote count
            queryClient.setQueryData(
                ["projects", selectedCategory, selectedTrack, searchQuery],
                (old: Project[] = []) =>
                    old.map((p) =>
                        p.id === project.id
                            ? { ...p, vote_count: res.vote_count ?? (p.vote_count + 1) }
                            : p
                    )
            );

            setVoterState((prev) => ({
                ...prev,
                votedCategoryIds: Array.from(new Set([...prev.votedCategoryIds, project.category_id])),
            }));
        },
    });

    const handleVote = async (targetProject: Project, matricNumber: string): Promise<boolean> => {
        if (voterState.votedCategoryIds.includes(targetProject.category_id)) {
            return false;
        }

        try {
            const res = await voteMutation.mutateAsync({ project: targetProject, matricNumber });
            return res.success;
        } catch (error) {
            console.error("Vote API failed", error);
            return false;
        }
    };

    // Filtered & Sorted Projects derived computation
    const filteredProjects = useMemo(() => {
        return [...projects]
            .filter((project) => {
                const projCatId = String(project.category_id || project.category?.id || "");
                const selCatId = String(selectedCategory);
                if (selCatId !== "all" && projCatId !== selCatId) {
                    return false;
                }
                if (selectedTrack !== "all" && project.track !== selectedTrack) {
                    return false;
                }
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase();
                    const matchTitle = project.title.toLowerCase().includes(q);
                    const matchTagline = project.tagline?.toLowerCase().includes(q);
                    const matchCode = project.registration_code?.toLowerCase().includes(q);
                    const matchTeam = project.team_name?.toLowerCase().includes(q);
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

    // Show preloader strictly ONCE during initial page load
    if (!isPreloaderComplete) {
        return (
            <Preloader
                minDuration={1800}
                onComplete={() => setIsPreloaderComplete(true)}
            />
        );
    }

    return (
        <DashboardPage
            projects={filteredProjects}
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            selectedTrack={selectedTrack}
            sortBy={sortBy}
            isLoading={isProjectsLoading}
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
