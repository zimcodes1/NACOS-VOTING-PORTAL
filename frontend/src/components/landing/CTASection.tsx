import React from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BarChart3, Ticket, Sparkles, ArrowRight, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { Button, Badge } from "../ui";
import { useCountdown, RESERVATION_DEADLINE_TEXT } from "../../hooks/useCountdown";

export const CTASection: React.FC = () => {
  const { days, hours, minutes, seconds, isTimeUp } = useCountdown();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-navy p-8 sm:p-12 border border-border/40 shadow-2xl space-y-8"
      >
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text Information */}
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
                NACOS NSUK Exhibition 2026
              </Badge>
              {!isTimeUp ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  Seat Reservation Countdown (Ends Aug 6, 9:00 AM)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 backdrop-blur-md">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Reservations Closed
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {!isTimeUp ? "Reserve Your Exhibition Seat Before Time Runs Out!" : "Seat Reservations Are Officially Closed"}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {!isTimeUp
                ? `Lock in your voting passcode before reservations end on ${RESERVATION_DEADLINE_TEXT}.`
                : "The reservation window has ended for the 2026 NACOS Exhibition. Registered voters can proceed to the live dashboard."}
            </p>
          </div>

          {/* Right Action Buttons & Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full lg:w-auto">
            <Link to="/home" className="w-full sm:w-auto">
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

            {!isTimeUp ? (
              <Link to="/reserve" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  fullWidth
                  leftIcon={<Ticket className="w-5 h-5" />}
                >
                  Reserve Exhibition Seat
                </Button>
              </Link>
            ) : (
              <Button
                variant="gold"
                size="lg"
                fullWidth
                disabled
                leftIcon={<Clock className="w-5 h-5" />}
                className="opacity-50 cursor-not-allowed pointer-events-none border-gray-600 bg-gray-800 text-gray-400"
              >
                Reservations Closed
              </Button>
            )}
          </div>
        </div>

        {/* BOLD LARGE LIVE COUNTDOWN TIMER BLOCK */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <div className="text-center lg:text-left space-y-3">
            <span className="text-xs font-mono font-extrabold text-gold tracking-widest uppercase block">
              {!isTimeUp ? "TIME REMAINING UNTIL RESERVATION DEADLINE (AUG 6, 9:00 AM)" : "EXHIBITION RESERVATION STATUS"}
            </span>

            {!isTimeUp ? (
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto lg:mx-0">
                {/* Days */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center shadow-lg backdrop-blur-md">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
                    {String(days).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">Days</div>
                </div>

                {/* Hours */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center shadow-lg backdrop-blur-md">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-gold font-mono tracking-tight">
                    {String(hours).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">Hours</div>
                </div>

                {/* Minutes */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center shadow-lg backdrop-blur-md">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-cyan-400 font-mono tracking-tight">
                    {String(minutes).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">Mins</div>
                </div>

                {/* Seconds */}
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 text-center shadow-lg backdrop-blur-md">
                  <div className="text-2xl sm:text-4xl md:text-5xl font-black text-emerald-400 font-mono tracking-tight">
                    {String(seconds).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mt-1">Secs</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-extrabold flex items-center justify-center lg:justify-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Time's Up! Reservations closed on August 6, 2026 at 09:00 AM.</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
