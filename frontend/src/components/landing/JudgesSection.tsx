import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchJudges } from "../../api/dashboardAPI";
import type { Judge } from "../../utils/dataTypes";
import { Card } from "../ui";
import { Award, Briefcase, User } from "lucide-react";
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
              <div key={n} className="h-64 bg-border rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (judges.length === 0) return null;

  return (
    <section id="judges" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/60">
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-light text-primary border border-primary/20">
          <Award className="w-3.5 h-3.5" />
          <span>Professional Evaluation Panel</span>
        </div>
        <h2 className="text-3xl font-black text-navy tracking-tight sm:text-4xl">
          Meet Our Esteemed Judges
        </h2>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">
          Distinguished industry experts and academic professionals leading the assessment of the Software Track submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {judges.map((judge, index) => (
          <motion.div
            key={judge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              variant="surface"
              className="group h-full relative overflow-hidden bg-surface border border-border hover:border-primary/40 hover:shadow-2xl transition-all duration-300 rounded-3xl p-6 flex flex-col items-center text-center space-y-4"
            >
              {/* Judge Image Wrapper */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 shadow-md group-hover:scale-105 transition-transform duration-300 bg-background flex items-center justify-center shrink-0">
                {judge.image_url ? (
                  <img
                    src={judge.image_url}
                    alt={judge.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-text-muted" />
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-black text-navy leading-snug tracking-tight group-hover:text-primary transition-colors">
                    {judge.name || "Specialist Judge"}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-xs text-primary font-bold mt-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{judge.title || "Evaluation Committee Member"}</span>
                  </div>
                  {judge.bio && (
                    <p className="text-xs text-text-secondary leading-relaxed mt-3 text-justify line-clamp-4">
                      {judge.bio}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
