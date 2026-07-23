import React from "react";
import { motion } from "framer-motion";
import { Palette, ArrowRight, Layers, PenTool, Sparkles, Image, Layout, Eye, Star } from "lucide-react";
import { Text, Button, Badge } from "../../ui";

export interface GraphicSlideProps {
  onExploreTrack: () => void;
  onRegisterProject: () => void;
}

export const GraphicSlide: React.FC<GraphicSlideProps> = ({
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
        <Badge variant="gold" className="py-2 bg-gold/10 text-gold-dark border-gold/30" icon={<Palette className="w-4 h-4 text-gold" />}>
          Track 02 — Graphic Design & Visual Arts
        </Badge>

        {/* Main Track Headline */}
        <div className="space-y-2">
          <Text variant="h1" color="navy" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Craft Stunning <span className="text-gold">Visual Identities</span>
          </Text>
          <Text variant="subtitle" color="secondary" className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
            Celebrate graphic design mastery — brand identity systems, poster graphics, vector digital art, and UI/UX visual prototypes. Judged on typography, color theory, and concept execution.
          </Text>
        </div>

        {/* Highlight Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-1">
          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark shrink-0">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Brand & Identity</div>
              <div className="text-[11px] text-text-muted">Logos, branding & design systems</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark shrink-0">
              <Image className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">Posters & Typography</div>
              <div className="text-[11px] text-text-muted">High-impact print & digital media</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark shrink-0">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">UI/UX Wireframes</div>
              <div className="text-[11px] text-text-muted">Interactive app & web prototypes</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/70 backdrop-blur-md border border-border/80 flex items-start gap-3 shadow-xs">
            <div className="p-2 rounded-xl bg-gold/15 text-gold-dark shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-navy">High-Res Gallery</div>
              <div className="text-[11px] text-text-muted">Public exhibition card view</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (CTAs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 w-full sm:w-auto">
          <Button
            variant="gold"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onExploreTrack}
          >
            Explore Design Track
          </Button>

          <Button
            variant="navy"
            size="lg"
            leftIcon={<Layers className="w-4 h-5" />}
            onClick={onRegisterProject}
          >
            Submit Design Project
          </Button>
        </div>
      </motion.div>

      {/* RIGHT SECTION: Creative Studio Design Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex items-center justify-center lg:justify-end relative z-10"
      >
        <div className="relative w-full max-w-lg p-6 rounded-3xl bg-slate-900 text-white shadow-2xl border border-gold/20 overflow-hidden space-y-4">
          {/* Subtle Ambient Gold & Purple Glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Design Studio Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-gold" />
              <span className="text-xs font-bold text-white/90">Design Exhibition Canvas</span>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-mono font-bold border border-gold/30">
              GRAP_001
            </div>
          </div>

          {/* Color Palette Swatches Preview */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-white/80">
              <span>Curated Palette & Brand Assets</span>
              <div className="flex items-center gap-1 text-gold">
                <Star className="w-3.5 h-3.5 fill-gold" />
                <span className="text-[10px]">Judged on Aesthetics</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <div className="h-10 rounded-xl bg-amber-400 flex items-center justify-center text-[10px] font-bold text-slate-900">#F59E0B</div>
              <div className="h-10 rounded-xl bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">#8B5CF6</div>
              <div className="h-10 rounded-xl bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-slate-900">#34D399</div>
              <div className="h-10 rounded-xl bg-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-900">#38BDF8</div>
              <div className="h-10 rounded-xl bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white">#EC4899</div>
            </div>
          </div>

          {/* Design Icons Footer */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-white/10 text-gold flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-purple-400 flex items-center justify-center">
                <PenTool className="w-5 h-5" />
              </div>
              <div className="p-2 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <span className="text-[11px] font-bold text-white/60 font-mono">
              Figma • Illustrator • Photoshop • Vector
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GraphicSlide;
