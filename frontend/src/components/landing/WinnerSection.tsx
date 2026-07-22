import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
    Trophy,
    Crown,
    Code2,
    Palette,
    Sparkles,
    ArrowRight,
    Clock,
    Tag,
    Users,
} from "lucide-react";
import { fetchLiveResults, unlockJudgedResults } from "../../api/resultsAPI";
import { Button, Badge } from "../ui";
import type { LiveCategoryResult, JudgedCategoryResult } from "../../utils/dataTypes";

interface TrackWinner {
    trackKey: "software" | "graphic_design" | "ai_prompting";
    trackName: string;
    trackColor: string;
    bgGradient: string;
    borderColor: string;
    watermarkIcon: React.ElementType;
    badgeVariant: "primary" | "gold" | "success";
    winner?: {
        code: string;
        title: string;
        teamName: string;
        categoryName: string;
        metricLabel: string;
    };
}

export const WinnerSection: React.FC = () => {
    // Fetch live public vote results
    const { data: liveCategories = [] } = useQuery<LiveCategoryResult[]>({
        queryKey: ["liveResultsWinners"],
        queryFn: fetchLiveResults,
    });

    // Fetch judged software track results using announcement code
    const { data: judgedData } = useQuery<{
        unlocked: boolean;
        categories?: JudgedCategoryResult[];
    }>({
        queryKey: ["judgedResultsWinners"],
        queryFn: () => unlockJudgedResults("evolve"),
    });

    // Resolve Software Track Leader
    const softwareCat = judgedData?.categories?.find(
        (c) => c.winner !== null && c.winner !== undefined
    );
    const softwareWinner = softwareCat?.winner;

    // Resolve Design Track Leader
    const designCat = liveCategories.find((c) => c.track === "graphic_design");
    const designLeader = designCat?.projects?.[0];

    // Resolve AI Prompting Track Leader
    const aiCat = liveCategories.find((c) => c.track === "ai_prompting");
    const aiLeader = aiCat?.projects?.[0];

    const tracks: TrackWinner[] = [
        {
            trackKey: "software",
            trackName: "Software Track",
            trackColor: "text-indigo-400",
            bgGradient: "from-slate-900 via-indigo-950/80 to-navy",
            borderColor: "border-indigo-500/40 hover:border-indigo-400",
            watermarkIcon: Code2,
            badgeVariant: "primary",
            winner: softwareWinner
                ? {
                    code: softwareWinner.registration_code,
                    title: softwareWinner.title,
                    teamName: softwareWinner.team_name,
                    categoryName: softwareCat?.category_name || "Software Innovation",
                    metricLabel: `${softwareWinner.total_score} pts (Judged)`,
                }
                : undefined,
        },
        {
            trackKey: "graphic_design",
            trackName: "Graphic Design Track",
            trackColor: "text-emerald-400",
            bgGradient: "from-slate-900 via-emerald-950/80 to-[#064E3B]",
            borderColor: "border-emerald-500/40 hover:border-emerald-400",
            watermarkIcon: Palette,
            badgeVariant: "success",
            winner:
                designLeader && designLeader.vote_count > 0
                    ? {
                        code: designLeader.registration_code,
                        title: designLeader.title,
                        teamName: designLeader.team_name,
                        categoryName: designCat?.category_name || "Design & Branding",
                        metricLabel: `${designLeader.vote_count} votes (${designLeader.vote_percentage}%)`,
                    }
                    : undefined,
        },
        {
            trackKey: "ai_prompting",
            trackName: "AI Prompting Track",
            trackColor: "text-amber-400",
            bgGradient: "from-slate-900 via-amber-950/80 to-stone-900",
            borderColor: "border-amber-500/40 hover:border-amber-400",
            watermarkIcon: Sparkles,
            badgeVariant: "primary",
            winner:
                aiLeader && aiLeader.vote_count > 0
                    ? {
                        code: aiLeader.registration_code,
                        title: aiLeader.title,
                        teamName: aiLeader.team_name,
                        categoryName: aiCat?.category_name || "AI Art & Prompts",
                        metricLabel: `${aiLeader.vote_count} votes (${aiLeader.vote_percentage}%)`,
                    }
                    : undefined,
        },
    ];

    return (
        <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 text-white">
            {/* Animated Light Glow Background Beams */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.35, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
                {/* Section Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-extrabold text-gold-light backdrop-blur-md shadow-sm"
                    >
                        <Crown className="w-4 h-4 text-gold" />
                        <span>EXHIBITION CHAMPIONS</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                    >
                        Track Winners & Standings
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal"
                    >
                        Official champions leading the 3 exhibition tracks. Click to view detailed score breakdowns on the live results portal.
                    </motion.p>
                </div>

                {/* 3 Differently Coloured Track Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {tracks.map((t, idx) => {
                        const WatermarkIcon = t.watermarkIcon;

                        return (
                            <motion.div
                                key={t.trackKey}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="h-full"
                            >
                                <div
                                    className={`relative flex flex-col justify-between h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${t.bgGradient} border ${t.borderColor} shadow-2xl transition-all duration-300 overflow-hidden group`}
                                >
                                    {/* Huge Watermark Icon in Card Background */}
                                    <div className="absolute -right-6 -bottom-6 text-white/5 group-hover:text-white/10 transition-all duration-500 pointer-events-none select-none">
                                        <WatermarkIcon className="w-48 h-48 sm:w-56 sm:h-56 stroke-[1]" />
                                    </div>

                                    <div className="relative z-10 space-y-6">
                                        {/* Top Row: Track Name & Badge */}
                                        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                                            <span className={`text-xs font-black uppercase tracking-wider ${t.trackColor}`}>
                                                {t.trackName}
                                            </span>
                                            <Badge variant={t.badgeVariant} size="sm">
                                                {t.winner ? "Track Leader" : "Pending"}
                                            </Badge>
                                        </div>

                                        {/* Content Section: Winner Metadata OR Placeholder */}
                                        {t.winner ? (
                                            <div className="space-y-4 pt-2">
                                                {/* Project Code & Title */}
                                                <div className="space-y-1.5">
                                                    <div className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-white/15 text-white border border-white/20">
                                                        {t.winner.code}
                                                    </div>
                                                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug group-hover:text-gold-light transition-colors">
                                                        {t.winner.title}
                                                    </h3>
                                                </div>

                                                {/* Metadata Details */}
                                                <div className="space-y-2 text-xs text-slate-300">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="font-semibold text-white truncate">{t.winner.teamName}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate">{t.winner.categoryName}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 pt-1 font-bold text-gold-light">
                                                        <Trophy className="w-3.5 h-3.5 text-gold" />
                                                        <span>{t.winner.metricLabel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Placeholder State when winner is yet to be announced */
                                            <div className="space-y-4 py-4 text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                                                    <Clock className="w-7 h-7 animate-pulse" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-bold text-white">Results Pending</h4>
                                                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                                                        Voting or judging evaluation for this track is actively underway. Results will be released shortly.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bottom Action CTA Link */}
                                    <div className="relative z-10 pt-6 border-t border-white/10">
                                        <Button
                                            variant="outline"
                                            size="md"
                                            rightIcon={<ArrowRight className="w-4 h-4" />}
                                            onClick={() => {
                                                window.location.href = "/results";
                                            }}
                                            className="w-full justify-between font-extrabold text-white border-white/20 hover:bg-white/10 hover:border-white/40"
                                        >
                                            <span>{t.winner ? "View Full Standings" : "Check Live Telemetry"}</span>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WinnerSection;
