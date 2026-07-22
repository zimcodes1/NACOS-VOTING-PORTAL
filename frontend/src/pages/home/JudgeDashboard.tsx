import React, { useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
    Award,
    CheckCircle2,
    ExternalLink,
    Users,
    Building2,
    Send,
    Lock,
    ArrowRight,
    Info,
} from "lucide-react";
import { Button, Card, Badge } from "../../components/ui";
import { toast } from "../../components/ui/Toast";
import { HomeLayout } from "../../components/home";
import { judgeAuthStore } from "../../utils/judgeAuthStore";
import { fetchJudgeDashboardData, submitCategoryScores } from "../../api/judgingAPI";

export default function JudgeDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const judge = judgeAuthStore.getJudge();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!judgeAuthStore.isLoggedIn()) {
            navigate({ to: "/home/judge-login" });
        }
    }, [navigate]);

    // Fetch Judge Dashboard Data
    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ["judgeDashboardData", judge?.id],
        queryFn: () => fetchJudgeDashboardData(judge?.id),
        enabled: !!judge,
    });

    // Extract judge title and first name for personalized welcome greeting
    const greetingName = useMemo(() => {
        if (!judge?.name) return "Specialist Judge";
        const firstName = judge.name.trim().split(" ")[0];
        return judge.title ? `${judge.title} ${firstName}` : firstName;
    }, [judge]);

    // Category Score Submission Mutation
    const submitCategoryMutation = useMutation({
        mutationFn: (categoryId: string) => submitCategoryScores(categoryId, judge?.id),
        onSuccess: (res) => {
            if (res.success) {
                toast.success("Category Evaluation Submitted!", {
                    description: "All project evaluations in this category have been finalized.",
                });
                queryClient.invalidateQueries({ queryKey: ["judgeDashboardData"] });
            } else {
                toast.error("Submission Failed", { description: res.error });
            }
        },
    });

    if (!judge) return null;

    return (
        <HomeLayout>
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 select-none">
                {/* Welcome Greeting Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-navy to-primary-dark p-6 sm:p-8 text-white shadow-2xl"
                >
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute right-20 top-0 w-48 h-48 bg-gold/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-gold-light">
                            <Award className="w-3.5 h-3.5" />
                            <span>Judges' Evaluation Panel</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            Welcome back, {greetingName}!
                        </h1>

                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                            Select an entry under your assigned categories below to evaluate metrics, input criterion scores, and finalize category evaluations.
                        </p>
                    </div>
                </motion.div>

                {/* Loading Skeleton */}
                {isLoading ? (
                    <div className="space-y-6">
                        <div className="h-8 bg-border rounded w-1/4 animate-pulse" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((n) => (
                                <div key={n} className="h-64 bg-border rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    </div>
                ) : !dashboardData || dashboardData.categories.length === 0 ? (
                    <Card variant="surface" className="p-8 text-center space-y-4 rounded-3xl border border-border">
                        <Info className="w-10 h-10 text-text-muted mx-auto" />
                        <h2 className="text-lg font-bold text-navy">No Assigned Evaluation Categories</h2>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">
                            There are currently no exhibition categories assigned to your judge profile. Please contact the portal administrator.
                        </p>
                    </Card>
                ) : (
                    /* Categories List */
                    <div className="space-y-12">
                        {dashboardData.categories.map((category) => {
                            const totalProjects = category.projects.length;
                            const scoredCount = category.projects.filter(
                                (p) => p.scoring_status === "draft_saved" || p.scoring_status === "submitted"
                            ).length;
                            const canSubmitCategory =
                                totalProjects > 0 &&
                                scoredCount === totalProjects &&
                                !category.all_submitted;

                            return (
                                <section key={category.id} className="space-y-6">
                                    {/* Category Header Bar */}
                                    <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-5 h-5 text-primary" />
                                                <h2 className="text-xl font-black text-navy">{category.name}</h2>
                                            </div>
                                            {category.description && (
                                                <p className="text-xs text-text-secondary">{category.description}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                            <span className="text-xs font-bold text-navy px-3 py-1.5 rounded-xl bg-background border border-border">
                                                Progress: <strong className="text-primary font-black">{scoredCount}</strong> / {totalProjects} Scored
                                            </span>

                                            {category.all_submitted ? (
                                                <Badge variant="success" size="md" icon={<CheckCircle2 className="w-4 h-4" />}>
                                                    Category Evaluation Finalized
                                                </Badge>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    disabled={!canSubmitCategory || submitCategoryMutation.isPending}
                                                    isLoading={submitCategoryMutation.isPending}
                                                    leftIcon={<Send className="w-4 h-4" />}
                                                    onClick={() => submitCategoryMutation.mutate(category.id)}
                                                    className="font-extrabold"
                                                >
                                                    Submit All Scores
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Category Projects Grid */}
                                    {category.projects.length === 0 ? (
                                        <div className="p-6 rounded-2xl bg-background border border-border text-xs text-text-muted text-center italic">
                                            No project submissions in this category yet.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {category.projects.map((project) => (
                                                <Card
                                                    key={project.id}
                                                    variant="surface"
                                                    className="group relative flex flex-col h-full overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 rounded-3xl p-5 space-y-4"
                                                >
                                                    {/* Media Header */}
                                                    <div className="relative h-44 w-full bg-background rounded-2xl overflow-hidden border border-border/80">
                                                        <img
                                                            src={project.thumbnail_url}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />

                                                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-navy/90 text-white backdrop-blur-md border border-white/20">
                                                                {project.registration_code}
                                                            </span>

                                                            <Badge
                                                                variant={
                                                                    project.scoring_status === "submitted"
                                                                        ? "success"
                                                                        : project.scoring_status === "draft_saved"
                                                                            ? "gold"
                                                                            : "outline"
                                                                }
                                                                size="sm"
                                                            >
                                                                {project.scoring_status === "submitted"
                                                                    ? "Submitted"
                                                                    : project.scoring_status === "draft_saved"
                                                                        ? "Draft Saved"
                                                                        : "Not Scored"}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Content Body */}
                                                    <div className="flex-1 flex flex-col justify-between space-y-3">
                                                        <div className="space-y-1.5">
                                                            <h3 className="text-base font-bold text-navy leading-snug group-hover:text-primary transition-colors">
                                                                {project.title}
                                                            </h3>
                                                            {project.tagline && (
                                                                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                                                                    {project.tagline}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {/* Team / Creator Affordance */}
                                                        <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-navy font-semibold">
                                                            <span className="flex items-center gap-1.5 truncate">
                                                                <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                                                                <span className="truncate">{project.team_name || project.contact_name}</span>
                                                            </span>

                                                            {project.live_preview_url && (
                                                                <a
                                                                    href={project.live_preview_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary hover:text-primary-dark font-bold text-[11px] inline-flex items-center gap-1 shrink-0"
                                                                >
                                                                    <span>Demo</span>
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="pt-2">
                                                            <Button
                                                                variant={project.scoring_status === "submitted" ? "outline" : "primary"}
                                                                size="sm"
                                                                fullWidth
                                                                rightIcon={
                                                                    project.scoring_status === "submitted" ? (
                                                                        <Lock className="w-3.5 h-3.5 text-text-muted" />
                                                                    ) : (
                                                                        <ArrowRight className="w-3.5 h-3.5" />
                                                                    )
                                                                }
                                                                onClick={() =>
                                                                    navigate({
                                                                        to: "/home/judge/score",
                                                                        search: { projectId: project.id },
                                                                    })
                                                                }
                                                                className="font-extrabold py-2.5"
                                                            >
                                                                {project.scoring_status === "submitted"
                                                                    ? "View Score Submission"
                                                                    : project.scoring_status === "draft_saved"
                                                                        ? "Edit Score Draft"
                                                                        : "Score Project"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}
