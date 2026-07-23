import { useQuery } from "@tanstack/react-query";
import { fetchJudges } from "../../api/dashboardAPI";
import type { Judge } from "../../utils/dataTypes";
import { Award, Briefcase, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function JudgesSection() {
  const { data: judges = [], isLoading } = useQuery<Judge[]>({
    queryKey: ["judges"],
    queryFn: fetchJudges,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-border rounded w-1/4 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-border rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      id="judges"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-border/60"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-primary-light text-primary border border-primary/20">
          <Award className="w-4 h-4 text-primary" />
          <span>PRO EVALUATION PANEL</span>
        </div>

        <h2 className="text-3xl font-black text-navy tracking-tight sm:text-4xl">
          Meet Our Esteemed Judges
        </h2>

        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          Distinguished industry leaders and academic specialists presiding over the evaluation of our Software Exhibition projects.
        </p>
      </div>

      {judges.length === 0 ? (
        /* Premium Empty State Placeholder Card */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-surface via-surface to-background border border-border/80 text-center space-y-5 max-w-3xl mx-auto shadow-xl relative overflow-hidden"
        >
          {/* Ambient Background Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto text-gold shadow-md">
              <Award className="w-8 h-8 text-gold animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-navy tracking-tight">
                Details About Our Judges Would Be Out Soon
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary max-w-lg mx-auto leading-relaxed">
                Our panel of distinguished industry experts and academic specialists is currently being finalized. Stay tuned for the official jury announcement!
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Judges Cards Grid with Full Image & Bottom Gradient */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {judges.map((judge, index) => (
            <motion.div
              key={judge.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="h-full"
            >
              <div className="group h-100 relative w-full aspect-[3/4.2] rounded-3xl overflow-hidden shadow-xl border border-border/80 hover:border-primary/50 hover:shadow-2xl transition-all duration-500 bg-navy select-none">
                {/* Background Full Image */}
                {judge.image_url ? (
                  <img
                    src={judge.image_url}
                    alt={judge.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-navy via-navy-dark to-slate-900 flex items-center justify-center">
                    <User className="w-24 h-24 text-white/10" />
                  </div>
                )}

                {/* Dark Gradient Overlay from Bottom Up */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Top Track / Status Badge Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-black/40 text-gold-light border border-white/20 backdrop-blur-md shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                    Official Jury
                  </span>
                </div>

                {/* Bottom Details Content (White Text) */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col justify-end text-left space-y-2 z-10 text-white">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight group-hover:text-gold-light transition-colors drop-shadow-sm">
                    {judge.name || "Specialist Judge"}
                  </h3>

                  <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-gold-light/90">
                    <Briefcase className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="truncate">{judge.title || "Evaluation Committee Member"}</span>
                  </div>

                  {judge.bio && (
                    <p className="text-xs text-slate-200/90 leading-relaxed font-normal pt-1 line-clamp-3 drop-shadow-xs">
                      {judge.bio}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
