import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Layers, Bot, Wand2, Sparkles, Cpu, Zap, CheckCircle2 } from "lucide-react";
import { Text, Button, Badge } from "../../ui";

export interface AISlideProps {
  onExploreTrack: () => void;
  onRegisterProject: () => void;
}

export const AISlide: React.FC<AISlideProps> = ({
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
        <Badge variant="success" className="py-2 bg-emerald-500/10 text-emerald-600 border-emerald-500/30" icon={<BrainCircuit className="w-4 h-4 text-emerald-600" />}>
          Track 03 — AI Prompting & Generative Media
        </Badge>

        {/* Main Track Headline */}
        <div className="space-y-2">
          <Text variant="h1" color="navy" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Pioneer the Frontier of <span className="text-emerald-500">Generative AI</span>
          </Text>
          <Text variant="subtitle" color="secondary" className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
            Unleash AI-driven innovation — prompt engineering, synthetic art compositions, LLM agent workflows, and generative design tools. Judged on prompt complexity, coherence, and technical technique.
          </Text>
        </div>

        {/* Highlight Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Prompt Architecture</div>
              <div className="text-[11px] text-text-muted">Structured System & Multi-turn Prompts</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Generative Art & Media</div>
              <div className="text-[11px] text-text-muted">AI-rendered graphics & synthetic media</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">AI Tool Integration</div>
              <div className="text-[11px] text-text-muted">Gemini, Midjourney, Stable Diffusion</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Live Audience Standings</div>
              <div className="text-[11px] text-text-muted">Real-time public voting leaderboard</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (CTAs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 w-full sm:w-auto">
          <Button
            variant="success"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onExploreTrack}
          >
            Discover AI Creations
          </Button>

          <Button
            variant="navy"
            size="lg"
            leftIcon={<Layers className="w-4 h-5" />}
            onClick={onRegisterProject}
          >
            Submit AI Entry
          </Button>
        </div>
      </motion.div>

      {/* RIGHT SECTION: Futuristic AI Cyber Terminal Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex items-center justify-center lg:justify-end relative z-10"
      >
        <div className="relative w-full max-w-lg p-6 rounded-3xl bg-emerald-950 text-white shadow-2xl border border-emerald-500/30 overflow-hidden space-y-4">
          {/* Subtle Ambient Emerald & Cyber Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* AI Terminal Bar */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-white/90">Generative AI Showcase</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
              AI_001
            </div>
          </div>

          {/* AI Prompt Snippet & Matrix Output */}
          <div className="font-mono text-xs text-white/90 space-y-2.5 bg-black/40 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Wand2 className="w-3.5 h-3.5" />
              <span>// Generative Prompt Parameters</span>
            </div>
            <p className="text-white/80">
              <span className="text-teal-300 font-bold">prompt:</span> <span className="text-emerald-200">"Futuristic NACOS tech campus, hyper-detailed, octane render 8k --v 6.0"</span>
            </p>
            <p className="text-white/70">
              <span className="text-purple-300 font-bold">model:</span> Gemini 1.5 Pro / Stable Diffusion XL
            </p>
            <div className="pt-1 flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Coherence Score: 9.8/10 • Generation Ready</span>
            </div>
          </div>

          {/* AI Icons Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-teal-300 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-white/60 font-mono">
              Gemini • Midjourney • Diffusion • LLM
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AISlide;
