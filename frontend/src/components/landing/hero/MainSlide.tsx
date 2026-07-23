import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Layers, ArrowDownLeft, CodeXml } from "lucide-react";
import { Text, Button, Badge } from "../../ui";

export interface MainSlideProps {
  activeProjectsCount: number;
  verifiedVotersCount: number;
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
}

export const MainSlide: React.FC<MainSlideProps> = ({
  activeProjectsCount,
  verifiedVotersCount,
  onNavigateHome,
  onNavigateRegister,
}) => {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
      {/* LEFT SECTION: Main Headline, Byline, CTAs & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-start text-left space-y-6 max-w-xl z-10"
      >
        {/* Top Event Badge */}
        <Badge variant="primary" className="py-2" icon={<Sparkles className="w-3.5 h-3.5" />}>
          NACOS Software Exhibition 2026
        </Badge>

        {/* Main Headline */}
        <div className="space-y-2">
          <Text variant="h1" color="navy" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
            Showcase & Discover <span className="text-primary">Software Innovations</span>
          </Text>
          <Text variant="subtitle" color="secondary" className="text-base sm:text-lg text-text-secondary leading-relaxed pt-2">
            Empowering computing students to present ground-breaking software & graphic design entries with real-time transparent audience voting and expert judging.
          </Text>
        </div>

        {/* Action Buttons (CTAs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 w-full sm:w-auto">
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onNavigateHome}
          >
            Reserve Your Seat
          </Button>

          <Button
            variant="navy"
            size="lg"
            leftIcon={<Layers className="w-4 h-5" />}
            onClick={onNavigateRegister}
          >
            Register Exhibition Project
          </Button>
        </div>

        {/* Live Stats */}
        <div className="pt-6 border-t border-border/75 grid grid-cols-3 gap-6 w-full">
          <div>
            <Text variant="h3" color="navy" weight="extrabold">{activeProjectsCount}+</Text>
            <Text variant="caption" color="muted">Active Projects</Text>
          </div>

          <div>
            <Text variant="h3" color="primary" weight="extrabold">{verifiedVotersCount.toLocaleString()}+</Text>
            <Text variant="caption" color="muted">Verified Voters</Text>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <Text variant="h3" color="gold" weight="extrabold">100%</Text>
            </div>
            <Text variant="caption" color="muted">Transparent Voting</Text>
          </div>
        </div>
      </motion.div>

      {/* RIGHT SECTION: 3 Image Layout with Decorative Floating Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex items-start justify-center lg:justify-end h-full relative z-10"
      >
        <div className="relative w-full max-w-lg aspect-[1.1] flex items-center justify-center">

          {/* Far Left Green Starburst Icon */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-3 top-1/3 z-21"
          >
            <svg className="w-6 h-6 text-[#589E78] fill-current" viewBox="0 0 24 24">
              <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
            </svg>
          </motion.div>

          {/* Top-Right Purple Dot */}
          <div className="absolute top-2 right-12 w-4 h-4 rounded-full bg-[#B69DF8] z-0 opacity-80" />

          {/* Main Grid: 2 Columns */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full h-fit items-center">

            {/* Left Column: Image 1 & Image 3 */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Image 1 Container */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-20 flex justify-center items-center w-full aspect-[4/4.5] rounded-[2.2rem] bg-[#89D5E8] group"
              >
                <img
                  src="/images/student-1.png"
                  alt="NACOS Student Innovator 1"
                  className="w-full h-full object-cover object-center rounded-[1.9rem] transition-transform duration-300"
                />

                <div className="absolute -top-5 -right-5 w-13 h-13 rounded-full bg-[#9DE5F4] border-5 border-background flex items-center justify-center text-[#1E7898] z-20">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
              </motion.div>

              {/* Image 3 Container */}
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative w-[120%] border-15 border-background z-10 h-50 aspect-4/4.5 rounded-[2.2rem] group overflow-hidden"
              >
                <img
                  src="/images/student-3.png"
                  alt="NACOS Student Innovator 3"
                  className="w-full h-full object-cover object-center transition-transform duration-300"
                />
              </motion.div>
            </div>

            {/* Right Column: Image 2 */}
            <div className="flex flex-col justify-center ml-0">
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative flex justify-center items-center w-full aspect-[4/4.8] rounded-[2.2rem] bg-[#B69DF8] group my-auto"
              >
                <img
                  src="/images/student-2.png"
                  alt="NACOS Student Innovator 2"
                  className="w-full h-full object-cover object-center rounded-[1.9rem] transition-transform duration-300"
                />
              </motion.div>
            </div>
          </div>

          {/* Floating Overlapping Rings Purple Pill */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[38%] top-[52%] -translate-y-1/2 z-30 px-7 py-3 rounded-4xl bg-[#B69DF8] border-8 border-background flex items-center justify-center"
          >
            <svg className="w-12 h-5 text-white" viewBox="0 0 80 30" fill="none">
              <circle cx="15" cy="15" r="11" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="30" cy="15" r="11" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="45" cy="15" r="11" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="60" cy="15" r="11" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </motion.div>

          {/* Bottom Right Green Starburst */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-14 -bottom-1 z-20"
          >
            <svg className="w-5 h-5 text-[#589E78] fill-current" viewBox="0 0 24 24">
              <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
            </svg>
          </motion.div>

          {/* Bottom Right Cyan Dot */}
          <div className="absolute right-6 bottom-4 w-7 h-7 rounded-full bg-[#89D5E8] z-10 opacity-90" />
        </div>
      </motion.div>

      {/* Decorative Code Watermark */}
      <div className="absolute z-0 top-1/11 right-70 text-green-500/10 pointer-events-none hidden sm:block">
        <CodeXml size={400} />
      </div>
    </div>
  );
};

export default MainSlide;
