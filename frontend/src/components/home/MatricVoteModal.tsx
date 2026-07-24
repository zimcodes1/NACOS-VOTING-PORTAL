import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "../ui";
import type { VoterState, Project } from "../../utils/dataTypes";
import { ShieldCheck, Lock, ThumbsUp, KeyRound, LogOut, Ticket, Eye, EyeOff } from "lucide-react";
import { verifyVoter } from "../../api/dashboardAPI";
import { voterSession, type VerifiedVoter } from "../../utils/voterSession";
import { Link } from "@tanstack/react-router";

interface MatricVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  voterState: VoterState;
  selectedProjectToVote?: Project | null;
  onVerify: (matricNumber: string, password?: string) => Promise<{ valid: boolean; error?: string; name?: string }>;
  onConfirmVote: (project: Project, matricNumber: string, password?: string) => void;
  onClearMatric?: () => void;
}

export const MatricVoteModal: React.FC<MatricVoteModalProps> = ({
  isOpen,
  onClose,
  selectedProjectToVote,
  onConfirmVote,
}) => {
  const [activeVoter, setActiveVoter] = useState<VerifiedVoter | null>(() => voterSession.getVerifiedVoter());

  const [matricInput, setMatricInput] = useState(() => activeVoter?.matric_number || "");
  const [passwordInput, setPasswordInput] = useState(() => activeVoter?.passcode || "");
  const [showPassword, setShowPassword] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Sync state during render when isOpen changes (official React pattern)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      const voter = voterSession.getVerifiedVoter();
      setActiveVoter(voter);
      if (voter) {
        setMatricInput(voter.matric_number);
        if (voter.passcode) setPasswordInput(voter.passcode);
      }
      setErrorText("");
    }
  }

  // Subscribe to external voter session changes (e.g. login / logout across tabs)
  useEffect(() => {
    const handleSessionChange = () => {
      const voter = voterSession.getVerifiedVoter();
      setActiveVoter(voter);
      if (voter) {
        setMatricInput(voter.matric_number);
        if (voter.passcode) setPasswordInput(voter.passcode);
      }
    };

    window.addEventListener("voter-session-changed", handleSessionChange);
    return () => {
      window.removeEventListener("voter-session-changed", handleSessionChange);
    };
  }, []);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const trimmedMatric = matricInput.trim().toUpperCase();
    const trimmedPass = passwordInput.trim();

    if (!trimmedMatric) {
      setErrorText("Please enter a valid NSUK matriculation number.");
      return;
    }

    if (!trimmedPass) {
      setErrorText("Please enter your voting passcode.");
      return;
    }

    setIsVerifying(true);
    const res = await verifyVoter(trimmedMatric, trimmedPass);
    setIsVerifying(false);

    if (!res.valid) {
      setErrorText(res.error || "Incorrect matriculation number or passcode.");
      return;
    }

    // Save to local device session
    const verifiedData: VerifiedVoter = {
      matric_number: res.matric_number || trimmedMatric,
      name: res.name || "Verified Voter",
      passcode: trimmedPass,
    };
    voterSession.setVerifiedVoter(verifiedData);
    setActiveVoter(verifiedData);

    if (selectedProjectToVote) {
      onConfirmVote(selectedProjectToVote, verifiedData.matric_number, trimmedPass);
      onClose();
    }
  };

  const handleLogoutVoter = () => {
    voterSession.clearVerifiedVoter();
    setActiveVoter(null);
    setMatricInput("");
    setPasswordInput("");
    setErrorText("");
  };

  const avatarInitial = voterSession.getVoterInitial(activeVoter?.name);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedProjectToVote ? "Confirm Your Vote" : "Voter Authentication"}
      description="Each verified student with a valid passcode is entitled to 1 vote per project category."
    >
      <div className="space-y-5 pt-2">
        {/* Selected Project Confirmation Callout */}
        {selectedProjectToVote && (
          <div className="p-4 rounded-xl bg-primary-light/50 border border-primary/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                Voting For Target Project
              </span>
              <span className="font-mono text-xs font-bold text-navy">
                {selectedProjectToVote.registration_code}
              </span>
            </div>
            <h4 className="text-sm font-extrabold text-navy">
              {selectedProjectToVote.title}
            </h4>
            <p className="text-xs text-text-secondary">
              Category: <strong className="text-navy">{selectedProjectToVote.category_name}</strong>
            </p>
          </div>
        )}

        {/* Verification Status View */}
        {activeVoter ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* User Avatar Circle generated from username initial */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-cyan-500 text-white font-black text-base border border-white flex items-center justify-center shadow-sm uppercase shrink-0">
                    {avatarInitial}
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-navy leading-none">
                      {activeVoter.name || "Verified Voter"}
                    </div>
                    <div className="text-xs font-mono font-bold text-primary mt-1">
                      {activeVoter.matric_number}
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-extrabold border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-text-muted">Device Session: Active</span>
                <button
                  type="button"
                  onClick={handleLogoutVoter}
                  className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Log out
                </button>
              </div>
            </div>

            {selectedProjectToVote ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<ThumbsUp className="w-4 h-4" />}
                onClick={() => {
                  onConfirmVote(selectedProjectToVote, activeVoter.matric_number, activeVoter.passcode);
                  onClose();
                }}
              >
                Confirm & Cast Vote
              </Button>
            ) : (
              <div className="p-3 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                You are verified! Select any project on the discovery grid to cast your vote.
              </div>
            )}
          </div>
        ) : (
          /* Form for Entering Matric Number & Passcode */
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <Input
              label="Matriculation Number"
              placeholder="e.g. FT24CMP0123"
              value={matricInput}
              onChange={(e) => setMatricInput(e.target.value)}
              helperText="Enter your official NSUK department matric number"
              error={errorText}
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              autoFocus
            />

            <Input
              label="Voting Passcode"
              type={showPassword ? "text" : "password"}
              placeholder="Enter passcode"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              helperText="Enter your seat reservation passcode"
              leftIcon={<KeyRound className="w-4 h-4 text-text-muted" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-text-muted hover:text-navy transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="pt-1 flex items-center justify-between text-xs">
              <Link to="/reserve" onClick={onClose} className="text-primary hover:underline font-bold flex items-center gap-1">
                <Ticket className="w-3.5 h-3.5" /> Reserve seat & get passcode
              </Link>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="md" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                isLoading={isVerifying}
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              >
                {selectedProjectToVote ? "Verify & Vote" : "Verify Passcode"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default MatricVoteModal;
