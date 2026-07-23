import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  Ticket,
  User,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  KeyRound,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Input, Button, Card, ToastContainer, toast } from "../components/ui";
import { reserveSeat, verifyVoter } from "../api/dashboardAPI";
import { voterSession } from "../utils/voterSession";
import { useCountdown, RESERVATION_DEADLINE_TEXT } from "../hooks/useCountdown";

export const ReserveSeatPage: React.FC = () => {
  const navigate = useNavigate();
  const { days, hours, minutes, seconds, isTimeUp } = useCountdown();

  const [isExistingMode, setIsExistingMode] = useState(false);

  // Reservation form state
  const [name, setName] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reservedSuccess, setReservedSuccess] = useState(false);

  // Check if voter is already saved in session
  const currentVoter = voterSession.getVerifiedVoter();

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isTimeUp && !isExistingMode) {
      setErrorMessage(`Seat reservations ended on ${RESERVATION_DEADLINE_TEXT}. New reservations are closed.`);
      return;
    }

    const cleanName = name.trim();
    const cleanMatric = matricNumber.trim().toUpperCase();
    const cleanPass = password.trim();

    if (!cleanMatric) {
      setErrorMessage("Matriculation number is required.");
      return;
    }

    if (!cleanPass) {
      setErrorMessage("A voting passcode is required to secure your vote.");
      return;
    }

    if (!isExistingMode) {
      if (!cleanName) {
        setErrorMessage("Please enter your full name for seat reservation.");
        return;
      }

      if (cleanPass !== confirmPassword.trim()) {
        setErrorMessage("Passcodes do not match. Please re-enter your passcode.");
        return;
      }
    }

    setIsLoading(true);

    if (isExistingMode) {
      // Sign in / Verify existing voter passcode
      const res = await verifyVoter(cleanMatric, cleanPass);
      setIsLoading(false);

      if (res.valid) {
        const voterName = res.name || cleanName || "Verified Voter";
        voterSession.setVerifiedVoter({
          matric_number: res.matric_number || cleanMatric,
          name: voterName,
          passcode: cleanPass,
        });
        toast.success("Voter Verification Successful!", {
          description: `Welcome back, ${voterName}! You can now vote freely across categories.`,
        });
        setReservedSuccess(true);
      } else {
        setErrorMessage(res.error || "Incorrect passcode for this matric number.");
      }
    } else {
      // Create new seat reservation
      const res = await reserveSeat({
        matric_number: cleanMatric,
        name: cleanName,
        password: cleanPass,
      });
      setIsLoading(false);

      if (res.success) {
        voterSession.setVerifiedVoter({
          matric_number: res.matric_number || cleanMatric,
          name: res.name || cleanName,
          passcode: cleanPass,
        });
        toast.success("Seat Reservation Confirmed!", {
          description: `Your voting seat and passcode have been registered for NACOS Exhibition 2026.`,
        });
        setReservedSuccess(true);
      } else {
        setErrorMessage(res.error || "Failed to confirm seat reservation.");
      }
    }
  };

  const activeVoter = voterSession.getVerifiedVoter();
  const avatarInitial = voterSession.getVoterInitial(activeVoter?.name || name);

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans relative selection:bg-primary-light selection:text-primary">
      <ToastContainer />

      {/* Top Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-border p-1 flex items-center justify-center shadow-xs">
              <img src="/images/nacos-logo.png" alt="NACOS" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-navy text-sm tracking-tight block">NACOS NSUK</span>
              <span className="text-[10px] font-bold text-primary block leading-none">Exhibition 2026</span>
            </div>
          </Link>

          <Link to="/home">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Back to Exhibition
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* CLEAN MINIMAL LIVE COUNTDOWN CARD: White Container, Black Text, Border */}
        <div className="w-full max-w-xl">
          <Card variant="surface" className="p-6 rounded-2xl text-center space-y-3 border border-border bg-surface text-navy shadow-xs">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-mono font-bold">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>RESERVATION DEADLINE: AUG 6, 9:00 AM</span>
              </span>
            </div>

            {!isTimeUp ? (
              <div className="space-y-2">
                <h2 className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Time Remaining to Reserve Seat
                </h2>

                {/* Clean Stat Box Numbers */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-2xl sm:text-3xl font-black text-navy font-mono">{String(days).padStart(2, "0")}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase mt-0.5">Days</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-2xl sm:text-3xl font-black text-navy font-mono">{String(hours).padStart(2, "0")}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase mt-0.5">Hours</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-2xl sm:text-3xl font-black text-navy font-mono">{String(minutes).padStart(2, "0")}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase mt-0.5">Mins</div>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border">
                    <div className="text-2xl sm:text-3xl font-black text-navy font-mono">{String(seconds).padStart(2, "0")}</div>
                    <div className="text-[10px] text-text-muted font-bold uppercase mt-0.5">Secs</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>Time's Up! Seat reservations closed on August 6, 2026 at 09:00 AM.</span>
              </div>
            )}
          </Card>
        </div>

        <div className="w-full max-w-xl">
          {reservedSuccess || currentVoter ? (
            /* Reserved Pass Ticket Badge View */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="surface" className="p-6 sm:p-8 rounded-2xl border border-border bg-surface text-navy shadow-sm space-y-6 text-center">
                {/* Top Status */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-mono font-extrabold mx-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>OFFICIAL VOTER PASS • VERIFIED</span>
                </div>

                {/* User Avatar Circle */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-cyan-500 border border-border shadow-xs flex items-center justify-center text-2xl font-black text-white mx-auto uppercase">
                  {avatarInitial}
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-navy">
                    {activeVoter?.name || name || "Verified Voter"}
                  </h2>
                  <p className="text-xs font-mono text-primary font-bold">
                    {activeVoter?.matric_number || matricNumber.toUpperCase()}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-background border border-border text-xs text-text-secondary space-y-2 max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed & Verified
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Voting Passcode:</span>
                    <span className="text-navy font-mono font-bold">••••••••</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => navigate({ to: "/home" })}
                  >
                    Proceed to Exhibition & Vote
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    className="text-text-secondary hover:text-navy"
                    onClick={() => {
                      voterSession.clearVerifiedVoter();
                      setReservedSuccess(false);
                    }}
                  >
                    Switch Account / Logout
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : isTimeUp && !isExistingMode ? (
            /* Time's Up Screen for New Reservations */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card variant="surface" className="p-6 sm:p-8 rounded-2xl border border-red-500/20 bg-surface text-center space-y-5 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 flex items-center justify-center mx-auto">
                  <Clock className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold text-navy tracking-tight">
                    Seat Reservations Are Officially Closed
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    The seat reservation period for NACOS Exhibition 2026 ended on <strong className="text-navy">{RESERVATION_DEADLINE_TEXT}</strong>. New seat registrations are no longer accepted.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setIsExistingMode(true);
                      setErrorMessage("");
                    }}
                    leftIcon={<KeyRound className="w-4 h-4" />}
                  >
                    Verify Existing Passcode
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate({ to: "/home" })}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Explore Exhibition Dashboard
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            /* Reservation Form Card */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Card variant="surface" className="p-6 sm:p-8 rounded-2xl border border-border bg-surface text-navy shadow-xs space-y-6">
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-extrabold text-primary">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>EXHIBITION SEAT RESERVATION</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-navy tracking-tight">
                    {isExistingMode ? "Verify Voter Passcode" : "Reserve Your Exhibition Seat"}
                  </h1>

                  <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                    {isExistingMode
                      ? "Enter your matriculation number and passcode to restore your verified voter session."
                      : "Register your seat to get your official voter passcode for NACOS Software Exhibition 2026."}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-semibold leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleReservationSubmit} className="space-y-4">
                  {!isExistingMode && (
                    <Input
                      label="Full Student Name"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leftIcon={<User className="w-4 h-4 text-text-muted" />}
                      required
                    />
                  )}

                  <Input
                    label="Matriculation Number"
                    placeholder="e.g. FT24CMP0123"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    helperText="Official NSUK department matric number"
                    leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                    required
                  />

                  <Input
                    label={isExistingMode ? "Voting Passcode" : "Create Voting Passcode"}
                    type="password"
                    placeholder="Enter passcode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText={isExistingMode ? undefined : "Protects your vote across multiple devices"}
                    leftIcon={<KeyRound className="w-4 h-4 text-text-muted" />}
                    required
                  />

                  {!isExistingMode && (
                    <Input
                      label="Confirm Passcode"
                      type="password"
                      placeholder="Re-enter passcode"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      leftIcon={<KeyRound className="w-4 h-4 text-text-muted" />}
                      required
                    />
                  )}

                  <div className="pt-2">
                    <Button
                      variant={isTimeUp && !isExistingMode ? "outline" : "primary"}
                      size="lg"
                      type="submit"
                      fullWidth
                      disabled={isTimeUp && !isExistingMode}
                      isLoading={isLoading}
                      leftIcon={<Sparkles className="w-4 h-4" />}
                      className={isTimeUp && !isExistingMode ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
                    >
                      {isExistingMode
                        ? "Verify & Log In"
                        : isTimeUp
                        ? "Reservations Closed (Aug 6, 9:00 AM)"
                        : "Confirm Seat Reservation"}
                    </Button>
                  </div>
                </form>

                <div className="pt-4 border-t border-border text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsExistingMode(!isExistingMode);
                      setErrorMessage("");
                    }}
                    className="text-xs font-bold text-primary hover:underline cursor-pointer"
                  >
                    {isExistingMode
                      ? "Need to reserve a seat? Create a new seat reservation"
                      : "Already reserved your seat? Verify your passcode here"}
                  </button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReserveSeatPage;
