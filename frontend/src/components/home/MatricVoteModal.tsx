import React, { useState } from "react";
import { Modal, Input, Button } from "../ui";
import type { VoterState, Project } from "../../utils/dataTypes";
import { ShieldCheck, Lock, ThumbsUp } from "lucide-react";

interface MatricVoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  voterState: VoterState;
  selectedProjectToVote?: Project | null;
  onVerify: (matricNumber: string) => Promise<{ valid: boolean; error?: string }>;
  onConfirmVote: (project: Project, matricNumber: string) => void;
  onClearMatric: () => void;
}

export const MatricVoteModal: React.FC<MatricVoteModalProps> = ({
  isOpen,
  onClose,
  voterState,
  selectedProjectToVote,
  onVerify,
  onConfirmVote,
}) => {
  const [matricInput, setMatricInput] = useState(
    voterState.matricNumber || ""
  );
  const [errorText, setErrorText] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const trimmed = matricInput.trim().toUpperCase();
    if (!trimmed) {
      setErrorText("Please enter a valid NSUK matriculation number.");
      return;
    }

    setIsVerifying(true);
    const res = await onVerify(trimmed);
    setIsVerifying(false);

    let isValid = false;
    let errorMsg = "Invalid matric number format. E.g., FT24CMP0123";

    if (typeof res === "object") {
      isValid = res.valid;
      if (res.error) errorMsg = res.error;
    } else {
      isValid = res;
    }

    if (!isValid) {
      setErrorText(errorMsg);
      return;
    }

    if (selectedProjectToVote) {
      onConfirmVote(selectedProjectToVote, trimmed);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedProjectToVote ? "Confirm Your Vote" : "Voter Matriculation Verification"}
      description="Each verified student is entitled to 1 vote per project category."
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

        {/* Verification Status */}
        {voterState.isVerified && voterState.matricNumber ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success-bg border border-success/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-success text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-success">
                    Verified Voter Matric Number
                  </div>
                  <div className="text-sm font-mono font-bold text-navy">
                    {voterState.matricNumber}
                  </div>
                </div>
              </div>
            </div>

            {selectedProjectToVote ? (
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<ThumbsUp className="w-4 h-4" />}
                onClick={() => {
                  onConfirmVote(selectedProjectToVote, voterState.matricNumber!);
                  onClose();
                }}
              >
                Confirm & Cast Vote
              </Button>
            ) : (
              <div className="p-3 rounded-xl bg-background border border-border text-center text-xs text-text-muted">
                You are ready to vote! Select any project on the discovery grid and click "Vote".
              </div>
            )}
          </div>
        ) : (
          /* Form for Entering Matric Number */
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <Input
              label="Matriculation Number"
              placeholder="e.g. FT24CYS0002"
              value={matricInput}
              onChange={(e) => setMatricInput(e.target.value)}
              helperText="Enter your official NSUK department matric number"
              error={errorText}
              leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
              autoFocus
            />

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
                {selectedProjectToVote ? "Verify & Vote" : "Verify Matric"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
