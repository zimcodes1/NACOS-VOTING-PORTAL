import { useEffect } from "react";
import { motion } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
  minDuration?: number;
}

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Preloader({
  onComplete,
  minDuration = 1800,
}: PreloaderProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, minDuration);
    return () => clearTimeout(t);
  }, [minDuration, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Animated ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 96 96"
        >
          <circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            stroke="#E2E8E4"
            strokeWidth="4"
          />
          <motion.circle
            cx="48"
            cy="48"
            r={RADIUS}
            fill="none"
            stroke="#0D8554"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: minDuration / 1000, ease: "easeInOut" }}
          />
        </svg>

        {/* Logo */}
        <img src="/images/nacos-logo.png" width={36} height={36} alt="" />
      </div>
    </motion.div>
  );
}