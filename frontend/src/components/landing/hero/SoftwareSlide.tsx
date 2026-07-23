import React from "react";
import { motion } from "framer-motion";
import { Code2, ArrowRight, Layers, Terminal, Cpu, GitBranch, Server, Globe, CheckCircle2, Sparkles } from "lucide-react";
import { Text, Button, Badge } from "../../ui";

export interface SoftwareSlideProps {
  onExploreTrack: () => void;
  onRegisterProject: () => void;
}

export const SoftwareSlide: React.FC<SoftwareSlideProps> = ({
  onExploreTrack,
  onRegisterProject,
}) => {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
      {/* LEFT SECTION: Track Info & CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-start text-left space-y-6 max-w-xl z-10"
      >
        {/* Track Badge */}
        <Badge variant="primary" className="py-2 bg-primary/10 text-primary border-primary/20" icon={<Code2 className="w-4 h-4 text-primary" />}>
          Track 01 — Software Engineering & Apps
        </Badge>

        {/* Main Track Headline */}
        <div className="space-y-2">
          <Text variant="h1" color="navy" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Build & Deploy <span className="text-primary">Full-Stack Solutions</span>
          </Text>
          <Text variant="subtitle" color="secondary" className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
            Demonstrate web apps, mobile solutions, APIs, and algorithms built by NACOS student developers. Evaluated on code architecture, user experience, scalability, and real-world impact.
          </Text>
        </div>

        {/* Highlight Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Full-Stack & APIs</div>
              <div className="text-[11px] text-text-muted">Web, Mobile & Backend services</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Clean Architecture</div>
              <div className="text-[11px] text-text-muted">Performant & structured logic</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Live Demonstrations</div>
              <div className="text-[11px] text-text-muted">Interactive live preview URLs</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Transparent Scoring</div>
              <div className="text-[11px] text-text-muted">Public vote + judge evaluation</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (CTAs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onExploreTrack}
          >
            Browse Software Track
          </Button>

          <Button
            variant="navy"
            size="lg"
            leftIcon={<Layers className="w-4 h-5" />}
            onClick={onRegisterProject}
          >
            Submit Software Project
          </Button>
        </div>
      </motion.div>

      {/* RIGHT SECTION: IDE Code Terminal Mockup & Icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex items-center justify-center lg:justify-end relative z-10"
      >
        <div className="relative w-full max-w-lg p-6 rounded-3xl bg-navy text-white shadow-2xl border border-white/10 overflow-hidden space-y-4">
          {/* Subtle Ambient Backdrop Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* IDE Window Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-[11px] font-mono font-bold text-white/70 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>app_server.py — Software Exhibition</span>
            </div>
            <div className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-mono font-bold">
              SOFT_001
            </div>
          </div>

          {/* Code Snippet / Terminal Content */}
          <div className="font-mono text-xs text-white/90 space-y-2.5 bg-black/30 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// NACOS Exhibition Software Core</span>
            </div>
            <p className="text-white/80">
              <span className="text-purple-400 font-bold">class</span> <span className="text-gold font-bold">SoftwareProject</span>(models.Model):
            </p>
            <p className="pl-4 text-white/70">
              title = models.CharField(max_length=255)
            </p>
            <p className="pl-4 text-white/70">
              track = <span className="text-emerald-400">'software'</span>
            </p>
            <p className="pl-4 text-white/70">
              live_url = models.URLField()
            </p>
            <div className="pl-4 pt-1 flex items-center gap-2 text-gold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>status: Ready for Live Evaluation</span>
            </div>
          </div>

          {/* Bottom Floating Tech Badges */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-primary flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-white/60 font-mono">
              Python • React • Node • SQL
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SoftwareSlide;
