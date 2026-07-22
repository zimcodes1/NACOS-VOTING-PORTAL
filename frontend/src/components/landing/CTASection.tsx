import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, UserPlus, Sparkles, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Button, Badge } from "../ui";

export const CTASection: React.FC = () => {
    // Check if current date is before August 6th of current year
    const isBeforeAug6 = (() => {
        const now = new Date();
        const aug6 = new Date(now.getFullYear(), 7, 6, 0, 0, 0, 0); // Month 7 = August (0-indexed)
        return now < aug6;
    })();

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl bg-navy p-8 sm:p-12 border border-border/40 shadow-2xl"
            >
                {/* Decorative Background Glows */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Text & Information */}
                    <div className="space-y-4 text-center md:text-left max-w-2xl">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                            <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
                                NACOS NSUK Exhibition 2026
                            </Badge>
                            {isBeforeAug6 ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                                    <Clock className="w-3.5 h-3.5" />
                                    Registration Open (Closes Aug 6)
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Live Voting Active
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Ready to Explore Innovations & Track Live Results?
                        </h2>

                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                            Access real-time project metrics, voter leaderboards, and judge evaluation scores on the dashboard.
                            {isBeforeAug6 && " Student teams can also submit their software projects prior to August 6th."}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full sm:w-auto">
                        <Link to="/dashboard" className="w-full sm:w-auto">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                leftIcon={<BarChart3 className="w-5 h-5" />}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                View Dashboard
                            </Button>
                        </Link>

                        {isBeforeAug6 && (
                            <Link to="/register" className="w-full sm:w-auto">
                                <Button
                                    variant="gold"
                                    size="lg"
                                    fullWidth
                                    leftIcon={<UserPlus className="w-5 h-5" />}
                                >
                                    Register Project
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default CTASection;
