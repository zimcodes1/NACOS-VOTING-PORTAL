import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Save,
  CheckCircle2,
  ExternalLink,
  Users,
  Sliders,
  Info,
} from "lucide-react";
import { Button, Card, Badge } from "../../components/ui";
import { toast } from "../../components/ui/Toast";
import { HomeLayout } from "../../components/home";
import { fetchJudgeDashboardData, saveProjectScores } from "../../api/judgingAPI";
import { judgeAuthStore } from "../../utils/judgeAuthStore";
import type { JudgeProject, ScoreCriterion } from "../../utils/dataTypes";

export default function JudgeScoringPage() {
  const navigate = useNavigate();
  const search: any = useSearch({ strict: false });
  const projectId = search?.projectId || "";
  const queryClient = useQueryClient();

  const judge = judgeAuthStore.getJudge();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!judgeAuthStore.isLoggedIn()) {
      navigate({ to: "/home/judge-login" });
    }
  }, [navigate]);

  // Fetch judge dashboard data (includes categories, criteria, projects & existing scores)
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["judgeDashboardData", judge?.id],
    queryFn: () => fetchJudgeDashboardData(judge?.id),
    enabled: !!judge,
  });

  // Locate target project and its category criteria
  let project: JudgeProject | null = null;
  let categoryName = "";
  let criteria: ScoreCriterion[] = [];

  if (dashboardData && projectId) {
    for (const cat of dashboardData.categories) {
      const foundProj = cat.projects.find((p) => String(p.id) === String(projectId));
      if (foundProj) {
        project = foundProj as JudgeProject;
        categoryName = cat.name;
        criteria = cat.criteria as ScoreCriterion[];
        break;
      }
    }
  }

  // Track user's active edits in local state
  const [userScores, setUserScores] = useState<Record<string, number>>({});

  // Resolve active score for each criterion (user edit takes precedence over database score)
  const scoreValues: Record<string, number> = {};
  criteria.forEach((c) => {
    if (c.id in userScores) {
      scoreValues[c.id] = userScores[c.id];
    } else {
      const existing = project?.scores.find((s) => String(s.criterion_id) === String(c.id));
      scoreValues[c.id] = existing ? existing.value : 0;
    }
  });

  // Handle score value change for a criterion
  const handleScoreChange = (criterionId: string, val: number, maxScore: number) => {
    const bounded = Math.min(Math.max(val, 0), maxScore);
    setUserScores((prev) => ({ ...prev, [criterionId]: bounded }));
  };

  // Compute calculated total scores
  let totalAwarded = 0;
  let maxPossible = 0;
  criteria.forEach((c) => {
    const val = scoreValues[c.id] || 0;
    totalAwarded += val;
    maxPossible += c.max_score;
  });
  const percentage = maxPossible > 0 ? Math.round((totalAwarded / maxPossible) * 100) : 0;

  // Save Draft Mutation
  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = criteria.map((c) => ({
        criterion_id: c.id,
        value: scoreValues[c.id] || 0,
      }));
      return saveProjectScores(projectId, payload, judge?.id);
    },
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Draft Scores Saved!", {
          description: `Saved evaluations for ${project?.title || "project"}.`,
        });
        queryClient.invalidateQueries({ queryKey: ["judgeDashboardData"] });
      } else {
        toast.error("Failed to Save Draft", { description: res.error });
      }
    },
  });

  if (isLoading) {
    return (
      <HomeLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-border rounded w-1/3 mx-auto" />
            <div className="h-64 bg-border rounded-3xl" />
          </div>
        </div>
      </HomeLayout>
    );
  }

  if (!project) {
    return (
      <HomeLayout>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-red-500/10 text-red-600 font-bold inline-block">
            Project not found or not assigned.
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/home/judge" })}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back to Judge Dashboard
            </Button>
          </div>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 select-none">
        {/* Top Header & Back Button */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/home/judge" })}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
            className="font-extrabold"
          >
            Back to Panel
          </Button>

          <div className="flex items-center gap-2">
            <Badge
              variant={
                project.scoring_status === "submitted"
                  ? "success"
                  : project.scoring_status === "draft_saved"
                    ? "gold"
                    : "outline"
              }
              size="md"
            >
              {project.scoring_status === "submitted"
                ? "Submitted & Locked"
                : project.scoring_status === "draft_saved"
                  ? "Draft Saved"
                  : "Evaluation Pending"}
            </Badge>
          </div>
        </div>

        {/* Project Details Banner */}
        <Card variant="surface" className="p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Thumbnail Image */}
            <div className="w-full md:w-56 h-40 rounded-2xl bg-background border border-border overflow-hidden shrink-0 relative">
              <img
                src={project.thumbnail_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-navy/90 text-white border border-white/20">
                {project.registration_code}
              </span>
            </div>

            {/* Content info */}
            <div className="flex-1 space-y-3">
              <div className="space-y-1">
                <div className="text-xs font-bold text-primary uppercase tracking-wider">
                  {categoryName}
                </div>
                <h1 className="text-2xl font-black text-navy leading-snug">
                  {project.title}
                </h1>
              </div>

              {project.tagline && (
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  {project.tagline}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-navy border-t border-border/60">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  {project.team_name || project.contact_name}
                </span>

                {project.live_preview_url && (
                  <a
                    href={project.live_preview_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-extrabold"
                  >
                    <span>View Live Application</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {project.description && (
            <div className="p-4 rounded-2xl bg-background border border-border/80 text-xs text-text-secondary leading-relaxed">
              <span className="font-bold text-navy block mb-1">Project Overview:</span>
              {project.description}
            </div>
          )}
        </Card>

        {/* Criteria Evaluation Form */}
        <Card variant="surface" className="p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-black text-navy">Evaluation Criteria Metrics</h2>
            </div>
            <span className="text-xs text-text-muted font-medium">
              Score each criterion within its maximum points limit.
            </span>
          </div>

          {criteria.length === 0 ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-950 text-xs flex items-center gap-2 font-bold">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              No evaluation criteria attached to this category yet.
            </div>
          ) : (
            <div className="space-y-6">
              {criteria.map((c, index) => {
                const currentScore = scoreValues[c.id] || 0;
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-5 rounded-2xl bg-background border border-border space-y-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-navy">{c.name}</h3>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          Maximum Points: <span className="font-bold text-navy">{c.max_score}</span>
                          {c.weight !== 1 && ` • Weight: ${c.weight}x`}
                        </p>
                      </div>

                      {/* Numeric Badge Preview */}
                      <div className="px-3 py-1 rounded-xl bg-primary-light text-primary font-black text-sm border border-primary/20">
                        {currentScore} / {c.max_score} pts
                      </div>
                    </div>

                    {/* Interactive Slider & Controls */}
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={c.max_score}
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(c.id, parseInt(e.target.value) || 0, c.max_score)
                        }
                        disabled={project.scoring_status === "submitted"}
                        className="flex-1 accent-primary h-2 bg-border rounded-lg cursor-pointer"
                      />

                      {/* Score Input Box */}
                      <input
                        type="number"
                        min={0}
                        max={c.max_score}
                        value={currentScore}
                        onChange={(e) =>
                          handleScoreChange(c.id, parseInt(e.target.value) || 0, c.max_score)
                        }
                        disabled={project.scoring_status === "submitted"}
                        className="w-16 px-2.5 py-1.5 text-center text-sm font-black text-navy border border-border rounded-xl bg-surface focus:border-primary focus:outline-none"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Score Calculation Summary Footer */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center font-black text-lg border border-gold/30 shrink-0">
                {percentage}%
              </div>
              <div>
                <div className="text-xs font-bold text-navy">Total Awarded Score</div>
                <div className="text-xs text-text-secondary">
                  <strong className="text-navy font-black">{totalAwarded}</strong> out of{" "}
                  <strong className="text-navy font-black">{maxPossible}</strong> maximum possible points
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => saveMutation.mutate()}
              isLoading={saveMutation.isPending}
              disabled={project.scoring_status === "submitted" || criteria.length === 0}
              leftIcon={
                project.scoring_status === "submitted" ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              className="py-3 font-extrabold w-full sm:w-auto"
            >
              {project.scoring_status === "submitted" ? "Evaluation Locked" : "Save Draft Evaluation"}
            </Button>
          </div>
        </Card>
      </div>
    </HomeLayout>
  );
}
