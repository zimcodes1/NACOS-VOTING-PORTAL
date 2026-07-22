import React from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Award,
    Users,
    ExternalLink,
    Lock,
    Unlock,
    KeyRound,
    Sparkles,
    Flame,
    Crown,
    AlertTriangle,
} from "lucide-react";
import { Button, Card, Badge } from "../../components/ui";
import { HomeLayout } from "../../components/home";
import type {
    LiveCategoryResult,
    JudgedCategoryResult,
} from "../../utils/dataTypes";

export interface ResultsPageProps {
    liveCategories: LiveCategoryResult[];
    isLoadingLive: boolean;
    isErrorLive: boolean;
    isFetchingLive: boolean;
    unlockCode: string;
    onUnlockCodeChange: (code: string) => void;
    onUnlockSubmit: (e: React.FormEvent) => void;
    isUnlocking: boolean;
    isJudgedUnlocked: boolean;
    judgedCategories: JudgedCategoryResult[];
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
    liveCategories,
    isLoadingLive,
    isErrorLive,
    isFetchingLive,
    unlockCode,
    onUnlockCodeChange,
    onUnlockSubmit,
    isUnlocking,
    isJudgedUnlocked,
    judgedCategories,
}) => {
    return (
        <HomeLayout>
            <div className="space-y-10 select-none">
                {/* Top Hero Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy via-navy to-primary-dark p-6 sm:p-8 text-white shadow-2xl"
                >
                    <div className="relative z-10 max-w-3xl space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-bold text-gold-light">
                                <Trophy className="w-3.5 h-3.5" />
                                <span>Exhibition Results & Telemetry</span>
                            </div>

                            {/* Live Polling Status Indicator */}
                            <div className="fixed bottom-5 right-5 inline-flex items-center gap-2 px-3 py-2.5 rounded-full bg-emerald-500 border border-emerald-400/30 text-xs font-extrabold text-white">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-50" />
                                </span>
                                <span>{isFetchingLive ? "Updating Live..." : "HTTP Stream (3s)"}</span>
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                            Live Leaderboard & Track Results
                        </h1>

                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                            Real-time vote telemetry for public tracks (Design & AI Prompting) and official aggregate standings for the judged Software Track.
                        </p>
                    </div>
                </motion.div >

                {/* ============================================================ */}
                {/* SECTION 1: PUBLIC VOTING TRACKS (LIVE HORIZONTAL BARS) */}
                {/* ============================================================ */}
                <section className="space-y-8">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-gold-dark" />
                                <h2 className="text-xl font-black text-navy">Live Public Voting Standings</h2>
                            </div>
                            <p className="text-xs text-text-secondary">
                                Vote percentages and counts updated live via HTTP polling.
                            </p>
                        </div>

                        {isErrorLive && (
                            <Badge variant="warning" size="sm" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                                Connection Retry
                            </Badge>
                        )}
                    </div>

                    {isLoadingLive ? (
                        <div className="space-y-6">
                            {[1, 2].map((n) => (
                                <div key={n} className="p-6 rounded-3xl bg-surface border border-border space-y-4 animate-pulse">
                                    <div className="h-6 bg-border rounded w-1/3" />
                                    <div className="h-10 bg-border rounded-2xl" />
                                    <div className="h-10 bg-border rounded-2xl" />
                                </div>
                            ))}
                        </div>
                    ) : liveCategories.length === 0 ? (
                        <Card variant="surface" className="p-8 text-center space-y-2 rounded-3xl border border-border">
                            <p className="text-xs text-text-muted italic">No public voting categories currently active.</p>
                        </Card>
                    ) : (
                        <div className="space-y-10">
                            {liveCategories.map((category) => (
                                <Card
                                    key={category.category_id}
                                    variant="surface"
                                    className="p-6 sm:p-8 rounded-3xl border border-border shadow-xl space-y-6 bg-surface"
                                >
                                    {/* Category Header */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                                {category.track === "graphic_design" ? "Design Track" : "AI Prompting Track"}
                                            </span>
                                            <h3 className="text-lg font-black text-navy">{category.category_name}</h3>
                                        </div>

                                        <div className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-navy">
                                            Total Category Votes: <span className="font-black text-primary">{category.total_votes}</span>
                                        </div>
                                    </div>

                                    {/* Custom Animated Horizontal Bars (No Chart Library) */}
                                    <div className="space-y-4">
                                        {category.projects.map((proj) => (
                                            <div key={proj.id} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs font-extrabold text-navy">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy text-white shrink-0">
                                                            {proj.registration_code}
                                                        </span>
                                                        <span className="truncate">{proj.title}</span>
                                                        <span className="text-text-muted font-normal text-[11px] hidden sm:inline truncate">
                                                            ({proj.team_name})
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-navy font-black">{proj.vote_count} votes</span>
                                                        <span className="text-text-muted font-bold text-[11px]">({proj.vote_percentage}%)</span>
                                                    </div>
                                                </div>

                                                {/* Animated Horizontal Bar Container */}
                                                <div className="relative h-7 w-full bg-background rounded-2xl border border-border/80 overflow-hidden p-0.5">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.max(proj.vote_percentage, 2)}%` }}
                                                        transition={{ type: "spring", stiffness: 60, damping: 15 }}
                                                        className="h-full rounded-xl flex items-center justify-end px-3 text-[10px] font-black text-white shadow-xs"
                                                        style={{ backgroundColor: proj.color }}
                                                    >
                                                        {proj.vote_percentage >= 15 && `${proj.vote_percentage}%`}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* "In The Race" Project Cards Section */}
                                    <div className="pt-4 border-t border-border/60 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-gold-dark" />
                                            <h4 className="text-xs font-black uppercase tracking-wider text-navy">
                                                In The Race — {category.category_name}
                                            </h4>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {category.projects.map((proj) => (
                                                <div
                                                    key={proj.id}
                                                    className="p-4 rounded-2xl bg-background border border-border flex items-center gap-3 space-y-0"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-surface border border-border overflow-hidden shrink-0 relative">
                                                        <img src={proj.thumbnail_url} alt={proj.title} className="w-full h-full object-cover" />
                                                        <span
                                                            className="absolute inset-x-0 bottom-0 text-[9px] font-mono font-bold text-center text-white py-0.2"
                                                            style={{ backgroundColor: proj.color }}
                                                        >
                                                            #{proj.rank}
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 flex-1 space-y-0.5">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="text-[10px] font-mono font-bold text-navy">{proj.registration_code}</span>
                                                            <Badge
                                                                variant={proj.rank === 1 ? "gold" : proj.rank === 2 ? "navy" : "outline"}
                                                                size="sm"
                                                            >
                                                                #{proj.rank}
                                                            </Badge>
                                                        </div>
                                                        <h5 className="text-xs font-bold text-navy truncate">{proj.title}</h5>
                                                        <p className="text-[10px] text-text-secondary truncate">{proj.team_name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* ============================================================ */}
                {/* SECTION 2: SOFTWARE TRACK STANDINGS (CONCEALED / SECRET UNLOCK) */}
                {/* ============================================================ */}
                <section className="space-y-8 pt-4">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-black text-navy">Software Track Standings (Judged)</h2>
                            </div>
                            <p className="text-xs text-text-secondary">
                                Judged track results are concealed until unlocked with the official announcement code.
                            </p>
                        </div>

                        {isJudgedUnlocked && (
                            <Badge variant="gold" size="md" icon={<Unlock className="w-4 h-4 text-gold-dark" />}>
                                Standings Revealed
                            </Badge>
                        )}
                    </div>

                    {!isJudgedUnlocked ? (
                        /* Concealed Lock Screen */
                        <Card
                            variant="surface"
                            className="p-8 sm:p-12 text-center rounded-3xl border border-border shadow-2xl bg-gradient-to-b from-surface via-surface to-background space-y-6 max-w-2xl mx-auto"
                        >
                            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 text-gold-dark flex items-center justify-center mx-auto shadow-inner">
                                <Lock className="w-8 h-8" />
                            </div>

                            <div className="space-y-2 max-w-md mx-auto">
                                <h3 className="text-xl font-black text-navy">Software Track Results Concealed</h3>
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    The final aggregate scores and winner standings for the Software Track are locked. Enter the official announcement code to reveal the results.
                                </p>
                            </div>

                            <form onSubmit={onUnlockSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                                <div className="relative w-full">
                                    <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        placeholder="Enter unlock code (e.g. evolve)"
                                        value={unlockCode}
                                        onChange={(e) => onUnlockCodeChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold text-navy border border-border rounded-xl bg-surface focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <Button
                                    variant="primary"
                                    size="md"
                                    type="submit"
                                    isLoading={isUnlocking}
                                    leftIcon={<Unlock className="w-4 h-4" />}
                                    className="font-extrabold w-full sm:w-auto shrink-0 py-2.5"
                                >
                                    Unlock Results
                                </Button>
                            </form>
                        </Card>
                    ) : (
                        /* Unlocked Standings View */
                        <div className="space-y-12">
                            {judgedCategories.map((cat) => (
                                <div key={cat.category_id} className="space-y-8">
                                    <div className="text-center space-y-1">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            Software Track Category
                                        </span>
                                        <h3 className="text-2xl font-black text-navy">{cat.category_name}</h3>
                                    </div>

                                    {/* WINNER SHOWCASE DIV (#1 RANK) */}
                                    {cat.winner && (
                                        <motion.div
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <Card
                                                variant="surface"
                                                className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border-2 border-gold/60 shadow-2xl bg-gradient-to-br from-gold/10 via-surface to-surface space-y-6"
                                            >
                                                {/* Winner Badge Ribbon */}
                                                <div className="absolute top-4 right-4 flex items-center gap-2">
                                                    <span className="px-3 py-1.5 rounded-full bg-gold text-navy font-black text-xs shadow-md inline-flex items-center gap-1.5">
                                                        <Crown className="w-4 h-4 text-navy" />
                                                        Category Winner #1
                                                    </span>
                                                </div>

                                                <div className="flex flex-col md:flex-row items-center gap-6">
                                                    {/* Winner Thumbnail */}
                                                    <div className="w-36 h-36 rounded-2xl bg-background border-2 border-gold/40 overflow-hidden shrink-0 relative shadow-md">
                                                        <img src={cat.winner.thumbnail_url} alt={cat.winner.title} className="w-full h-full object-cover" />
                                                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-navy text-white">
                                                            {cat.winner.registration_code}
                                                        </span>
                                                    </div>

                                                    {/* Winner Info */}
                                                    <div className="flex-1 text-center md:text-left space-y-2">
                                                        <div className="text-xs font-extrabold text-gold-dark flex items-center justify-center md:justify-start gap-1">
                                                            <Trophy className="w-4 h-4" />
                                                            <span>1st Place Gold Champion</span>
                                                        </div>

                                                        <h4 className="text-2xl font-black text-navy leading-snug">{cat.winner.title}</h4>
                                                        {cat.winner.tagline && (
                                                            <p className="text-xs text-text-secondary leading-relaxed max-w-lg">
                                                                {cat.winner.tagline}
                                                            </p>
                                                        )}

                                                        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-navy">
                                                            <span className="flex items-center gap-1.5">
                                                                <Users className="w-4 h-4 text-primary" />
                                                                {cat.winner.team_name}
                                                            </span>

                                                            {cat.winner.live_preview_url && (
                                                                <a
                                                                    href={cat.winner.live_preview_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-extrabold"
                                                                >
                                                                    <span>View Project Demo</span>
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Score Badge */}
                                                    <div className="p-4 rounded-2xl bg-navy text-white text-center border border-white/10 shrink-0 space-y-1">
                                                        <div className="text-[10px] uppercase font-bold text-gold-light tracking-wider">
                                                            Aggregate Score
                                                        </div>
                                                        <div className="text-3xl font-black text-gold">
                                                            {cat.winner.total_score} pts
                                                        </div>
                                                        <div className="text-[10px] text-white/70">
                                                            Avg: {cat.winner.average_score} / 10
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    )}

                                    {/* RUNNERS UP STANDINGS (#2 to #5) */}
                                    {cat.rankings.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-black text-navy uppercase tracking-wider">
                                                Runner-Up Standings
                                            </h4>

                                            <div className="space-y-3">
                                                {cat.rankings.map((proj) => (
                                                    <div
                                                        key={proj.id}
                                                        className="p-4 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-between gap-4"
                                                    >
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center font-black text-sm text-navy shrink-0">
                                                                #{proj.rank}
                                                            </div>

                                                            <div className="w-12 h-12 rounded-xl bg-background border border-border overflow-hidden shrink-0">
                                                                <img src={proj.thumbnail_url} alt={proj.title} className="w-full h-full object-cover" />
                                                            </div>

                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-mono font-bold bg-navy text-white px-2 py-0.5 rounded">
                                                                        {proj.registration_code}
                                                                    </span>
                                                                    <h5 className="text-sm font-extrabold text-navy truncate">{proj.title}</h5>
                                                                </div>
                                                                <p className="text-xs text-text-secondary truncate mt-0.5">{proj.team_name}</p>
                                                            </div>
                                                        </div>

                                                        <div className="text-right shrink-0">
                                                            <div className="text-sm font-black text-navy">{proj.total_score} pts</div>
                                                            <div className="text-[10px] text-text-muted">Avg: {proj.average_score}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div >
        </HomeLayout >
    );
};
