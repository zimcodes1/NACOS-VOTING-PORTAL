import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardPage } from "../../pages/home/DashboardPage";
import type { Project, Category, ExhibitionTrack, VoterState } from "../../utils/dataTypes";
import { INITIAL_VOTER_STATE } from "../../constants/dummy";
import { fetchCategories, fetchProjects, castVote, verifyVoter } from "../../api/dashboardAPI";
import Preloader from "../../components/ui/Preloader";
import { toast } from "../../components/ui";
import { voterSession } from "../../utils/voterSession";

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
        queryFn: () => fetchCategories(),
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

    // Sync voter state with voterSession
    useEffect(() => {
        const syncSession = () => {
            const voter = voterSession.getVerifiedVoter();
            if (voter) {
                setVoterState((prev) => ({
                    ...prev,
                    matricNumber: voter.matric_number,
                    isVerified: true,
                }));
            }
        };

        syncSession();
        window.addEventListener("voter-session-changed", syncSession);
        return () => window.removeEventListener("voter-session-changed", syncSession);
    }, []);

    const handleVerifyMatric = async (
        matricNumber: string,
        password?: string
    ): Promise<{ valid: boolean; error?: string }> => {
        const clean = matricNumber.trim().toUpperCase();
        if (!MATRIC_REGEX.test(clean)) {
            return { valid: false, error: "Invalid matric number format. E.g., FT24CMP0123" };
        }

        const res = await verifyVoter(clean, password);
        if (res.valid) {
            voterSession.setVerifiedVoter({
                matric_number: res.matric_number || clean,
                name: res.name || "Verified Voter",
                passcode: password,
            });
            setVoterState((prev) => ({
                ...prev,
                matricNumber: clean,
                isVerified: true,
            }));
            return { valid: true };
        } else {
            return { valid: false, error: res.message || res.error || "Verification failed." };
        }
    };

    const handleClearMatric = () => {
        voterSession.clearVerifiedVoter();
        setVoterState({
            matricNumber: null,
            isVerified: false,
            votedCategoryIds: [],
        });
    };

    // TanStack Mutation for voting
    const voteMutation = useMutation({
        mutationFn: ({ project, matricNumber, password }: { project: Project; matricNumber: string; password?: string }) =>
            castVote(project.id, matricNumber, password),
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

    const handleVote = async (targetProject: Project, matricNumber: string, password?: string): Promise<boolean> => {
        if (voterState.votedCategoryIds.includes(targetProject.category_id)) {
            toast.warning("Category Vote Limit Reached", {
                description: `You have already voted in ${targetProject.category_name}.`,
            });
            return false;
        }

        const currentPass = password || voterSession.getVerifiedVoter()?.passcode;

        try {
            const res = await voteMutation.mutateAsync({ project: targetProject, matricNumber, password: currentPass });
            if (!res.success) {
                toast.error("Unable to Cast Vote", {
                    description: res.error || "Failed to submit vote.",
                });
                return false;
            }
            return true;
        } catch (error) {
            console.error("Vote API failed", error);
            toast.error("Unable to Cast Vote", {
                description: "A network or server error occurred.",
            });
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
