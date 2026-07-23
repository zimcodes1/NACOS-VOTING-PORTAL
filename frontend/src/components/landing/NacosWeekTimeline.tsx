import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { bgDecoIcons, events } from "../../constants/data";
import { ArrowRight, Calendar } from "lucide-react";
export const NacosWeekTimeline: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll progress for vertical white line
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 70%", "end 85%"],
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#064E3B] via-[#047857] to-[#064E3B] py-16 sm:py-24 text-white">
            {/* Ambient Glowing Orbs */}
            <div className="absolute -left-20 top-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -right-20 bottom-1/4 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Random Event-Themed Background Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                {bgDecoIcons.map((item, idx) => {
                    const DecoIcon = item.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0.12, rotate: item.rotate }}
                            animate={{
                                y: [0, -14, 0],
                                rotate: [item.rotate, item.rotate + 10, item.rotate],
                            }}
                            transition={{
                                duration: 5 + (idx % 3),
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: item.delay,
                            }}
                            className={`absolute text-white/70 ${item.size}`}
                            style={{
                                top: item.top,
                                left: item.left,
                                right: item.right,
                            }}
                        >
                            <DecoIcon className="w-full h-full" />
                        </motion.div>
                    );
                })}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-16 sm:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-extrabold text-emerald-200 backdrop-blur-md shadow-sm"
                    >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>NACOS WEEK 2026 ROADMAP</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                    >
                        5 Days of Excellence & Innovation
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal"
                    >
                        The Software Exhibition & Innovation portal is just one highlight of our annual NACOS Week. Scroll through the roadmap to explore the complete 5-day event schedule.
                    </motion.p>
                </div>

                {/* Roadmap Timeline Container */}
                <div ref={containerRef} className="relative max-w-5xl mx-auto">
                    {/* Vertical Linking White Line Track */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 bg-white/20 rounded-full -translate-x-1/2 pointer-events-none" />

                    {/* Scroll-Aware Growing White Line */}
                    <motion.div
                        style={{ scaleY }}
                        className="absolute left-4 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-white via-amber-300 to-white rounded-full -translate-x-1/2 origin-top pointer-events-none shadow-sm"
                    />

                    {/* Timeline Events List */}
                    <div className="space-y-12 sm:space-y-16">
                        {events.map((evt, idx) => {
                            const Icon = evt.icon;
                            const isEven = idx % 2 === 0;

                            return (
                                <motion.div
                                    key={evt.day}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-80px" }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Central Checkpoint Node (Dot & Icon) */}
                                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-300 ${evt.isSpotlight
                                                ? "bg-amber-400 border-white text-emerald-950 ring-4 ring-amber-300/50 scale-110"
                                                : "bg-emerald-900 border-white/80 text-white"
                                                }`}
                                        >
                                            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>

                                        {/* Thursday Spotlight Pulse Ring */}
                                        {evt.isSpotlight && (
                                            <span className="absolute inset-0 rounded-full bg-amber-400 opacity-75 animate-ping" />
                                        )}
                                    </div>

                                    {/* Content Card Wrapper */}
                                    <div
                                        className={`pl-12 md:pl-0 w-full md:w-[calc(50%-3rem)] ${isEven ? "md:pr-0 md:text-right" : "md:pl-0 md:text-left"
                                            }`}
                                    >
                                        <div
                                            className={`p-6 sm:p-8 rounded-3xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${evt.isSpotlight
                                                ? "bg-gradient-to-br from-amber-400/20 via-white/15 to-white/10 border-2 border-amber-300 shadow-2xl shadow-amber-500/20"
                                                : "bg-white/10 border border-white/20 hover:border-white/40 shadow-xl"
                                                }`}
                                        >
                                            {/* Decorative Background Glow for Spotlight */}
                                            {evt.isSpotlight && (
                                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
                                            )}

                                            <div className="space-y-3 relative z-10">
                                                {/* Day Tag & Date */}
                                                <div
                                                    className={`flex items-center gap-2 text-xs font-bold ${isEven ? "md:justify-end" : "md:justify-start"
                                                        }`}
                                                >
                                                    <span
                                                        className={`px-3 py-1 rounded-full border backdrop-blur-md ${evt.isSpotlight
                                                            ? "bg-amber-400 text-emerald-950 font-black border-amber-300 shadow-sm"
                                                            : "bg-white/15 text-emerald-100 border-white/20"
                                                            }`}
                                                    >
                                                        {evt.tag}
                                                    </span>

                                                    <span className="text-emerald-200 font-mono font-semibold">
                                                        {evt.day}, {evt.date}
                                                    </span>
                                                </div>

                                                {/* Event Title */}
                                                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                                                    {evt.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                                                    {evt.description}
                                                </p>

                                                {/* Special Callout for Thursday Spotlight */}
                                                {evt.isSpotlight && (
                                                    <div
                                                        className={`pt-3 flex items-center ${isEven ? "md:justify-end" : "md:justify-start"
                                                            }`}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const el = document.getElementById("projects-grid");
                                                                if (el) el.scrollIntoView({ behavior: "smooth" });
                                                            }}
                                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-emerald-950 font-black text-xs hover:bg-amber-300 transition-colors shadow-md cursor-pointer"
                                                        >
                                                            <span>Explore Exhibition Entries</span>
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NacosWeekTimeline;
