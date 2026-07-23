export interface VerifiedVoter {
  matric_number: string;
  name: string;
  passcode?: string;
}

const STORAGE_KEY = "nacos_verified_voter";

export const voterSession = {
  getVerifiedVoter(): VerifiedVoter | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as VerifiedVoter;
    } catch {
      return null;
    }
  },

  setVerifiedVoter(voter: VerifiedVoter): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(voter));
      // Dispatch custom storage event so components re-render instantly across tabs/views
      window.dispatchEvent(new Event("voter-session-changed"));
    } catch (err) {
      console.warn("Failed to save voter session to localStorage", err);
    }
  },

  clearVerifiedVoter(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event("voter-session-changed"));
    } catch (err) {
      console.warn("Failed to clear voter session", err);
    }
  },

  isVoterVerified(): boolean {
    return this.getVerifiedVoter() !== null;
  },

  getVoterInitial(name?: string): string {
    if (!name) return "V";
    const clean = name.trim();
    return clean ? clean.charAt(0).toUpperCase() : "V";
  },
};

export default voterSession;
